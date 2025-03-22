<?php
// Получаем данные от GitHub
$payload = json_decode(file_get_contents('php://input'), true);

// Проверяем, что это событие push
if (isset($payload['action']) && $payload['action'] === 'push') {
    $projectPath = '/www/qualityhub.ru/'; // Замените на ваш фактический путь

    chdir($projectPath);

    exec('git pull https://github.com/Gvelet/QaHub.git main', $output, $return_var);


    if ($return_var === 0) {
        echo "Деплой успешен!";
    } else {
        echo "Ошибка при деплое: " . implode("\n", $output);
    }
} else {
    echo "Не поддерживаемое событие.";
}
?>
