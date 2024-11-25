import {verifyStructure} from "../../../../src/commands/steps/structure/structure.ts";

Deno.test("test structure simple", async function () {

    const expectedStructure = {
        classes: [
            {
                name: 'Calculator',
                fields: [{name: 'myField', type: 'String', modifiers: ['private', 'static']},
                    {name: 'myInt', type: 'int', modifiers: ['public']}],
                methods: [{name: 'myMethod', returnType: 'void', modifiers: ['public'], parameters: []},
                    {name: 'addNumbers', returnType: 'int', modifiers: ['public'], parameters: []}]
            },
            {
                name: 'Test2',
                fields: [{name: 'myField2', type: 'String', modifiers: ['private', 'static']},
                    {name: 'myInt2', type: 'int', modifiers: ['public']}],
                methods: [{name: 'metoda2', returnType: 'void', modifiers: ['private', 'static'], parameters: []}]
            },
        ]
    }
    await verifyStructure("C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\assets\\Calculator.java", expectedStructure);
})
