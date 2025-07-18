import { parseArgs } from "@std/cli/parse-args";
import { bgWhite, blue, red } from "@std/fmt/colors";
import { compileJava } from "./commands/steps/compile/compile.ts";
import { verifyStructure } from "./commands/steps/structure/structure.ts";
import { extractJavaStructure } from "./commands/steps/structure/extract-structure-command.ts";
import { runJUnitTests } from "./commands/steps/tests/test.ts";
import { evaluateAll } from "./commands/grading/evaluate.ts";
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
  alias: { source: "s", test: "t", grading: "g", batch: "b", "expected-structure": "e" },
  stopEarly: true,
});

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
    if (args["expected-structure"] && typeof args["expected-structure"] === "string") {
      expectedStructure = await loadExpectedStructure(args["expected-structure"]);
      if (!expectedStructure) {
        console.error(red("Failed to load expected structure. Exiting."));
        Deno.exit(1);
      }
    } else {
      console.error(red("Expected structure file not provided. Please use --expected-structure parameter."));
      Deno.exit(1);
    }

    let gradingSchema;
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
    if (!args.source) {
      console.error(red("Source file not provided."));
      Deno.exit(1);
    }

    const outputPath = "./assets/expected-structure/ExpectedStructure.json";
    const structure = await extractJavaStructure(
      args.source as string,
      outputPath,
    );

    if (!structure) {
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
  try {
    await compileJava(sourcePath, "./out");
  } catch (err) {
    const errorMessage = String(err);
    console.error(red(`Compilation failed: ${errorMessage}`));
    if (generateIndividualCSV) {
      console.log(blue(`\n🎉🎉🎉 Final Score: 10/100 🎉🎉🎉`));
      console.log(red("Note: Score reflects compilation failure"));
      return 10;
    }
    // In batch mode, just return the metrics object without any additional processing
    return {
      totalScore: 10,
      classes: []
    };
  }

  // Only proceed with the rest of the processing if compilation succeeded
  let studentSolution = "";
  try {
    studentSolution = await Deno.readTextFile(sourcePath);
  } catch (err) {
    console.error(red(`Failed to read student solution: ${err}`));
  }

  const { classEvaluations: classEvals, interfaceEvaluations: interfaceEvals } = verifyStructure(sourcePath, expectedStructure);

  if (!args["expected-structure"]) {
    console.error(red("Expected structure path not provided."));
    Deno.exit(1);
  }
  const expectedStructureCsvPath = args["expected-structure"].replace(".json", ".csv");
  await runAssistant(sourcePath, expectedStructureCsvPath, args.batch);

  let testResults = undefined;
  if (testPath) {
    console.log(blue(`\nRunning tests...`));
    try {
      await compileJava(
        [sourcePath, testPath, "assets/TestHelper.java"],
        "./out",
      );
      testResults = await runJUnitTests("./out", testPath);
    } catch (err) {
      const errorMessage = String(err);
      console.error(red(`Test run failed: ${errorMessage}`));
    }
  }

  const metrics = evaluateAll(
    classEvals,
    interfaceEvals,
    true,
    gradingSchema,
    generateIndividualCSV,
    sourcePath,
    testResults,
    studentSolution,
  );
  if (generateIndividualCSV) {
    console.log(blue(`\n🎉🎉🎉 Final Score: ${metrics}/100 🎉🎉🎉`));
  }
  return metrics;
}
