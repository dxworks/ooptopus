
import java.io.IOException;
import java.util.EmptyStackException;
import javax.management.RuntimeErrorException;


public class Calculator extends Object implements Cloneable {
    private String myField;
    public boolean myInt;

    public Calculator() {
        this.myField = "default";
        this.myInt = false;
    }

    public Calculator(String constructorField, boolean constructorInt) {
        this.myField = constructorField;
        this.myInt = constructorInt;
    }

    public void myMethod() throws RuntimeErrorException {}
    public void myMethod(int x) throws EmptyStackException {}

    public int addNumbers(int a, int b) throws IOException {
        return a + b;
    }
}
