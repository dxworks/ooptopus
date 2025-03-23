import {blue, red} from "@std/fmt/colors";
import OpenAI from "npm:openai";

const openai = new OpenAI({apiKey: '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'});

// const thread = await openai.beta.threads.create();

// const message = await openai.beta.threads.messages.create(
//     thread.id,
//     {
//       role: "user",
//       content: 
//       `class Car { 
//     private String brand;
//     private int horsePower;
//     private double price;

//     public Car(String b,int hp, double p)
//     {
//         brand=b;
//         horsePower=hp;
//         price=p;
//     }

//     public Car(String b, int hp)
//     {
//         this(b,hp,19999.99);
//     }

//     public boolean equals(Object c)
//     {
//         return (c instanceof Car) && (brand.equals(((Car)c).brand)) && (horsePower==((Car)c).horsePower);
//     }

//     public String toString()
//     {
//         return "Car with brand " + brand + " and power " + horsePower + " costs " + price + " EURO";
//     }

// } 


// class CarSet {
//     private static int cars_added=0;
//     private static int cars_removed=0;
//     private Car[] elements;
//     private int max_cap;
//     private int no_cars;

//     public CarSet(int cap)
//     {
//         elements=new Car[cap];
//         max_cap=cap;
//         no_cars=0;
//     }
//     public CarSet()
//     {
//         this(5);
//     }

//     public void addCar(Car car)
//     {
//         if(no_cars>=max_cap)
//         {
//             System.out.println("CarSet full");
//             return;
//         }

//         for(int i=0;i<no_cars;i++)
//         {
//             if(elements[i].equals(car))
//             {
//                 System.out.println("Alredy added in the collection");
//                 return;
//             }
//         }

//         cars_added++;
//         elements[no_cars]=car;
//         System.out.println("Car added");
//         no_cars++;
//     }

//     public Car removeCar(int carIndex)
//     {
//         Car to_remove = elements[carIndex]; //Probabil ca daca sterg elementul din carIndex se duce si to_remove

//         if(carIndex>=no_cars)
//             return null;

//         for(int i=carIndex;i<no_cars-1;i++)
//         {
//             elements[i]=elements[i+1];
//         }
//         no_cars--;
//         cars_removed++;
//         return to_remove;
//     }

//     public CarSet intersection(CarSet cs)
//     {
//         int new_cap;
//         if(max_cap>cs.max_cap)
//             new_cap=cs.max_cap;
//         else
//             new_cap=max_cap;
//         CarSet return_Set=new CarSet(new_cap);

//         boolean should_add;
//         for(int i=0;i<no_cars;i++)
//         {
//             should_add=false;
//             for(int j=0;j<cs.no_cars;j++)
//             {
//                 if( elements[i].equals(cs.elements[j]) )
//                 {
//                     should_add=true;
//                 }
//             }
//             if(should_add)
//             {
//                 return_Set.addCar(elements[i]);
//             }
//         }
//         return return_Set;
//     }

//     public static int getTotalCarsAdded()
//     {
//         return cars_added;
//     }
//     public static int getTotalCarsDeleted()
//     {
//         return cars_removed;
//     }

//     public String toString()
//     {
//         String s="CarSet contains\n";
//         for(int i=0;i<no_cars;i++)
//         {
//             s = s + (elements[i]).toString() + "\n";
//         }
//         return s;
//     }

// } 

// class CarSetClient { 


//     public static void main(String[] args) { 
//         Car car1 = new Car("Toyota", 120); 
//         Car car2 = new Car("Honda", 150, 25000.50); 
//         Car car3 = new Car("Ford", 200); 
//         Car car4 = new Car("Toyota", 120); 


//         CarSet carSet1 = new CarSet(5); 
//         CarSet carSet2 = new CarSet(2); 

//         carSet1.addCar(car1); 
//         carSet1.addCar(car2); 
//         carSet1.addCar(car3); 
//         carSet1.addCar(car4); 

//         carSet2.addCar(car2); 
//         carSet2.addCar(car3); 
//         carSet2.addCar(car1); 


//         System.out.println("CarSet1:"); 
//         System.out.println(carSet1); 

//         System.out.println("CarSet2:"); 
//         System.out.println(carSet2); 


//         CarSet intersectionSet = carSet1.intersection(carSet2); 
//         System.out.println("Intersection of CarSet1 and CarSet2:"); 
//         System.out.println(intersectionSet); 

//         Car removedCar = carSet1.removeCar(1);  
//         System.out.println("CarSet1 after removing a car:"); 
//         System.out.println(carSet1); 
//         System.out.println("Removed car is a Honda: " + removedCar.equals(car2)); 

//         System.out.println("Total cars added: " + CarSet.getTotalCarsAdded()); 
//         System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());
//     } 

// } 
// class Car { 
//     private String brand;
//     private int horsePower;
//     private double price;

//     public Car(String b,int hp, double p)
//     {
//         brand=b;
//         horsePower=hp;
//         price=p;
//     }

//     public Car(String b, int hp)
//     {
//         this(b,hp,19999.99);
//     }

//     public boolean equals(Object c)
//     {
//         return (c instanceof Car) && (brand.equals(((Car)c).brand)) && (horsePower==((Car)c).horsePower);
//     }

//     public String toString()
//     {
//         return "Car with brand " + brand + " and power " + horsePower + " costs " + price + " EURO";
//     }

// } 


// class CarSet {
//     private static int cars_added=0;
//     private static int cars_removed=0;
//     private Car[] elements;
//     private int max_cap;
//     private int no_cars;

//     public CarSet(int cap)
//     {
//         elements=new Car[cap];
//         max_cap=cap;
//         no_cars=0;
//     }
//     public CarSet()
//     {
//         this(5);
//     }

