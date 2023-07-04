import axios from 'axios'
import React, { useState, useMemo, useEffect } from 'react'
import { api } from '../../../../../api'
import { useParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { setLoader } from '../../../../../redux/Features/Loader/loaderSlice';
import { Button, Checkbox, FormControl, MenuItem, Select, TextField, Typography} from '@mui/material';
import Stepper1 from '../../../../../common/Stepper1'
import { chaptersList, class_info, dataProvider } from '../../../../../data.provider';
import chapters_img from '../../../../../assets/images/chapters.png'
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { formatDate } from '../../../../../Helper/DateProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch } from 'react-redux';



const AddClassWork = ({ close, callFunc }) => {
    const param = useParams();
    const acceptedFileTypes = ['.docx', '.pdf', '.png', '.PNG', '.jpg', '.webp','.doc','.DOC', '.DOCX', '.PDF', '.JPG', '.WEBP'];
const errorMessage = 'Invalid file type. Only .docx, .pdf, .png, .jpg, and .webp files are allowed.';
const [error, setError] = useState('');
    const dispatch = useDispatch();
    const [topic, settopic] = useState('');
    const [file, setfile] = useState(null);
    const handleClose = () => close(true);
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
          const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
          if (acceptedFileTypes.includes(fileExtension)) {
            setfile(file);
            setError('');
          } else {
            setfile(null);
            setError(errorMessage);
          }
        }
      };
    const addClassWork = () => {
        if (topic === "") {
            toast.info("Class Topic is Required")
        } else if (file === "" || file === null) {
            toast.info("Attachment is Required")
        }
        else {
            dispatch(setLoader(true))
            axios.post(`${api}add-classwork`, {
                class_code: param.id,
                topic: topic,
                image: file
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then((res) => {
                dispatch(setLoader(false))
                toast.success(res.data.message);
                close();
                callFunc();
            }).catch((err) => {
                dispatch(setLoader(false))
                console.log(err)
                toast.error("This file cannot be accepted");
            })
        }
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose2 = () => setOpen(false);
    const [AssignWork, setAssignWork] = useState(false)
    const [activeStepper, setactiveStepper] = useState(0);
    const stepperArr = [
        'Select Modules',
        'Give Information',
    ]
    const [checkedItems, setCheckedItems] = useState([]);

    const handleCheckboxChange = (event) => {
        const index = parseInt(event);
        if (checkedItems.includes(index)) {
            setCheckedItems(checkedItems.filter(item => item !== index));
        } else {
            setCheckedItems([...checkedItems, index]);
        }
    };
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
        opacity: 1,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: screenWidth < 768 ? "96%" : '80%',
        bgcolor: 'background.paper',
        borderRadius: "20px",
        overflowY: "scroll",
        maxHeight: '90vh',
        height: "500px",
        // minHeight: '50vh',
        boxShadow: 24,
        p: 4,
        '& .MuiBackdrop-root': {
            backgroundColor: 'transparent',
        },
    };

    const [form, setform] = useState({
        module_name: 'Module ClassWork',
        language: '',
        assigned_by: '',
        class_code: '',
        deadline: '',
        time_limit: '0',
        revision: '0',
        assigned_at: '',
        selected_modules: '',
        notification_status: '',
        attempt_type: '0'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setform(prev => ({ ...prev, [name]: value }))
    }

    const [checkBoxStates, setcheckBoxStates] = useState({
        attempts: false,
        notification_status: false
    });
    const handleformCheckboxChange = (event) => {
        const name = event.target.name;
        const value = event.target.checked;
        setcheckBoxStates((prevState) => ({ ...prevState, [name]: value }));
    };


    const submit = () => {
        const classInfo = class_info();
        const user_info = dataProvider();
        if (form.module_name.length < 3) {
            toast.warn("Minium Length of Name is Three")
        } else if (form.revision < 1) {
            toast.warn("Invilad No of Attempts")
        } else if (form.time_limit < 1) {
            toast.warn("Invalid Time")
        } else if (form.deadline === "") {
            toast.warn("Deadline is Required")
        } else {
            dispatch(setLoader(true))
            axios.post(`${api}add-classwork-module-assignment`, {
                module_name: form.module_name,
                language: classInfo.language,
                assigned_by: user_info.teacher_email,
                class_code: classInfo.class_code,
                deadline: formatDate(form.deadline),
                time_limit: form.time_limit,
                revision: form.revision,
                assigned_at: Date.now(),
                selected_modules: checkedItems.toString(),
                notification_status: checkBoxStates.notification_status ? "1" : "0",
                attempt_type: form.attempt_type
            }).then((res) => {
                if (res.data.code === 200) {
                    dispatch(setLoader(false))
                    toast.info(res.data.message);
                    handleClose2()
                    close();
                    callFunc();
                }
            }).catch((err) => {
                dispatch(setLoader(false))

                toast.error(err.message);
                console.log(err)
            })
        }
    }




    const assignClassModuleModal = () => {
        return (
            <Modal
                open={open}
                sx={style}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box >
                    <div className="row">
                    <div className="col-3">
                    <ArrowBackIcon onClick={handleClose2} className='cursor-pointer fs-3 ' />
                    </div>
                    <div className='col-6'>
                    <h3 className='mb-3 text-center'>Select Modules</h3>
                    </div>
                    <div className='col-3 d-flex justify-content-end'>
                    <CancelIcon  className='cursor-pointer' onClick={handleClose} />
                    </div>
                    </div>
                    <StyledModuleAssignment>
                        {
                            activeStepper === 0 &&
                            <div className="row">
                                {chaptersList.map((data, index) => (
                                    <div className='col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12  mb-3 px-2 m-0' key={index} onClick={() => handleCheckboxChange(index)} >
                                        <div className={`row border m-0 rounded option ${checkedItems.includes(index) ? 'bg-success text-light' : ''}`} onClick={() => handleCheckboxChange(index)}>
                                            <div className='col-5 div_bg' style={{ backgroundImage: `url(${chapters_img})` }}>
                                            </div>
                                            <div className='col-7'>
                                                <p className="fw-bolder p-0 my-0 pt-2">{data}</p>
                                                <p className='p-0 m-0'>Lesson No {index + 1}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                        {
                            activeStepper === 1 &&
                            <div className="row">
                                <h3 className='my-3'>Fill Form:</h3>
                                <div className='row m-0'>
                                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                                        <TextField
                                            className='w-100'
                                            min={new Date()}
                                            type="date"
                                            id="filled-basic"
                                            label="Enter Deadline"
                                            name="deadline"
                                            variant="filled"
                                            inputProps={{ min: new Date().toISOString().split('T')[0]}}
                                            focused
                                            value={form.deadline}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                                        <TextField
                                            className='w-100'
                                            type="number"
                                            id="filled-basic"
                                            label="Enter Time in Minutes"
                                            name="time_limit"
                                            variant="filled"
                                            value={form.time_limit}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'></div> */}
                                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                                        <Checkbox
                                            name="attempts"
                                            checked={checkBoxStates.attempts}
                                            onChange={handleformCheckboxChange}
                                        />Attempts
                                    </div>
                                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                                        <Checkbox
                                            name="notification_status"
                                            checked={checkBoxStates.notification_status}
                                            onChange={handleformCheckboxChange}
                                        />Notification
                                    </div>

                                    {
                                        checkBoxStates.attempts &&
                                        <>
                                            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                                                <FormControl fullWidth>
                                                    <Select
                                                        required
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        name='attempt_type'
                                                        onChange={handleChange}
                                                        value={form.attempt_type}
                                                        variant="filled"
                                                        label="Kundengruppe"
                                                    >
                                                        <MenuItem value='0'>Per Question</MenuItem>
                                                        <MenuItem value='1'>Per Module</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                                                <TextField
                                                    className='w-100'
                                                    type="number"
                                                    id="filled-basic"
                                                    label="No of Attempts"
                                                    name="revision"
                                                    variant="filled"
                                                    value={form.revision}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </>
                                    }



                                </div>
                            </div>

                        }
                        <div className='text-center row my-4'>
                            <div className='col-6' sx={{ innerWidth: "10px" }} ><Button variant='outlined' disabled={activeStepper < 1} onClick={() => setactiveStepper(activeStepper - 1)} >Previous</Button></div>
                            {
                                activeStepper === 1 ?
                                    (
                                        <div className='col-6' sx={{ innerWidth: "10px" }} ><Button onClick={submit} variant='outlined' disabled={form.deadline === ''} >Create Assignment</Button></div>
                                    ) : (
                                        <div className='col-6' sx={{ innerWidth: "10px" }} ><Button disabled={checkedItems.length < 1} onClick={() => setactiveStepper(activeStepper + 1)} variant='outlined' >Next</Button></div>
                                    )
                            }
                        </div>
                        <Stepper1 arr={stepperArr} activeValue={activeStepper} />
                    </StyledModuleAssignment>
                </Box>
            </Modal>
        )

    }
    return (
        <>
            <Wrapper>
                <div>
                    <CancelIcon style={{ marginTop: "30px", marginRight: "10px" }} className='cursor-pointer position-absolute end-0 top-0' onClick={handleClose} />
                    {!AssignWork &&
                        <div>
                            {assignClassModuleModal()}
                            <h3 className='p-1'>Create Class Work</h3>
                            <div className='row m-0'>

                                <Button onClick={() => setAssignWork(true)} sx={{ marginTop: "15px", width: '100%' }} size="large" variant="outlined" startIcon={<AddIcon />}>
                                    Assign Class Work
                                </Button>
                                <h5 className='text-center my-2'>or</h5>
                                <Button onClick={handleOpen} sx={{ width: '100%' }} size="large" variant="outlined" startIcon={<AddIcon />}>
                                    Assign Module
                                </Button>
                            </div>
                        </div>}
                    {
                        AssignWork &&
                        <>
                            <ArrowBackIcon onClick={() => setAssignWork(false)} className='cursor-pointer' />
                            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 px-0 px-md-1 mt-3 mb-3'>
                                <TextField className='w-100' focused onChange={(e) => settopic(e.target.value)} value={topic} type="text" id="filled-basic" label="Enter Topic" inputProps={{ maxLength: 50 }} name="topic" variant="filled" />
                            </div>
                            <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 px-0 px-md-1 mb-3'>
                            <TextField
      type="file"
      id="file-input"
      className='w-100'
      variant="filled" 
      label="Add Attachment"
      focused 
      accept={acceptedFileTypes.join(',')}
      onChange={handleFileSelect}
    />
    <label htmlFor="file-input">
      {error && <Typography variant="caption" color="error">{error}</Typography>}
    </label>
                               
                                <div>
    
  </div>
                            </div>
                            <Button onClick={addClassWork} sx={{ width: '100%' }} size="large" variant="outlined" startIcon={<AddIcon />}>
                                Add Class Work
                            </Button>
                        </>
                    }
                </div>
            </Wrapper>
        </>
    )
}

export default AddClassWork
const Wrapper = styled.div`
`
const StyledModuleAssignment = styled.div`

.option{
  height: 85px ;
  
}
.option:hover{
  transform: scale(1.01);
  cursor: pointer;
  box-shadow: 0 2px 3px 0px rgb(0 0 0 / 41%);
}
.div_bg {
  background-image: url('path/to/image.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

`