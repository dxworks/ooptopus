import { blue, red } from "@std/fmt/colors";
import OpenAI from "npm:openai";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const env = await load();
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY") || env["OPENAI_API_KEY"],
});

async function createAssistantWithCSV(expectedStructurePath: string): Promise<string> {
  const csvContent = await Deno.readTextFile(expectedStructurePath);
  const templateAssistantId = Deno.env.get("OPEN_AI_TEMPLATE_ASSISTANT") || env["OPEN_AI_TEMPLATE_ASSISTANT"];
  
  // Get the template assistant to copy its instructions
  const templateAssistant = await openai.beta.assistants.retrieve(templateAssistantId);
  
  // Create a new assistant with the template's instructions plus the CSV
  const newAssistant = await openai.beta.assistants.create({
    name: "Code Structure Mapper",
    instructions: templateAssistant.instructions + "\n\nExpected structure CSV:\n" + csvContent,
    model: "gpt-4-turbo-preview",
  });

  return newAssistant.id;
}

export async function runAssistant(sourcePath: string, expectedStructurePath: string) {
  console.log(
    blue("\nRunning assistant to generate mappings for: " + sourcePath),
  );

  try {
    const sourceCode = await Deno.readTextFile(sourcePath);
    console.log(blue("Read source file successfully."));

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content: sourceCode,
      },
    );

    const assistantId = await createAssistantWithCSV(expectedStructurePath);
    console.log(blue("Created new assistant with expected structure CSV."));

    const run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      {
        assistant_id: assistantId,
      },
    );

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(
        thread.id,
      );

      const assistantMessage = messages.data.find((msg) =>
        msg.role === "assistant"
      );
      if (assistantMessage) {
        const content = assistantMessage.content[0] as {
          text: { value: string };
        };
        const response = content.text.value;
        console.log(blue("Assistant response received."));

        // Try to extract JSON from the response in different formats
        let mappingLines = null;
        
        // First try the code block format
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            const mappingJson = jsonMatch[1];
            console.log(blue("Extracted mapping JSON from code block:"));
            console.log(mappingJson);
            mappingLines = JSON.parse(mappingJson);
          } catch (error) {
            console.error(red(`Error parsing JSON from code block: ${error}`));
          }
        } 
        
        // If that fails, try to parse the entire response as JSON
        if (!mappingLines) {
          try {
            const jsonObj = JSON.parse(response);
            if (jsonObj.result && Array.isArray(jsonObj.result)) {
              console.log(blue("Extracted mapping from direct JSON response."));
              mappingLines = jsonObj.result;
            }
          } catch (error) {
            console.error(red(`Error parsing direct JSON response: ${error}`));
          }
        }
        
        // If we have valid mapping lines, write them to file
        if (mappingLines && Array.isArray(mappingLines)) {
          await Deno.writeTextFile("mapping.csv", mappingLines.join("\n"));
          console.log(
            blue(
              "Mapping file generated successfully with the following content:",
            ),
          );
          console.log(mappingLines.join("\n"));
        } else {
          // Fall back to default mappings from the fallback CSV
          const fallbackCsvPath = expectedStructurePath.replace(".csv", ".fallback.csv");
          try {
            const fallbackContent = await Deno.readTextFile(fallbackCsvPath);
            await Deno.writeTextFile("mapping.csv", fallbackContent);
            console.log(blue("Using fallback mapping from expected structure."));
          } catch (error) {
            console.error(red("No valid mapping found and fallback CSV not available."));
            Deno.exit(1);
          }
        }
      } else {
        console.error(red("No assistant message found."));
        Deno.exit(1);
      }
    } else {
      console.error(red(`Assistant run failed with status: ${run.status}`));
      Deno.exit(1);
    }
  } catch (error) {
    console.error(red(`Error running assistant: ${error}`));
    Deno.exit(1);
  }
}
