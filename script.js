document.addEventListener("DOMContentLoaded", function() {
  const svg = document.getElementById('drawingArea');

  let selectedShape = 'circle'; //выбор фигуры по умолчанию
  let selectedColor = 'black'; //выбор цвета по умолчанию

  let isDrawing = false; //переменная для отслеживания состояния рисования
  let shapeElement = null; //текущий элемент формы
  let startX, startY; //начальные координаты рисования
  let initialX, initialY; //начальные координаты элемента
  let svgRect = svg.getBoundingClientRect(); //переменная для определения координат начала рисования внутри SVG-контейнера
  
  //функция для рисования круга
  function drawCircle(x, y, radius) {
    //создание элемента заданного типа в пространстве имен SVG 
    shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    shapeElement.setAttribute("cx", x);
    shapeElement.setAttribute("cy", y);
    shapeElement.setAttribute("r", radius);
    shapeElement.setAttribute("fill", "none"); 
    shapeElement.setAttribute("stroke", "black"); 
    shapeElement.setAttribute("stroke-width", "3");
    svg.appendChild(shapeElement);
  }

  //функция для рисования квадрата или прямоугольника
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

  //функция для рисования треугольника
  function drawTriangle(x1, y1, x2, y2, x3, y3) {
    shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    shapeElement.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
    shapeElement.setAttribute("fill", "none"); 
    shapeElement.setAttribute("stroke", "black"); 
    shapeElement.setAttribute("stroke-width", "3");
    svg.appendChild(shapeElement);
  }
  
  //функция для рисования прямой линии
  function drawLine(x1, y1, x2, y2) {
    shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
    shapeElement.setAttribute("x1", x1);
    shapeElement.setAttribute("y1", y1);
    shapeElement.setAttribute("x2", x2);
    shapeElement.setAttribute("y2", y2);
    shapeElement.setAttribute("stroke", "black");
    shapeElement.setAttribute("stroke-width", "3");
    svg.appendChild(shapeElement);
  }

  //функция для рисования свободным пером
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

  //функция для рисования ластика
  function drawEraser(x, y) {
    shapeElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shapeElement.setAttribute("cx", x);
    shapeElement.setAttribute("cy", y);
    shapeElement.setAttribute("r", "7");
    shapeElement.setAttribute("fill", "rgb(226, 226, 226)");
    svg.appendChild(shapeElement);
  }

  //обработчик события для выбора цвета
  document.getElementsByName('color').forEach(function(radio) {
    radio.addEventListener('change', function(event) {
      selectedColor = event.target.value;
    });
  });

  //обработчик события для выбора фигуры
  document.getElementsByName('shape').forEach(function(radio) {
    radio.addEventListener('change', function(event) {
      selectedShape = event.target.value;
    });
  });

  //обработчик события кнопки "Очистить"
  const clearButton = document.getElementById('clearButton');
  clearButton.addEventListener('click', function() {
    svg.innerHTML = ''; 
  });

  //обработчик события нажатия кнопки мыши
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
    } else if (selectedShape === 'triangle') {
      drawTriangle(startX, startY, startX, startY, startX, startY);
    } else if (selectedShape === 'line') {
      drawLine(startX, startY, startX, startY); 
    } else if (selectedShape === 'draw') {
      drawFreeHand(startX, startY);
    } else if (selectedShape === 'eraser') {
      drawEraser(startX, startY);
    }
  });

  //обработчик события движения мыши
  svg.addEventListener('mousemove', function(event) {
    if (isDrawing && shapeElement !== null) {
      const x = event.clientX - svg.getBoundingClientRect().left; 
      const y = event.clientY - svg.getBoundingClientRect().top;

      if (selectedShape === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        shapeElement.setAttribute("r", radius);
        shapeElement.setAttribute("stroke", selectedColor);
      } else if (selectedShape === 'square') {
        const size = Math.max(Math.abs(x - initialX), Math.abs(y - initialY));
        shapeElement.setAttribute("x", initialX);
        shapeElement.setAttribute("y", initialY);
        shapeElement.setAttribute("width", size);
        shapeElement.setAttribute("height", size);
        shapeElement.setAttribute("stroke", selectedColor);
      } else if (selectedShape === 'rectangle') {
        const width = Math.abs(x - initialX);
        const height = Math.abs(y - initialY);
        shapeElement.setAttribute("x", Math.min(initialX, x));
        shapeElement.setAttribute("y", Math.min(initialY, y));
        shapeElement.setAttribute("width", width);
        shapeElement.setAttribute("height", height);
        shapeElement.setAttribute("stroke", selectedColor);
      } else if (selectedShape === 'triangle') {
        shapeElement.setAttribute("points", `${startX},${startY} ${x},${y} ${startX * 2 - x},${y}`);
        shapeElement.setAttribute("stroke", selectedColor);
      } else if (selectedShape === 'line') {
        shapeElement.setAttribute("x2", x);
        shapeElement.setAttribute("y2", y);
        shapeElement.setAttribute("stroke", selectedColor);
      } else if (selectedShape === 'draw') {
        drawFreeHand(x, y);
        shapeElement.setAttribute("stroke", selectedColor);
      } else if (selectedShape === 'eraser') {
        drawEraser(x, y);
      }
    }
  });

  //обработчик события отпускания кнопки мыши
  svg.addEventListener('mouseup', function(event) {
    isDrawing = false;
    shapeElement = null;
  });
});
