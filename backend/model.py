import joblib
from sklearn.cluster import MiniBatchKMeans
from sklearn.svm import LinearSVC
import numpy as np
"""
Building and Classifying our BoWs
"""

def train_kmeans(hog_features, n_clusters = 1000):
    kmeans = MiniBatchKMeans(n_clusters=n_clusters, batch_size=2048) 
    visual_words = kmeans.fit_predict(hog_features)
    joblib.dump(kmeans, './models/kmeans.pkl')  
    return kmeans, visual_words

def train_svm(bow_vectors, labels):
    classifier = LinearSVC()
    classifier.fit(bow_vectors, labels)
    joblib.dump(classifier, './models/classifier.pkl')
    return classifier

def load_model(model_path):
    return joblib.load(model_path)
