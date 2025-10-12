import CryptoJS from 'crypto-js';
import userLevels from './modules/statusDataTests.js';
let tests = {};
let currentQuestionIndex = 0;
let userAnswers = [];
const contentDiv = document.getElementById('testWrapper');
let countdownInterval; 
let remainingTime; 
const secretKey = "My$ecretK3y!2023"; 

async function loadTests() {
    const response = await fetch('../files/encrypted/encrypted_tests.json');
    const encryptedData = await response.text();
    const decryptedData = decryptData(encryptedData); 
    const data = JSON.parse(decryptedData);

    displayInfoTest(data);
}

function displayInfoTest(test) {
    const quizId = new URLSearchParams(window.location.search).get('test');

    if (test) {
        const testData = test.find(test => test.key === quizId);
        tests = testData
        if (testData) {
            contentDiv.innerHTML = createTestInfoHTML(testData);
            testStart();
        } else {
            contentDiv.innerHTML = '<p>Тест не найден.</p>';
        }
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
    const wrapperTime = document.getElementById('remainingTimeSpan'); // Используем id таймера
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    wrapperTime.textContent = formattedTime; // Обновляем только текст таймера

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        displayResults(testData)
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
                    <span id="remainingTimeSpan"></span>
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

    if (tests) {
        contentDiv.innerHTML = createTestHtml(tests);
        startCountdown(tests)
        addAnswerListeners(tests);
    }   
}

// Функция для добавления обработчиков нажатия на ответы
function addAnswerListeners(testData) {
    const checked = document.querySelector('.tests-start__answer-input')
    const answerElements = document.querySelectorAll('input[name="answer"]');
    answerElements.forEach(answerElement => {
        answerElement.addEventListener('change', () => handleAnswerSelection(testData));
    });
}

// Обработка выбора ответа
function handleAnswerSelection(testData) {
    const selectedInput = document.querySelector('input[name="answer"]:checked');
    if (selectedInput) {
        const selectedAnswerIndex = Array.from(selectedInput.parentNode.parentNode.children).indexOf(selectedInput.parentNode);
        const correctAnswerIndex = testData.questions[currentQuestionIndex].answers.findIndex(answer => answer.isCorrect);
        userAnswers[currentQuestionIndex] = (selectedAnswerIndex === correctAnswerIndex);
        currentQuestionIndex++;

        if (currentQuestionIndex < testData.questions.length) {
            contentDiv.innerHTML = createTestHtml(testData);
            updateCountdown(); // Обновляем таймер после смены вопроса
            addAnswerListeners(testData);
        } else {
            displayResults(testData);
        }
    } else {
        alert('Пожалуйста, выберите ответ!');
    }
}

function userStatusTest(testData, userLevels){
    const { newbie, average, experienced } = userLevels;
    const totalQuestions = testData.questions.length;
    const correctAnswers = userAnswers.filter(answer => answer).length;
    const percentageCorrectAnswers = Math.floor(correctAnswers / totalQuestions * 100);

    if(percentageCorrectAnswers <= 42){
        return newbie
    }else if(percentageCorrectAnswers <= 77 && percentageCorrectAnswers >= 43){
        return average
    }else{
        return experienced 
    }

};

// Функция для отображения результатов
function displayResults(testData) {
    const totalQuestions = testData.questions.length;
    const userLevel = userStatusTest(testData, userLevels);
    clearInterval(countdownInterval);

    const startTime = testData.time * 60;
    const endTtimeSeconds = startTime - remainingTime
    const minutes = Math.floor(endTtimeSeconds / 60);
    const seconds = endTtimeSeconds % 60;

    const correctAnswers = userAnswers.filter(answer => answer).length;
    const percentageCorrectAnswers = Math.floor(correctAnswers / totalQuestions * 100);

    contentDiv.innerHTML = `
            <section class="test-results">
                <div class="container">
                    <div class="test-results__inner">
                        <div class="test-results__top">
                            <h3 class="test-results__title">Тест: "${testData.title}"</h3>
                            <div class="test-results__time">Потраченное время: 00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</div>
                        </div>
                        <div class="test-results__bottom">
                            <div class="test-results__status">Статус “${userLevel.title}”</div>
                            <div class="test-results__count-answers">
                                <div class="test-results__count-progress">
                                    <div class="test-results__progress-bar" id="test-results__progress" style="width: ${percentageCorrectAnswers}%;"></div>
                                    <div class="test-results__progress-text" id="test-results__progress-text">${percentageCorrectAnswers}% правильных ответов</div>
                                </div>
                                <div class="test-results__score">${correctAnswers}/${testData.questions.length}</div>
                            </div>
                            <p class="test-results__text">
                                ${userLevel.text}
                            </p>
                            <div class="test-results__btns">
                                <a class="test-results__btns-again" href="${window.location.origin}/test.html?test=${testData.key}">Пройти еще раз</a>
                                <button disabled class="test-results__show-answer" title="Кнопка в разработке">Показать ответы</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    `;
}

const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Запуск загрузки тестов
loadTests();