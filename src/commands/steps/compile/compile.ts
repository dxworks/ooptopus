import $ from "@david/dax";
import {green, red} from "@std/fmt/colors";

async function checkJavaVersion(): Promise<void> {
    try {
        const {code, stderr} = await $`java -version`.stderr("piped").stdout("piped",).noThrow();
        if (code !== 0) {
            throw new Error(
                `Java is not installed or not accessible. Error: ${stderr}`,
            );
        }
        console.log(green(`Java version detected: ${stderr.trim()}`));
    } catch (error) {
        console.log(red("❌ Java is not installed or not properly configured."));
        throw error;
    }
}

export async function compileJava(
    sourcePath: string | string[],
    outputDir: string,
): Promise<boolean> {
    try {
        await checkJavaVersion();
        const junitLibsDir =
            "C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\libs";

        await $`javac -cp ${junitLibsDir}/* -d ${outputDir} ${sourcePath}`.printCommand().stderr(Deno.stdout).text();


        console.log(green("✅ Compilation successful."));
        return true;
    } catch (error: any) {
        console.log(red("❌ Compilation failed."));
        console.log((error as any).stderr || error);
        throw new Error("Compilation failed.");
    }
}
