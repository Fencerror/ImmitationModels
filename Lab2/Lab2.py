from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QDoubleSpinBox, QPushButton, QVBoxLayout
from PyQt5.QtCore import QTimer
import numpy as np
import matplotlib.pyplot as plt

class CurrencySimulator(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()
      
    def initUI(self):
        self.setWindowTitle("Моделирование курсов валют")
        layout = QVBoxLayout()
        

        self.label1 = QLabel("Initial Price (Currency 1):")
        self.input1 = QDoubleSpinBox()
        self.input1.setRange(0.01, 1000)
        self.input1.setValue(100)
        layout.addWidget(self.label1)
        layout.addWidget(self.input1)
        
        self.label2 = QLabel("Initial Price (Currency 2):")
        self.input2 = QDoubleSpinBox()
        self.input2.setRange(0.01, 1000)
        self.input2.setValue(100)
        layout.addWidget(self.label2)
        layout.addWidget(self.input2)
        

        self.start_button = QPushButton("Start")
        self.start_button.clicked.connect(self.toggle_simulation)
        layout.addWidget(self.start_button)
        
        self.setLayout(layout)
        

        self.timer = QTimer()       

        self.timer.timeout.connect(self.update_simulation)
        
        self.k = 0.02  # Коэффициент изменения
        self.rnd = np.random.default_rng()
        self.running = False

    def toggle_simulation(self):
        if self.running:
            self.timer.stop()
            self.start_button.setText("Start")
        else:
            self.price1 = self.input1.value()
            self.price2 = self.input2.value()
            self.current_day = 0
            self.history1 = [self.price1]
            self.history2 = [self.price2]
            
            plt.ion()
            self.fig, self.ax = plt.subplots()
            self.ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.7)  #Сетка
            self.timer.start(1000)  # Обновление раз в секунду
            self.start_button.setText("Stop")
        
        self.running = not self.running
        
    def update_simulation(self): 
        self.price1 *= (1 + self.k * (self.rnd.random() - 0.5))# Здесь формируется цена первой валюты
        self.price2 *= (1 + self.k * (self.rnd.random() - 0.5))
        
        self.history1.append(self.price1)
        self.history2.append(self.price2)
        
        self.ax.clear()
        self.ax.plot(self.history1, label="Currency 1")
        self.ax.plot(self.history2, label="Currency 2")
        self.ax.legend()#
        self.ax.set_xlabel("Days")
        self.ax.set_ylabel("Price")
        self.ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.7)  
        
        
        self.ax.set_title(f"Day {self.current_day}: Currency 1 = {self.price1:.4f}, Currency 2 = {self.price2:.4f}")# Заголовок графика с текущими значениями.
        
        plt.draw()
        plt.pause(0.1)
        
        self.current_day += 1

if __name__ == "__main__":
    app = QApplication([])
    window = CurrencySimulator()
    window.show()
    app.exec_()
