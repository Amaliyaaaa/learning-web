// Показать/скрыть поле названия проекта
    document.getElementById('projectParticipant').addEventListener('change', function () {
    const projectNameGroup = document.getElementById('projectNameGroup');
    if (this.checked) {
        projectNameGroup.style.display = 'block';
    } else {
        projectNameGroup.style.display = 'none';
    document.getElementById('projectName').value = '';
    }
});

    // Получить данные формы
    function getFormData() {
    return {
        lastname: document.getElementById('lastname').value.trim(),
    firstname: document.getElementById('firstname').value.trim(),
    surname: document.getElementById('surname').value.trim(),
    gender: document.querySelector('input[name="gender"]:checked')?.value,
    faculty: document.getElementById('faculty').value,
    projectParticipant: document.getElementById('projectParticipant').checked,
    projectName: document.getElementById('projectName').value.trim()
    };
}

    // Валидация обязательных полей
    function validateRequiredFields() {
    const formData = getFormData();
    if (!formData.lastname || !formData.firstname || !formData.gender || !formData.faculty) {
        alert('Пожалуйста, заполните все обязательные поля (отмечены *)');
    return false;
    }
    return true;
}

    // Эндпоинт 1: Создание инициалов
    async function makeInitials() {
    if (!validateRequiredFields()) return;

    const formData = getFormData();
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');

    resultDiv.style.display = 'none';

    try {
        const params = new URLSearchParams({
        lastname: formData.lastname,
    firstname: formData.firstname,
    surname: formData.surname || ''
        });

    const url = `/api/lab7/task2/makeInitials?${params}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
            throw new Error(data.error || 'Ошибка сервера');
        }

    resultContent.innerHTML = `
    <div class="result-item">
        <span class="result-label">Фамилия:</span>
        <span class="result-value">${data.lastname}</span>
    </div>
    <div class="result-item">
        <span class="result-label">Инициал имени:</span>
        <span class="result-value">${data.firstnameLetter}</span>
    </div>
    <div class="result-item">
        <span class="result-label">Инициал отчества:</span>
        <span class="result-value">${data.surnameLetter || '—'}</span>
    </div>
    <div class="result-item">
        <span class="result-label">Полные инициалы:</span>
        <span class="result-value success">${data.fullInitials}</span>
    </div>
    <div class="url-info">
        ${decodeURIComponent(url)}
    </div>
    `;

    resultDiv.style.display = 'block';

    } catch (error) {
        resultContent.innerHTML = `<div class="error">
            Ошибка: ${error.message}
        </div>`;
    resultDiv.style.display = 'block';
    }
}

    // Эндпоинт 2: Статус проекта
    async function makeProjectStatus() {
    if (!validateRequiredFields()) return;

    const formData = getFormData();
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');

    resultDiv.style.display = 'none';

    try {
        const params = new URLSearchParams({
        lastname: formData.lastname,
    firstname: formData.firstname,
    surname: formData.surname || '',
    projectParticipant: formData.projectParticipant
        });

    const url = `/api/lab7/task2/makeProjectStatus?${params}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
            throw new Error(data.error || 'Ошибка сервера');
        }

    const statusClass = data.projectParticipant === 'Участвует' ? 'success' : 'error';

    resultContent.innerHTML = `
    <div class="result-item">
        <span class="result-label">Фамилия:</span>
        <span class="result-value">${data.lastname}</span>
    </div>
    <div class="result-item">
        <span class="result-label">Инициал имени:</span>
        <span class="result-value">${data.firstnameLetter}</span>
    </div>
    <div class="result-item">
        <span class="result-label">Инициал отчества:</span>
        <span class="result-value">${data.surnameLetter || '—'}</span>
    </div>
    <div class="result-item">
        <span class="result-label">Участие в проекте:</span>
        <span class="result-value ${statusClass}">${data.projectParticipant}</span>
    </div>
    <div class="result-item">
        <span class="result-label">Полная информация:</span>
        <span class="result-value success">${data.fullInfo}</span>
    </div>
    <div class="url-info">
        ${decodeURIComponent(url)}
    </div>
    `;

    resultDiv.style.display = 'block';

    } catch (error) {
        resultContent.innerHTML = `<div class="error">
            Ошибка: ${error.message}
        </div>`;
    resultDiv.style.display = 'block';
    }
}

    // Инициализация формы при загрузке
    window.addEventListener('load', function () {
    if (document.getElementById('projectParticipant').checked) {
        document.getElementById('projectNameGroup').style.display = 'block';
    }

    setTimeout(() => makeInitials(), 500);
});