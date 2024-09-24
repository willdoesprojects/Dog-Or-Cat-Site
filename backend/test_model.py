import joblib
from image_processing import compute_hog
from utils import load_dataset
from sklearn.metrics import accuracy_score
import numpy as np
from tqdm import tqdm
import cv2
# Step 1: Load the saved models
kmeans = joblib.load('models/kmeans.pkl')
classifier = joblib.load('models/classifier.pkl')

# Step 2: Load the test dataset
test_dataset = load_dataset('./test_set', img_size=(256, 256))  # Replace with actual test set path

error = 0
img_total = 0
def compute_batch_hog(images_batch):
    return np.array([compute_hog(image)[1] for image in images_batch])

from skimage.feature import hog

def compute_batch_hog2(images_batch):
    return np.array([hog(
    image,
    orientations=9,
    pixels_per_cell=(8, 8),
    cells_per_block=(2, 2),
    visualize=False,
    channel_axis=-1
) for image in images_batch])


for images_batch, labels_batch in tqdm(test_dataset):
    images_batch = images_batch.numpy().astype("float")
    hog_features = compute_batch_hog2(images_batch)

    new_words = kmeans.predict(hog_features)
    new_bow_vectors = np.zeros((len(images_batch), 1000))
    
    for idx, word in enumerate(new_words):
        new_bow_vectors[idx, word] += 1                         
    
        predicted_labels = classifier.predict(new_bow_vectors)
    
    error += np.sum(predicted_labels != labels_batch.numpy().flatten())
    img_total += len(images_batch)

accuracy = (img_total - error) / img_total * 100

print(f"Test Accuracy: {accuracy:.2f}%")
