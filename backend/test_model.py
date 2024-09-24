import numpy as np
import time
from image_processing import load_image, compute_hog
from model import train_kmeans, train_svm, load_model
from utils import load_dataset, time_execution

def train_and_save_models(data_path='./data', img_size=(256, 256), n_clusters=1000):
    """
    Function to load data, compute HOG features, and train KMeans and SVM models.
    """
    # Load the data
    dataset = load_dataset(data_path, img_size=img_size)

    # Extract images and labels
    dogs, cats = [], []
    for images_batch, labels_batch in dataset:
        for image, label in zip(images_batch, labels_batch):
            if label == 1:
                dogs.append(image.numpy())
            else:
                cats.append(image.numpy())

    # Compute HOG features for the images
    hog_features = [compute_hog(image)[1] for image in dogs + cats]

    # Train KMeans and get visual words
    kmeans, visual_words = train_kmeans(hog_features, n_clusters=n_clusters)

    # Build Bag of Words (BoW) vectors
    bow_vectors = np.zeros((len(hog_features), n_clusters))
    for i, word in enumerate(visual_words):
        bow_vectors[i, word] += 1

    # Generate labels (1 for dogs, 0 for cats)
    labels = [1] * len(dogs) + [0] * len(cats)

    # Train the SVM classifier
    classifier = train_svm(bow_vectors, labels)

    print("Model training and saving completed.")
    return 

if __name__ == '__main__':
    # Call the function in main.py
    train_and_save_models()
