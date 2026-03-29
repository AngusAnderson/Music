import React from 'react'
import '../../css/Artist_Page/Credit_Card.css'

const Credit_Card = ({ members = [] }) => {

  const uniqueMembers = Array.from(
    new Map(members.map(m => [m.name, m])).values()
  )

  return (
    <div className='credit_Card-wrapper'>
      <div className='credit-list'>
        {uniqueMembers.length > 0 ? (
          uniqueMembers.map((member) => (
            <div key={member.name} className="member-item">
              
              {/* NAME */}
              <span className="member-name">
                {member.name}
              </span>

              {/* ROLE (only if exists) */}

                {/* Come back to roles later on! */}

              {/* {member.role && (
                <span className="member-role">
                  {' '}• {member.role}
                </span>
              )} */}

            </div>
          ))
        ) : (
          <div>No members available</div>
        )}
      </div>
    </div>
  )
}

export default Credit_Card