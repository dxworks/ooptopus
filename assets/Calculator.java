public class Calculator extends Object implements MyInterface {
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

    public void myMethod() {}
    public void myMethod(int x) {}

    public int addNumbers(int a, int b) {
        return a + b;
    }
}
