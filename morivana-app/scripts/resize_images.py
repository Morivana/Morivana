import os
from PIL import Image

PUBLIC_DIR = '/Users/devangdhakate/Downloads/morivana/morivana-app/public'

# Define standard max sizes for different images based on display size
resize_configs = {
    # Main product packages (needs to be crisp, but 1000px is plenty)
    'packaging_highres.webp': 1000,
    'packaging_highres_back.webp': 1000,
    
    # Step illustrations (displayed at max ~300px, so 600px is perfect for Retina)
    'add.webp': 600,
    'mix.webp': 600,
    'drink.webp': 600,
    
    # Collage / card images
    'morivana-ingredients.webp': 600,
    'morivana-scoop.webp': 600,
    'Moringa Leaves Overhead.webp': 600,
    'Morning Light .webp': 600
}

print("Starting WebP image resizing and optimization...")
for img_name, max_size in resize_configs.items():
    img_path = os.path.join(PUBLIC_DIR, img_name)
    if os.path.exists(img_path):
        print(f"Resizing {img_name}...")
        try:
            with Image.open(img_path) as im:
                orig_size = im.size
                # Calculate new dimensions preserving aspect ratio
                width, height = orig_size
                if width > height:
                    if width > max_size:
                        new_width = max_size
                        new_height = int(height * (max_size / width))
                    else:
                        new_width, new_height = width, height
                else:
                    if height > max_size:
                        new_height = max_size
                        new_width = int(width * (max_size / height))
                    else:
                        new_width, new_height = width, height
                
                if (new_width, new_height) != orig_size:
                    # Use Lanczos resampling (formerly ANTIALIAS)
                    im_resized = im.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    im_resized.save(img_path, 'WEBP', quality=85, optimize=True)
                    print(f"-> Resized from {orig_size} to {im_resized.size}. New size: {os.path.getsize(img_path) / 1024:.2f} KB")
                else:
                    print(f"-> Already under max size of {max_size}px, skipping.")
        except Exception as e:
            print(f"Error processing {img_name}: {e}")
    else:
        print(f"Image {img_name} not found, skipping.")

print("\nWebP resizing complete!")
