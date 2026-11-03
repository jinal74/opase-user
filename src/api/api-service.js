const axios = require("axios");
export function GetApi(path) {
  let token = "Bearer " + localStorage.getItem("opus_token");
  let headers = { Authorization: token, "Content-Type": "application/json" };
  const GetApiData = axios
    .get(path, { headers: headers })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response.data.message === "The session has Expired. Please log in again!") {
        localStorage.removeItem("opus_token");
        window.location.href = "/";
      }
      console.log(error);
      return error.response;
    });
  return GetApiData;
}

export function PostApi(path, body) {
  let tokenData;
  if (localStorage.getItem("opus_token")) {
    tokenData = "Bearer " + localStorage.getItem("opus_token");
  } else {
    tokenData = "";
  }
  let headers = {
    Authorization: tokenData,
    ContentType: 'application/json',
    Accept: 'application/pdf'
  };
  const PostApiData = axios
    .post(path, body, { headers: headers })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response.data.message === "The session has Expired. Please log in again!") {
        localStorage.removeItem("opus_token");
        window.location.href = "/";
      }
      return error.response;
    });

  return PostApiData;
}
