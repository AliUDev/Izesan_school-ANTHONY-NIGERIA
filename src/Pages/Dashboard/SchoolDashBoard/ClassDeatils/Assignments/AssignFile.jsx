import axios from 'axios'
import React, { useState } from 'react'
import { setLoader } from '../../../../../redux/Features/Loader/loaderSlice'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import { api } from '../../../../../api'
import {  points } from '../../../../../data.provider';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { class_info } from '../../../../../data.provider';
const AssignFile = ({ close, updateState, closeUpdate }) => {
    const params = useParams();
    const dispatch = useDispatch();
    const acceptedFileTypes = ['.docx', '.pdf', '.png', '.PNG', '.jpg', '.webp','.doc','.DOC', '.DOCX', '.PDF', '.JPG', '.WEBP'];
    const errorMessage = 'Invalid file type. Only .docx, .pdf, .png, .jpg, and .webp files are allowed.';
    const [file, setfile] = useState(null)
    const [error, setError] = useState('');
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
    const [formValues, setformValues] = useState({
        class_code: '',
        title: '',
        email_id: '',
        points: '',
        deadline: '',
        attachment: file,
        notification_status: 0
    });
    const submit = () => {
        if (formValues.title === "") {
            toast.info("Please Enter Title")
        } else if (formValues.points === "") {
            toast.info("Please Enter Points")
        } else if (formValues.deadline === "") {
            toast.info("Please Enter Deadline")
        } else if (file === "") {
            toast.info("Please Upload File")
        }
        else {
            const id = class_info().teacher_id;
            var noti = 0;
            if (formValues.notification_status) {
                noti = 1
            }
            dispatch(setLoader(true))
            axios.post(`${api}add-assignment`, {
                class_code: params.id,
                title: formValues.title,
                teacher_id: id,
                points: formValues.points,
                deadline: formValues.deadline,
                attachment: file,
                notification_status: noti
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    dispatch(setLoader(false))

                    toast.success(res.data.message)
                    
                    closeUpdate();
                    close();
                    updateState();
                }).catch((err) => {
                    dispatch(setLoader(false))
                    toast.error("Something Went Wrong")

                    console.log(err)

                })
        }
    }
    const handleChange = (event) => {
        const { name, value, type, checked, files } = event.target;
        setformValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
        });
    };

    return (
        <div style={{ zIndex: "0!important" }}>
            <h3 className="text-center text-success mb-4">Assign File Assignment</h3>
            <div className='row m-0'>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                    <TextField
                        className='w-100'
                        type="text"
                        id="filled-basic"
                        label="Enter Topic"
                        name="title"
                        variant="filled"
                        value={formValues.title}
                        onChange={handleChange}
                    />
                </div>

                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                    <TextField
                        className='w-100'
                        type="date"
                        focused
                        id="filled-basic"
                        inputProps={{ min: new Date().toISOString().split('T')[0]}}
                        label="Enter Deadline"
                        name="deadline"
                        variant="filled"
                        value={formValues.deadline}
                        onChange={handleChange}
                    />
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                         sx={{width:"100%"}} 
                            inputFormat="MM/DD/YYYY"
                            value={formValues.deadline}
                            disablePast={true}
                            onChange={(e) => setformValues({ ...formValues, deadline: e })}
                            renderInput={(params) =>
                                <TextField variant='filled' sx={{width:"100%"}} {...params} />}

                        />
                    </LocalizationProvider> */}
                </div>

                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                    <FormControl variant="filled" sx={{ width: "100%" }}>
                        <InputLabel id="demo-simple-select-standard-label">Points</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={formValues.points}
                            name="points"
                            sx={{ textAlign: "start" }}
                            onChange={handleChange}
                            label="Language"
                        >
                            <MenuItem disabled value="">
                                <em>None</em>
                            </MenuItem>
                            {points().map((data) => (
                                <MenuItem key={data} value={data}>
                                    {data}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                    <TextField
                        focused
                        className='w-100'
                        type="file"
                        id="filled-basic"
                        label="Attach File"
                        name="attachment"
                        variant="filled"
                        accept={acceptedFileTypes.join(',')}
                        onChange={handleFileSelect}
                        inputProps={{ maxFileSize: 5 * 1024 * 1024 }}
                    />
                      <label htmlFor="file-input">
      {error && <Typography variant="caption" color="error">{error}</Typography>}
    </label>
                </div>

                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultValue="0" />}
                            label="Notification"
                            name="notification_status"
                            onChange={handleChange}
                        />
                    </FormGroup>
                </div>
                <Button onClick={submit} variant="outlined" > Submit</Button>

            </div>

        </div>
    )
}

export default AssignFile