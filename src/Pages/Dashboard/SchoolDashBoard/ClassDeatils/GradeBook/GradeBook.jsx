import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchgradeData } from '../../../../../redux/Features/GradesSlice/gradeSlice';
import styled from '@emotion/styled';
import Loader2 from '../../../../../common/Loader2/Loader2';
// import { fetchDataofassignment } from '../../../../../redux/Features/AssignmentSlice/AssignmentSlice';

const GradeBook = ({ params }) => {
  // defining dispatch to get data from the redux state
  const dispatch = useDispatch();

  // using use effect to get data and passing the param value in to the redux function 
  useEffect(() => {
    dispatch(fetchgradeData(params));
    // dispatch(fetchDataofassignment(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  // destructuring the array to get data from the redux state using useSelector
  const { allgrades, isLoading } = useSelector(state => state.gradeBookDetails);
  // const { allassignment } = useSelector(state => state.assignmentDetails);

  // calculating total number of points of all file assignments
  // const allAssignmentPoints = () => {
  //   let numval = 0;
  //   allassignment?.data?.forEach(element => numval += parseFloat(element.points));
  //   return numval;
  // }
  // calculating the avarage of the file assignment and module assignment
  // const calculating = (files, modules) => {
  //   let numfile = 0, nummodule = 0;
  //   files?.forEach(element => numfile += parseFloat(element?.grade));
  //   modules?.forEach(element => nummodule += parseFloat(element?.chapter_progress));
  //   const nummodule_percent = nummodule / modules?.length;
  //   if (nummodule_percent) {
  //     return (((numfile / allAssignmentPoints() * 100) + nummodule_percent) / 2).toFixed(2);
  //   } else {
  //     return ((numfile / allAssignmentPoints() * 100)).toFixed(2);
  //   }
  // }


  return (
    <StyledGradeBook>
      {
        isLoading ? (
          <div className='position-absolute top-50 start-50 translate-middle'>
            <Loader2 />
          </div>
        ) : (
          <div>
            {
              allgrades?.data ?
                (
                  <div className='row m-0'>
                    {allgrades?.data?.map((data, key) => (
                      <div key={key} className='col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 text-start p-1'>
                        <div className='p-1'>
                          <div className='row childs m-0 text-center border'>
                            <div className='col-4 col-md-3 bg-success text-light rounded p-2'>
                              <h5 className='mt-2'>Points</h5>
                              <h3>{data.quizes[0].progress}</h3>
                            </div>
                            <div className='col-8 col-md-9 mt-1'>
                              <div className='row mt-2 py-1 text-start'>
                                <div className='col-6'><p className='fw-bold'>Name</p></div>
                                <div className='col-6'><p>{data.student_name}</p></div>
                                <div className='col-6'><p className='fw-bold'>Roll No</p></div>
                                <div className='col-6'><p>{data.roll_no}</p></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                ) : (
                  <h4 className='position-absolute top-50 start-50 translate-middle'>No Grade Book Data Found</h4>
                )
            }
          </div>
        )
      }
    </StyledGradeBook>
  )
}

export default GradeBook

const StyledGradeBook = styled.div`
.childs{
    background-color: white;
    padding: 7px;
    border-radius:10px;
    box-shadow: 0 3px  5px 0px rgb(0,0,0,0.4); 
}
.childs:hover{
    transform: scale(1.01);
    transition-duration: 100ms;
}
`