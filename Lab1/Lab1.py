from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QTextEdit, QVBoxLayout, QMessageBox
import numpy as np
import matplotlib.pyplot as plt

class FlightSimulator(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Моделирование полёта тела в атмосфере")
#         Поля ввода параметров 
#         >>
        self.labels = ["Начальная высота (м):", "Начальная скорость (м/с):", "Угол (градусы):", 
                       "Площадь сечения (м²):", "Масса (кг):", "Шаг времени (с):"]
        self.inputs = []
        layout = QVBoxLayout() #layout для кнопок
        
        for label in self.labels:
            layout.addWidget(QLabel(label)) #собственно добавляем виджеты
            line_edit = QLineEdit()
            self.inputs.append(line_edit)
            layout.addWidget(line_edit)
#          <<

#         Кнопка для старта моделирования
#         >>
        self.simulate_button = QPushButton("Смоделировать")
        self.simulate_button.clicked.connect(self.plot_trajectory)
        layout.addWidget(self.simulate_button)
#         <<
#         Поле для вывода результатов
#         >>
        self.results = QTextEdit()
        self.results.setReadOnly(True)
        layout.addWidget(QLabel("Результаты: Time step\tDistance\tMax height\tSpeed at end point"))
        layout.addWidget(self.results)
        
        self.setLayout(layout)
#       <<
#       Метод для моделирования полёта тела
#       >>
    def simulate_flight(self, dt):
        g = 9.81  # ускорение свободного падения
        rho = 1.225  # плотность воздуха (кг/м³)
        C = 0.47  # коэффициент аэродинамического сопротивления
        
        try:
            h0 = float(self.inputs[0].text())
            v0 = float(self.inputs[1].text())
            angle = float(self.inputs[2].text())
            S = float(self.inputs[3].text())
            m = float(self.inputs[4].text())
        except ValueError:
            QMessageBox.critical(self, "Ошибка", "Введите корректные числовые значения.")
            return None
        
        angle_rad = np.radians(angle)
        cosa = np.cos(angle_rad)
        sina = np.sin(angle_rad)
        k = 0.5 * C * rho * S / m  # коэффициент сопротивления
        
        x, y = 0, h0
        vx = v0 * cosa
        vy = v0 * sina
        t = 0
        
        x_vals, y_vals = [x], [y]
        
        while y > 0:
            v = np.sqrt(vx**2 + vy**2)
            vx -= k * vx * v * dt
            vy -= (g + k * vy * v) * dt
            x += vx * dt
            y += vy * dt
            t += dt
            x_vals.append(x)
            y_vals.append(max(y, 0))  # не позволяем уйти ниже земли
        return x_vals, y_vals, x, max(y_vals), v
#       <<
#       Метод для отрисовки графика траектории
#       >>
    def plot_trajectory(self):
        try:
            dt = float(self.inputs[5].text())
        except ValueError:
            QMessageBox.critical(self, "Ошибка", "Введите корректное значение шага времени.")
            return
        
        result = self.simulate_flight(dt)
        if result is None:
            return
        
        x_vals, y_vals, distance, max_height, end_speed = result
        plt.plot(x_vals, y_vals, label=f"Δt = {dt}s")
        
        self.results.append(f"{dt:.2f}\t{distance:.2f}\t{max_height:.2f}\t{end_speed:.2f}")
        
        plt.xlabel("Расстояние (м)")
        plt.ylabel("Высота (м)")
        plt.legend()
        plt.grid()
        plt.show()
#       <<
if __name__ == "__main__":
    app = QApplication([])
    window = FlightSimulator()
    window.show()
    app.exec_()
