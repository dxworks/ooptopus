import { blue, green, red } from "@std/fmt/colors";
import { JavaStructure } from "./structure-types.ts";
import { extractStructure } from "./extract-structure.ts";

function generateStructureCSV(structure: JavaStructure): string {
    const rows: string[] = [];
    
    for (const cls of structure.classes) {
        rows.push(`${cls.name},<student class name>,class`);
        
        if (cls.methods) {
            for (const method of cls.methods) {
                rows.push(`${cls.name}.${method.name},<student method name>,method`);
            }
        }
        
        if (cls.fields) {
            for (const field of cls.fields) {
                rows.push(`${cls.name}.${field.name},<student variable name>,variable`);
            }
        }
    }
    
    return rows.join('\n');
}

export async function extractJavaStructure(sourcePath: string, outputPath?: string): Promise<JavaStructure | null> {
    console.log(blue(`\nExtracting structure from "${sourcePath}"...`));
    
    try {
        const structure = await extractStructure(sourcePath);
        console.log(blue(`✅ Structure extracted successfully from ${sourcePath}.`));
        
        if (outputPath) {
            try {
                const baseDir = './assets/expected-structure';
                try {
                    await Deno.mkdir(baseDir, { recursive: true });
                } catch (err) {
                    if (!(err instanceof Deno.errors.AlreadyExists)) {
                        throw err;
                    }
                }
                
                const fileName = outputPath.split('/').pop()?.replace('.json', '') || 'structure';
                const jsonPath = `${baseDir}/${fileName}.json`;
                const csvPath = `${baseDir}/${fileName}.csv`;
                
                await Deno.writeTextFile(jsonPath, JSON.stringify(structure, null, 2));
                console.log(green(`✅ Structure saved to ${jsonPath}`));
                
                const csvContent = generateStructureCSV(structure);
                await Deno.writeTextFile(csvPath, csvContent);
                console.log(green(`✅ Structure CSV saved to ${csvPath}`));
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