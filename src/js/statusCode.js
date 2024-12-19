const input = document.getElementById('statuses__wrapper-input');
const statusInfo = document.getElementById('statuses__info');
const submit = document.querySelector('.statuses__wrapper-submit');

const selectGroups = document.getElementById('statusesSelectGroups');
const selectCodes = document.getElementById('statusesSelectCodes');

let statusesData = [];

const getCodesSelect = (codes) => {
    selectCodes.innerHTML = `<option value="" disabled selected>Выберите статус код</option>`;
    
    codes.forEach(code => {
        selectCodes.innerHTML += `<option value="${code.name}">${code.name}</option>`;
    });
};

const fetchStatuses = async () => {
    try {
        const response = await fetch('./files/statuses.json');
        statusesData = await response.json();
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
