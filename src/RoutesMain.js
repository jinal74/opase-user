import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import AddCash from "./Pages/AddCash";
import AllReviews from "./Pages/AllReview";
import AllTrending from "./Pages/AllTrending";
import BookForChat from "./Pages/BookForChat";
import BookTalent from "./Pages/BookTalent";
import Chats from "./Pages/Chats";
import Folllowing from "./Pages/Following";
import Invitefriends from "./Pages/InviteFriends";
import Login from "./Pages/Login";
import OpaseCash from "./Pages/OpaseCash.js";
import Payment from "./Pages/Payment.js";
import Profile from "./Pages/Profile";
import ReceivedVideo from "./Pages/ReceivedVideo";
import Requests from "./Pages/Requests";
import AllTalent from "./Pages/AllTalent";

function RequireAuth({ children, redirectTo }) {
  let isAuthenticated = localStorage.getItem("opus_token");
  return isAuthenticated !== null && isAuthenticated !== undefined && isAuthenticated !== "" ? children : <Navigate to={redirectTo} />;
}

export default function RoutesMain() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            strict
            element={
              <RequireAuth redirectTo="/login">
                <Profile />
              </RequireAuth>
            }
          />

          <Route path="/login" exact element={<Login />} />

          <Route
            path="/addcash"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <AddCash />
              </RequireAuth>
            }
          />
          <Route
            path="/all-review/:id"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <AllReviews />
              </RequireAuth>
            }
          />
          <Route
            path="/all-trending/:type"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <AllTrending />
              </RequireAuth>
            }
          />
          <Route
            path="/book-for-chat/:id"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <BookForChat />
              </RequireAuth>
            }
          />
          <Route
            path="/book-talent/:id"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <BookTalent />
              </RequireAuth>
            }
          />
          <Route
            path="/chat"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <Chats />
              </RequireAuth>
            }
          />
          <Route
            path="/following"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <Folllowing />
              </RequireAuth>
            }
          />
          <Route
            path="/invite-friends"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <Invitefriends />
              </RequireAuth>
            }
          />
          <Route
            path="/opasecash"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <OpaseCash />
              </RequireAuth>
            }
          />
          <Route
            path="/payment"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <Payment />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/receivedvideo"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <ReceivedVideo />
              </RequireAuth>
            }
          />
          <Route
            path="/alltalent"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <AllTalent />
              </RequireAuth>
            }
          />
          <Route
            path="/requests"
            exact
            element={
              <RequireAuth redirectTo="/login">
                <Requests />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
