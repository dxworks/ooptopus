import { parseArgs } from "@std/cli/parse-args";
import { blue, bgWhite, red } from "@std/fmt/colors";
import {compileJava} from "./commands/steps/compile/compile.ts";
import {verifyStructure} from "./commands/steps/structure/structure.ts";
import {runJUnitTests} from "./commands/steps/tests/test.ts";
import { ClassEvaluation } from "./commands/grading/evaluating.model.ts";
import { evaluateAll } from "./commands/grading/evaluate.ts";

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
            methods: [{ name: 'myMethod', returnType: 'void', modifiers: ['public'], parameters: [], exceptions: ['IOException'] },
                { name: 'myMethod', returnType: 'void', modifiers: ['public'], parameters: [{name: 'x', type: 'int'}], exceptions: [] },
                { name: 'addNumbers', returnType: 'int', modifiers: ['public'], parameters: [{name: 'a', type: 'int'}, {name: 'b', type: 'int'}], exceptions: ['IOException']
                }],
            constructors: [{ name: 'Calculator', parameters: [{name: 'constructorField', type: 'String'}, {name: 'constructorInt', type: 'boolean'}] },
                { name: 'Calculator', parameters: [] }]
        },
        {
            name: "SimpleClass",
            extends: '',
            implements: [],
            fields: [
              { name: "name", type: "String", modifiers: ["private"] },
              { name: "value", type: "int", modifiers: ["private"] }
            ],
            methods: [
              { name: "getName", returnType: "String", modifiers: ["public"], parameters: [], exceptions: [] },
              { name: "getValue", returnType: "int", modifiers: ["public"], parameters: [], exceptions: [] },
              { name: "incrementValue", returnType: "void", modifiers: ["public"], parameters: [], exceptions: [] },
              { name: "reset", returnType: "void", modifiers: ["public"], parameters: [], exceptions: [] }
            ],
            constructors: [
              { name: "SimpleClass", parameters: [], modifiers: ["public"] },
              { name: "SimpleClass", parameters: [ { name: "name", type: "String" }, { name: "value", type: "int" } ], modifiers: ["public"] }
            ]
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

        // await compileJava(args.source, "./out");
        let compiledOK = false;
        try {
          await compileJava(args.source, "./out");
          compiledOK = true;
        } catch (err) {
            const errorMessage = String(err);
            console.error(red(`Compilation failed: ${errorMessage}`));
        }

        // await verifyStructure(args.source, expectedStructure)
        const classEvaluations: ClassEvaluation[] = await verifyStructure(args.source, expectedStructure);

        let testResults = undefined;
        if(args.test) {
            console.log(blue(`\nRunning tests with ${args.test}...`));
        //     await compileJava([args.source, args.test], "./out");
        //     await runJUnitTests(args.test, "./out");
        try {
            await compileJava([args.source, args.test], "./out");
            // Suppose runJUnitTests returns an object like { total: 10, passed: 8 }
            testResults = await runJUnitTests(args.test, "./out");
          } catch (err) {
            const errorMessage = String(err);
            console.error(red(`Test run failed: ${errorMessage}`));
          }
        }
        console.log(blue("\nGrading..."));
        const finalScore = evaluateAll(classEvaluations, compiledOK, testResults);
        console.log(blue(`\n🎉🎉🎉 Final Score: ${finalScore}/100 🎉🎉🎉`));
    }
}
