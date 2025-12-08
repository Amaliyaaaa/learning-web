const API_PRODUCTS = "/api/lab9/task1/products";
const API_BUY = "/api/lab9/task3/buy"; // Эндпоинт покупки на backend

let cart = JSON.parse(localStorage.getItem('cart') || '{}');

function formatPrice(cents) {
    return (cents / 100).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₽";
}

async function loadCart() {
    if (!Object.keys(cart).length) {
        document.getElementById('cartList').textContent = "Корзина пуста";
        document.getElementById('total').textContent = "0 ₽";
        return;
    }

    const res = await fetch(API_PRODUCTS);
    const products = await res.json();
    let total = 0;

    const html = products.filter(p => cart[p.id])
        .map(p => {
            const qty = cart[p.id];
            total += qty * p.price;
            return `
                <div class="product-card">
                    <strong>${p.title}</strong><br>
                    ${formatPrice(p.price)} x 
                    <input type="number" min="1" max="5" value="${qty}" onchange="updateQty(${p.id}, this.value, ${p.amount})">
                    | Остаток: ${p.amount} шт.
                    <button onclick="removeFromCart(${p.id})">Удалить</button>
                </div>
            `;
        }).join('');

    document.getElementById('cartList').innerHTML = html;
    document.getElementById('total').textContent = formatPrice(total);
}

function updateQty(id, value, stock) {
    value = Math.max(1, Math.min(5, Number(value)));
    value = Math.min(value, stock);
    cart[id] = value;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeFromCart(id) {
    delete cart[id];
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

async function checkout() {
    const res = await fetch(API_PRODUCTS);
    const products = await res.json();
    let ok = true;
    let messages = [];

    for (const id in cart) {
        const product = products.find(p => p.id == id);
        if (!product) continue;
        const qty = cart[id];
        if (qty > product.amount) {
            messages.push(`${product.title}: доступно ${product.amount} шт.`);
            ok = false;
        }
    }

    if (!ok) {
        alert("Недостаточно товара:\n" + messages.join("\n"));
        return;
    }

    alert("Товар можно оформить!");
}

async function buy() {
    // Отправляем объект cart как есть
    const res = await fetch(API_BUY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
    });

    const data = await res.json();

    if (res.ok) {
        alert('Покупка успешно выполнена!');
        cart = {};
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    } else {
        alert(`Недостаточно товара для id ${data.id}, доступно: ${data.available}`);
    }
}


loadCart();
