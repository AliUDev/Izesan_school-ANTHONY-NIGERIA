import React, { useEffect, useMemo, useState } from 'react'
import { fetchDataofClassWork } from '../../../../../redux/Features/ClassWorkSlice/ClassWorkSlice';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { api, storageApi } from '../../../../../api';
import Loader2 from '../../../../../common/Loader2/Loader2'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import { typeProvider } from '../../../../../Helper/ParticipantTypeProvider'
import AddClassWork from './AddClassWork';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { fetchDataOfClassworkModuleAssignment } from '../../../../../redux/Features/ClassWorkModuleSlice/ClassWorkModuleSlice';
import FeedIcon from '@mui/icons-material/Feed';
import { chaptersList, dataProvider } from '../../../../../data.provider'
import chapterimg from '../../../../../assets/images/chapters.png'
import FixedTimeComponent from '../../../../../common/FixedTimeComponent';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { isDate } from '../../../../../Helper/DateProvider';
import { toast } from 'react-toastify';
const ClassWorks = ({ params, modal, reset }) => {

    const param = useParams();
    const navigate = useNavigate();
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
        // boxShadow: 24,
        p: 4,
        '& .MuiBackdrop-root': {
            backgroundColor: 'transparent',
        },
    };

    const dispatch = useDispatch();
    const funccc = () => {
        dispatch(fetchDataofClassWork(params));
        dispatch(fetchDataOfClassworkModuleAssignment(params))
    }
    useEffect(() => {
        funccc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])


    useEffect(() => {
        if (modal === 'classwork') {
            handleOpen()
        }
    }, [modal])

    const reduxStateData = useSelector(state => state?.classWorkDetails?.allclassWork?.data);
    const loading = useSelector(state => state?.classWorkDetails?.isLoading);

    const reduxStateData2 = useSelector(state => state.classworkModuleAssignmentDetails.classWorkModuleAssignment.data);
    const loading2 = useSelector(state => state.classworkModuleAssignmentDetails.isLoading);

    const action = (parameter) => {
        window.open(storageApi + 'classwork/' + parameter, '_blank');
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        reset();
        setOpen(false)
    }
    const deleteClassWork = (id) => {
        Swal.fire({
            title: 'Do you want to delete this class?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`${api}delete-classwork`, {
                    id: id,
                    class_code: param.id
                })
                    .then((res) => {
                        funccc();
                        Swal.fire(
                            'Deleted!',
                            'This class has been deleted.',
                            'success'
                        )
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
    }

    const deleteModuleAssignment = (id) => {
        Swal.fire({
            title: 'Do you want to delete this module assignment?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`${api}delete-classwork-module-assignment`, { id: id })
                    .then((res) => {
                        toast.info(res.data.message)
                        if (res.data.code !== 400) {
                            Swal.fire(
                                'Deleted!',
                                'Module Assignment has been deleted.',
                                'success'
                            )
                            dispatch(fetchDataOfClassworkModuleAssignment(params));
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
    }

    const openModuleAssignment = (moduleIndex, data) => {
        const { time_limit, revision, id, attempt_type, language } = data;
        axios.get(`${api}get-school-chapter-progress?module_no=${Number(moduleIndex) + 1}&assigned_module_id=${id}&language=${language}&student_id=${dataProvider().id}`)
            .then((res) => {
                // if (res.data.data[0].is_complete === 0) {
                typeProvider() === 'student' && navigate(`/test/${(Number(moduleIndex) + 1)}`);
                const object = { time_limit: time_limit, revision: revision, module_id: id, attempt_type: attempt_type, classAssignment: true };
                localStorage.setItem("assignmentDetails", JSON.stringify(object))
                localStorage.setItem("current_question", 0);
                localStorage.removeItem("counter");
                // } else {
                // Swal.fire("Oops!", "You already have attempted this assignment!")
                // }
            }).catch((err) => {
                console.log(err)
            })
    }


    return (
        <StyledClassWork>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <AddClassWork close={handleClose} handleClose={setOpen} callFunc={funccc} />
                    </Box>
                </Modal>
            </div>
            <h4 className="text-start p-0 m-0 mb-3 mx-3">Classwork:</h4>
            {
                loading ? (
                    <Loader2 />
                ) : (

                    <div className="row m-0">
                        {
                            reduxStateData?.length < 1 || reduxStateData == null ? (
                                <p className='text-center' >No Classwork Found</p>
                            ) : (
                                <>
                                    {
                                        reduxStateData?.map((data, key) => (
                                            <div key={key} className='col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12  text-start px-3 mb-3' >
                                                <div className='childs px-3 py-1 pt-3 rounded'>
                                                    <h5 className='text-dark text-capitalize'>{data.topic}</h5>
                                                    <div className='row py-2'>
                                                        <div className='col-8 '> <p className='cursor-pointer d-inline' onClick={() => action(data.image)}><InsertLinkIcon /> See Attachment</p></div>
                                                        {
                                                            typeProvider() !== 'student' &&
                                                            <div className='col-4 text-end'><DeleteIcon className="delete_icon" onClick={() => deleteClassWork(data.id)} sx={{ position: "absolute", margin: "-20px 10px 0 -25px", cursor: "pointer" }} /></div>
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
                            )
                        }

                    </div>
                )
            }


            <h4 className='text-start mt-4 mx-3'>Module Classwork:</h4>
            {
                localStorage.getItem('allow') === 'false' &&
                <Alert variant="outlined" severity="warning" >
                    Complete your current classwork assignment in progress first to attempt next assignment!
                </Alert>
            }
            {
                loading2 ? (
                    <Loader2 />
                ) : (
                    <>
                        {
                            !loading2 && !reduxStateData2 ? (
                                <p>No Module Classwork Found</p>
                            ) : (
                                <div className='row m-0'>
                                    {
                                        reduxStateData2?.map((data, index) => (
                                            <div key={index} className={`col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 text-start m-0 p-0 mb-4 ${localStorage.getItem('allow') === 'false' && 'disabeling_class'} `} >
                                                <div className=" px-lg-3 py-1 pt-3 rounded-top">
                                                    <div className={`rounded bg-light shadow-sm ${isDate(data.deadline) ? "" : ` ${typeProvider() === 'student' && "pointer-events-none"} `}`}>
                                                        <div className='pt-3 pb-2 px-3 bg1 rounded-top'>
                                                            <div className='row'>
                                                                <div className='col-10'><h5><FeedIcon sx={{ color: "white" }} /> {data.module_name}</h5></div>
                                                                {
                                                                    typeProvider() !== 'student' &&
                                                                    <div className='col-2'><DeleteIcon className="delete_icon" onClick={() => deleteModuleAssignment(data.id)} sx={{ color: "white", cursor: "pointer" }} /></div>
                                                                }
                                                            </div>

                                                        </div>
                                                        <div className='p-3 pb-0'>
                                                            <p>Deadline: {data.deadline}</p>
                                                            <p>Revisions: {data.revision}</p>
                                                            {
                                                                data.time_limit > 0 &&
                                                                <p>Time: {data.time_limit} Minutes</p>
                                                            }
                                                        </div>
                                                        <hr className='p-0 m-0' />
                                                        {data.selected_modules.split(/[, ]+/).map((moduleIndex) => (
                                                            <div className="row mb-2 rounded-bottom m-0 py-2 chapters_list" key={moduleIndex} onClick={() => openModuleAssignment(moduleIndex, data)} >
                                                                <div className='col-4'><img width="100%" src={chapterimg} alt="chapterimg" /></div>
                                                                <div className='col-8'>
                                                                    <p className='mt-3'>{chaptersList[moduleIndex]}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </>
                )
            }

        </StyledClassWork >
    )
}

export default ClassWorks;

const StyledClassWork = styled.div`
.childs{
    background-color: var(--color1);
    color: white;
}
.childs:hover{
    background-color: var(--color2);
    transform: scale(1.01);
    transition-duration: 100ms;
}
.delete_icon:hover{
    color:red;
    /* margin-left: -30px; */
}
    

`