import { parseArgs } from "@std/cli/parse-args";
import { bgWhite, blue, red } from "@std/fmt/colors";
import { compileJava } from "./commands/steps/compile/compile.ts";
import { verifyStructure } from "./commands/steps/structure/structure.ts";
import { extractJavaStructure } from "./commands/steps/structure/extract-structure-command.ts";
import { runJUnitTests } from "./commands/steps/tests/test.ts";
import { ClassEvaluation } from "./commands/grading/evaluating.model.ts";
import { evaluateAll } from "./commands/grading/evaluate.ts";
import defaultGrading from "../assets/defaultGrading.json" with {
  type: "json",
};
import { JavaStructure } from "./commands/steps/structure/structure-types.ts";
import {
  generateCombinedMetricsCSV,
  SolutionMetrics,
} from "./commands/grading/generateMetrics.ts";
import { walk } from "https://deno.land/std/fs/walk.ts";
import { runAssistant } from "./commands/steps/map/assisstant.ts";

const args = parseArgs(Deno.args, {
  string: ["source", "test", "grading", "expected-structure"],
  boolean: ["batch"],
  alias: {
    source: "s",
    test: "t",
    grading: "g",
    batch: "b",
    "expected-structure": "e",
  },
  stopEarly: true,
});

console.log(blue(bgWhite(JSON.stringify(args))));

async function loadExpectedStructure(
  filePath: string,
): Promise<JavaStructure | null> {
  try {
    const fileContent = await Deno.readTextFile(filePath);
    return JSON.parse(fileContent) as JavaStructure;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      red(
        `Failed to load expected structure from ${filePath}: ${errorMessage}`,
      ),
    );
    return null;
  }
}

if (args._) {
  if (args._.includes("evaluate")) {
    console.log(blue("Evaluating..."));
    if (!args.source) {
      console.error(red("Source file/directory not provided."));
      Deno.exit(1);
    }

    let expectedStructure: JavaStructure | null = null;
    if (
      args["expected-structure"] &&
      typeof args["expected-structure"] === "string"
    ) {
      expectedStructure = await loadExpectedStructure(
        args["expected-structure"],
      );
      if (!expectedStructure) {
        console.error(red("Failed to load expected structure. Exiting."));
        Deno.exit(1);
      }
    } else {
      console.error(
        red(
          "Expected structure file not provided. Please use --expected-structure parameter.",
        ),
      );
      Deno.exit(1);
    }

    let gradingSchema = defaultGrading;
    if (args.grading && typeof args.grading === "string") {
      try {
        const schemaContent = await Deno.readTextFile(args.grading);
        gradingSchema = JSON.parse(schemaContent);
        console.log(blue("Using custom grading schema."));
      } catch (err) {
        console.error(red(`Failed to load schema file: ${err}`));
      }
    }

    if (args.batch) {
      const allMetrics: { folderName: string; metrics: SolutionMetrics }[] = [];

      for await (const entry of walk(args.source, { maxDepth: 2 })) {
        if (entry.isFile && entry.name === "Solution.java") {
          const folderName = entry.path.split(/[/\\]/).slice(-2)[0];
          console.log(blue(`\nProcessing solution from ${folderName}...`));

          const metrics = await processSolution(
            entry.path,
            args.test,
            gradingSchema,
            false,
            expectedStructure,
          );
          if (metrics && typeof metrics !== "number") {
            allMetrics.push({ folderName, metrics });
          }
        }
      }

      generateCombinedMetricsCSV(allMetrics);
    } else {
      await processSolution(
        args.source,
        args.test,
        gradingSchema,
        true,
        expectedStructure,
      );
    }
  }

  if (args._.includes("extract-structure")) {
    console.log(blue("Extracting structure..."));
    if (!args.source) {
      console.error(red("Source file not provided."));
      Deno.exit(1);
    }

    const outputPath = "./assets/ExpectedStructure.json";

    const structure = await extractJavaStructure(
      args.source as string,
      outputPath,
    );
    if (structure) {
      console.log(JSON.stringify(structure, null, 2));
    } else {
      console.error(red("Failed to extract structure."));
      Deno.exit(1);
    }
  }
}

async function processSolution(
  sourcePath: string,
  testPath: string | undefined,
  gradingSchema: any,
  generateIndividualCSV: boolean,
  expectedStructure: JavaStructure,
): Promise<SolutionMetrics | number> {
  let compiledOK = false;
  try {
    await compileJava(sourcePath, "./out");
    compiledOK = true;
  } catch (err) {
    compiledOK = false;
    const errorMessage = String(err);
    console.error(red(`Compilation failed: ${errorMessage}`));
  }

  let classEvaluations: ClassEvaluation[];

  if (compiledOK) {
    classEvaluations = await verifyStructure(sourcePath, expectedStructure);
  } else {
    classEvaluations = returnEmptyClassEvaluations(expectedStructure);
  }

  await runAssistant(sourcePath);

  let testResults = undefined;
  if (testPath && compiledOK) {
    console.log(blue(`\nRunning tests...`));
    try {
      await compileJava(
        [sourcePath, testPath, "assets/TestHelper.java"],
        "./out",
      );
      testResults = await runJUnitTests("./out");
    } catch (err) {
      const errorMessage = String(err);
      console.error(red(`Test run failed: ${errorMessage}`));
    }
  }

  const metrics = evaluateAll(
    classEvaluations,
    compiledOK,
    gradingSchema,
    generateIndividualCSV,
    testResults,
  );
  if (generateIndividualCSV) {
    console.log(blue(`\n🎉🎉🎉 Final Score: ${metrics}/100 🎉🎉🎉`));
    if (!compiledOK) {
      console.log(
        red("Note: Score includes penalty for compilation failure (1/10)"),
      );
    }
  }
  return metrics;
}

function returnEmptyClassEvaluations(
  expectedStructure: JavaStructure,
): ClassEvaluation[] {
  return expectedStructure.classes.map((expectedClass) => ({
    name: expectedClass.name,
    id: expectedClass.name,
    nameCorrect: false,
    extendsCorrect: false,
    implementsCorrect: false,
    fieldsCorrect: expectedClass.fields?.map((field) => ({
      id: field.name,
      correctName: false,
      correctType: false,
      correctModifiers: false,
    })) || [],
    methodsCorrect: expectedClass.methods?.map((method) => ({
      id: method.name + "(" + method.parameters.map((param) =>
        param.type
      ).join(", ") + ")",
      methodName: method.name,
      correctName: false,
      correctParams: false,
      correctReturnType: false,
      correctModifiers: false,
      correctExceptions: false,
    })) || [],
    constructorsCorrect: expectedClass.constructors?.map((ctor) => ({
      id: ctor.name + "(" + ctor.parameters.map((param) =>
        param.type
      ).join(", ") + ")",
      correctName: false,
      correctParams: false,
    })) || [],
  }));
}
