
export interface ExpectedStructure {
    classes: {
        name: string;
        fields?: { name: string; type: string; modifiers: string[] }[];
        methods?: { name: string; returnType: string; parameters: { name: string; type: string; }[]; }[];
    }[];
}
