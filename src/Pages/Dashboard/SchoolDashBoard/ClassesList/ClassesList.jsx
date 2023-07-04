import styled from '@emotion/styled';
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bg from '../../../../assets/images/classes_list_bg.png'
import { fetchDataofClasess } from '../../../../redux/Features/ClassesListSlice/classesListSlice';
import Loader2 from '../../../../common/Loader2/Loader2';
import CryptoJS from 'crypto-js';
import { Add, Delete } from '@mui/icons-material';
import { dataProvider } from '../../../../data.provider';
import { setLoader } from '../../../../redux/Features/Loader/loaderSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { api } from '../../../../api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';

const ClassesList = ({ caseType, email, id, type }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { details } = useSelector((state) => state.languagesDetails);
    useEffect(() => {
        dispatch(fetchDataofClasess(caseType, email));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const reduxData1 = useSelector(state => state?.classesListDetails?.allClasses.all_classes);
    const reduxData2 = useSelector(state => state?.classesListDetails?.allClasses.join_classes);
    const loading = useSelector(state => state?.classesListDetails?.isLoading);
    const minorInfo = (param) => {
        console.log(param)
        const obj = {
            id: param.id,
            class_code: param.class_code,
            class_link: param.class_link,
            classroom_name: param.classroom_name,
            language: param.language,
            teacher_id: Number(param.teacher_id)
        }
        const data = JSON.stringify(obj);
        const key = "001";
        const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
        localStorage.setItem('class_info', encryptedData)
    }
    const [windowWidth] = useState(window.innerWidth);

    // const teacherInfoLocally = (params) => {
    //     const { email_id, school_id } = params;
    //     const encryptedData = CryptoJS.AES.encrypt(email_id, '001').toString();
    //     localStorage.setItem("teacher_email", encryptedData);
    //     const object = JSON.stringify({ teacher_email: email, school_id: parseInt(school_id) })
    //     const encryptedData2 = CryptoJS.AES.encrypt(object, '001').toString();
    //     localStorage.setItem('encrypted_data_ts', encryptedData2)
    // }
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [formData, setformData] = useState({
        classroom_name: '',
        language: '',
        email_id: '',
        school_id: ''
    });
    const addClass = async () => {
        if (formData.classroom_name === "") {
            toast.info("Class Name is Required")
        } else if (formData.classroom_name.length < 3 || formData.classroom_name.length > 50) {
            toast.info("Class Name is Invalid")
        } else if (formData.language === "") {
            toast.info("Language is Required")
        }
        else {
            const data = await dataProvider();
            const school_id = await data.school_id;
            const email2 = await data.teacher_email;
            setformData({ email_id: email2, school_id: school_id, classroom_name: formData.classroom_name, language: formData.language });
             dispatch(setLoader(true));
            axios.post(`${api}add-class`, {
                classroom_name: formData.classroom_name,
                language: formData.language,
                teacher_id: id,
                email_id: email2,
                school_id: school_id
            })
                .then((res) => {
             dispatch(setLoader(false));
                    handleClose();
                    // window.location.reload();
                    setformData({
                        classroom_name: '',
                        language: '',
                        email_id: '',
                        school_id: ''
                    })
                    if (res.data.code !== 401) {
                        dispatch(setLoader(false));
                        toast.success(res.data.message);
                        dispatch(fetchDataofClasess(caseType, email))
                    } else {
             dispatch(setLoader(false));
                        toast.error(res.data.message);
                    }
                }).catch((err) => {
             dispatch(setLoader(false));
                    console.log(err)
                })
        }
    }

    const screenWidth = useMemo(() => {
        return windowWidth;
    }, [windowWidth]);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: screenWidth < 768 ? "96%" : '50%',
        bgcolor: 'background.paper',
        borderRadius: "20px",
        overflowY: "scroll",
        height: "auto",
        boxShadow: 24,
        p: 4,
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    }

    const deleteClass = (param, name) => {
        // Defining typeprovider for security check
        Swal.fire({
            title: `Do you really want to delete ${name} class?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`${api}delete-class`, {
                    class_code: param
                }).then((res) => {
                    dispatch(fetchDataofClasess(caseType, email))
                    toast.success(res.data.message);
                    Swal.fire(
                        'Deleted!',
                        'Class has been deleted.',
                        'success'
                    )
                }).catch((err) => {
                    console.log(err)
                    toast.error(err.data.message);
                })

            }
        })
    }

    const [navigationstate, setnavigationstate] = useState(true);


    return (
        <StyledClassesList>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <h4>Create Classroom</h4>
                        <div className="row m-0">
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" inputProps={{ maxLength: 50 }} label="ClassRoom Name" value={formData.classroom_name} name="classroom_name" variant="filled" />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
                                <FormControl variant="filled" sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={formData.language}
                                        name="language"
                                        sx={{ textAlign: "start" }}
                                        onChange={(e) => handleChange(e)}
                                        label="Language"
                                    >
                                        <MenuItem disabled value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            details.map((data) => (
                                                <MenuItem value={data.language}>{data.language}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <Button sx={{ margin: "15px 15px 0 15px", width: '100%' }} onClick={() => addClass()} size="large" variant="outlined" startIcon={<AddIcon />}>
                            Add
                        </Button>
                    </Box>
                </Modal>
            </div>
            {type === "teacher" ?
                (
                    <div className='d-flex aligns-items-center justify-content-between m-2'>
                    <h3 className='text-start m-2'>Classes:</h3>
                         <Button variant='outlined' className='m-2' onClick={handleOpen} >Add Class <Add /></Button>
                    </div>
                ) : ("")
            }


            {!loading && reduxData1.length < 1 && reduxData2.length < 1 &&
                <h4 className='text-center'>No Data Found</h4>
            }
            {
                loading ? (
                    <>
                        <p className='text-center'><Loader2 /></p>
                    </>

                ) : (

                    <>
                        {
                            reduxData1?.map((data, key) => (
                                <div key={key} className='rounded mb-3 parent' style={{ backgroundImage: `url(${bg})` }} onMouseEnter={() => setnavigationstate(true)} onMouseLeave={() => setnavigationstate(false)} onClick={() => navigationstate && (minorInfo(data) + navigate(`/class-details/${data.class_code}`))}  >
                                    <div className='position-absolute end-0 p-2 text-danger delete_btn' ><Delete onMouseEnter={() => setnavigationstate(false)} onClick={() => !navigationstate && deleteClass(data.class_code, data.classroom_name)} /></div>
                                    <h3 className='text-start text-light p-4 text-capitalize'>{data.classroom_name}</h3>
                                    <h4 className='text-start text-light p-1 px-4 text-capitalize'>{data.language}</h4>
                                </div>
                            ))
                        }
                        {
                            reduxData2?.map((data, key) => (
                                <div key={key} className='rounded mb-3 parent' style={{ backgroundImage: `url(${bg})` }} onMouseEnter={() => setnavigationstate(true)} onMouseLeave={() => setnavigationstate(false)} onClick={() => navigationstate && (minorInfo(data) + navigate(`/class-details/${data.class_code}`))} >
                                    <div className='position-absolute end-0 p-2 text-danger delete_btn' ><Delete onMouseEnter={() => setnavigationstate(false)} onClick={() => !navigationstate && deleteClass(data.class_code, data.classroom_name)} /></div>
                                    <h3 className='text-start text-light p-4 text-capitalize'>{data.classroom_name}</h3>
                                    <h4 className='text-start text-light p-1 px-4 text-capitalize'>{data.language}</h4>
                                </div>
                            ))
                        }
                    </>
                )
            }
        </StyledClassesList>
    )
}

export default ClassesList

const StyledClassesList = styled.div`
.parent{
    height: 130px;
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: 0 2px 6px 1px rgb(0,0,0,0.4);
}

.parent:hover{
    transform: scale(0.99);
    cursor: pointer;
    box-shadow: none;
}
.delete_btn{
    margin-right: 35px;
}
.parent:hover .delete_btn{
    margin-right: 0px;

}

`