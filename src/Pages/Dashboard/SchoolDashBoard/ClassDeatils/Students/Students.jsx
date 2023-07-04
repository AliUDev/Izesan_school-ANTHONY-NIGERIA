import styled from '@emotion/styled';
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentData } from '../../../../../redux/Features/StudentSlice/studentSlice';
import Loader2 from '../../../../../common/Loader2/Loader2';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import AddStudent from './AddStudent';
import axios from 'axios';
import { toast } from 'react-toastify';
import { api } from '../../../../../api';
import { typeProvider } from '../../../../../Helper/ParticipantTypeProvider';
import Swal from 'sweetalert2';
import { class_info } from '../../../../../data.provider';

const Students = ({ params, modal, reset }) => {
  const dispatch = useDispatch();
  const getState = () => {
    dispatch(fetchStudentData(params));
  }
  useEffect(() => {
    getState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const reduxStateData = useSelector(state => state.studentDetails.allStudents);
  const loading = useSelector(state => state.studentDetails?.isLoading);

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

  useEffect(() => {
    if (modal === 'student') {
      handleOpen()
    }
  }, [modal])


  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setOpen(false)
  }
  const deleteStudent = (paramter) => {
    Swal.fire({
      title: 'Do you want to delete this student?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`${api}delete-student`, {
          id: class_info().id,
          participants: paramter,
        }).then((res) => {
          if (res.data.code !== 401) {
            getState();
            Swal.fire(
              'Deleted!',
              'Student has been deleted.',
              'success'
            )
            toast.info(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        })
      }
    })






  }

  return (
    <StyledStudent>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AddStudent close={handleClose} getAgain={getState} />
          </Box>
        </Modal>
      </div>

      {
        loading ? (
          <div className='position-absolute top-50 start-50 translate-middle'> <Loader2 /></div>

        ) : (
          <>
            {
             reduxStateData? (
              <>
                  <div className='row'>
                    {reduxStateData?.map(student => (

                      <div key={student.id} className='col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12  text-start p-1'>
                        <div className='childs px-3 py-1 pt-3 rounded text-start'>
                          <div className='row'>
                            <div className='col-10'>
                              <p className='py-4 text-truncate' style={{ maxWidth: "100%" }} ><span className='alphabet' >{student.student_name[0]}</span>{student.student_name}</p>
                            </div>
                            {
                              typeProvider() !== 'student' &&
                              <div className='col-2 text-center'>
                                <DeleteIcon className='delete_icon' onClick={() => deleteStudent(student.id)} />
                              </div>
                            }
                          </div>
                        </div>
                      </div>

                    ))}
                  </div>
                </>

              ) : (

                <h4 className='position-absolute top-50 start-50 translate-middle'>No Student Found</h4>
              )
            }
          </>
        )
      }

    </StyledStudent>
  )
}

export default Students;

const StyledStudent = styled.div`
.childs{
    background-color: var(--color2);
    color: white;
}
.childs:hover{
    background-color: var(--color3);
    transform: scale(1.01);
    transition-duration: 100ms;
}
.alphabet{
  background-color: var(--color4);
  padding: 20px 25px;
  border-radius: 50%;
  margin-right: 13px;
}
.delete_icon{
  color: #ffffff;
  margin-top: 24px;
}
.delete_icon:hover{
  transition-duration: 100ms;
  cursor: pointer;
  transform: scale(1.1);
  color:red;
}
@media (max-width: 425px) {
  font-size: 13px;
}
`