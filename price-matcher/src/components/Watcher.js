import React from 'react'

export default function Watcher({ details }) {
  return (
    <div className='watcher'>
      <li>
        id: {details._id}
      </li>
      <li>
      price -{details.maxPrice}
      </li>
    </div>
  )
}
