const inputText = document.getElementById('input-counting');
const totalChars = document.getElementById('totalChars');
const noSpaces = document.getElementById('noSpaces');
const wordCount = document.getElementById('wordCount');
const cyrillicChars = document.getElementById('cyrillicChars');
const latinChars = document.getElementById('latinChars');
const digitCount = document.getElementById('digitCount');
const specialChars = document.getElementById('specialChars');
const copyIcon = document.getElementById('copyIcon');

function updateCharacterCount(text) {
    const textWithoutLineBreaks = text.replace(/[\r\n]+/g, '');
    totalChars.textContent = textWithoutLineBreaks.length;
    noSpaces.textContent = textWithoutLineBreaks.replace(/\s/g, '').length;
}

function updateWordCount(text) {
    const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const words = normalizedText.match(/(?:[а-яёa-z]+(?:[-'][а-яёa-z]*)*)/gi);
    wordCount.textContent = words ? words.length : 0;
}

function updateCharacterTypeCount(text) {
    cyrillicChars.textContent = text.match(/[а-яё]/gi) ? text.match(/[а-яё]/gi).length : 0;
    latinChars.textContent = text.match(/[a-z]/gi) ? text.match(/[a-z]/gi).length : 0;
    digitCount.textContent = text.match(/\d/g) ? text.match(/\d/g).length : 0;
    specialChars.textContent = text.replace(/[a-zа-яё\d\s]/gi, '').length;
}

function toggleCopyIconVisibility(text) {
    if (text.length > 0) {
        copyIcon.style.display = 'inline';
        copyIcon.addEventListener('click', () => {
            navigator.clipboard.writeText(text);
        });
    } else {
        copyIcon.style.display = 'none';
    }
}

inputText.addEventListener('input', () => {
    const text = inputText.value;

    updateCharacterCount(text);
    updateWordCount(text);
    updateCharacterTypeCount(text);
    toggleCopyIconVisibility(text);
});