from PIL import Image
import numpy as np

""" Loads image in as grayscale """
def load_image(filepath):
    img = Image.open(filepath).convert('L')  
    return (np.asarray(img).astype(float) / 255)

""" Loads image in as grayscale """
def load_image_color(filepath):
    img = Image.open(filepath)
    return (np.asarray(img).astype(float)/255)[:, :, :3]
    

""" Self-Defined Function to compute our HoG descriptor """
def compute_hog(image):
    #Intializing our initial variables: cells, bins, width
    C = 8
    B = 9
    w = 180/B
    epsilon = 0.001
    hog_descriptor = list()
    
    # First Compute Derivates in X and Y direction using central difference
    Ix = np.zeros_like(image)
    Iy = np.zeros_like(image)
    
    Ix[:, 1:-1] = image[:, 2:] - image[:, :-2]
    Iy[1:-1, :] = image[2:, :] - image[:-2, :]


    #Compute "mu constant" and "theta"
    mu = np.sqrt(np.square(Ix) + np.square(Iy))
    theta = (180 / np.pi) * (np.arctan2(Iy, Ix) % np.pi)
    
    #Getting our "sliding window" of CxC
    cell_x = image.shape[1] // C
    cell_y = image.shape[0] // C

    for i in range(cell_y):
        for j in range(cell_x):
            cell_magnitude = mu[i*C:(i+1)*C, j*C:(j+1)*C]
            cell_orientation = theta[i*C:(i+1)*C, j*C:(j+1)*C]
            hist, _ = np.histogram(cell_orientation, bins=B, range=(0, 180), weights=cell_magnitude)
            hog_descriptor.append(hist)

    
    # Reshape the descriptor array
    hog_descriptor = np.reshape(hog_descriptor, (cell_y, cell_x, B))

    # Normalize histograms over blocks of 2x2 cells
    block_normed = list()
    for y in range(cell_y - 1):
        for x in range(cell_x - 1):
            block = hog_descriptor[y:y+2, x:x+2, :].ravel()
            norm = np.linalg.norm(block, ord=2)  # L2 norm
            block = block / (norm**2 + epsilon)
            block_normed.append(block)

    hog_features = np.concatenate(block_normed)
    hog_features = hog_features / (np.linalg.norm(hog_features)**2 + epsilon)

    return hog_descriptor, hog_features



