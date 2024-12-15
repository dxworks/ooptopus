import { parseArgs } from "@std/cli/parse-args";
import { blue, bgWhite, red } from "@std/fmt/colors";
import {compileJava} from "./commands/steps/compile/compile.ts";
import {verifyStructure} from "./commands/steps/structure/structure.ts";
import {runJUnitTests} from "./commands/steps/tests/test.ts";

// Same as running `deno run example.ts --foo --bar=baz ./quux.txt`
const args = parseArgs(Deno.args, {
    string: ["source", "test"],
    alias: { source: "s", test: "t" },
    stopEarly: true,
});

console.log(blue(bgWhite(JSON.stringify(args))));


const expectedStructure = {
    classes: [
        {
            name: 'Calculator',
            extends: 'Object',
            implements: ['MyInterface', 'Cloneable'],
            fields: [{ name: 'myField', type: 'String', modifiers: ['private'] },
                { name: 'myInt', type: 'int', modifiers: ['public'] }],
            methods: [{ name: 'myMethod', returnType: 'void', modifiers: ['public'], parameters: [] },
                { name: 'myMethod', returnType: 'void', modifiers: ['public'], parameters: [{name: 'x', type: 'int'}] },
                { name: 'addNumbers', returnType: 'int', modifiers: ['public'],
                    parameters: [{name: 'a', type: 'int'}, {name: 'b', type: 'int'}]
                }],
            constructors: [{ name: 'Calculator', parameters: [{name: 'constructorField', type: 'String'}, {name: 'constructorInt', type: 'boolean'}] },
                { name: 'Calculator', parameters: [] }]
        },
        // {
        //     name: 'Test2',
        //     fields: [{ name: 'myField2', type: 'String', modifiers: ['private', 'static'] },
        //         { name: 'myInt222', type: 'int', modifiers: ['public'] }],
        //     methods: [{ name: 'metoda2', returnType: 'void', modifiers: ['private', 'static'],
        //         parameters: [{name: 'x', type: 'boolean'}, {name: 'y', type: 'int'}]
        //     }]
        // },
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
        if(args.test) {
            console.log(blue(`Running tests with ${args.test}...`));
            await compileJava([args.source, args.test], "./out");
            await runJUnitTests(args.test, "./out");
        }
    }
}
