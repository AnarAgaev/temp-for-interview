/**
 * Downloads a file from the specified URL and triggers a download in the browser.
 * 
 * @param {string} url - The URL of the file to be downloaded.
 */
window.downloadFile = (url, filename=null, defaultExtension = 'bin')  => {
    if (url === undefined || url === null || url === "") {
        return;
    }
    // Показать спиннер
    if (window.spinner && typeof window.spinner.show === "function") {
        window.spinner.show();
    }

    // Создаем новый XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    // Обработчик завершения загрузки
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Попытка получить расширение из заголовков
            let extension = defaultExtension;
            const contentDisposition = xhr.getResponseHeader("Content-Disposition");
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?((.*)\.(.*))"?/);
                if (match && match[1]) {
                    if (!filename) {
                        filename = match[2];
                    }
                    extension = match[3];
                }
            }

            // Создаем URL для загруженного файла
            const blobUrl = URL.createObjectURL(xhr.response);

            // Создаем временный элемент <a> для скачивания файла
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = `${filename}.${extension}`; // Устанавливаем имя файла с расширением

            // Добавляем элемент в DOM и инициируем скачивание
            document.body.appendChild(a);
            a.click();

            // Удаляем элемент из DOM
            document.body.removeChild(a);

            // Освобождаем URL объекта
            URL.revokeObjectURL(blobUrl);
        }

        // Скрыть спиннер
        if (window.spinner && typeof window.spinner.hide === "function") {
            window.spinner.hide();
        }
    };

    // Обработчик ошибок
    xhr.onerror = function() {
        console.error("Ошибка при загрузке файла");

        // Скрыть спиннер в случае ошибки
        if (window.spinner && typeof window.spinner.hide === "function") {
            window.spinner.hide();
        }
    };

    // Отправляем запрос
    xhr.send();
}