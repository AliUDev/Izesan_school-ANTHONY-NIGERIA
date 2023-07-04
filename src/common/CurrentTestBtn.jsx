import styled from '@emotion/styled'
import React from 'react'
// import AddIcon from '@mui/icons-material/Add';
import ForwardIcon from '@mui/icons-material/Forward';
const CurrentTestBtn = () => {
  return (
    <StyledAddClassButton>
      <div className="wrapper position-fixed end-0 styling">
  <div className="btn-container">
    <p className="btn btn-top" data-hover="Go Back To Test"><ForwardIcon/>Go Back To Test </p>
  </div>
</div>
    </StyledAddClassButton>
  )
}

export default CurrentTestBtn

const StyledAddClassButton = styled.div`
.wrapper{
z-index: 1000;
top: 8%;
}
.btn {
  display: inline-block;
  position: relative;

  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
  padding: 20px 30px;
  text-align: center;
  background: var(--color3);
  color: #fff;
  border-radius: 5px;
  perspective: 300px;
  margin: 15px;
  box-shadow: 0 4px 50px -5px rgba(0, 0, 0, 0.1);
  &::before {
    content: attr(data-hover);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color2) ;
    color: white;
    font-size: 17px;
    font-weight: 600;
    padding: 20px 30px;
    border-radius: 5px;
    transform-style: preserve-3d;
    transition: 200ms opacity, 500ms transform;
    perspective: 300px;
    opacity: 0;
  }
  &:hover {
    &::before {
      opacity: 1;
    }
  }
}

.btn-top {
  &::before {
    transform: rotateX(90deg) translateZ(30px);
  }
  &:hover,
  &:active {
    &::before {
      transform: rotateX(0deg);
    }
  }
}

.btn-right {
  &::before {
    transform: rotateY(90deg) translateZ(70px);
  }
  &:hover,
  &:active {
    &::before {
      transform: rotateY(0deg);
    }
  }
}

.btn-bottom {
  &::before {
    transform: rotateX(-90deg) translateZ(30px);
  }
  &:hover,
  &:active {
    &::before {
      transform: rotateY(0deg);
    }
  }
}

.btn-left {
  &::before {
    transform: rotateY(-90deg) translateZ(60px);
  }
  &:hover,
  &:active {
    &::before {
      transform: rotateY(0deg);
    }
  }
}
`