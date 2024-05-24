
// let ver = false ;

// export const getVer = () => {
//     return ver;
// };

// export const setVer = (value: boolean) => {
//     ver = value;
// };


// let user = '';

// export const getUser = () => {
//     return user;
// };

// export const setUser = (value: string) => {
//     user = value;
// };



let user = '';

export const getVer = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const setVer = (value: string) => {
  localStorage.setItem('isAuthenticated', value);
};

export const getUser = () => {
  return localStorage.getItem('user');
};

export const setUser = (value: string) => {
  localStorage.setItem('user', value);
  user = value;
};



