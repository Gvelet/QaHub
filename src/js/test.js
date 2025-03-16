let tests = {};
let currentQuestionIndex = 0;
let userAnswers = [];
const contentDiv = document.getElementById('testWrapper');
let countdownInterval; // Переменная для хранения интервала таймера
let remainingTime; // Переменная для хранения оставшегося времени

async function loadTests() {
    const response = await fetch('https://raw.githubusercontent.com/Gvelet/QaHub-api/refs/heads/main/db/combined.json');
    const data = await response.json();
    data.forEach(test => {
        const id = Object.keys(test)[0];
        tests[id] = test[id];
    });
    displayInfoTest();
}

function displayInfoTest() {
    const quizId = new URLSearchParams(window.location.search).get('test');
    if (tests[quizId]) {
        const testData = tests[quizId];
        contentDiv.innerHTML = createTestInfoHTML(testData);
        testStart();
    } else {
        contentDiv.innerHTML = '<p>Тест не найден.</p>';
    }
}

function createTestInfoHTML(testData) {
    return `
        <div class="tests__inner">
            <div id="test-title" class="test__title title">${testData.title}</div>
            <div class="test__wrapper">
                <button id="start-button" class="test__start-btn">Начать тест</button>
                <p id="test-description" class="test__text">${testData.fullDescription}</p>
                <div class="test__info">
                    <div class="test__counting-questions">
                        Количество вопросов: <span id="countingQuestions">${testData.questions.length}</span>
                    </div>
                    <div class="test__time">
                        Время прохождения: <span id="testTime">${testData.time}</span> минут
                    </div>
                </div>
            </div>
        </div>`;
}

const updateCountdown = () => {
    const wrapperTime = document.querySelector('.tests-start__time span');
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    wrapperTime.textContent = formattedTime;

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        wrapperTime.textContent = "Время вышло!"; // Здесь можно добавить логику для завершения теста
    }
};

function startCountdown(testData) {
    remainingTime = testData.time * 60; // Время в секундах
    updateCountdown(); // Первоначальное обновление таймера
    countdownInterval = setInterval(() => {
        remainingTime--;
        updateCountdown(); // Обновляем таймер каждую секунду
    }, 1000);
}

// Функция для создания HTML-контента текущего вопроса
function createTestHtml(testData) {
    const question = testData.questions[currentQuestionIndex];
    const totalQuestions = testData.questions.length;
    return `
        <div class="tests-start">
            <div class="tests-start__top">
                <div class="tests-start__counter-questtion">
                    <h4 class="tests-start__counter-title">Вопросы:</h4>
                    <div class="tests-start__progress-bar">
                        <div class="tests-start__progress-bar-fill" id="progressBarFill" style="width: ${(currentQuestionIndex + 1) / totalQuestions * 100}%;"></div>
                    </div>
                    <span>${currentQuestionIndex + 1}/${totalQuestions}</span>
                </div>
                <div class="tests-start__time">
                    <h4 class="tests-start__time-title">Осталось времени:</h4>
                    <span></span>
                </div>
            </div>
            <div class="tests-start__test">
                <div class="tests-start__questions">
                    <div class="tests-start__questions-content">
                        <div class="tests-start__question-title">Вопрос ${currentQuestionIndex + 1}:</div>
                        <div class="tests-start__question">${question.question}</div>
                    </div>
                    ${question.image ? `<img class="tests-start__questions-img" src="./img/${question.image}" alt="Картинка для вопроса">` : ''}
                </div>
                <div class="tests-start__answers">
                    <h4 class="tests-start__answers-title">Варианты ответа:</h4>
                    <ul class="tests-start__answers-list">
                        ${question.answers.map((answer, index) => `
                            <li class="tests-start__answers-item">
                                <input type="radio" name="answer" id="answer-${index}" class="tests-start__answer-input">
                                <label for="answer-${index}" class="tests-start__answer-label">${answer.text}</label>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>`;
}

// Функция для добавления обработчиков событий
function testStart() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', displayTest);
}

// Функция для отображения теста
function displayTest() {
    const quizId = new URLSearchParams(window.location.search).get('test');
    const testData = tests[quizId];

    contentDiv.innerHTML = createTestHtml(testData);
    startCountdown(testData)
    addAnswerListeners(testData); // Добавляем обработчики для ответов
}

// Функция для добавления обработчиков нажатия на ответы
function addAnswerListeners(testData) {
    const answerElements = document.querySelectorAll('input[name="answer"]');
    answerElements.forEach(answerElement => {
        answerElement.addEventListener('change', () => handleAnswerSelection(testData));
    });
}

// Обработка выбора ответа
function handleAnswerSelection(testData) {
    const selectedInput = document.querySelector('input[name="answer"]:checked');
    if (selectedInput) {
        // Вместо data-correct, отправьте ответ на сервер для проверки
        const selectedAnswerIndex = Array.from(selectedInput.parentNode.parentNode.children).indexOf(selectedInput.parentNode);
        const correctAnswerIndex = testData.questions[currentQuestionIndex].answers.findIndex(answer => answer.isCorrect);

        userAnswers[currentQuestionIndex] = (selectedAnswerIndex === correctAnswerIndex); // Сохраняем правильность ответа
        currentQuestionIndex++;
        if (currentQuestionIndex < testData.questions.length) {
            contentDiv.innerHTML = createTestHtml(testData);
            addAnswerListeners(testData);
        } else {
            displayResults(testData);
        }
    } else {
        alert('Пожалуйста, выберите ответ!');
    }
}

// Функция для отображения результатов
function displayResults(testData) {
    const correctAnswers = userAnswers.filter(answer => answer).length;
    contentDiv.innerHTML = `
        <div class="results">
            <h2>Тест завершен!</h2>
            <p>Вы ответили правильно на ${correctAnswers} из ${testData.questions.length} вопросов.</p>
        </div>
    `;
}

// Запуск загрузки тестов
loadTests();