function yesOrNo() {
    const answer = Math.random() > 0.5;
    const answerContainer = document.querySelector(".yesOrNo-answer-container");
    const answerStructYes = `<div>ДА!</div>`;
    const answerStructNo = `<div>НЕТ!</div>`;
    answerContainer.innerHTML = "";
    if (answer) {
        answerContainer.insertAdjacentHTML("beforeend", answerStructYes);
    } else {
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
          prob: prob / 100
      });
    });
    if (totalProb !== 100) {
        alert("Сумма вероятностей должна быть равна 100%");
        return;
    }
    let cumulative = [];
    let sum = 0;
    events.forEach(event => {
        sum += event.prob;
        cumulative.push(sum);
    });
    let counts = Array(events.length).fill(0);
     for (let i = 0; i < N; i++) {
         let r = Math.random();
         for (let j = 0; j < cumulative.length; j++) {
             if (r < cumulative[j]) {
                 counts[j]++;
                 break;
             }
         }
     }
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
      let chartData = events.map((event, i) => ({
          x: event.name,
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
  // Lab 9
function addProb() {
    const container = document.getElementById("probContainer");
    const probCount = container.querySelectorAll(".prob-row").length + 1;
    const row = document.createElement("div");
    row.className = "prob-row";
    row.innerHTML = `<span class="prob-name">Значение ${probCount}</span>
        <input type="number" class="prob-value" placeholder="Значение">
        <input type="number" class="prob-prob" placeholder="Вероятность">
        <button type="button" onclick="removeProb(this)">✖️</button>`;
    container.appendChild(row);
}
function removeProb(btn) {
    const row = btn.parentElement;
    row.parentElement.removeChild(row);
}
function autoProbs() {
const container = document.getElementById("probContainer");
container.innerHTML = "";

// Создаем 5 значений со случайными вероятностями
let total = 0;
const probs = [];
for (let i = 0; i < 5; i++) {
    probs.push(Math.random());
    total += probs[i];
}

// Нормализуем вероятности
for (let i = 0; i < 5; i++) {
    probs[i] = (probs[i] / total * 100).toFixed(2);
    const row = document.createElement("div");
    row.className = "prob-row";
    row.innerHTML = `<span class="prob-name">Значение ${i+1}</span>
        <input type="number" class="prob-value" value="${i+1}">
      <input type="number" class="prob-prob" value="${probs[i]}">
      <button type="button" onclick="removeProb(this)">✖️</button>`;
    container.appendChild(row);
}
}
function runLab9() {
const N = parseInt(document.getElementById("lab9TrialsInput").value);
if (N <= 0) {
    alert("Введите корректное число экспериментов");
    return;
}
const probRows = document.querySelectorAll("#probContainer .prob-row");
if (probRows.length === 0) {
    alert("Добавьте хотя бы одно значение");
    return;
}
// Собираем значения и вероятности
let values = [];
let probs = [];
let totalProb = 0;

probRows.forEach(row => {
    const valueInput = row.querySelector(".prob-value");
    const probInput = row.querySelector(".prob-prob");
    
    const value = parseFloat(valueInput.value) || 0;
    const prob = parseFloat(probInput.value) || 0;
    
    values.push(value);
    probs.push(prob);
    totalProb += prob;
});
if (totalProb <= 0) {
    alert("Сумма вероятностей должна быть больше 0");
    return;
}
// Нормализуем вероятности
probs = probs.map(p => p / totalProb);

// Вычисляем теоретические характеристики
let theoreticalMean = 0;
let theoreticalVar = 0;

for (let i = 0; i < values.length; i++) {
    theoreticalMean += values[i] * probs[i];
}

for (let i = 0; i < values.length; i++) {
    theoreticalVar += Math.pow(values[i] - theoreticalMean, 2) * probs[i];
}

// Генерируем случайные величины
let counts = Array(values.length).fill(0);
let samples = [];

// Создаем кумулятивное распределение
let cumulative = [];
let sum = 0;
for (let i = 0; i < probs.length; i++) {
    sum += probs[i];
    cumulative.push(sum);
}

// Генерация выборки
for (let i = 0; i < N; i++) {
    const r = Math.random();
    for (let j = 0; j < cumulative.length; j++) {
        if (r < cumulative[j]) {
            counts[j]++;
            samples.push(values[j]);
            break;
        }
    }
}

// Вычисляем эмпирические характеристики
const empiricalProbs = counts.map(c => c / N);
const sampleMean = samples.reduce((a, b) => a + b, 0) / N;
const sampleVar = samples.reduce((a, b) => a + Math.pow(b - sampleMean, 2), 0) / N;

// Ошибки
const meanError = Math.abs(sampleMean - theoreticalMean) / theoreticalMean * 100;
const varError = Math.abs(sampleVar - theoreticalVar) / theoreticalVar * 100;

// Критерий хи-квадрат
let chi2 = 0;
const expectedCounts = probs.map(p => p * N);
for (let i = 0; i < counts.length; i++) {
    chi2 += Math.pow(counts[i] - expectedCounts[i], 2) / expectedCounts[i];
}

// Критическое значение хи-квадрат (для alpha=0.05)
const chi2Critical = getChi2Critical(values.length - 1);

// Формируем результаты
let freqHTML = "<h4>Эмпирические вероятности:</h4><ul>";
for (let i = 0; i < values.length; i++) {
    freqHTML += `<li>${values[i]}: ${empiricalProbs[i].toFixed(4)}</li>`;
}
freqHTML += "</ul>";

let statsHTML = `<h4>Характеристики:</h4>
    <p>Теоретическое среднее: ${theoreticalMean.toFixed(4)}</p>
    <p>Выборочное среднее: ${sampleMean.toFixed(4)} (ошибка ${meanError.toFixed(2)}%)</p>
    <p>Теоретическая дисперсия: ${theoreticalVar.toFixed(4)}</p>
    <p>Выборочная дисперсия: ${sampleVar.toFixed(4)} (ошибка ${varError.toFixed(2)}%)</p>`;

let chi2HTML = `<h4>Критерий хи-квадрат:</h4>
    <p>χ² = ${chi2.toFixed(4)}</p>
    <p>Критическое значение (α=0.05): ${chi2Critical.toFixed(4)}</p>
    <p>Гипотеза о распределении: ${chi2 <= chi2Critical ? "принимается" : "отвергается"}</p>`;

// Отображаем результаты
document.getElementById("lab9Frequencies").innerHTML = freqHTML;
document.getElementById("lab9Stats").innerHTML = statsHTML;
document.getElementById("lab9Chi2").innerHTML = chi2HTML;

// Строим график
anychart.onDocumentReady(function () {
    // Теоретические вероятности
    let theoreticalData = [];
    for (let i = 0; i < values.length; i++) {
        theoreticalData.push({
            x: values[i].toString(),
            value: probs[i],
            name: "Теоретические"
        });
    }
    
    // Эмпирические вероятности
    let empiricalData = [];
    for (let i = 0; i < values.length; i++) {
        empiricalData.push({
            x: values[i].toString(),
            value: empiricalProbs[i],
            name: "Эмпирические"
        });
    }
    
    // Создаем график
    let chart = anychart.column();
    
    // Добавляем серии данных
    chart.column(theoreticalData);
    chart.column(empiricalData);
    
    // Настройки графика
    chart.title("Сравнение теоретического и эмпирического распределений");
    chart.yAxis().title("Вероятность");
    chart.xAxis().title("Значения");
    chart.legend(true);
    chart.tooltip().format("{%name}: {%value}");
    
    // Отображаем график
    chart.container("lab9ChartContainer");
    chart.draw();
});
}
// Функция для получения критического значения хи-квадрат
function getChi2Critical(df) {
    // Таблица критических значений хи-квадрат для alpha=0.05
    const chi2Table = {
        1: 3.841,
        2: 5.991,
        3: 7.815,
        4: 9.488,
        5: 11.070,
        6: 12.592,
        7: 14.067,
        8: 15.507,
        9: 16.919,
        10: 18.307
    };
    
    return chi2Table[df] || 0;
}
// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", function() {
    addProb(); // Добавляем первое значение по умолчанию
});