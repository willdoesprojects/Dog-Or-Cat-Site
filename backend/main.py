# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import joblib
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import load_model
import sys
import pickle
from test_model import train_and_save_models


app = Flask(__name__)
CORS(app)

print("Creating Model")

from image_processing import load_image, compute_hog
from model import train_kmeans, train_svm, load_model
from utils import load_dataset, time_execution
import numpy as np

# Load the data
dataset = load_dataset('./data', img_size=(256, 256))

# Extract images and labels
dogs, cats = [], []
for images_batch, labels_batch in dataset:
    for image, label in zip(images_batch, labels_batch):
        if label == 1:
            dogs.append(image.numpy())
        else:
            cats.append(image.numpy())

# Compute HOG features
hog_features = [compute_hog(image)[1] for image in dogs + cats]

# Train and Save Models
kmeans, visual_words = train_kmeans(hog_features)
bow_vectors = np.zeros((len(hog_features), 1000))
for i, word in enumerate(visual_words):
    bow_vectors[i, word] += 1
labels = [1] * len(dogs) + [0] * len(cats)
classifier = train_svm(bow_vectors, labels)


# train_and_save_models()

# # Load your pre-trained models
# with open('models/kmeans.pkl', 'rb') as f:
#     kmeans = pickle.load(f)
# with open('models/classifier.pkl', 'rb') as f:
#     classifier = pickle.load(f)

model = load_model('models/dog_cat_classifier.h5')

# Import your compute_hog function
from image_processing import compute_hog

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file:
        try:
            # Read image
            
            image = Image.open(io.BytesIO(file.read())).convert('L')
            image = image.resize((256, 256))

            image2 = image.convert('RGB')
            image2 = image2.resize((224, 224))

            image_array = (np.array(image).astype(float) / 255.0)  # Normalize pixel values

            image_array2 = (np.array(image2).astype(float) / 255.0)
            img_array2 = np.expand_dims(image_array2, axis=0)

            # Compute HOG features
            _, hog_features = compute_hog(image_array)

            # Predict visual words
            visual_word = kmeans.predict(hog_features.reshape(1, -1))

            # Build BoW vector
            bow_vector = np.zeros(1000)
            bow_vector[visual_word] += 1

            # Predict label
            predicted_label = classifier.predict([bow_vector])

            # Map label to class
            labels = {0: 'cat', 1: 'dog'}
            result = labels.get(predicted_label[0], 'unknown')

            print(img_array2.shape)

            predictions = model.predict(img_array2)
            score = predictions[0][0]
            result2 = ""

            print(f"{result} {result2}")

            if score > 0.5:
                result2 = 'dog'
            else:
                result2 = 'cat'

            
            return jsonify({'bow': result, 'cnn': result2}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'File processing failed'}), 400

if __name__ == '__main__':
    app.run(debug=False)
