import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { storageApi } from '../../../../api'
import GrayPerson from '../../../../assets/images/Profile-Icon.png';
import { setLoader } from '../../../../redux/Features/Loader/loaderSlice';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import UpdateIcon from '@mui/icons-material/Update';
import { useSelector, useDispatch } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';
import { fetchData } from '../../../../redux/Features/LanguagesSlice/languagesSlice';
import axios from 'axios';
import { api } from '../../../../api';
import CryptoJS from 'crypto-js';
import ImagePopup from '../../../../common/ImagePopup';

const TeacherProfile = () => {
  const dispatch = useDispatch();
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
  const { details } = useSelector((state) => state.languagesDetails);
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
  const [editingMode, seteditingMode] = useState(false);
  const [uploadBulk, setuploadBulk] = useState(true);
  const [teacherInfo, setteacherInfo] = useState({
    age: '',
    created_at: '',
    deleted_at: '',
    gender: '',
    id: '',
    language_class: '',
    phone_no: '',
    school_id: '',
    teacher_access_code: '',
    teacher_email: '',
    teacher_image: '',
    teacher_name: '',
    teacher_status: '',
    updated_at: ''
  });

  const gettingDatafromLocal = () => {
    const rawData2 = localStorage.getItem('encrypted_data_ts')
    const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);
    setteacherInfo(parsedData);
  }
  useEffect(() => {
    gettingDatafromLocal();
  }, [])



  const handleFileChange = (event) => {
    setteacherInfo(prevteacherInfo => ({
      ...prevteacherInfo,
      teacher_image: event.target.files[0]
    }));
    setuploadBulk(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age" && value.length <= 2) {
      setteacherInfo(prevteacherInfo => ({
        ...prevteacherInfo,
        [name]: value
      }));
    } else if (name === "phone_no" && value.length <= 15) {
      setteacherInfo(prevteacherInfo => ({
        ...prevteacherInfo,
        [name]: value
      }));
    } else if (name !== "phone_no" && name !== "age") {
      setteacherInfo(prevteacherInfo => ({
        ...prevteacherInfo,
        [name]: value
      }));
    }
  };
  const editData = () => {
    if (teacherInfo.teacher_name === "") {
      toast.info("Teacher Name is Required")
    } else if (teacherInfo.teacher_name.length < 3) {
      toast.info("Teacher Name Minium Requires 3 Letters");
    } else if (teacherInfo.teacher_image === "") {
      toast.info("Teacher Image is Required")
    } else if (teacherInfo.teacher_email === "") {
      toast.info("Teacher Email is Required")
    } else if (teacherInfo.phone_no.length < 13) {
      toast.info("Teacher Phone Number is Required")
    } else if (teacherInfo.age < 1 || teacherInfo.age > 99 || teacherInfo.age === 0) {
      toast.info("Teacher Age is Invalid")
    }
    else {
      dispatch(setLoader(true))
      axios.post(`${api}edit-teacher`, {
        id: teacherInfo?.id,
        teacher_name: teacherInfo.teacher_name,
        age: teacherInfo.age,
        phone_no: teacherInfo.phone_no,
        gender: teacherInfo.gender,
        teacher_image: teacherInfo.teacher_image,
        language_class: teacherInfo.language_class,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then((res) => {
        dispatch(setLoader(false))
        toast.success(res.data.message);
        setteacherInfo(res.data.data)
        setDataAgain(res.data.data);
      }).catch((err) => {
        dispatch(setLoader(false))
        console.log(err)
        toast.error(err.data.message);
      })
    }
  }

  const setDataAgain = (param) => {
    const stringData = JSON.stringify(param);
    const key = "001";
    const encryptedData = CryptoJS.AES.encrypt(stringData, key).toString();
    localStorage.setItem('encrypted_data_ts', encryptedData)
    seteditingMode(false);
  }
  return (
    <StyledteacherProfile >
      <div className='bg-mirror text-center parent rounded-4' >
        <div>
          <div className="position-absolute top-0 end-0 edit p-4" onClick={() => seteditingMode(!editingMode) + gettingDatafromLocal()}>
            <EditIcon className="text-secondary" />
          </div>
          <div>
            {
              teacherInfo?.teacher_image ? (
                <>
                  {
                    uploadBulk ? (
                      <>
                      <img width="120px" height="120px" className='rounded-circle' style={{ marginTop: "10px" }} onClick={()=>handleImageClick(`${storageApi}teacher/${teacherInfo?.teacher_image}`)} src={`${storageApi}teacher/${teacherInfo?.teacher_image}`} alt="..." />
                      {
                        showPopup && 
                        <ImagePopup open={handleOpenPopUp} onClose={handleClosePopup} imageUrl={selectedImage}/>
                      }</> 
                    ) : (
                      <img width="120px" height="120px" className='rounded-circle' style={{ marginTop: "10px" }} src={URL?.createObjectURL(teacherInfo?.teacher_image)} alt="uploaded" />
                    )
                  }
                </>
              ) : (
                <>
                  <img width="120px" height="120px" style={{ marginTop: "10px" }} className='rounded-circle' src={GrayPerson} alt="..." />
                </>
              )
            }
            {
              editingMode &&
              <div>
                <label htmlFor="image-upload" className='edit text-primary'>Edit</label>
                <input type="file" id="image-upload" name='teacher_image' onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
              </div>
            }
          </div>
          <div className="row m-0">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
              <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} disabled={!editingMode} id="filled-basic" label="Teacher Name" inputProps={{ maxLength: 50 }} value={teacherInfo?.teacher_name} name="teacher_name" variant="filled" />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
              <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} disabled={!editingMode} type="number" id="filled-basic" label="Phone Number" value={teacherInfo?.phone_no} name="phone_no" variant="filled" />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
              <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} disabled={!editingMode} type='number' id="filled-basic" label="Age" inputProps={{ maxLength: 2 }} value={teacherInfo?.age} name="age" variant="filled" />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
              <FormControl variant="filled" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                <Select
                  disabled={!editingMode}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={teacherInfo?.gender}
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
              <FormControl variant="filled" sx={{ width: "100%", marginBottom: "40px" }}>
                <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
                <Select
                  disabled={!editingMode}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={teacherInfo?.language_class}
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
          </div>
          {
            editingMode &&
            <Button sx={{ margin: "20px", width: "40%" }} size="large" onClick={() => editData()} variant="outlined" startIcon={<UpdateIcon />}>
              Update
            </Button>
          }
        </div>
      </div>
    </StyledteacherProfile>
  )
}

const StyledteacherProfile = styled.div`
margin:0;

.parent{
  height:85vh;
  overflow-x: scroll;
}
.edit{
  cursor: pointer;
}
@media(max-width:768px){
 .parent{
  overflow-x: auto;
  height:auto;
 }
}
@media(max-width:770px) and (min-width:768px){
  .parent{
  height:82vh;
}
}
@media(max-width:1024px) and (min-width:1000px){
  .parent{
  height:90vh;
}
}
`

export default TeacherProfile