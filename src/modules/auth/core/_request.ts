import axios from 'axios';
const API_URL = import.meta.env.BASE_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/user/getuser`;
export const LOGIN_URL = `${API_URL}/user/login`;
export const PASSWORD_CHANGE_URL = `${API_URL}/user/reset-password`;
export const REQUEST_PASSWORD_URL = `${API_URL}/user/forgot-password`;

type loginRequest = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: loginRequest) => {
  const response = await axios.post<any>(LOGIN_URL, {
    email,
    password,
  });
  return response?.data;
};

export const getUserByToken = async (token: string) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  return axios
    .get<unknown>(GET_USER_BY_ACCESSTOKEN_URL, { headers: headers })
    .then((response) => response?.data);
};
