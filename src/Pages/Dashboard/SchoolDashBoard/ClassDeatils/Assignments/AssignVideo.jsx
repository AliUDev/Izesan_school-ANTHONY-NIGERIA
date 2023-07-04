import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { api } from '../../../../../api';
import { setLoader } from '../../../../../redux/Features/Loader/loaderSlice';
import { useDispatch } from 'react-redux';
import Loader2 from '../../../../../common/Loader2/Loader2';
import chapters_img from '../../../../../assets/images/chapters.png'
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import { class_info, dataProvider } from '../../../../../data.provider';

const AssignVideo = ({ close, updateState, closeUpdate }) => {
    const [videos, setvideos] = useState([]);
    const [loading, setloading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        setloading(true);
        axios.get(`${api}get-videos?language=Hausa`)
            .then((res) => {
                setvideos(res?.data?.data);
                setloading(false);
            }).catch((err) => {
                console.log(err);
                setloading(false);
            })
    }, [])

    const [selected, setselected] = useState(null);

    const postVideo = () => {
        if (selected) {
            dispatch(setLoader(true));
            axios.post(`${api}assign-video`, {
                class_code: class_info().class_code,
                teacher_id: dataProvider().id,
                video_id: selected
            }).then((res) => {
            dispatch(setLoader(false));
                updateState();
                closeUpdate();
                toast.info("Video assigned successfully");
                close();
            }).catch((err) => {
            dispatch(setLoader(false));
                console.log(err)
            })
        } else {
            toast.info("Please Select Video");
        }
    }

    return (
        <StyledAssignVideo>
            {
                loading ? (
                    <div className='text-center'>
                        <Loader2 />
                    </div>
                ) : (
                    <>
                        {
                            videos?.length < 1 ? (
                                <>No Video Found</>
                            ) : (
                                <>
                                    <div className="row">
                                        <h3 className='mb-3 text-center'>Select Video</h3>
                                        {
                                            videos.map((data, index) => (
                                                <div key={index} className='col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12  mb-3 px-2 m-0' onClick={() => setselected(data.id)} >
                                                    <div className={`row border m-0 rounded option ${selected === data.id ? ' bg-success text-light' : ' text-light text-dark'} `} onClick={() => setselected(data.id)}>
                                                        <div className='col-5 div_bg' style={{ backgroundImage: `url(${chapters_img})` }}>
                                                        </div>
                                                        <div className='col-7'>
                                                            <p className="fw-bolder p-0 my-0 pt-2 text-truncate">{data.title}</p>
                                                            <br />
                                                            <p className='p-0 m-0'>{data.language}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </>
                            )
                        }
                        <Button onClick={postVideo} sx={{ marginTop: "15px", width: '20%', float:"right" }} size="large" variant="outlined">Post</Button>
                    </>
                )
            }
        </StyledAssignVideo >
    )
}

export default AssignVideo

const StyledAssignVideo = styled.div`
.option{
  height: 85px ;
  
}
.option:hover{
  transform: scale(1.01);
  cursor: pointer;
  box-shadow: 0 2px 3px 0px rgb(0 0 0 / 41%);
}
.div_bg {
  background-image: url('path/to/image.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

`