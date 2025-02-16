import {ClassEvaluation, TestResults} from "../../grading/evaluating.model.ts";

export function attachTestResults(
    classEvaluations: ClassEvaluation[],
    testResultsMap: Record<string, TestResults>,
): void {
    for (const clsEval of classEvaluations) {
        for (const methodEval of clsEval.methodsCorrect) {
            // We'll see if any 'testName' in JUnit's output includes the real method name
            // e.g. testName="testReset_ValidCase" includes "reset"
            for (const [testName, results] of Object.entries(testResultsMap)) {
                if (testName.toLowerCase().includes(methodEval.methodName.toLowerCase())) {
                    if (!methodEval.testResults) {
                        methodEval.testResults = {total: 0, passed: 0};
                    }
                    methodEval.testResults.total += results.total;
                    methodEval.testResults.passed += results.passed;
                }
            }
            if (methodEval.testResults) {
                console.log(`Attached test results to ${methodEval.methodName}: {${methodEval?.testResults.total} total --- ${methodEval?.testResults.passed} passed}`);
            } else {
                console.log(`No test results found for ${methodEval.methodName}`);
            }
        }
    }
}
