import base64
import os

data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
binary_data = base64.b64decode(data)

output_path = "src/assets/images/trimet-logo.png"

# Ensure directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "wb") as f:
    f.write(binary_data)

print(f"Created {output_path}")
