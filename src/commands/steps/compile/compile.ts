import $ from "@david/dax";
import { green, red } from "@std/fmt/colors";

export async function compileJava(sourcePath: string, outputDir: string): Promise<boolean> {
    try {
        const junitLibsDir = "C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\libs";
        const output = await $`javac -cp ${junitLibsDir}/* -d ${outputDir} ${sourcePath}`.stderr(Deno.stdout).text();

        console.log(green('✅ Compilation successful.'));
        return true;
    } catch (error: any) {
        console.log(red('❌ Compilation failed.'));
        console.log((error as any).stderr || error)
        return false;
    }
}
