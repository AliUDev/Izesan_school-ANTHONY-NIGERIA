import styled from '@emotion/styled';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import React, { useEffect, useState, useMemo } from 'react'
import { api, storageApi } from '../../../api'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TeacherForm from './TeacherForm';
import StudentForm from './StudentForm';
import CryptoJS from 'crypto-js';
import Loader2 from '../../../common/Loader2/Loader2';
import noImg from '../../../assets/images/No-image-found.jpg';
import { encryptedData } from '../../../data.provider';
import ImagePopup from '../../../common/ImagePopup';

const SideList = (props) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageClick = (param) => {
        setSelectedImage(param);
        handleOpenPopUp();
    };
    const handleOpenPopUp = () => setShowPopup(true);
    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedImage(null);
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open2, setOpen2] = React.useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);
    const [modalTeacherData, setmodalTeacherData] = useState({});
    const [modalStudentData, setmodalStudentData] = useState({});
    const [studentData, setstudentData] = useState([]);
    const [teacherData, setteacherData] = useState([]);
    const [schoolInfo, setschoolInfo] = useState({});
    const [loading, setloading] = useState(false);
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
        width: screenWidth < 768 ? "96%" : '70%',
        bgcolor: 'background.paper',
        borderRadius: "20px",
        overflowY: "scroll",
        height: "80vh",
        boxShadow: 24,
        p: 4,
    };
    useEffect(() => {
        const parsedData = encryptedData();
        setschoolInfo(parsedData);
        const school_id = parsedData.id;

        setloading(true);
        axios.post(`${api}view-student`, {
            'school_id': school_id
        })
            .then((res) => {
                if (res.data.data) {
                    setstudentData(res.data.data);
                }
                setloading(false);
            }).catch((err) => {
                console.log(err)
                setloading(false)
            })
        axios.post(`${api}view-teacher`, {
            'school_id': school_id
        })
            .then((res) => {
                if (res.data.data) {
                    setteacherData(res.data.data);
                }
                setloading(false);
            }).catch((err) => {
                console.log(err)
                setloading(false)

            })
    }, [open, open2])

    const teacherModal = (data) => {
        setmodalTeacherData(data);
        handleOpen();
    }
    const studentModal = (data) => {
        setmodalStudentData(data);
        handleOpen2();
    }
    const teacherInfoLocally = (params) => {
        const { teacher_email, school_id, id } = params;
        const encryptedData = CryptoJS.AES.encrypt(teacher_email, '001').toString();
        localStorage.setItem("teacher_email", encryptedData);
        const object = JSON.stringify({ teacher_email: teacher_email, school_id: parseInt(school_id), id: parseInt(id) })
        const encryptedData2 = CryptoJS.AES.encrypt(object, '001').toString();
        localStorage.setItem('encrypted_data_ts', encryptedData2)
    }
    return (
        <SttyledSideList>
            <Modal
                sx={{ zIndex: "0" }}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <TeacherForm data={modalTeacherData} liftingState={handleClose} />
                </Box>
            </Modal>
            <Modal
                sx={{ zIndex: "0" }}
                open={open2}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <StudentForm data={modalStudentData} liftingState={handleClose2} />
                </Box>
            </Modal>
            <div>
                {
                    schoolInfo?.school_image === null ? (
                        <img width="120px" height="120px" className='rounded-circle' alt="..." src={noImg} />
                    ) : (
                        <>
                            <img width="120px" height="120px" className='rounded-circle' onClick={() => handleImageClick(`${storageApi}school/${schoolInfo?.school_image}`)} alt="..." src={`${storageApi}school/${schoolInfo?.school_image}`} />
                            {showPopup && (
                                <ImagePopup imageUrl={selectedImage} onClose={handleClosePopup} open={handleOpenPopUp} />
                            )}
                        </>
                    )
                }
            </div>
            <p className='fs-2' >{schoolInfo.school_name}</p>

            <>
                {
                    loading ? (
                        <Loader2 />
                    ) : (
                        <>
                            {
                                props.listOf ? (
                                    <>
                                        {teacherData.length > 0 ? (

                                            <>
                                                <h5 className='text-start' >Teachers:</h5>
                                                {
                                                    teacherData.map((data, key) => (
                                                        <div key={key} onClick={() => teacherModal(data) + teacherInfoLocally(data)}>
                                                            <List sx={{ width: '100%', backgroundColor: 'var(--color4)', color: 'white', borderRadius: "10px", marginTop: "7px", cursor: "pointer" }}>
                                                                <ListItem>
                                                                    <ListItemAvatar>
                                                                        <Avatar>
                                                                            {
                                                                                data?.teacher_image === null ? (
                                                                                    <AccountCircleIcon />
                                                                                ) : (
                                                                                    <img width="100px" height="100px" className='rounded-circle' alt="..." src={`${storageApi}teacher/${data.teacher_image}`} />
                                                                                )
                                                                            }
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <Tooltip describeChild title={data.teacher_email}>
                                                                        <ListItemText style={{
                                                                            width: "100px"
                                                                        }}
                                                                            primary={data.teacher_name} secondary={data.teacher_email} />

                                                                    </Tooltip>
                                                                </ListItem>
                                                            </List>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                        ) : (
                                            <>
                                                <p className='text-muted'>No Teacher Found</p>
                                            </>
                                        )
                                        }
                                    </>
                                ) : (
                                    <>
                                        {studentData.length > 0 ? (
                                            <>
                                                <h5 className='text-start' >Students:</h5>
                                                {
                                                    studentData.map((data, key) => (
                                                        <div key={key} onClick={() => studentModal(data)} >
                                                            <List sx={{ width: '100%', backgroundColor: 'var(--color3)', color: 'white', borderRadius: "10px", marginTop: "7px", maxWidth: "auto", cursor: "pointer" }}>
                                                                <ListItem>
                                                                    <ListItemAvatar>
                                                                        <Avatar>
                                                                            {
                                                                                data?.student_image === null ? (
                                                                                    <AccountCircleIcon />
                                                                                ) : (
                                                                                    <img width="100px" height="100px" className='rounded' alt="..." src={`${storageApi}student/${data.student_image}`} />
                                                                                )
                                                                            }
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <Tooltip describeChild title={data.student_email}>
                                                                        <ListItemText style={{
                                                                            width: "100px"
                                                                        }}
                                                                            primary={data.student_name} secondary={data.student_email} />

                                                                    </Tooltip>
                                                                </ListItem>
                                                            </List>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                        ) : (
                                            <>
                                                <p className='text-muted'>No Student Found</p>
                                            </>

                                        )}
                                    </>

                                )
                            }
                        </>
                    )
                }
            </>
        </SttyledSideList>
    )
}

export default SideList

const SttyledSideList = styled.div`

.MuiListItem-root p {
    margin: 0;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.43;
    max-width: 550px;
    letter-spacing: 0.01071em;
    color: rgba(0, 0, 0, 0.6);
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
    
`