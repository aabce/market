'use strict';

module.exports.calculateProductRating = (ratings) => {
  let totalSum = Object.values(ratings).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  let tempSum = [];
  for (let [key, value] of Object.entries(ratings)) {
    tempSum.push(Number(key) * value);
  }
  let totalMul = tempSum.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return Math.round(totalMul / totalSum * 100) / 100;
};
