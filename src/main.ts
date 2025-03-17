import { parseArgs } from "@std/cli/parse-args";
import { blue, bgWhite, red } from "@std/fmt/colors";
import {compileJava} from "./commands/steps/compile/compile.ts";
import {verifyStructure} from "./commands/steps/structure/structure.ts";
import {runJUnitTests} from "./commands/steps/tests/test.ts";
import { ClassEvaluation } from "./commands/grading/evaluating.model.ts";
import { evaluateAll } from "./commands/grading/evaluate.ts";
import defaultGrading from "../assets/defaultGrading.json" with { type: "json" };
import {JavaStructure} from "./commands/steps/structure/structure-types.ts";

// Same as running `deno run example.ts --foo --bar=baz ./quux.txt`
const args = parseArgs(Deno.args, {
    string: ["source", "test", "grading"],
    alias: { source: "s", test: "t", grading: "g" },
    stopEarly: true,
});

console.log(blue(bgWhite(JSON.stringify(args))));


// const expectedStructure = {
//     classes: [
//         // {
//         //     name: 'Calculator',
//         //     extends: 'Object',
//         //     implements: ['MyInterface', 'Cloneable'],
//         //     fields: [{ name: 'myField', type: 'String', modifiers: ['private'] },
//         //         { name: 'myInt', type: 'int', modifiers: ['public'] }],
//         //     methods: [{ name: 'myMethod', returnType: 'void', modifiers: ['public'], parameters: [], exceptions: ['IOException'] },
//         //         { name: 'myMethod', returnType: 'void', modifiers: ['public'], parameters: [{name: 'x', type: 'int'}], exceptions: [] },
//         //         { name: 'addNumbers', returnType: 'int', modifiers: ['public'], parameters: [{name: 'a', type: 'int'}, {name: 'b', type: 'int'}], exceptions: ['IOException']
//         //         }],
//         //     constructors: [{ name: 'Calculator', parameters: [{name: 'constructorField', type: 'String'}, {name: 'constructorInt', type: 'boolean'}] },
//         //         { name: 'Calculator', parameters: [] }]
//         // },
//         {
//             name: "SimpleClass",
//             id: "SimpleClass",
//             extends: '',
//             implements: [],
//             fields: [
//               { name: "name", type: "String", modifiers: ["private"], id: "name" },
//               { name: "value", type: "int", modifiers: ["private"], id: "value" }
//             ],
//             methods: [
//               { name: "getName", returnType: "String", modifiers: ["public"], parameters: [], exceptions: [], id: 'getName()' },
//               { name: "getValue", returnType: "int", modifiers: ["public"], parameters: [], exceptions: [], id: 'getValue()' },
//               { name: "incrementValue", returnType: "void", modifiers: ["public"], parameters: [], exceptions: [], id: 'incrementValue()' },
//               { name: "reset", returnType: "void", modifiers: ["public"], parameters: [], exceptions: [], id: 'reset()' }
//             ],
//             constructors: [
//               { name: "SimpleClass", parameters: [], modifiers: ["public"], id: 'SimpleClass()' },
//               { name: "SimpleClass", parameters: [ { name: "name", type: "String" }, { name: "value", type: "int" } ], modifiers: ["public"], id: 'SimpleClass(String name, int value)' }
//             ]
//           }
//     ]
// }

