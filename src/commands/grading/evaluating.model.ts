export interface MethodEvaluation {
    methodName: string;
    correctName: boolean;
    correctParams: boolean;
    correctReturnType: boolean;
    correctModifiers: boolean;
    correctExceptions: boolean;
    testResults?: TestResults;
}

export interface FieldEvaluation {
    correctName: boolean;
    correctType: boolean;
    correctModifiers: boolean;
}

export interface ConstructorEvaluation {
    correctName: boolean;
    correctParams: boolean;
}

export interface ClassEvaluation {
    name: string;
    nameCorrect: boolean;
    extendsCorrect: boolean;
    implementsCorrect: boolean;
    fieldsCorrect: FieldEvaluation[];
    methodsCorrect: MethodEvaluation[];
    constructorsCorrect: ConstructorEvaluation[];
}

export interface TestResults {
    total: number;
    passed: number;
  }

  export interface GradingSchema {
    compilation: number;
    class: {
      name: number;
      extends: number;
      implements: number;
    };
    field: {
      name: number;
      type: number;
      modifiers: number;
    };
    method: {
      name: number;
      params: number;
      returnType: number;
      modifiers: number;
      exceptions: number;
      tests: number;
    };
    constructor: {
      name: number;
      params: number;
    };
  }