#!/usr/bin/python

import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import pandas as pd

ROOT = 'frequencies/'
MIN_NUMBER = 100
MIN_FREQUENCY = .1

data = pd.read_csv(ROOT + 'frequencies.txt', delim_whitespace=True, names=['yoword', 'numberYo', 'numberAll'], index_col=0)
frequencies_yo = data.values[:, 0]
frequencies_all = data.values[:, 1]
mask1 = frequencies_all >= MIN_NUMBER
frequencies = frequencies_yo[mask1] / frequencies_all[mask1]
mask2 = frequencies >= MIN_FREQUENCY
frequencies = frequencies[mask2]

plt.figure(figsize=(10, 7))
plt.hist(frequencies, 100)
plt.title('Гистограмма частот слов')
plt.xlabel('частота слова (число вхождений версии слова с «ё», поделённое на общее число вхождений слова)')

# plt.show()
plt.savefig('images/frequencies_distribution.png')