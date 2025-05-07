import { parse } from "java-parser";
import { JavaStructure } from "./structure-types.ts";
import { JavaStructureVisitor } from "./java-structure-visitor.ts";

export function extractStructure(sourcePath: string): JavaStructure {
    const decoder = new TextDecoder("utf-8");
    const code = decoder.decode(Deno.readFileSync(sourcePath));
    const cst = parse(code);

    const visitor = new JavaStructureVisitor();
    visitor.visit(cst);

    return visitor.structure;
} 