# Vendor - Сторонние библиотеки

Эта директория предназначена для сторонних библиотек и зависимостей проекта.

## Текущая ситуация

В данном проекте сторонние библиотеки используются через **CDN** (Content Delivery Network), а не локально. Это стандартная практика для веб-проектов, так как:

- ✅ Быстрая загрузка (кэширование CDN)
- ✅ Отсутствие необходимости обновлять файлы вручную
- ✅ Меньший размер репозитория
- ✅ Автоматические обновления безопасности

## Используемые библиотеки

### 1. Font Awesome (v6.5.0)
**URL:** `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css`

Иконки для интерфейса.

### 2. Google Fonts
**URL:** `https://fonts.googleapis.com/css2?...`

Шрифты:
- Rubik
- Montserrat
- Merriweather
- Open Sans

### 3. Leaflet (v1.9.4)
**URLs:**
- CSS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- JS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`

Библиотека для интерактивных карт.

### 4. Leaflet Routing Machine (v3.2.12)
**URLs:**
- CSS: `https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css`
- JS: `https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.min.js`

Расширение для Leaflet для построения маршрутов.

### 5. Chart.js (v4.4.0)
**URL:** `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`

Библиотека для создания графиков и диаграмм.

### 6. Axios
**URL:** `https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js`

HTTP-клиент для JavaScript.

## Если нужно использовать локальные файлы

Если в будущем потребуется использовать локальные версии библиотек (например, для работы офлайн), выполните следующие шаги:

1. Скачайте библиотеки в соответствующие поддиректории:
   ```
   vendor/
     fontawesome/
       css/
         all.min.css
       webfonts/
     leaflet/
       leaflet.css
       leaflet.js
       images/
     ...
   ```

2. Обновите пути в HTML файлах с CDN на локальные:
   ```html
   <!-- Было -->
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
   
   <!-- Стало -->
   <link rel="stylesheet" href="../vendor/fontawesome/css/all.min.css">
   ```

## Рекомендации

- Для продакшена рекомендуется использовать локальные файлы или package manager (npm/yarn)
- Всегда фиксируйте версии библиотек
- Регулярно проверяйте обновления и уязвимости
- Используйте `.gitignore` для исключения больших файлов библиотек (если будут использоваться локально)


