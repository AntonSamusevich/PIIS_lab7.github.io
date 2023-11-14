document.addEventListener("DOMContentLoaded", function() {
  const svg = document.getElementById('drawingArea');
  svg.setAttribute('width', window.innerWidth);
  svg.setAttribute('height', window.innerHeight);

  let selectedShape = 'circle'; 

  let isDrawing = false;
  let shapeElement = null;
  let startX, startY;
  let initialX, initialY; 
  let svgRect = svg.getBoundingClientRect();

  // Функция для рисования круга
  function drawCircle(x, y, radius) {
    shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shapeElement.setAttribute("cx", x);
    shapeElement.setAttribute("cy", y);
    shapeElement.setAttribute("r", radius);
    shapeElement.setAttribute("fill", "none"); 
    shapeElement.setAttribute("stroke", "black"); 
    shapeElement.setAttribute("stroke-width", "3");
    svg.appendChild(shapeElement);
  }

  // Функция для рисования квадрата или прямоугольника
  function drawSquare(x, y, size) {
    shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    shapeElement.setAttribute("x", x);
    shapeElement.setAttribute("y", y);
    shapeElement.setAttribute("width", size);
    shapeElement.setAttribute("height", size);
    shapeElement.setAttribute("fill", "none"); 
    shapeElement.setAttribute("stroke", "black"); 
    shapeElement.setAttribute("stroke-width", "3");
    svg.appendChild(shapeElement);
  }

  // Функция для рисования свободным пером
  function drawFreeHand(x, y) {
    if (!shapeElement) {
      shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      shapeElement.setAttribute("fill", "none");
      shapeElement.setAttribute("stroke", "black");
      shapeElement.setAttribute("stroke-width", "3");
      shapeElement.setAttribute("d", `M ${x} ${y}`);
      svg.appendChild(shapeElement);
    } else {
      const d = shapeElement.getAttribute("d") + ` L ${x} ${y}`;
      shapeElement.setAttribute("d", d);
    }
  }

  // Обработчики событий радиокнопок для выбора фигуры
  document.getElementsByName('shape').forEach(function(radio) {
    radio.addEventListener('change', function(event) {
      selectedShape = event.target.value;
    });
  });

  // Обработчик события нажатия кнопки "Clear"
  const clearButton = document.getElementById('clearButton');
  clearButton.addEventListener('click', function() {
    svg.innerHTML = ''; 
  });

  // Обработчик события нажатия кнопки мыши для начала рисования
  svg.addEventListener('mousedown', function(event) {
    isDrawing = true;
    svgRect = svg.getBoundingClientRect();
    startX = event.clientX - svgRect.left;
    startY = event.clientY - svgRect.top;
    initialX = startX; 
    initialY = startY;
    if (selectedShape === 'circle') {
      drawCircle(startX, startY, 1);
    } else if (selectedShape === 'square') {
      drawSquare(startX, startY, 1);
    } else if (selectedShape === 'rectangle') {
      drawSquare(startX, startY, 1);
    } else if (selectedShape === 'draw') {
      drawFreeHand(startX, startY);
    }
  });

  // Обработчик события движения мыши для рисования в реальном времени
  svg.addEventListener('mousemove', function(event) {
    if (isDrawing && shapeElement !== null) {
      const x = event.clientX - svg.getBoundingClientRect().left; 
      const y = event.clientY - svg.getBoundingClientRect().top;

      if (selectedShape === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        shapeElement.setAttribute("r", radius);
      } else if (selectedShape === 'square') {
        const size = Math.max(Math.abs(x - initialX), Math.abs(y - initialY));
        shapeElement.setAttribute("x", initialX);
        shapeElement.setAttribute("y", initialY);
        shapeElement.setAttribute("width", size);
        shapeElement.setAttribute("height", size);
      } else if (selectedShape === 'rectangle') {
        const width = Math.abs(x - initialX);
        const height = Math.abs(y - initialY);
        shapeElement.setAttribute("x", Math.min(initialX, x));
        shapeElement.setAttribute("y", Math.min(initialY, y));
        shapeElement.setAttribute("width", width);
        shapeElement.setAttribute("height", height);
      } else if (selectedShape === 'draw') {
        drawFreeHand(x, y);
      }
    }
  });

  // Обработчик события отпускания кнопки мыши для завершения рисования
  svg.addEventListener('mouseup', function(event) {
    isDrawing = false;
    shapeElement = null;
  });
});
