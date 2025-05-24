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
        

        self.label1 = QLabel("Initial Price $:")
        self.input1 = QDoubleSpinBox()
        self.input1.setRange(0.01, 1000)
        self.input1.setValue(70)
        layout.addWidget(self.label1)
        layout.addWidget(self.input1)
        
        self.label2 = QLabel("Initial Price €:")
        self.input2 = QDoubleSpinBox()
        self.input2.setRange(0.01, 1000)
        self.input2.setValue(70)
        layout.addWidget(self.label2)
        layout.addWidget(self.input2)


        self.dt = 1.0 #1 день

        self.start_button = QPushButton("Start")
        self.start_button.clicked.connect(self.toggle_simulation)
        layout.addWidget(self.start_button)
        
        self.setLayout(layout)
        
        self.timer = QTimer()       
        self.timer.timeout.connect(self.update_simulation)
        self.running = False
        self.rng = np.random.default_rng()

        self.drift1 = 0.0005
        self.vol1 = 0.02
        self.drift2 = 0.0003
        self.vol2 = 0.015

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
            self.ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.7)  
            self.timer.start(500) 
            self.start_button.setText("Stop")
        
        self.running = not self.running
        
    def update_simulation(self):
        dt = self.dt  
        
        z1 = self.rng.normal()
        self.price1 *= np.exp((self.drift1 - 0.5 * self.vol1**2) * dt + self.vol1 * np.sqrt(dt) * z1)
        
        z2 = self.rng.normal()
        self.price2 *= np.exp((self.drift2 - 0.5 * self.vol2**2) * dt + self.vol2 * np.sqrt(dt) * z2)
        
        self.history1.append(self.price1)
        self.history2.append(self.price2)
        
        self.ax.clear()
        self.ax.plot(self.history1, label="$")
        self.ax.plot(self.history2, label="€")
        self.ax.legend()
        self.ax.set_xlabel("Days")
        self.ax.set_ylabel("Price")
        self.ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.7)  
        
        self.ax.set_title(f"Day {self.current_day}: $ = {self.price1:.4f}, € = {self.price2:.4f}")
        
        plt.draw()
        plt.pause(0.1)
        
        self.current_day += 1

if __name__ == "__main__":
    app = QApplication([])
    window = CurrencySimulator()
    window.show()
    app.exec_()
