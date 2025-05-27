import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from collections import defaultdict

# Параметры модели
states = ['Ясно', 'Облачно', 'Пасмурно']
Q = np.array([[-0.4, 0.3, 0.1],
              [0.4, -0.8, 0.4],
              [0.1, 0.4, -0.5]])

# Функция для генерации следующего состояния
def next_state(current_state, Q):
    rates = Q[current_state] #Строка матрицы содержащая вероятности перехода из текущего состояния, 
                             #Например для состояния Облачно rates = [0.4, -0.8, 0.4]
    # Исключаем диагональный элемент 
    rates = np.maximum(rates, 0) # Через сравненеи каждого элемента с 0 и выбор наибольшего.
    total_rate = sum(rates)
    if total_rate == 0:     #Если сумма вероятностей перехода из состояние равна 0 то состояние покинуть нельзя.
        return current_state
    # Нормализуем вероятности перехода
    probs = rates / total_rate
    # Генерируем следующее состояние
    return np.random.choice(len(states), p=probs) #Переходим в следующее состояние.

def stationary_distribution(Q):
    # πQ = 0 и Σπ = 1
    n = Q.shape[0]  
    # Добавляем условие нормировки
    A = np.vstack([Q.T, np.ones(n)])
    b = np.zeros(n + 1)
    b[-1] = 1
    # Решаем методом наименьших квадратов
    pi, _, _, _ = np.linalg.lstsq(A, b, rcond=None) # 3 заглушки нужны потому что метод возвращает ещё другие параметры
    return pi                                       # Такие как остаточная ошибка, ранг и сингулярные числа. 

# Параметры симуляции
days = 10
current_state = 0  # Начинаем с ясной погоды
history = [current_state]
counts = defaultdict(int)   #Количество раз которое встречается каждое состояние системы в формате словаря 
                            # Формат похож на обекты в js – {0: 3, 1: 4, 2: 4}
counts[current_state] += 1  #Фиксируем ясную погоду с которой начали

# Запуск симуляции
for _ in range(days):
    current_state = next_state(current_state, Q)
    history.append(current_state)
    counts[current_state] += 1

# Вычисляем эмпирические вероятности
total = sum(counts.values())
empirical_probs = [counts[i]/total for i in range(len(states))] 

# Вычисляем теоретическое стационарное распределение
stationary_pi = stationary_distribution(Q)

# Визуализация
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# Анимация изменения погоды
def update(frame):
    ax1.clear()
    ax1.bar(states, [1 if i == history[frame] else 0 for i in range(len(states))])
    ax1.set_title(f'День {frame}: {states[history[frame]]}')
    ax1.set_ylim(0, 1)
    
    # Обновляем статистику
    if frame > 0:
        current_counts = defaultdict(int)
        for s in history[:frame+1]:
            current_counts[s] += 1
        current_total = frame + 1
        current_probs = [current_counts[i]/current_total for i in range(len(states))]
        
        ax2.clear()
        x = np.arange(len(states))
        width = 0.35
        ax2.bar(x - width/2, current_probs, width, label='Эмпирическое')
        ax2.bar(x + width/2, stationary_pi, width, label='Теоретическое')
        ax2.set_xticks(x)
        ax2.set_xticklabels(states)
        ax2.set_title('Сравнение распределений')
        ax2.legend()
        ax2.set_ylim(0, 1)

ani = FuncAnimation(fig, update, frames=days, interval=200, repeat=False)

plt.tight_layout()
plt.show()

# Вывод результатов
print("Эмпирические вероятности:", dict(zip(states, empirical_probs)))
print("Теоретическое стационарное распределение:", dict(zip(states, stationary_pi)))