// ============================================
// PRODUCTS DATA
// ============================================
const products = [
    { id: 1, name: "🍎 Apple", price: 250, unit: "kg", image: "images/apple.png", category: "fruits" },
    { id: 2, name: "🍌 Banana", price: 120, unit: "dozen", image: "images/banana.png", category: "fruits" },
    { id: 3, name: "🥩 Beef Steak", price: 800, unit: "kg", image: "images/beef-steak.png", category: "meat" },
    { id: 4, name: "🥦 Broccoli", price: 150, unit: "kg", image: "images/broccoli.png", category: "vegetables" },
    { id: 5, name: "🥬 Cabbage", price: 60, unit: "kg", image: "images/cabbage.png", category: "vegetables" },
    { id: 6, name: "🥗 Capsicum", price: 90, unit: "kg", image: "images/capsicum.png", category: "vegetables" },
    { id: 7, name: "🥕 Carrot", price: 50, unit: "kg", image: "images/carrot.png", category: "vegetables" },
    { id: 8, name: "🥦 Cauliflower", price: 70, unit: "kg", image: "images/cauliflower.png", category: "vegetables" },
    { id: 9, name: "🍗 Chicken", price: 350, unit: "kg", image: "images/chicken.png", category: "meat" },
    { id: 10, name: "🍇 Green Grapes", price: 180, unit: "kg", image: "images/green grapes.png", category: "fruits" },
    { id: 11, name: "🍒 Lichi", price: 200, unit: "kg", image: "images/lichi.png", category: "fruits" },
    { id: 12, name: "🐟 Oily Fishes", price: 400, unit: "kg", image: "images/oily-fishes.png", category: "meat" },
    { id: 13, name: "🍊 Orange", price: 100, unit: "kg", image: "images/orange.png", category: "fruits" },
    { id: 14, name: "🌶️ Red Chillies", price: 40, unit: "kg", image: "images/red-chillies.png", category: "vegetables" },
    { id: 15, name: "🐟 Salmon Fish", price: 550, unit: "kg", image: "images/salmon-fish.png", category: "meat" },
    { id: 16, name: "🐟 Semon Fish", price: 300, unit: "kg", image: "images/semon-fish.png", category: "meat" },
    { id: 17, name: "🍓 Strawberry", price: 250, unit: "kg", image: "images/strawberry.png", category: "fruits" },
    { id: 18, name: "🍅 Tomato", price: 50, unit: "kg", image: "images/tomato.png", category: "vegetables" },
    { id: 19, name: "🍉 Watermelon", price: 120, unit: "kg", image: "images/watermelon.png", category: "fruits" }
];

let cart = [];

// ============================================
// CART FUNCTIONS
// ============================================
function saveCart() {
    localStorage.setItem('freshmart_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('freshmart_cart');
    if (saved) cart = JSON.parse(saved);
}

function addToCart(id) {
    let product = products.find(p => p.id === id);
    let item = cart.find(i => i.id === id);
    
    if (item) {
        item.quantity++;
        alert(product.name + " quantity increased");
    } else {
        cart.push({...product, quantity: 1});
        alert(product.name + " added to cart");
    }
    saveCart();
}

function removeFromCart(id) {
    for(let i = 0; i < cart.length; i++) {
        if(cart[i].id === id) {
            alert(cart[i].name + " removed");
            cart.splice(i, 1);
            break;
        }
    }
    saveCart();
    displayCart();
}

function updateQuantity(id, qty) {
    if(qty < 1) {
        removeFromCart(id);
        return;
    }
    for(let i = 0; i < cart.length; i++) {
        if(cart[i].id === id) {
            cart[i].quantity = qty;
            break;
        }
    }
    saveCart();
    displayCart();
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================
function displayProducts() {
    let container = document.getElementById('productsContainer');
    if(!container) return;
    container.innerHTML = '';
    
    for(let i = 0; i < products.length; i++) {
        let p = products[i];
        container.innerHTML += `
            <div class="card">
                <img src="${p.image}">
                <h3>${p.name}</h3>
                <p>Rs. ${p.price}/${p.unit}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        `;
    }
}

function displayCart() {
    let container = document.getElementById('cartContainer');
    if(!container) return;
    
    if(cart.length === 0) {
        container.innerHTML = "<p>Cart is empty</p>";
        return;
    }
    
    let total = 0;
    let html = '<table border="1"><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr>';
    
    for(let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `<tr>
            <td>${item.name}</td>
            <td>Rs. ${item.price}</td>
            <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)"></td>
            <td>Rs. ${itemTotal}</td>
            <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
        </tr>`;
    }
    
    html += `<tr><td colspan="3"><strong>Total</strong></td><td colspan="2"><strong>Rs. ${total}</strong></td></tr></table>
             <button onclick="checkout()">Checkout</button>`;
    container.innerHTML = html;
}

function filterProducts(category) {
    let container = document.getElementById('productsContainer');
    if(!container) return;
    container.innerHTML = '';
    
    for(let i = 0; i < products.length; i++) {
        let p = products[i];
        if(category === 'all' || p.category === category) {
            container.innerHTML += `
                <div class="card">
                    <img src="${p.image}">
                    <h3>${p.name}</h3>
                    <p>Rs. ${p.price}/${p.unit}</p>
                    <button onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            `;
        }
    }
}

function displayFeatured() {
    let container = document.getElementById('featuredProducts');
    if(!container) return;
    container.innerHTML = '';
    
    for(let i = 0; i < 4; i++) {
        let p = products[i];
        container.innerHTML += `
            <div class="card">
                <img src="${p.image}">
                <h3>${p.name}</h3>
                <p>Rs. ${p.price}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        `;
    }
}

function goToCategory(cat) {
    localStorage.setItem('selectedCategory', cat);
    window.location.href = 'products.html';
}

function checkout() {
    if(confirm("Proceed to checkout?")) {
        alert("Thank you for your order!");
        cart = [];
        saveCart();
        displayCart();
    }
}

// ============================================
// PAGE START
// ============================================
loadCart();

let path = window.location.pathname;
if(path.includes('products.html')) {
    let saved = localStorage.getItem('selectedCategory');
    if(saved) {
        filterProducts(saved);
        localStorage.removeItem('selectedCategory');
    } else {
        displayProducts();
    }
} else if(path.includes('cart.html')) {
    displayCart();
} else if(path.includes('index.html') || path === '/' || path.endsWith('/')) {
    displayFeatured();
}