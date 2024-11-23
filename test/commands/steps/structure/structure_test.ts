import {verifyStructure} from "../../../../src/commands/steps/structure/structure.ts";

Deno.test("test structure simple", async function () {

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
                { name: 'myInt2', type: 'int', modifiers: ['public'] }],
            methods: []
        }
        ]
    }
  await verifyStructure("C:\\Users\\ambra\\OneDrive\\Desktop\\licenta\\oop-evaluator\\assets\\Calculator.java", expectedStructure);
})
