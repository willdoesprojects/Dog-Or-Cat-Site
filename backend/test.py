import numpy as np
import cv2
from sklearn import svm
from sklearn.metrics import accuracy_score
from sklearn.cluster import MiniBatchKMeans
from pathlib import Path
from tqdm import tqdm
from skimage.feature import hog

# This function will get SIFT descriptors from training images and train a k-means classifier
def read_and_clusterize(folder_path, num_cluster):
    sift_keypoints = []
    folder = Path(folder_path)
    valid_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    
    for image_path in tqdm(folder.rglob('*')):
        if image_path.is_file() and image_path.suffix.lower() in valid_extensions:
            image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
            if image is None:
                print(f"Warning: Unable to read image {image_path}")
                continue
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            sift = cv2.SIFT_create()
            _, descriptors = sift.detectAndCompute(gray, None)
            if descriptors is not None:
                sift_keypoints.append(descriptors)
    
    if not sift_keypoints:
        raise ValueError("No descriptors found in any image.")
    
    sift_keypoints = np.concatenate(sift_keypoints, axis=0)
    print("Training k-means")
    kmeans = MiniBatchKMeans(n_clusters=num_cluster, random_state=0).fit(sift_keypoints)
    return kmeans

# Generates feature vectors by building histograms of classified keypoints
def calculate_centroids_histogram(folder_path, model):
    feature_vectors = []
    class_vectors = []
    folder = Path(folder_path)
    valid_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    for image_path in tqdm(folder.rglob('*')):
        if image_path.is_file() and image_path.suffix.lower() in valid_extensions:
            image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
            if image is None:
                print(f"Warning: Unable to read image {image_path}")
                continue
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            sift = cv2.SIFT_create()
            _, descriptors = sift.detectAndCompute(gray, None)
            if descriptors is not None:
                predict_kmeans = model.predict(descriptors)
                hist, _ = np.histogram(predict_kmeans, bins=np.arange(model.n_clusters + 1))
            else:
                hist = np.zeros(model.n_clusters)
            hist = hist.astype(float)
            hist /= (hist.sum() + 1e-7)
            feature_vectors.append(hist)
            class_sample = define_class(image_path)
            class_vectors.append(class_sample)

    return np.array(class_vectors), np.array(feature_vectors)

def define_class(image_path):
    """
    Define the class based on the parent directory name.
    Assigns 0 to 'cat' and 1 to 'dog'.
    """
    class_dir = image_path.parent.name.lower()
    # print(f"Class directory: {class_dir}")
    
    if class_dir == "cat":
        return 0
    elif class_dir == "dog":
        return 1
    else:
        raise ValueError(f"Unknown class for image path '{image_path}'.")

def main(train_folder, test_folder, num_clusters):
    print("Step 1: Calculating K-means classifier")
    model = read_and_clusterize(train_folder, num_clusters)

    print("Step 2: Extracting histograms of training and testing images")
    print("Training")
    train_class, train_featvec = calculate_centroids_histogram(train_folder, model)
    print("Testing")
    test_class, test_featvec = calculate_centroids_histogram(test_folder, model)

    print("Step 3: Training the SVM classifier")
    clf = svm.SVC()
    clf.fit(train_featvec, train_class)

    print("Step 4: Testing the SVM classifier")  
    predict = clf.predict(test_featvec)
    score = accuracy_score(test_class, predict)

    with open("results.txt", "a") as file_object:
        file_object.write(f"Cluster size {num_clusters}: {score}\n")

    print(f"Accuracy with cluster size {num_clusters}: {score}")

if __name__ == "__main__":
    # Define paths to your training and testing folders
    train_folder = "./data"  # Contains 'cat' and 'dog' subdirectories
    test_folder = "./test_set"   # If separate, update accordingly
    
    
    main(train_folder, test_folder, 45)
