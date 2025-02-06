import java.io.IOException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
public class CalculatorTest {
    @Test
    void testAddNumbers() throws IOException {
        String myField = "Hello";
        boolean myInt = true;
        Calculator calc = new Calculator(myField, myInt);
        assertEquals(4, calc.addNumbers(2, 3), "2 + 2 should equal 4");
    }

    @Test
    void testAnotherFeature() {
        String myField = "Hello";
        boolean myInt = true;
        Calculator calc = new Calculator(myField, myInt);
        assertTrue(true, "This test will always pass");
    }
}

class SimpleClassTest {

    @Test
    void testDefaultConstructor() {
        SimpleClass simpleClass = new SimpleClass();
        assertEquals("DefaultName", simpleClass.getName(), "Default name should be 'DefaultName'");
        assertEquals(0, simpleClass.getValue(), "Default value should be 0");
    }

    @Test
    void testParameterizedConstructor() {
        SimpleClass simpleClass = new SimpleClass("TestName", 45);
        assertEquals("TestName", simpleClass.getName(), "Name should be 'TestName'");
        assertEquals(42, simpleClass.getValue(), "Value should be 42");
    }

    @Test
    void testIncrementValue() {
        SimpleClass simpleClass = new SimpleClass();
        simpleClass.incrementValue();
        assertEquals(1, simpleClass.getValue(), "Value should be incremented to 1");
    }

    @Test
    void testReset() {
        SimpleClass simpleClass = new SimpleClass("TestName", 42);
        simpleClass.reset();
        assertEquals("DefaultName", simpleClass.getName(), "Name should be reset to 'DefaultName'");
        assertEquals(0, simpleClass.getValue(), "Value should be reset to 0");
    }
}
