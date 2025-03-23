### Context

Given this requirement document:

```markdown
### Instructions for Implementing Car and CarSet Classes

#### **Task 1: Implement the `Car` Class**
Create a class named `Car` with the following characteristics:

- Each car has a `brand` (_String_), `horsepower` (_int_), and `price` (_double_).
- The `brand` and `horsepower` must be set when an object is created.
- The `price` can also be set during object creation, but if not provided, it should default to _19999.99_.
- Two cars are considered equal if they have the same `brand` and `horsepower`.
- When displaying information about a car, all its attributes should be shown in the following format:
  `Car with brand <brand> and power <horsepower> costs <price> euro.`
  where `<brand>`, `<horsepower>`, and `<price>` should be replaced with the actual values of the attributes.

---

#### **Task 2: Implement the `CarSet` Class**
Create a class named `CarSet` with the following characteristics:

- The elements of the set are stored in an **array** named `elements`, of type `Car[]`.
- The maximum number of elements the set can contain is given as a parameter in the constructor.

- Implement the following methods:

1. `void addCar(Car car)`
    - If the maximum capacity has been reached, display the message:
      ```
      CarSet full
      ```
    - If the car is already stored, display:
      ```
      Already added in the collection
      ```
    - If the car is not yet stored, add it and display:
      ```
      Car added
      ```

2. `Car removeCar(int carIndex)`
    - Removes the car at the given `carIndex` from the `elements` array and returns the removed `Car` object.
    - If an invalid index is provided, return `null`.

3. `void displayCars()`
    - Displays all cars in the set in the following format:
      ```
      CarSet contains:
      <car1>
      <car2>
      ...
      ```
      (Each car should be printed on a new line.)

4. `CarSet intersection(CarSet other)`
    - Returns a new `CarSet` object containing only the cars that are present in both the current set and the provided `other` set.

5. `int getTotalCarsAdded()`
    - Returns the total number of cars added across all `CarSet` objects.

6. `int getTotalCarsDeleted()`
    - Returns the total number of cars removed from all `CarSet` objects.

---

### **Implementation Guidelines**
- Use the provided template for implementation.
- **Create a file named `TestCars.java`** and copy the contents of the template into this file.
- Implement all functionalities inside `TestCars.java`. **Do not create multiple files.**
- The `CarSetClient` class contains a `main` method that you can use to verify your implementation.
- **Initially, leave the `main` method commented out** to avoid compilation errors due to unimplemented methods.
- Uncomment and run the `main` method after completing the implementation.

### **Submission Requirements**
- Ensure that the `TestCars.java` file is **compilable** before submission.
- Upload the completed `TestCars.java` file in the submission form.
- **If the uploaded file does not compile, the grade will be 1.**

```

And this perfect implementation template:
```java
import java.util.Arrays;

class Car {
    private String brand;
    private int horsepower;
    private double price;

    public Car(String brand, int horsepower) {
        this.brand = brand;
        this.horsepower = horsepower;
        this.price = 19999.99; // Default price
    }

    public Car(String brand, int horsepower, double price) {
        this.brand = brand;
        this.horsepower = horsepower;
        this.price = price;
    }

    public String getBrand() {
        return brand;
    }

    public int getHorsepower() {
        return horsepower;
    }

    public double getPrice() {
        return price;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Car car = (Car) obj;
        return horsepower == car.horsepower && brand.equals(car.brand);
    }

    @Override
    public String toString() {
        return "Car with brand " + brand + " and power " + horsepower + " costs " + price + " euro";
    }
}

class CarSet {
    private Car[] elements;
    private int count;
    private static int totalCarsAdded = 0;
    private static int totalCarsDeleted = 0;

    public CarSet(int maxSize) {
        elements = new Car[maxSize];
        count = 0;
    }

    public void addCar(Car car) {
        if (count >= elements.length) {
            System.out.println("CarSet full");
            return;
        }

        for (int i = 0; i < count; i++) {
            if (elements[i].equals(car)) {
                System.out.println("Already added in the collection");
                return;
            }
        }

        elements[count++] = car;
        totalCarsAdded++;
        System.out.println("Car added");
    }

    public Car removeCar(int carIndex) {
        if (carIndex < 0 || carIndex >= count) {
            return null;
        }

        Car removedCar = elements[carIndex];

        // Shift elements to remove the car at the given index
        for (int i = carIndex; i < count - 1; i++) {
            elements[i] = elements[i + 1];
        }
        elements[--count] = null; // Nullify the last position
        totalCarsDeleted++;

        return removedCar;
    }

    public void displayCars() {
        System.out.println("CarSet contains:");
        for (int i = 0; i < count; i++) {
            System.out.println(elements[i]);
        }
    }

    public CarSet intersection(CarSet other) {
        CarSet result = new CarSet(Math.min(this.count, other.count));

        for (int i = 0; i < this.count; i++) {
            for (int j = 0; j < other.count; j++) {
                if (this.elements[i].equals(other.elements[j])) {
                    result.addCar(this.elements[i]);
                    break;
                }
            }
        }
        return result;
    }

    public static int getTotalCarsAdded() {
        return totalCarsAdded;
    }

    public static int getTotalCarsDeleted() {
        return totalCarsDeleted;
    }
}

class TestCars {
    public static void main(String[] args) {
        // Uncomment this block after implementing the methods

        Car car1 = new Car("Toyota", 150);
        Car car2 = new Car("BMW", 200, 35000);
        Car car3 = new Car("Toyota", 150, 22000);
        Car car4 = new Car("Audi", 180, 40000);

        CarSet carSet1 = new CarSet(3);
        carSet1.addCar(car1);
        carSet1.addCar(car2);
        carSet1.addCar(car3); // Should print "Already added in the collection"
        carSet1.addCar(car4); // Should print "CarSet full"

        carSet1.displayCars();

        CarSet carSet2 = new CarSet(3);
        carSet2.addCar(car1);
        carSet2.addCar(car4);

        CarSet intersectionSet = carSet1.intersection(carSet2);
        intersectionSet.displayCars(); // Should only contain car1

        System.out.println("Total cars added: " + CarSet.getTotalCarsAdded());
        System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());

        Car removedCar = carSet1.removeCar(1);
        if (removedCar != null) {
            System.out.println("Removed car: " + removedCar);
        } else {
            System.out.println("Invalid index");
        }

        System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());
    }
}
```

