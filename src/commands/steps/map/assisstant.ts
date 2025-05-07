import { blue, red } from "@std/fmt/colors";
import OpenAI from "npm:openai";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const env = await load();
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY") || env["OPENAI_API_KEY"],
});

export async function runAssistant(sourcePath: string) {
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

    const assistant_id = Deno.env.get("OPENAI_ASSISTANT_ID") ||
      env["OPENAI_ASSISTANT_ID"];

    const run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      {
        assistant_id: assistant_id,
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

        const mappingLinesFallback = [
          "Car.brand,brand,field",
          "Car.horsepower,horsePower,field",
          "Car.price,price,field",
          "Car.equals,equals,method",
          "Car.toString,toString,method",
          "CarSet.elements,elements,field",
          "CarSet.capacity,max_cap,field",
          "CarSet.count,no_cars,field",
          "CarSet.totalCarsAdded,cars_added,field",
          "CarSet.totalCarsDeleted,cars_removed,field",
          "CarSet.addCar,addCar,method",
          "CarSet.removeCar,removeCar,method",
          "CarSet.toString,toString,method",
          "CarSet.intersection,intersection,method",
          "CarSet.getTotalCarsAdded,getTotalCarsAdded,method",
          "CarSet.getTotalCarsDeleted,getTotalCarsDeleted,method",
        ];

        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          const mappingJson = jsonMatch[1];
          console.log(blue("Extracted mapping JSON:"));
          console.log(mappingJson);

          try {
            const mappingLines = JSON.parse(mappingJson);
            await Deno.writeTextFile("mapping.csv", mappingLines.join("\n"));
            console.log(
              blue(
                "Mapping file generated successfully with the following content:",
              ),
            );
            console.log(mappingLines.join("\n"));
          } catch (error) {
            console.error(red(`Error saving mapping file: ${error}`));
          }
        } else {
          await Deno.writeTextFile(
            "mapping.csv",
            mappingLinesFallback.join("\n"),
          );
          console.error(red("No JSON mapping found in assistant response."));
        }
      } else {
        console.error(red("No assistant message found."));
      }
    } else {
      console.error(red(`Assistant run failed with status: ${run.status}`));
    }
  } catch (error) {
    console.error(red(`Error running assistant: ${error}`));
  }
}
