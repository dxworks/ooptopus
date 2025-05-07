////import java.util.Arrays;
////
////class Car {
////    private String brand;
////    private int horsepower;
////    private double price;
////
////    public Car(String brand, int horsepower) {
////        this.brand = brand;
////        this.horsepower = horsepower;
////        this.price = 19999.99; // Default price
////    }
////
////    public Car(String brand, int horsepower, double price) {
////        this.brand = brand;
////        this.horsepower = horsepower;
////        this.price = price;
////    }
////
////    public String getBrand() {
////        return brand;
////    }
////
////    public int getHorsepower() {
////        return horsepower;
////    }
////
////    public double getPrice() {
////        return price;
////    }
////
////    @Override
////    public boolean equals(Object obj) {
////        if (this == obj) return true;
////        if (obj == null || getClass() != obj.getClass()) return false;
////        Car car = (Car) obj;
////        return horsepower == car.horsepower && brand.equals(car.brand);
////    }
////
////    @Override
////    public String toString() {
////        return "Car with brand " + brand + " and power " + horsepower + " costs " + price + " euro";
////    }
////}
////
////class CarSet {
////    private Car[] elements;
////    private int count;
////    private static int totalCarsAdded = 0;
////    private static int totalCarsDeleted = 0;
////
////    public CarSet(int maxSize) {
////        elements = new Car[maxSize];
////        count = 0;
////    }
////
////    public void addCar(Car car) {
////        if (count >= elements.length) {
////            System.out.println("CarSet full");
////            return;
////        }
////
////        for (int i = 0; i < count; i++) {
////            if (elements[i].equals(car)) {
////                System.out.println("Already added in the collection");
////                return;
////            }
////        }
////
////        elements[count++] = car;
////        totalCarsAdded++;
////        System.out.println("Car added");
////    }
////
////    public Car removeCar(int carIndex) {
////        if (carIndex < 0 || carIndex >= count) {
////            return null;
////        }
////
////        Car removedCar = elements[carIndex];
////
////        // Shift elements to remove the car at the given index
////        for (int i = carIndex; i < count - 1; i++) {
////            elements[i] = elements[i + 1];
////        }
////        elements[--count] = null; // Nullify the last position
////        totalCarsDeleted++;
////
////        return removedCar;
////    }
////
////    public void displayCars() {
////        System.out.println("CarSet contains:");
////        for (int i = 0; i < count; i++) {
////            System.out.println(elements[i]);
////        }
////    }
////
////    public CarSet intersection(CarSet other) {
////        CarSet result = new CarSet(Math.min(this.count, other.count));
////
////        for (int i = 0; i < this.count; i++) {
////            for (int j = 0; j < other.count; j++) {
////                if (this.elements[i].equals(other.elements[j])) {
////                    result.addCar(this.elements[i]);
////                    break;
////                }
////            }
////        }
////        return result;
////    }
////
////    public static int getTotalCarsAdded() {
////        return totalCarsAdded;
////    }
////
////    public static int getTotalCarsDeleted() {
////        return totalCarsDeleted;
////    }
////}
////
////class TestCars {
////    public static void main(String[] args) {
////        // Uncomment this block after implementing the methods
////
////        Car car1 = new Car("Toyota", 150);
////        Car car2 = new Car("BMW", 200, 35000);
////        Car car3 = new Car("Toyota", 150, 22000);
////        Car car4 = new Car("Audi", 180, 40000);
////
////        CarSet carSet1 = new CarSet(3);
////        carSet1.addCar(car1);
////        carSet1.addCar(car2);
////        carSet1.addCar(car3); // Should print "Already added in the collection"
////        carSet1.addCar(car4); // Should print "CarSet full"
////
////        carSet1.displayCars();
////
////        CarSet carSet2 = new CarSet(3);
////        carSet2.addCar(car1);
////        carSet2.addCar(car4);
////
////        CarSet intersectionSet = carSet1.intersection(carSet2);
////        intersectionSet.displayCars(); // Should only contain car1
////
////        System.out.println("Total cars added: " + CarSet.getTotalCarsAdded());
////        System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());
////
////        Car removedCar = carSet1.removeCar(1);
////        if (removedCar != null) {
////            System.out.println("Removed car: " + removedCar);
////        } else {
////            System.out.println("Invalid index");
////        }
////
////        System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());
////    }
////}
////
//
//
//class Car {
//    public String brand;
//    public int horsePower;
//    public double price;
//
//    public Car(String b, int hp)
//    {
//        brand=b;
//        horsePower=hp;
//        price=19999.99;
//    }
//
//    public Car(String b, int hp, double p)
//    {
//        brand=b;
//        horsePower=hp;
//        price=p;
//    }
//
//
//    public boolean equals(Object o)
//    {
//        if (o instanceof Car)
//        {
//            return this.brand.equals(((Car)o).brand) && this.horsePower==((Car)o).horsePower;
//        }
//        else
//        {
//            return false;
//        }
//    }
//
//    public String toString()
//    {
//        String s="";
//        s="Car with brand "+this.brand+" and power "+this.horsePower+" costs "+this.price+" EURO ";
//        return s;
//    }
//
//    public void print()
//    {
//        System.out.println(this.toString());
//    }
//
//
//}
//
//
//
//class CarSet {
//    public Car[] elements;
//    public int nrel;
//    public static int contor=0;
//    public static int contor1=0;
//
//
//    public CarSet(int maxelem)
//    {
//        elements=new Car[maxelem];
//        nrel=0;
//    }
//
//    public void addCar(Car car){
//        boolean valdeadv=false;
//        if(nrel==elements.length)
//        {
//            System.out.println("CarSet full");
//        }
//        else
//        {
//            for(int i=0; i<nrel; i++)
//            {
//                if(elements[i].equals(car))
//                {
//                    System.out.println("Already added in the collection");
//                    valdeadv=true;
//                    break;
//                }
//            }
//            if(valdeadv==false)
//            {
//                elements[nrel]=car;
//                nrel++;
//                contor++;
//                System.out.println("Car added");
//            }
//        }
//    }
//
//    public Car removeCar(int carIndex){
//        if(carIndex<=nrel)
//        {
//            Car t=elements[carIndex];
//            for(int i=carIndex; i<nrel-1; i++)
//            {
//                elements[i]=elements[i+1];
//            }
//            nrel--;
//            contor1++;
//            return t;
//        }
//        return null;
//    }
//
//    public String toString()
//    {
//        String s="CarSet contains:\n";
//        for(int i=0; i<this.nrel; i++)
//        {
//            s=s+this.elements[i].toString();
//            s=s+"\n";
//        }
//        return s;
//    }
//
//    public CarSet intersection(CarSet other)
//    {
//        CarSet newcarset=new CarSet(this.elements.length+other.elements.length);
//        for(int i=0; i<this.nrel; i++)
//        {
//            newcarset.addCar(this.elements[i]);
//        }
//        for(int i=0; i<other.nrel; i++)
//        {
//            newcarset.addCar(other.elements[i]);
//        }
//        return newcarset;
//    }
//
//    public static int getTotalCarsAdded()
//    {
//        return contor;
//    }
//
//    public static int getTotalCarsDeleted()
//    {
//        return contor1;
//    }
//
//}
//
//class CarSetClient {
//
//    public static void main(String[] args) {
//        Car car1 = new Car("Toyota", 120);
//        Car car2 = new Car("Honda", 150, 25000.50);
//        Car car3 = new Car("Ford", 200);
//        Car car4 = new Car("Toyota", 120);
//
//        CarSet carSet1 = new CarSet(5);
//        CarSet carSet2 = new CarSet(2);
//
//        carSet1.addCar(car1);
//        carSet1.addCar(car2);
//        carSet1.addCar(car3);
//        carSet1.addCar(car4);
//
//        carSet2.addCar(car2);
//        carSet2.addCar(car3);
//        carSet2.addCar(car1);
//
//        System.out.println("CarSet1:");
//        System.out.println(carSet1);
//
//        System.out.println("CarSet2:");
//        System.out.println(carSet2);
//
//        CarSet intersectionSet = carSet1.intersection(carSet2);
//        System.out.println("Intersection of CarSet1 and CarSet2:");
//        System.out.println(intersectionSet);
//
//        Car removedCar = carSet1.removeCar(1);
//        System.out.println("CarSet1 after removing a car:");
//        System.out.println(carSet1);
//        System.out.println("Removed car is a Honda: " + removedCar.equals(car2));
//
//        System.out.println("Total cars added: " + CarSet.getTotalCarsAdded());
//        System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());
//    }
//
//}
class Car
{
    String brand;
    int horsePower;
    double price;

