import $ from "@david/dax";
import { green, red } from "@std/fmt/colors";
import { TestResults } from "../../grading/evaluating.model.ts";

export async function runJUnitTests(testFile: string, outputDir: string): Promise<TestResults> {
    try {
        const junitLibsDir = "C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\libs";
        // const output = await $`java -cp ${outputDir};${junitLibsDir}/* org.junit.platform.console.ConsoleLauncher --class-path ${outputDir} --scan-classpath`.stderr(Deno.stdout).text();
        const output = await $`java -jar ${junitLibsDir}/junit-platform-console-standalone-1.11.3.jar --classpath ${outputDir} --scan-classpath --details=verbose`.noThrow().stderr(Deno.stdout).text();


        // console.log(green('✅ JUnit tests passed.'));
        // console.log(output);

        // return true;


        let totalTests = 0;
        let failedTests = 0;

        const lines = output.split('\n');
        let allTestsPassed = true;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('??') && line.includes('()')) {
                const testName = line.substring(line.indexOf('??')).split('(')[0].trim();
                
                let statusLine = '';
                for (let j = i + 1; j < lines.length; j++) {
                    if (lines[j].includes('status:')) {
                        statusLine = lines[j];
                        break;
                    }
                }
                
                if (statusLine.includes('SUCCESSFUL')) {
                    console.log(green(`✅ Test passed: ${testName}`));
                } else if (statusLine.includes('FAILED')) {
                    console.log(red(`❌ Test failed: ${testName}`));
                    allTestsPassed = false;
                }
            }
        }

        const testsFoundLine = lines.find(line => line.includes('tests found'));
        const testsFailedLine = lines.find(line => line.includes('tests failed'));
        
        if (testsFoundLine && testsFailedLine) {
            totalTests = parseInt(testsFoundLine.match(/\d+/)?.[0] || '0');
            failedTests = parseInt(testsFailedLine.match(/\d+/)?.[0] || '0');
            
            if (failedTests === 0) {
                console.log(green(`\n✅ All ${totalTests} tests passed!`));
            } else {
                console.log(red(`\n❌ ${failedTests} out of ${totalTests} tests failed.`));
            }
        }

        return {total: totalTests, passed: totalTests - failedTests};


    } catch (error) {
        console.error(red("❌ Error while running JUnit tests."), error);
        return {total: 0, passed: 0};
    }
}
