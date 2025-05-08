import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt
from tkinter import *
from tkinter import ttk

class DiscreteRandomVariableSimulator:
    def __init__(self, root):
        self.root = root
        self.root.title("Лабораторная 9: Моделирование ДСВ")
        
        # Параметры распределения по умолчанию
        self.values = np.array([1, 2, 3, 4, 5])
        self.probs = np.array([0.1, 0.2, 0.3, 0.25, 0.15])
        self.probs /= self.probs.sum()  # Нормализуем вероятности
        
        # Создаем UI
        self.create_ui()
        
    def create_ui(self):
        mainframe = ttk.Frame(self.root, padding="10")
        mainframe.grid(column=0, row=0, sticky=(N, W, E, S))
        
        # Поля для ввода вероятностей
        ttk.Label(mainframe, text="Вероятности:").grid(column=1, row=1, sticky=W)
        self.prob_entries = []
        for i in range(5):
            ttk.Label(mainframe, text=f"Prob {i+1}:").grid(column=1, row=i+2, sticky=W)
            entry = ttk.Entry(mainframe, width=7)
            entry.insert(0, f"{self.probs[i]:.2f}")
            entry.grid(column=2, row=i+2, sticky=W)
            self.prob_entries.append(entry)
        
        # Кнопка автонормализации
        ttk.Button(mainframe, text="Auto", command=self.auto_normalize).grid(column=3, row=3, sticky=W)
        
        # Поле для количества экспериментов
        ttk.Label(mainframe, text="Число экспериментов:").grid(column=1, row=7, sticky=W)
        self.n_entry = ttk.Entry(mainframe, width=10)
        self.n_entry.insert(0, "1000")
        self.n_entry.grid(column=2, row=7, sticky=W)
        
        # Кнопка запуска
        ttk.Button(mainframe, text="Start", command=self.run_simulation).grid(column=2, row=8, sticky=W)
        
        # Разделительная линия
        ttk.Separator(mainframe, orient='horizontal').grid(column=1, row=9, columnspan=3, pady=10, sticky=(W, E))
        
        # Результаты
        ttk.Label(mainframe, text="Результаты:").grid(column=1, row=10, sticky=W)
        
        # Частоты
        self.freq_labels = []
        for i in range(5):
            label = ttk.Label(mainframe, text="")
            label.grid(column=1, row=11+i, sticky=W)
            self.freq_labels.append(label)
        
        # Статистики
        self.avg_label = ttk.Label(mainframe, text="")
        self.avg_label.grid(column=1, row=16, sticky=W)
        
        self.var_label = ttk.Label(mainframe, text="")
        self.var_label.grid(column=1, row=17, sticky=W)
        
        self.chi2_label = ttk.Label(mainframe, text="")
        self.chi2_label.grid(column=1, row=18, sticky=W)
        
        # График
        self.fig, self.ax = plt.subplots(figsize=(6, 4))
        self.canvas = FigureCanvasTkAgg(self.fig, master=mainframe)
        self.canvas_widget = self.canvas.get_tk_widget()
        self.canvas_widget.grid(column=4, row=1, rowspan=20, padx=10)
        
    def auto_normalize(self):
        # Генерируем случайные вероятности и нормализуем их
        random_probs = np.random.rand(5)
        normalized_probs = random_probs / random_probs.sum()
        
        for i, entry in enumerate(self.prob_entries):
            entry.delete(0, END)
            entry.insert(0, f"{normalized_probs[i]:.3f}")
    
    def get_input_probs(self):
        probs = []
        for entry in self.prob_entries:
            try:
                prob = float(entry.get())
                if prob < 0:
                    raise ValueError
                probs.append(prob)
            except:
                # В случае ошибки используем значение по умолчанию
                return self.probs
        return np.array(probs) / sum(probs)  # Нормализуем
    
    def run_simulation(self):
        try:
            N = int(self.n_entry.get())
        except:
            N = 1000
        
        probs = self.get_input_probs()
        theoretical_mean = np.sum(self.values * probs)
        theoretical_var = np.sum((self.values - theoretical_mean)**2 * probs)
        
        # Генерируем случайные величины
        samples = np.random.choice(self.values, size=N, p=probs)
        
        # Вычисляем эмпирические вероятности
        counts = np.bincount(samples, minlength=6)[1:]  # Индексы 1-5
        empirical_probs = counts / N
        
        # Вычисляем выборочные характеристики
        sample_mean = np.mean(samples)
        sample_var = np.var(samples, ddof=0)  # Смещенная оценка
        
        # Ошибки
        mean_error = abs(sample_mean - theoretical_mean) / theoretical_mean * 100
        var_error = abs(sample_var - theoretical_var) / theoretical_var * 100
        
        # Критерий хи-квадрат
        expected_counts = probs * N
        chi2_stat = np.sum((counts - expected_counts)**2 / expected_counts)
        chi2_critical = stats.chi2.ppf(0.95, df=len(self.values)-1)  # 95% квантиль
        
        # Обновляем UI
        for i, label in enumerate(self.freq_labels):
            label.config(text=f"freq {i+1}: {empirical_probs[i]:.3f}")
        
        self.avg_label.config(text=f"Среднее: {sample_mean:.3f} (ошибка={mean_error:.1f}%)")
        self.var_label.config(text=f"Дисперсия: {sample_var:.3f} (ошибка={var_error:.1f}%)")
        
        test_result = "верна" if chi2_stat <= chi2_critical else "неверна"
        self.chi2_label.config(text=f"Хи-квадрат: {chi2_stat:.2f} > {chi2_critical:.2f} гипотеза {test_result}")
        
        # Обновляем график
        self.ax.clear()
        x = np.arange(len(self.values))
        width = 0.35
        
        self.ax.bar(x - width/2, probs, width, label='Теоретические', alpha=0.7)
        self.ax.bar(x + width/2, empirical_probs, width, label='Эмпирические', alpha=0.7)
        
        self.ax.set_xticks(x)
        self.ax.set_xticklabels(self.values)
        self.ax.set_xlabel('Значения')
        self.ax.set_ylabel('Вероятность')
        self.ax.set_title(f'Распределение (N={N})')
        self.ax.legend()
        
        self.canvas.draw()

def main():
    root = Tk()
    app = DiscreteRandomVariableSimulator(root)
    root.mainloop()

if __name__ == "__main__":
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
    main()