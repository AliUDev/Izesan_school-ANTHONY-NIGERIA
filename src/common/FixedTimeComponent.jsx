import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { typeProvider } from '../Helper/ParticipantTypeProvider';

const FixedTimeComponent = () => {
  const [myValue, setMyValue] = useState(localStorage.getItem("counter"));

  useEffect(() => {
    const interval = setInterval(() => {
      const value = localStorage.getItem("counter");
      if (value !== myValue) {
        setMyValue(value);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [myValue]);

  return (
    <>
    { localStorage.getItem("counter") && typeProvider() === "student" ?
    (<StyledFixedTimeComponent className='position-fixed top-0 start-0'>
     
        <div className='child text-light text-center py-2 px-4 rounded '>
          <p className='time p-0 m-0'>{myValue}</p>
          <p className='p-0 text m-0'>Time Remaining</p>
        </div>
      
    </StyledFixedTimeComponent>):(
      ""
    )
}
</>
  )
}

export default FixedTimeComponent

const StyledFixedTimeComponent = styled.div`
margin:69px 0px 0px 42px;
z-index:1;
@media (max-width: 450px) {
   .child{
    display: flex;
    flex-direction: column;
   }
    width:80px;
    height: 80px;
    margin:47px 0px 0px 10px;
  .time, .text{
    font-size: 10px !important;
  }
}
.time, .text{
  font-size: 1.5rem;
}
.child{
  background-color: var(--color2);
  opacity: 0.9;

}
`