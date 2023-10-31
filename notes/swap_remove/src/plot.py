import numpy as np
import matplotlib.pyplot as plt

plt.title("Naive vs Swap-remove")
plt.xlabel("Radius")
plt.ylabel("Milliseconds")

x_axis = (0, 1, 10, 100, 1000)
y_axis_naive = (5286, 4644, 2676, 865, 768)
y_axis_swap_remove = (873, 688, 529, 525, 497)

# plt.yticks(np.arange(0, 10000, 2000))

plt.plot(x_axis, y_axis_naive, label="Naive")
plt.plot(x_axis, y_axis_swap_remove, label="Swap-remove")

# plt.xscale("log")
# plt.yscale("log")

# plt.yaxis.set_major_locator(ticker.LogLocator(base=10, numticks=15))

plt.legend() # Shows labels
plt.show()
