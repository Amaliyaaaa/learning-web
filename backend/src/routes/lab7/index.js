// Файл: /src/routes/lab7/index.js
// Все обработчики - асинхронные функции

export default async function routes(fastify, options) {

  // Доступен по GET /api/lab7/
  fastify.get('/', async (request, reply) => {
    return { 
      lab: '№7',
      description: 'Это главный API-эндпоинт для седьмой лабораторной.' 
    };
  });

  // Доступен по GET /api/lab7/task1
  fastify.get('/task1', async (request, reply) => {
    // Симуляция асинхронной операции (например, запрос к БД)
    await new Promise(resolve => setTimeout(resolve, 1500)); // задержка 50мс
    return { task: 1, status: 'done', timestamp: new Date() };
  });
  
  // Доступен по GET /api/lab7/task2
  fastify.get('/task2', async (request, reply) => {
    // В будущем здесь может быть: const users = await db.getUsers();
    const data = [
      { id: 1, name: 'Ivan' },
      { id: 2, name: 'Maria' }
    ];
    return { task: 2, data: data };
  });

  // Пример роута с параметром
  // Доступен по GET /api/lab7/users/123
  fastify.get('/users/:id', async (request, reply) => {
    const { id } = request.params;
    // В будущем: const user = await db.getUserById(id);
    if (id === '123') {
      return { id: id, name: 'Test User' };
    }
    // Fastify автоматически обработает ошибку и вернет 404
    reply.code(404).send({ error: 'User not found' });
  });
}