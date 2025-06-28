import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class FashionTest {

    @Test
    public void testGetDetailsFromFashionItem() throws Exception {
        Object item = Class.forName("FashionItem").getConstructor(String.class, double.class).newInstance("Scarf", 19.99);
        String method = TestHelper.getMappedEntity("FashionItem.getDetails");
        String result = (String) TestHelper.invokePrivateMethod(item, method, new Class[]{});
        assertTrue(result.contains("Scarf"));
        assertTrue(result.contains("19.99"));
    }

    @Test
    public void testGetDetailsFromClothing() throws Exception {
        Object clothing = Class.forName("Clothing").getConstructor(String.class, double.class, String.class, boolean.class)
                .newInstance("T-Shirt", 25.0, "M", true);
        String method = TestHelper.getMappedEntity("Clothing.getDetails");
        String result = (String) TestHelper.invokePrivateMethod(clothing, method, new Class[]{});
        assertTrue(result.contains("T-Shirt"));
        assertTrue(result.contains("size: M"));
        assertTrue(result.contains("unisex: true"));
    }

    @Test
    public void testAddItemToCatalog() throws Exception {
        Class<?> catalogClass = Class.forName("FashionCatalog");
        Object catalog = catalogClass.getConstructor(int.class).newInstance(2);
        Object item = Class.forName("FashionItem").getConstructor(String.class, double.class).newInstance("Hat", 15.5);
        String method = TestHelper.getMappedEntity("FashionCatalog.addItem");
        TestHelper.invokePrivateMethod(catalog, method, new Class[]{Class.forName("FashionItem")}, item);
        int count = (int) TestHelper.invokePrivateMethod(catalog, TestHelper.getMappedEntity("FashionCatalog.getTotalItems"), new Class[]{});
        assertEquals(1, count);
    }

    @Test
    public void testAddNullThrows() throws Exception {
        Object catalog = Class.forName("FashionCatalog").getConstructor(int.class).newInstance(1);
        String method = TestHelper.getMappedEntity("FashionCatalog.addItem");
        assertThrows(IllegalArgumentException.class, () -> {
            try {
                TestHelper.invokePrivateMethod(catalog, method, new Class[]{Class.forName("FashionItem")}, new Object[]{null});
            } catch (Exception e) {
                throw e.getCause();
            }
        });
    }

    @Test
    public void testAddItemBeyondCapacityThrows() throws Exception {
        Class<?> catalogClass = Class.forName("FashionCatalog");
        Object catalog = catalogClass.getConstructor(int.class).newInstance(1);
        Object item = Class.forName("FashionItem").getConstructor(String.class, double.class).newInstance("Socks", 5.0);
        String method = TestHelper.getMappedEntity("FashionCatalog.addItem");
        TestHelper.invokePrivateMethod(catalog, method, new Class[]{Class.forName("FashionItem")}, item);
        Object another = Class.forName("FashionItem").getConstructor(String.class, double.class).newInstance("Gloves", 10.0);
        assertThrows(Exception.class, () -> {
            try {
                TestHelper.invokePrivateMethod(catalog, method, new Class[]{Class.forName("FashionItem")}, another);
            } catch (Exception e) {
                throw e.getCause();
            }
        });
    }

    @Test
    public void testGetItemValidAndInvalid() throws Exception {
        Object catalog = Class.forName("FashionCatalog").getConstructor(int.class).newInstance(2);
        Object item = Class.forName("FashionItem").getConstructor(String.class, double.class).newInstance("Belt", 20.0);
        TestHelper.invokePrivateMethod(catalog, TestHelper.getMappedEntity("FashionCatalog.addItem"),
                new Class[]{Class.forName("FashionItem")}, item);
        Object retrieved = TestHelper.invokePrivateMethod(catalog,
                TestHelper.getMappedEntity("FashionCatalog.getItem"),
                new Class[]{int.class}, 0);
        assertEquals(item, retrieved);

        Object invalid = TestHelper.invokePrivateMethod(catalog,
                TestHelper.getMappedEntity("FashionCatalog.getItem"),
                new Class[]{int.class}, 5);
        assertNull(invalid);
    }

    @Test
    public void testClothingCount() throws Exception {
        Object catalog = Class.forName("FashionCatalog").getConstructor(int.class).newInstance(3);
        Object c1 = Class.forName("Clothing").getConstructor(String.class, double.class, String.class, boolean.class)
                .newInstance("Shirt", 30.0, "L", false);
        Object c2 = Class.forName("FashionItem").getConstructor(String.class, double.class).newInstance("Ring", 100.0);
        String addMethod = TestHelper.getMappedEntity("FashionCatalog.addItem");
        TestHelper.invokePrivateMethod(catalog, addMethod, new Class[]{Class.forName("FashionItem")}, c1);
        TestHelper.invokePrivateMethod(catalog, addMethod, new Class[]{Class.forName("FashionItem")}, c2);
        int clothingCount = (int) TestHelper.invokePrivateMethod(catalog,
                TestHelper.getMappedEntity("FashionCatalog.getClothingCount"),
                new Class[]{});
        assertEquals(1, clothingCount);
    }
}
