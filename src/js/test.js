import CryptoJS from 'crypto-js'; 
import userLevels from './modules/statusDataTests.js'; 

let tests = {}; 
let currentQuestionIndex = 0; 
let userAnswers = []; 
let userSelectedAnswers = [];
let showAnswersMode = false;
const contentDiv = document.getElementById('testWrapper'); 
let countdownInterval, remainingTime; 
const secretKey = "My$ecretK3y!2023"; 

async function loadTests() { 
  try { 
    const response = await fetch('../files/encrypted/encrypted_tests.json'); 
    if (!response.ok) throw new Error(`HTTP ${response.status}`); 
    const encryptedData = await response.text(); 
    const decryptedData = decryptData(encryptedData); 
    const data = JSON.parse(decryptedData); 
    console.log('Все тесты загружены:', data); 
    displayInfoTest(data); 
  } catch (error) { 
    console.error('Ошибка загрузки тестов:', error); 
    contentDiv.innerHTML = '<p>Ошибка загрузки тестов.</p>'; 
  } 
} 

function displayInfoTest(test) {
  const path = window.location.pathname;
  const testKey = path.split('/').pop().replace('.html', '');
  console.log('Ищем тест по ключу:', testKey);
  
  const testData = test.find(t => t.key === testKey);
  
  if (testData) {
    tests = testData;
    // ✅ Инициализация ПЕРЕД использованием testData
    userAnswers = new Array(testData.questions.length).fill(false);
    userSelectedAnswers = new Array(testData.questions.length).fill(-1);
    contentDiv.innerHTML = createTestInfoHTML(testData);
    testStart();
  } else {
    console.error('Тест не найден:', testKey);
    contentDiv.innerHTML = '<p>Тест не найден.</p>';
  }
}


