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

export interface InterfaceEvaluation {
  id: string;
  nameCorrect: boolean;
  extendsCorrect: boolean;
  methodsCorrect: MethodEvaluation[];
  constantsCorrect: FieldEvaluation[];
}

export interface ClassEvaluation {
  id: string;
  nameCorrect: boolean;
  extendsCorrect: boolean;
  implementsCorrect: boolean;
  modifiersCorrect: boolean;
  fieldsCorrect: FieldEvaluation[];
  methodsCorrect: MethodEvaluation[];
  constructorsCorrect: ConstructorEvaluation[];
}

export interface TestResults {
  name: string;
  passed: boolean;
}

export interface FieldSchema {
  name: number;
  type: number;
  modifiers: number;
}

export interface MethodSchema {
  name: number;
  params: number;
  returnType: number;
  modifiers: number;
  exceptions: number;
  tests?: Record<string, number>;
}

export interface ConstructorSchema {
  name: number;
  params: number;
}

export interface InterfaceSchema {
  name: number;
  extends: number;
  methods: Record<string, MethodSchema>;
  constants: Record<string, FieldSchema>;
}

export interface ClassSchema {
  name: number;
  extends: number;
  implements: number;
  modifiers: number;
  fields: Record<string, FieldSchema>;
  methods: Record<string, MethodSchema>;
  constructors: Record<string, ConstructorSchema>;
}

export interface GradingSchema {
  compilation: number;
  classes: Record<string, ClassSchema>;
  interfaces: Record<string, InterfaceSchema>;
}
