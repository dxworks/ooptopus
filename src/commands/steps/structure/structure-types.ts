export interface JavaStructure {
    classes: {
        name: string;
        extends?: string;
        implements?: string[];
        fields?: { name: string; type: string; modifiers: string[] }[];
        methods?: { name: string; returnType: string; modifiers: string[], parameters: { name: string; type: string; }[]; }[];
        constructors?: { name: string; parameters: { name: string; type: string; }[]; }[];
    }[];
}
