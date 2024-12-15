import $ from "@david/dax";
import { green, red } from "@std/fmt/colors";

export async function runJUnitTests(testFile: string, outputDir: string): Promise<boolean> {
    try {
        const junitLibsDir = "C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\libs";
        // const output = await $`java -cp ${outputDir};${junitLibsDir}/* org.junit.platform.console.ConsoleLauncher --class-path ${outputDir} --scan-classpath`.stderr(Deno.stdout).text();
        const output = await $`java -jar ${junitLibsDir}/junit-platform-console-standalone-1.11.3.jar --classpath ${outputDir} --scan-classpath`.stderr(Deno.stdout).text();


        console.log(green('✅ JUnit tests passed.'));
        console.log(output);

        return true;
    } catch (error) {
        console.error(red("❌ Error while running JUnit tests."), error);
        return false;
    }
}
