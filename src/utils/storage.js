const STORAGE_KEY = 'seec_shop';

const getData = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

const getVal = (key, defaultVal) => {
  const data = getData();
  return data[key] === undefined ? defaultVal : data[key];
};

const setVal = (key, val) => {
  const data = getData();
  data[key] = val;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export {
    getVal,
    setVal
};