function createTestInfoHTML(testData) { 
  return ` 
    <div class="tests__inner"> 
      <div class="test__title title">${testData.title}</div> 
      <div class="test__wrapper"> 
        <button id="start-button" class="test__start-btn">Начать тест</button> 
        <p class="test__text">${testData.fullDescription || ''}</p> 
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
  const wrapperTime = document.getElementById('remainingTimeSpan'); 
  if (wrapperTime) { 
    const minutes = Math.floor(remainingTime / 60); 
    const seconds = remainingTime % 60; 
    wrapperTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; 
  } 
  
  if (remainingTime <= 0) { 
    clearInterval(countdownInterval); 
    displayResults(tests); 
  } 
}; 

function renderQuestion(testData) { 
  const currentTime = remainingTime; 
  contentDiv.innerHTML = createTestHtml(testData); 
  remainingTime = currentTime; 
  updateCountdown(); 
  addAnswerListeners(testData); 
} 

function startCountdown(testData) { 
  remainingTime = testData.time * 60; 
  updateCountdown(); 
  countdownInterval = setInterval(() => { 
    remainingTime--; 
    updateCountdown(); 
  }, 1000); 
} 

function createTestHtml(testData) { 
  const question = testData.questions[currentQuestionIndex]; 
  const totalQuestions = testData.questions.length; 
  return ` 
    <div class="tests-start"> 
      <div class="tests-start__top"> 
        <div class="tests-start__counter-questtion"> 
          <h4 class="tests-start__counter-title">Вопросы:</h4> 
          <div class="tests-start__progress-bar"> 
            <div class="tests-start__progress-bar-fill" style="width: ${(currentQuestionIndex + 1) / totalQuestions * 100}%;"></div> 
          </div> 
          <span>${currentQuestionIndex + 1}/${totalQuestions}</span> 
        </div> 
        <div class="tests-start__time"> 
          <h4 class="tests-start__time-title">Осталось времени:</h4> 
          <span id="remainingTimeSpan">--:--</span> 
        </div> 
      </div> 
      <div class="tests-start__test"> 
        <div class="tests-start__questions"> 
          <div class="tests-start__questions-content"> 
            <div class="tests-start__question-title">Вопрос ${currentQuestionIndex + 1}:</div> 
            <div class="tests-start__question">${escapeHtml(question.question)}</div>
          </div> 
          ${question.image ? `<img class="tests-start__questions-img" src="../../img/${question.image}" alt="Картинка">` : ''} 
        </div> 
        <div class="tests-start__answers"> 
          <h4 class="tests-start__answers-title">Варианты ответа:</h4> 
          <ul class="tests-start__answers-list"> 
            ${question.answers.map((answer, index) => ` 
              <li class="tests-start__answers-item"> 
                <input type="radio" name="answer" id="answer-${index}" class="tests-start__answer-input"> 
                <label for="answer-${index}" class="tests-start__answer-label">${escapeHtml(answer.text)}</label> 
              </li> 
            `).join('')} 
          </ul> 
        </div> 
      </div> 
    </div>`; 
} 

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function testStart() { 
  const startButton = document.getElementById('start-button'); 
  if (startButton) { 
    startButton.addEventListener('click', displayTest); 
  } 
} 

function displayTest() { 
  renderQuestion(tests); 
  startCountdown(tests); 
} 

function addAnswerListeners(testData) { 
  const answerElements = document.querySelectorAll('input[name="answer"]'); 
  answerElements.forEach(answerElement => { 
    answerElement.addEventListener('change', () => handleAnswerSelection(testData)); 
  }); 
} 

function handleAnswerSelection(testData) {
  const selectedInput = document.querySelector('input[name="answer"]:checked');
  if (selectedInput) {
    const answerList = selectedInput.closest('ul');
    const selectedAnswerIndex = Array.from(answerList.children).indexOf(selectedInput.closest('li'));
    const correctAnswerIndex = testData.questions[currentQuestionIndex].answers.findIndex(a => a.isCorrect);
    
    userSelectedAnswers[currentQuestionIndex] = selectedAnswerIndex;
    userAnswers[currentQuestionIndex] = (selectedAnswerIndex === correctAnswerIndex);
    
    currentQuestionIndex++;
    if (currentQuestionIndex < testData.questions.length) {
      renderQuestion(testData);
    } else {
      displayResults(testData);
    }
  } else {
    alert('Выберите ответ!');
  }
}


function userStatusTest(testData, userLevels) { 
  const { newbie, average, experienced } = userLevels; 
  const correctAnswers = userAnswers.filter(a => a).length; 
  const percentage = Math.floor(correctAnswers / testData.questions.length * 100); 
  return percentage <= 42 ? newbie : percentage <= 77 ? average : experienced; 
} 

let resultsData = null;

function showAllAnswers(testData) {
  showAnswersMode = true;
  let html = `
    <section class="test-results">
      <div class="container">
        <div class="test-results__inner">
          <div class="test-results__btns-top">
            <a class="test-results__btns-again" href="${window.location.origin}/tests/${testData.key}">Пройти еще раз</a>
            <button id="back-to-results" class="test-results__btns-back">Назад к результатам</button>
          </div>
          
          <div class="test-results__top">
            <h3 class="test-results__title">Все ответы: "${testData.title}"</h3>
          </div>
          <div class="test-results__answers-review">
  `;
  
  testData.questions.forEach((question, qIndex) => {
    const userCorrect = userAnswers[qIndex] === true;
    const correctAnswerIndex = question.answers.findIndex(a => a.isCorrect);
    
    html += `
      <div class="answers-review-question">
        <div class="answers-review-question__header">
          <h4>Вопрос ${qIndex + 1}: ${question.question}</h4>
          <span class="answers-review-result ${userCorrect ? 'correct' : 'wrong'}">
            ${userCorrect ? '✅ Правильно' : '❌ Неправильно'}
          </span>
        </div>
        ${question.image ? `<img class="answers-review-question__image" src="../../img/${question.image}" alt="Картинка">` : ''}
        <ul class="answers-review-question__list">
    `;
    
    question.answers.forEach((answer, aIndex) => {
    const isCorrect = aIndex === correctAnswerIndex;
    const userSelected = userSelectedAnswers[qIndex]; // ✅ ТОЧНЫЙ индекс!
    
    let classes = 'answers-review-answer';
    
    // ✅ ТОЧНАЯ ЛОГИКА:
    if (isCorrect && userSelected === aIndex) {
        classes += ' correct user-selected';  // Правильный + выбран
    } else if (isCorrect) {
        classes += ' correct';               // Только правильный
    } else if (userSelected === aIndex) {
        classes += ' wrong user-selected';   // ❌ Выбранный + неправильный
    }
    
    html += `
    <li class="${classes}">
        <span class="answer-bullet"></span>
        <span>${escapeHtml(answer.text)}</span>
    </li>
    `;
    });

    
    html += `</ul></div>`;
  });
  
  html += `
          </div>
        </div>
      </div>
    </section>
  `;
  
  contentDiv.innerHTML = html;
  
  // ✅ Обработчик кнопки "Назад"
  const backBtn = document.getElementById('back-to-results');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showAnswersMode = false;
      displayResults(testData);
    });
  }
}

function displayResults(testData) { 
  if (countdownInterval) clearInterval(countdownInterval); 
  resultsData = testData; 
  
  const userLevel = userStatusTest(testData, userLevels); 
  const spentTime = testData.time * 60 - remainingTime; 
  const minutes = Math.floor(spentTime / 60); 
  const seconds = spentTime % 60; 
  const correctAnswers = userAnswers.filter(a => a).length; 
  const percentage = Math.floor(correctAnswers / testData.questions.length * 100); 
  
  // ✅ Кнопки СНИЗУ как раньше
  contentDiv.innerHTML = ` 
    <section class="test-results"> 
      <div class="container"> 
        <div class="test-results__inner"> 
          <div class="test-results__top"> 
            <h3 class="test-results__title">Тест: "${testData.title}"</h3> 
            <div class="test-results__time">Потраченное время: 00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</div> 
          </div> 
          <div class="test-results__bottom"> 
            <div class="test-results__status">Статус "${userLevel.title}"</div> 
            <div class="test-results__count-answers"> 
              <div class="test-results__count-progress"> 
                <div class="test-results__progress-bar" style="width: ${percentage}%;"></div> 
                <div class="test-results__progress-text">${percentage}% правильных ответов</div> 
              </div> 
              <div class="test-results__score">${correctAnswers}/${testData.questions.length}</div> 
            </div> 
            <p class="test-results__text">${userLevel.text}</p> 
            <div class="test-results__btns"> 
              <a class="test-results__btns-again" href="${window.location.origin}/tests/${testData.key}.html">Пройти еще раз</a> 
              <button id="show-answers-btn" class="test-results__show-answer">Показать ответы</button> 
            </div> 
          </div> 
        </div> 
      </div> 
    </section>`;
  
  const showAnswersBtn = document.getElementById('show-answers-btn');
  if (showAnswersBtn) {
    showAnswersBtn.disabled = false;
    showAnswersBtn.addEventListener('click', () => showAllAnswers(testData));
  }
} 

const decryptData = (encryptedData) => { 
  try { 
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey); 
    return bytes.toString(CryptoJS.enc.Utf8); 
  } catch (e) { 
    console.error('Ошибка дешифровки:', e); 
    return '[]'; 
  } 
}; 

document.addEventListener('DOMContentLoaded', loadTests);
