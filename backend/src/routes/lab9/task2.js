export default async function (fastify, opts) {

    fastify.get('/products/:id', async (req, reply) => {
        const { id } = req.params;
        const { rows } = await fastify.pg.query('SELECT * FROM lab9.products WHERE id=$1', [id]);
        if (!rows[0]) {
            return reply.status(404).send({ error: 'Product not found' });
        }
        return rows[0];
    });

    fastify.put('/products/:id', async (req, reply) => {
        const { id } = req.params;
        const { title, price, amount } = req.body;

        const { rowCount } = await fastify.pg.query(
            `UPDATE lab9.products
             SET title=$1, price=$2, amount=$3
             WHERE id=$4`,
            [title, price, amount, id]
        );

        if (rowCount === 0) {
            return reply.status(404).send({ error: 'Product not found' });
        }

        return { success: true };
    });
}