I have this solution from a student:
```java
import java.util.Arrays;

class Car {
    private String brand;
    private int horsepower;
    private double price;

    public Car(String brand, int horsepower) {
        this.brand = brand;
        this.horsepower = horsepower;
        this.price = 19999.99; // Default price
    }

    public Car(String brand, int horsepower, double price) {
        this.brand = brand;
        this.horsepower = horsepower;
        this.price = price;
    }

    public String getBrand() {
        return brand;
    }

    public int getHorsepower() {
        return horsepower;
    }

    public double getPrice() {
        return price;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Car car = (Car) obj;
        return horsepower == car.horsepower && brand.equals(car.brand);
    }

    @Override
    public String toString() {
        return "Car with brand " + brand + " and power " + horsepower + " costs " + price + " euro";
    }
}

class CarSet {
    private Car[] elements;
    private int count;
    private static int totalCarsAdded = 0;
    private static int totalCarsDeleted = 0;

    public CarSet(int maxSize) {
        elements = new Car[maxSize];
        count = 0;
    }

    public void addCar(Car car) {
        if (count >= elements.length) {
            System.out.println("CarSet full");
            return;
        }

        for (int i = 0; i < count; i++) {
            if (elements[i].equals(car)) {
                System.out.println("Already added in the collection");
                return;
            }
        }

        elements[count++] = car;
        totalCarsAdded++;
        System.out.println("Car added");
    }

    public Car removeCar(int carIndex) {
        if (carIndex < 0 || carIndex >= count) {
            return null;
        }

        Car removedCar = elements[carIndex];

        // Shift elements to remove the car at the given index
        for (int i = carIndex; i < count - 1; i++) {
            elements[i] = elements[i + 1];
        }
        elements[--count] = null; // Nullify the last position
        totalCarsDeleted++;

        return removedCar;
    }

    public void displayCars() {
        System.out.println("CarSet contains:");
        for (int i = 0; i < count; i++) {
            System.out.println(elements[i]);
        }
    }

    public CarSet intersection(CarSet other) {
        CarSet result = new CarSet(Math.min(this.count, other.count));

        for (int i = 0; i < this.count; i++) {
            for (int j = 0; j < other.count; j++) {
                if (this.elements[i].equals(other.elements[j])) {
                    result.addCar(this.elements[i]);
                    break;
                }
            }
        }
        return result;
    }

    public static int getTotalCarsAdded() {
        return totalCarsAdded;
    }

    public static int getTotalCarsDeleted() {
        return totalCarsDeleted;
    }
}

class TestCars {
    public static void main(String[] args) {
        // Uncomment this block after implementing the methods

        Car car1 = new Car("Toyota", 150);
        Car car2 = new Car("BMW", 200, 35000);
        Car car3 = new Car("Toyota", 150, 22000);
        Car car4 = new Car("Audi", 180, 40000);

        CarSet carSet1 = new CarSet(3);
        carSet1.addCar(car1);
        carSet1.addCar(car2);
        carSet1.addCar(car3); // Should print "Already added in the collection"
        carSet1.addCar(car4); // Should print "CarSet full"

        carSet1.displayCars();

        CarSet carSet2 = new CarSet(3);
        carSet2.addCar(car1);
        carSet2.addCar(car4);

        CarSet intersectionSet = carSet1.intersection(carSet2);
        intersectionSet.displayCars(); // Should only contain car1

        System.out.println("Total cars added: " + CarSet.getTotalCarsAdded());
        System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());

        Car removedCar = carSet1.removeCar(1);
        if (removedCar != null) {
            System.out.println("Removed car: " + removedCar);
        } else {
            System.out.println("Invalid index");
        }

        System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());
    }
}

```
