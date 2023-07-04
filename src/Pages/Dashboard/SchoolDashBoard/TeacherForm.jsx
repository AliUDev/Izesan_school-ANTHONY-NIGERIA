import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { api, storageApi } from '../../../api';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { setLoader } from '../../../redux/Features/Loader/loaderSlice';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from '../../../redux/Features/LanguagesSlice/languagesSlice';
import Swal from 'sweetalert2';
import ImagePopup from '../../../common/ImagePopup';
import EditIcon from '@mui/icons-material/Edit';
import ClassesList from './ClassesList/ClassesList';
import CryptoJS from 'crypto-js';
import PasswordIcon from '@mui/icons-material/Password';
import Tooltip from '@mui/material/Tooltip';
import { encryptedData } from '../../../data.provider';
const TeacherForm = (props) => {
    const dispatch = useDispatch();
    const { details } = useSelector((state) => state.languagesDetails);
    const [editMode, seteditMode] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageClick = (param) => {
      setSelectedImage(param);
      handleOpenPopUp();
    };
   const handleOpenPopUp  = () => setShowPopup(true);
    const handleClosePopup = () => {
      setShowPopup(false);
      setSelectedImage(null);
    };
    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    const data = props?.data;
    const [formData, setformData] = useState({
        id: data.id,
        teacher_name: data.teacher_name,
        age: data.age,
        teacher_image: data.teacher_image,
        phone_no: data.phone_no,
        language_class: data.language_class,
        gender: data.gender
    });

    const handleFileChange = (event) => {
        setformData({ ...formData, teacher_image: event.target.files[0] })
    };

    const deleteTeacher = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const rawData2 = localStorage.getItem('encrypted_data')
                const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
                const parsedData = JSON.parse(decryptedData);
                const email = props.data.teacher_email;
                axios.post(`${api}delete-teacher`, {
                    teacher_email: email,
                    school_id: parsedData.id
                }).then((res) => {
                    props.liftingState(false);
                    // toast.success(res.data.message);
                    Swal.fire(
                        'Deleted!',
                        'Teacher has been deleted.',
                        'success'
                    )
                }).catch((err) => {
                    console.log(err)
                    toast.error(err.data.message);
                })

            }
        })
    }


    const editData = () => {
        if (formData.teacher_image === "") {
            toast.info("Image is Required")
        } else if (formData.teacher_name === "") {
            toast.info("Name is Required")

        } else if (formData.age === "") {
            toast.info("Age is Required")

        } else if (formData.age < 3 || formData.age > 99) {
            toast.info("Age Invalid")

        } else if (formData.teacher_name.length < 3) {
            toast.info("Name Minium Length Requires 3 Letters")
        } else if (formData.phone_no.length < 13) {
            toast.info("Phone Number is Required")
        } else if (formData.gender === "") {
            toast.info("Gender is Required")

        }
        else {
            dispatch(setLoader(true))
            axios.post(`${api}edit-teacher`, {
                id: data.id,
                teacher_image: formData.teacher_image,
                teacher_name: formData.teacher_name,
                age: formData.age,
                phone_no: formData.phone_no,
                language_class: formData.language_class,
                gender: formData.gender
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).then((res) => {
            dispatch(setLoader(false))
                props.liftingState(false);
                toast.success(res.data.message);
            }).catch((err) => {
            dispatch(setLoader(false))

                console.log(err)
                toast.error(err.data.message);
            })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "age" && value.length <= 2) {
            setformData({ ...formData, [name]: value });

        } else if (name === "phone_no" && value.length <= 15) {
            setformData({ ...formData, [name]: value });

        } else if (name !== "phone_no" && name !== "age") {
            setformData({ ...formData, [name]: value });

        }
    }

    const [editPasswordMode, seteditPasswordMode] = useState(false);

    const [passCodes, setPassCodes] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleChangePassCode = (e) => {
        const { name, value } = e.target;
        if (name === "password" && value.length <=6){
        setPassCodes({ ...passCodes, [name]: value });

        } else if ( name === "comfirmpassword" && value.length <=6){
        setPassCodes({ ...passCodes, [name]: value });

        } else if (name !== "comfirmpassowrd" || name !== "password"){
            setPassCodes({ ...passCodes, [name]: value });

        }
    }
    const editPassword = () => {
        if ((passCodes.password.length < 6) || (passCodes.confirmPassword.length < 6)) {
            toast.info("Password or confirm password should contain 6 letters")
        }  else if (passCodes.password !== passCodes.confirmPassword) {
            toast.info("Password do not match confirm password!")
        } else if(passCodes.password === data.teacher_access_code || passCodes.confirmPassword === data.teacher_access_code){
            toast.error("Your current password can't be new password!")
          }else {
            dispatch(setLoader(true))
            axios.post(`${api}update-teacher-password`, {
                teacher_email: props.data.teacher_email,
                school_id: encryptedData().id,
                old_access_code: data.teacher_access_code,
                teacher_access_code: passCodes.password
            }).then((res) => {
            dispatch(setLoader(false))
                toast.success("Password Updated")
            }).catch((err) => {
            dispatch(setLoader(false))

                console.log(err)
            })

        }
    }

    return (
        <StyledTeacherForm className="text-center">
            <div className='position-absolute pointer_event' onClick={() => props.liftingState(false)}><CancelIcon /></div>
            <div class="position-absolute top-0 p-4 mt-2 end-0 ">
                {!editMode && <Tooltip title="Change Passcode"><PasswordIcon className='cursor-pointer' onClick={() => seteditPasswordMode(!editPasswordMode)} /></Tooltip>}
                {!editPasswordMode &&
                    <span>
                        {!editMode && <Tooltip title="Delete Teacher"><DeleteIcon className='cursor-pointer mx-3 text-danger pointer_event' onClick={() => deleteTeacher()} /></Tooltip>}
                        <Tooltip title="Edit Info"><EditIcon className='cursor-pointer pointer_event text-primary' onClick={() => seteditMode(!editMode)} /></Tooltip>
                    </span>
                }
            </div>
            {
                editPasswordMode ? (
                    <div style={{paddingTop:"auto"}}>
                        <h3>Edit PassCode</h3>
                        <div className='d-flex align-items-center justify-content-center editWrapper'>
                        <div className="row m-0 d-flex align-items-center justify-content-center h-100">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-4">
                                <TextField onChange={(e) => handleChangePassCode(e)} sx={{ width: "100%" }} type='text' inputProps={{ maxLength: 6 }} id="filled-basic" label="Enter New Password" value={passCodes.password} name="password" variant="filled" />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-4">
                                <TextField onChange={(e) => handleChangePassCode(e)} sx={{ width: "100%" }} type='text' id="filled-basic" inputProps={{ maxLength: 6 }} label="Enter Confirm Password" value={passCodes.confirmPassword} name="confirmPassword" variant="filled" />
                            </div>
                            <Button sx={{ margin: "15px 15px 0 15px" }} size="large" onClick={() => editPassword()} variant="outlined" startIcon={<UpdateIcon />}>
                                Update Password
                            </Button>
                        </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {
                            data?.teacher_image === formData?.teacher_image ? (
                                <>
                                <img width="120px" height="120px" className='rounded-circle' onClick={()=>handleImageClick(`${storageApi}teacher/${formData.teacher_image}`)} src={`${storageApi}teacher/${formData.teacher_image}`} alt="..." />
                                {
                                    showPopup &&
                                    <ImagePopup imageUrl={selectedImage} onClose={handleClosePopup} open={handleOpenPopUp}/>
                                }
                                </>
                            ) : (
                                <img width="120px" height="120px" className='rounded-circle' src={URL.createObjectURL(formData?.teacher_image)} alt="uploaded" />
                            )
                        }
                        {
                            editMode &&
                            <div>
                                <label htmlFor="image-upload" className='pointer_event text-primary'>Edit</label>
                                <input type="file" id="image-upload" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                            </div>
                        }
                        <div className="row m-0">
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} type='text' inputProps={{ maxLength: 50 }} id="filled-basic" disabled={!editMode} label="Name" value={formData.teacher_name} name="teacher_name" variant="filled" />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Email ID" value={data.teacher_email} disabled variant="filled" />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} type="number" id="filled-basic" disabled={!editMode} inputProps={{
                                    inputMode: 'numeric',
                                    maxLength: 15,
                                }} label="Phone Number" value={formData.phone_no} name="phone_no" variant="filled" />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                <TextField disabled={!editMode} onChange={(e) => handleChange(e)} sx={{ width: "100%" }} type='number' id="filled-basic" label="Age" inputProps={{
                                    inputMode: 'numeric',
                                    maxLength: 2,
                                }} value={formData.age} name="age" variant="filled" />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                <TextField disabled sx={{ width: "100%" }} id="filled-basic" label="Access Code" value={data?.teacher_access_code} name="teacher_access_code" variant="filled" />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                <FormControl variant="filled" sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                                    <Select
                                        disabled={!editMode}
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={formData.gender}
                                        name="gender"
                                        sx={{ textAlign: "start" }}
                                        onChange={(e) => handleChange(e)}
                                        label="Gender"
                                    >
                                        <MenuItem disabled value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Custom">Custom</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                <FormControl variant="filled" sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
                                    <Select
                                        disabled={!editMode}
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={formData.language_class}
                                        name="language_class"
                                        sx={{ textAlign: "start" }}
                                        onChange={(e) => handleChange(e)}
                                        label="Language"
                                    >
                                        <MenuItem disabled value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            details.map((data, index) => (
                                                <MenuItem key={index} value={data.language}>{data.language}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>

                            </div>
                            {
                                editMode &&
                                <Button sx={{ margin: "15px 15px 0 15px" }} size="large" onClick={() => editData()} variant="outlined" startIcon={<UpdateIcon />}>
                                    Update
                                </Button>
                            }
                        </div>

                        {
                            !editMode &&
                            <div>
                                <ClassesList caseType="teacher" email={data.id} id={data.id} type="teacher" />
                            </div>
                        }
                    </>
                )
            }
        </StyledTeacherForm>
    )
}

export default TeacherForm

const StyledTeacherForm = styled.div`
.edit_btn{
    cursor: pointer;
}
.pointer_event:hover{
    cursor: pointer;
    transform: scale(1.1);
}
.editWrapper{
    height: 300px;
    margin: 30px 0;
  }

`