import { dataProvider } from '../../../data.provider'
import styled from '@emotion/styled'
import React, { useState, useEffect, useMemo } from 'react'
import { api } from '../../../api'
import { typeProvider } from '../../../Helper/ParticipantTypeProvider'
import { getAllClasses } from '../../../redux/TeacherAndStudent/ClassesListSlice'
import { useDispatch, useSelector } from 'react-redux'
import bg from '../../../assets/images/classes_list_bg.png'
import { useNavigate } from 'react-router-dom'
import { setLoader } from '../../../redux/Features/Loader/loaderSlice'
import Loader2 from '../../../common/Loader2/Loader2'
import CryptoJS from 'crypto-js'
import CreateClassButton from '../../../common/CreateClassButton'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { fetchData } from '../../../redux/Features/LanguagesSlice/languagesSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'
import StudentProfile from './Profile/StudentProfile'
import TeacherProfile from './Profile/TeacherProfile'
import CurrentTestBtn from '../../../common/CurrentTestBtn'

const TeacherAndStudentDashboard = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  let id_curr = JSON.parse(localStorage.getItem("param"));
  const [userData] = useState(dataProvider());
  const [navigationstate, setnavigationstate] = useState(true);
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.languagesDetails);
  const [formData, setformData] = useState({
    classroom_name: '',
    language: '',
    email_id: '',
    school_id: ''
  });
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);


  const classesState = useSelector(state => state?.newClassesListDetails?.classes);
  const loading = useSelector(state => state.newClassesListDetails.loading);
  const funccc = () => {
    typeProvider() === 'student' ?
      dispatch(getAllClasses(userData.id)) :
      dispatch(getAllClasses(userData.id));
  }
  useEffect(() => {
    funccc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const minorInfo = (param) => {
    const obj = {
      id: param.id,
      class_code: param.class_code,
      class_link: param.class_link,
      classroom_name: param.classroom_name,
      language: param.language,
    }
    const data = JSON.stringify(obj);
    const key = "001";
    const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
    localStorage.setItem('class_info', encryptedData)
  }

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

  const addClass = async () => {
    if (typeProvider() === "teacher") {
      const data = await dataProvider();
      const school_id = await data.school_id;
      const email = await data.teacher_email;
      setformData({ email_id: email, school_id: school_id, classroom_name: formData.classroom_name, language: formData.language });
      dispatch(setLoader(true))
      axios.post(`${api}add-class`, {
        classroom_name: formData.classroom_name,
        language: formData.language,
        teacher_id: data.id,
        school_id: school_id
      })
        .then((res) => {
      dispatch(setLoader(false))

          handleClose();
          funccc();
          setformData({
            classroom_name: '',
            language: '',
            email_id: '',
            school_id: ''
          })
          if (res.data.code !== 401) {
      dispatch(setLoader(false))
            toast.success(res.data.message);

          } else {
      dispatch(setLoader(false))
            toast.error(res.data.message);

          }
        }).catch((err) => {
      dispatch(setLoader(false))
          console.log(err)
        })
    }
    else {
      const data = await dataProvider();
      const school_id = await data.data.school_id;
      const email = await data.data.teacher_email;
      setformData({ email_id: email, school_id: school_id, classroom_name: formData.classroom_name, language: formData.language });
      dispatch(setLoader(true))

      axios.post(`${api}add-class`, {
        classroom_name: formData.classroom_name,
        language: formData.language,
        teacher_id: email,
        school_id: school_id
      })
        .then((res) => {
      dispatch(setLoader(false))

          handleClose();
          funccc();
          setformData({
            classroom_name: '',
            language: '',
            email_id: '',
            school_id: ''
          })
          if (res.data.code !== 401) {
      dispatch(setLoader(false))

            toast.success(res.data.message);

          } else {
      dispatch(setLoader(false))

            toast.error(res.data.message);

          }
        }).catch((err) => {
      dispatch(setLoader(false))

          console.log(err)
        })
    }
  }

  const deleteClass = (param, name) => {
    // Defining typeprovider for security check
    typeProvider() === 'teacher' &&
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
            toast.success(res.data.message);
            funccc()
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



  return (
    <StyledThemeDashBoard>

      {/* Modal Code   */}
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
                <TextField onChange={(e) => handleChange(e)} sx={{ width: "100%" }} id="filled-basic" label="ClassRoom Name" value={formData.classroom_name} name="classroom_name" variant="filled" />
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
                      details.map((data, index) => (
                        <MenuItem key={index} value={data.language}>{data.language}</MenuItem>
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
      {
        typeProvider() === 'student' && localStorage?.getItem('counter') &&
        <div onClick={() => navigate(`/test/${id_curr}`)}>
          <CurrentTestBtn />
        </div>
      }
      <div className="container-fluid">
        <div className="row g-4 mt-1" >

          <div className="col-xl-8 col-lg-8 col-md-7 col-sm-12 col-12 will_hide">
            <div className='d-flex align-items-start justify-content-center border rounded-4'>
              {
                typeProvider() === 'student' ? (
                  <StudentProfile />
                ) : (
                  <TeacherProfile />
                )
              }
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-5 col-sm-12 col-12 text-center"  >
            <div className="p-3 border bg-mirror rounded-4  side_list" >
              {
                typeProvider() === 'student' ? (
                  <>
                    <h2 className='py-2'>Joined Classes</h2>
                    <>
                      {
                        loading ? (
                          <Loader2 />
                        ) : (
                          <>
                            {
                              ( classesState.join_classes !== undefined || classesState.join_classes !== null || classesState.join_classes !== "" || classesState.join_classes.length < 1 )   ? (
                                classesState?.join_classes?.map((data, key) => (
                                  <div key={key} className='rounded mb-3 parent2 cursor-pointer' style={{ backgroundImage: `url(${bg})` }} onClick={() => minorInfo(data) + navigate(`/class-details2/${data.class_code}`)}>
  
                                    <h3 className='text-start text-light p-4 text-capitalize'>{data.classroom_name}</h3>
                                    <h4 className='text-start text-light p-1 px-4 text-capitalize'>{data.participants?.split(',').length} {data.participants && "students"} </h4>
  
  
                                  </div>
                                ))
                              ):(
                                <h5>No Classes Found</h5>
                              )
                             
                            }
                          </>
                        )
                      }
                    </>
                  </>
                ) : (
                  <>
                    <h3 className='py-2'>Your Classes</h3>
                    {
                      loading ? (
                        <>
                          <Loader2 />
                        </>
                      ) : (
                        <>
                          {
                            (classesState?.all_classes !== undefined || classesState.all_classes !== null || classesState.all_classes !== "" ) ?(
                              classesState?.all_classes?.map((data, key) => (
                                <div key={key} className='rounded mb-3 cursor-pointer classes' style={{ backgroundImage: `url(${bg})` }} onClick={() => navigationstate && (minorInfo(data) + navigate(`/class-details2/${data.class_code}`))}>
                                  {
                                    typeProvider() !== "student" &&
                                    <DeleteIcon className=' delete_btn position-absolute' onMouseEnter={() => setnavigationstate(false)} onMouseLeave={() => setnavigationstate(true)} onClick={() => !navigationstate && deleteClass(data.class_code, data.classroom_name)} />
                                  }
                                  <h3 className='text-start text-light p-3 text-capitalize'>{data.classroom_name}</h3>
                                  <h4 className='text-start text-light p-1 px-4 text-capitalize'>{data.participants !== null ? data.participants?.split(',').length : 0} student<span>{data.participants?.split(',').length > 1 && 's'}</span></h4>
                                </div>
                              ))
                            ):(
                              <h5>No Classes Found</h5>
                            )
                           
                          }
                        </>
                      )
                    }
                  </>
                )
              }
            </div>
            {
              typeProvider() === 'teacher' &&
              <div onClick={handleOpen}>
                <CreateClassButton />
              </div>
            }
          </div>
        </div>
      </div>
    </StyledThemeDashBoard>
  )
}

export default TeacherAndStudentDashboard


const StyledThemeDashBoard = styled.div`
.parent2{
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: 0 2px 6px 1px rgb(0,0,0,0.4);
    border: 1px solid rgb(0,0,0,0.1);
}

.parent2:hover{
    transform: scale(0.99);
    cursor: pointer; 
}
.classes{
    box-shadow: 0 2px 6px 1px rgb(0,0,0,0.4);
}
.classes:hover{
    transform: scale(0.99);
    cursor: pointer;
    box-shadow: 0 2px 3px 1px rgb(0,0,0,0.4);

}
.side_list{
  overflow-x: scroll;
  height: 85vh;
}
.delete_btn{
  right: 20px;
  margin-top: 8px;
  color:#fff;
}
.classes:hover .delete_btn{
  right: 3px;
}
.delete_btn:hover{
  transform: scale(1);
  transition-duration: 100ms;
  cursor: pointer;
  color:red;
}
.border_new{
  border:1px solid var(--color2) ;
}
@media (max-width: 767px){
  
.will_hide{
  display: none;
}
}
@media (max-width: 767px){
.will_hide{
  display: none;
}
}
@media(max-width:770px) and (min-width:768px){
  .side_list{
  height:82vh;
}
}
@media(max-width:1024px) and (min-width:1000px){
  .side_list{
  height:90vh;
}}
`