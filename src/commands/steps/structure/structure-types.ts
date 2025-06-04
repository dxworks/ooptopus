export interface JavaStructure {
    classes: {
        name: string;
        modifiers: string[];
        extends?: string;
        implements?: string[];
        fields?: { name: string;
            type: string;
            modifiers: string[] }[];
        methods?: { name: string;
            returnType: string;
            modifiers: string[];
            parameters: { name: string; type: string; }[];
            exceptions: string[]; }[];
        constructors?: { name: string;
            parameters: { name: string; type: string; }[]; }[];
    }[],
    interfaces: {
        name: string;
        extends?: string[];
        methods?: { name: string;
            returnType: string;
            modifiers: string[];
            parameters: { name: string; type: string; }[];
            exceptions: string[]; }[];
        constants?: { name: string;
            type: string;
            modifiers: string[]; }[];
    }[];
}
