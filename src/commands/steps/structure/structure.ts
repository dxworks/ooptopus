import {JavaStructure} from "./structure-types.ts";
import {parse} from "java-parser"
import {JavaStructureVisitor} from "./java-structure-visitor.ts";
import {blue, green, red} from "@std/fmt/colors";
import { ClassEvaluation, ConstructorEvaluation, FieldEvaluation, MethodEvaluation } from "../../grading/evaluating.model.ts";


function arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    sortedArr1.every((value, index) => {
        value === sortedArr2[index]
    });
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

function modifiersMatch(expectedModifiers: string[], actualModifiers: string[]) {
    const expectedSet = new Set(expectedModifiers || []);
    const actualSet = new Set(actualModifiers || []);

    // If "public" is expected but missing, ensure neither "private" nor "protected" are present
    if (expectedSet.has("public") && !actualSet.has("public")) {
        if (actualSet.has("private") || actualSet.has("protected")) {
            return false; // Invalid: "private" or "protected" conflicts with expected "public"
        }
    }

    // Remove "public" from comparison since it's already handled separately
    expectedSet.delete("public");
    actualSet.delete("public");

    // Ensure all other modifiers match exactly
    return JSON.stringify([...expectedSet].sort()) === JSON.stringify([...actualSet].sort());
}

