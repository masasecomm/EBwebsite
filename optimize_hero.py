from PIL import Image
from pathlib import Path

source = Path('hero-promo.jpg.jpeg_20260921231331.jpeg')
destination = Path('easybroadcast-hero.jpg')

if not source.exists():
    raise FileNotFoundError(f'Missing source image: {source}')

img = Image.open(source).convert('RGB')
img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
img.save(destination, quality=78, optimize=True, progressive=True)
print(f'Created {destination} at size {img.size}')

