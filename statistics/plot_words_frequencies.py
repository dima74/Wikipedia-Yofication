#!/usr/bin/python

import matplotlib
matplotlib.use('TkAgg')
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from tqdm import tqdm
import os

ROOT = 'frequencies/revisions/'
words = [line.strip() for line in open('words.txt').readlines()]
words = [word for word in words if word]
data = {word: [] for word in words}
for file in tqdm(os.listdir(ROOT)):
    frequencies = pd.read_csv(ROOT + file, delim_whitespace=True, names=['yoword', 'numberYo', 'numberAll'], index_col=0)
    for word in words:
        frequency_yo, frequency_all = frequencies.loc[word].values
        frequency = frequency_yo / frequency_all
        data[word].append(frequency)

plt.figure(figsize=(10, 7))
for word, frequencies in data.items():
    x = np.arange(len(frequencies))
    plt.plot(x, frequencies, label=word)
plt.gca().set_ylim(top=1)
plt.legend(loc='center left', bbox_to_anchor=(1, 0.5))
plt.xlabel('время')
plt.ylabel('частота слова')
plt.tight_layout()

# plt.show()
plt.savefig('images/words_frequencies.png')
