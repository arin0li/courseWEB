// Быстрый просмотр для маршрутов и достопримечательностей
document.addEventListener('DOMContentLoaded', function() {
  // Обработчики для "Быстрый просмотр" на достопримечательностях
  document.querySelectorAll('.attraction-card__quick, .attraction-card .routes-card__quick').forEach(quickBtn => {
    quickBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.attraction-card');
      if (card) {
        // Определяем, какая это достопримечательность по модификаторам
        let modalId = null;
        if (card.classList.contains('attraction-card--yagorlyk')) {
          modalId = 'attraction-yagorlyk';
        } else if (card.classList.contains('attraction-card--grape')) {
          modalId = 'attraction-vineyards';
        } else if (card.classList.contains('attraction-card--park')) {
          modalId = 'attraction-rodina';
        }

        if (modalId) {
          const modal = document.getElementById('modal-' + modalId);
          if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
          }
        }
      }
    });
  });

  // Обработчики для "Быстрый просмотр" на маршрутах
  document.querySelectorAll('.routes-card__quick').forEach(quickBtn => {
    quickBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.routes-card');
      if (card) {
        // Определяем, какой это маршрут по модификаторам
        let modalId = null;
        if (card.classList.contains('routes-card--kamenka')) {
          modalId = 'route-kamenka';
        } else if (card.classList.contains('routes-card--bender')) {
          modalId = 'route-bender';
        } else if (card.classList.contains('routes-card--turunchuck')) {
          modalId = 'route-turunchuck';
        }

        if (modalId) {
          const modal = document.getElementById('modal-' + modalId);
          if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
          }
        }
      }
    });
  });
});
