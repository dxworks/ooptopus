import {verifyStructure} from "../../../../src/commands/steps/structure/structure.ts";

Deno.test("test structure simple", async function () {

    const expectedStructure = {
        classes: [
            {
                name: 'HelloWorldExample',
                fields: [],
                methods: [],
            }
        ]
    }
  await verifyStructure("/Users/mario/facultate/projects/deno-oop-evaluator/assets/Calculator.java", expectedStructure);
})
