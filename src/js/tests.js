const secretKey = "My$ecretK3y!2023"; 
import CryptoJS from 'crypto-js';

function loadJSON() {
    fetch('../files/encrypted/encrypted_tests.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Сеть ответила с ошибкой');
            }
            return response.text(); 
        })
        .then(encryptedData => {
            const decryptedData = decryptData(encryptedData);
            const jsonData = JSON.parse(decryptedData); 
            displayData(jsonData);
        })
        .catch(error => {
            console.error('Ошибка при загрузке JSON:', error);
        });
}

function displayData(data) {
    const contentDiv = document.getElementById('testsWrapper');
    data.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('tests__column');
        itemDiv.innerHTML = `
            <a class="tests-item" href="test.html?test=${item.key}">
                <div class="tests__item-icon">
                    <img src="../../img/${item.icon}" alt="${item.icon}">
                </div>
                <div class="tests__item-content">
                    <h3 class="tests__item-title">${item.title}</h3>
                    <div class="tests__item-description">${item.briefDescription}</div>
                </div>
            </a>
        `;
        contentDiv.appendChild(itemDiv);
    });
}

// Функция расшифровки
const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);

    
};

loadJSON();
