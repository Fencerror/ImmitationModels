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

//Статистический анализ событий.
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

    //эмпирический ряд распределения
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


    

    //Оформление таблицы и диаграммы

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
    container.innerHTML = output + `<canvas id="chartContainer" style="width: 100%; height: 400px; margin-top: 20px;"></canvas>`;
    
    // Подготовка данных
    const labels = events.map(event => event.name);
    const theoreticalData = events.map(event => (event.prob * 100).toFixed(2));
    const empiricalData = counts.map((count, i) => ((count / N) * 100).toFixed(2));
    
    // Получаем контекст canvas
    const ctx = document.getElementById('chartContainer').getContext('2d');
    
    // Удаляем предыдущий график, если он существует
    if (window.myChart) {
        window.myChart.destroy();
    }
    
    // Создаем новый график
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Теоретические (%)',
                    data: theoreticalData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Эмпирические (%)',
                    data: empiricalData,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Вероятность (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'События'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Сравнение теоретических и эмпирических вероятностей'
                }
            }
        }
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

function autoProbs() { //Автозаполнение
    const container = document.getElementById("probContainer");
    container.innerHTML = "";


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
        row.innerHTML = `<span class="prob-name">Значение ${i + 1}</span>
            <input type="number" class="prob-value" value="${i + 1}">
            <input type="number" class="prob-prob" value="${probs[i]}">
            <button type="button" onclick="removeProb(this)">✖️</button>`;
        container.appendChild(row);
    }
}



function runLab9() {
    // Получаем количество экспериментов
    const N = parseInt(document.getElementById("lab9TrialsInput").value);
    if (N <= 0) {
        alert("Введите корректное число экспериментов (N > 0)");
        return;
    }

    // Проверяем наличие данных
    const probRows = document.querySelectorAll("#probContainer .prob-row");
    if (probRows.length === 0) {
        alert("Добавьте хотя бы одно значение");
        return;
    }

    // Собираем исходные данные
    const values = [];
    const probs = [];
    let totalProb = 0;

    probRows.forEach(row => {
        const value = parseFloat(row.querySelector(".prob-value").value) || 0;
        const prob = parseFloat(row.querySelector(".prob-prob").value) || 0;
        
        values.push(value);
        probs.push(prob);
        totalProb += prob;
    });

    if (totalProb <= 0) {
        alert("Сумма вероятностей должна быть больше 0");
        return;
    }

    // Нормализуем вероятности
    const normalizedProbs = probs.map(p => p / totalProb);

    // Теоретические характеристики
    const mathExpectation = values.reduce((sum, val, i) => sum + val * normalizedProbs[i], 0);
    const dispersion = values.reduce((sum, val, i) => {
        return sum + Math.pow(val - mathExpectation, 2) * normalizedProbs[i];
    }, 0);

    // интегральное распределение
    const integral = normalizedProbs.reduce((acc, prob) => {
        acc.push((acc[acc.length - 1] || 0) + prob);
        return acc;
    }, []);


    const counts = new Array(values.length).fill(0);
    const generatedValues = [];
    // Генерация выборки 
    for (let i = 0; i < N; i++) {
        const rand = Math.random();
        const index = integral.findIndex(interval => rand < interval);
        if (index !== -1) {
            counts[index]++;
            generatedValues.push(values[index]);
        }
    }

    // Эмпирические характеристики
    const empiricalProbs = counts.map(count => count / N);
    const sampleMean = generatedValues.reduce((sum, val) => sum + val, 0) / N; 
    const sampleVar = generatedValues.reduce((sum, val) => { 
        return sum + Math.pow(val - sampleMean, 2);
    }, 0) / N;

    // Относительные погрешности
    const meanError = mathExpectation !== 0 
        ? (Math.abs(sampleMean - mathExpectation) / mathExpectation * 100).toFixed(2)
        : "∞"; 
    
    const varError = dispersion !== 0
        ? (Math.abs(sampleVar - dispersion) / dispersion * 100).toFixed(2)
        : "∞";

    // Критерий хи-квадрат
    const chi2 = counts.reduce((sum, count, i) => {
        const expected = normalizedProbs[i] * N;
        return sum + Math.pow(count - expected, 2) / expected;
    }, 0);

    const chi2Critical = getChi2Critical(values.length - 1);












    
    // Формируем результаты
    renderResults({
        values,
        empiricalProbs,
        mathExpectation,
        sampleMean,
        meanError,
        dispersion,
        sampleVar,
        varError,
        chi2,
        chi2Critical
    });

    // Строим график
    renderChart(values, normalizedProbs, empiricalProbs);
}

