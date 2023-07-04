import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import Cropper from 'react-easy-crop';

const ImageCropper = ({ img, getCroppedImg }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedImage, setCroppedImage] = useState(null);
    const [show, setshow] = useState(false);

    useEffect(() => {
        img &&
            setshow(true)
    }, [img])


    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        const canvas = document.createElement('canvas');
        const image = new Image();
        image.src = img;
        image.onload = () => {
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );
            const croppedImageDataURL = canvas.toDataURL('image/*');
            setCroppedImage(convertBase64ToFile(croppedImageDataURL));
        };
    }, [img]);

    const convertBase64ToFile = (base64Code) => {
        const base64Data = base64Code.replace(/^data:[a-z]+\/[a-z]+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const fileBlob = new Blob(byteArrays, { type: 'image/png' });
        const file = new File([fileBlob], 'file.png', { type: 'image/png' });
        return file;
    };


    const handleSelect = () => {
        getCroppedImg(croppedImage);
        setshow(false);
    }

    const close_btn = () => {
        // setCroppedImage(null);
        getCroppedImg(null);
        setshow(false);
    }

    return (
        <StyledImageCropper >
            {
                show &&
                <>
                    <div className='parent_div'>
                        <Cropper
                            image={img}
                            crop={crop}
                            zoom={zoom}
                            aspect={3 / 3}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        >
                        </Cropper>
                        <Button endIcon={<Close />} sx={{ position: "absolute", right: "0" }} variant='contained' onClick={close_btn}>Close</Button>
                        <Button className='ok-button' variant='contained' onClick={handleSelect}>Crop</Button>
                    </div>
                </>

            }
        </StyledImageCropper>
    );
};

export default ImageCropper;


const StyledImageCropper = styled.div`
    overflow-y: hidden !important;
    overflow-x: hidden !important;
    .parent_div{
        top:0;
        left: 0;
        position: absolute;
        overflow-y: hidden !important;
        overflow-x: hidden !important;
        width: 100%;
        z-index: 1500;
        height: 100vh;
        background-color: rgb(0,0,0,0.7); /* Adjust the maximum width as needed */
}
    .reactEasyCrop_Container  {
        margin: auto;
        height: 50vh !important;
        width: 50% !important;
        /* background-color: rgb(0,0,0,0.3); */
        padding: 0 !important;
        z-index: 1;
    }
    .reactEasyCrop_Image {
       
    }
    .ok-button {
        position: absolute;
        text-transform: capitalize;
        left:40%;
        top:74%;
        width:20vw;
        margin-top: 10px;
        padding: 10px 20px;
        background-color: #4caf50;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
    }

    .ok-button:hover {
        background-color: #45a049;
    }
    
    .ok-button:active {
        background-color: #3e8e41;
    }
    
`
