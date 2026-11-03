export const ApiBaseUrl = Number(process.env.REACT_APP_LIVE) === 1 ? process.env.REACT_APP_LIVE_BASE_URL : process.env.REACT_APP_LOCAL_BASE_URL;
export const WebsiteUrl = Number(process.env.REACT_APP_LIVE) === 3 ? process.env.REACT_APP_LIVE_MAIN_URL : process.env.REACT_APP_LOCAL_MAIN_URL;
export const WebsiteUrl1 = "https://node.staging.rentechdigital.com:5013";

export const API_Path = {
  registerTalent: ApiBaseUrl + "user/talent-register",
  login: ApiBaseUrl + "user/login",
  forgotPassword: ApiBaseUrl + "user/forgotpass",
  verifyOtp: ApiBaseUrl + "user/verifyotp",
  Reset_password: ApiBaseUrl + "user/resetpass",
  changePassword: ApiBaseUrl + "user/changepass",
  checkEmailverify: ApiBaseUrl + "user/choose-verification",

  addImage: ApiBaseUrl + "user/imgtest",
  addVideo: ApiBaseUrl + "home/uploadvideo",

  getAllProfileData: ApiBaseUrl + "user/getProfileData",
  getUsersDetails: ApiBaseUrl + "user/user-detail",
  editProfileData: ApiBaseUrl + "user/editprofile",
  getUserFollowing: ApiBaseUrl + "user/following",
  socialLogin: ApiBaseUrl + "user/social",

  getReview: ApiBaseUrl + "home/get-review",
  addReview: ApiBaseUrl + "home/review",

  getTalent: ApiBaseUrl + "home/talent",
  getTalentDetails: ApiBaseUrl + "home/talent-detail",
  managetalentStatus: ApiBaseUrl + "home/manage-talent",

  getAllRequestData: ApiBaseUrl + "home/request-get",
  BookNewTalent: ApiBaseUrl + "home/new-request",
  GetRequestDetail: ApiBaseUrl + "home/request-details",
  GetReceivedVideo: ApiBaseUrl + "home/request-received",

  GetChatData: ApiBaseUrl + "home/chatGet",

  getBankDetail: ApiBaseUrl + "home/banking",
  removeCard: ApiBaseUrl + "home/bankid-remove",

  addPaymentData: ApiBaseUrl + "home/stripe-payment",
  GetTransactionHistory: ApiBaseUrl + "user/wallet",
  getPaymentReceipt: ApiBaseUrl + "user/payment-receipt",

  getNotification: ApiBaseUrl + "user/notifget",

  GetTalentNewDetailData: ApiBaseUrl + "home/popular-singel",
  getPopularData: ApiBaseUrl + "home/popular",
  GetTrendingData: ApiBaseUrl + "home/trending",
  getRecommendData: ApiBaseUrl + "home/recommended-view",
  getFeaturedData: ApiBaseUrl + "home/featured",
  emailSubscribe: ApiBaseUrl + "user/email-subscribe",
};
