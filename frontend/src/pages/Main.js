import { useMemo, useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';

function Main(props) {
    const {
        acceptedFiles, 
        fileRejections, 
        isFocused,
        isDragAccept,
        isDragReject,
        getRootProps, 
        getInputProps
    } = useDropzone({ 
        accept: {
            'image/jpg': [],
            'image/jpeg': [],
            'image/png': [],
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            if (file) {
                const previewUrl = URL.createObjectURL(file);
                setImagePreviewUrl(previewUrl);
                setSelectedFile(file)
            }
        }
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [bow, setBOW] = useState('');
    const [cnn, setCNN] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = async () => {
        if (!selectedFile) {
          setError('No file selected.');
          return;
        }
    
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
          const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          
          setResult(<div>
                        <p className="mt-2">BoW Model: It's a <b className='text-green-500'>{response.data.bow}</b>!</p>
                        <p className="mt-2">Neural Network Model: It's a <b className='text-green-500'>{response.data.cnn}</b>!</p>
                    </div>);
          
        } catch (err) {
          console.error('Error uploading the file:', err);
          setError('Error uploading the file.');
        }
      };

    // const acceptedFileItems = acceptedFiles.map(file => (
    //     <li key={file.path}>
    //       {file.path} - {file.size} bytes
    //     </li>
    //   ));
    
    // const failedFileItems = fileRejections.map(({ file, errors }) => (
    // <li key={file.path}>
    //     {file.path} - {file.size} bytes
    //     <ul>
    //     {errors.map(e => (
    //         <li key={e.code}>{e.message}</li>
    //     ))}
    //     </ul>
    // </li>
    // ));

    const dynamicClassNames = useMemo(() => ({
        borderColor: isDragAccept ? 'border-green-500' : 
                     isDragReject ? 'border-red-500' : 
                     isFocused ? 'border-blue-500' : 'border-[#B0ADAD]',
    }), [isFocused, isDragAccept, isDragReject]);


    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    return (
       <section className="flex flex-col justify-center items-center m-2">
            <h1 className="m-2">Upload Your Pet Here!</h1>
            {imagePreviewUrl ? (
                <div className="preview flex flex-col justify-center items-center">
                    <img src={imagePreviewUrl} onClick={() => setImagePreviewUrl('')} alt="Preview" className="max-w-[80vw] max-h-[30vh] rounded-lg transition duration-300 ease-in-out hover:brightness-75 cursor-pointer" />
                    <div className="transition duration-300 ease-in-out m-0 p-0">
                        <p className='m-0 p-0'>Hate this pet? No worries! Click here to replace your disgusting furry friend.</p>
                    </div>
                    <button onClick={handleSubmit} className="mt-4 p-2 bg-blue-500 text-white rounded">
                        Classify Image
                    </button>
                    { error ? <p className="mt-2 text-red-500">{error}</p> : result }

 
                             
                </div>
            ) : (
                <div {...getRootProps({
                    className: `border-dashed border-2 ${dynamicClassNames.borderColor} m-2 flex flex-col justify-center items-center w-[80vw] h-[30vh] bg-[#F5F3F3] rounded-lg dropzone`
                })}>
                    <input {...getInputProps()} />
                    <p className="text-[#B0ADAD]">Drag 'n' drop or click to select your Pet!</p>
                    <em className="text-[#B0ADAD]">Only *.jpg, *.jpeg, and *.png images will be accepted :)</em>
                </div>
            )}
       </section>  
    );
}

export default Main;
