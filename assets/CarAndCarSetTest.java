import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

public class CarAndCarSetTest {

    @BeforeEach
    public void resetCounters() throws Exception {
        try {
            Field carsAddedField = CarSet.class.getField("CarsAdded");
            carsAddedField.set(null, 0);

            Field carsDeletedField = CarSet.class.getField("CarsDeleted");
            carsDeletedField.set(null, 0);
        } catch (NoSuchFieldException e) {
            // Field is private, use TestHelper
            TestHelper.setPrivateStaticField(CarSet.class, "CarsAdded", 0);
            TestHelper.setPrivateStaticField(CarSet.class, "CarsDeleted", 0);
        }
    }

    // ------------------- Tests for Car class -------------------

//    @Test
//    void testCarConstructorNoPrice() {
//        Car car = new Car("Tesla", 350);
//        assertEquals("Tesla", car.getBrand(), "Brand should match constructor argument.");
//        assertEquals(350, car.getHorsepower(), "Horsepower should match constructor argument.");
//        assertEquals(19999.99, car.getPrice(), 0.0001, "Default price should be 19999.99.");
//    }
//
//    @Test
//    void testCarConstructorWithPrice() {
//        Car car = new Car("Audi", 200, 45000.0);
//        assertEquals("Audi", car.getBrand());
//        assertEquals(200, car.getHorsepower());
//        assertEquals(45000.0, car.getPrice(), 0.0001, "Price should match constructor argument.");
//    }

    @Test
    public void testCarEquals() {
        Car car1 = new Car("Toyota", 120, 25000.0);
        Car car2 = new Car("Toyota", 120, 30000.0);
        // Different price but same brand & horsepower => equals should be true
        assertTrue(car1.equals(car2));

        Car car3 = new Car("BMW", 120, 25000.0);
        assertFalse(car1.equals(car3)); // Different brand => false

        // Compare Car object to a non-Car type => false
        assertFalse(car1.equals("some string"));
    }

    @Test
    public void testCarToString() {
        Car car = new Car("Toyota", 120, 25000.0);
        String expected = "CAR WITH BRAND Toyota AND POWER 120 COSTS 25000.0 EURO";
        assertTrue(car.toString().trim().equalsIgnoreCase(expected.trim()));
    }

    // ------------------- Tests for CarSet class -------------------

//    @Test
//    void testCarSetConstructor() {
//        CarSet carSet = new CarSet(2);
//        assertNotNull(carSet, "CarSet object should be created successfully.");
//    }

    // 2. Test addCar(Car)
    @Test
    public void testCarSetAddCar() throws Exception {
        CarSet set = new CarSet(2);
        Car car1 = new Car("Toyota", 120);
        Car car2 = new Car("Toyota", 120); // same brand & hp => equals() returns true
        Car car3 = new Car("BMW", 100);

        Car[] elements = null;
        int count = 0;

        try {
            Field elementsField = CarSet.class.getField("elements");
            elements = (Car[]) elementsField.get(set);

        } catch (NoSuchFieldException e) {
            // Fields are private, use TestHelper
            elements = (Car[]) TestHelper.getPrivateField(set, "elements");
        }

        // Add first car
        set.addCar(car1);
        assertEquals(car1, elements[0]);
        assertEquals(1, CarSet.getTotalCarsAdded());

        // Try adding a duplicate car -> should not increment capacity or carsadded
        set.addCar(car2);
        assertEquals(1, CarSet.getTotalCarsAdded());

        // Add a different car
        set.addCar(car3);
        assertEquals(car3, elements[1]);
        assertEquals(2, CarSet.getTotalCarsAdded());

        // Try adding when set is full
        Car car4 = new Car("Audi", 150);
        set.addCar(car4);
        assertEquals(2, CarSet.getTotalCarsAdded());
    }

