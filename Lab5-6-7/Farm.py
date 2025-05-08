import numpy as np
import matplotlib.pyplot as plt

# Параметры моделирования
time_step = 1.0  # Шаг времени (дни)
simulation_duration = 100  # Общее время моделирования (дни)
time = np.arange(0, simulation_duration, time_step)

# Начальные условия
inventory_levels = [1000]  # Товары на складе
unfulfilled_orders = [500]  # Невыполненные заказы
shipments = []  # Отгрузки из розницы
order_fulfillment_rates = []  # Запаздывание выполнения заказов

# Постоянные параметры (упрощенно)
new_orders_rate = 50  # Новые заказы от покупателей за шаг
fulfillment_coefficient = 0.05  # Коэффициент удовлетворения заказов (скорость выполнения)
fulfillment_delay = 5  # Запаздывание выполнения заказа (в днях)

# Основной цикл моделирования
for t in time[:-1]:
    current_inventory = inventory_levels[-1]
    current_unfulfilled_orders = unfulfilled_orders[-1]
    

    fulfillment_rate = fulfillment_coefficient * current_unfulfilled_orders  
    order_fulfillment_rates.append(fulfillment_rate)
    

    shipment = min(current_inventory, fulfillment_rate)
    shipments.append(shipment)
    

    new_inventory = current_inventory - shipment + 40  
    new_unfulfilled_orders = current_unfulfilled_orders + new_orders_rate - shipment
    
    inventory_levels.append(new_inventory)
    unfulfilled_orders.append(new_unfulfilled_orders)


order_fulfillment_rates.append(order_fulfillment_rates[-1])
shipments.append(shipments[-1])


plt.figure(figsize=(12, 8))

plt.subplot(3, 1, 1)
plt.plot(time, inventory_levels, label='Запасы на складе')
plt.ylabel('Единицы')
plt.legend()

plt.subplot(3, 1, 2)
plt.plot(time, unfulfilled_orders, label='Невыполненные заказы', color='orange')
plt.ylabel('Единицы')
plt.legend()

plt.subplot(3, 1, 3)
plt.plot(time, shipments, label='Отгрузки из розницы', color='green')
plt.plot(time, order_fulfillment_rates, label='Выполнение заказов', linestyle='--', color='red')
plt.xlabel('Время (дни)')
plt.ylabel('Единицы/день')
plt.legend()

plt.tight_layout()
plt.show()