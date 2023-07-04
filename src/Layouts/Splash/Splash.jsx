import React, { useState, useEffect } from 'react'
import './Splash.css'
import Logo from '../../assets/images/logo.png'
import School from '../../assets/images/school@2x.png'
import Loader1 from '../../common/Loader1/Loader1';
import bg from '../../assets/images/layout/btn@2x.png';
import Admin from '../../assets/images/layout/admin@2x.png';
import Teacher from '../../assets/images/layout/teacher@2x.png';
import Student from '../../assets/images/layout/student@2x.png';

import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
const Splash = () => {
  const navigate = useNavigate()
  const [layout, setlayout] = useState(true);
  const [listHighlight, setlistHighlight] = useState(4);
  const [routeUrl, setrouteUrl] = useState('');
  useEffect(() => {
    setInterval(() => {
      setlayout(true);
    }, 2000)
  }, [])
  const categories = [
    { name: 'Admin', logo: School, url: '/school-login', img_sec: Admin },
    { name: 'Teacher', logo: Teacher, url: '/teacher-login', img_sec: Teacher },
    { name: 'Student', logo: Student, url: '/student-login', img_sec: Student }
  ]

  useEffect(() => {
    if (localStorage.getItem("encrypted_data_ts")) {
      navigate('/dashboard');
    }
    if (localStorage.getItem("encrypted_data")) {
      navigate('/school-dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])



  return (
    <StyledSplash className='text-center'>
      {
        layout ? (
          <div className='container my-3 layout_splash_parent'>
            <h2 className='fw-bold' style={{ textShadow: "0px 1px 1px black" }} id="splash_title" ><span className='color1'>Izesan! </span>for <span className='color2'>Schools</span></h2>
            <img className="splash_image2" src={Logo} alt="..." />
            <div className='m-auto splash_content'>
              <p className='splash_content_lines' id="splash_description">To promote the use of African languages, Izesan! decided to  go to the heart of most learning experiences - the school! The newest feature on the Izesan! app, <b>Izesan! for Schools,</b> is a  supplementary resource that educational institutions can use  to assist their students in the facilitation of African language.</p>
              {
                categories.map((data, key) => (
                  <div id={`option_${data.name}`} className='row mb-4 m-0 splash_categories_list' style={{ border: `${listHighlight === key ? '2px solid orange' : ''}` }} key={key} onClick={() => setlistHighlight(key) + setrouteUrl(data.url)}>
                    <img src={bg} className='bg_img_style m-0 p-0' alt="..." />
                    <div className='col-8 p-0' style={{ borderRadius: "relative" }} >
                      <h4 className='categories_lable pt-2'>{data.name}</h4>
                    </div>
                    <div className='col-4 p-0' style={{ borderRadius: "relative" }} >
                      <img className='categories_imgs p-0' src={data.img_sec} alt="..." />
                    </div>
                  </div>
                ))
              }
              <button id="splash_next_btn" className={`btn btn-warning fw-bold fs-5 btn-md w-100 rounded-3 text-light ${routeUrl === '' ? 'disabled' : ''}`} onClick={() => navigate(routeUrl)} >Next</button>
            </div>
          </div>
        ) : (
          <>
            <Loader1 />
            <div className='position-absolute top-50 start-50 translate-middle ' >
              <img className='splash_image mb-5' src={Logo} alt="..." />
            </div>
            <p className='position-absolute bottom-0 splash_loader_content'>To promote the use of African languages, Izesan! decided to  go to the heart of most learning experiences - the school! The newest feature on the Izesan! app, <b>Izesan! for Schools,</b> is a  supplementary resource that educational institutions can use  to assist their students in the facilitation of African language.</p>
          </>
        )
      }
    </StyledSplash>
  )
}

export default Splash

const StyledSplash = styled.div`
.bg_img_style{
  width: 100%;
  position: absolute;
  z-index: -10;
  height: 100%;
}

`