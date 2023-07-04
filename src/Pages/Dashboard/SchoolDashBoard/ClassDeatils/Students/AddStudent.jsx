import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import axios from 'axios';
import { setLoader } from '../../../../../redux/Features/Loader/loaderSlice';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { api } from '../../../../../api';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import CryptoJS from 'crypto-js';
import * as EmailValidator from 'email-validator';

const AddStudent = ({ close, getAgain }) => {
    const param = useParams();
    const dispatch = useDispatch();
    const [addStudentEmail, setaddStudentEmail] = useState('');
    const handleClose = ()=>close(true)
    const submit = () => {
        if (addStudentEmail.length > 0) {
            if (EmailValidator.validate(addStudentEmail)) {
                dispatch(setLoader(true))
                axios.post(`${api}add-student-directly`, {
                    class_code: param.id,
                    participants: addStudentEmail
                })
                    .then((res) => {
                        close();
                        if (res.data.code !== 401) {
                            getAgain();
                            dispatch(setLoader(false))
                            toast.info(res.data.message);
                        } else {
                dispatch(setLoader(false))
                            toast.error(res.data.message);
                        }
                    }).catch((err) => {
                dispatch(setLoader(false))

                        console.log(err)
                    })
            } else {
                toast.error("Please enter correct email address");
            }
        } else {
            toast.info("Please add email address");
        }

    }
    const [condition, setcondition] = useState(false);

    const [classInfo, setclassInfo] = useState({});
    useEffect(() => {
        const rawData2 = localStorage.getItem('class_info')
        const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
        const parsedData = JSON.parse(decryptedData);
        setclassInfo(parsedData);
    }, [])
    const copyFunction = async (param, type) => {
        let text = param;
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'code') {
                toast.success('Code copied to clipboard');
            } else {
                toast.success('Link copied to clipboard');
            }
        } catch (err) {
            console.error('Failed to copy: ', err);
        }

    }
    return (
        <Wrapper>
            <h4>Add Student</h4>
            <CancelIcon style={{marginTop:"30px", marginRight:"10px"}} className='cursor-pointer position-absolute end-0 top-0' onClick={handleClose}/>
            <div className="row mb-3 fw-bolder">
                <div className={`col-6 text-center  fs-5 ${!condition ? 'py-1 bg-warning rounded' : ''}`} onClick={() => setcondition(false)}><span className="cursor-pointer">Send Invite</span> </div>
                <div className={`col-6 text-center  fs-5 ${condition ? 'py-1 bg-warning rounded' : ''}`} onClick={() => setcondition(true)}><span className="cursor-pointer">Add Directly</span></div>
            </div>
            {condition ? (
                <div className="row m-0 text-center" >
                    <TextField focused inputProps={{maxLength:80}} onChange={(e) => setaddStudentEmail(e.target.value)} value={addStudentEmail} type="email" id="filled-basic" label="Enter Student Email" name="topic" variant="filled" />
                    <Button onClick={submit} sx={{ marginTop: "15px", width: '100%' }} size="large" variant="outlined" startIcon={<AddIcon />}>
                        Add
                    </Button>
                </div>
            ) : (
                <div className='row'>
                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                        <h5>Classroom code:</h5>
                        <div className='bg-light border rounded row pt-3 mt-1'>
                            <div className='col-6'><p>{classInfo.class_code}</p></div>
                            <div className='col-6 text-end'><p className='text-warning fw-bolder cursor-pointer' onClick={() => copyFunction(classInfo.class_code, 'code')} >Copy Code</p></div>
                        </div>
                    </div>
                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
                        <h5>Classroom link:</h5>
                        <div className='bg-light border rounded row pt-3 mt-1'>
                            <div className='col-6'><p>{classInfo.class_link}</p></div>
                            <div className='col-6 text-end'><p className='text-warning fw-bolder cursor-pointer' onClick={() => copyFunction(classInfo.class_link, 'link')} >Copy Link</p></div>
                        </div>
                    </div>
                    <Button sx={{ marginTop: "15px", width: '100%' }} size="large" variant="outlined" onClick={close} >Done</Button>
                </div>
            )
            }
        </Wrapper>
    )
}
const Wrapper= styled.div`
.css-6f6ff7-MuiModal-root-MuiPopover-root-MuiMenu-root, .css-147uusp, .css-12y4yjv-MuiModal-root-MuiDrawer-root, .css-79ws1d-MuiModal-root{
    z-index:0!important;
}`
export default AddStudent