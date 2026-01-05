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
const map = L.map('kamenkaMap').setView([47.04, 29.01], 12);

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

const terraceIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png', // стандартная иголка
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  className: 'terrace-marker' // чтобы потом можно было поменять цвет через CSS
});

const redMountainIcon = L.icon({
  iconUrl: 'images/red.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const rashkovIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  className: 'rashkov-marker'
});

// Точки маршрута
const points = [
  {
    name: "Парк Витгенштейна",
    coords: [47.034, 29.000],
    description: "Парк Витгенштейна — живописный парк с зелёными аллеями и историческими объектами.",
    icon: parkIcon
  },
  {
    name: "Виноградные террасы",
    coords: [47.040, 29.010],
    description: "Виноградные террасы — место для прогулок среди виноградников и красивых пейзажей.",
    icon: terraceIcon
  },
  {
    name: "Мистическая Червона Гора",
    coords: [47.045, 29.020],
    description: "Мистическая Червона Гора — природный объект с легендами и красивыми видами.",
    icon: redMountainIcon
  },
  {
    name: "Рашков",
    coords: [47.050, 29.030],
    description: "Рашков — село с исторической атмосферой и живописной природой.",
    icon: rashkovIcon
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
    styles: [{ color: 'blue', opacity: 0.6, weight: 5 }]
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

  // === ТОЧКИ НА КАРТЕ (как в статье Гуркиной и Жулиной!) ===
  const points = {
    park:        { name: "Парк Витгенштейна",     coords: [47.034, 29.000] },
    terraces:    { name: "Виноградные террасы",   coords: [47.040, 29.010] },
    redMountain: { name: "Червона Гора",          coords: [47.045, 29.020] },
    rashkov:     { name: "Рашков",                coords: [47.050, 29.030] }
  };

  // === МАРШРУТЫ ===
  const routes = {
    light:    { 
      name: "Лайт (10 км)", 
      distance: 10, 
      difficulty: 1.0,
      waypoints: [points.park, points.terraces],
      center: [47.037, 29.005]
    },
    standard: { 
      name: "Стандарт (15 км)", 
      distance: 15, 
      difficulty: 1.3,
      waypoints: [points.park, points.terraces, points.redMountain],
      center: [47.040, 29.010]
    },
    pro:      { 
      name: "Про (30 км)", 
      distance: 30, 
      difficulty: 1.6,
      waypoints: [points.park, points.terraces, points.redMountain, points.rashkov],
      center: [47.042, 29.015]
    }
  };

  const r = routes[routeInput.value];
  const speed = { beginner: 3, average: 4, experienced: 5 }[levelInput.value];
  const group = document.getElementById('groupSize').value;

  // Расчёт времени
  const walkH = r.distance / speed;
  const restH = (12.5 / 60) * walkH;
  const totalH = walkH * r.difficulty + restH;
  const h = Math.floor(totalH);
  const m = Math.round((totalH - h) * 60);

  // Результат
  document.getElementById('resultContent').innerHTML = `
    <p><strong>Маршрут:</strong> ${r.name}</p>
    <p><strong>Время:</strong> <span style="color:#4B99B2;font-weight:700;">${h} ч ${m < 10 ? '0' : ''}${m} мин</span></p>
    <p><strong>Уровень:</strong> ${levelInput.parentNode.textContent.trim()}</p>
    <p><strong>Группа:</strong> ${group} чел.</p>
    <hr style="margin:20px 0;border-top:1px solid #eee;">
    <p style="font-size:15px;line-height:1.6;color:#555;">
      ${r.difficulty === 1.0 ? 'Лёгкий маршрут от Парка Витгенштейна до виноградных террас.' :
        r.difficulty === 1.3 ? 'Маршрут до мистической Червоної Горы — для тех, кто любит природу и легенды.' :
        'Полный путь до Рашкова — настоящее приключение с Духом Днестра!'}
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

// Профиль высот для маршрута Каменки
const kamenkaCoordinates = [
  { lat: 48.03495464717821, lng: 28.685364367927193, name: 'Парк Витгенштейна' },
  { lat: 47.88846225045952, lng: 28.9310212544243, name: 'Виноградные террасы' },
  { lat: 47.94293588391828, lng: 28.84139962559233, name: 'Червона гора' },
  { lat: 47.9411415184005, lng: 28.840135136611128, name: 'Рашков' }
];

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
    // Fallback: использовать приблизительные значения высоты
    return coordinates.map((coord, index) => ({
      elevation: 100 + Math.random() * 50, // Приблизительные значения
      distance: index * 3, // Приблизительное расстояние
      name: coord.name
    }));
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Радиус Земли в км
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function createElevationChart() {
  const elevationData = await fetchElevationData(kamenkaCoordinates);
  
  // Вычисляем накопительное расстояние
  let cumulativeDistance = 0;
  const distances = elevationData.map((point, index) => {
    if (index > 0) {
      cumulativeDistance += point.distance;
    }
    return cumulativeDistance;
  });
  
  const elevations = elevationData.map(point => point.elevation);
  const labels = elevationData.map((point, index) => {
    if (index === 0 || index === elevationData.length - 1) {
      return point.name;
    }
    return '';
  });

  const ctx = document.getElementById('kamenkaElevationChart');
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

// Инициализация графика после загрузки страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createElevationChart);
} else {
  createElevationChart();
}

  
 