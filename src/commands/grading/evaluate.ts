import { yellow } from "@std/fmt/colors";
import { ClassEvaluation, TestResults } from "./evaluating.model.ts";


export function evaluateAll(
  classEvaluations: ClassEvaluation[],
  didCompile: boolean,
  testResults?: TestResults,
): number {
  let totalPoints = 0;
  let earnedPoints = 0;

  // 1) Weight for successful compilation
  // Example: 10 points if it compiles, else 0
  totalPoints += 10;
  if (didCompile) {
    earnedPoints += 10;
  }
  console.log(yellow(`Compilation: ${didCompile ? "✅" : "❌"} --- ${earnedPoints}/10 points`));

  // 2) Evaluate each class
  for (const clsEval of classEvaluations) {
    totalPoints += 5;
    let namePoints = 0;
    if (clsEval.nameCorrect) {
      earnedPoints += 5;
      namePoints += 5;
    }
    console.log(yellow(`Class: ${clsEval.name} --- ${clsEval.nameCorrect ? "✅" : "❌"} --- ${namePoints}/5 points`));

    totalPoints += 5;
    let extendsPoints = 0;
    if (clsEval.extendsCorrect) {
      earnedPoints += 5;
      extendsPoints += 5;
    }
    console.log(yellow(`Extends: ${clsEval.extendsCorrect ? "✅" : "❌"} --- ${extendsPoints}/5 points`));

    totalPoints += 5;
    let implementsPoints = 0;
    if (clsEval.implementsCorrect) {
      earnedPoints += 5;
      implementsPoints += 5;
    }
    console.log(yellow(`Implements: ${clsEval.implementsCorrect ? "✅" : "❌"} --- ${implementsPoints}/5 points`));

    // Fields     
    let fieldPoints = 0;
    clsEval.fieldsCorrect.forEach((field) => {
      // For each field, let's define the weighting:
      //   - 2 points for correct name
      //   - 2 points for correct type
      //   - 1 point for correct modifiers
      totalPoints += 5; // 2 + 2 + 1
      let fieldScore = 0;
      if (field.correctName) fieldScore += 2;
      if (field.correctType) fieldScore += 2;
      if (field.correctModifiers) fieldScore += 1;
      fieldPoints += fieldScore;
      earnedPoints += fieldScore;
    });
    console.log(yellow(`Fields: ${fieldPoints}/5 points`));

    // Methods
    let methodPoints = 0;
    clsEval.methodsCorrect.forEach((method) => {
      // Weighted example:
      //   - 2 points for correct name
      //   - 2 points for correct params
      //   - 2 points for correct return type
      //   - 1 point for correct modifiers
      //   - 1 point for correct exceptions
      totalPoints += 8;
      let methodScore = 0;
      if (method.correctName) methodScore += 2;
      if (method.correctParams) methodScore += 2;
      if (method.correctReturnType) methodScore += 2;
      if (method.correctModifiers) methodScore += 1;
      if (method.correctExceptions) methodScore += 1;
      methodPoints += methodScore;
      earnedPoints += methodScore;
    });
    console.log(yellow(`Methods: ${methodPoints}/8 points`));

    // Constructors
    let constructorPoints = 0;
    clsEval.constructorsCorrect.forEach((ctor) => {
      // Weighted example:
      //   - 3 points for correct name
      //   - 2 points for correct params
      totalPoints += 5;
      let ctorScore = 0;
      if (ctor.correctName) ctorScore += 3;
      if (ctor.correctParams) ctorScore += 2;
      constructorPoints += ctorScore;
      earnedPoints += ctorScore;
    });
    console.log(yellow(`Constructors: ${constructorPoints}/5 points`));
  }

  // 3) If we have test results, factor them in:
  if (testResults) {
    // max possible from tests
    const maxTestPoints = 30;
    // totalPoints for tests
    totalPoints += maxTestPoints;

    // Suppose each test is worth the same fraction of 30 points
    const pointsPerTest = maxTestPoints / testResults.total;
    const testPoints = testResults.passed * pointsPerTest;

    // Add
    earnedPoints += testPoints;
    console.log(yellow(`Tests: ${testPoints} points`));
  }

  // 4) Convert the total points into a 0-100 scale
  // If your total weighting is guaranteed to be 100, you can skip this. 
  // Otherwise, you can scale it to 100:
  const finalScore = (earnedPoints / totalPoints) * 100;
  console.log(yellow(`\nCalculating total: ${earnedPoints} earned/${totalPoints} total * 100 points`));

  return Math.round(finalScore);
}
