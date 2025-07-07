let token = "";
let page = 1;
const limit = 5;

// Login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (data.token) {
    token = data.token;
    alert("Logged in successfully");
    fetchProducts();
    fetchCart();
  } else {
    alert("Login failed");
  }
}

// Fetch products with search and pagination
async function fetchProducts() {
  const search = document.getElementById("search").value;
  let url = `/api/products?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${search}`;
  }

  const res = await fetch(url);
  const products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach((p) => {
    container.innerHTML += `
      <div class="product">
        <h4>${p.name} - ₹${p.price}</h4>
        <p>${p.description}</p>
        <button onclick="addToCart('${p._id}')">Add to Cart</button>
      </div>
    `;
  });
}

function nextPage() {
  page++;
  fetchProducts();
}

function prevPage() {
  if (page > 1) {
    page--;
    fetchProducts();
  }
}

async function addToCart(productId) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity: 1 }),
  });

  const data = await res.json();
  alert(data.message || "Product added to cart");
  fetchCart();
}

async function fetchCart() {
  const res = await fetch("/api/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const cart = await res.json();
  const cartDiv = document.getElementById("cart");
  cartDiv.innerHTML = "<h3>Your Cart</h3>";

  if (cart.items.length === 0) {
    cartDiv.innerHTML += "<p>Your cart is empty.</p>";
    return;
  }

  cart.items.forEach((item) => {
    cartDiv.innerHTML += `
      <div class="cart-item">
        <p>${item.product.name} x ${item.quantity}</p>
        <div class="cart-controls">
          <button onclick="updateCart('${item._id}', ${item.quantity + 1})">+</button>
          <button onclick="updateCart('${item._id}', ${item.quantity - 1})">-</button>
          <button onclick="removeFromCart('${item._id}')">Remove</button>
        </div>
      </div>
    `;
  });

  cartDiv.innerHTML += `<br><button onclick="placeOrder()">Place Order</button>`;
}

async function updateCart(itemId, quantity) {
  if (quantity < 1) return;

  const res = await fetch(`/api/cart/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  const data = await res.json();
  alert(data.message || "Cart updated");
  fetchCart();
}

async function removeFromCart(itemId) {
  const res = await fetch(`/api/cart/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  alert(data.message || "Item removed");
  fetchCart();
}

async function placeOrder() {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  alert(data.message || "Order placed successfully");
  fetchCart();
}
