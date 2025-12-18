import shopService from '../../services/lab10/shop.service.js';
import scheduleService from '../../services/lab10/schedule.service.js';

export default async function routes(fastify, options) {
  const authenticate = options.authenticate || (async () => { });

  // Вспомогательная функция для проверки прав администратора
  function checkAdminAccess(req, reply, resourceName, resourceId) {
    if (!req.user) {
      fastify.log.error(`DELETE /task2/${resourceName}/:id - req.user не установлен`);
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'admin') {
      fastify.log.warn(`DELETE /task2/${resourceName}/:id - Access denied for user ${req.user.login || 'unknown'} with role ${req.user.role || 'unknown'}`);
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }

    fastify.log.info(`DELETE /task2/${resourceName}/:id - Запрос на удаление ${resourceName} ${resourceId}`);
    fastify.log.info(`DELETE /task2/${resourceName}/:id - req.user: ${JSON.stringify(req.user)}`);
    return null; // null означает, что проверка прошла успешно
  }

  if (!options.authenticate) {
    fastify.log.warn(' ! authenticate не передан в options для lab10. Авторизация не будет работать!');
  } else {
    fastify.log.info(' ! authenticate передан в options для lab10');
  }
  fastify.get('/categories', async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    try {
      return await shopService.getCategories(fastify.pg);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to load categories' });
    }
  });

  fastify.get('/products', async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    try {
      const { page, category, q } = req.query;
      return await shopService.getProducts(fastify.pg, {
        page,
        limit: 6,
        categoryId: category,
        search: q
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to load products' });
    }
  });

  fastify.get('/task1/product/:id', async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    try {
      const product = await shopService.getProductById(fastify.pg, req.params.id);
      if (!product) {
        return reply.code(404).send({ error: 'Product not found' });
      }
      return product;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to load product' });
    }
  });

  fastify.get('/task1/orders/:id', async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    try {
      const order = await shopService.getOrderById(fastify.pg, req.params.id);
      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }
      return order;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to load order' });
    }
  });

  fastify.get('/orders', async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    try {
      const { page } = req.query;
      return await shopService.getAllOrders(fastify.pg, { page, limit: 10 });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to load orders' });
    }
  });

  fastify.post('/products/:id/buy', async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    try {
      const result = await shopService.buyProducts(fastify.pg, req.params.id);
      return result;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(400).send({ error: err.message });
    }
  });

  fastify.post('/products/buy', async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return reply.code(400).send({ error: 'Items array is required' });
      }
      const result = await shopService.buyProducts(fastify.pg, items);
      return result;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(400).send({ error: err.message });
    }
  });

  fastify.get('/task2/departments', async (req, reply) => {
    if (!fastify.pg) {
      fastify.log.warn('! fastify.pg is null for /task2/departments');
      return reply.code(503).send([]);
    }
    try {
      return await scheduleService.getDepartments(fastify.pg);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send([]);
    }
  });

  fastify.get('/task2/positions', async (req, reply) => {
    if (!fastify.pg) {
      fastify.log.warn('! fastify.pg is null for /task2/positions');
      return reply.code(503).send([]);
    }
    try {
      return await scheduleService.getPositions(fastify.pg);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send([]);
    }
  });

  fastify.get('/task2/teachers', async (req, reply) => {
    if (!fastify.pg) {
      fastify.log.warn('!  fastify.pg is null for /task2/teachers');
      return reply.code(503).send([]);
    }
    try {
      return await scheduleService.getTeachers(fastify.pg);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send([]);
    }
  });

  fastify.get('/task2/buildings', async (req, reply) => {
    if (!fastify.pg) {
      fastify.log.warn('!  fastify.pg is null for /task2/buildings');
      return reply.code(503).send([]);
    }
    try {
      return await scheduleService.getBuildings(fastify.pg);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send([]);
    }
  });

  fastify.get('/task2/classrooms', async (req, reply) => {
    if (!fastify.pg) {
      fastify.log.warn('!  fastify.pg is null for /task2/classrooms');
      return reply.code(503).send([]);
    }
    try {
      const { building_id } = req.query;
      return await scheduleService.getClassrooms(fastify.pg, building_id);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send([]);
    }
  });

  fastify.get('/task2/subjects', async (req, reply) => {
    if (!fastify.pg) {
      fastify.log.warn('!  fastify.pg is null for /task2/subjects');
      return reply.code(503).send([]);
    }
    try {
      return await scheduleService.getSubjects(fastify.pg);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send([]);
    }
  });

  fastify.get('/task2/groups', async (req, reply) => {
    if (!fastify.pg) {
      fastify.log.warn('!  fastify.pg is null for /task2/groups');
      return reply.code(503).send([]);
    }
    try {
      return await scheduleService.getGroups(fastify.pg);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send([]);
    }
  });

  fastify.get('/task2/lesson-types', async (req, reply) => {
    if (!fastify.pg) {
      fastify.log.warn('!  fastify.pg is null for /task2/lesson-types');
      return reply.code(503).send([]);
    }
    try {
      return await scheduleService.getLessonTypes(fastify.pg);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send([]);
    }
  });

  fastify.get('/task2/schedule', async (req, reply) => {
    if (!fastify.pg) {
      fastify.log.warn('!  fastify.pg is null for /task2/schedule');
      return reply.code(503).send([]);
    }
    try {
      const filters = {
        week: req.query.week,
        groupId: req.query.group_id,
        day: req.query.day,
        classroomId: req.query.classroom_id,
        subjectId: req.query.subject_id,
        teacherId: req.query.teacher_id,
        lessonTypeId: req.query.lesson_type_id
      };
      return await scheduleService.getSchedule(fastify.pg, filters);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send([]);
    }
  });

  fastify.get('/task2/schedule/:id', async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    try {
      const schedule = await scheduleService.getScheduleById(fastify.pg, req.params.id);
      if (!schedule) {
        return reply.code(404).send({ error: 'Schedule not found' });
      }
      return schedule;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to load schedule' });
    }
  });

  fastify.post('/task2/schedule', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    fastify.log.info('POST /task2/schedule - req.user:', req.user);
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      fastify.log.warn('POST /task2/schedule - Доступ запрещен. req.user:', req.user);
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const schedule = await scheduleService.createSchedule(fastify.pg, req.body);
      return reply.code(201).send(schedule);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create schedule' });
    }
  });

  fastify.put('/task2/schedule/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const schedule = await scheduleService.updateSchedule(fastify.pg, req.params.id, req.body);
      if (!schedule) {
        return reply.code(404).send({ error: 'Schedule not found' });
      }
      return schedule;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update schedule' });
    }
  });

  fastify.delete('/task2/schedule/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    // Логирование в самом начале для диагностики
    fastify.log.info(`=== DELETE /task2/schedule/:id - НАЧАЛО ОБРАБОТКИ ===`);
    fastify.log.info(`DELETE /task2/schedule/:id - req.params: ${JSON.stringify(req.params)}`);
    fastify.log.info(`DELETE /task2/schedule/:id - req.params.id: ${req.params.id}, тип: ${typeof req.params.id}`);

    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }

    // Детальное логирование для диагностики
    fastify.log.info(`DELETE /task2/schedule/:id - Запрос на удаление расписания ${req.params.id}`);
    fastify.log.info(`DELETE /task2/schedule/:id - req.user: ${JSON.stringify(req.user)}`);
    fastify.log.info(`DELETE /task2/schedule/:id - Authorization header: ${req.headers.authorization ? 'present' : 'missing'}`);

    if (!req.user) {
      fastify.log.error('DELETE /task2/schedule/:id - req.user не установлен');
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'admin') {
      fastify.log.warn(`DELETE /task2/schedule/:id - Access denied for user ${req.user.login || 'unknown'} with role ${req.user.role || 'unknown'}`);
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }

    try {
      // Преобразуем ID в число для безопасности
      const scheduleId = parseInt(req.params.id);
      if (isNaN(scheduleId) || scheduleId <= 0) {
        fastify.log.warn(`DELETE /task2/schedule/:id - Неверный ID: ${req.params.id}`);
        return reply.code(400).send({ error: 'Invalid schedule ID' });
      }

      const deleted = await scheduleService.deleteSchedule(fastify.pg, scheduleId);
      if (!deleted) {
        fastify.log.warn(`DELETE /task2/schedule/:id - Расписание ${scheduleId} не найдено`);
        return reply.code(404).send({ error: 'Schedule not found' });
      }
      fastify.log.info(`DELETE /task2/schedule/:id - Расписание ${scheduleId} успешно удалено`);
      return { message: 'Deleted', id: deleted.id };
    } catch (err) {
      fastify.log.error(`DELETE /task2/schedule/:id - Ошибка при удалении:`, err);
      fastify.log.error(`DELETE /task2/schedule/:id - Стек ошибки:`, err.stack);
      return reply.code(500).send({ error: 'Failed to delete schedule', details: err.message });
    }
  });

  fastify.post('/task2/departments', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const department = await scheduleService.createDepartment(fastify.pg, name);
      return reply.code(201).send(department);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create department' });
    }
  });

  fastify.post('/task2/positions', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      // const { name } = req.body;
      // const position = await scheduleService.createPosition(fastify.pg, name);
      // return reply.code(201).send(position);
      const { name } = req.body;
      fastify.log.info('POST /task2/positions - req.body:', req.body);

      if (!name) {
        return reply.code(400).send({ error: 'Name is required' });
      }

      const position = await scheduleService.createPosition(fastify.pg, name);
      return reply.code(201).send(position);

    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create position' });
    }
  });

  fastify.post('/task2/teachers', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const teacher = await scheduleService.createTeacher(fastify.pg, req.body);
      return reply.code(201).send(teacher);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create teacher' });
    }
  });

  fastify.post('/task2/buildings', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const building = await scheduleService.createBuilding(fastify.pg, name);
      return reply.code(201).send(building);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create building' });
    }
  });

  fastify.post('/task2/classrooms', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const classroom = await scheduleService.createClassroom(fastify.pg, req.body);
      return reply.code(201).send(classroom);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create classroom' });
    }
  });

  fastify.post('/task2/subjects', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const subject = await scheduleService.createSubject(fastify.pg, name);
      return reply.code(201).send(subject);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create subject' });
    }
  });

  fastify.post('/task2/groups', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const group = await scheduleService.createGroup(fastify.pg, name);
      return reply.code(201).send(group);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create group' });
    }
  });

  fastify.post('/task2/lesson-types', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const lessonType = await scheduleService.createLessonType(fastify.pg, name);
      return reply.code(201).send(lessonType);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create lesson type' });
    }
  });

  fastify.put('/task2/departments/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const department = await scheduleService.updateDepartment(fastify.pg, req.params.id, name);
      if (!department) {
        return reply.code(404).send({ error: 'Department not found' });
      }
      return department;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update department' });
    }
  });

  fastify.put('/task2/positions/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const position = await scheduleService.updatePosition(fastify.pg, req.params.id, name);
      if (!position) {
        return reply.code(404).send({ error: 'Position not found' });
      }
      return position;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update position' });
    }
  });

  fastify.put('/task2/teachers/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const teacher = await scheduleService.updateTeacher(fastify.pg, req.params.id, req.body);
      if (!teacher) {
        return reply.code(404).send({ error: 'Teacher not found' });
      }
      return teacher;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update teacher' });
    }
  });

  fastify.put('/task2/buildings/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const building = await scheduleService.updateBuilding(fastify.pg, req.params.id, name);
      if (!building) {
        return reply.code(404).send({ error: 'Building not found' });
      }
      return building;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update building' });
    }
  });

  fastify.put('/task2/classrooms/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const classroom = await scheduleService.updateClassroom(fastify.pg, req.params.id, req.body);
      if (!classroom) {
        return reply.code(404).send({ error: 'Classroom not found' });
      }
      return classroom;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update classroom' });
    }
  });

  fastify.put('/task2/subjects/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const subject = await scheduleService.updateSubject(fastify.pg, req.params.id, name);
      if (!subject) {
        return reply.code(404).send({ error: 'Subject not found' });
      }
      return subject;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update subject' });
    }
  });

  fastify.put('/task2/groups/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const group = await scheduleService.updateGroup(fastify.pg, req.params.id, name);
      if (!group) {
        return reply.code(404).send({ error: 'Group not found' });
      }
      return group;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update group' });
    }
  });

  fastify.put('/task2/lesson-types/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const { name } = req.body;
      const lessonType = await scheduleService.updateLessonType(fastify.pg, req.params.id, name);
      if (!lessonType) {
        return reply.code(404).send({ error: 'Lesson type not found' });
      }
      return lessonType;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update lesson type' });
    }
  });

  fastify.delete('/task2/departments/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }

    const checkResult = checkAdminAccess(req, reply, 'departments', req.params.id);
    if (checkResult) return checkResult;

    try {
      const departmentId = parseInt(req.params.id);
      if (isNaN(departmentId) || departmentId <= 0) {
        fastify.log.warn(`DELETE /task2/departments/:id - Неверный ID: ${req.params.id}`);
        return reply.code(400).send({ error: 'Invalid department ID' });
      }

      const deleted = await scheduleService.deleteDepartment(fastify.pg, departmentId);
      if (!deleted) {
        fastify.log.warn(`DELETE /task2/departments/:id - Отдел ${departmentId} не найден`);
        return reply.code(404).send({ error: 'Department not found' });
      }
      fastify.log.info(`DELETE /task2/departments/:id - Отдел ${departmentId} успешно удален`);
      return { message: 'Deleted', id: deleted.id };
    } catch (err) {
      fastify.log.error(`DELETE /task2/departments/:id - Ошибка при удалении:`, err);
      fastify.log.error(`DELETE /task2/departments/:id - Стек ошибки:`, err.stack);

      // Проверяем, является ли ошибка нарушением ограничения внешнего ключа
      if (err.code === '23503' || err.message.includes('foreign key') || err.message.includes('violates foreign key')) {
        return reply.code(400).send({
          error: 'Невозможно удалить кафедру: она используется в других записях',
          details: 'Эта кафедра используется преподавателями. Сначала удалите или переназначьте преподавателей.'
        });
      }

      return reply.code(500).send({ error: 'Failed to delete department', details: err.message });
    }
  });

  fastify.delete('/task2/positions/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }

    const checkResult = checkAdminAccess(req, reply, 'positions', req.params.id);
    if (checkResult) return checkResult;

    try {
      const positionId = parseInt(req.params.id);
      if (isNaN(positionId) || positionId <= 0) {
        return reply.code(400).send({ error: 'Invalid position ID' });
      }

      const deleted = await scheduleService.deletePosition(fastify.pg, positionId);
      if (!deleted) {
        return reply.code(404).send({ error: 'Position not found' });
      }
      return { message: 'Deleted', id: deleted.id };
    } catch (err) {
      fastify.log.error(`DELETE /task2/positions/:id - Ошибка:`, err);
      if (err.code === '23503' || err.message.includes('foreign key')) {
        return reply.code(400).send({ error: 'Невозможно удалить должность: она используется преподавателями' });
      }
      return reply.code(500).send({ error: 'Failed to delete position', details: err.message });
    }
  });

  fastify.delete('/task2/teachers/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }

    const checkResult = checkAdminAccess(req, reply, 'teachers', req.params.id);
    if (checkResult) return checkResult;

    try {
      const teacherId = parseInt(req.params.id);
      if (isNaN(teacherId) || teacherId <= 0) {
        return reply.code(400).send({ error: 'Invalid teacher ID' });
      }

      const deleted = await scheduleService.deleteTeacher(fastify.pg, teacherId);
      if (!deleted) {
        return reply.code(404).send({ error: 'Teacher not found' });
      }
      return { message: 'Deleted', id: deleted.id };
    } catch (err) {
      fastify.log.error(`DELETE /task2/teachers/:id - Ошибка:`, err);
      if (err.code === '23503' || err.message.includes('foreign key')) {
        return reply.code(400).send({ error: 'Невозможно удалить преподавателя: он используется в расписании' });
      }
      return reply.code(500).send({ error: 'Failed to delete teacher', details: err.message });
    }
  });

  fastify.delete('/task2/buildings/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }

    const checkResult = checkAdminAccess(req, reply, 'buildings', req.params.id);
    if (checkResult) return checkResult;

    try {
      const buildingId = parseInt(req.params.id);
      if (isNaN(buildingId) || buildingId <= 0) {
        return reply.code(400).send({ error: 'Invalid building ID' });
      }

      const deleted = await scheduleService.deleteBuilding(fastify.pg, buildingId);
      if (!deleted) {
        return reply.code(404).send({ error: 'Building not found' });
      }
      return { message: 'Deleted', id: deleted.id };
    } catch (err) {
      fastify.log.error(`DELETE /task2/buildings/:id - Ошибка:`, err);
      if (err.code === '23503' || err.message.includes('foreign key')) {
        return reply.code(400).send({ error: 'Невозможно удалить корпус: в нем есть аудитории' });
      }
      return reply.code(500).send({ error: 'Failed to delete building', details: err.message });
    }
  });

  fastify.delete('/task2/classrooms/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }

    const checkResult = checkAdminAccess(req, reply, 'classrooms', req.params.id);
    if (checkResult) return checkResult;

    try {
      const classroomId = parseInt(req.params.id);
      if (isNaN(classroomId) || classroomId <= 0) {
        return reply.code(400).send({ error: 'Invalid classroom ID' });
      }

      const deleted = await scheduleService.deleteClassroom(fastify.pg, classroomId);
      if (!deleted) {
        return reply.code(404).send({ error: 'Classroom not found' });
      }
      return { message: 'Deleted', id: deleted.id };
    } catch (err) {
      fastify.log.error(`DELETE /task2/classrooms/:id - Ошибка:`, err);
      if (err.code === '23503' || err.message.includes('foreign key')) {
        return reply.code(400).send({ error: 'Невозможно удалить аудиторию: она используется в расписании' });
      }
      return reply.code(500).send({ error: 'Failed to delete classroom', details: err.message });
    }
  });

  fastify.delete('/task2/subjects/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }

    const checkResult = checkAdminAccess(req, reply, 'subjects', req.params.id);
    if (checkResult) return checkResult;

    try {
      const subjectId = parseInt(req.params.id);
      if (isNaN(subjectId) || subjectId <= 0) {
        return reply.code(400).send({ error: 'Invalid subject ID' });
      }

      const deleted = await scheduleService.deleteSubject(fastify.pg, subjectId);
      if (!deleted) {
        return reply.code(404).send({ error: 'Subject not found' });
      }
      return { message: 'Deleted', id: deleted.id };
    } catch (err) {
      fastify.log.error(`DELETE /task2/subjects/:id - Ошибка:`, err);
      if (err.code === '23503' || err.message.includes('foreign key')) {
        return reply.code(400).send({ error: 'Невозможно удалить дисциплину: она используется в расписании' });
      }
      return reply.code(500).send({ error: 'Failed to delete subject', details: err.message });
    }
  });

  fastify.delete('/task2/groups/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }

    const checkResult = checkAdminAccess(req, reply, 'groups', req.params.id);
    if (checkResult) return checkResult;

    try {
      const groupId = parseInt(req.params.id);
      if (isNaN(groupId) || groupId <= 0) {
        return reply.code(400).send({ error: 'Invalid group ID' });
      }

      const deleted = await scheduleService.deleteGroup(fastify.pg, groupId);
      if (!deleted) {
        return reply.code(404).send({ error: 'Group not found' });
      }
      return { message: 'Deleted', id: deleted.id };
    } catch (err) {
      fastify.log.error(`DELETE /task2/groups/:id - Ошибка:`, err);
      if (err.code === '23503' || err.message.includes('foreign key')) {
        return reply.code(400).send({ error: 'Невозможно удалить группу: она используется в расписании' });
      }
      return reply.code(500).send({ error: 'Failed to delete group', details: err.message });
    }
  });

  fastify.delete('/task2/lesson-types/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }

    const checkResult = checkAdminAccess(req, reply, 'lesson-types', req.params.id);
    if (checkResult) return checkResult;

    try {
      const lessonTypeId = parseInt(req.params.id);
      if (isNaN(lessonTypeId) || lessonTypeId <= 0) {
        return reply.code(400).send({ error: 'Invalid lesson type ID' });
      }

      const deleted = await scheduleService.deleteLessonType(fastify.pg, lessonTypeId);
      if (!deleted) {
        return reply.code(404).send({ error: 'Lesson type not found' });
      }
      return { message: 'Deleted', id: deleted.id };
    } catch (err) {
      fastify.log.error(`DELETE /task2/lesson-types/:id - Ошибка:`, err);
      if (err.code === '23503' || err.message.includes('foreign key')) {
        return reply.code(400).send({ error: 'Невозможно удалить тип занятия: он используется в расписании' });
      }
      return reply.code(500).send({ error: 'Failed to delete lesson type', details: err.message });
    }
  });

  fastify.post('/products', {
    onRequest: [authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['title', 'price', 'amount', 'category_id'],
        properties: {
          title: { type: 'string' },
          price: { type: 'number' },
          amount: { type: 'integer' },
          category_id: { type: 'integer' },
          description: { type: 'string' },
          image_url: { type: 'string' },
        },
      },
    },
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const product = await shopService.createProduct(fastify.pg, req.body);
      return reply.code(201).send(product);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(400).send({ error: err.message });
    }
  });

  fastify.put('/products/:id', {
    onRequest: [authenticate],
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          price: { type: 'number' },
          amount: { type: 'integer' },
          category_id: { type: 'integer' },
          description: { type: 'string' },
          image_url: { type: 'string' },
        },
      },
    },
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const product = await shopService.updateProduct(fastify.pg, req.params.id, req.body);
      if (!product) {
        return reply.code(404).send({ error: 'Product not found' });
      }
      return product;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update product' });
    }
  });

  fastify.delete('/products/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const deleted = await shopService.deleteProduct(fastify.pg, req.params.id);
      if (!deleted) {
        return reply.code(404).send({ error: 'Product not found' });
      }
      return { message: 'Deleted', id: deleted.id, title: deleted.title };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to delete product' });
    }
  });

  fastify.post('/categories', {
    onRequest: [authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
    },
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const category = await shopService.createCategory(fastify.pg, req.body.name);
      return reply.code(201).send(category);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(400).send({ error: err.message });
    }
  });

  fastify.put('/categories/:id', {
    onRequest: [authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
    },
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const category = await shopService.updateCategory(fastify.pg, req.params.id, req.body.name);
      if (!category) {
        return reply.code(404).send({ error: 'Category not found' });
      }
      return category;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update category' });
    }
  });

  fastify.delete('/categories/:id', {
    onRequest: [authenticate],
  }, async (req, reply) => {
    if (!fastify.pg) {
      return reply.code(503).send({ error: 'Database not available' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden: admin only' });
    }
    try {
      const deleted = await shopService.deleteCategory(fastify.pg, req.params.id);
      if (!deleted) {
        return reply.code(404).send({ error: 'Category not found' });
      }
      return { message: 'Deleted', id: deleted.id, name: deleted.name };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(400).send({ error: err.message });
    }
  });
}
