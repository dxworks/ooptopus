import { blue, green, red } from "@std/fmt/colors";
import { JavaStructure } from "./structure-types.ts";
import { extractStructure } from "./extract-structure.ts";

function generateStructureCSV(structure: JavaStructure): { mapping: string, fallback: string } {
    const mappingRows: string[] = [];
    const fallbackRows: string[] = [];
    
    for (const cls of structure.classes) {
        mappingRows.push(`${cls.name},<student class name>,class`);
        fallbackRows.push(`${cls.name},${cls.name},class`);
        
        if (cls.methods) {
            for (const method of cls.methods) {
                mappingRows.push(`${cls.name}.${method.name},<student method name>,method`);
                fallbackRows.push(`${cls.name}.${method.name},${method.name},method`);
            }
        }
        
        if (cls.fields) {
            for (const field of cls.fields) {
                mappingRows.push(`${cls.name}.${field.name},<student variable name>,variable`);
                fallbackRows.push(`${cls.name}.${field.name},${field.name},variable`);
            }
        }
    }
    
    for (const intf of structure.interfaces) {
        mappingRows.push(`${intf.name},<student interface name>,interface`);
        fallbackRows.push(`${intf.name},${intf.name},interface`);
        
        if (intf.methods) {
            for (const method of intf.methods) {
                mappingRows.push(`${intf.name}.${method.name},<student method name>,method`);
                fallbackRows.push(`${intf.name}.${method.name},${method.name},method`);
            }
        }
        
        if (intf.constants) {
            for (const constant of intf.constants) {
                mappingRows.push(`${intf.name}.${constant.name},<student constant name>,constant`);
                fallbackRows.push(`${intf.name}.${constant.name},${constant.name},constant`);
            }
        }
    }
    
    return {
        mapping: mappingRows.join('\n'),
        fallback: fallbackRows.join('\n')
    };
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
                
                const fileName = outputPath.split('/')
                    .pop()?.replace('.json', '') || 'structure';
                const jsonPath = `${baseDir}/${fileName}.json`;
                const csvPath = `${baseDir}/${fileName}.csv`;
                const fallbackCsvPath = `${baseDir}/${fileName}.fallback.csv`;
                
                await Deno.writeTextFile(jsonPath, JSON.stringify(structure, null, 2));
                console.log(green(`✅ Structure saved to ${jsonPath}`));
                
                const { mapping, fallback } = generateStructureCSV(structure);
                await Deno.writeTextFile(csvPath, mapping);
                console.log(green(`✅ Structure CSV saved to ${csvPath}`));
                await Deno.writeTextFile(fallbackCsvPath, fallback);
                console.log(green(`✅ Structure fallback CSV saved to ${fallbackCsvPath}`));


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
