import * as dayjs from 'dayjs';

export const getPrice = (watcherDetails) => {
  const price = watcherDetails.pastPrices[watcherDetails.pastPrices.length - 1].price;
  if (!price) return 'Item is unavailable on the website right now';
  return price;
};

export const getDates = (pastPrices, filter = 'weekly') => {
  let pastPricesWithFormattedDates = pastPrices;
  let tempArray = [];
  switch (filter) {
    case 'daily': {
      return pastPrices.map((ele) => {
        return { ...ele, date: dayjs(new Date(ele.date)).format('DD/MM') };
      });
    }
    case 'weekly': {
      pastPrices.forEach((ele, index) => {
        if (index % 7 === 0) {
          tempArray.push({ ...ele, date: dayjs(new Date(ele.date)).format('DD/MM') });
        }
      });
      return tempArray;
    }
    case 'monthly': {
      pastPrices.forEach((ele, index) => {
        if (index % 30 === 0) {
          tempArray.push({ ...ele, date: dayjs(new Date(ele.date)).format('MM/YY') });
        }
      });
      return tempArray;
    }
    default: {
      return pastPricesWithFormattedDates;
    }
  }
};

export const getMaxPrice = (data) => {
  let maxPrice = data[0].price;
  data.forEach((ele) => {
    if (ele.price > maxPrice) {
      maxPrice = ele.price;
    }
  });
  return maxPrice;
};

export const getMinPrice = (data) => {
  let minPrice = data[0].price;
  data.forEach((ele) => {
    if (ele.price && ele.price < minPrice && ele.price != 0) {
      minPrice = ele.price;
    }
  });
  return minPrice;
};

export const getFormattedText = (text, maxLength = 40) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

export const getPast30DaysData = (pastPrices) => {
  if (pastPrices.length <= 30) {
    return pastPrices;
  }
  return pastPrices.slice(-30);
};

export const getAveragePrice = (data) => {
  const sum = data.reduce((acc, curr) => acc + parseInt(curr.price), 0);
  return (sum / data.length).toFixed(2);
};
