const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookUpObject =(rows, key, value) => {
  let lookupObj = {};
  const newArr = [...rows];
  newArr.forEach((row) => {
    return (lookupObj[row[key]] = row[value]);
  });
  return lookupObj;
};

