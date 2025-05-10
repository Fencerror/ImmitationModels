import numpy as np
import matplotlib.pyplot as plt
import random
import math

def box_muller(n):

    results = []
    for _ in range(n // 2):
        u1, u2 = random.random(), random.random()
        z1 = math.sqrt(-2 * math.log(u1)) * math.cos(2 * math.pi * u2)
        z2 = math.sqrt(-2 * math.log(u1)) * math.sin(2 * math.pi * u2)
        results.extend([z1, z2])
    return np.array(results[:n])

def normal_pdf(x, mu=0, sigma=1):
    """Ручной расчет плотности нормального распределения"""
    return (1/(sigma * math.sqrt(2*math.pi))) * math.exp(-0.5*((x-mu)/sigma)**2)

def chi_squared_test(observed, expected):
    """Ручной расчет критерия хи-квадрат"""
    return sum((o-e)**2/e for o,e in zip(observed, expected))

def analyze_sample(sample, bins=10):
    """Полный анализ выборки"""
    # Основные статистики
    n = len(sample)
    mean = sum(sample)/n
    std = math.sqrt(sum((x-mean)**2 for x in sample)/(n-1))
    
    # Гистограмма
    hist, bin_edges = np.histogram(sample, bins=bins, density=True)
    bin_centers = (bin_edges[:-1] + bin_edges[1:])/2
    
    # Ожидаемые частоты
    expected = [normal_pdf(x, mean, std) for x in bin_centers]
    expected = np.array(expected) * (bin_edges[1]-bin_edges[0]) * n
    
    # Критерий хи-квадрат
    chi2 = chi_squared_test(hist*n, expected)
    df = bins - 3  # Степени свободы
    p_value = 1 - chi2_cdf(chi2, df)
    
    return {
        'mean': mean,
        'std': std,
        'chi2': chi2,
        'p_value': p_value,
        'hist': hist,
        'bin_edges': bin_edges
    }

def chi2_cdf(x, df):
    """Аппроксимация CDF хи-квадрат распределения"""
    # Приближение для больших x
    if x > 400:
        return 1.0
    # Рекуррентное вычисление
    term = 1
    sum_ = term
    for k in range(1, df//2 + 1):
        term *= x/(2*k)
        sum_ += term
    return 1 - math.exp(-x/2) * sum_



def plot_results(sample, analysis, size):
    """Визуализация результатов"""
    plt.figure(figsize=(12,6))
    
    # Гистограмма
    plt.hist(sample, bins=analysis['bin_edges'], density=True, 
             alpha=0.6, color='g', edgecolor='black')
    
    # Теоретическая кривая
    x = np.linspace(min(sample), max(sample), 100)
    y = [normal_pdf(val) for val in x]
    plt.plot(x, y, 'r-', linewidth=2)
    
    plt.title(f'Нормальное распределение (n={size})\n'
              f'μ={analysis["mean"]:.2f}, σ={analysis["std"]:.2f}, '
              f'χ²={analysis["chi2"]:.2f}, p={analysis["p_value"]:.3f}')
    plt.xlabel('Значение')
    plt.ylabel('Плотность вероятности')
    plt.grid(True)
    plt.show()

def main():
    sample_sizes = [10, 100, 1000, 10000]
    
    for size in sample_sizes:
        print(f"\nАнализ для выборки n={size}")
        print("="*40)
        
        # Генерация данных
        sample = box_muller(size)
        
        # Анализ
        analysis = analyze_sample(sample)
        
        # Вывод результатов
        print(f"Среднее: {analysis['mean']:.4f}")
        print(f"Стандартное отклонение: {analysis['std']:.4f}")
        print(f"Хи-квадрат: {analysis['chi2']:.4f}")
        print(f"p-value: {analysis['p_value']:.4f}")
        
        # Визуализация
        plot_results(sample, analysis, size)

if __name__ == "__main__":
    main()