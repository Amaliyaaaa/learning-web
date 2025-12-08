// backend/src/routes/lab9/index.js
import productService from '../../services/lab9/product.service.js';
import stockService from '../../services/lab9/stock.service.js';

export default async function routes(fastify, options) {
    // GET /api/lab9/products
    fastify.get('/products', async (request, reply) => {
        // Внедрение зависимости: передаем fastify.pg в сервис
        const products = await productService.getAll(fastify.pg);
        return products;
    });
    // POST /api/lab9/products
    fastify.post('/products', async (request, reply) => {
        // TODO: В следующей работе добавим JSON Schema для валидации (как в ЛР8)
        const newProduct = await productService.create(fastify.pg, request.body);
        reply.code(201).send(newProduct);
    });
    // DELETE /api/lab9/products/:id
    fastify.delete('/products/:id', async (request, reply) => {
        const deleted = await productService.delete(fastify.pg, request.params.id);
        if (!deleted) {
            return reply.code(404).send({ error: 'Product not found' });
        }
        return { message: 'Deleted', id: deleted.id };
    });
    // === TASK 1 : STOCK ============================================
    fastify.get('/task1/stock', async (request, reply) => {
        const data = await stockService.getStockInfo(fastify.pg);
        return data;
    });

    // === TASK 1 : PRODUCTS SEARCH ==================================
    fastify.get('/task1/products', async (request, reply) => {
        const q = request.query.q || "";
        const products = await productService.search(fastify.pg, q);
        return products;
    });
}