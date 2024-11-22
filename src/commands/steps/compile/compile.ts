import $ from "@david/dax";
import { green, red } from "@std/fmt/colors";

export async function compileJava(sourcePath: string, outputDir: string): Promise<boolean> {
    try {
        const output = await $`javac -d ${outputDir} ${sourcePath}`.stderr(Deno.stdout).text();

        console.log(green('✅ Compilation successful.'))
        // console.log(output)
        // console.log(output.stdoutBytes.toString())
        // console.error(red(output.stderrBytes.toString()))
        return true;
    } catch (error: any) {
        console.log(red('❌ Compilation failed.'))
        // console.log((error as any).stderr || error)
        return false;
    }
}
