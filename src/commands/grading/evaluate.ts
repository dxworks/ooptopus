import { yellow } from "@std/fmt/colors";
import {
  ClassEvaluation,
  GradingSchema,
  TestResults,
  InterfaceEvaluation,
} from "./evaluating.model.ts";
import {
  ClassMetrics,
  generateMetricsCSV,
  SolutionMetrics,
} from "./generateMetrics.ts";
import { generateEvaluationReport } from "./generateReport.ts";

export function evaluateAll(
  classEvaluations: ClassEvaluation[],
  interfaceEvaluations: InterfaceEvaluation[],
  didCompile: boolean,
  gradingSchema: GradingSchema,
  generateIndividualCSV: boolean,
  sourcePath: string,
  testResults?: TestResults[],
  studentSolution?: string,
): SolutionMetrics | number {
  const metricsCollection: ClassMetrics[] = [];

  let totalPoints = 0;
  let earnedPoints = 0;

  // 1) Compilation
  totalPoints += gradingSchema.compilation;
  const compilePoints = didCompile ? gradingSchema.compilation : 0;
  earnedPoints += compilePoints;
  console.log(
    yellow(
      `Compilation ${
        didCompile ? "✅" : "❌"
      } --- ${compilePoints}/${gradingSchema.compilation} points`,
    ),
  );

  // 2) Evaluate interfaces
  if (gradingSchema.interfaces) {
    console.log(yellow(`\n--- Evaluating Interfaces ---`));
    for (const interfaceName in gradingSchema.interfaces) {
      const interfaceSchema = gradingSchema.interfaces[interfaceName];
      const interfaceEval = interfaceEvaluations.find((int) => int.id === interfaceName);

      // Interface Name
      totalPoints += interfaceSchema.name;
      const namePoints = interfaceEval?.nameCorrect ? interfaceSchema.name : 0;
      earnedPoints += namePoints;
      console.log(yellow(
        `Interface "${interfaceName}" name correctness: ${
          interfaceEval?.nameCorrect ? "✅" : "❌"
        } -- ${namePoints}/${interfaceSchema.name} points`,
      ));

      // Interface Extends
      if (interfaceSchema.extends) {
        totalPoints += interfaceSchema.extends;
        const extendsPoints = interfaceEval?.extendsCorrect ? interfaceSchema.extends : 0;
        earnedPoints += extendsPoints;
        console.log(yellow(
          `Interface "${interfaceName}" extends correctness: ${
            interfaceEval?.extendsCorrect ? "✅" : "❌"
          } -- ${extendsPoints}/${interfaceSchema.extends} points`,
        ));
      }

      // Interface Methods
      if (interfaceSchema.methods) {
        console.log(yellow(`\nMethods for interface "${interfaceName}":`));
        for (const methodName in interfaceSchema.methods) {
          const methodSchema = interfaceSchema.methods[methodName];
          const methodEval = interfaceEval?.methodsCorrect.find((method) =>
            method.id === methodName
          );

          const methodBaseTotal = methodSchema.name +
            methodSchema.params +
            methodSchema.returnType +
            methodSchema.modifiers +
            methodSchema.exceptions;

          let methodPoints = 0;

          // Name Check
          const nameScore = methodEval?.correctName ? methodSchema.name : 0;
          methodPoints += nameScore;
          if (methodSchema.name !== 0) {
            console.log(
              yellow(
                `  - Method Name "${methodName}": ${nameScore}/${methodSchema.name} points`,
              ),
            );
          }

          // Parameters Check
          const paramsScore = methodEval?.correctParams ? methodSchema.params : 0;
          methodPoints += paramsScore;
          if (methodSchema.params !== 0) {
            console.log(
              yellow(
                `  - Method Params "${methodName}": ${paramsScore}/${methodSchema.params} points`,
              ),
            );
          }

          // Return Type Check
          const returnTypeScore = methodEval?.correctReturnType
            ? methodSchema.returnType
            : 0;
          methodPoints += returnTypeScore;
          if (methodSchema.returnType !== 0) {
            console.log(
              yellow(
                `  - Return Type "${methodName}": ${returnTypeScore}/${methodSchema.returnType} points`,
              ),
            );
          }

          // Modifiers Check
          const modifiersScore = methodEval?.correctModifiers
            ? methodSchema.modifiers
            : 0;
          methodPoints += modifiersScore;
          if (methodSchema.modifiers !== 0) {
            console.log(
              yellow(
                `  - Modifiers "${methodName}": ${modifiersScore}/${methodSchema.modifiers} points`,
              ),
            );
          }

          // Exceptions Check
          const exceptionsScore = methodEval?.correctExceptions
            ? methodSchema.exceptions
            : 0;
          methodPoints += exceptionsScore;
          if (methodSchema.exceptions !== 0) {
            console.log(
              yellow(
                `  - Exceptions "${methodName}": ${exceptionsScore}/${methodSchema.exceptions} points`,
              ),
            );
          }

          totalPoints += methodBaseTotal;
          earnedPoints += methodPoints;

          console.log(
            yellow(
              `- Method "${methodName}" => ${methodPoints}/${methodBaseTotal} points`,
            ),
          );
        }
      }

      // Interface Constants
      if (interfaceSchema.constants) {
        console.log(yellow(`\nConstants for interface "${interfaceName}":`));
        for (const constantName in interfaceSchema.constants) {
          const constantSchema = interfaceSchema.constants[constantName];
          const constantEval = interfaceEval?.constantsCorrect.find((constant) =>
            constant.id === constantName
          );

          const constantTotal = constantSchema.name + constantSchema.type + constantSchema.modifiers;
          totalPoints += constantTotal;

          let constantScore = 0;
          // Name Check
          const nameScore = constantEval?.correctName ? constantSchema.name : 0;
          constantScore += nameScore;
          console.log(
            yellow(
              `  - Constant Name "${constantName}": ${nameScore}/${constantSchema.name} points`,
            ),
          );

          // Type Check
          const typeScore = constantEval?.correctType ? constantSchema.type : 0;
          constantScore += typeScore;
          console.log(
            yellow(
              `  - Constant Type "${constantName}": ${typeScore}/${constantSchema.type} points`,
            ),
          );

          // Modifiers Check
          const modifiersScore = constantEval?.correctModifiers
            ? constantSchema.modifiers
            : 0;
          constantScore += modifiersScore;
          console.log(
            yellow(
              `  - Constant Modifiers "${constantName}": ${modifiersScore}/${constantSchema.modifiers} points`,
            ),
          );

          earnedPoints += constantScore;
          console.log(
            yellow(
              `- Constant "${constantName}" => ${constantScore}/${constantTotal} points`,
            ),
          );
        }
      }
    }
  }

  // 3) Evaluate each class based on the grading schema
  for (const className in gradingSchema.classes) {
    const currentClassMetrics: ClassMetrics = {
      className,
      methods: new Map(),
    };

    const gradingClass = gradingSchema.classes[className];
    const clsEval = classEvaluations.find((cls) => cls.name === className);

    console.log(yellow(`\n--- Evaluating class "${className}" ---`));

    // Class Name
    if (
      gradingClass.name !== 0 || gradingClass.extends !== 0 ||
      gradingClass.implements !== 0 || gradingClass.modifiers !== 0
    ) {
      totalPoints += gradingClass.name;
      const namePoints = clsEval?.nameCorrect ? gradingClass.name : 0;
      earnedPoints += namePoints;
      console.log(yellow(
        `Class name correctness: ${
          clsEval?.nameCorrect ? "✅" : "❌"
        } -- ${namePoints}/${gradingClass.name} points`,
      ));

      // Class Extends
      totalPoints += gradingClass.extends;
      const extendsPoints = clsEval?.extendsCorrect ? gradingClass.extends : 0;
      earnedPoints += extendsPoints;
      console.log(yellow(
        `Extends correctness: ${
          clsEval?.extendsCorrect ? "✅" : "❌"
        } -- ${extendsPoints}/${gradingClass.extends} points`,
      ));

      // Class Implements
      totalPoints += gradingClass.implements;
      const implementsPoints = clsEval?.implementsCorrect
        ? gradingClass.implements
        : 0;
      earnedPoints += implementsPoints;
      console.log(yellow(
        `Implements correctness: ${
          clsEval?.implementsCorrect ? "✅" : "❌"
        } -- ${implementsPoints}/${gradingClass.implements} points`,
      ));

      // Class Modifiers
      totalPoints += gradingClass.modifiers;
      const modifiersPoints = clsEval?.modifiersCorrect
        ? gradingClass.modifiers
        : 0;
      earnedPoints += modifiersPoints;
      console.log(yellow(
        `Modifiers correctness: ${
          clsEval?.modifiersCorrect ? "✅" : "❌"
        } -- ${modifiersPoints}/${gradingClass.modifiers} points`,
      ));
    }

    // 3) Fields by ID
    if (gradingClass.fields) {
      console.log(yellow(`\nFields:`));
      for (const fieldName in gradingClass.fields) {
        const fieldSchema = gradingClass.fields[fieldName];
        const fieldEval = clsEval?.fieldsCorrect.find((field) =>
          field.id === fieldName
        );

        const fieldTotal = fieldSchema.name + fieldSchema.type +
          fieldSchema.modifiers;
        totalPoints += fieldTotal;

        let fieldScore = 0;
        // Name Check
        const nameScore = fieldEval?.correctName ? fieldSchema.name : 0;
        fieldScore += nameScore;
        console.log(
          yellow(
            `  - Field Name "${fieldName}": ${nameScore}/${fieldSchema.name} points`,
          ),
        );

        // Type Check
        const typeScore = fieldEval?.correctType ? fieldSchema.type : 0;
        fieldScore += typeScore;
        console.log(
          yellow(
            `  - Field Type "${fieldName}": ${typeScore}/${fieldSchema.type} points`,
          ),
        );

        // Modifiers Check
        const modifiersScore = fieldEval?.correctModifiers
          ? fieldSchema.modifiers
          : 0;
        fieldScore += modifiersScore;
        console.log(
          yellow(
            `  - Field Modifiers "${fieldName}": ${modifiersScore}/${fieldSchema.modifiers} points`,
          ),
        );

        earnedPoints += fieldScore;
        console.log(
          yellow(
            `- Field "${fieldName}" => ${fieldScore}/${fieldTotal} points`,
          ),
        );
      }
    }

    // 4) Methods by ID
    console.log(yellow(`\nMethods:`));
    for (const methodName in gradingClass.methods) {
      const methodSchema = gradingClass.methods[methodName];
      const methodEval = clsEval?.methodsCorrect.find((method) =>
        method.id === methodName
      );

      const methodBaseTotal = methodSchema.name +
        methodSchema.params +
        methodSchema.returnType +
        methodSchema.modifiers +
        methodSchema.exceptions;

      let methodPoints = 0;

      // Name Check
      const nameScore = methodEval?.correctName ? methodSchema.name : 0;
      methodPoints += nameScore;
      if (methodSchema.name !== 0) {
        console.log(
          yellow(
            `  - Method Name "${methodName}": ${nameScore}/${methodSchema.name} points`,
          ),
        );
      }

      // Parameters Check
      const paramsScore = methodEval?.correctParams ? methodSchema.params : 0;
      methodPoints += paramsScore;
      if (methodSchema.params !== 0) {
        console.log(
          yellow(
            `  - Method Params "${methodName}": ${paramsScore}/${methodSchema.params} points`,
          ),
        );
      }

      // Return Type Check
      const returnTypeScore = methodEval?.correctReturnType
        ? methodSchema.returnType
        : 0;
      methodPoints += returnTypeScore;
      if (methodSchema.returnType !== 0) {
        console.log(
          yellow(
            `  - Return Type "${methodName}": ${returnTypeScore}/${methodSchema.returnType} points`,
          ),
        );
      }

      // Modifiers Check
      const modifiersScore = methodEval?.correctModifiers
        ? methodSchema.modifiers
        : 0;
      methodPoints += modifiersScore;
      if (methodSchema.modifiers !== 0) {
        console.log(
          yellow(
            `  - Modifiers "${methodName}": ${modifiersScore}/${methodSchema.modifiers} points`,
          ),
        );
      }

      // Exceptions Check
      const exceptionsScore = methodEval?.correctExceptions
        ? methodSchema.exceptions
        : 0;
      methodPoints += exceptionsScore;
      if (methodSchema.exceptions !== 0) {
        console.log(
          yellow(
            `  - Exceptions "${methodName}": ${exceptionsScore}/${methodSchema.exceptions} points`,
          ),
        );
      }

      // Test Results
      let testPoints = 0;
      let testTotal = 0;
      if (methodSchema.tests) {
        for (const testName in methodSchema.tests) {
          const testScore = methodSchema.tests[testName];
          testTotal += testScore;
          const testResult = testResults?.find((test) =>
            test.name === testName
          );
          console.log(yellow(`    - Test "${testName}"`));
          if (testResult?.passed) {
            testPoints += testScore;
          }
          console.log(
            yellow(
              `    - Test "${testName}": ${
                testResult?.passed ? "✅" : "❌"
              } = ${testPoints}/${testScore} points`,
            ),
          );
        }
        methodPoints += testPoints;
        totalPoints += testTotal;
      }

      totalPoints += methodBaseTotal;
      earnedPoints += methodPoints;

      const noCommaMethodName = methodName.replace(/,/g, "+");
      currentClassMetrics.methods.set(methodName, {
        earned: didCompile ? methodPoints : 0,
        total: methodBaseTotal + testTotal,
        difference: (methodBaseTotal + testTotal) - methodPoints,
      });

      console.log(
        yellow(
          `- Method "${methodName}" => ${methodPoints}/${
            methodBaseTotal + testTotal
          } points`,
        ),
      );
    }

    // 5) Constructors by ID
    console.log(yellow(`\nConstructors:`));
    for (const ctorName in gradingClass.constructors) {
      const ctorSchema = gradingClass.constructors[ctorName];
      const ctorEval = clsEval?.constructorsCorrect.find((ctor) =>
        ctor.id === ctorName
      );

      const ctorMax = ctorSchema.name + ctorSchema.params;
      totalPoints += ctorMax;

      let ctorScore = 0;
      // Name Check
      const nameScore = ctorEval?.correctName ? ctorSchema.name : 0;
      ctorScore += nameScore;
      if (ctorSchema.name !== 0) {
        console.log(
          yellow(
            `  - Constructor Name "${ctorName}": ${nameScore}/${ctorSchema.name} points`,
          ),
        );
      }

      // Parameters Check
      const paramsScore = ctorEval?.correctParams ? ctorSchema.params : 0;
      ctorScore += paramsScore;
      if (ctorSchema.params !== 0) {
        console.log(
          yellow(
            `  - Constructor Params "${ctorName}": ${paramsScore}/${ctorSchema.params} points`,
          ),
        );
      }

      earnedPoints += ctorScore;

      const noCommaCtorName = ctorName.replace(/,/g, "+");
      currentClassMetrics.methods.set(noCommaCtorName, {
        earned: didCompile ? ctorScore : 0,
        total: ctorMax,
        difference: ctorMax - ctorScore,
      });

      console.log(
        yellow(`- Constructor "${ctorName}" => ${ctorScore}/${ctorMax} points`),
      );
    }
    metricsCollection.push(currentClassMetrics);
  }

  // 6) Final Score Calculation

  const finalScore = didCompile ? (earnedPoints / totalPoints) * 100 : 10;
  console.log(yellow(`\nCalculating total: ${earnedPoints} earned/${totalPoints} total * 100 points`));
  const roundedScore = Math.round(finalScore);

  // Generate evaluation report
  if (studentSolution) {
    generateEvaluationReport({
      studentSolution: `${sourcePath}\n${studentSolution}`,
      classEvaluations,
      interfaceEvaluations,
      testResults,
      didCompile,
      totalScore: roundedScore,
      totalPoints,
      earnedPoints,
      gradingSchema,
    });
  }

  if (generateIndividualCSV) {
    generateMetricsCSV(metricsCollection);
    return Math.round(finalScore);
  } else {
    return {
      totalScore: roundedScore,
      classes: metricsCollection,
    };
  }
}
