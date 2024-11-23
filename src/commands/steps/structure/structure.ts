import {ExpectedStructure} from "./structure-types.ts";
import {parse} from "java-parser"
import {JavaStructureVisitor} from "./java-structure-visitor.ts";


function arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    sortedArr1.every((value, index) => {
        value === sortedArr2[index]
    });
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

export async function verifyStructure(sourcePath: string, expectedStructure: ExpectedStructure): Promise<boolean> {

    const decoder = new TextDecoder("utf-8");
    const code = decoder.decode(Deno.readFileSync(sourcePath));
    const cst = parse(code);

    const visitor = new JavaStructureVisitor();
    visitor.visit(cst);

    const extractedClasses = visitor.structure.classes;

    for (const expectedClass of expectedStructure.classes) {
        const extractedClass = extractedClasses.find(cls => cls.name === expectedClass.name);
        if (!extractedClass) {
            console.error(`❌ Class "${expectedClass.name}" not found.`);
            return false;
        } else {
            console.log(`✅ Class "${expectedClass.name}" found.`);
        }

        if (expectedClass.fields) {
            for (const expectedField of expectedClass.fields) {
                if (!extractedClass.fields?.some(field => field.name === expectedField.name && field.type === expectedField.type && arraysEqual(field.modifiers, expectedField.modifiers))) {
                    console.error(`Field '${expectedField.name}' of type '${expectedField.type}' not found in class '${expectedClass.name}'.`);
                    return false;
                } else {
                    console.log(`✅ Field '${expectedField.name}' of type '${expectedField.type}' having the '${JSON.stringify(expectedField.modifiers)} modifiers found in class '${expectedClass.name}'.`);
                }
            }
        }

        if (expectedClass.methods) {
            for (const expectedMethod of expectedClass.methods) {
                if (!extractedClass.methods?.some(method =>
                    method.name === expectedMethod.name &&
                    method.returnType === expectedMethod.returnType &&
                    JSON.stringify(method.parameters) === JSON.stringify(expectedMethod.parameters)
                )) {
                    console.error(`Method '${expectedMethod.name}' not found in class '${expectedClass.name}'.`);
                    return false;
                }
            }
        }
    }

    return true;
}
