const API = "/api/lab9/task1/products";
const API_STOCK = "/api/lab9/task1/stock";
const API_ID = "/api/lab9/task2/products";

function formatPrice(cents) {
    return (cents / 100).toLocaleString("ru-RU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " ₽";
}

async function loadStock() {
    const res = await fetch(API_STOCK);
    const data = await res.json();
    document.getElementById("stock").textContent = JSON.stringify(data, null, 2);
}

async function loadProducts() {
    const res = await fetch(API);
    const products = await res.json();

    document.getElementById("list").innerHTML = products
        .map(p => `
        <div class="product">
            <input class="title" data-id="${p.id}" value="${p.title}">
            <input class="price" data-id="${p.id}" value="${(p.price / 100).toFixed(2)}">
            
            <div class="count">
                <button onclick="changeAmount(${p.id}, -1)">–</button>
                <span id="amount-${p.id}">${p.amount}</span>
                <button onclick="changeAmount(${p.id}, 1)">+</button>
            </div>

            <button class="save" onclick="save(${p.id})">Сохранить</button>
        </div>
    `).join('');
}

async function changeAmount(id, delta) {
    const el = document.getElementById(`amount-${id}`);
    let value = parseInt(el.textContent);
    value = Math.max(0, value + delta);
    el.textContent = value;
}

async function save(id) {
    const title = document.querySelector(`.title[data-id="${id}"]`).value;
    const priceRub = Number(document.querySelector(`.price[data-id="${id}"]`).value);
    const amount = Number(document.getElementById(`amount-${id}`).textContent);

    const price = Math.round(priceRub * 100);

    await fetch(`${API_ID}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price, amount })
    });

    loadStock();
}

async function loadById() {
    const id = document.getElementById("prodId").value;
    if (!id) return;

    const res = await fetch(`${API_ID}/${id}`);

    if (res.status === 404) {
        document.getElementById("prodInfo").textContent = "Товар не найден";
        return;
    }

    const product = await res.json();
    document.getElementById("prodInfo").textContent = JSON.stringify(product, null, 2);
}

loadStock();
loadProducts();
