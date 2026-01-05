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
const map = L.map('pulseMap').setView([46.842, 29.633], 13);

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

const defaultIcon = L.icon({
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
    name: "Екатерининский парк",
    coords: [46.837902, 29.610767],
    description: "Екатерининский парк — ухоженный и светлый парк с широкими аллеями.",
    icon: parkIcon
  },
  {
    name: "Покровский парк",
    coords: [46.844221, 29.623648],
    description: "Покровский парк — камерное место с тенью и мягкими грунтовыми тропами.",
    icon: defaultIcon
  },
  {
    name: "Парк Победа",
    coords: [46.838232, 29.639644],
    description: "Парк Победа — сосновая роща, пруды, мостики и просторные поляны.",
    icon: defaultIcon
  },
  {
    name: "Парк Авиаторов",
    coords: [46.840111, 29.657250],
    description: "Парк Авиаторов — открытое и солнечное пространство с ветром от Днестра.",
    icon: defaultIcon
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
  ekat:   { name: "Екатерининский парк", coords: [46.837902, 29.610767] },
  pokrov: { name: "Покровский парк", coords: [46.844221, 29.623648] },
  pobeda: { name: "Парк Победа", coords: [46.83823238366267, 29.639644884658054] },
  aviator:{ name: "Парк Авиаторов", coords: [46.84011152227694, 29.657250022562028] }
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

  // Функция расчета общего расстояния для массива точек
  function calculateTotalDistance(waypoints) {
    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      total += calculateDistance(
        waypoints[i].coords[0],
        waypoints[i].coords[1],
        waypoints[i + 1].coords[0],
        waypoints[i + 1].coords[1]
      );
    }
    return Math.round(total * 10) / 10;
  }

  // === МАРШРУТЫ ===
  const routes = {
    light:    { 
      name: "Лайт (Екатерининский → Покровский)", 
      distance: calculateTotalDistance([points.ekat, points.pokrov]),
      difficulty: 1.0,
      waypoints: [points.ekat, points.pokrov],
      center: [46.841, 29.617]
    },
    standard: { 
      name: "Стандарт (Екатерининский → Покровский → Победа → Авиаторов)", 
      distance: calculateTotalDistance([points.ekat, points.pokrov, points.pobeda, points.aviator]),
      difficulty: 1.0,
      waypoints: [points.ekat, points.pokrov, points.pobeda, points.aviator],
      center: [46.841, 29.635]
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
      ${r.difficulty === 1.0 && r.waypoints.length === 2 ? 'Лёгкая связка Екатерининского и Покровского парков — для спокойной прогулки с тенью аллей и уютных троп.' :
        'Полный круг по четырём паркам: от ухоженных аллей Екатерининского до открытых пространств Авиаторов — чтобы почувствовать единый зелёный ритм города.'}
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
      elevation: 50 + Math.random() * 20,
      distance: index * 2.5,
      name: coord.name
    }));
  }
}

// Профиль высот для pulseTiraspol
const pulseTiraspolCoordinates = [
  { lat: 46.837924573343095, lng: 29.61081046970385, name: 'Екатерининский парк' },
  { lat: 46.844069154039396, lng: 29.62371916785719, name: 'Покровский парк' },
  { lat: 46.838298407309594, lng: 29.639677067856827, name: 'Парк Победа' },
  { lat: 46.83936868207123, lng: 29.65728602083197, name: 'Парк Авиаторов' }
];

async function createPulseTiraspolElevationChart() {
  const elevationData = await fetchElevationData(pulseTiraspolCoordinates);
  
  let cumulativeDistance = 0;
  const distances = elevationData.map((point, index) => {
    if (index > 0) {
      cumulativeDistance += point.distance;
    }
    return cumulativeDistance;
  });
  
  const elevations = elevationData.map(point => point.elevation);

  const ctx = document.getElementById('pulseTiraspolElevationChart');
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
  document.addEventListener('DOMContentLoaded', createPulseTiraspolElevationChart);
} else {
  createPulseTiraspolElevationChart();
}

  
 