import React from 'react'
import {useHistory} from 'react-router-dom'

export default function Watcher({ details }) {
const history = useHistory()

  return (
    <div className='watcher' onClick= {() => {history.push('/singleWatcher', {details})}} >
      <div className='topRight'>
        <div>Add</div>
        <div>Delete</div>
      </div>
      <h3>{details.title}</h3>
      <p>
      yourprice - {details.maxPrice}
      </p>
      <p>
        currentPrice - {details.pastPrices[details.pastPrices.length - 1].price}
      </p>
    </div>
  )
}
