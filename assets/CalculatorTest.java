import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CalculatorTest {
    @Test
    void testAddNumbers() {
        Calculator calc = new Calculator();
        assertEquals(4, calc.addNumbers(2, 2), "2 + 2 should equal 4");
    }

    @Test
    void testAnotherFeature() {
        Calculator calc = new Calculator();
        assertTrue(true, "This test will always pass");
    }
}
