import os
from PIL import Image

PUBLIC_DIR = '/Users/devangdhakate/Downloads/morivana/morivana-app/public'
MODELS_DIR = os.path.join(PUBLIC_DIR, 'models')

# 1. Large PNG images to compress
images_to_compress = [
    'Moringa Leaves Overhead.png',
    'Morning Light .png',
    'add.png',
    'drink.png',
    'mix.png',
    'morivana-ingredients.png',
    'morivana-scoop.png',
    'packaging_highres.png',
    'packaging_highres_back.png'
]

print("Starting image compression to WebP...")
for img_name in images_to_compress:
    img_path = os.path.join(PUBLIC_DIR, img_name)
    if os.path.exists(img_path):
        webp_name = os.path.splitext(img_name)[0] + '.webp'
        webp_path = os.path.join(PUBLIC_DIR, webp_name)
        
        print(f"Compressing {img_name} ({os.path.getsize(img_path) / (1024*1024):.2f} MB)...")
        try:
            with Image.open(img_path) as im:
                # Save as webp with high quality (85%) and optimization
                im.save(webp_path, 'WEBP', quality=85, optimize=True)
            print(f"-> Saved {webp_name} ({os.path.getsize(webp_path) / 1024:.2f} KB)")
            
            # Delete original PNG
            os.remove(img_path)
            print(f"-> Deleted original {img_name}")
        except Exception as e:
            print(f"Error processing {img_name}: {e}")
    else:
        print(f"Image {img_name} not found, skipping.")

# 2. Unused GLB files to delete from public/models/
unused_glbs = [
    'highres.glb',
    'morivana-labeled.glb',
    'morivana_pouch_fixed.glb'
]

print("\nCleaning up unused GLB models...")
for glb_name in unused_glbs:
    glb_path = os.path.join(MODELS_DIR, glb_name)
    if os.path.exists(glb_path):
        print(f"Deleting unused model: {glb_name} ({os.path.getsize(glb_path) / (1024*1024):.2f} MB)...")
        try:
            os.remove(glb_path)
            print(f"-> Deleted {glb_name}")
        except Exception as e:
            print(f"Error deleting {glb_name}: {e}")
    else:
        print(f"Model {glb_name} not found, skipping.")

print("\nOptimization and cleanup complete!")
