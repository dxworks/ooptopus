import $ from "@david/dax";
import { green, red } from "@std/fmt/colors";
import {TestResults} from "../../grading/evaluating.model.ts";

export async function runJUnitTests(
  testFile: string,
  outputDir: string,
): Promise<Record<string, TestResults>> {
  const resultsMap: Record<string, TestResults> = {};
  const processedTests = new Set<string>();

  try {
    const junitLibsDir = "C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\libs";
    const output = await $`java -jar ${junitLibsDir}/junit-platform-console-standalone-1.11.3.jar --classpath ${outputDir} --scan-classpath --details=verbose`.noThrow().stderr(Deno.stdout).text();


    const lines = output.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Example: Use a pattern to detect test method lines.
      // Suppose the test line looks like "testAddNumbers()" or "testAddNumbers()" in the output.
      // We'll capture the method name before "()".
      const match = line.match(/(?<testName>test\w+)\(\)/);
      if (match?.groups?.testName) {
        const testName = match.groups.testName;

        if (processedTests.has(testName)) {
            continue;
          }
          processedTests.add(testName);

        if (!resultsMap[testName]) {
          resultsMap[testName] = { total: 0, passed: 0 };
        }
        resultsMap[testName].total++;

        let statusLine = "";
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].includes("status:")) {
            statusLine = lines[j];
            break;
          }
        }

        if (statusLine.includes("SUCCESSFUL")) {
          console.log(green(`✅ Test passed: ${testName}`));
          resultsMap[testName].passed++;
        } else if (statusLine.includes("FAILED")) {
          console.log(red(`❌ Test failed: ${testName}`));
        }
      }
    }

    let grandTotal = 0;
    let grandPassed = 0;
    for (const [testName, { total, passed }] of Object.entries(resultsMap)) {
      grandTotal += total;
      grandPassed += passed;
    }
    if (grandTotal > 0) {
      if (grandPassed === grandTotal) {
        console.log(green(`\n✅ All ${grandPassed}/${grandTotal} tests passed.`));
      } else {
        console.log(red(`\n❌ ${grandTotal - grandPassed} out of ${grandTotal} tests failed.`));
      }
    } else {
      console.log(red("No test methods found or no matches in output."));
    }
    return resultsMap;

  } catch (error) {
    console.error(red("❌ Error while running JUnit tests."), error);
    return {};
  }
}
