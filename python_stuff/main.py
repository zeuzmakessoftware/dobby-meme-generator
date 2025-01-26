from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import requests
import base64
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('../.env.local')

# Initialize Flask app
app = Flask(__name__)

CORS(app)

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

# Function to encode the image
def encode_image(image_bytes):
    return base64.b64encode(image_bytes).decode('utf-8')

@app.route('/api/cool', methods=['POST'])
def analyze_image_and_chat():
    try:
        # Check if a file was sent
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        # Read the file from the request
        image_file = request.files['file']
        
        # Ensure the file is not empty
        if image_file.filename == '':
            return jsonify({"error": "Empty file provided"}), 400

        # Encode the image to base64
        base64_image = encode_image(image_file.read())

        # Step 1: Make the API call to the vision model
        vision_response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What's in this image?"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            model="llama-3.2-11b-vision-preview",
        )

        # Extract vision model output
        vision_model_output = vision_response.choices[0].message.content

        # Step 2: Feed vision model output to Dobby
        dobby_url = "https://api.fireworks.ai/inference/v1/chat/completions"
        dobby_headers = {
            "Authorization": os.getenv("DOBBY_API_KEY"),
            "Content-Type": "application/json"
        }
        dobby_payload = {
            "model": "accounts/sentientfoundation/models/dobby-mini-unhinged-llama-3-1-8b#accounts/sentientfoundation/deployments/81e155fc",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "Create a JSON object with the following fields: "
                        "meme_caption (string), photo_caption (string), "
                        "funny_description_caption (string), and hashtags (array of strings). "
                        "Make the content as vulgar, random, and funny as possible."
                        "Dont output anything else other than json."
                    )
                },
                {
                    "role": "user",
                    "content": f"{vision_model_output}"
                }
            ]
        }

        dobby_response = requests.post(dobby_url, headers=dobby_headers, json=dobby_payload)
        dobby_response_data = dobby_response.json()

        # Extract Dobby's response
        dobby_message = dobby_response_data["choices"][0]["message"]["content"]

        # Return the combined response
        return dobby_message, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