    public Car (String b, int h, double p)
    {
        brand = b;
        horsePower = h;
        price = p;
    }

    public Car (String b, int h)
    {
        brand = b;
        horsePower = h;
        price = 19999.99;
    }

    public boolean equals (Object obj)
    {
        if (obj instanceof Car)
        {
            return ((this.brand.equals(((Car)obj).brand)) && (this.horsePower == ((Car)obj).horsePower));
        }
        else
        {
            return false;
        }
    }

    public String toString ()
    {
        return "Car with brand " + brand + " and power " + horsePower + " costs " + price + " EURO";
    }

}



class CarSet
{
    Car [] elements = new Car [10000];
    int max_elements;

    int counter = 0;

    static int cars_added = 0;
    static int carse_deleted = 0;

    public CarSet (int n)
    {
        max_elements = n;
    }

    public void addCar (Car car)
    {
        if (counter < max_elements)
        {
            int k = 1;
            for (int i = 0; i < counter; i++)
            {
                if (elements[i].equals(car))
                {
                    System.out.println("Already added in the collection");
                    k = 0;
                }
            }

            if (k == 1)
            {
                elements [counter] = car;
                counter ++;
                System.out.println("Car added");
                cars_added ++;
            }
        }
        else
        {
            System.out.println ("CarSet full");
        }
    }

