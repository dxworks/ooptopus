import {verifyStructure} from "../../../../src/commands/steps/structure/structure.ts";

Deno.test("test structure simple", async function () {

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
            // {
            //     name: 'Test2',
            //     fields: [{name: 'myField2', type: 'String', modifiers: ['private', 'static']},
            //         {name: 'myInt2', type: 'int', modifiers: ['public']}],
            //     methods: [{name: 'metoda2', returnType: 'void', modifiers: ['private', 'static'], parameters: []}]
            // },
        ]
    }
    // await verifyStructure("C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\assets\\Calculator.java", expectedStructure);
})
