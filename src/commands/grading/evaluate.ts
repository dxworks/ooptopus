import {yellow} from "@std/fmt/colors";
import {ClassEvaluation, GradingSchema, TestResults} from "./evaluating.model.ts";

export function evaluateAll(
    classEvaluations: ClassEvaluation[],
    didCompile: boolean,
    gradingSchema: GradingSchema,
    testResults?: TestResults[],
) {
    let totalPoints = 0;
    let earnedPoints = 0;

    // 1) Compilation
    totalPoints += gradingSchema.compilation;
    let compilePoints = didCompile ? gradingSchema.compilation : 0;
    earnedPoints += compilePoints;
    console.log(yellow(`Compilation ${didCompile ? "✅" : "❌"} --- ${compilePoints}/${gradingSchema.compilation} points`));

    // 2) Evaluate each class based on the grading schema
    for (const className in gradingSchema.classes) {
        const gradingClass = gradingSchema.classes[className];
        const clsEval = classEvaluations.find(cls => cls.name === className);

        console.log(yellow(`\n--- Evaluating class "${className}" ---`));

        // Class Name
        if (gradingClass.name !== 0 || gradingClass.extends !== 0 || gradingClass.implements !== 0) {
            totalPoints += gradingClass.name;
            let namePoints = clsEval?.nameCorrect ? gradingClass.name : 0;
            earnedPoints += namePoints;
            console.log(yellow(
                `Class name correctness: ${clsEval?.nameCorrect ? "✅" : "❌"} -- ${namePoints}/${gradingClass.name} points`
            ));

            // Class Extends
            totalPoints += gradingClass.extends;
            let extendsPoints = clsEval?.extendsCorrect ? gradingClass.extends : 0;
            earnedPoints += extendsPoints;
            console.log(yellow(
                `Extends correctness: ${clsEval?.extendsCorrect ? "✅" : "❌"} -- ${extendsPoints}/${gradingClass.extends} points`
            ));

            // Class Implements
            totalPoints += gradingClass.implements;
            let implementsPoints = clsEval?.implementsCorrect ? gradingClass.implements : 0;
            earnedPoints += implementsPoints;
            console.log(yellow(
                `Implements correctness: ${clsEval?.implementsCorrect ? "✅" : "❌"} -- ${implementsPoints}/${gradingClass.implements} points`
            ));
        }

        // 3) Fields by ID
        if (gradingClass.fields) {
            console.log(yellow(`\nFields:`));
            for (const fieldName in gradingClass.fields) {
                const fieldSchema = gradingClass.fields[fieldName];
                const fieldEval = clsEval?.fieldsCorrect.find(field => field.id === fieldName);

                const fieldTotal = fieldSchema.name + fieldSchema.type + fieldSchema.modifiers;
                totalPoints += fieldTotal;

                let fieldScore = 0;
                // Name Check
                let nameScore = fieldEval?.correctName ? fieldSchema.name : 0;
                fieldScore += nameScore;
                console.log(yellow(`  - Field Name "${fieldName}": ${nameScore}/${fieldSchema.name} points`));

                // Type Check
                let typeScore = fieldEval?.correctType ? fieldSchema.type : 0;
                fieldScore += typeScore;
                console.log(yellow(`  - Field Type "${fieldName}": ${typeScore}/${fieldSchema.type} points`));

                // Modifiers Check
                let modifiersScore = fieldEval?.correctModifiers ? fieldSchema.modifiers : 0;
                fieldScore += modifiersScore;
                console.log(yellow(`  - Field Modifiers "${fieldName}": ${modifiersScore}/${fieldSchema.modifiers} points`));

                earnedPoints += fieldScore;
                console.log(yellow(`- Field "${fieldName}" => ${fieldScore}/${fieldTotal} points`));
            }
        }

        // 4) Methods by ID
        console.log(yellow(`\nMethods:`));
        for (const methodName in gradingClass.methods) {
            const methodSchema = gradingClass.methods[methodName];
            const methodEval = clsEval?.methodsCorrect.find(method => method.id === methodName);

            const methodBaseTotal = methodSchema.name
                + methodSchema.params
                + methodSchema.returnType
                + methodSchema.modifiers
                + methodSchema.exceptions;

            let methodPoints = 0;

            // Name Check
            let nameScore = methodEval?.correctName ? methodSchema.name : 0;
            methodPoints += nameScore;
            if (methodSchema.name !== 0) {
                console.log(yellow(`  - Method Name "${methodName}": ${nameScore}/${methodSchema.name} points`));
            }

            // Parameters Check
            let paramsScore = methodEval?.correctParams ? methodSchema.params : 0;
            methodPoints += paramsScore;
            if (methodSchema.params !== 0) {
                console.log(yellow(`  - Method Params "${methodName}": ${paramsScore}/${methodSchema.params} points`));
            }

            // Return Type Check
            let returnTypeScore = methodEval?.correctReturnType ? methodSchema.returnType : 0;
            methodPoints += returnTypeScore;
            if (methodSchema.returnType !== 0) {
                console.log(yellow(`  - Return Type "${methodName}": ${returnTypeScore}/${methodSchema.returnType} points`));
            }

            // Modifiers Check
            let modifiersScore = methodEval?.correctModifiers ? methodSchema.modifiers : 0;
            methodPoints += modifiersScore;
            if (methodSchema.modifiers !== 0) {
                console.log(yellow(`  - Modifiers "${methodName}": ${modifiersScore}/${methodSchema.modifiers} points`));
            }

            // Exceptions Check
            let exceptionsScore = methodEval?.correctExceptions ? methodSchema.exceptions : 0;
            methodPoints += exceptionsScore;
            if (methodSchema.exceptions !== 0) {
                console.log(yellow(`  - Exceptions "${methodName}": ${exceptionsScore}/${methodSchema.exceptions} points`));
            }


            // Test Results
            let testPoints = 0;
            let testTotal = 0;
            if (methodSchema.tests) {
                for (const testName in methodSchema.tests) {
                    const testScore = methodSchema.tests[testName];
                    testTotal += testScore;
                    const testResult = testResults?.find(test => test.name === testName);
                    console.log(yellow(`    - Test "${testName}"`));
                    if (testResult?.passed) {
                        testPoints += testScore;
                    }
                    console.log(yellow(`    - Test "${testName}": ${testResult?.passed ? "✅" : "❌"} = ${testPoints}/${testScore} points`));
                }
                methodPoints += testPoints;
                totalPoints += testTotal;
            }

            totalPoints += methodBaseTotal;
            earnedPoints += methodPoints;

            console.log(yellow(`- Method "${methodName}" => ${methodPoints}/${methodBaseTotal + testTotal} points`));
        }

        // 5) Constructors by ID
        console.log(yellow(`\nConstructors:`));
        for (const ctorName in gradingClass.constructors) {
            const ctorSchema = gradingClass.constructors[ctorName];
            const ctorEval = clsEval?.constructorsCorrect.find(ctor => ctor.id === ctorName);

            const ctorMax = ctorSchema.name + ctorSchema.params;
            totalPoints += ctorMax;

            let ctorScore = 0;
            // Name Check
            let nameScore = ctorEval?.correctName ? ctorSchema.name : 0;
            ctorScore += nameScore;
            if (ctorSchema.name !== 0) {
                console.log(yellow(`  - Constructor Name "${ctorName}": ${nameScore}/${ctorSchema.name} points`));
            }

            // Parameters Check
            let paramsScore = ctorEval?.correctParams ? ctorSchema.params : 0;
            ctorScore += paramsScore;
            if (ctorSchema.params !== 0) {
                console.log(yellow(`  - Constructor Params "${ctorName}": ${paramsScore}/${ctorSchema.params} points`));
            }

            earnedPoints += ctorScore;
            console.log(yellow(`- Constructor "${ctorName}" => ${ctorScore}/${ctorMax} points`));
        }
    }

    // 6) Final Score Calculation
    const finalScore = (earnedPoints / totalPoints) * 100;
    console.log(yellow(`\nCalculating total: ${earnedPoints} earned/${totalPoints} total * 100 points`));
    return Math.round(finalScore);
}
