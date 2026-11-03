import React, { useEffect, useState } from "react";
import FrontendLayout from "../components/Layout/FrontendLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import talent from "../images/talent-1.png";
import nodatafound from "../images/nodatafound.png";
import { API_Path } from "../const";
import { PostApi } from "../api/api-service";
import { toast } from "react-toastify";
import Subscribe from "../components/Layout/Subscribe";

let val = [];
let myArr = [];
let category = [];
let response = [];
let service = [];
let price = [];
let review = [];
let priceArr = [];

export default function AllTrending() {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [popular, setPopular] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [params, setParams] = useState([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const urlParams = useParams();
  const location = useLocation();

  useEffect(() => {
    urlParams?.type === "1" ? getRecommendData() : urlParams?.type === "2" ? getTrendingData() : urlParams?.type === "3" ? getFeaturedData() : urlParams?.type === "4" && getPopularData();

    // set filter url code
    let myArr1 = JSON.parse(localStorage.getItem("filter"));
    // val = window.location.href?.split("?").length > 1 ? window.location.href?.split("?").pop().split("&") : [];
    val = location?.search?.split("?").length > 1 ? location?.search?.split("?").pop().split("&") : [];
    let url = window.location.href?.split("?").length > 1 ? window.location.href?.split("?")[0] : window.location.href;
    setParams([...val]);
    setUrl(url);

    val?.length > 0 &&
      val?.map((item) => {
        let data = {
          value: item,
          id: makeid(6),
        };
        if (!myArr.some((item) => item.value === data.value)) {
          myArr.push(data);
        }
        setFilterData([...myArr]);
        if (document.getElementById(`${item}-filter`)) {
          document.getElementById(`${item}-filter`).checked = true;
        }
      });
  }, []);

  const getTrendingData = () => {
    let data = {
      option: {
        sizePerPage: 10,
        search: "",
        totalRecord: 0,
        page: 0,
        sort: "id",
        order: "DESC",
      },
      sortby: [priceArr[0]?.value],
      category: category.length > 0 ? category?.map((item) => item.value) : [],
      price: price.length > 0 ? price?.map((item) => item) : [],
      services: service.length > 0 ? service?.map((item) => item.value) : [],
      response: response.length > 0 ? response?.map((item) => item.value) : [],
      reviewRating: review.length > 0 ? review?.map((item) => item.value) : [],
      nuberReview: [],
    };

    const getTrendingData = new Promise((resolve) => {
      resolve(PostApi(API_Path.GetTrendingData, data));
    });

    getTrendingData.then(async (res) => {
      if (res.status === 200) {
        setData(res.data.data.trading);
        setLoading(true);
        toast.success(res.data.massage);
      } else {
        toast.error(res.data.massage);
      }
    });
  };

  const getRecommendData = () => {
    let data = {
      option: {
        sizePerPage: 10,
        search: "",
        totalRecord: 0,
        page: 0,
        sort: "id",
        order: "DESC",
      },
      sortby: [priceArr[0]?.value],
      category: category.length > 0 ? category?.map((item) => item.value) : [],
      price: price.length > 0 ? price?.map((item) => item) : [],
      services: service.length > 0 ? service?.map((item) => item.value) : [],
      response: response.length > 0 ? response?.map((item) => item.value) : [],
      reviewRating: review.length > 0 ? review?.map((item) => item.value) : [],
      nuberReview: [],
    };

    const getRecommendData = new Promise((resolve) => {
      resolve(PostApi(API_Path.getRecommendData, data));
    });

    getRecommendData.then(async (res) => {
      if (res.status === 200) {
        setData(res.data.data.recommended);
        setLoading(true);
        toast.success(res.data.massage);
      } else {
        toast.error(res.data.massage);
      }
    });
  };

  const getFeaturedData = () => {
    let data = {
      option: {
        sizePerPage: 10,
        search: "",
        totalRecord: 0,
        page: 0,
        sort: "id",
        order: "DESC",
      },
      sortby: [priceArr[0]?.value],
      category: category.length > 0 ? category?.map((item) => item.value) : [],
      price: price.length > 0 ? price?.map((item) => item) : [],
      services: service.length > 0 ? service?.map((item) => item.value) : [],
      response: response.length > 0 ? response?.map((item) => item.value) : [],
      reviewRating: review.length > 0 ? review?.map((item) => item.value) : [],
      nuberReview: [],
    };

    const getFeaturedData = new Promise((resolve) => {
      resolve(PostApi(API_Path.getFeaturedData, data));
    });

    getFeaturedData.then(async (res) => {
      if (res.status === 200) {
        setData(res.data.data.featured);
        setLoading(true);
        toast.success(res.data.massage);
      } else {
        toast.error(res.data.massage);
      }
    });
  };

  const getPopularData = () => {
    let data = {
      option: {
        sizePerPage: 10,
        search: "",
        totalRecord: 0,
        page: 0,
        sort: "id",
        order: "DESC",
      },
      sortby: [priceArr[0]?.value !== null && priceArr[0]?.value],
      category: category.length > 0 ? category?.map((item) => item.value) : [],
      price: price.length > 0 ? price?.map((item) => item) : [],
      services: service.length > 0 ? service?.map((item) => item.value) : [],
      response: response.length > 0 ? response?.map((item) => item.value) : [],
      reviewRating: review.length > 0 ? review?.map((item) => item.value) : [],
      nuberReview: [],
    };

    const getPopularData = new Promise((resolve) => {
      resolve(PostApi(API_Path.getPopularData, data));
    });

    getPopularData.then(async (res) => {
      if (res.status === 200) {
        setData(res.data.data.popular);
        setLoading(true);
        toast.success(res.data.massage);
      } else {
        toast.error(res.data.massage);
      }
    });
  };

  const handleClick = (id, data) => {
    navigate(`/book-talent/${id}`, { state: { image: data.image, fullname: data.fullname } });
  };
  const makeid = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleChange = (e) => {
    let url1 = `/all-trending/${urlParams?.type}/`;

    if (!myArr.includes(e.target.value) && e.target.checked) {
      let data = {
        id: makeid(6),
        value: e.target.value,
      };
      myArr.push(data);

      setFilterData([...myArr]);

      if (!val.includes(e.target.value)) {
        val.push(e.target.value);
      }

      setParams([...val]);

      url1 = url1 + "?" + val.join().replaceAll(",", "&");
      window.history.replaceState("", "", url1);

      if ((e.target.value === "Alphabetical" || e.target.value === "Newest" || e.target.value === "recommend" || e.target.value === "reviews") && e.target.checked) {
        if (!category.includes(e.target.value)) {
          category.push(data);
        }
      }

      if ((e.target.value === "< 2 day" || e.target.value === "< 3 day" || e.target.value === "< 4 day" || e.target.value === "< 5 day" || e.target.value === "< 6 day") && e.target.checked) {
        if (!response.includes(e.target.value)) {
          response.push(data);
        }
      }

      if ((e.target.value === "video" || e.target.value === "chat") && e.target.checked) {
        if (!service.includes(e.target.value)) {
          service.push(data);
        }
      }

      if ((e.target.value === "$0 - $100" || e.target.value === "$100 - $200" || e.target.value === "$200 - $300" || e.target.value === "$300 - $400" || e.target.value === "$500+") && e.target.checked) {
        if (!price.includes(e.target.value)) {
          price.push(e.target.value.replaceAll("$", ""));
        }
      }

      if ((e.target.value === "1 Stars & Up" || e.target.value === "2 Stars & Up" || e.target.value === "3 Stars & Up" || e.target.value === "4 Stars & Up") && e.target.checked) {
        if (!review.includes(e.target.value)) {
          review.push({ ...data, value: data?.value?.replaceAll(" Stars & Up", "") });
        }
      }
    } else {
      myArr = myArr.filter((item) => item.value !== e.target.value);
      setFilterData([...myArr]);

      let filtered = params?.filter((item) => item !== e.target.value);
      val = filtered;
      setParams([...val]);
      url1 = val?.length >= 1 ? url1 + "?" + val?.join().replaceAll(",", "&") : url1 + val?.join().replaceAll(",", "&");

      window.history.replaceState("", "", url1);

      if (e.target.value === "Alphabetical" || e.target.value === "Newest" || e.target.value === "recommend" || e.target.value === "reviews") {
        category = category.filter((item) => item.value !== e.target.value);
      }

      if (e.target.value === "< 2 day" || e.target.value === "< 3 day" || e.target.value === "< 4 day" || e.target.value === "< 5 day" || e.target.value === "< 6 day") {
        response = response.filter((item) => item.value !== e.target.value);
      }

      if (e.target.value === "video" || e.target.value === "chat") {
        service = service.filter((item) => item.value !== e.target.value);
      }

      if (e.target.value === "$0 - $100" || e.target.value === "$100 - $200" || e.target.value === "$200 - $300" || e.target.value === "$300 - $400" || e.target.value === "$500+") {
        price = price.filter((item) => item !== e.target.value?.replaceAll("$", ""));
      }

      if (e.target.value === "1 Stars & Up" || e.target.value === "2 Stars & Up" || e.target.value === "3 Stars & Up" || e.target.value === "4 Stars & Up") {
        review = review.filter((item) => item.value !== e.target.value?.replaceAll(" Stars & Up", ""));
      }
    }

    urlParams?.type === "1" ? getRecommendData() : urlParams?.type === "2" ? getTrendingData() : urlParams?.type === "3" ? getFeaturedData() : urlParams?.type === "4" && getPopularData();

    localStorage.setItem("filter", JSON.stringify(myArr));
  };

  const handleRemoveFilter = (item1) => {
    let url1 = `/all-trending/${urlParams?.type}/`;
    val = val.filter((data) => data !== item1.value);
    myArr = myArr.filter((item) => item.value !== item1.value);
    url1 = val?.length >= 1 ? url1 + "?" + val?.join().replaceAll(",", "&") : url1 + val?.join().replaceAll(",", "&");

    window.history.replaceState("", "", url1);

    if (document.getElementById(`${item1.value}-filter`)) {
      document.getElementById(`${item1.value}-filter`).checked = false;
    }
    if (document.getElementById(`${item1.value}`)) {
      document.getElementById(`${item1.value}`).checked = false;
    }

    setFilterData([...myArr]);
  };

  const clearAll = () => {
    filterData?.map((item) => {
      if (document.getElementById(`${item.value}-filter`)) {
        document.getElementById(`${item.value}-filter`).checked = false;
      }
    });

    priceArr?.map((item) => {
      if (document.getElementById(`${item.value}`)) {
        document.getElementById(`${item.value}`).checked = false;
      }
    });

    let url1 = url;
    myArr = [];
    val = [];
    setFilterData([]);
    window.history.replaceState("", "", url1);
  };

  const handlePriceChange = async (e) => {
    let arr = [];
    let newArr = [];

    let data = {
      id: makeid(6),
      value: e.target.value === "low-high" ? "priceLowHigh" : e.target.value === "high-low" ? "priceHighLow" : e.target.value,
    };

    if (arr.some((item) => item.value === e.target.value)) {
      arr = [...arr.filter((item) => item.value !== e.target.value), data];
    } else {
      arr = [...arr, data];
    }
    if (e.target.value === "low-high") {
      newArr = myArr.filter((item) => item.value !== "priceHighLow");
    } else {
      newArr = myArr.filter((item) => item.value !== "priceLowHigh");
    }
    priceArr = arr;
    myArr.length >= 1 ? (myArr = [...arr, ...newArr]) : (myArr = [...arr]);
    setFilterData([...myArr]);
    urlParams?.type === "1" ? getRecommendData() : urlParams?.type === "2" ? getTrendingData() : urlParams?.type === "3" ? getFeaturedData() : urlParams?.type === "4" && getPopularData();
  };

  const formatNum = (num) => {
    return String(num)?.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1,");
  };

  return (
    <FrontendLayout>
      <section className="black-bg-section">
        <div className="container">
          <div className="col-12 mb-3">
            <div className="filter-new-list">
              {/* {this.state.filterData.length > 0 &&
                            this.state.filterData.map((item, i) => {
                              console.log(item);
                              return (
                                <span className="filter-new-data" key={i}>
                                  {item + " "}
                                  <bdi onClick={() => this.remove(item)}> x</bdi>
                                </span>
                              );
                            })} */}

              {myArr?.map((item, i) => {
                return (
                  <span className="filter-new-data" key={i}>
                    {item.value} <bdi onClick={() => handleRemoveFilter(item)}>x</bdi>
                  </span>
                );
              })}
              {myArr.length > 0 && (
                <bdi className="clearAll" onClick={clearAll}>
                  Clear all
                </bdi>
              )}
            </div>
            {/* <div className="text-end">
              <button className="btn clear-btn">
                <span>Clear Filter</span>
                <bdi>x</bdi>
              </button>
            </div> */}
          </div>
          <div className="col-12 filter-part-trending">
            <div className="row">
              <div className="col-xl-2 mb-3">
                <div className="filter-comn-part">
                  <div className="row">
                    <div className="col-xl-12 col-md-4 col-sm-6 mb-3">
                      <div className="filter-comn-box h-100">
                        <p>Sort by</p>
                        <label className="cust-chk-bx mb-3">
                          <input type="radio" name="price" onChange={handlePriceChange} value="high-low" id="priceHighLow" />
                          <span className="cust-chkmark"></span>
                          Price: High - Low
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="radio" name="price" onChange={handlePriceChange} value="low-high" id="priceLowHigh" />
                          <span className="cust-chkmark"></span>
                          Price: Low - High
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="reviews" id="reviews-filter" />
                          <span className="cust-chkmark"></span>
                          Number of reviews
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="recommend" id="recommend-filter" />
                          <span className="cust-chkmark"></span>
                          Recommended
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="Newest" id="Newest-filter" />
                          <span className="cust-chkmark"></span>
                          Newest
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="Alphabetical" id="Alphabetical-filter" />
                          <span className="cust-chkmark"></span>
                          Alphabetical
                        </label>
                      </div>
                    </div>
                    <div className="col-xl-12 col-md-4 col-sm-6 mb-3">
                      <div className="filter-comn-box h-100">
                        <p>24hr Delivery</p>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="Delivery" id="Delivery-filter" />
                          <span className="cust-chkmark"></span>
                          24hr Delivery
                        </label>
                      </div>
                    </div>
                    <div className="col-xl-12 col-md-4 col-sm-6 mb-3">
                      <div className="filter-comn-box h-100">
                        <p>Price</p>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="$0 - $100" id="$0 - $100-filter" />
                          <span className="cust-chkmark"></span>
                          $0 - $100
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="$100 - $200" id="$100 - $200-filter" />
                          <span className="cust-chkmark"></span>
                          $100 - $200
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="$200 - $300" id="$200 - $300-filter" />
                          <span className="cust-chkmark"></span>
                          $200 - $300
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="$300 - $400" id="$300 - $400-filter" />
                          <span className="cust-chkmark"></span>
                          $300 - $400
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="$500+" id="$500+-filter" />
                          <span className="cust-chkmark"></span>
                          $500+
                        </label>
                      </div>
                    </div>
                    <div className="col-xl-12 col-md-4 col-sm-6 mb-3">
                      <div className="filter-comn-box h-100">
                        <p>Number of reviews</p>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="4 Stars & Up" id="4 Stars & Up-filter" />
                          <span className="cust-chkmark"></span>4 Stars & up
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="3 Stars & Up" id="3 Stars & Up-filter" />
                          <span className="cust-chkmark"></span>3 Stars & up
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="2 Stars & Up" id="2 Stars & Up-filter" />
                          <span className="cust-chkmark"></span>2 Stars & up
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="1 Stars & Up" id="1 Stars & Up-filter" />
                          <span className="cust-chkmark"></span>1 Stars & up
                        </label>
                      </div>
                    </div>
                    <div className="col-xl-12 col-md-4 col-sm-6 mb-3">
                      <div className="filter-comn-box h-100">
                        <p>Services</p>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="video" id="video-filter" />
                          <span className="cust-chkmark"></span>
                          Video
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="chat" id="chat-filter" />
                          <span className="cust-chkmark"></span>
                          Chat
                        </label>
                      </div>
                    </div>
                    <div className="col-xl-12 col-md-4 col-sm-6 mb-3">
                      <div className="filter-comn-box h-100">
                        <p>Response time</p>
                        {/* <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="< 1 day" id="< 1 day-filter" />
                          <span className="cust-chkmark"></span>
                          &lt; 1 day
                        </label> */}
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="< 2 day" id="< 2 day-filter" />
                          <span className="cust-chkmark"></span>
                          &lt; 2 day
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="< 3 day" id="< 3 day-filter" />
                          <span className="cust-chkmark"></span>
                          &lt; 3 day
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="< 4 day" id="< 4 day-filter" />
                          <span className="cust-chkmark"></span>
                          &lt; 4 day
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="< 5 day" id="< 5 day-filter" />
                          <span className="cust-chkmark"></span>
                          &lt; 5 day
                        </label>
                        <label className="cust-chk-bx mb-3">
                          <input type="checkbox" onChange={handleChange} value="< 6 day" id="< 6 day-filter" />
                          <span className="cust-chkmark"></span>
                          &lt; 6 day
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-10">
                <div className="slider-comn-part">
                  <div className="d-flex align-items-center mb-3">
                    <span>{urlParams?.type === "1" ? "Recommend for you" : urlParams?.type === "2" ? "Trendings" : urlParams?.type === "3" ? "Featured" : urlParams?.type === "4" && "Popular"}</span>
                  </div>
                </div>
                {loading && data.length === 0 ? (
                  <div className="d-flex align-items-center justify-content-center pt-5 mid-img">
                    <img src={nodatafound} className="img-fluid" />
                  </div>
                ) : (
                  <div className="row">
                    {data?.map((item) => {
                      return (
                        <div className="col-xxl-3 col-lg-4 col-sm-6 mb-3">
                          <div className="comn-recom-box">
                            <a onClick={() => handleClick(item.id, item)}>
                              <div className="iner-link-recom">
                                <img referrerPolicy="no-referrer" src={item.image && item.image !== "null" ? item.image : talent} alt="" className="comn-recom-img" />
                                <div className="detail-recom">
                                  <span>{item.fullname}</span>
                                  <p>{item.about}</p>
                                  <div className="d-flex align-items-center">
                                    <span className="m-0">${item.video_price ? formatNum(item.video_price) : formatNum(item.chat_price)}</span>
                                    <div className="ms-auto">
                                      <div className="d-flex align-items-center">
                                        <span className="m-0">
                                          <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.9606 6.2536C14.8618 5.94987 14.5924 5.73484 14.275 5.70611L9.94491 5.313L8.23364 1.30659C8.1073 1.01224 7.81982 0.822266 7.49984 0.822266C7.17985 0.822266 6.89226 1.01224 6.76672 1.30659L5.05545 5.313L0.724707 5.70611C0.407242 5.73541 0.138416 5.95045 0.0390799 6.2536C-0.0596843 6.55734 0.0315266 6.89048 0.271628 7.10105L3.54481 9.97116L2.57971 14.2218C2.5091 14.5343 2.63041 14.8575 2.88974 15.045C3.02913 15.1463 3.1929 15.1968 3.35724 15.1968C3.49846 15.1968 3.63979 15.1593 3.76603 15.0838L7.49984 12.8512L11.233 15.0838C11.5068 15.2474 11.8512 15.2324 12.1099 15.045C12.3693 14.8575 12.4906 14.5343 12.42 14.2218L11.4549 9.97116L14.728 7.10105C14.968 6.89048 15.0594 6.55802 14.9606 6.2536Z" fill="#EE9D26" />
                                          </svg>
                                        </span>
                                        <bdi className="ms-1">{item.rating}</bdi>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="top-div-part">
                                  <span>
                                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M7.04063 0.836872C7.37365 0.941849 7.60012 1.25069 7.60012 1.59986V5.59986L10.8001 5.59986C11.0984 5.59986 11.3719 5.76583 11.5097 6.03041C11.6475 6.295 11.6266 6.61426 11.4555 6.85863L5.8555 14.8586C5.65526 15.1447 5.29263 15.2678 4.95961 15.1629C4.62658 15.0579 4.40012 14.749 4.40012 14.3999L4.40012 10.3999H1.20012C0.901818 10.3999 0.628294 10.2339 0.490535 9.96931C0.352777 9.70473 0.373669 9.38547 0.544733 9.14109L6.14473 1.14109C6.34497 0.855037 6.70761 0.731896 7.04063 0.836872Z" fill="#F2C94C" />
                                    </svg>
                                  </span>
                                  <bdi>{item.video_price_24 ? "24 hr" : ""}</bdi>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Subscribe />
    </FrontendLayout>
  );
}
