import { ExpectedStructure } from "./structure-types.ts";
import { parse } from "java-parser"

export async function verifyStructure(sourcePath: string, expectedStructure: ExpectedStructure): Promise<boolean> {

    const decoder = new TextDecoder("utf-8");
    const code = decoder.decode(Deno.readFileSync(sourcePath));
    console.log(code)
    const cst = parse(code);

    console.log();
    return false;
}
