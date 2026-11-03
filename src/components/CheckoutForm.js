import React, { useMemo, useState, useEffect } from "react";
import { useStripe, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { API_Path } from "../const";
import { PostApi } from "../api/api-service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useOptions = (paymentRequest) => {
  const options = useMemo(
    () => ({
      paymentRequest,
      style: {
        paymentRequestButton: {
          theme: "dark",
          height: "48px",
          type: "default",
        },
      },
    }),
    [paymentRequest]
  );

  return options;
};

const usePaymentRequest = ({ options, onPaymentMethod, props }) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest(options);
      setPaymentRequest(pr);
    }
  }, [stripe, options, paymentRequest]);

  useEffect(() => {
    let subscribed = true;
    if (paymentRequest) {
      paymentRequest.canMakePayment().then((res) => {
        if (res && subscribed) {
          setCanMakePayment(true);
          props.checkPaymentBtnSupported && props.checkPaymentBtnSupported(true);
        } else {
          // setCanMakePayment(false);
          props.checkPaymentBtnSupported && props.checkPaymentBtnSupported(false);
        }
      });
    }

    return () => {
      subscribed = false;
    };
  }, [paymentRequest]);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.on("paymentmethod", onPaymentMethod);
    }
    return () => {
      if (paymentRequest) {
        paymentRequest.off("paymentmethod", onPaymentMethod);
      }
    };
  }, [paymentRequest, onPaymentMethod]);

  return canMakePayment ? paymentRequest : null;
};

function PaymentRequestForm(props) {
  const [requestData, setRequestData] = useState(props?.requestData);
  const [isWallet, setIswallet] = useState(props?.isWallet);
  const navigate = useNavigate();

  const stripe = useStripe();

  const paymentRequest = usePaymentRequest({
    options: {
      country: "US",
      currency: "usd",
      total: {
        label: "Pay",
        amount: props?.amount !== " " && parseInt(Math.round(props.amount * 100), 10),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    },
    onPaymentMethod: ({ complete, paymentMethod, ...data }) => {
      console.log(paymentMethod.id, "paymentMethod id");
      console.log(paymentMethod, "payment info");
      console.log(data);
      console.log(complete, "complete");

      let data1 = {
        amount: props?.amount !== " " && parseInt(props?.amount),
        type: props.type,
        isWallet: isWallet ? 1 : 0,
      };

      const addPaymentData = new Promise((resolve) => {
        resolve(PostApi(API_Path.addPaymentData, data1));
      });
      addPaymentData.then(async (res) => {
        if (res?.data.success) {
          var clientSecretKey = res.data.data?.client_secret;
          toast.success(res.data.message);

          try {
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecretKey, { payment_method: paymentMethod.id }, { handleActions: false });
            if (confirmError) {
              complete("fail");
            } else {
              complete("success");
              if (requestData) {
                await createTalentRequest();
              }
              if (paymentIntent.status === "requires_action") {
                // Let Stripe.js handle the rest of the payment flow.
                const { error } = await stripe.confirmCardPayment(clientSecretKey);
                if (error) {
                  toast.error("Payment Failed.");
                  // The payment failed -- ask your customer for a new payment method.
                } else {
                  // The payment has succeeded.
                  toast.success("Payment successfully done.");
                  // window.location.href = "/thank-you";
                }
              } else {
                // The payment has succeeded.
                toast.success("Payment successfully done.");
                // window.location.href = "/thank-you";
              }
            }
          } catch (error) {
            console.log(error, "error");
          }
        } else {
          toast.error(res.data.message);
        }
      });

      complete("success");
    },
    props,
  });

  const createTalentRequest = () => {
    let data = new FormData();
    data.append("talentId", requestData?.id);
    data.append("selectoccasion", requestData?.selectoccasion ? requestData?.selectoccasion : "");
    data.append("introduceYourself", requestData?.introduceYourself ? requestData?.introduceYourself : "");
    data.append("instruction", requestData?.instruction ? requestData?.instruction : "");
    data.append("pronoun", requestData?.pronoun ? requestData?.pronoun : "");
    data.append("attachVideo", requestData?.attach_video ? requestData?.attach_video : "");
    data.append("phone", requestData?.email ? requestData?.email : "");
    data.append("hour24", requestData?.hour24 ? requestData?.hour24 : "");
    data.append("standard", requestData?.standard ? requestData?.standard : "");
    data.append("chat", requestData?.chat ? requestData?.chat : 0);
    data.append("chatPrice", requestData?.chat_price ? requestData?.chat_price : 0);

    const BookTalentData = new Promise((resolve) => {
      resolve(PostApi(API_Path.BookNewTalent, data));
    });
    BookTalentData.then((res) => {
      if (res.data.success) {
        if (res.data.data) {
          toast.success(res.data.message);
          if (requestData?.chat === 1) {
            navigate("/chat", { state: { talentdetail: requestData } });
          } else {
            navigate("/requests");
          }
        }
      } else if (res.status === 401) {
        if (localStorage.getItem("opus_token")) {
          localStorage.removeItem("opus_token");
        }
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const options = useOptions(paymentRequest);

  if (!paymentRequest) {
    return null;
  }

  return <PaymentRequestButtonElement className="PaymentRequestButton" options={options} />;
}

export default PaymentRequestForm;
