async function loadStock() {
    const res = await fetch('/api/lab9/task1/stock');
    const data = await res.json();
    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
}

function formatPrice(cents) {
    const n = Number(cents) || 0;
    return (n / 100).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' ₽';
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function find() {
    const q = document.getElementById('search').value;

    const res = await fetch('/api/lab9/task1/products?q=' + encodeURIComponent(q));
    const data = await res.json();

    document.getElementById('list').innerHTML = data.map(p => `
        <div class="product-card">
            <strong>${p.id}. ${escapeHtml(p.title)}</strong><br>
            <span class="price">${formatPrice(p.price)}</span>
            Остаток: ${p.amount} шт.
        </div>
    `).join('');
}
