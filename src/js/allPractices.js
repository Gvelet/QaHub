const secretKey = "My$ecretK3y!2023"; 
import CryptoJS from 'crypto-js';

function loadJSON() {
    fetch('../files/encrypted/encrypted_practices.json')
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
    const contentDiv = document.getElementById('practicesWrapper');
    data.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('practices__column');
        itemDiv.innerHTML = `
            <a class="practices-item" href="${item.url}">
                <div class="tests__item-icon">
                    <img src="../../img/${item.icon}" alt="${item.icon}">
                </div>
                <div class="tests__item-content">
                    <h3 class="tests__item-title">${item.title}</h3>
                    <div class="tests__item-description">${item.briefDescription}</div>
                </div>
            </a>
        `;
        if (index === 0) {
            contentDiv.appendChild(itemDiv);
        }
        
    });

}

// Функция расшифровки
const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);

    
};

loadJSON();
