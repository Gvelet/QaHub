const fileButton = document.getElementById('fileButton');
const fileInput = document.getElementById('fileInput');
const fileNameInput = document.getElementById('fileName');
const closeButton = document.getElementById('closeButton');
const selectResized = document.querySelector('.resized__select');
const initialSizeImg = document.querySelector('.resized__initial-size');
const newSizeImg = document.querySelector('.resized__new-size');
const containerImg = document.querySelector('.resized-wrapper-img');

let selectedImage;
const IMAGE_FORMAT = 'image/jpeg';


const imageSizes = {
    'black': 3.92,
    'dog': 120, 
    'forest': 162  
};

const resetFileInput = () => {
    containerImg.textContent = '';
    fileInput.value = ''; 
    fileNameInput.value = 'Файл не выбран'; 
};

const updateInitialSize = (size) => {
    initialSizeImg.innerHTML = `Изначальный вес: ${size} кб`;
};

const updateFileName = () => {
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Файл не выбран';
    fileNameInput.value = fileName;
};

const displayPicture = (src) => {
    if (selectedImage) {
        selectedImage.remove();
    }
    
    selectedImage = document.createElement('img'); 
    selectedImage.src = src; 
    selectedImage.classList.add('resized-img'); 
    containerImg.insertBefore(selectedImage, containerImg.firstElementChild);
};



displayPicture(`./img/${selectResized.value}.jpg`)

const loadFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        containerImg.textContent = '';
        displayPicture(e.target.result);
        updateInitialSize(file.size / 1000);
    };
    reader.readAsDataURL(file);
};

const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        loadFile(file);
    }
};

const handleSelectChange = () => {
    const selectedValue = selectResized.value;
    updateInitialSize(imageSizes[selectedValue]);
    resetFileInput();
    displayPicture(selectingPicture());
};

const selectingPicture = () => {
    const selectedValue = selectResized.value;
    return `./img/${selectedValue}.jpg`;
};

const resizeImage = () => {
    const widthInput = document.getElementById('resizedWidth').value;
    const heightInput = document.getElementById('resizedHeight').value;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = widthInput;
    canvas.height = heightInput;

    ctx.drawImage(selectedImage, 0, 0, widthInput, heightInput);
    const url = canvas.toDataURL(format);

    canvas.toBlob((blob) => {
        newSizeImg.innerHTML = `Новый вес: ≈ ${blob.size / 1000} кб`;
    }, format);

    return url;
};

const downloadResizedImage = () => {
    const url = resizeImage();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resized_image';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); 
};

updateInitialSize(imageSizes.black);

fileButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    updateFileName();
    handleFileInputChange(e);
});

closeButton.addEventListener('click', () => {
    resetFileInput();
    updateInitialSize(imageSizes[selectResized.value]);
    displayPicture(selectingPicture());
});

selectResized.addEventListener('change', handleSelectChange);
document.getElementById('downloadButton').addEventListener('click', downloadResizedImage);
