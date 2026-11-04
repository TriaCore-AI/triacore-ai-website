# Bewijst dat scène 12 exact de muur van 3 en exact de sculptuur van 10 gebruikt, op de kale renders
import numpy as np
from PIL import Image
a3 = np.array(Image.open('raamlicht_kaal.png')).astype(int)
a10 = np.array(Image.open('schijven_kaal.png')).astype(int)
a12 = np.array(Image.open('schijven-raam_kaal.png')).astype(int)
H, W, _ = a12.shape
# Boven de sculptuur en boven de sokkels van 3 staat enkel de muur
muur = np.abs(a12[:int(H * .6)] - a3[:int(H * .6)])
print(f"muur 12 tegen 3: gem verschil {muur.mean():.3f}, max {muur.max()} op 255")
# De sculptuur: pixels waar 10 duidelijk afwijkt van zijn lege achtergrond
leeg = a10[:40].mean(axis=(0, 1))
masker = np.abs(a10 - leeg).sum(axis=2) > 12
masker[int(H * .86):] = False
d = np.abs(a12 - a10)[masker]
print(f"sculptuur 12 tegen 10: {masker.sum()} pixels, gem verschil {d.mean():.2f}, 95% onder {np.percentile(d, 95):.0f} op 255")
hard = (np.abs(a12 - a10).sum(axis=2) > 90) & masker
print(f"pixels met groot verschil in de sculptuur: {hard.sum() / max(masker.sum(), 1) * 100:.2f}%")
