class Car {
    private String brand;
    private int horsePower;
    private double price;

    public Car(String brand, int horsePower){
        this.brand=brand;
        this.horsePower=horsePower;
        this.price=19999.99;
    }

    public Car(String brand, int horsePower, double price){
        this.brand=brand;
        this.horsePower=horsePower;
        this.price=price;
    }

    public boolean equals(Object o){
        if(o instanceof Car){
            return ((this.brand.equals(((Car)o).brand)) && (this.horsePower==((Car)o).horsePower));
        }
        else{
            return false;
        }
    }

    public String toString(){
        return "Car with brand "+this.brand+" and power "+this.horsePower+" costs "+this.price+" EURO\n";
    }


}



class CarSet {
    private Car[] elements;
    private int maxCapacity;
    private int count;
    private static int CarsAdded=0;
    private static int CarsDeleted=0;

    public CarSet(int maxCapacity){
        this.maxCapacity=maxCapacity;
        elements=new Car[maxCapacity];
        count=0;
    }

    public void addCar(Car car){
        if(count>=maxCapacity){
            System.out.println("CarSet full");
        }
        else{
            int ok=1;
            for(int i=0;i<count && ok==1;i++){
                if(elements[i].equals(car)){
                    ok=0;
                }
            }
            if(ok==0){
                System.out.println("Already added in the collection");
            }
            else{
                elements[count]=car;
                count++;
                System.out.println("Car added");
            }
        }
    }

    public Car removeCar(int carIndex){
        if(carIndex<0 || carIndex>count){
            return null;
        }
        Car removedCar;
        for(int i=0;i<count;i++){
            if(carIndex==i){
                removedCar=elements[i];
                for(int j=i;j<count;j++){
                    elements[j]=elements[j+1];
                }
                CarsDeleted++;
                count--;
                return removedCar;
            }
        }
        return null;

    }

    public String toString(){
        StringBuffer result=new StringBuffer();
        for(int i=0;i<count;i++){
            result.append(elements[i]).append(" ");
        }
        return result.toString();
    }

    public CarSet intersection(CarSet other){
        int intersCapacity=Math.min(this.maxCapacity,other.maxCapacity);
        CarSet result=new CarSet(intersCapacity);
        int notNullFirst=0, notNullSecond=0;
        for(int i=0;i<this.maxCapacity;i++){
            if(this.elements[i]!=null){
                notNullFirst++;
            }
        }
        for(int i=0;i<other.maxCapacity;i++){
            if(other.elements[i]!=null){
                notNullSecond++;
            }
        }

        for(int i=0;i<notNullFirst;i++){
            for(int j=0;j<notNullSecond;j++){
                if((this.elements[i]).equals(other.elements[j])){
                    result.addCar(other.elements[j]);
                    CarsAdded++;
                }
            }
        }
        return result;
    }

    public static int getTotalCarsAdded(){
        return CarsAdded;
    }

    public static int getTotalCarsDeleted(){
        return CarsDeleted;
    }
}



class CarSetClient {



    public static void main(String[] args) {
        Car car1 = new Car("Toyota", 120);
        Car car2 = new Car("Honda", 150, 25000.50);
        Car car3 = new Car("Ford", 200);
        Car car4 = new Car("Toyota", 120);

        System.out.println(car1);

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

        System.out.println(carSet1.intersection(carSet2));
        System.out.println("Total cars added: " + CarSet.getTotalCarsAdded());
        System.out.println("Total cars deleted: " + CarSet.getTotalCarsDeleted());
    }


}
