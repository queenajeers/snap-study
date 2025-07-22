import os
import uuid
import tempfile
from typing import Optional

def generate_image_and_upload(prompt: str, uid: str) -> Optional[str]:
    """Generate image using Google Gemini and save locally, returning the local file path."""
    try:
        from google import genai
        from google.genai import types


        # Initialize Gemini client
        client = genai.Client(api_key="AIzaSyDnDOvevf8bl85symrWVu2BLHmEYP-4-D4")

        # Generate image using the updated Gemini API
        response = client.models.generate_images(
            model='imagen-4.0-generate-preview-06-06',
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1"
            )
        )

        if not response.generated_images:
            print(f"No image generated for prompt: {prompt}")
            return None

        # Get the first image (already a PIL.Image object)
        generated_image = response.generated_images[0]
        image = generated_image.image  # This is a PIL Image

        # Save the image to a temp file
        filename = f"{uuid.uuid4().hex}.png"
        local_path = os.path.join(os.getcwd(), filename)

        image.save(local_path)

        return local_path

    except Exception as e:
        print(f"Gemini image generation failed: {e}")
        return None

# Example usage
generate_image_and_upload("Generate cat", "123")
