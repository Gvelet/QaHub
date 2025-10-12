const secretKey = "My$ecretK3y!2023"; 
import CryptoJS from 'crypto-js';

let counterStart = 0;
const foundAnswers = [];

const counterFoundCases = document.querySelector('.practic__wrapper-text');
const descriptionPage = document.querySelector('.practic__text');
const wrapperList = document.querySelector('.practic__wrapper-list');
const btnSend = document.querySelector('.practic__wrapper-btn');
const inputName = document.querySelector('.practic__wrapper-input');

// Функция расшифровки
const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

function addUniqueAnswer(msg) {
    if (msg && !foundAnswers.includes(msg)) {
        foundAnswers.push(msg);
        counterStart++;
        updateCounterDisplay();
    }
}

function updateCounterDisplay() {
    const total = counterFoundCases.getAttribute('data-total') || 0;
    counterFoundCases.innerHTML = `<p>Найдено кейсов: <span>${counterStart}/${total}</span></p>`;
}

async function loadTests() {
    const response = await fetch('../files/encrypted/encrypted_practices.json');
    const encryptedData = await response.text();
    const decryptedData = decryptData(encryptedData); 
    const data = JSON.parse(decryptedData);

    const page = window.location.pathname.match(/\/allPractices\/([^\.]+)\.html$/)?.[1];
    const findCurrentPractic = data.find(practic => practic.url === page);
    if (!findCurrentPractic) {
        console.error('Не найден текущий практик по адресу');
        return;
    }

    counterFoundCases.setAttribute('data-total', Object.keys(findCurrentPractic.messages).length);

    updateCounterDisplay();
    displayMainText(findCurrentPractic);

    function sendMessage() {
        displayListMessage(findCurrentPractic);
        inputName.value = '';
    }

    btnSend.addEventListener('click', sendMessage);
    inputName.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
}
loadTests()

function displayMainText(practicData){
    descriptionPage.textContent = practicData.description;
}

function displayListMessage(practicData) {
    const messageArray = conditionsCaseProcessing(practicData) || [];

    messageArray.forEach(msg => {
        addUniqueAnswer(msg);
    });

    wrapperList.innerHTML = '';
    foundAnswers.forEach((msg, index) => {
        wrapperList.innerHTML += `
            <p class="practic_wrapper-info-text">${index + 1}. ${msg}</p>
        `;
    });
}

function conditionsCaseProcessing(practicData) {
    const messages = practicData.messages;
    const value = inputName.value.trim();
    const originalValue = inputName.value;
    const { maxLength, minLength } = practicData.validation;

    const resultMessages = [];

    if (originalValue === '') {
        resultMessages.push(messages.empty);
        return resultMessages; 
    }
    if (originalValue.trim() === '' && originalValue !== '') {
        resultMessages.push(messages.onlySpaces);
        return resultMessages;
    }
    const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'TRUNCATE', 'UNION'];
    const upperValue = originalValue.toUpperCase();
    for (let keyword of sqlKeywords) {
        if (upperValue.includes(keyword)) {
            if (!resultMessages.includes(messages.sqlTest)) resultMessages.push(messages.sqlTest);
        }
    }
    if (/^ +/.test(originalValue)) {
        resultMessages.push(messages.spacesBeginning);
    }
    if (/ +$/.test(originalValue)) {
        resultMessages.push(messages.spacesEnd);
    }
    if (/^\d+$/.test(value)) {
        resultMessages.push(messages.enteringNumbers);
    }
    if (/^[A-Za-z]+$/.test(value)) {
        resultMessages.push(messages.latinInput);
    }
    if (/^[А-Яа-яЁё]+$/.test(value)) {
        resultMessages.push(messages.сyrillicInput);
    }
    if (/[^A-Za-z0-9А-Яа-яЁё\s]/.test(originalValue)) {
        resultMessages.push(messages.specialCharacters);
    }
    if (value.length === minLength) {
        resultMessages.push(messages.min);
    }
    if (value.length === maxLength) {
        resultMessages.push(messages.max);
    }
    if (value.length === minLength - 1) {
        resultMessages.push(messages.minimumBoundary);
    }
    if (value.length === maxLength + 1) {
        resultMessages.push(messages.maximumBoundary);
    }

    return resultMessages;
}