import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { storageApi } from '../../../../api'
import logo from '../../../../assets/images/logo.png'
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import UpdateIcon from '@mui/icons-material/Update';
import { setLoader } from '../../../../redux/Features/Loader/loaderSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { api } from '../../../../api';
import CryptoJS from 'crypto-js';
import Heading from '../../../../common/Heading';
import { useDispatch } from 'react-redux';
import ImagePopup from '../../../../common/ImagePopup';
const Profile = () => {
  const dispatch = useDispatch();
  const [editingMode, seteditingMode] = useState(false);
  const [uploadBulk, setuploadBulk] = useState(true);
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
  const [schoolInfo, setschoolInfo] = useState({
    access_code: "",
    created_at: "",
    deleted_at: '',
    email_id: "",
    id: '',
    no_of_members: "",
    phone: "",
    registration_method: "",
    school_image: '',
    school_name: "",
    status: '',
    updated_at: ""
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const gettingDatafromLocal = () => {
    const rawData2 = localStorage.getItem('encrypted_data')
    const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);
    setschoolInfo(parsedData);
  }
  useEffect(() => {
    gettingDatafromLocal();
  }, [])



  const handleFileChange = (event) => {
    setschoolInfo(prevSchoolInfo => ({
      ...prevSchoolInfo,
      school_image: event.target.files[0]
    }));
    setuploadBulk(false);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && value.length <= 15) {
      setschoolInfo(prevSchoolInfo => ({
        ...prevSchoolInfo,
        [name]: value
      }));
    } else if (name === 'no_of_members' && value.length <= 4) {
      setschoolInfo(prevSchoolInfo => ({
        ...prevSchoolInfo,
        [name]: value
      }));
    } else if (name !== 'phone' && name !== 'no_of_members') {
      setschoolInfo(prevSchoolInfo => ({
        ...prevSchoolInfo,
        [name]: value
      }));
    }

  };
  const editData = () => {
    if (schoolInfo.school_name.length < 3) {
      toast.info('School Name Requires Minimum 3 Letters!')
    } else if (schoolInfo.no_of_members < 1) {
      toast.info('Atleast 1 Member is required!')
    } else if (schoolInfo.phone.length < 10) {
      toast.info('Phone Number Requires Minimum 10 Digits!')
    } else if (schoolInfo.school_image === (null || '')) {
      toast.info('Please Select School Image!')
    }
    else {
      dispatch(setLoader(true))
      axios.post(`${api}edit-school`, {
        id: schoolInfo?.id,
        school_name: schoolInfo.school_name,
        no_of_members: schoolInfo.no_of_members,
        phone: schoolInfo.phone,
        school_image: schoolInfo.school_image,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then((res) => {
      dispatch(setLoader(false))
        toast.success(res.data.message);
        setDataAgain();
      }).catch((err) => {
      dispatch(setLoader(false))
        console.log(err)
        toast.error(err.data.message);
      })
    }
  }

  const setDataAgain = () => {
    axios.post(`${api}view-school-details`, {
      id: schoolInfo?.id,
    }).then((res) => {
      const stringData = JSON.stringify(res.data.data[0]);
      const key = "001";
      const encryptedData = CryptoJS.AES.encrypt(stringData, key).toString();
      localStorage.setItem('encrypted_data', encryptedData)
      seteditingMode(false);
    }).catch((err) => {
      console.log(err)
      toast.error(err.data.message);
    })
  }



  return (
    <StyledSchoolProfile >
      <Heading heading="Back" url="/school-dashboard" />
      <div className='position-absolute start-50 translate-middle bg-light border text-center parent rounded-2' style={{ marginTop: `${windowWidth < 768 ? '280px' : '200px'}`, width: `${windowWidth < 768 ? '98%' : '75%'}` }} >
        <div className="position-absolute top-0 end-0 edit p-4" onClick={() => setuploadBulk(true) + seteditingMode(!editingMode) + gettingDatafromLocal()}>
          <EditIcon />
        </div>
        <div style={{ margin: "-45px 0 0 0" }}>
          {
            schoolInfo.school_image ? (
              <>
                {
                  uploadBulk ? (
                    <>
                    <img width="120px" height="120px" className='rounded-circle' onClick={()=>handleImageClick(`${storageApi}school/${schoolInfo?.school_image}`)} src={`${storageApi}school/${schoolInfo?.school_image}`} alt="..." />
                    {
                      showPopup &&
                      <ImagePopup imageUrl={selectedImage} open={handleOpenPopUp} onClose={handleClosePopup}/>
                    }
                    </>
                  ) : (
                    <img width="120px" height="120px" className='rounded-circle' src={URL.createObjectURL(schoolInfo?.school_image)} alt="uploaded" />
                  )
                }
              </>
            ) : (
              <>
                <img width="120px" height="120px" className='rounded-circle' src={logo} alt="..." />
              </>
            )
          }
          {
            editingMode &&
            <div>
              <label htmlFor="image-upload" className='edit text-primary'>Edit</label>
              <input type="file" id="image-upload" name='school_image' onChange={handleFileChange} accept="image/png" style={{ display: 'none' }} />
            </div>
          }
        </div>
        <div className="row m-0">
          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
            <TextField
              inputProps={{
                maxLength: 50
              }}
              onChange={(e) => handleChange(e)} sx={{ width: "100%" }} disabled={!editingMode} id="filled-basic" label="School Name" value={schoolInfo?.school_name} name="school_name" variant="filled" />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
            <TextField
              type="number"
              onChange={(e) => handleChange(e)} sx={{ width: "100%" }} disabled={!editingMode} id="filled-basic" label="Phone Number" value={schoolInfo?.phone} name="phone" variant="filled" />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
            <TextField
              inputProps={{
                inputMode: 'numeric',
                min: 0,
                max:1000,
              }}
              onChange={(e) => handleChange(e)} sx={{ width: "100%" }} type="number" disabled={!editingMode} id="filled-basic" label="No. Of Members" value={schoolInfo?.no_of_members} name="no_of_members" variant="filled" />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
            <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="Email ID" value={schoolInfo?.email_id} disabled variant="filled" />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-12 mt-4">
            <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} disabled id="filled-basic" label="Registeration Method" value={schoolInfo?.registration_method} name="registration_method" variant="filled" />
          </div>
        </div>
        {
          editingMode &&
          <Button sx={{ margin: "15px 15px 0 15px", width: "40%" }} size="large" onClick={() => editData()} variant="outlined" startIcon={<UpdateIcon />}>
            Update
          </Button>
        }
      </div>
    </StyledSchoolProfile>
  )
}

const StyledSchoolProfile = styled.div`


.parent{
  padding: 20px;
  margin-bottom: 40px;
}
.edit{
  cursor: pointer;
}

`
export default Profile
