const API_PRODUCTS = "/api/lab9/task1/products";

function formatPrice(cents) {
    return (cents / 100).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₽";
}

function updateCartCount() {
    let cart = localStorage.getItem('cart');
    if (!cart) cart = '{}';
    else cart = JSON.parse(cart);

    // Считаем общее количество товаров
    let count = Object.values(cart).reduce((a, b) => a + b, 0);
    document.getElementById('cartCount').textContent = count;
}


async function loadProducts() {
    const res = await fetch(API_PRODUCTS);
    const products = await res.json();
    document.getElementById('list').innerHTML = products.map(p => `
        <div class="product-card">
            <strong>${p.title}</strong><br>
            ${formatPrice(p.price)} | Остаток: ${p.amount} шт.<br>
            <button onclick="addToCart(${p.id}, ${p.amount})">Добавить в корзину</button>
        </div>
    `).join('');
}

function addToCart(id, stock) {
    let cart = JSON.parse(localStorage.getItem('cart') || '{}');
    if (!cart[id]) cart[id] = 1;
    else if (cart[id] < stock) cart[id]++;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

updateCartCount();
loadProducts();
