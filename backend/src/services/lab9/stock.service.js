class StockService {
    async getStockInfo(db) {
        const query = `
            SELECT 
                COUNT(*) AS total_products,
                SUM(amount) AS total_items,
                SUM(price * amount) AS total_value
            FROM lab9.products;
        `;

        const { rows } = await db.query(query);
        return rows[0];
    }
}

export default new StockService();
