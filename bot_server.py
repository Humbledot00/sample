from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin

import pickle
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

# Load vectorizer
with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

# Load model
model = load_model('chatbot_model.h5')

# Define your list of labels based on the classes or intents your model was trained on
labels = ["intent1", "intent2", "intent3", ...]

# Adjusted label mapping
label_mapping = {label: idx for idx, label in enumerate(set(labels))}
responses = [f"intent: {label}" for label in label_mapping.keys()]

def predict(text):
    text_vector = vectorizer.transform([text]).toarray()
    pred = model.predict(text_vector).argmax(axis=1)[0]
    return responses[pred]

@app.route('/bot', methods=['POST'])
def bot_reply():
    user_message = request.json.get('message', '')
    bot_response = predict(user_message)
    return jsonify({'bot_reply': bot_response})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