const expectedStructure: JavaStructure = {
    "classes": [
    {
        "name": "Car",
        "fields": [
            { "name": "brand", "type": "String", "modifiers": ["private"] },
            { "name": "horsePower", "type": "int", "modifiers": ["private"] },
            { "name": "price", "type": "double", "modifiers": ["private"] }
        ],
        "constructors": [
            {
                "name": "Car",
                "parameters": [
                    { "name": "brand", "type": "String" },
                    { "name": "horsePower", "type": "int" }
                ]
            },
            {
                "name": "Car",
                "parameters": [
                    { "name": "brand", "type": "String" },
                    { "name": "horsePower", "type": "int" },
                    { "name": "price", "type": "double" }
                ]
            }
        ],
        "methods": [
            {
                "name": "equals",
                "returnType": "boolean",
                "modifiers": ["public"],
                "parameters": [
                    { "name": "o", "type": "Object" }
                ],
                "exceptions": []
            },
            {
                "name": "toString",
                "returnType": "String",
                "modifiers": ["public"],
                "parameters": [],
                "exceptions": []
            }
        ]
    },
    {
        "name": "CarSet",
        "fields": [
            { "name": "elements", "type": "Car[]", "modifiers": ["private"] },
            { "name": "capacity", "type": "int", "modifiers": ["private"] },
            { "name": "size", "type": "int", "modifiers": ["private"] },
            { "name": "totalCarsAdded", "type": "int", "modifiers": ["private", "static"] },
            { "name": "totalCarsDeleted", "type": "int", "modifiers": ["private", "static"] }
        ],
        "constructors": [
            {
                "name": "CarSet",
                "parameters": [
                    { "name": "*", "type": "int" }
                ]
            }
        ],
        "methods": [
            {
                "name": "addCar",
                "returnType": "void",
                "modifiers": ["public"],
                "parameters": [
                    { "name": "car", "type": "Car" }
                ],
                "exceptions": []
            },
            {
                "name": "removeCar",
                "returnType": "Car",
                "modifiers": ["public"],
                "parameters": [
                    { "name": "carIndex", "type": "int" }
                ],
                "exceptions": []
            },
            {
                "name": "toString",
                "returnType": "String",
                "modifiers": ["public"],
                "parameters": [],
                "exceptions": []
            },
            {
                "name": "intersection",
                "returnType": "CarSet",
                "modifiers": ["public"],
                "parameters": [
                    { "name": "other", "type": "CarSet" }
                ],
                "exceptions": []
            },
            {
                "name": "getTotalCarsAdded",
                "returnType": "int",
                "modifiers": ["public", "static"],
                "parameters": [],
                "exceptions": []
            },
            {
                "name": "getTotalCarsDeleted",
                "returnType": "int",
                "modifiers": ["public", "static"],
                "parameters": [],
                "exceptions": []
            }
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

        let gradingSchema = defaultGrading;
        if (args.schema && typeof args.schema === 'string') {
          try {
              const schemaContent = await Deno.readTextFile(args.schema);
              gradingSchema = JSON.parse(schemaContent);
              console.log(blue("Using custom grading schema."));
          } catch (err) {
              console.error(red(`Failed to load schema file: ${err}`));
              console.log(blue("Using default grading schema."));
          }
      }

        let compiledOK = false;
        try {
          await compileJava(args.source, "./out");
          compiledOK = true;
        } catch (err) {
            const errorMessage = String(err);
            console.error(red(`Compilation failed: ${errorMessage}`));
        }

        const classEvaluations: ClassEvaluation[] = await verifyStructure(args.source, expectedStructure);

        let testResults = undefined;
        if(args.test) {
            console.log(blue(`\nRunning tests with ${args.test}...`));
        try {
            await compileJava([args.source, args.test, "assets/TestHelper.java"], "./out");
            testResults = await runJUnitTests(args.test, "./out");
          } catch (err) {
            const errorMessage = String(err);
            console.error(red(`Test run failed: ${errorMessage}`));
          }
        }

        if (args.grading) {
            try {
                const schemaContent = await Deno.readTextFile(args.grading);
                gradingSchema = JSON.parse(schemaContent);
                console.log(blue("\nUsing custom grading schema."));
            } catch (err) {
                console.error(red(`\nFailed to load schema file: ${err}`));
                console.log(blue("Using default grading schema."));
            }
            console.log(blue("Grading..."));
            const finalScore = evaluateAll(classEvaluations, compiledOK, gradingSchema, testResults);
            console.log(blue(`\n🎉🎉🎉 Final Score: ${finalScore}/100 🎉🎉🎉`));
        }
    }
}