export async function verifyStructure(sourcePath: string, expectedStructure: JavaStructure): Promise<ClassEvaluation[]> {

    const decoder = new TextDecoder("utf-8");
    const code = decoder.decode(Deno.readFileSync(sourcePath));
    const cst = parse(code);

    const visitor = new JavaStructureVisitor();
    visitor.visit(cst);

    const extractedClasses = visitor.structure.classes;
    const classEvaluations: ClassEvaluation[] = [];

    for (const expectedClass of expectedStructure.classes) {
        console.log(blue(`\nChecking class "${expectedClass.name}"...`));
        const extractedClass = extractedClasses.find(cls => cls.name === expectedClass.name);
        const classEvaluation: ClassEvaluation = {
            name: expectedClass.name,
            id: expectedClass.name,
            nameCorrect: false,
            extendsCorrect: false,
            implementsCorrect: false,
            fieldsCorrect: [],
            methodsCorrect: [],
            constructorsCorrect: []
        };
        classEvaluations.push(classEvaluation);
        if (!extractedClass) {
            console.error(red(`❌ Class "${expectedClass.name}" not found.`));
            classEvaluation.nameCorrect = false;
        } else {
            console.log(green(`✅ Class "${expectedClass.name}" found.`));
            classEvaluation.nameCorrect = true;
        }

        if (expectedClass.extends) {
            if (extractedClass?.extends === expectedClass.extends) {
                console.log(`✅ Class '${expectedClass.name}' correctly extends '${expectedClass.extends}'.`);
                classEvaluation.extendsCorrect = true;
            } else {
                console.error(`❌ Class '${expectedClass.name}' extends mismatch: expected '${expectedClass.extends}', found '${extractedClass?.extends}'.`);
                classEvaluation.extendsCorrect = false;
            }
        }

        if (expectedClass.implements) {
            const implementsMatch = arraysEqual(extractedClass?.implements || [], expectedClass.implements);
            if (implementsMatch) {
                console.log(`✅ Class '${expectedClass.name}' correctly implements '${expectedClass.implements.join(", ")}'.`);
                classEvaluation.implementsCorrect = true;
            } else {
                console.error(`❌ Class '${expectedClass.name}' implements mismatch: expected '${expectedClass.implements.join(", ")}', found '${(extractedClass?.implements || []).join(", ")}'.`);
                classEvaluation.implementsCorrect = false;
            }
        }

        if (expectedClass.constructors) {
            for (const expectedConstructor of expectedClass.constructors) {
                const constructorEval: ConstructorEvaluation = {
                    id: '',
                    correctName: false,
                    correctParams: false,
                  };

                const matchingConstructor = extractedClass?.constructors?.filter(constructor =>
                    constructor.name === expectedConstructor.name &&
                    JSON.stringify(constructor.parameters.map(p => p.type)) === JSON.stringify(expectedConstructor.parameters.map(p => p.type))
                );

                if (!matchingConstructor) {
                    console.error(`❌ Constructor '${expectedConstructor.name}' with parameters '${JSON.stringify(expectedConstructor.parameters)}' not found in class '${expectedClass.name}'. 🚫`);
                } else {
                    console.log(`✅ Constructor '${expectedConstructor.name}' with parameters '${JSON.stringify(expectedConstructor.parameters)}' found in class '${expectedClass.name}'.`);
                    constructorEval.correctName = true;
                    constructorEval.correctParams = true;
                }
                constructorEval.id = expectedConstructor.name + '(' +
                    expectedConstructor.parameters.map(param => `${param.type} ${param.name}`).join(', ') +
                    ')';
                classEvaluation.constructorsCorrect.push(constructorEval);
            }
        }

        if (expectedClass.fields) {
            for (const expectedField of expectedClass.fields) {
                const fieldEvaluation: FieldEvaluation = {
                    id: expectedField.name,
                    correctName: false,
                    correctType: false,
                    correctModifiers: false,
                  };
                const matchingField = extractedClass?.fields?.find(field => field.name === expectedField.name);

                if (!matchingField) {
                    console.error(`❌ Field '${expectedField.name}' not found in class '${expectedClass.name}'.`);
                    continue;
                }

                let isCorrect = true;

                if (matchingField.name === expectedField.name) {
                    console.log(`✅ Field name '${matchingField.name}' is correct.`);
                    fieldEvaluation.correctName = true;
                } else {
                    console.error(`❌ Field name mismatch: expected '${expectedField.name}', found '${matchingField.name}'.`);
                    isCorrect = false;
                }

                if (matchingField.type === expectedField.type) {
                    console.log(`✅ Field type for '${expectedField.name}' is correct: '${matchingField.type}'.`);
                    fieldEvaluation.correctType = true;
                } else {
                    console.error(`❌ Field type mismatch for '${expectedField.name}': expected '${expectedField.type}', found '${matchingField.type}'.`);
                    isCorrect = false;
                }

                if (arraysEqual(matchingField.modifiers, expectedField.modifiers)) {
                    console.log(`✅ Field modifiers for '${expectedField.name}' are correct: '${JSON.stringify(expectedField.modifiers)}'.`);
                    fieldEvaluation.correctModifiers = true;
                } else {
                    console.error(`❌ Field modifiers mismatch for '${expectedField.name}': expected '${JSON.stringify(expectedField.modifiers)}', found '${JSON.stringify(matchingField.modifiers)}'.`);
                    isCorrect = false;
                }

                if (isCorrect) {
                    console.log(`🎉 All checks passed for field '${expectedField.name}' in class '${expectedClass.name}'. 🎉`);
                } else {
                    console.error(`🚩 Some checks failed for field '${expectedField.name}' in class '${expectedClass.name}'.`);
                }
                classEvaluation.fieldsCorrect.push(fieldEvaluation);
            }
        }

        if (expectedClass.methods) {
            for (const expectedMethod of expectedClass.methods) {
                const methodEvaluation: MethodEvaluation = {
                    id: '',
                    methodName: '',
                    correctName: false,
                    correctParams: false,
                    correctReturnType: false,
                    correctModifiers: false,
                    correctExceptions: false,
                  };
                const matchingMethods = extractedClass?.methods?.filter(method =>
                    method.name === expectedMethod.name &&
                    JSON.stringify(method.parameters.map(p => p.type)) ===
                    JSON.stringify(expectedMethod.parameters.map(p => p.type))
                );

                if (!matchingMethods || matchingMethods.length === 0) {
                    console.error(`❌ Method '${expectedMethod.name}' not found in class '${expectedClass.name}'. 🚫`);
                    methodEvaluation.methodName = expectedMethod.name; 
                    continue;
                }

                console.log(`✅ Method '${expectedMethod.name}' with parameters '${JSON.stringify(expectedMethod.parameters)}' found in class '${expectedClass.name}'.`);

                methodEvaluation.methodName = expectedMethod.name;
                methodEvaluation.correctName = true;
                methodEvaluation.correctParams = true;

                const aMatch = matchingMethods[0];
                if (aMatch.returnType === expectedMethod.returnType) {
                    methodEvaluation.correctReturnType = true;
                    console.log(
                    `✅ Method '${expectedMethod.name}' return type is correct.`,
                    );
                } else {
                    console.error(
                    `❌ Method '${expectedMethod.name}' return type mismatch: expected '${expectedMethod.returnType}', found '${aMatch.returnType}'.`,
                    );
                }

                // if (arraysEqual(aMatch.modifiers, expectedMethod.modifiers || [])) {
                //     methodEvaluation.correctModifiers = true;
                //     console.log(
                //       `✅ Method '${expectedMethod.name}' modifiers are correct.`,
                //     );
                //   } else {
                //     console.error(
                //       `❌ Method '${expectedMethod.name}' modifiers mismatch: expected '${JSON.stringify(
                //         expectedMethod.modifiers,
                //       )}', found '${JSON.stringify(aMatch.modifiers)}'.`,
                //     );
                //   }

                if (modifiersMatch(expectedMethod.modifiers, aMatch.modifiers)) {
                    methodEvaluation.correctModifiers = true;
                    console.log(`✅ Method '${expectedMethod.name}' modifiers are correct.`);
                } else {
                    console.error(
                        `❌ Method '${expectedMethod.name}' modifiers mismatch: expected '${JSON.stringify(
                            expectedMethod.modifiers
                        )}', found '${JSON.stringify(aMatch.modifiers)}'.`
                    );
                }

                const exceptionMatch = matchingMethods.some(method =>
                    arraysEqual(method.exceptions, expectedMethod.exceptions || [])
                );

                if (!exceptionMatch) {
                    console.error(`❌ Exception mismatch for method '${expectedMethod.name}' in class '${expectedClass.name}'. Expected exceptions: '${JSON.stringify(expectedMethod.exceptions)}', Found exceptions: '${JSON.stringify(matchingMethods[0].exceptions)}'.`);
                } else if (expectedMethod.exceptions && expectedMethod.exceptions.length > 0) {
                    console.log(`✅ Method '${expectedMethod.name}' throws expected exceptions: '${JSON.stringify(expectedMethod.exceptions)}'.`);
                    methodEvaluation.correctExceptions = true;
                } else {
                    if (
                      (!expectedMethod.exceptions || expectedMethod.exceptions.length === 0) && aMatch.exceptions.length === 0) {
                      methodEvaluation.correctExceptions = true;
                    }
                }
                methodEvaluation.id = expectedMethod.name + '(' +
                    expectedMethod.parameters.map(param => `${param.type} ${param.name}`).join(', ') +
                    ')';
                classEvaluation.methodsCorrect.push(methodEvaluation);
            }
        }
    }


    return classEvaluations;
}
