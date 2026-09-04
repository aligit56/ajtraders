from PIL import Image

def process_image(input_path, output_path):
    # Open the image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    
    # Get data
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Get grayscale value
        r, g, b, a = item
        # If it's very dark (close to black background), make transparent
        if r < 50 and g < 50 and b < 50:
            new_data.append((255, 255, 255, 0))
        else:
            # Otherwise make it solid white
            new_data.append((255, 255, 255, 255))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved processed logo to {output_path}")

input_img = r"C:\Users\Ali\.gemini\antigravity\brain\0fb975fe-d49f-42e9-aa61-1bdef1a49f08\.user_uploaded\media_1788559636533.png"
output_img = r"d:\AJTraders Website\frontend\public\logo-alpha.png"

process_image(input_img, output_img)
