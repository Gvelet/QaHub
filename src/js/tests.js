// -----------------------------------------ВЫВОД ВСЕХ ТЕСТОВ-------------------------------------------------
function loadJSON() {
    fetch('https://raw.githubusercontent.com/Gvelet/QaHub-api/refs/heads/main/db/combined.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Сеть ответила с ошибкой');
            }
            return response.json();
        })
        .then(data => {
            displayData(data);
        })
        .catch(error => {
            console.error('Ошибка при загрузке JSON:', error);
        });
}

function displayData(data) {
    const contentDiv = document.getElementById('testsWrapper');
    data.forEach(item => {
        const key = Object.keys(item)[0];
        const testData = item[key];
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('tests__column');
        itemDiv.innerHTML = `
            <a class="tests-item" href="test.html?test=${key}">
                <div class="tests__item-icon">
                    <img src="./img/test-icon.png" alt="icon">
                </div>
                <div class="tests__item-content">
                    <h3 class="tests__item-title">${testData.title}</h3>
                    <div class="tests__item-description">${testData.briefDescription}</div>
                </div>
            </a>
        `;
        contentDiv.appendChild(itemDiv);
    });
}

loadJSON();