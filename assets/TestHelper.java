import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class TestHelper {
    private static final String MAPPING_FILE_NAME = "mapping.csv";

    private static Map<String, StructureEntityAlias> entityAliases;

    public static Object getPrivateField(Object obj, String fieldName) throws Exception {
        Field field = obj.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(obj);
    }

    public static Object invokePrivateMethod(Object objOrClass, String methodName, Class<?>[] paramTypes, Object... args) throws Exception {
        Class<?> clazz = (objOrClass instanceof Class) ? (Class<?>) objOrClass : objOrClass.getClass();
        Method method = clazz.getDeclaredMethod(methodName, paramTypes);
        method.setAccessible(true);

        boolean isStatic = java.lang.reflect.Modifier.isStatic(method.getModifiers());
        return method.invoke(isStatic ? null : objOrClass, args);
    }

    public static void setPrivateField(Object obj, String fieldName, Object value) throws Exception {
        Field field = obj.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(obj, value);
    }
    
    public static Object getPrivateStaticField(Class<?> clazz, String fieldName) throws Exception {
        Field field = clazz.getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(null);
    }
    
    public static void setPrivateStaticField(Class<?> clazz, String fieldName, Object value) throws Exception {
        Field field = clazz.getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(null, value);
    }

    public static String getMappedEntity(String entityName) {
        if(entityAliases == null) {
            try {
                entityAliases = new HashMap<>();
                Files.readAllLines(Path.of(MAPPING_FILE_NAME)).forEach(line -> {
                    String[] parts = line.split(",");
                    entityAliases.put(parts[0], new StructureEntityAlias(parts[0].trim(), parts[1].trim(), parts[2].trim()));
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return Optional.ofNullable(entityAliases.get(entityName)).map(StructureEntityAlias::alias).orElse(entityName);
    }

    public static record StructureEntityAlias(String expectedName, String alias, String type) {
    }
}
