class ShopService {
  // Получение списка категорий для меню
  async getCategories(db) {
    const { rows } = await db.query('SELECT * FROM lab10.categories ORDER BY name');
    return rows;
  }
  /**
  * Универсальный поиск товаров
  * @param {Object} db - Клиент БД
  * @param {Object} params - Параметры: page, limit, categoryId, search
  */
  async getProducts(db, { page = 1, limit = 9, categoryId, search }) {
    const offset = (page - 1) * limit;
    // --- БЛОК ДИНАМИЧЕСКОГО SQL ---
    const conditions = [];
    const values = [];
    // 1. Фильтр по категории
    if (categoryId) {
      values.push(categoryId);
      conditions.push(`p.category_id = $${values.length}`);
    }
    // 2. Поиск по названию
    if (search) {
      values.push(`%${search}%`);
      conditions.push(`p.title ILIKE $${values.length}`);
    }
    // Собираем WHERE
    const whereClause = conditions.length > 0
      ? 'WHERE ' + conditions.join(' AND ')
      : '';
    // --- ЗАПРОС 1: ПОЛУЧЕНИЕ ДАННЫХ ---
    const sql = `
SELECT p.*, c.name as category_title
FROM lab10.products p
LEFT JOIN lab10.categories c ON p.category_id = c.id
${whereClause}
ORDER BY p.id
LIMIT $${values.length + 1} OFFSET $${values.length + 2}
`;
    // Выполняем запрос данных (ждем результат сразу)
    // Массив параметров: [...текущие фильтры, limit, offset]
    const dataResult = await db.query(sql, [...values, limit, offset]);
    // --- ЗАПРОС 2: ОБЩЕЕ КОЛИЧЕСТВО ---
    const countSql = `SELECT COUNT(*) FROM lab10.products p ${whereClause}`;
    // Выполняем запрос количества (ждем результат)
    // Используем те же values (фильтры), но без limit/offset
    const countResult = await db.query(countSql, values);
    return {
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }
  /**
  * Покупка товара (ТРАНЗАКЦИЯ)
  */
  async buyProduct(db, productId) {
    // Метод transact автоматически делает BEGIN ... COMMIT/ROLLBACK
    return db.transact(async (client) => {
      // 1. Блокируем строку товара (FOR UPDATE), чтобы никто другой не купил его прямо сейчас
      const checkRes = await client.query(
        'SELECT amount FROM lab10.products WHERE id = $1 FOR UPDATE',
        [productId]
      );
      if (checkRes.rows.length === 0) throw new Error('Товар не найден');
      const product = checkRes.rows[0];
      // 2. Проверяем бизнес-логику
      if (product.amount <= 0) throw new Error('Товар закончился');
      // 3. Списываем товар
      await client.query(
        'UPDATE lab10.products SET amount = amount - 1 WHERE id = $1',
        [productId]
      );
      // 4. Создаем заказ
      const orderRes = await client.query(
        'INSERT INTO lab10.orders (product_id) VALUES ($1) RETURNING id',
        [productId]
      );
      return { orderId: orderRes.rows[0].id };
    });
  }
}
export default new ShopService();
