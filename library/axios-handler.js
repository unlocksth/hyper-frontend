require("dotenv").config();

const axios = require("axios");
const conf = require("../config/index.json");
const API_URL = process.env.API_URL;

// Step-1: Create a new Axios instance with a custom config.
// The timeout is set to 10s. If the request takes longer than
// that then the request will be aborted.
const customAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "api-key": "eyJz-CI6Ikp-4pWY-lhdCI6" },
});

// Step-2: Create token, request, response & error handlers

const requestToken = async () => {
  return axios({
    method: "POST",
    url: `${API_URL}/d-mar/u-bar`,
    data: {
      username: conf.jwt.credential.USERNAME,
      password: conf.jwt.credential.PASSWORD,
    },
  });
};

const requestHandler = async (request) => {
  // Token will be dynamic so we can use any app-specific way to always
  // fetch the new token before making the call
  const response = await requestToken();
  request.headers.Authorization = `Bearer ${response.data.token}`;
  return request;
};

// const responseHandler = response => {
//     if (response.status === 401) {
//         window.location = '/auth/login';
//     }

//     return response;
// };

const errorHandler = (error) => {
  return Promise.reject(error);
};

// Step-3: Configure/make use of request & response interceptors from Axios
// Note: You can create one method say configureInterceptors, add below in that,
// export and call it in an init function of the application/page.
customAxios.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
);

// customAxios.interceptors.response.use(
//     (response) => responseHandler(response),
//     (error) => errorHandler(error)
//  );

// Step-4: Export the newly created Axios instance to be used in different locations.
exports.module = customAxios;
