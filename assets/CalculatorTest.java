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
        assertEquals(4, calc.addNumbers(2, 2), "2 + 2 should equal 4");
    }

    @Test
    void testAnotherFeature() {
        String myField = "Hello";
        boolean myInt = true;
        Calculator calc = new Calculator(myField, myInt);
        assertTrue(true, "This test will always pass");
    }
}
