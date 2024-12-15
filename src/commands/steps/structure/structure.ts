import {JavaStructure} from "./structure-types.ts";
import {parse} from "java-parser"
import {JavaStructureVisitor} from "./java-structure-visitor.ts";
import {blue, green, red} from "@std/fmt/colors";


function arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    sortedArr1.every((value, index) => {
        value === sortedArr2[index]
    });
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

export async function verifyStructure(sourcePath: string, expectedStructure: JavaStructure): Promise<boolean> {

    const decoder = new TextDecoder("utf-8");
    const code = decoder.decode(Deno.readFileSync(sourcePath));
    const cst = parse(code);

    const visitor = new JavaStructureVisitor();
    visitor.visit(cst);

    const extractedClasses = visitor.structure.classes;

    for (const expectedClass of expectedStructure.classes) {
        console.log(blue(`\nChecking class "${expectedClass.name}"...`));
        const extractedClass = extractedClasses.find(cls => cls.name === expectedClass.name);
        if (!extractedClass) {
            console.error(red(`❌ Class "${expectedClass.name}" not found.`));
        } else {
            console.log(green(`✅ Class "${expectedClass.name}" found.`));
        }

        if (expectedClass.extends) {
            if (extractedClass?.extends === expectedClass.extends) {
                console.log(`✅ Class '${expectedClass.name}' correctly extends '${expectedClass.extends}'.`);
            } else {
                console.error(`❌ Class '${expectedClass.name}' extends mismatch: expected '${expectedClass.extends}', found '${extractedClass?.extends}'.`);
            }
        }

        if (expectedClass.implements) {
            const implementsMatch = arraysEqual(extractedClass?.implements || [], expectedClass.implements);
            if (implementsMatch) {
                console.log(`✅ Class '${expectedClass.name}' correctly implements '${expectedClass.implements.join(", ")}'.`);
            } else {
                console.error(`❌ Class '${expectedClass.name}' implements mismatch: expected '${expectedClass.implements.join(", ")}', found '${(extractedClass?.implements || []).join(", ")}'.`);
            }
        }

        if (expectedClass.constructors) {
            for (const expectedConstructor of expectedClass.constructors) {
                const matchingConstructor = extractedClass?.constructors?.find(constructor =>
                    constructor.name === expectedConstructor.name &&
                    JSON.stringify(constructor.parameters) === JSON.stringify(expectedConstructor.parameters)
                );

                if (!matchingConstructor) {
                    console.error(`❌ Constructor '${expectedConstructor.name}' with parameters '${JSON.stringify(expectedConstructor.parameters)}' not found in class '${expectedClass.name}'. 🚫`);
                } else {
                    console.log(`✅ Constructor '${expectedConstructor.name}' with parameters '${JSON.stringify(expectedConstructor.parameters)}' found in class '${expectedClass.name}'.`);
                }
            }
        }

        if (expectedClass.fields) {
            for (const expectedField of expectedClass.fields) {
                const matchingField = extractedClass?.fields?.find(field => field.name === expectedField.name);

                if (!matchingField) {
                    console.error(`❌ Field '${expectedField.name}' not found in class '${expectedClass.name}'.`);
                    continue;
                }

                let isCorrect = true;

                if (matchingField.name === expectedField.name) {
                    console.log(`✅ Field name '${matchingField.name}' is correct.`);
                } else {
                    console.error(`❌ Field name mismatch: expected '${expectedField.name}', found '${matchingField.name}'.`);
                    isCorrect = false;
                }

                if (matchingField.type === expectedField.type) {
                    console.log(`✅ Field type for '${expectedField.name}' is correct: '${matchingField.type}'.`);
                } else {
                    console.error(`❌ Field type mismatch for '${expectedField.name}': expected '${expectedField.type}', found '${matchingField.type}'.`);
                    isCorrect = false;
                }

                if (arraysEqual(matchingField.modifiers, expectedField.modifiers)) {
                    console.log(`✅ Field modifiers for '${expectedField.name}' are correct: '${JSON.stringify(expectedField.modifiers)}'.`);
                } else {
                    console.error(`❌ Field modifiers mismatch for '${expectedField.name}': expected '${JSON.stringify(expectedField.modifiers)}', found '${JSON.stringify(matchingField.modifiers)}'.`);
                    isCorrect = false;
                }

                if (isCorrect) {
                    console.log(`🎉 All checks passed for field '${expectedField.name}' in class '${expectedClass.name}'. 🎉`);
                } else {
                    console.error(`🚩 Some checks failed for field '${expectedField.name}' in class '${expectedClass.name}'.`);
                }
            }
        }

        if (expectedClass.methods) {
            for (const expectedMethod of expectedClass.methods) {
                const matchingMethods = extractedClass?.methods?.filter(method =>
                    method.name === expectedMethod.name
                );

                if (!matchingMethods || matchingMethods.length === 0) {
                    console.error(`❌ Method '${expectedMethod.name}' not found in class '${expectedClass.name}'. 🚫`);
                    continue;
                }

                const parameterMatch = matchingMethods.some(method =>
                    JSON.stringify(method.parameters) === JSON.stringify(expectedMethod.parameters)
                );

                if (!parameterMatch) {
                    console.error(`❌ Parameter mismatch for method '${expectedMethod.name}' in class '${expectedClass.name}'. Expected parameters: '${JSON.stringify(expectedMethod.parameters)}'.`);
                } else {
                    console.log(`✅ Method '${expectedMethod.name}' with parameters '${JSON.stringify(expectedMethod.parameters)}' found in class '${expectedClass.name}'.`);
                }
            }
        }
    }


    return true;
}
