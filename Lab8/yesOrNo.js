function yesOrNo() {
  const answer = Math.random() > 0.5;
  const answerContainer = document.querySelector(".yesOrNo-answer-container");
  const answerStructYes = `<div>ДА!</div>`;
  const answerStructNo = `<div>НЕТ!</div>`;
  answerContainer.innerHTML = "";
  if (answer) {
    answerContainer.insertAdjacentHTML("beforeend", answerStructYes);
  } else{
    answerContainer.insertAdjacentHTML("beforeend", answerStructNo);
  }
}

function magicBall() {
  const answerContainer = document.querySelector(".magic-ball-answer-container");
  const answers = [
    "Несомненно", "Это определенно так", "Без сомнения", "Да, однозначно", 
    "Вы можете на это положиться", "Как мне кажется, да", "Наверно", 
    "Перспективы хорошие", "Да", "Признаки указывают на то, что да",
    "Ответ туманный, попробуйте еще раз", "Спросите еще раз позже",
    "Лучше сейчас не рассказывать", "Сейчас не могу предсказать",
    "Сконцентрируйтесь и спросите снова", "Не рассчитывайте на это",
    "Мой ответ - нет", "Мои источники говорят, что нет",
    "Перспективы не очень хорошие", "Весьма сомнительно"
  ];
  
  const randomIndex = Math.floor(Math.random() * answers.length); 
  const answer = answers[randomIndex];

  answerContainer.innerHTML = "";
  const answerStruct = `<div>${answer}</div>`;
  answerContainer.insertAdjacentHTML("beforeend", answerStruct);
}




function addEvent() {
  const container = document.getElementById("eventsContainer");
  const eventCount = container.querySelectorAll(".event-row").length + 1;
  const row = document.createElement("div");
  row.className = "event-row";
  row.innerHTML = `<span class="event-name">Вер ${eventCount}</span>
                   <input type="number" class="event-prob">
                   <button type="button" onclick="removeEvent(this)">✖️</button>`;
  container.appendChild(row);
}

function removeEvent(btn) {
  const row = btn.parentElement;
  row.parentElement.removeChild(row);
}

function statAnalysis() {
  const input = document.getElementById("trialsInput");
  let N = parseInt(input.value) || 0;
  if (N <= 0) {
    alert("Введите корректное число попыток");
    return;
  }
  
  const eventRows = document.querySelectorAll("#eventsContainer .event-row");
  if (eventRows.length === 0) {
    alert("Добавьте хотя бы одно событие");
    return;
  }
  
  let events = [];
  let totalProb = 0;
  eventRows.forEach((row, index) => {
    const nameElem = row.querySelector(".event-name");
    const name = nameElem.textContent.trim() || `Вер ${index + 1}`;
    const probInput = row.querySelector(".event-prob");
    const prob = parseFloat(probInput.value) || 0;
    totalProb += prob;
    events.push({ 
      name: name, 
      prob: prob / 100 //Вероятность события
    });
  });
  
  if (totalProb !== 100) {
    alert("Сумма вероятностей должна быть равна 100%");
    return;
  }
  
  // 
  let cumulative = [];
  let sum = 0;
  events.forEach(event => {
    sum += event.prob;
    cumulative.push(sum);
  });
  

  let counts = Array(events.length).fill(0); //количество выпадений
  for (let i = 0; i < N; i++) {
    let r = Math.random();
    for (let j = 0; j < cumulative.length; j++) {
      if (r < cumulative[j]) {
        counts[j]++; //фиксируем выпадение
        break;
      }
    }
  }
  
  // Формируем таблицу с результатами анализа
  let output = `<table style="margin: 0 auto; border-collapse: collapse;" border="1">
    <tr>
      <th>Событие</th>
      <th>Вероятность</th>
      <th>Наблюдаемая частота</th>
      <th>Отклонение</th>
    </tr>`;
  
  events.forEach((ev, i) => {
    let empirical = counts[i] / N;
    let error = Math.abs(empirical - ev.prob);
    output += `<tr>
      <td>${ev.name}</td>
      <td>${(ev.prob * 100).toFixed(1)}%</td>
      <td>${(empirical * 100).toFixed(1)}%</td>
      <td>${(error * 100).toFixed(1)}%</td>
    </tr>`;
  });
  output += `</table>`;
  
  const container = document.querySelector(".stat-analysis-container");
  container.innerHTML = output + `<div id="chartContainer" style="width: 100%; height: 400px; margin-top: 20px;"></div>`;
  
  // Построение диаграммы
  let chartData = events.map((ev, i) => ({
    x: ev.name,
    value: parseFloat((counts[i] / N * 100).toFixed(2))
  }));
  
  anychart.onDocumentReady(function () {
    let chart = anychart.column();
    chart.data(chartData);
    chart.title("Эмпирический ряд событий");
    chart.yAxis().title("Процент выпадений");
    chart.container("chartContainer");
    chart.draw();
  });
}