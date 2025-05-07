public class FashionItem {
    private String name;
    private double price;

    public FashionItem(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String getDetails() {
        return name + " costs " + price + " USD";
    }
}

public class Clothing extends FashionItem {
    private String size;
    private boolean isUnisex;

    public Clothing(String name, double price, String size, boolean isUnisex) {
        super(name, price);
        this.size = size;
        this.isUnisex = isUnisex;
    }

    @Override
    public String getDetails() {
        return super.getDetails() + ", size: " + size + ", unisex: " + isUnisex;
    }
}

public class FashionCatalog {
    private FashionItem[] items;
    private int count;

    public FashionCatalog(int capacity) {
        items = new FashionItem[capacity];
        count = 0;
    }

    public void addItem(FashionItem item) throws Exception {
        if (item == null) {
            throw new IllegalArgumentException("Cannot add null item.");
        }
        if (count >= items.length) {
            throw new Exception("Catalog is full.");
        }
        items[count++] = item;
    }

    public FashionItem getItem(int index) {
        if (index < 0 || index >= count) {
            return null;
        }
        return items[index];
    }

    public int getClothingCount() {
        int clothingCount = 0;
        for (int i = 0; i < count; i++) {
            if (items[i] instanceof Clothing) {
                clothingCount++;
            }
        }
        return clothingCount;
    }

    public int getTotalItems() {
        return count;
    }
}
