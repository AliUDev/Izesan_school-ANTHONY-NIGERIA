import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { storageApi } from '../../../../api'
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import UpdateIcon from '@mui/icons-material/Update';
import { useSelector, useDispatch } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import { setLoader } from '../../../../redux/Features/Loader/loaderSlice';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ImagePopup from '../../../../common/ImagePopup';
import { toast } from 'react-toastify';
import GrayPerson from '../../../../assets/images/Profile-Icon.png';
import { fetchData } from '../../../../redux/Features/LanguagesSlice/languagesSlice';
import axios from 'axios';
import { api } from '../../../../api';
import CryptoJS from 'crypto-js';
const StudentProfile = () => {
  const dispatch = useDispatch()
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
  const [studentInfo, setstudentInfo] = useState({
    age: '',
    created_at: '',
    deleted_at: '',
    gender: '',
    id: '',
    language_speak: '',
    phone_no: '',
    school_id: '',
    student_access_code: '',
    student_email: '',
    student_image: '',
    student_name: '',
    student_status: '',
    updated_at: ''
  });


  const gettingDatafromLocal = () => {
    const rawData2 = localStorage.getItem('encrypted_data_ts')
    const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);
    setstudentInfo(parsedData);
  }
  useEffect(() => {
    gettingDatafromLocal();
  }, [])
  localStorage.setItem("s_id", studentInfo.school_id);

  const handleFileChange = (event) => {
    setstudentInfo(prevstudentInfo => ({
      ...prevstudentInfo,
      student_image: event.target.files[0]
    }));
    setuploadBulk(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    // setstudentInfo(prevstudentInfo => ({
    //   ...prevstudentInfo,
    //   [name]: value
    // }));
    if(name === "phone_no" &&value.length<=15 ){
setstudentInfo(prevstudentInfo => ({
      ...prevstudentInfo,
      [name]: value
    }));
    } else if( name === "age"&& value.length<=2){
      setstudentInfo(prevstudentInfo => ({
      ...prevstudentInfo,
      [name]: value
    }));
    } else if(name !== "age" && name !== "phone_no" ){
      setstudentInfo(prevstudentInfo => ({
        ...prevstudentInfo,
        [name]: value
      }));
    }
  };
  const editData = () => {
    if(studentInfo.age === ""){
      toast.info("Student Age is Required");
    } else if(studentInfo.student_name === ""){
      toast.info("Student Name is Required");
    }else if(studentInfo.student_name.length < 3){
      toast.info("Student Name Minium Requires 3 Letters");
    } else if(studentInfo.gender === ""){
      toast.info("Student Genger is Required");
    } else if(studentInfo.phone_no === ""){
      toast.info("Student Phone Number is Required");
    } else if (studentInfo.age < 3 || studentInfo.age > 99 || studentInfo.age === 0){
      toast.info("Student Age is Invalid");
    }
   else{ 
    dispatch(setLoader(true))
    axios.post(`${api}edit-student`, {
      id: studentInfo?.id,
      student_name: studentInfo.student_name,
      age: studentInfo.age,
      phone_no: studentInfo.phone_no,
      gender: studentInfo.gender,
      student_image: studentInfo.student_image,
      language_speak: studentInfo.language_speak,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then((res) => {
    dispatch(setLoader(false))
      toast.success(res.data.message);
      setDataAgain(res.data.data);
    }).catch((err) => {
    dispatch(setLoader(false))
      console.log(err)
      toast.error(err.data.message);
    })}
  }

  const setDataAgain = (param) => {
    const stringData = JSON.stringify(param);
    const key = "001";
    const encryptedData = CryptoJS.AES.encrypt(stringData, key).toString();
    localStorage.setItem('encrypted_data_ts', encryptedData)
    seteditingMode(false);
  }
  return (
    <StyledstudentProfile >
    <div className='bg-mirror text-center parent rounded-4' >
      <div className="position-absolute top-0 end-0 edit p-4" onClick={() => seteditingMode(!editingMode) + gettingDatafromLocal()}>
        <EditIcon />
      </div>
      <div className='mt-2'>
        {
          studentInfo.student_image ? (
            <>
              {
                uploadBulk ? (
                  <>
                  <img width="120px" height="120px" style={{marginTop:"10px"}} className='rounded-circle' onClick={()=>handleImageClick(`${storageApi}student/${studentInfo?.student_image}`)} src={`${storageApi}student/${studentInfo?.student_image}`} alt="..." />
                  {
                    showPopup && 
                    <ImagePopup open={handleOpenPopUp} imageUrl={selectedImage} onClose={handleClosePopup}/>
                  }
                  </>
                ) : (
                  <img width="120px" height="120px" style={{marginTop:"10px"}} className='rounded-circle' src={URL.createObjectURL(studentInfo?.student_image)} alt="uploaded" />
                )
              }
            </>
          ) : (
            <>
              <img width="120px" height="120px" style={{marginTop:"10px"}} className='rounded-circle' src={GrayPerson} alt="..." />
            </>
          )
        }
        {
          editingMode &&
          <div>
            <label htmlFor="image-upload" className='edit text-primary'>Edit</label>
            <input type="file" id="image-upload" name='student_image' onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>
        }
      </div>
      <div className="row m-0">
        <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
          <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} disabled={!editingMode} id="filled-basic" label="student Name"  inputProps={{ maxLength: 30 }} value={studentInfo?.student_name} name="student_name" variant="filled" />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
          <TextField type='number'  onChange={(e) => handleChange(e)} sx={{ width: "100%" }}  disabled={!editingMode} id="filled-basic"  label="Phone Number" value={studentInfo?.phone_no} name="phone_no" variant="filled" />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
          <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} type='number' disabled={!editingMode} id="filled-basic" label="Age" value={studentInfo?.age} 
               name="age" variant="filled" />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
          <FormControl variant="filled" sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
            <Select
              disabled={!editingMode}
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={studentInfo.gender}
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
              disabled={!editingMode}
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={studentInfo.language_speak}
              name="language_speak"
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
      {
        editingMode &&
        <Button sx={{ margin: "15px 15px 0 15px", width: "40%" }} size="large" onClick={() => editData()} variant="outlined" startIcon={<UpdateIcon />}>
          Update
        </Button>
      }
    </div>
  </StyledstudentProfile>
  )
}
const StyledstudentProfile = styled.div`
height:100%;

.parent{
  height:85vh;
  overflow-x: scroll;
}
.edit{
  cursor: pointer;
}
@media(max-width:767px){
 .parent{
  overflow-x: auto;
  height:auto;
 }
}
@media(max-width:770px) and (min-width:768px){
  .parent{
  margin-bottom: 40px;
  height:82vh;
}
}
@media(max-width:1024px) and (min-width:1000px){
  .parent{
  margin-bottom: 40px;
  height:90vh;
}
}
`
export default StudentProfile