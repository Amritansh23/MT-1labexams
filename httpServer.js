import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2 },
  { id: 2, productName: "Keyboard", price: 1299, quantity: 1 },
  { id: 3, productName: "USB Cable", price: 199, quantity: 3 }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function isValidProduct(product) {
  return product &&
    Number.isInteger(Number(product.id)) &&
    String(product.productName ?? "").trim().length > 0 &&
    Number.isFinite(Number(product.price)) && Number(product.price) >= 0 &&
    Number.isInteger(Number(product.quantity)) && Number(product.quantity) > 0;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end("<h1>Welcome to Shopping Cart Management</h1><p>Node.js HTTP Server</p>");
  }

  if (req.method === "GET" && pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end("<h1>About</h1><p>A simple shopping cart application built with Node.js.</p>");
  }

  if (req.method === "GET" && pathname === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");
    return fs.readFile(filePath, "utf8", (err, html) => {
      if (err) {
        return sendJson(res, 500, { error: "Unable to read index.html" });
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  }

  if (req.method === "GET" && pathname === "/cart") {
    return sendJson(res, 200, cart);
  }

  if (req.method === "POST" && pathname === "/add-to-cart") {
    try {
      const product = await readJsonBody(req);
      if (!isValidProduct(product)) {
        return sendJson(res, 400, {
          error: "Required: integer id, productName, non-negative price and positive integer quantity"
        });
      }
      const newProduct = {
        id: Number(product.id),
        productName: String(product.productName).trim(),
        price: Number(product.price),
        quantity: Number(product.quantity)
      };
      if (cart.some(item => item.id === newProduct.id)) {
        return sendJson(res, 409, { error: "Product ID already exists" });
      }
      cart.push(newProduct);
      return sendJson(res, 201, { message: "Product added successfully", product: newProduct });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  return sendJson(res, 404, { error: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
