<?php
// api/get_questions.php

// Путь к вашему JSON файлу
$jsonFilePath = '../files/data/statuses.json';

// Ключ и вектор инициализации для шифрования
$key = 'your-secret-key'; // Замените на ваш ключ
$iv = 'your-initialization-vector'; // Замените на ваш вектор инициализации

// Проверка, существует ли файл
if (file_exists($jsonFilePath)) {
    // Чтение содержимого JSON файла
    $jsonData = file_get_contents($jsonFilePath);
    
    // Шифрование данных
    $encryptedData = openssl_encrypt($jsonData, 'aes-256-cbc', $key, 0, $iv);
    
    // Установка заголовка для JSON
    header('Content-Type: application/json');
    
    // Возвращаем зашифрованные данные
    echo json_encode(['data' => $encryptedData]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Файл не найден']);
}
?>