    // 3. Test removeCar(int)
    @Test
    public void testCarSetRemoveCar() throws Exception {
        CarSet set = new CarSet(3);
        Car car1 = new Car("Toyota", 120);
        Car car2 = new Car("BMW", 100);
        set.addCar(car1);
        set.addCar(car2);

        Car[] elements = null;
        try {
            Field elementsField = CarSet.class.getField("elements");
            elements = (Car[]) elementsField.get(set);
        } catch (NoSuchFieldException e) {
            // Field is private, use TestHelper
            elements = (Car[]) TestHelper.getPrivateField(set, "elements");
        }


        // Remove first car
        Car removed = set.removeCar(0);
        assertEquals(car1, removed);
        assertNull(elements[0]);
        assertEquals(1, CarSet.getTotalCarsDeleted());

        // Removing again at same index -> should be null
        assertNull(set.removeCar(0));

        // Removing at out-of-bounds index
        assertNull(set.removeCar(5));
    }

    // 4. Test toString()
    @Test
    public void testToStringWithMultipleCars() {
        CarSet set = new CarSet(3);
        Car car1 = new Car("Toyota", 120);
        Car car2 = new Car("BMW", 150);
        set.addCar(car1);
        set.addCar(car2);

        String result = set.toString();

        // Ensure the string starts with "CarSet contains:" followed by the individual car descriptions
        assertTrue(result.toLowerCase().startsWith("carset contains:\n".toLowerCase()));
        assertTrue(result.contains(car1.toString()));
        assertTrue(result.contains(car2.toString()));
    }

    // 5. Test intersection(CarSet)
    @Test
    public void testCarSetIntersection() throws Exception {
        CarSet set1 = new CarSet(3);
        CarSet set2 = new CarSet(3);

        Car car1 = new Car("Toyota", 120, 25000.0);
        Car car2 = new Car("Toyota", 120, 30000.0); // equals to car1 by brand & hp
        Car car3 = new Car("BMW", 100, 20000.0);
        Car car4 = new Car("Mercedes", 150, 40000.0);

        set1.addCar(car1);
        set1.addCar(car3);
        set2.addCar(car2);
        set2.addCar(car4);

        CarSet result = set1.intersection(set2);
        Car[] elements = null;
        int count = 0;
        String brand = "";
        int horsePower = 0;

        try {
            // Try direct access first
            Field countField = CarSet.class.getField("maxCapacity");
            count = (int) countField.get(result);

            Field elementsField = CarSet.class.getField("elements");
            elements = (Car[]) elementsField.get(result);

            Field brandField = Car.class.getField("brand");
            brand = (String) brandField.get(elements[0]);

            Field hpField = Car.class.getField("horsePower");
            horsePower = (int) hpField.get(elements[0]);
        } catch (NoSuchFieldException e) {
            // Fields are private, use TestHelper
            count = (int) TestHelper.getPrivateField(result, "maxCapacity");
            elements = (Car[]) TestHelper.getPrivateField(result, "elements");
            brand = (String) TestHelper.getPrivateField(elements[0], "brand");
            horsePower = (int) TestHelper.getPrivateField(elements[0], "horsePower");
        }
        // Should only have the one Toyota(120) in common
        assertEquals(1, count);
        assertEquals("Toyota", brand);
        assertEquals(120, horsePower);
    }

    // 6. Test getTotalCarsAdded()
    @Test
    public void testCarSetGetTotalCarsAdded() {
        CarSet set = new CarSet(2);
        assertEquals(0, CarSet.getTotalCarsAdded());

        Car car1 = new Car("Toyota", 120);
        set.addCar(car1);
        assertEquals(1, CarSet.getTotalCarsAdded());

        Car car2 = new Car("Toyota", 120); // duplicate => won't increment
        set.addCar(car2);
        assertEquals(1, CarSet.getTotalCarsAdded());

        Car car3 = new Car("BMW", 200);
        set.addCar(car3);
        assertEquals(2, CarSet.getTotalCarsAdded());
    }

    // 7. Test getTotalCarsDeleted()
    @Test
    public void testCarSetGetTotalCarsDeleted() {
        CarSet set = new CarSet(2);
        Car car1 = new Car("Toyota", 120);
        Car car2 = new Car("BMW", 150);
        set.addCar(car1);
        set.addCar(car2);

        assertEquals(0, CarSet.getTotalCarsDeleted());

        set.removeCar(0);
        assertEquals(1, CarSet.getTotalCarsDeleted());

        set.removeCar(1);
        assertEquals(2, CarSet.getTotalCarsDeleted());

        // Out-of-bounds or null removal won't increment
        set.removeCar(5);
        assertEquals(2, CarSet.getTotalCarsDeleted());
    }

}
