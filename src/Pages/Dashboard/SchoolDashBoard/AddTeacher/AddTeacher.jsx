import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { api } from '../../../../api';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import userLogo from '../../../../assets/images/upload.png'
import { toast } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import ImageCropper from '../../../../common/ImageCropper';
import { fetchData } from '../../../../redux/Features/LanguagesSlice/languagesSlice';
import Heading from '../../../../common/Heading'
import Tooltip from '@mui/material/Tooltip';
import CryptoJS from 'crypto-js';
import ValidateEmail from '../../../../Helper/EmailValidator';
import { setLoader } from '../../../../redux/Features/Loader/loaderSlice';
const AddTeacher = () => {
    const dispatch = useDispatch();
    const { details } = useSelector((state) => state.languagesDetails);
    const [image, setimage] = useState(null);
    const [croppedImage, setcroppedImage] = useState(null);
    const getCroppedImg = (param) => {
        setcroppedImage(param);
    };
    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    const [formData, setformData] = useState({
        school_id: '',
        teacher_name: '',
        teacher_email: '',
        age: '',
        teacher_image: '',
        phone_no: '',
        language_class: '',
        gender: ''
    });

    const handleFileChange = (event) => {
        setimage(URL.createObjectURL(event.target.files[0]));
    };


    const validate = () => {
        if (croppedImage === '') {
            toast.info("Teacher Image is Required!");
            return false
        } else if (formData.teacher_name.length < 3) {
            toast.info("Teacher Name Minimum Requires 3 Letter!");
            return false
        } else if (!ValidateEmail(formData.teacher_email)) {
            toast.info("Please Enter Valid Email!");
            return false
        } else if (formData.teacher_email === '') {
            toast.info("Teacher Email is Required!");
            return false
        } else if (formData.age === '') {
            toast.info("Teacher Age Minimum is Required!");
            return false
        }
        else if (formData.age < 3 || formData.age > 99) {
            toast.info("Teacher Age is Invalid");
            return false
        } else if (formData.phone_no.length < 13) {
            toast.info("Teacher Phone Number is Required! (Minimum 13)");
            return false
        } else if (formData.gender === '') {
            toast.info("Please Choose Gender of the Teacher!");
            return false
        } else if (formData.language_class === '') {
            toast.info("Please Select Language!");
            return false
        } else {
            return true
        }
    }
    const addData = () => {
        const rawData2 = localStorage.getItem('encrypted_data')
        const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
        const parsedData = JSON.parse(decryptedData);

        if (validate()) {
            dispatch(setLoader(true));

            axios.post(`${api}add-teacher`, {
                school_id: parsedData.id,
                teacher_image: croppedImage,
                teacher_name: formData.teacher_name,
                teacher_email: formData.teacher_email,
                age: formData.age,
                phone_no: formData.phone_no,
                language_class: formData.language_class,
                gender: formData.gender
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).then((res) => {
                dispatch(setLoader(false));
                toast.success(res.data.message);
                setcroppedImage(null);
                setformData({
                    school_id: '',
                    teacher_name: '',
                    teacher_email: '',
                    age: '',
                    teacher_image: '',
                    phone_no: '',
                    language_class: '',
                    gender: ''
                })
            }).catch((err) => {
                console.log(err)
                const key = Object.keys(err.response.data.validation_params_error)[0];
                dispatch(setLoader(false));
                toast.error(`err.response.data.validation_params_error.${key}`);
            })
        } else {
            toast.err("Internal Error Occured");
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "age" && value < 100) {
            setformData({ ...formData, [name]: value });
        } else if (name === "phone_no" && value.length < 16) {
            setformData({ ...formData, [name]: value });
        } else if (name !== 'phone_no' && name !== 'age') {
            setformData({ ...formData, [name]: value });
        }
    }
    return (
        <>
            {image &&
                <ImageCropper img={image} getCroppedImg={getCroppedImg} />}
            <Heading heading="Add Teacher" />
            <StyledAddTeacherForm className="text-center mb-2">

                <div className='row m-0'>
                    <div className='col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 '>
                        <div className="bg-mirror rounded-2 p-2 border shadow">

                            {
                                croppedImage ? (
                                    <img width="120px" height="120px" className='rounded-circle border' src={URL.createObjectURL(croppedImage)} alt="..." />
                                ) : (
                                    <img width="120px" height="120px" className='rounded-circle border' src={userLogo} alt="uploaded" />
                                )
                            }
                            <div>
                                <label htmlFor="image-upload" className='edit_btn text-primary'>Add Image</label>
                                <input type="file" id="image-upload" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

                            </div>
                            <div className="row m-0">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                    <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Name" value={formData.teacher_name} name="teacher_name" variant="filled" />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                    <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Email ID" value={formData.teacher_email} name="teacher_email" variant="filled" />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                    <TextField inputProps={{ min: 0 }} onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Age" type="number" value={formData.age} name="age" variant="filled" />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                    <TextField inputProps={{ min: 0 }} onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Phone Number" type="number" value={formData.phone_no} name="phone_no" variant="filled" />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                    <FormControl variant="filled" sx={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={formData.gender}
                                            name="gender"
                                            sx={{ textAlign: "start" }}
                                            onChange={(e) => handleChange(e)}
                                            label="Gender"
                                        >
                                            {/* <MenuItem disabled value="">
                                                <em>None</em>
                                            </MenuItem> */}
                                            <MenuItem value="Male" >Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                            <MenuItem value="Custom">Custom</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                    <FormControl variant="filled" sx={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={formData.language_class}
                                            name="language_class"
                                            sx={{ textAlign: "start" }}
                                            onChange={(e) => handleChange(e)}
                                            label="Language"
                                        >
                                            {/* <MenuItem disabled value="">
                                                <em>None</em>
                                            </MenuItem> */}
                                            {
                                                details.map((data, index) => (
                                                    <MenuItem key={index} value={data.language}>{data.language}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>

                            </div>
                            <Button sx={{ margin: "25px 15px 15px 15px", width: "50%" }} size="large" onClick={() => addData()} variant="outlined" startIcon={<AddIcon />}>
                                Add
                            </Button>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 display-sm-none col-12 text-center'>
                        <div className="p-3 border bg-mirror rounded-4 shadow">
                            {
                                croppedImage ? (
                                    <img width="120px" height="120px" className='rounded-circle border' src={URL.createObjectURL(croppedImage)} alt="..." />
                                ) : (
                                    <img width="120px" height="120px" className='rounded-circle border' src={userLogo} alt="uploaded" />
                                )
                            }
                            <div className='mt-3'>
                                <h4 className='text-truncate'><span className='fw-bolder '></span> <p style={{ maxWidth: "100%" }}>{formData.teacher_name ? formData.teacher_name : <p className='text-muted' >Your Name There</p>}</p></h4>
                                <div className='row m-0 text-start'>
                                    <div className='col-7 mt-3 text-truncate'><span className='fw-bolder' >Email:</span><Tooltip placement="top-start" title={formData.teacher_email}><p style={{ maxWidth: "100%" }}>{formData.teacher_email ? formData.teacher_email : <p className='text-muted text-decoration-underline' >Your Email There</p>}</p></Tooltip> </div>
                                    <div className='col-5 mt-3 text-truncate'><span className='fw-bolder' >Age:</span> <Tooltip placement="top-start" title={formData.age}><p style={{ maxWidth: "100%" }}>{formData.age ? formData.age : <p className='text-muted text-decoration-underline' >Your Age There</p>}</p></Tooltip> </div>
                                    <div className='col-7 mt-3 text-truncate'><span className='fw-bolder' >Phone:</span><Tooltip placement="top-start" title={formData.phone_no}><p style={{ maxWidth: "100%" }}>{formData.phone_no ? formData.phone_no : <p className='text-muted text-decoration-underline' >Your Phone No. There</p>}</p></Tooltip></div>
                                    <div className='col-5 mt-3 text-truncate'><span className='fw-bolder' >Gender: </span><Tooltip placement="top-start" title={formData.gender}><p style={{ maxWidth: "100%" }}>{formData.gender ? formData.gender : <p className='text-muted text-decoration-underline' >Your Gender There</p>}</p></Tooltip></div>
                                    <div className='col-7 mt-3 text-truncate'><span className='fw-bolder' >Language:</span><Tooltip placement="top-start" title={formData.language_class}><p style={{ maxWidth: "100%" }}>{formData.language_class ? formData.language_class : <p className='text-muted text-decoration-underline' >Your Language There</p>}</p></Tooltip></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


            </StyledAddTeacherForm>
        </>
    )
}

export default AddTeacher

const StyledAddTeacherForm = styled.div`
/* padding: 0 280px ;
@media(max-width: 767px){
    padding: 0 20px ;

} */
.edit_btn{
    cursor: pointer;
}
@media(max-width:767px){
    .display-sm-none{
        display: none;
    }
}

`