//     public void addCar(Car car)
//     {
//         if(no_cars>=max_cap)
//         {
//             System.out.println("CarSet full");
//             return;
//         }

//         for(int i=0;i<no_cars;i++)
//         {
//             if(elements[i].equals(car))
//             {
//                 System.out.println("Alredy added in the collection");
//                 return;
//             }
//         }

//         cars_added++;
//         elements[no_cars]=car;
//         System.out.println("Car added");
//         no_cars++;
//     }

//     public Car removeCar(int carIndex)
//     {
//         Car to_remove = elements[carIndex]; //Probabil ca daca sterg elementul din carIndex se duce si to_remove

//         if(carIndex>=no_cars)
//             return null;

//         for(int i=carIndex;i<no_cars-1;i++)
//         {
//             elements[i]=elements[i+1];
//         }
//         no_cars--;
//         cars_removed++;
//         return to_remove;
//     }

//     public CarSet intersection(CarSet cs)
//     {
//         int new_cap;
//         if(max_cap>cs.max_cap)
//             new_cap=cs.max_cap;
//         else
//             new_cap=max_cap;
//         CarSet return_Set=new CarSet(new_cap);

//         boolean should_add;
//         for(int i=0;i<no_cars;i++)
//         {
//             should_add=false;
//             for(int j=0;j<cs.no_cars;j++)
//             {
//                 if( elements[i].equals(cs.elements[j]) )
//                 {
//                     should_add=true;
//                 }
//             }
//             if(should_add)
//             {
//                 return_Set.addCar(elements[i]);
//             }
//         }
//         return return_Set;
//     }

//     public static int getTotalCarsAdded()
//     {
//         return cars_added;
//     }
//     public static int getTotalCarsDeleted()
//     {
//         return cars_removed;
//     }

//     public String toString()
//     {
//         String s="CarSet contains\n";
//         for(int i=0;i<no_cars;i++)
//         {
//             s = s + (elements[i]).toString() + "\n";
//         }
//         return s;
//     }

// } 

// class CarSetClient { 


//     public static void main(String[] args) { 
//         Car car1 = new Car("Toyota", 120); 
//         Car car2 = new Car("Honda", 150, 25000.50); 
//         Car car3 = new Car("Ford", 200); 
//         Car car4 = new Car("Toyota", 120); 


//         CarSet carSet1 = new CarSet(5); 
//         CarSet carSet2 = new CarSet(2); 

//         carSet1.addCar(car1); 
//         carSet1.addCar(car2); 
//         carSet1.addCar(car3); 
//         carSet1.addCar(car4); 

//         carSet2.addCar(car2); 
//         carSet2.addCar(car3); 
//         carSet2.addCar(car1); 


//         System.out.println("CarSet1:"); 
//         System.out.println(carSet1); 

//         System.out.println("CarSet2:"); 
//         System.out.println(carSet2); 


//         CarSet intersectionSet = carSet1.intersection(carSet2); 
//         System.out.println("Intersection of CarSet1 and CarSet2:"); 
//         System.out.println(intersectionSet); 

//         Car removedCar = carSet1.removeCar(1);  
//         System.out.println("CarSet1 after removing a car:"); 
//         System.out.println(carSet1); 
//         System.out.println("Removed car is a Honda: " + removedCar.equals(car2)); 

//         System.out.println("Total cars added: " + CarSet.getTotalCarsAdded()); 
//         System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());
//     } 

// } 
// `
//     }
//   );

//   const assistant_id = 'asst_KdHbJLDfuA1ydaeYdcIad2n6'

//   let run = await openai.beta.threads.runs.createAndPoll(
//     thread.id,
//     { 
//       assistant_id: assistant_id
//     }
//   );

// if (run.status === 'completed') {
//   const messages = await openai.beta.threads.messages.list(
//     run.thread_id
//   );
//   for (const message of messages.data.reverse()) {
//     console.log(`${message.role} > ${message.content[0].text.value}`);
//   }
// } else {
//   console.log(run.status);
// }

export async function runAssistant(sourcePath: string) {
    console.log(blue("\nRunning assistant to generate mappings for: " + sourcePath));

    try {
        // Read the source file
        const sourceCode = await Deno.readTextFile(sourcePath);
        console.log(blue("Read source file successfully."));

        // Create thread and send message with the actual source code
        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                content: sourceCode
            }
        );

        const assistant_id = 'asst_KdHbJLDfuA1ydaeYdcIad2n6';

        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            {
                assistant_id: assistant_id
            }
        );

        // After you receive the response from the assistant
        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
                thread.id
            );

            // Extract the mapping from the assistant's response
            const assistantMessage = messages.data.find(msg => msg.role === "assistant");
            if (assistantMessage) {
                const response = assistantMessage.content[0].text.value;
                console.log(blue("Assistant response received."));

                // Output the entire response for debugging
                console.log(response);

                // Create a basic mapping based on the expected structure
                // This is a fallback if the AI doesn't generate structured mapping
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
                    "CarSet.getTotalCarsDeleted,getTotalCarsDeleted,method"
                ];

                // Write to the mapping.csv file

                const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch && jsonMatch[1]) {
                    const mappingJson = jsonMatch[1];
                    console.log(blue("Extracted mapping JSON:"));
                    console.log(mappingJson);

                    try {
                        const mappingLines = JSON.parse(mappingJson);
                        await Deno.writeTextFile("mapping.csv", mappingLines.join("\n"));
                        console.log(blue("Mapping file generated successfully with the following content:"));
                        console.log(mappingLines.join("\n"));
                    } catch (error) {
                        console.error(red(`Error saving mapping file: ${error}`));
                    }
                } else {
                    await Deno.writeTextFile("mapping.csv", mappingLinesFallback.join("\n"));
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
