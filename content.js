let isAltZPressed = false;
let isDrawing = false;
let selectionBox = null;
let startX = 0;
let startY = 0;

// Отслеживаем нажатие комбинации Alt+Z
window.addEventListener('keydown', (e) => {
  if (e.altKey && e.code === 'KeyZ') {
    isAltZPressed = true;
    // Меняем курсор, чтобы показать, что режим активен
    document.body.style.cursor = 'crosshair';
  }
});

// Отслеживаем отпускание клавиш
window.addEventListener('keyup', (e) => {
  if (!e.altKey || e.code === 'KeyZ') {
    isAltZPressed = false;
    document.body.style.cursor = 'default';
  }
});

// Начинаем рисовать при нажатии ЛКМ, если Alt+Z зажаты
document.addEventListener('mousedown', (e) => {
  if (isAltZPressed && e.button === 0) { // 0 - левая кнопка мыши
    e.preventDefault();
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;

    // Создаем рамку выделения
    selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box-by-dev'; // Уникальный класс
    document.body.appendChild(selectionBox);
    
    // Начальные стили
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
  }
});

// Рисуем рамку при движении мыши
document.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    e.preventDefault();
    // Рассчитываем размеры и положение рамки
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const newX = Math.min(currentX, startX);
    const newY = Math.min(currentY, startY);

    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
    selectionBox.style.left = `${newX}px`;
    selectionBox.style.top = `${newY}px`;
  }
});

// Завершаем рисование и открываем ссылки, когда отпускаем ЛКМ
document.addEventListener('mouseup', (e) => {
  if (isDrawing) {
    isDrawing = false;
    document.body.style.cursor = 'default';
    
    const rect = selectionBox.getBoundingClientRect();
    findAndOpenLinks(rect);
    
    // Удаляем рамку
    document.body.removeChild(selectionBox);
    selectionBox = null;
    isAltZPressed = false; // Сбрасываем состояние
  }
});

function findAndOpenLinks(selectionRect) {
  const links = document.querySelectorAll('a[href]');
  const linksToOpen = [];

  for (const link of links) {
    const linkRect = link.getBoundingClientRect();

    // Проверяем, пересекается ли ссылка с областью выделения
    const isIntersecting = !(
      linkRect.right < selectionRect.left ||
      linkRect.left > selectionRect.right ||
      linkRect.bottom < selectionRect.top ||
      linkRect.top > selectionRect.bottom
    );

    if (isIntersecting) {
      // Убедимся, что ссылка видима (не имеет display: none)
      if (link.offsetParent !== null) {
        linksToOpen.push(link.href);
      }
    }
  }

  // Отправляем массив ссылок в фоновый скрипт для открытия
  if (linksToOpen.length > 0) {
    chrome.runtime.sendMessage({ action: 'openLinks', urls: linksToOpen });
  }
}