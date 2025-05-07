import { blue, green, red } from "@std/fmt/colors";
import { JavaStructure } from "./structure-types.ts";
import { extractStructure } from "./extract-structure.ts";

export async function extractJavaStructure(sourcePath: string, outputPath?: string): Promise<JavaStructure | null> {
    console.log(blue(`\nExtracting structure from "${sourcePath}"...`));
    
    try {
        const structure = await extractStructure(sourcePath);
        console.log(blue(`✅ Structure extracted successfully from ${sourcePath}.`));
        
        if (outputPath) {
            try {
                try {
                    await Deno.mkdir(new URL('.', 'file://' + outputPath).pathname, { recursive: true });
                } catch (err) {
                    if (!(err instanceof Deno.errors.AlreadyExists)) {
                        throw err;
                    }
                }
                
                await Deno.writeTextFile(outputPath, JSON.stringify(structure, null, 2));
                console.log(green(`✅ Structure saved to ${outputPath}`));
            } catch (writeError: unknown) {
                const errorMessage = writeError instanceof Error ? writeError.message : String(writeError);
                console.error(red(`❌ Failed to save structure to file: ${errorMessage}`));
            }
        }
        
        return structure;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(red(`❌ Failed to extract structure from ${sourcePath}: ${errorMessage}`));
        return null;
    }
} 