export interface MethodEvaluation {
    correctName: boolean;
    correctParams: boolean;
    correctReturnType: boolean;
    correctModifiers: boolean;
    correctExceptions: boolean;
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