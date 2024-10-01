import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
  

const Implementation = () => {
    return(
        <section className="flex flex-col justify-center items-start p-20 text-lg dark:bg-neutral-900">
            <h1 className="mt-0 text-4xl font-extrabold text-neutral-900 dark:text-white">
            From Pixels to Pets: Building an Intelligent Dog & Cat Classifier</h1>
            <aside className='dark:text-white'>Unleashing the Power of Histogram of Gradients, Bag of Words, kNN Nearest Neighbors,
                Support Vector Machine, and Neural Network
            </aside>
            <div className="mt-8 mb-12 text-base text-neutral-500 dark:text-neutral-400 print:hidden">
                <div className="flex flex-row flex-wrap items-center">
                    <span title="Reading time">10 minute read</span>
                </div>
            </div>
            <h2 className='dark:text-white'><b>Introduction</b></h2>
            <p className='dark:text-white'>In my computer vision course at university, my professor gave our entire class full
                liberty to do anything as we so please with our final project. After enduring most of
                the semester, we finally get full range to use the techniques we learned in class and 
                create something with our own choosing. I knew that I wanted to create an application
                that is able to classify images of dogs or cats, using concepts that we learned
                in class and also modern day techniques that are used in industry. That is how this whole project
                of "PetID" started. 
            </p>

            <p className='dark:text-white'>
                The whole project was orignally written out all in Python. But I want to devise a web application that
                users (like yourself :D) could easily to see how the magic works. The frontend is React Native w/ TailWindCSS 
                and the backend uses Python Scripts to run the model to classify the user's image in combination of MongoDB. But
                of course, the main star of show is our Image Classfication Model which will be explained in this article.
            </p>

            <p className='dark:text-white'>The Image Classification Model is broken down into four steps:</p>
            <ul className='dark:text-white'>
                <li>1. Histogram of Gradient (HoG) Feature Extraction</li>
                <li>2. Dictionary Learning & Classifying</li>
                <li>3. Modern Apporach</li>
                <li>4. Testing & Evaluation</li>
            </ul>
            <p className='dark:text-white'>The methology behind our implementation is Bag of Words (BoW). It utilizes a feature extractor to build
                an appropriate dictionary of visual words based on the features from the training set we use. Then the features
                are then clustered to form visual words that capture common patterns in the images: i.e) paws, whiskers, nose, mouth, etc..
                After such, our model is then able to classify between images of a dog or cat based off of which visual words are more representative of each
                category.
            </p> 

            <p className='dark:text-white'>Each step will be gone in more depth.</p>

            <h2 className='dark:text-white'><b>1. Histogram of Gradient (HoG) Feature Extraction</b></h2>
            <p className='dark:text-white'>Histogram of Oriented Gradient (HoG) is a feature descriptor which can capture edge information and object 
                appeareances through computing gradient direction and magnitude within specified localized portions of an image 
                in combination with histograms. We use this to produce a percise feature vector for then later can be used 
                to produce visual words in our dictionary. The procedure is as follows:
            </p>
            
            <h3 className='dark:text-white'><b>Compute the Gradients</b></h3>
            <p className='dark:text-white'>The gradients in both the <InlineMath math="I_x" /> and <InlineMath math="I_y" /> directions are computed using central differences 
                as it contains the most noise, where <InlineMath math="I_x" /> is the <InlineMath math="x" />-derivative and <InlineMath math="I_y" /> is 
                the <InlineMath math="y" />-derivative of the image <InlineMath math="I" />. This is the first major step in capturing parts of the image that has high-intesity.
                This is what taking the derivative of anything is essentially, it finds the rate of change at is highest peak similar
                to how we want to find highest peaks of change in intesity in our image. We follow the mathematical equation as such:
            </p>
            <div className="flex flex-col justify-center items-center w-[80vw] dark:text-white">
                <BlockMath className="m-0" math="I_x(r,c) = I(r,c+1) - I(r,c-1)"/>
                <BlockMath math="I_y(r,c) = I(r-1,c) - I(r+1, c)"/>
            </div>

            <h3 className='dark:text-white'><b>Computing Magnitude and Direction</b></h3>
            <p className='dark:text-white'> 
            After computing <InlineMath math="I_x" /> and <InlineMath math="I_y" />, we create a distribution through histograms 
            based on these features. We do this by calculating the gradient magnitude <InlineMath math="\mu" /> and
            direction   <InlineMath math="\theta" />. This allows us to create a histogram with intervals 
            of <InlineMath math="\theta" /> (direction), where each bin represents a direction, and the values in each bin 
            are the associated intensities <InlineMath math="\mu" /> of the features in that direction. We follow the mathematical 
            equation as such: 
            </p>
            <div className="flex flex-col justify-center items-center w-[80vw] dark:text-white">
                <BlockMath math="\mu=\sqrt{I_x^2+I_y^2}"/>
                <BlockMath math="\theta=\frac{180}{\pi} (\tan_2^{-1}(I_y,I_x)\mod \pi)"/>
            </div>

            <h3 className='dark:text-white'><b>Cell Orientation Histograms</b></h3>
            <p className='dark:text-white'>Now, we finally construct our histogram. After these calculations, we divide our image into 8x8 pixel cells. 
                For each cell, a histogram is constructed with 9 bins, each representing a direction. We do this to 
                reduce computational expense. We then map each cell to its corresponding bin within the histogram.
            </p>

            <h3 className='dark:text-white'><b>Normalizing Our Histogram</b></h3>
            <p className='dark:text-white'>When do mass computations like we have before, we will get a lot of interference due to natural occurences
                within our image: illumination, constract, etc.. Therefore, we want to normalize our histogram & features
                in order to reduce this effect as much as possible. We do so by reshaping the our feature matrix to a 3x3
                dimension, and each 2x2 cell block is normalized to stabilize the feature representation. We follow the mathematical 
                equation as such: 
            </p>
            <div className="flex flex-col justify-center items-center w-[80vw] dark:text-white">
                <BlockMath math="b=\frac{b}{\sqrt{\lVert b \rVert^2 + \epsilon}}"/>
            </div>
            <p className='dark:text-white'>Now, we are done in developing our feature extractor! We could have used a library to simplify the process two fold, however
                I wanted to learn how it all worked and the mathetical method in order to achieve something of this feat. Now, we will proceed onto
                the Dictionary Learning & Classifying aspect.            
            </p>

            <h2 className='dark:text-white'><b>2. Dictionary Learning & Classifying</b></h2>
            <p className='dark:text-white'>Now we delve into the core of our system. Using the Histogram of Oriented Gradients (HoG) feature extractor, 
                we apply it to all images in our training set. After extracting the feature vectors (histograms) for each 
                image, we build a larger histogram that serves as our Bag of Words (BoW). We achieve this by clustering the 
                features together using K-means clustering to create our "visual words." Then, we construct our Bag-of-Words 
                dictionary by counting the number of occurrences of these visual words in each image. This representation allows 
                us to create a statistical model to classify images as either cats or dogs. We have chosen a Support Vector Machine (SVM) as our classifier due to its strong performance in binary classification settings. 
            </p>

            <h3 className='dark:text-white'><b>Clustering Features Together</b></h3>
            <p className='dark:text-white'>We use the terms "clusters" and "words" interchangeably because they are conceptually equivalent in this 
                context. After extracting all features from every image in our training set, we organize them into different 
                clusters by selecting centroids using K-means clustering. These centroids represent the visual words in our 
                vocabulary. A feature belongs to a cluster if it is closest to that cluster's centroid. We follow the mathematical 
                equation as such:
            </p>
            <div className="flex flex-col justify-center items-center w-[80vw] dark:text-white">
                <BlockMath math="J = \sum_{i=1}^n \min_{\mu_j \in C} \| x_i - \mu_j \|^2"/>
            </div>
            <p className='dark:text-white'>
                Where <InlineMath math="C" /> is the set of all clusters (centroids), <InlineMath math="x_i" /> is the
                current feature vector that will be assigned to a cluster, <InlineMath math="\mu_j" /> is the current centroid
                of the cluster, and <InlineMath math="n" /> is the total number of features.
            </p>

            <h3 className='dark:text-white'><b>Building the Bag-of-Words Vector (Constructing Our Dictionary)</b></h3>
            <p className='dark:text-white'>
                After clustering, we build the Bag-of-Words vectors for each image. This involves creating a histogram 
                (essentially a dictionary) that counts the number of occurrences of each visual word (cluster) within an image. 
                This encoding simplifies the feature representation of each image and helps in the subsequent classification 
                process by providing a fixed-length feature vector for each image.
            </p>

            <h3 className='dark:text-white'><b>Training and Classifying the Data Using Support Vector Machine (SVM)</b></h3>
            <p className='dark:text-white'>We choose an SVM classifier to create a statistical model for classifying images as cats or dogs. 
                SVMs are well-suited for binary classification tasks. The SVM aims to find the weight 
                vector <InlineMath math="w" /> that maximizes the margin between the two classes. The optimization 
                problem is formulated as:
            </p>
            <div className="flex flex-col justify-center items-center w-[80vw] dark:text-white">
                <BlockMath math="\min_{\mathbf{w}} \|\mathbf{w}\|"/>
            </div>
            <p className='dark:text-white'>subjects to:</p>
            <div className="flex flex-col justify-center items-center w-[80vw] dark:text-white">
                <BlockMath math="y_i (\mathbf{w} \cdot \mathbf{x}_i + b) \geq 1 \quad \text{for all } i=1,...,N"/>
            </div>
            <p className='dark:text-white'>Where <InlineMath math="y_i" /> is the corresponding label, <InlineMath math="b" /> being the bias, <InlineMath math="x_i" /> is the feature vector, and <InlineMath math="i" /> is current 
                index position amongst all of our feature vectors of the training set.</p>

        </section>
        
        
    );
}

export default Implementation;