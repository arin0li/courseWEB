let currentSlide = 0;

const track = document.getElementById("galleryTrack");
const slides = document.querySelectorAll(".gallery-image");
const totalSlides = slides.length;

const prevBtn = document.querySelector(".nav-btn.prev");
const nextBtn = document.querySelector(".nav-btn.next");

// Функция прокрутки
function moveSlide(direction) {
    currentSlide += direction;

    // Зацикливание
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Вешаем обработчики на кнопки
prevBtn.addEventListener("click", () => moveSlide(-1));
nextBtn.addEventListener("click", () => moveSlide(1));

// Опционально: поддержка клавиш ← →
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveSlide(-1);
    if (e.key === "ArrowRight") moveSlide(1);
});




 // Создаём карту
// Создаём карту
const map = L.map('turuncukMap').setView([46.673, 29.760], 13);

// Добавляем слой карты
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Кастомные иконки
const parkIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const riverIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

// Точки маршрута
const points = [
  {
    name: "Парк им. Дмитрия Родина",
    coords: [46.681884862905015, 29.75630761202423],
    description: "Парк им. Дмитрия Родина — тихий и уютный природный комплекс с гротами, водопадами и влажными уголками.",
    icon: parkIcon
  },
  {
    name: "Рукав Турунчук",
    coords: [46.665402795019524, 29.765156120226266],
    description: "Рукав Турунчук — спокойный и чистый водный участок Днестровской системы с лёгкими порогами.",
    icon: riverIcon
  }
];

// Добавляем маркеры
points.forEach(point => {
  L.marker(point.coords, { icon: point.icon })
    .addTo(map)
    .bindPopup(`<b>${point.name}</b><br>${point.description}`);
});

// Маршрут по дорогам
L.Routing.control({
  waypoints: points.map(p => L.latLng(p.coords[0], p.coords[1])),
  routeWhileDragging: false,
  show: false,
  lineOptions: {
    styles: [{ color: '#4B99B2', opacity: 0.8, weight: 6 }]
  },
  createMarker: function() { return null; }
}).addTo(map);




// === КАЛЬКУЛЯТОР ПО ФОРМУЛЕ ИЗ СТАТЬИ ГУРКИНОЙ И ЖУЛИНОЙ ===

let resultMap = null;
let currentRoutingControl = null; // Чтобы удалять старый маршрут

document.getElementById('groupSize').addEventListener('input', function() {
  document.getElementById('groupValue').textContent = this.value;
});

