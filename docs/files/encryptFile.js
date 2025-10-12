// Запуск node encryptFile.js

const fs = require('fs');
const CryptoJS = require('crypto-js');
const axios = require('axios');

const secretKey = "My$ecretK3y!2023";
const url = 'https://raw.githubusercontent.com/Gvelet/QaHub-api/refs/heads/main/db/statuses.json';
const urlTests = 'https://raw.githubusercontent.com/Gvelet/QaHub-api/refs/heads/main/db/combinedFiles/allTests.json';
const urlPractices = 'https://raw.githubusercontent.com/Gvelet/QaHub-api/refs/heads/main/db/combinedFiles/allPractices.json';

// Функция для загрузки и шифрования данных
const encryptDataFromUrl = async (url, filename) => {
    try {
        // Получение данных по URL
        const response = await axios.get(url);
        const data = response.data;

        // Шифрование данных
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();

        // Запись зашифрованного файла
        fs.writeFile(filename, encryptedData, (err) => {
            if (err) throw err;
            console.log(`Файл ${filename} был успешно зашифрован!`);
        });
    } catch (error) {
        console.error(`Ошибка при загрузке или шифровании данных ${filename}:`, error);
    }
};

// Вызов функции
encryptDataFromUrl(url, 'encrypted/encrypted_statuses.json');
encryptDataFromUrl(urlTests, 'encrypted/encrypted_tests.json');
encryptDataFromUrl(urlPractices, 'encrypted/encrypted_practices.json');
