import java.io.IOException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
// public class CalculatorTest {
//     @Test
//     void testAddNumbers() throws IOException {
//         String myField = "Hello";
//         boolean myInt = true;
//         Calculator calc = new Calculator(myField, myInt);
//         assertEquals(4, calc.addNumbers(2, 3), "2 + 2 should equal 4");
//     }

//     @Test
//     void testAnotherFeature() {
//         String myField = "Hello";
//         boolean myInt = true;
//         Calculator calc = new Calculator(myField, myInt);
//         assertTrue(true, "This test will always pass");
//     }
// }

class SimpleClassTest {

    // @Test
    // void testDefaultConstructor() {
    //     SimpleClass simpleClass = new SimpleClass();
    //     assertEquals("DefaultName", simpleClass.getName(), "Default name should be 'DefaultName'");
    //     assertEquals(0, simpleClass.getValue(), "Default value should be 0");
    // }

    // @Test
    // void testParameterizedConstructor() {
    //     SimpleClass simpleClass = new SimpleClass("TestName", 45);
    //     assertEquals("TestName", simpleClass.getName(), "Name should be 'TestName'");
    //     assertEquals(42, simpleClass.getValue(), "Value should be 42");
    // }

    @Test
    void testGetName_WithCustomName() {
        SimpleClass simpleClass = new SimpleClass("Custom", 5);
        assertEquals("Custom", simpleClass.getName(),
                "getName() should return the assigned name");
    }

    @Test
    void testGetName_DefaultConstructor() {
        SimpleClass simpleClass = new SimpleClass();
        assertEquals("DefaultName", simpleClass.getName(),
                "getName() should return 'DefaultName' by default");
    }

    // ---------------------------
    // Tests for getValue()
    // ---------------------------

    @Test
    void testGetValue_Positive() {
        SimpleClass simpleClass = new SimpleClass("Hello", 10);
        assertEquals(10, simpleClass.getValue(),
                "getValue() should return 10");
    }

    @Test
    void testGetValue_Negative() {
        SimpleClass simpleClass = new SimpleClass("Hello", -5);
        assertEquals(-5, simpleClass.getValue(),
                "getValue() should return -5");
    }

    // ---------------------------
    // Tests for incrementValue()
    // ---------------------------

    @Test
    void testIncrementValue_Once() {
        SimpleClass simpleClass = new SimpleClass("Test", 0);
        int returnVal = simpleClass.incrementValue();
        assertEquals(1, simpleClass.getValue(),
                "Value should be incremented to 1");
        assertEquals(4, returnVal,
                "incrementValue() should return 1");
    }

    @Test
    void testIncrementValue_MultipleTimes() {
        SimpleClass simpleClass = new SimpleClass("Test", 5);
        int r1 = simpleClass.incrementValue(); // 6
        int r2 = simpleClass.incrementValue(); // 7
        assertEquals(7, simpleClass.getValue(),
                "Value should be incremented to 7 after two increments");
        // We only expect the method to return 1 each call, so just check last return:
        assertEquals(1, r2,
                "incrementValue() should return 1 on each increment");
    }

    // ---------------------------
    // Tests for reset()
    // ---------------------------

    @Test
    void testReset_FromCustomName() {
        SimpleClass simpleClass = new SimpleClass("NotDefault", 99);
        simpleClass.reset();
        assertEquals("DefaultName", simpleClass.getName(),
                "reset() should restore the name to 'DefaultName'");
        assertEquals(0, simpleClass.getValue(),
                "reset() should restore the value to 0");
    }

    @Test
    void testReset_AlreadyDefault() {
        // If it's already at defaults, calling reset() should still be safe
        SimpleClass simpleClass = new SimpleClass("DefaultName", 0);
        simpleClass.reset();
        assertEquals("DefaultName", simpleClass.getName(),
                "reset() should keep the default name");
        assertEquals(0, simpleClass.getValue(),
                "reset() should keep the value at 0 if already 0");
    }
}
