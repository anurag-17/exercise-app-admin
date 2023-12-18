import React, { useState } from 'react'
import axios from "axios"

export const Upload = () => {
    const [fileData, setFileData] = useState({
        category: '', // Field for category name
        file: {},
        // image: null, // Field for image file
    });

    const formChange = (e) => {
        if (e.target.name === 'file') {
            setFileData({...fileData, file: e.target.files[0]})
            // const selectedFile = e.target.files[0];
    
            // const reader = new FileReader();
            // reader.readAsDataURL(selectedFile);
            // reader.onloadend = () => {
            //     setFileData({ ...fileData, file: reader.result, fileName: selectedFile.name });
            // };
        } else {
            setFileData({ ...fileData, [e.target.name]: e.target.value });
        }
    };

    const formSubmit = async (e) => {
        e.preventDefault();
            // console.log(fileData)
        try {
            const response = await axios.post('api/auth/uploadImage', fileData, {
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthcnRpa0BnbWFpbC5jb20iLCJpYXQiOjE3MDI0NjgwMzgsImV4cCI6MTcwMjQ3MTYzOH0.3C3YED-ZosgjD0e1Y323eYyVa_BDFpEmKNenz6X68MQ",
                    'Content-Type': 'multipart/form-data',
                },
            });

            // console.log('Category added:', response.data);
        } catch (error) {
            console.error('Error adding category:', error.response.data);
        }
    };


    return (
        <form onSubmit={formSubmit}>
            <input
                type="text"
                name="category"
                value={fileData.category}
                onChange={formChange}
                placeholder="Category Name"
            />
            <input type="file" name="file" onChange={formChange} />
            <button type="submit">Submit</button>
        </form>
    );

}