document.getElementById('calcSubmit').addEventListener('click', function() {
  const levelInput = document.querySelector('input[name="level"]:checked');
  const routeInput = document.querySelector('input[name="route"]:checked');

  if (!levelInput || !routeInput) {
    alert('Выберите уровень и маршрут!');
    return;
  }

  // === ТОЧКИ НА КАРТЕ ===
  const points = {
    park:    { name: "Парк им. Дмитрия Родина", coords: [46.681884862905015, 29.75630761202423] },
    turuncuk: { name: "Рукав Турунчук", coords: [46.665402795019524, 29.765156120226266] }
  };

  // Функция расчета расстояния между точками (приблизительно)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Радиус Земли в км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // === МАРШРУТЫ ===
  const routes = {
    light:    { 
      name: "Лайт (только Парк Родина)", 
      distance: 2.5, // Прогулка по парку примерно 2.5 км
      difficulty: 1.0, // Легкий
      waypoints: [points.park],
      center: [46.681884862905015, 29.75630761202423]
    },
    standard: { 
      name: "Стандарт (Парк Родина → Рукав Турунчук)", 
      distance: Math.round(calculateDistance(
        points.park.coords[0], 
        points.park.coords[1],
        points.turuncuk.coords[0], 
        points.turuncuk.coords[1]
      ) * 10) / 10, // Округляем до 1 знака после запятой
      difficulty: 1.0, // Легкий
      waypoints: [points.park, points.turuncuk],
      center: [46.673, 29.760]
    }
  };

  const r = routes[routeInput.value];
  const speed = { beginner: 3, average: 4, experienced: 5 }[levelInput.value];
  const group = document.getElementById('groupSize').value;

  // Расчёт времени по формуле: Время = (Дистанция / Скорость) × Коэффициент_сложности + Время_на_отдых
  const walkH = r.distance / speed; // Часы ходьбы
  const walkTime = walkH * r.difficulty; // Время с учетом коэффициента сложности
  const restTime = (12.5 / 60) * walkH; // Время на отдых (12.5 минут на каждый час ходьбы)
  const totalH = walkTime + restTime; // Общее время
  const h = Math.floor(totalH);
  const m = Math.round((totalH - h) * 60);

  // Результат
  document.getElementById('resultContent').innerHTML = `
    <p><strong>Маршрут:</strong> ${r.name}</p>
    <p><strong>Дистанция:</strong> ${r.distance} км</p>
    <p><strong>Время:</strong> <span style="color:#4B99B2;font-weight:700;">${h} ч ${m < 10 ? '0' : ''}${m} мин</span></p>
    <p><strong>Уровень:</strong> ${levelInput.parentNode.textContent.trim()}</p>
    <p><strong>Группа:</strong> ${group} чел.</p>
    <hr style="margin:20px 0;border-top:1px solid #eee;">
    <p style="font-size:15px;line-height:1.6;color:#555;">
      ${r.difficulty === 1.0 && r.waypoints.length === 1 ? 'Прогулка по Парку им. Дмитрия Родина — для тех, кто хочет насладиться гротами, водопадами и спокойной атмосферой природного комплекса.' :
        'Маршрут от Парка Родина до рукава Турунчук — для любителей природы, которые хотят увидеть чистую воду, пороги и насладиться спокойным осенним отдыхом у реки.'}
    </p>
  `;

  const resultBlock = document.getElementById('resultBlock');
  resultBlock.style.display = 'block';

  // === КАРТА С МАРШРУТОМ ===
  setTimeout(() => {
    if (!resultMap) {
      resultMap = L.map('routeMap').setView(r.center, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(resultMap);
    } else {
      resultMap.setView(r.center, 13);
      if (currentRoutingControl) resultMap.removeControl(currentRoutingControl);
    }

    // Удаляем старые маркеры
    resultMap.eachLayer(l => { if (l instanceof L.Marker) resultMap.removeLayer(l); });

    // Рисуем маршрут
    currentRoutingControl = L.Routing.control({
      waypoints: r.waypoints.map(p => L.latLng(p.coords[0], p.coords[1])),
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      createMarker: (i, wp) => L.marker(wp.latLng).bindPopup(`<b>${r.waypoints[i].name}</b>`),
      lineOptions: { styles: [{ color: '#4B99B2', weight: 6, opacity: 0.8 }] }
    }).addTo(resultMap);

    resultMap.invalidateSize();
    resultBlock.scrollIntoView({ behavior: 'smooth' });
  }, 200);
});

// Функции для профиля высот
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function fetchElevationData(coordinates) {
  try {
    const locations = coordinates.map(coord => ({
      latitude: coord.lat,
      longitude: coord.lng
    }));
    
    const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locations })
    });
    
    const data = await response.json();
    return data.results.map((result, index) => ({
      elevation: result.elevation,
      distance: index === 0 ? 0 : calculateDistance(
        coordinates[index - 1].lat,
        coordinates[index - 1].lng,
        coordinates[index].lat,
        coordinates[index].lng
      ),
      name: coordinates[index].name
    }));
  } catch (error) {
    console.error('Error fetching elevation data:', error);
    return coordinates.map((coord, index) => ({
      elevation: 30 + Math.random() * 20,
      distance: index * 2.5,
      name: coord.name
    }));
  }
}

// Профиль высот для parkTuruncuk
const turuncukCoordinates = [
  { lat: 46.68187014190128, lng: 29.75630761202423, name: 'Парк имени Родина' },
  { lat: 46.665402795019524, lng: 29.765156120226266, name: 'Турунчук рукав' }
];

async function createTuruncukElevationChart() {
  const elevationData = await fetchElevationData(turuncukCoordinates);
  
  let cumulativeDistance = 0;
  const distances = elevationData.map((point, index) => {
    if (index > 0) {
      cumulativeDistance += point.distance;
    }
    return cumulativeDistance;
  });
  
  const elevations = elevationData.map(point => point.elevation);

  const ctx = document.getElementById('turuncukElevationChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: distances.map((d, i) => `${d.toFixed(1)} км`),
      datasets: [{
        label: 'Высота (м)',
        data: elevations,
        borderColor: '#4B99B2',
        backgroundColor: 'rgba(75, 153, 178, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#4B99B2',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 14,
              family: "'Rubik', sans-serif"
            }
          }
        },
        tooltip: {
          callbacks: {
            title: function(context) {
              const index = context[0].dataIndex;
              return elevationData[index].name;
            },
            label: function(context) {
              return `Высота: ${context.parsed.y.toFixed(1)} м`;
            },
            afterLabel: function(context) {
              const index = context.dataIndex;
              return `Расстояние: ${distances[index].toFixed(1)} км`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Расстояние (км)',
            font: {
              size: 14,
              family: "'Rubik', sans-serif"
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Высота (м)',
            font: {
              size: 14,
              family: "'Rubik', sans-serif"
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createTuruncukElevationChart);
} else {
  createTuruncukElevationChart();
}

  
 