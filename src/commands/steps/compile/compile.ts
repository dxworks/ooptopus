import $ from "@david/dax";
import {green, red} from "@std/fmt/colors";

export async function compileJava(
    sourcePath: string | string[],
    outputDir: string,
): Promise<boolean> {
    try {
        const junitLibsDir =
            "C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\libs";

        await $`javac -cp ${junitLibsDir}/* -d ${outputDir} ${sourcePath}`
            .printCommand().stderr(Deno.stdout).text();

        console.log(green("✅ Compilation successful."));
        return true;
    } catch (error: any) {
        console.log(red("❌ Compilation failed."));
        console.log((error as any).stderr || error);
        throw new Error("Compilation failed.");
    }
}
