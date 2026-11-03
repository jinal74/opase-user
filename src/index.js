import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastContainer, toast } from "react-toastify";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51LO3qNDpz8i4UOTOUaXeECDJ6x7WNgl0o5MfoKhpIZh7SeM2nQjdoZLDNkJuNqMypsBJfqznwu7Iy3YAYLnkHcbZ00AJeBZPov");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);
