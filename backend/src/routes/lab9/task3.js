export default async function (fastify, opts) {
    fastify.post('/buy', async (req, reply) => {
        const { items } = req.body; // { "1": 2, "3": 1 } - ключи строки
        const ids = Object.keys(items);

        for (const idStr of ids) {
            const id = parseInt(idStr); // Преобразуем в число
            const qty = items[idStr];

            const { rows } = await fastify.pg.query(
                'SELECT amount FROM lab9.products WHERE id=$1',
                [id]
            );

            if (!rows[0]) {
                return reply.status(400).send({ id, available: 0 });
            }
            if (qty > rows[0].amount) {
                return reply.status(400).send({ id, available: rows[0].amount });
            }
        }

        for (const idStr of ids) {
            const id = parseInt(idStr);
            const qty = items[idStr];
            await fastify.pg.query(
                'UPDATE lab9.products SET amount = amount - $1 WHERE id=$2',
                [qty, id]
            );
        }

        return { success: true };
    });
}
