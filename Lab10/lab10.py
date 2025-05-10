import numpy as np
import matplotlib.pyplot as plt
import random
import math

def poisson_distribution(mu):
    L = math.exp(-mu)
    k = 0
    p = 1.0
    while p > L:
        k += 1
        p *= random.random()
    return k - 1

def poisson_pmf_array(x, mu):
    
    return np.array([math.exp(-mu) * (mu ** k) / math.factorial(k) for k in x])

def plot_poisson_curve(mu, max_score, color, label, total_matches):  
    
    x = np.arange(0, max_score + 1)
    y = poisson_pmf_array(x, mu) * total_matches  
    plt.plot(x, y, 'o--', color=color, label=f'{label} (теория)', linewidth=2, markersize=5)

def main():
    print("Менеджер баскетбольных матчей")
    print("----------------------------")
    
    avg1 = float(input("Введите среднее количество очков для Команды 1: "))
    avg2 = float(input("Введите среднее количество очков для Команды 2: "))
    num_matches = int(input("Введите количество матчей для симуляции: "))
    
    team1_wins = 0
    team2_wins = 0
    draws = 0
    team1_scores = []
    team2_scores = []
    
    print("\nРезультаты матчей (№ матча: счет | победитель):")
    print("---------------------------------------------")
    
    for match_num in range(1, num_matches + 1):
        score1 = poisson_distribution(avg1)
        score2 = poisson_distribution(avg2)
        
        team1_scores.append(score1)
        team2_scores.append(score2)
        
        if score1 > score2:
            team1_wins += 1
            winner = "Команда 1"
        elif score2 > score1:
            team2_wins += 1
            winner = "Команда 2"
        else:
            draws += 1
            winner = "Ничья"
        
        print(f"Матч {match_num}: {score1}-{score2} | {winner}")
    
    print("\nСтатистика:")
    print("-----------")
    print(f"Всего матчей: {num_matches}")
    print(f"Побед Команды 1: {team1_wins} ({team1_wins/num_matches:.1%})")
    print(f"Побед Команды 2: {team2_wins} ({team2_wins/num_matches:.1%})")
    print(f"Ничьих: {draws} ({draws/num_matches:.1%})")
    
    # Визуализация
    plt.figure(figsize=(12, 6))
    
    max_score = max(max(team1_scores), max(team2_scores))
    bins = np.arange(0, max_score + 2) - 0.5
    
    # Гистограммы
    plt.hist([team1_scores, team2_scores], bins=bins,
             label=['Команда 1 (реально)', 'Команда 2 (реально)'],
             alpha=0.6, color=['blue', 'red'],
             edgecolor='black', linewidth=0.7)
    
    # Кривые Пуассона
    plot_poisson_curve(avg1, max_score, 'darkblue', 'Команда 1', num_matches)  # передача num_matches
    plot_poisson_curve(avg2, max_score, 'darkred', 'Команда 2', num_matches)   # передача num_matches
    
    plt.title('Сравнение реальных результатов с распределением Пуассона')
    plt.xlabel('Очки за матч')
    plt.ylabel('Количество матчей')
    plt.legend()
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.xticks(np.arange(0, max_score + 1))
    
    plt.tight_layout()
    plt.show()
    
    print("\nДополнительная статистика:")
    print("------------------------")
    print(f"Команда 1: Среднее = {np.mean(team1_scores):.1f} (теория: {avg1}), "
          f"Мин = {min(team1_scores)}, Макс = {max(team1_scores)}")
    print(f"Команда 2: Среднее = {np.mean(team2_scores):.1f} (теория: {avg2}), "
          f"Мин = {min(team2_scores)}, Макс = {max(team2_scores)}")

if __name__ == "__main__":
    main()