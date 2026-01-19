import os
from PIL import Image
import numpy as np

def process_logo():
    input_path = "src/assets/images/temp_logo.png"
    output_path = "src/assets/images/trimet-logo.png"

    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # Define color ranges for the orange/red icon
    # The TriMet logo is orange. Let's look for pixels that are reddish/orange.
    # R > 150, G > 50, B < 100 is a rough guess, but let's be more inclusive or just exclude black.
    # The text is black. The icon is orange.
    # We want to keep the orange part.
    
    # Let's find the bounding box of non-transparent pixels first to see what we have.
    # But the image might have the text "TRI-MET" in black.
    
    # Filter for orange pixels.
    # Orange is roughly High Red, Medium Green, Low Blue.
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Mask for orange-ish pixels
    # Adjust thresholds as needed. TriMet orange is quite bright.
    # Let's say Red > 100 and Red > Blue + 20
    orange_mask = (r > 100) & (r > b + 20) & (a > 0)
    
    # Find coordinates of orange pixels
    coords = np.argwhere(orange_mask)
    
    if coords.size == 0:
        print("No orange pixels found. Saving original.")
        img.save(output_path)
        return

    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0) + 1
    
    # Crop to the orange icon
    cropped = img.crop((x0, y0, x1, y1))
    
    # Make white pixels transparent in the cropped image (if any remain)
    # The Wikipedia PNG usually has transparent background, but let's be safe.
    # Actually, if we cropped based on orange mask, we might have cut off some anti-aliasing if we are not careful.
    # Better approach: Crop the original image to the bounding box of the orange parts, 
    # but keep the alpha channel as is for those pixels.
    
    # Wait, if I crop to the bounding box of orange pixels, I might include some black text if it overlaps in X or Y?
    # In the standard logo, the icon is above the text.
    # So cropping to the orange pixels' Y range should exclude the text below.
    
    # Let's verify the layout. Usually Icon is top, Text is bottom.
    # So y1 (max y of orange) should be less than the y of the text.
    
    # Let's just crop to the bounding box found.
    
    # Now make it square
    w, h = cropped.size
    size = max(w, h)
    new_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    # Center the cropped image
    offset_x = (size - w) // 2
    offset_y = (size - h) // 2
    new_img.paste(cropped, (offset_x, offset_y))
    
    # Save
    new_img.save(output_path)
    print(f"Processed logo saved to {output_path}")

if __name__ == "__main__":
    process_logo()