    public Car removeCar (int carIndex)
    {
        if (carIndex < counter)
        {
            Car c;
            c = elements [carIndex];

            elements [carIndex] = null;

            for (int i = carIndex; i < counter - 1; i++)
            {
                elements [i] = elements [i+1];
            }

            counter --;

            carse_deleted ++;

            return c;
        }
        else
        {
            return null;
        }

    }

    public String toString ()
    {
        String s = "CarSet contains:\n";

        for (int i = 0; i < counter; i++)
        {
            s += elements[i].toString();
            s+= "\n";
        }

        return s;
    }

    public CarSet intersection (CarSet other)
    {
        CarSet s = new CarSet (counter);

        for (int i = 0; i < counter; i++)
        {
            for (int j = 0; j < other.counter; j++)
            {
                if (elements[i].equals(other.elements[j]))
                {
                    s.elements[s.counter] = elements[i];
                    s.counter ++;
                }
            }
        }

        return s;
    }

    public static int getTotalCarsAdded ()
    {
        return cars_added;
    }

    public static int getTotalCarsDeleted ()
    {
        return carse_deleted;
    }

}



class CarSetClient {


    public static void main(String[] args) {
        Car car1 = new Car("Toyota", 120);
        Car car2 = new Car("Honda", 150, 25000.50);
        Car car3 = new Car("Ford", 200);
        Car car4 = new Car("Toyota", 120);

        CarSet carSet1 = new CarSet(5);
        CarSet carSet2 = new CarSet(2);

        carSet1.addCar(car1);
        carSet1.addCar(car2);
        carSet1.addCar(car3);
        carSet1.addCar(car4);

        carSet2.addCar(car2);
        carSet2.addCar(car3);
        carSet2.addCar(car1);

        System.out.println("CarSet1:");
        System.out.println(carSet1);

        System.out.println("CarSet2:");
        System.out.println(carSet2);

        CarSet intersectionSet = carSet1.intersection(carSet2);
        System.out.println("Intersection of CarSet1 and CarSet2:");
        System.out.println(intersectionSet);

        Car removedCar = carSet1.removeCar(1);
        System.out.println("CarSet1 after removing a car:");
        System.out.println(carSet1);
        System.out.println("Removed car is a Honda: " + removedCar.equals(car2));

        System.out.println("Total cars added: " + CarSet.getTotalCarsAdded());
        System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());
    }

}
