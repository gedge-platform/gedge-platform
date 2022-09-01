const setItem = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value));
};
// 로그인하면 여기에 user 정보와 token 저장

const getItem = (key) => {
  return JSON.parse(window.sessionStorage.getItem(key));
};

const removeItem = (key) => {
  window.sessionStorage.removeItem(key);
};

export { setItem, getItem, removeItem };
