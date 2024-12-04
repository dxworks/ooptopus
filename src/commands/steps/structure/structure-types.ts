
export interface ExpectedStructure {
    classes: Class[];
}

interface Class {
    name: string;
    fields?: Field[];
    constructors?: Constructor[];
    methods?: Method[];
}

interface Field {
    name: string;
    type: string;
    modifiers: string[];
}

interface Method {
    name: string;
    returnType: string;
    modifiers: string[];
    parameters: Parameter[];
}

interface Constructor {
    parameters: Parameter[];
    modifiers: string[];
}

interface Parameter {
    name: string;
    type: string;
}
