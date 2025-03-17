export interface MethodEvaluation {
    id: string;
    methodName: string;
    correctName: boolean;
    correctParams: boolean;
    correctReturnType: boolean;
    correctModifiers: boolean;
    correctExceptions: boolean;
}

export interface FieldEvaluation {
    id: string;
    correctName: boolean;
    correctType: boolean;
    correctModifiers: boolean;
}

export interface ConstructorEvaluation {
    id: string;
    correctName: boolean;
    correctParams: boolean;
}

export interface ClassEvaluation {
    id: string;
    name: string;
    nameCorrect: boolean;
    extendsCorrect: boolean;
    implementsCorrect: boolean;
    fieldsCorrect: FieldEvaluation[];
    methodsCorrect: MethodEvaluation[];
    constructorsCorrect: ConstructorEvaluation[];
}

export interface TestResults {
    name: string;
    passed: boolean;
  }

  // 
  export interface FieldSchema {
    name: number;
    type: number;
    modifiers: number;
}

// Method schema within a class
export interface MethodSchema {
    name: number;
    params: number;
    returnType: number;
    modifiers: number;
    exceptions: number;
    tests?: Record<string, number>; // Map of test names to point values
}

// Constructor schema within a class
export interface ConstructorSchema {
    name: number;
    params: number;
}

export interface ClassSchema {
  name: number;
  extends: number;
  implements: number;
  fields: Record<string, FieldSchema>;
  methods: Record<string, MethodSchema>;
  constructors: Record<string, ConstructorSchema>;
}

// The overall grading schema
export interface GradingSchema {
  compilation: number;
  classes: Record<string, ClassSchema>;
}