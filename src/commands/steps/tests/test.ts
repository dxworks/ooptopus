import $ from "@david/dax";
import { green, red } from "@std/fmt/colors";
import { TestResults } from "../../grading/evaluating.model.ts";

export async function runJUnitTests(
  testFile: string,
  outputDir: string,
): Promise<TestResults[]> {
  const testResults: TestResults[] = [];
  const processedTests = new Set<string>();

  try {
    const junitLibsDir = "C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\libs";
    const output = await $`java -jar ${junitLibsDir}/junit-platform-console-standalone-1.11.3.jar --classpath ${outputDir} --scan-classpath --details=verbose`.noThrow().stderr(Deno.stdout).text();


    const lines = output.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // console.log(line)

      // Example: Use a pattern to detect test method lines.
      // Suppose the test line looks like "testAddNumbers()" or "testAddNumbers()" in the output.
      // We'll capture the method name before "()".
      const match = line.match(/uniqueId:.*method:(?<testName>[\w$]+)\(\)/);
      if (match?.groups?.testName) {
        const testName = match.groups.testName;

        if (processedTests.has(testName)) {
            continue;
          }
          processedTests.add(testName);

        let statusLine = "";
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes("status:")) {
            statusLine = lines[j];
            break;
          }
        }

        const passed = statusLine.includes("SUCCESSFUL");
        testResults.push({ name: testName, passed });

        if (statusLine.includes("SUCCESSFUL")) {
          console.log(green(`✅ Test passed: ${testName}`));
        } else {
          console.log(red(`❌ Test failed: ${testName}`));
        }
      }
    }

    return testResults;

  } catch (error) {
    console.error(red("❌ Error while running JUnit tests."), error);
    return [];
  }
}
