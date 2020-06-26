import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import moment from 'moment'

export default function SingleWatcher(props) {
  const details = props.location.state.details
  const data = details.pastPrices
  const dates = data.map(ele => {
    return {...ele,date:moment(new Date(ele.date)).format('DD/MM/YY')}
  })
  console.log(data)
  // const Xticks = data.map(ele => ele.date)
  const renderLineChart = (
    <LineChart width={600} height={300} data={dates} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <Line type="monotone" dataKey="price" stroke="#06d69e" />
      {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" /> */}
      <XAxis dataKey="date" stroke='#333' />
      <YAxis stroke='#333' />
      <Tooltip />
    </LineChart>
  );
  return (
    <div style={{padding:'30px'}}>
      <h2 style={{marginTop:0}} className='chartTitle'>
      {details.title}
      </h2>
      <h3 className='lighten'>Price Graph</h3>
      {renderLineChart}
    </div>
  )
}
