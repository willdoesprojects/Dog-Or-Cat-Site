from image_processing import load_image, compute_hog
from model import train_kmeans, train_svm, load_model
from utils import load_dataset, time_execution
import numpy as np
import time

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
hog_features = [compute_hog(image) for image in dogs + cats]

# Train and Save Models
kmeans, visual_words = train_kmeans(hog_features)
bow_vectors = np.zeros((len(hog_features), 1000))
for i, word in enumerate(visual_words):
    bow_vectors[i, word] += 1
labels = [1] * len(dogs) + [0] * len(cats)
classifier = train_svm(bow_vectors, labels)
print("done")