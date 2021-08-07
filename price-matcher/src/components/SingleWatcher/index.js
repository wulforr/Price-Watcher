import React, { useState } from 'react';
import { XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { getDates, getMaxPrice, getMinPrice, getFormattedText, getPrice } from '../../utils/utils';
import style from './style.module.css';

export default function SingleWatcher(props) {
  const [chartFilter, setChartFilter] = useState('daily');
  const details = props.location.state.details;
  const data = details.pastPrices;
  const dates = getDates(data, chartFilter);
  const maxPrice = getMaxPrice(data);
  const minPrice = getMinPrice(data);
  const currentPrice = getPrice(details);
  // const getYAxisTicks = () => {
  //   let ticksArray = [];
  //   ticksArray.push(0);
  //   let x = 0;
  //   while (x < maxPrice) {
  //     x += parseInt(maxPrice / 5);
  //     ticksArray.push(x);
  //   }
  //   ticksArray.push(x + parseInt(maxPrice / 5));
  //   return ticksArray;
  // };

  console.log(dates);
  const renderLineChart = (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={600} height={350} data={dates}>
        <defs>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="60%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" stroke="#333" />
        <YAxis
          stroke="#333"
          type="number"
          // allowDecimals={false}
          // ticks={getYAxisTicks()}
          // domain={[0, maxPrice]}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
  return (
    <div className={style.singleWatcherWrapper}>
      <div className={style.card}>
        <h2 className={style.chartTitle}>{getFormattedText(details.title, 50)}</h2>
        <ul className={style.priceDetails}>
          <li>
            <span className={style.name}>Current Price</span>
            <span className={style.value}>&#8377;{currentPrice}</span>
          </li>
          <li>
            <span className={style.name}>Maximum Price</span>
            <span className={style.value}>&#8377;{maxPrice}</span>
          </li>
          <li>
            <span className={style.name}>Minimum Price</span>
            <span className={style.value}>&#8377;{minPrice}</span>
          </li>
          <li>
            <span className={style.name}>Threshold Price</span>
            <span className={style.value}>&#8377;{currentPrice}</span>
          </li>
          <li>
            <span className={style.name}>Average Price</span>
            <span className={style.value}>&#8377;{currentPrice}</span>
          </li>
          <li>
            <span className={style.name}>Suggested Price</span>
            <span className={style.value}>&#8377;{currentPrice}</span>
          </li>
        </ul>
      </div>
      <div className={style.card}>
        <div className={style.optionsWrapper}>
          <div className={style.options}>
            <button
              className={`${style.chartOptionBtn} ${
                chartFilter === 'daily' ? style.activeBtn : ''
              }`}
              onClick={() => setChartFilter('daily')}
            >
              Daily
            </button>
            <button
              className={`${style.chartOptionBtn} ${
                chartFilter === 'weekly' ? style.activeBtn : ''
              }`}
              onClick={() => setChartFilter('weekly')}
            >
              Weekly
            </button>
            <button
              className={`${style.chartOptionBtn} ${
                chartFilter === 'monthly' ? style.activeBtn : ''
              }`}
              onClick={() => setChartFilter('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className={style.chartWrapper}>{renderLineChart}</div>
      </div>
      {/* <div className={style.priceDetails}>
        <p>Maximum Price : {maxPrice}</p>
        <p>Minimum Price : {minPrice}</p>
      </div> */}
    </div>
  );
}
