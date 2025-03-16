<?php
// api/get_questions.php

// Путь к вашему JSON файлу
$jsonFilePath = 'files/data/stasuses.json';

// Проверка, существует ли файл
if (file_exists($jsonFilePath)) {
    // Чтение содержимого JSON файла
    $jsonData = file_get_contents($jsonFilePath);
    
    // Установка заголовка для JSON
    header('Content-Type: application/json');
    
    // Возвращаем данные
    echo $jsonData;
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Файл не найден']);
}
?>
