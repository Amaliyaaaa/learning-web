async function loadCategories() {
    const res = await fetch('/api/lab10/categories');
    const categories = await res.json();

    document.getElementById('categories').innerHTML =
        `<option value="">Все категории</option>` +
        categories.map(c =>
            `<option value="${c.id}">${c.name}</option>`
        ).join('');
}

async function loadProducts(page = 1) {
    const category = document.getElementById('categories').value;
    const q = document.getElementById('search').value;

    const params = new URLSearchParams({ page, category, q });
    const res = await fetch('/api/lab10/products?' + params);
    const data = await res.json();

    document.getElementById('products').innerHTML =
        data.data.map(p => `
        <div>
          <strong>${p.title}</strong><br>
          ${p.price / 100} ₽ | Остаток: ${p.amount}<br>
          <button onclick="buy(${p.id})">Купить</button>
        </div>
        <hr>
      `).join('');
}

async function buy(id) {
    const res = await fetch(`/api/lab10/products/${id}/buy`, {
        method: 'POST'
    });

    const data = await res.json();

    if (res.ok) {
        alert('Заказ №' + data.orderId);
        loadProducts();
    } else {
        alert(data.error);
    }
}

loadCategories();
loadProducts();
  