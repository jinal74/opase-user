import RoutesMain from "./RoutesMain";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/styles/style.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect, useMemo, useState } from "react";
import { API_Path } from "./const";
import { PostApi } from "./api/api-service";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <ToastContainer autoClose={1000} />
      <AuthContextProvider>
        <RoutesMain />
      </AuthContextProvider>
    </>
  );
}

export default App;
