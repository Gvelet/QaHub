const input = document.getElementById('statuses__wrapper-input');
const statusInfo = document.getElementById('statuses__info');
const submit = document.querySelector('.statuses__wrapper-submit');

const selectGroups = document.getElementById('statusesSelectGroups');
const selectCodes = document.getElementById('statusesSelectCodes');

let statusesData = [];

// Ваш ключ и вектор инициализации для расшифровки
const key = 'your-secret-key'; // Замените на ваш ключ
const iv = 'your-initialization-vector'; // Замените на ваш вектор инициализации

const getCodesSelect = (codes) => {
    selectCodes.innerHTML = `<option value="" disabled selected>Выберите статус код</option>`;
    
    codes.forEach(code => {
        selectCodes.innerHTML += `<option value="${code.name}">${code.name}</option>`;
    });
};

const fetchStatuses = async () => {
    try {
        const response = await fetch('../files/get_statuses.php');
        const result = await response.json();
        
        // Расшифровка данных
        const decryptedData = CryptoJS.AES.decrypt(result.data, key, {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
        
        statusesData = JSON.parse(decryptedData);
        initializeSelectGroups();
        addEventListeners();
    } catch (err) {
        console.error(err);
    }
};

const initializeSelectGroups = () => {
    updateCodesSelect();
};

const addEventListeners = () => {
    submit.addEventListener('click', (e) => {
        e.preventDefault();
        const statusCode = parseInt(input.value);
        const status = statusesData.statuses.find(s => s.name === statusCode);
        OutputStatusCodes(status);
    });

    selectGroups.addEventListener('change', updateCodesSelect);
    selectCodes.addEventListener('change', updateStatusInfo);
};

const updateCodesSelect = () => {
    const selectedGroup = selectGroups.value;
    const filteredCodes = statusesData.statuses.filter(num => String(num.name).startsWith(selectedGroup));
    getCodesSelect(filteredCodes);
    updateStatusInfo();
};

const updateStatusInfo = () => {
    const selectedCode = selectCodes.value;
    
    if (selectedCode) {
        const statusCode = parseInt(selectedCode);
        const status = statusesData.statuses.find(s => s.name === statusCode);
        OutputStatusCodes(status);
    }
};

const StatusSearchResult = () => {
    statusInfo.style.opacity = 1;
    input.value = '';
};

const OutputStatusCodes = (status) => {
    if (status) {
        statusInfo.innerHTML = 
            `<p class='statuses__info-title'>Статус код ${status.name} - ${status.title}</p>
             <p>${status.description}</p>`;
    } else {
        statusInfo.innerHTML = "<p>К сожалению ничего не найдено. Попробуйте ввести другой статус код</p>";
    }
    StatusSearchResult();
};

fetchStatuses();
