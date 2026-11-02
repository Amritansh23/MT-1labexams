import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2, category: "Electronics" },
  { id: 2, productName: "Mechanical Keyboard", price: 2499, quantity: 1, category: "Electronics" },
  { id: 3, productName: "Water Bottle", price: 399, quantity: 2, category: "Lifestyle" }
];

function validProduct(data, requireAll = true) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const required = ["id", "productName", "price", "quantity"];
  if (requireAll && !required.every(key => Object.hasOwn(data, key))) return false;
  if (Object.hasOwn(data, "id") && !Number.isInteger(Number(data.id))) return false;
  if (Object.hasOwn(data, "productName") && !String(data.productName).trim()) return false;
  if (Object.hasOwn(data, "price") && (!Number.isFinite(Number(data.price)) || Number(data.price) < 0)) return false;
  if (Object.hasOwn(data, "quantity") && (!Number.isInteger(Number(data.quantity)) || Number(data.quantity) <= 0)) return false;
  return true;
}

function withTotal(item) {
  return { ...item, totalPrice: item.price * item.quantity };
}

// GET all products
app.get("/cart", (req, res) => {
  res.status(200).json(cart.map(withTotal));
});

// GET one product by ID
app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = cart.find(item => item.id === id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.status(200).json(withTotal(product));
});

// POST a new product
app.post("/cart", (req, res) => {
  const product = req.body;
  if (!validProduct(product, true)) {
    return res.status(400).json({
      error: "Valid id, productName, price and quantity are required"
    });
  }

  const newProduct = {
    id: Number(product.id),
    productName: String(product.productName).trim(),
    price: Number(product.price),
    quantity: Number(product.quantity),
    category: product.category ? String(product.category).trim() : "General"
  };

  if (cart.some(item => item.id === newProduct.id)) {
    return res.status(409).json({ error: "Product ID already exists" });
  }

  cart.push(newProduct);
  return res.status(201).json({
    message: "Product added successfully",
    product: withTotal(newProduct)
  });
});

// PUT updates product details (provided fields are updated)
app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = cart.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const updates = req.body;
  if (!validProduct(updates, false)) {
    return res.status(400).json({ error: "Invalid product details" });
  }
  if (Object.hasOwn(updates, "id") && Number(updates.id) !== id) {
    return res.status(400).json({ error: "Product ID cannot be changed" });
  }

  const updated = { ...cart[index] };
  if (Object.hasOwn(updates, "productName")) updated.productName = String(updates.productName).trim();
  if (Object.hasOwn(updates, "price")) updated.price = Number(updates.price);
  if (Object.hasOwn(updates, "quantity")) updated.quantity = Number(updates.quantity);
  if (Object.hasOwn(updates, "category")) updated.category = String(updates.category).trim();

  cart[index] = updated;
  return res.status(200).json({
    message: "Product updated successfully",
    product: withTotal(updated)
  });
});

// DELETE a product
app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = cart.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  const [deletedProduct] = cart.splice(index, 1);
  return res.status(200).json({
    message: "Product deleted successfully",
    product: withTotal(deletedProduct)
  });
});

// Invalid JSON / malformed request handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  return res.status(500).json({ error: "Internal server error" });
});

// Unknown endpoint
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
 