function renderResults(data) {
    // Частоты
    let freqHTML = "<h4>Эмпирические вероятности:</h4><ul>";
    data.values.forEach((val, i) => {
        freqHTML += `<li>${val}: ${data.empiricalProbs[i].toFixed(4)}</li>`;
    });
    freqHTML += "</ul>";

    // Статистики
    let statsHTML = `
        <h4>Характеристики:</h4>
        <p>Теоретическое мат. ожидание: ${data.mathExpectation.toFixed(4)}</p>
        <p>Выборочное среднее: ${data.sampleMean.toFixed(4)} (ошибка ${data.meanError}%)</p>
        <p>Теоретическая дисперсия: ${data.dispersion.toFixed(4)}</p>
        <p>Выборочная дисперсия: ${data.sampleVar.toFixed(4)} (ошибка ${data.varError}%)</p>
    `;

    // Хи-квадрат
    let chi2HTML = `
        <h4>Критерий хи-квадрат:</h4>
        <p>χ² = ${data.chi2.toFixed(4)}</p>
        <p>Критическое значение (α=0.05): ${data.chi2Critical.toFixed(4)}</p>
        <p>Гипотеза: ${data.chi2 <= data.chi2Critical ? "принимается" : "отвергается"}</p>
    `;

    // Выводим результаты
    document.getElementById("lab9Frequencies").innerHTML = freqHTML;
    document.getElementById("lab9Stats").innerHTML = statsHTML;
    document.getElementById("lab9Chi2").innerHTML = chi2HTML;
}

function renderChart(values, theoreticalProbs, empiricalProbs) {
    // Создаем контейнер с фиксированными размерами
    const container = document.getElementById('lab9ChartContainer') || createChartContainer();
    container.innerHTML = '';
    
    // Создаем canvas с явными размерами
    const canvas = document.createElement('canvas');
    canvas.id = 'lab9Chart';
    canvas.width = 600;
    canvas.height = 600; // Фиксированная высота
    canvas.style.display = 'block'; // Убираем лишние отступы
    
    container.appendChild(canvas);

    // Создаем график
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: values.map(String),
            datasets: [
                {
                    label: 'Теоретические',
                    data: theoreticalProbs,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    barThickness: 'flex',
                    maxBarThickness: 40
                },
                {
                    label: 'Эмпирические',
                    data: empiricalProbs,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    barThickness: 'flex',
                    maxBarThickness: 40
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Отключаем авто-масштабирование
            scales: {
                y: { 
                    beginAtZero: true, 
                    title: { display: true, text: 'Вероятность' },
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%'; // Проценты по оси Y
                        }
                    }
                },
                x: { 
                    title: { display: true, text: 'Значения' },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                title: { 
                    display: true, 
                    text: 'Сравнение распределений',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + (context.raw * 100).toFixed(2) + '%';
                        }
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 20
                    }
                }
            }
        }
    });
}

function createChartContainer() {
    const container = document.createElement('div');
    container.id = 'lab9ChartContainer';
    container.style.cssText = 'width:100%; height:400px; margin:20px 0; position:relative;';
    document.querySelector('.lab9-results-container').appendChild(container);
    return container;
}

function getChartOptions() {
    return {
        responsive: true,
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Вероятность' } },
            x: { title: { display: true, text: 'Значения' } }
        },
        plugins: {
            title: { display: true, text: 'Сравнение распределений' }
        }
    };
}

function getChi2Critical(df) {
    const chi2Table = [3.841, 5.991, 7.815, 9.488, 11.070, 12.592, 14.067, 15.507, 16.919, 18.307];
    return chi2Table[df - 1] || 0;
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", function() {
    addProb(); // Добавляем первое значение по умолчанию
});