export default function (fastify) {
    fastify.decorate('db', {
        products: {
            async getById(id) {
                const { rows } = await fastify.pg.query(
                    'SELECT * FROM products WHERE id = $1',
                    [id]
                );
                return rows[0] || null;
            },

            async update(id, { title, price, amount }) {
                const { rowCount } = await fastify.pg.query(
                    `UPDATE products
                     SET title=$1, price=$2, amount=$3
                     WHERE id=$4`,
                    [title, price, amount, id]
                );
                return rowCount > 0;
            }
        }
    });
}
