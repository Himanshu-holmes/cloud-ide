import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '../constant';
import fs from 'fs';


// (async function() {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: CLOUDINARY_CLOUD_NAME, 
//         api_key: CLOUDINARY_API_KEY, 
//         api_secret: CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
//     });


    
//     // Upload an image
//     //  const uploadResult = await cloudinary.uploader
//     //    .upload(
//     //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//     //            public_id: 'shoes',
//     //        }
//     //    )
//     //    .catch((error) => {
//     //        console.log(error);
//     //    });
    
//     // console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     // const optimizeUrl = cloudinary.url('shoes', {
//     //     fetch_format: 'auto',
//     //     quality: 'auto'
//     // });
    
//     // console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     // const autoCropUrl = cloudinary.url('shoes', {
//     //     crop: 'auto',
//     //     gravity: 'auto',
//     //     width: 500,
//     //     height: 500,
//     // });
    
//     // console.log(autoCropUrl);    
// })();

cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(localFilePath)return null;
        // upload file to cloudinary
     const response =  await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
            
        })
        // file has been uploaded successfully
        console.log("File uploaded on cloudinary",response.url); 
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the file if any error occurs
        return null;
    }
}

module.exports = uploadOnCloudinary;