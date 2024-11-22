import { assertEquals } from "@std/assert";
import {compileJava} from "../../../../src/commands/steps/compile/compile.ts";


Deno.test(async function addTest() {
    await compileJava("/Users/mario/facultate/projects/deno-oop-evaluator/assets/Calculator.java", "./out")
});
