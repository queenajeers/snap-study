import time
from google import genai
from google.genai import types

client = genai.Client(api_key="AIzaSyDnDOvevf8bl85symrWVu2BLHmEYP-4-D4")

operation = client.models.generate_videos(
    model="veo-3.0-generate-preview",
    prompt="A poetic moonlit rooftop scene inspired by Telugu romantic aesthetics. A couple sits on the terrace of a traditional Indian home under a full moon. The moonlight shines from behind, creating a dreamy silhouette — their faces are not visible, only their forms glowing softly. The woman, in an elegant saree, sits peacefully, while her husband gently bends her toes one by one, making a soft tik-tik sound that soothes her. The night is still, scented with jasmine, and a mild breeze flows like a lullaby. Lanterns flicker nearby as the couple shares this quiet, tender ritual. The scene is filled with unspoken love — a visual expression of the lyrics:'Vennelammā nīku jolapāḍi kālimeṭikelu viricēnē…' Timeless, lyrical, and soulfully romantic.",
    
    config=types.GenerateVideosConfig(
        person_generation="allow_all",  # "allow_adult" and "dont_allow" for Veo 2 only
        aspect_ratio="16:9",  # "16:9", and "9:16" for Veo 2 only
    ),
)

while not operation.done:
    time.sleep(20)
    operation = client.operations.get(operation)

for n, generated_video in enumerate(operation.response.generated_videos):
    client.files.download(file=generated_video.video)
    generated_video.video.save(f"video{n}.mp4")


