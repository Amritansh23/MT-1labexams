# MT1-LABEXAM — Shopping Cart Management

## Requirements
- Node.js and npm
- Postman (for API testing)
- Git (for GitHub submission)

## Setup
```bash
npm install
```

## Run Part A: built-in HTTP + FS modules
```bash
npm run http
```
Open `http://localhost:3000/`, `/cart`, `/about`, and `/home`.

Test adding an item with Postman:
- Method: POST
- URL: `http://localhost:3000/add-to-cart`
- Body → raw → JSON:
```json
{
  "id": 4,
  "productName": "Bluetooth Speaker",
  "price": 1499,
  "quantity": 1
}
```

## Run Part B: Express CRUD API
Open a second terminal:
```bash
npm run express
```
The API runs at `http://localhost:4000`.

| Method | URL | Purpose |
|---|---|---|
| GET | `/cart` | Get all products |
| GET | `/cart/1` | Get product with ID 1 |
| POST | `/cart` | Add a product |
| PUT | `/cart/1` | Update product 1 |
| DELETE | `/cart/1` | Delete product 1 |

Example POST body:
```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```

Example PUT body:
```json
{
  "productName": "Wireless Mouse",
  "price": 899,
  "quantity": 3,
  "category": "Electronics"
}
```

Each Express cart response includes `totalPrice = price × quantity`.

## GitHub submission
Create a GitHub repository named `MT1-LABEXAM`, then from this folder run:
```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```
After completing and testing each module, commit the changes:
```bash
git add .
git commit -m "Implement Node HTTP server and FS routing"
git push
```
```bash
git add .
git commit -m "Implement Express shopping cart CRUD API"
git push
```

## Screenshots to save in `screenshots/`
1. HTTP server running in terminal.
2. Browser showing `http://localhost:3000/home`.
3. Postman GET `/cart`.
4. Postman GET `/cart/1`.
5. Postman POST `/cart`.
6. Postman PUT `/cart/1`.
7. Postman DELETE `/cart/1`.
8. GitHub repository and commit history.

Note: Data is stored in JavaScript arrays, so changes reset when the server restarts. The HTTP server and Express server have separate arrays and run independently, as required.
