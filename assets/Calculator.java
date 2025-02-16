import java.io.IOException;
import java.util.EmptyStackException;
import javax.management.RuntimeErrorException;


// public class Calculator extends Object {
//     private String myField;
//     public boolean myInt;

//     public Calculator() {
//         this.myField = "default";
//         this.myInt = false;
//     }

//     public Calculator(String constructorField, boolean constructorInt) {
//         this.myField = constructorField;
//         this.myInt = constructorInt;
//     }

//     private boolean myMethod() throws RuntimeErrorException {
//         return false;
//     }
//     public void myMethod(int x) throws EmptyStackException {}

//     public int addNumbers(int a, int b) throws IOException {
//         return a + b;
//     }
// }

class SimpleClass {
    public String name;
    private int value;

    public SimpleClass() {
        this.name = "DefaultName";
        this.value = 0;
    }

    public SimpleClass(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public int getValue() {
        return value;
    }


    public int incrementValue() {
        this.value++;
        return 1;
    }

    public void reset() {
        this.name = "DefaultName";
        this.value = 0;
    }
}