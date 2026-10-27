"""Create optimized website copies, leaving the supplied originals untouched."""
from pathlib import Path
from PIL import Image, ImageOps

assets = Path(__file__).resolve().parents[1] / 'assets'
source = Path.home() / 'Downloads'
photos = ['181439', '232448', '222633', '215723', '215248', '215142', '193211', '181526', '181529']
for photo in photos:
    with Image.open(source / f'20261024_{photo}.jpg') as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((1200, 1200))
        image.save(assets / f'wedding-20261024-{photo}.webp', quality=82, method=6)
        if photo in ['181529', '215723']:
            hero = ImageOps.exif_transpose(original).convert('RGB')
            hero.thumbnail((1800, 1800))
            hero.save(assets / f'hero-wedding-{photo}.webp', quality=78, method=6)
    print(photo)
