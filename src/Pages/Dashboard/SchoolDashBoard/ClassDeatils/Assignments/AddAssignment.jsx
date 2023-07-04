import React, { useState, useEffect, useMemo } from 'react'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AssignModule from './AssignModule';
import AssignFile from './AssignFile';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignQuiz from './AssignQuiz';
import AssignVideo from './AssignVideo';

const AddAssignment = ({ updateState, closeUpdate }) => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const screenWidth = useMemo(() => {
    return windowWidth;
  }, [windowWidth]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: screenWidth < 768 ? "96%" : '80%',
    bgcolor: 'background.paper',
    borderRadius: "20px",
    overflowY: "scroll",
    maxHeight: '90vh',
    minHeight: '50vh',
    boxShadow: 24,
    p: 4,
  };

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const [open3, setOpen3] = useState(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);

  const [open4, setopen4] = useState(false);
  const handleOpen4 = () => setopen4(true);
  const handleClose4 = () => setopen4(false);

  const btn_data = [
    { name: "Add Module", func: handleOpen1 },
    { name: "Assign File", func: handleOpen2 },
    { name: "Assign Quiz", func: handleOpen3 },
    { name: "Assign Video", func: handleOpen4 },
  ]

  const modal_data = [
    { state: open1, close_func: handleClose1, component: <AssignModule close={handleClose1} updateState={updateState} closeUpdate={closeUpdate} /> },
    { state: open2, close_func: handleClose2, component: <AssignFile close={handleClose2} updateState={updateState} closeUpdate={closeUpdate} /> },
    { state: open3, close_func: handleClose3, component: <AssignQuiz close={handleClose3} updateState={updateState} closeUpdate={closeUpdate} /> },
    { state: open4, close_func: handleClose4, component: <AssignVideo close={handleClose4} updateState={updateState} closeUpdate={closeUpdate} /> },
  ]

  return (
    <div>
      {
        modal_data.map((data, index) => (
          <Modal
            key={index}
            open={data.state}
            onClose={data.close_func}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <CancelIcon className='cursor-pointer position-absolute mt-1' onClick={data.close_func} />
              {data.component}
            </Box>
          </Modal>
        ))
      }
      <div className='row'>
        <div className='col-3'></div>
        <div className='col-6'>
      <h4 className="text-center">Assign Assignment</h4>
      </div>
        <div className='col-3 d-flex justify-content-end'>
          <CancelIcon className="cursor-pointer" onClick={closeUpdate} /></div>
      </div>
      {
        btn_data.map((data, index) => (
          <Button key={index} onClick={data.func} sx={{ marginTop: "15px", width: '100%' }} size="large" variant="outlined" startIcon={<AddIcon />}>
            {data.name}
          </Button>
        ))
      }
    </div>
  )
}

export default AddAssignment