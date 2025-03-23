import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class CarAndCarSetTest {

    @BeforeEach
    public void resetCounters() throws Exception {
        try {
            Field carsAddedField = CarSet.class.getField(TestHelper.getMappedEntity("CarSet.totalCarsAdded"));
            carsAddedField.set(null, 0);

            Field carsDeletedField = CarSet.class.getField(TestHelper.getMappedEntity("CarSet.totalCarsDeleted"));
            carsDeletedField.set(null, 0);
        } catch (NoSuchFieldException e) {
            TestHelper.setPrivateStaticField(CarSet.class, TestHelper.getMappedEntity("CarSet.totalCarsAdded"), 0);
            TestHelper.setPrivateStaticField(CarSet.class, TestHelper.getMappedEntity("CarSet.totalCarsDeleted"), 0);
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
    public void testCarEquals() throws Exception {
        Car car1 = new Car("Toyota", 120, 25000.0);
        Car car2 = new Car("Toyota", 120, 30000.0);
        // Different price but same brand & horsepower => equals should be true
        String equalsMethodName = TestHelper.getMappedEntity("Car.equals");
        Method equalsMethod = car1.getClass().getMethod(equalsMethodName, Object.class);
        boolean result = (boolean) equalsMethod.invoke(car1, car2);
        assertTrue(result);
        Car car3 = new Car("BMW", 120, 25000.0);
        boolean result2 = (boolean) equalsMethod.invoke(car1, car3);
        assertFalse(result2); // Different brand => false

        // Compare Car object to a non-Car type => false
        boolean result3 = (boolean) equalsMethod.invoke(car1, "some string");
        assertFalse(result3);
    }

    @Test
    public void testCarToString() throws Exception {
        Car car = new Car("Toyota", 120, 25000.0);
        String expected = "CAR WITH BRAND Toyota AND POWER 120 COSTS 25000.0 EURO";
        String toStringMethodName = TestHelper.getMappedEntity("Car.toString");
        Method toStringMethod = car.getClass().getMethod(toStringMethodName);
        String result = (String) toStringMethod.invoke(car);
        assertTrue(result.trim().equalsIgnoreCase(expected.trim()));
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
            Field elementsField = CarSet.class.getField(TestHelper.getMappedEntity("CarSet.elements"));
            elements = (Car[]) elementsField.get(set);

        } catch (NoSuchFieldException e) {
            elements = (Car[]) TestHelper.getPrivateField(set, (TestHelper.getMappedEntity("CarSet.elements")));
        }

        String getTotalCarsAddedMethodName = TestHelper.getMappedEntity("CarSet.getTotalCarsAdded");


        String addCarMethodName = TestHelper.getMappedEntity("CarSet.addCar");
        Method addCarMethod = set.getClass().getMethod(addCarMethodName, Car.class);
        addCarMethod.invoke(set, car1);

        assertEquals(car1, elements[0]);
        int carsAdded1 = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsAddedMethodName, new Class[]{}, new Object[]{});
        assertEquals(1, carsAdded1);

        // Try adding a duplicate car -> should not increment capacity or carsadded
        addCarMethod.invoke(set, car2);
        int carsAdded2 = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsAddedMethodName, new Class[]{}, new Object[]{});
        assertEquals(1, carsAdded2);

        // Add a different car
        addCarMethod.invoke(set, car3);
        assertEquals(car3, elements[1]);
        int carsAdded3 = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsAddedMethodName, new Class[]{}, new Object[]{});
        assertEquals(2, carsAdded3);

        // Try adding when set is full
        Car car4 = new Car("Audi", 150);
        addCarMethod.invoke(set, car4);
        int carsAdded4 = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsAddedMethodName, new Class[]{}, new Object[]{});
        assertEquals(2, carsAdded4);
    }

    // 3. Test removeCar(int)
    @Test
    public void testCarSetRemoveCar() throws Exception {
        CarSet set = new CarSet(3);
        Car car1 = new Car("Toyota", 120);
        Car car2 = new Car("BMW", 100);
        set.addCar(car1);
        set.addCar(car2);

        String removeCarMethodName = TestHelper.getMappedEntity("CarSet.removeCar");
        Method removeCarMethod = set.getClass().getMethod(removeCarMethodName, int.class);

        String getTotalCarsDeletedMethodName = TestHelper.getMappedEntity("CarSet.getTotalCarsDeleted");


        // Remove first car
        Car removed = (Car) removeCarMethod.invoke(set, 0);
        assertEquals(car1, removed);
        int carsDeleted1 = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsDeletedMethodName, new Class[]{}, new Object[]{});
        assertEquals(1, carsDeleted1);


        // Removing at out-of-bounds index
        Object nullRemoved2 = removeCarMethod.invoke(set, 5);
        assertNull(nullRemoved2);

        // Cars deleted should still be 1
        int carsDeleted2 = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsDeletedMethodName, new Class[]{}, new Object[]{});
        assertEquals(1, carsDeleted2);
    }

    // 4. Test toString()
    @Test
    public void testToStringWithMultipleCars() throws Exception {
        CarSet set = new CarSet(3);
        Car car1 = new Car("Toyota", 120);
        Car car2 = new Car("BMW", 150);

        String addCarMethodName = TestHelper.getMappedEntity("CarSet.addCar");
        Method addCarMethod = set.getClass().getMethod(addCarMethodName, Car.class);
        addCarMethod.invoke(set, car1);
        addCarMethod.invoke(set, car2);

        String toStringMethodName = TestHelper.getMappedEntity("CarSet.toString");
        Method toStringMethod = set.getClass().getMethod(toStringMethodName);
        String result = (String) toStringMethod.invoke(set);

        // Get car toString methods for comparison
        String carToStringMethodName = TestHelper.getMappedEntity("Car.toString");
        Method carToStringMethod = car1.getClass().getMethod(carToStringMethodName);
        String car1String = (String) carToStringMethod.invoke(car1);
        String car2String = (String) carToStringMethod.invoke(car2);

        // Ensure the string starts with "CarSet contains:" followed by the individual car descriptions
        assertTrue(result.toLowerCase().startsWith("carset contains:") || result.toLowerCase().startsWith("car set contains:"));
        assertTrue(result.contains(car1String));
        assertTrue(result.contains(car2String));
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

        String addCarMethodName = TestHelper.getMappedEntity("CarSet.addCar");
        Method addCarMethod = set1.getClass().getMethod(addCarMethodName, Car.class);

        // Add cars using reflection
        addCarMethod.invoke(set1, car1);
        addCarMethod.invoke(set1, car3);
        addCarMethod.invoke(set2, car2);
        addCarMethod.invoke(set2, car4);

        String intersectionMethodName = TestHelper.getMappedEntity("CarSet.intersection");

        // Invoke intersection method
        CarSet result = (CarSet) TestHelper.invokePrivateMethod(set1, intersectionMethodName, new Class[]{CarSet.class}, set2);

        Car[] elements = null;
        int count = 0;
        String brand = "";
        int horsePower = 0;

        try {
            // Try direct access first
//            Field countField = CarSet.class.getField((TestHelper.getMappedEntity("CarSet.count")));
//            count = (int) countField.get(result);

            Field elementsField = CarSet.class.getField((TestHelper.getMappedEntity("CarSet.elements")));
            elements = (Car[]) elementsField.get(result);

            Field brandField = Car.class.getField((TestHelper.getMappedEntity("Car.brand")));
            brand = (String) brandField.get(elements[0]);

            Field hpField = Car.class.getField((TestHelper.getMappedEntity("Car.horsepower")));
            horsePower = (int) hpField.get(elements[0]);
        } catch (NoSuchFieldException e) {
            // Fields are private, use TestHelper
//            count = (int) TestHelper.getPrivateField(result, (TestHelper.getMappedEntity("CarSet.count")));
            elements = (Car[]) TestHelper.getPrivateField(result, (TestHelper.getMappedEntity("CarSet.elements")));
            brand = (String) TestHelper.getPrivateField(elements[0], (TestHelper.getMappedEntity("Car.brand")));
            horsePower = (int) TestHelper.getPrivateField(elements[0], (TestHelper.getMappedEntity("Car.horsepower")));
        }
        // Should only have the one Toyota(120) in common
//        assertEquals(1, count);
        assertEquals("Toyota", brand);
        assertEquals(120, horsePower);
    }

    // 6. Test getTotalCarsAdded()
    @Test
    public void testCarSetGetTotalCarsAdded() throws Exception {
        CarSet set = new CarSet(2);
        String getTotalCarsAddedMethodName = TestHelper.getMappedEntity("CarSet.getTotalCarsAdded");
        int initialCount = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsAddedMethodName, new Class[]{}, new Object[]{});

        assertEquals(0, initialCount);

        Car car1 = new Car("Toyota", 120);
        String addCarMethodName = TestHelper.getMappedEntity("CarSet.addCar");
        Method addCarMethod = set.getClass().getMethod(addCarMethodName, Car.class);
        addCarMethod.invoke(set, car1);

        int afterFirstAdd = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsAddedMethodName, new Class[]{}, new Object[]{});
        assertEquals(1, afterFirstAdd);

        Car car2 = new Car("Toyota", 120); // duplicate => won't increment
        addCarMethod.invoke(set, car2);
        int afterDuplicateAdd = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsAddedMethodName, new Class[]{}, new Object[]{});
        assertEquals(1, afterDuplicateAdd);

        Car car3 = new Car("BMW", 200);
        addCarMethod.invoke(set, car3);
        int afterSecondAdd = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsAddedMethodName, new Class[]{}, new Object[]{});
        assertEquals(2, afterSecondAdd);
    }

    // 7. Test getTotalCarsDeleted()
    @Test
    public void testCarSetGetTotalCarsDeleted() throws Exception {
        CarSet set = new CarSet(2);
        Car car1 = new Car("Toyota", 120);
        Car car2 = new Car("BMW", 150);
        String addCarMethodName = TestHelper.getMappedEntity("CarSet.addCar");
        Method addCarMethod = set.getClass().getMethod(addCarMethodName, Car.class);
        addCarMethod.invoke(set, car1);
        addCarMethod.invoke(set, car2);

        Car[] elements = null;

        try {
            Field elementsField = CarSet.class.getField((TestHelper.getMappedEntity("CarSet.elements")));
            elements = (Car[]) elementsField.get(set);
        } catch (NoSuchFieldException e) {
            elements = (Car[]) TestHelper.getPrivateField(set, (TestHelper.getMappedEntity("CarSet.elements")));
        }

        String getTotalCarsDeletedMethodName = TestHelper.getMappedEntity("CarSet.getTotalCarsDeleted");
        int initialDeleted = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsDeletedMethodName, new Class[]{}, new Object[]{});
        assertEquals(0, initialDeleted);

        String removeCarMethodName = TestHelper.getMappedEntity("CarSet.removeCar");
        Method removeCarMethod = set.getClass().getMethod(removeCarMethodName, int.class);

        removeCarMethod.invoke(set, 0);
        int afterFirstRemove = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsDeletedMethodName, new Class[]{}, new Object[]{});
        assertEquals(1, afterFirstRemove);

        Object secondRemoved = removeCarMethod.invoke(set, 0);

        if (secondRemoved == null && elements.length > 1 && elements[1] != null) {
            removeCarMethod.invoke(set, 1);
        }
        int afterSecondRemove = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsDeletedMethodName, new Class[]{}, new Object[]{});
        assertEquals(2, afterSecondRemove);

        // Out-of-bounds or null removal won't increment
        removeCarMethod.invoke(set, 5);
        int afterOutOfBoundsRemove = (int) TestHelper.invokePrivateMethod(CarSet.class, getTotalCarsDeletedMethodName, new Class[]{}, new Object[]{});
        assertEquals(2, afterOutOfBoundsRemove);
    }

}
