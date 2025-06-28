class Car {
    public String b;
    public int horsePower;
    public double price;

    public Car(String b, int hp, double p){
        this.b=b;
        this.horsePower=hp;
        this.price=p;
    }
    public Car(String brand, int horsePower){
        this.b=brand;
        this.horsePower=horsePower;
        this.price=19999.99;
    }
    public boolean equals(Object o){
        if(o instanceof Car){
            if ((this.b).equals(((Car)o).b)){
                return (this.horsePower==(((Car)o).horsePower));
            }
            else return false;
        }
        else{
            return false;
        }
    }
    public String toString(){
        return "Car with brand "+this.b+" and power "+ this.horsePower+" costs "+this.price+" EURO";
    }

}



class CarSet {
    public int size=5;
    public Car[] elements = new Car[size];
    public int capacity=0;

    public static int carsadded=0;
    public static int carsdeleted=0;
    public CarSet(int size){
        this.size=size;
    }

    public void addCar(Car car){
        for(int i=0; i<this.size; i++){
            if (this.elements[i]!=null){
                if (this.elements[i].equals(car)){
                    System.out.println("Allready added in the collection");
                    return ;
                }
            }
            if (capacity<size){
                elements[capacity]=car;
                this.capacity++;
                System.out.println("Car added");
                carsadded++;
                return ;
            }
            else{
                System.out.println("CarSet full");
                return ;
            }
        }
    }
    public Car removeCar(int index){
        Car temporary;
        if (index>=capacity){
            return null;
        }
        if (elements[index]==null){
            return null;
        }
        temporary=elements[index];
        elements[index]=null;
        carsdeleted++;
        return temporary;
    }
    public String toString(){
        String res="CarSet contains:\n";
        for (int i=0; i<capacity; i++){
            res=res+elements[i]+"\n";
        }
        return res;
    }

    CarSet intersection(CarSet other){
        int newcap=0;
        CarSet intersection= new CarSet(capacity);
        for(int i=0; i<capacity; i++){
            for (int j=0; j<other.elements.length; j++){
                if (elements[i].equals(other.elements[j])){
                    intersection.addCar(elements[i]);
                }
            }
        }
        return intersection;
    }
    static int getTotalCarsAdded(){
        return carsadded;
    }
    static int getTotalCarsDeleted(){
        return carsdeleted;
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
