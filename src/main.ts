import { parseArgs } from "@std/cli/parse-args";
import { blue, bgWhite, red } from "@std/fmt/colors";
import {compileJava} from "./commands/steps/compile/compile.ts";
import {verifyStructure} from "./commands/steps/structure/structure.ts";

// Same as running `deno run example.ts --foo --bar=baz ./quux.txt`
const args = parseArgs(Deno.args, {
    string: ["source"],
    alias: { source: "s" },
    stopEarly: true,
});

console.log(blue(bgWhite(JSON.stringify(args))));

const expectedStructure = {
    classes: [
        {
            name: 'Calculator',
            fields: [{ name: 'myField', type: 'String', modifiers: ['private', 'static'] },
                { name: 'myInt', type: 'int', modifiers: ['public'] }],
            methods: []
        },
        {
            name: 'Test2',
            fields: [{ name: 'myField2', type: 'String', modifiers: ['private', 'static'] },
                { name: 'myInt2222', type: 'int', modifiers: ['public'] }],
            methods: []
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
