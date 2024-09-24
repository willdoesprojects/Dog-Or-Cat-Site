import tensorflow as tf
import time

def load_dataset(directory, batch_size=200, img_size=(256, 256), color_mode='grayscale'):
    return tf.keras.preprocessing.image_dataset_from_directory(
        directory,
        labels='inferred',
        batch_size=batch_size,
        color_mode=color_mode,
        image_size=img_size
    )

def time_execution(start_time):
    end_time = time.perf_counter()
    print(f"Execution Time: {end_time - start_time:.2f} seconds")
