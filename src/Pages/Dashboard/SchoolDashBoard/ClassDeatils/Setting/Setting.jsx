import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';

const Setting = () => {
  const [classInfo, setclassInfo] = useState({});
  useEffect(() => {
    const rawData2 = localStorage.getItem('class_info')
    const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);
    setclassInfo(parsedData);
  }, [])
  const copyFunction = async (param, type) => {
    let text = param;
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        toast.success('Code copied to clipboard');
      } else {
        toast.success('Link copied to clipboard');
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }

  }
  return (
    <div className='text-start mt-3'>
      <div className='row m-0'>
        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
          <h5>Classroom code:</h5>
          <div className='bg-light border rounded row pt-3 mt-1'>
            <div className='col-6'><p>{classInfo.class_code}</p></div>
            <div className='col-6 text-end'><p className='text-warning fw-bolder cursor-pointer' onClick={() => copyFunction(classInfo.class_code, 'code')} >Copy Code</p></div>
          </div>
        </div>
        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
          <h5>Classroom link:</h5>
          <div className='bg-light border rounded row pt-3 mt-1'>
            <div className='col-6'><p>{classInfo.class_link}</p></div>
            <div className='col-6 text-end'><p className='text-warning fw-bolder cursor-pointer' onClick={() => copyFunction(classInfo.class_link, 'link')} >Copy Link</p></div>
          </div>
        </div>
        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
          <h5>Classroom name:</h5>
          <div className='bg-light border rounded row pt-3 mt-1'>
            <div className='col-6'><p>{classInfo.classroom_name}</p></div>
          </div>
        </div>
        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 px-3 mb-3'>
          <h5>Language being taught:</h5>
          <div className='bg-light border rounded row pt-3 mt-1'>
            <div className='col-6'><p>{classInfo.language}</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting