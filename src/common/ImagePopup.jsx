import React from 'react';
import Box from '@mui/material/Box';

import { Close } from '@mui/icons-material';

import Modal from '@mui/material/Modal';
const ImagePopup = ({ imageUrl, onClose, open }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        bgcolor: 'background.paper',
        borderRadius: "20px",
        overflowY: "scroll",
        height: "70vh",
        boxShadow: 24,
        p: 4,
    };
    const img = {
        width: '100%',
        height: "auto",
        padding: "2px 10px",
    };
    return (
        <>
            <Modal
                sx={{ zIndex: "0" }}
                onClose={onClose}
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="d-flex justify-content-center">
                    <Close onClick={onClose} className="position-absolute top-0 end-0 m-2 pt-1 cursor-pointer" />

                    <img style={img} src={imageUrl} alt="..."></img>
                </Box>
            </Modal>
        </>
    );
};

export default ImagePopup;