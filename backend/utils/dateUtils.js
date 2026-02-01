/**
 * Convert UTC date to Indian Standard Time (Asia/Kolkata)
 */
const convertUTCToIST = (utcDate) => {
  if (!utcDate) return utcDate;

  const date = new Date(utcDate);
  if (isNaN(date.getTime())) return utcDate; // Invalid date, return as is

  // Add 5.5 hours for IST
  return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
};

/**
 * Convert timestamps in object
 */
const convertTimestampsToIST = (
  obj,
  fields = ["createdAt", "updatedAt"]
) => {
  if (!obj) return obj;

  const plainObj = obj.toObject ? obj.toObject() : obj;
  const converted = { ...plainObj };

  fields.forEach((field) => {
    if (converted[field]) {
      converted[field] = convertUTCToIST(converted[field]);
    }
  });

  return converted;
};

/**
 * Convert timestamps in array
 */
const convertArrayTimestampsToIST = (
  arr,
  fields = ["createdAt", "updatedAt"]
) => {
  if (!Array.isArray(arr)) return arr;

  return arr.map((item) =>
    convertTimestampsToIST(item, fields)
  );
};

module.exports = {
  convertUTCToIST,
  convertTimestampsToIST,
  convertArrayTimestampsToIST
};
