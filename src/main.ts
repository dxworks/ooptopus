import { parseArgs } from "@std/cli/parse-args";
import { blue, bgWhite, red } from "@std/fmt/colors";
import {compileJava} from "./commands/steps/compile/compile.ts";
import {verifyStructure} from "./commands/steps/structure/structure.ts";
import { ExpectedStructure } from "./commands/steps/structure/structure-types.ts";

// Same as running `deno run example.ts --foo --bar=baz ./quux.txt`
const args = parseArgs(Deno.args, {
    string: ["source"],
    alias: { source: "s" },
    stopEarly: true,
});

console.log(blue(bgWhite(JSON.stringify(args))));

const expectedStructure: ExpectedStructure = {
    classes: [
        {
            name: 'HelloWorldExample',
            fields: [],
            methods: [],
        }
    ]
}

if(args._) {
    if(args._.includes("evaluate")) {
        console.log(blue("Evaluating..."));
        if(!args.source) {
            console.error(red("Source file not provided."));
            Deno.exit(1);
        }
        await compileJava(args.source, "./out");
        await verifyStructure(args.source, expectedStructure)
    }
}
