import React from 'react'
import StudentProfile from './StudentProfile'
import TeacherProfile from './TeacherProfile'
import {typeProvider} from '../../../../Helper/ParticipantTypeProvider'
const ProfileTS = () => {
  return (
    <div>
      {
        typeProvider() === 'student' ? (
          <StudentProfile />
        ) : (
          <TeacherProfile />
        )
      }
    </div>
  )
}

export default ProfileTS