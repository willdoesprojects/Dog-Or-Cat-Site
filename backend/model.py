import pickle
from sklearn.cluster import MiniBatchKMeans
from sklearn.svm import LinearSVC
import numpy as np

"""
Building and Classifying our BoWs
"""

# Train and save KMeans model using pickle
def train_kmeans(hog_features, n_clusters=1000):
    kmeans = MiniBatchKMeans(n_clusters=n_clusters, batch_size=2048) 
    visual_words = kmeans.fit_predict(hog_features)
    
    # Save KMeans model using pickle
    with open('./models/kmeans.pkl', 'wb') as f:
        pickle.dump(kmeans, f)
    
    return kmeans, visual_words

# Train and save SVM model using pickle
def train_svm(bow_vectors, labels):
    classifier = LinearSVC()
    classifier.fit(bow_vectors, labels)
    
    # Save SVM classifier using pickle
    with open('./models/classifier.pkl', 'wb') as f:
        pickle.dump(classifier, f)
    
    return classifier

# Load model using pickle
def load_model(model_path):
    with open(model_path, 'rb') as f:
        return pickle.load(f)