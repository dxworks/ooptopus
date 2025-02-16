import {yellow} from "@std/fmt/colors";
import {ClassEvaluation, GradingSchema} from "./evaluating.model.ts";

export function evaluateAll(
    classEvaluations: ClassEvaluation[],
    didCompile: boolean,
    gradingSchema: GradingSchema,
): number {
  let totalPoints = 0;
  let earnedPoints = 0;

  // 1) Compilation
  totalPoints += gradingSchema.compilation;
  let compilePoints = 0;
  if (didCompile) {
    compilePoints = gradingSchema.compilation;
    earnedPoints += compilePoints;
  }
  console.log(yellow(`Compilation ${didCompile ? "✅" : "❌"} --- ${compilePoints}/${gradingSchema.compilation} points`));

  // 2) Evaluate each class
  for (const clsEval of classEvaluations) {
    console.log(yellow(`\n--- Evaluating class "${clsEval.name}" ---`));

    // A) Class Name
    totalPoints += gradingSchema.class.name;
    let namePoints = clsEval.nameCorrect ? gradingSchema.class.name : 0;
    earnedPoints += namePoints;
    console.log(yellow(
        `Class name correctness: ${clsEval.nameCorrect ? "✅" : "❌"} -- ${namePoints}/${gradingSchema.class.name} points`
    ));

    // B) Class Extends
    totalPoints += gradingSchema.class.extends;
    let extendsPoints = clsEval.extendsCorrect ? gradingSchema.class.extends : 0;
    earnedPoints += extendsPoints;
    console.log(yellow(
        `Extends correctness: ${clsEval.extendsCorrect ? "✅" : "❌"} -- ${extendsPoints}/${gradingSchema.class.extends} points`
    ));

    // C) Class Implements
    totalPoints += gradingSchema.class.implements;
    let implementsPoints = clsEval.implementsCorrect ? gradingSchema.class.implements : 0;
    earnedPoints += implementsPoints;
    console.log(yellow(
        `Implements correctness: ${clsEval.implementsCorrect ? "✅" : "❌"} -- ${implementsPoints}/${gradingSchema.class.implements} points`
    ));

    // 3) Fields
    console.log(yellow(`\nFields:`));
    for (const field of clsEval.fieldsCorrect) {
      const fieldTotal = gradingSchema.field.name
          + gradingSchema.field.type
          + gradingSchema.field.modifiers;
      totalPoints += fieldTotal;

      let fieldScore = 0;
      let logParts: string[] = [];

      // Check name
      if (field.correctName) {
        fieldScore += gradingSchema.field.name;
        logParts.push(`name +${gradingSchema.field.name}`);
      } else {
        logParts.push(`name +0`);
      }

      // Check type
      if (field.correctType) {
        fieldScore += gradingSchema.field.type;
        logParts.push(`type +${gradingSchema.field.type}`);
      } else {
        logParts.push(`type +0`);
      }

      // Check modifiers
      if (field.correctModifiers) {
        fieldScore += gradingSchema.field.modifiers;
        logParts.push(`modifiers +${gradingSchema.field.modifiers}`);
      } else {
        logParts.push(`modifiers +0`);
      }

      earnedPoints += fieldScore;

      const detailString = logParts.join(", ");
      console.log(
          yellow(`- Field => ${detailString} = ${fieldScore}/${fieldTotal} points`)
      );
    }

    // 4) Methods
    console.log(yellow(`\nMethods:`));
    for (const method of clsEval.methodsCorrect) {
      const methodBaseTotal = gradingSchema.method.name
          + gradingSchema.method.params
          + gradingSchema.method.returnType
          + gradingSchema.method.modifiers
          + gradingSchema.method.exceptions;

      let methodPoints = 0;
      let detailParts: string[] = [];

      // A) Method name correctness
      if (method.correctName) {
        methodPoints += gradingSchema.method.name;
        detailParts.push(`name +${gradingSchema.method.name}`);
      } else {
        detailParts.push(`name +0`);
      }

      // B) Method params
      if (method.correctParams) {
        methodPoints += gradingSchema.method.params;
        detailParts.push(`params +${gradingSchema.method.params}`);
      } else {
        detailParts.push(`params +0`);
      }

      // C) Return type
      if (method.correctReturnType) {
        methodPoints += gradingSchema.method.returnType;
        detailParts.push(`returnType +${gradingSchema.method.returnType}`);
      } else {
        detailParts.push(`returnType +0`);
      }

      // D) Modifiers
      if (method.correctModifiers) {
        methodPoints += gradingSchema.method.modifiers;
        detailParts.push(`modifiers +${gradingSchema.method.modifiers}`);
      } else {
        detailParts.push(`modifiers +0`);
      }

      // E) Exceptions
      if (method.correctExceptions) {
        methodPoints += gradingSchema.method.exceptions;
        detailParts.push(`exceptions +${gradingSchema.method.exceptions}`);
      } else {
        detailParts.push(`exceptions +0`);
      }

      let testPoints = 0;
      let testTotal = 0;
      if (method.testResults) {
        testTotal = method.testResults.total * gradingSchema.method.tests;
        testPoints = method.testResults.passed * gradingSchema.method.tests;
        methodPoints += testPoints;

        totalPoints += testTotal;

        detailParts.push(`tests +${testPoints}/${testTotal} (passed ${method.testResults.passed}/${method.testResults.total})`);
      }

      totalPoints += methodBaseTotal;
      earnedPoints += methodPoints;

      const detailString = detailParts.join(", ");
      const methodAllTotal = methodBaseTotal + testTotal;
      console.log(yellow(
          `- Method "${method.methodName}" => ${detailString} = ${methodPoints}/${methodAllTotal} points`
      ));
    }

    // 5) Constructors
    console.log(yellow(`\nConstructors:`));
    for (const ctor of clsEval.constructorsCorrect) {
      const ctorMax = gradingSchema.constructor.name + gradingSchema.constructor.params;
      totalPoints += ctorMax;

      let ctorScore = 0;
      let logCtorParts: string[] = [];

      if (ctor.correctName) {
        ctorScore += gradingSchema.constructor.name;
        logCtorParts.push(`name +${gradingSchema.constructor.name}`);
      } else {
        logCtorParts.push(`name +0`);
      }

      if (ctor.correctParams) {
        ctorScore += gradingSchema.constructor.params;
        logCtorParts.push(`params +${gradingSchema.constructor.params}`);
      } else {
        logCtorParts.push(`params +0`);
      }

      earnedPoints += ctorScore;

      console.log(yellow(
          `- Constructor => ${logCtorParts.join(", ")} = ${ctorScore}/${ctorMax} points`
      ));
    }
  }

  // 6) Final Score Calculation
  const finalScore = (earnedPoints / totalPoints) * 100;
  console.log(yellow(`\nCalculating total: ${earnedPoints} earned/${totalPoints} total * 100 points`));
  return Math.round(finalScore);
}
