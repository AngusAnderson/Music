import React from 'react'
import '../../css/Artist_Page/Credit_Card.css'

const Credit_Card = ({ members = [] }) => {
  return (
    <div className='credit_Card-wrapper'>
        <div className='credit-list'>
            {members.length > 0 ? (
                members.map((member, index) => (
                    <div key={index} className={`member-${index}`}>
                        {member.name} • {member.role}
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