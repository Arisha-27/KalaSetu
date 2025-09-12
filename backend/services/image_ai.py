import os, subprocess
from PIL import Image, ImageEnhance

# Path to project root static folders
BASE = os.path.dirname(os.path.dirname(__file__))
STATIC = os.path.join(BASE, "static", "uploads")

def enhance_image(input_path: str) -> str:
    """
    Try Real-ESRGAN binary (faster with GPU). If not available, use Pillow-based enhancements.
    Returns path to enhanced image.
    """
    # Option A: call realesrgan-ncnn-vulkan binary if installed
    try:
        out_path = input_path.replace("_orig", "_enhanced")
        # Example command if you have realesrgan-ncnn-vulkan installed in PATH:
        cmd = ["realesrgan-ncnn-vulkan", "-i", input_path, "-o", out_path, "-s", "2"]
        subprocess.run(cmd, check=True, timeout=300)
        return out_path
    except Exception as e:
        print("Real-ESRGAN binary failed or not installed, falling back to Pillow:", e)

    # Option B: Pillow lightweight enhancement
    try:
        img = Image.open(input_path).convert("RGB")
        # small contrast and sharpness bump
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.5)  # sharpen
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.1)
        out_path = input_path.replace("_orig", "_enhanced")
        img.save(out_path, quality=90)
        return out_path
    except Exception as e:
        print("Pillow enhancement failed:", e)
        return input_path
