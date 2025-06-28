import $ from "@david/dax";
import { green, red } from "@std/fmt/colors";
import { TestResults } from "../../grading/evaluating.model.ts";

export async function runJUnitTests(
    outputDir: string,
    testPath: string,
): Promise<TestResults[]> {
  const testResults: TestResults[] = [];
  const processedTests = new Set<string>();

  try {
    const junitLibsDir =
        "C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\libs";

    // Get test class name from file path
    const testFileName = testPath.split(/[/\\]/).pop()?.replace('.java', '');
    if (!testFileName) {
      throw new Error("Could not determine test class name from path");
    }

    const output =
        await $`java -jar ${junitLibsDir}/junit-platform-console-standalone-1.11.3.jar --classpath ${outputDir} --select-class=${testFileName} --details=verbose`
            .noThrow().stderr(Deno.stdout).text();

    const lines = output.split("\n");
    let currentTestName = "";
    let currentTestStatus = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for test method name
      const testMatch = line.match(/uniqueId:.*method:(?<testName>[\w$]+)\(\)/);
      if (testMatch?.groups?.testName) {
        currentTestName = testMatch.groups.testName;
        continue;
      }

      // Look for test status
      if (line.includes("status:")) {
        currentTestStatus = line;
        if (currentTestName && !processedTests.has(currentTestName)) {
          processedTests.add(currentTestName);
          const passed = currentTestStatus.includes("SUCCESSFUL");
          testResults.push({ name: currentTestName, passed });

          if (passed) {
            console.log(green(`✅ Test passed: ${currentTestName}`));
          } else {
            console.log(red(`❌ Test failed: ${currentTestName}`));
          }
        }
      }
    }

    return testResults;
  } catch (error) {
    console.error(red("❌ Error while running JUnit tests."), error);
    return [];
  }
}
