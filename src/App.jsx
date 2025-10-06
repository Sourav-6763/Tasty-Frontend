import HomePage from "./Pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import FoodMain from "./FoodMainPage/FoodMain";
import SearchRecipe from "./SearchRecipe/SearchRecipe";
import Signup from "./Signup/Signup";
import OneItem from "./Item/OneItem";
import CreatePostStore from "./Store/AllStore";
import { GoogleOAuthProvider } from "@react-oauth/google";
import EditProfile from "./MyProfile/EditProfile";
import AddRecipe from "./AddRecipes/AddRecipes";
import UserUploadPage from "./UserRecipeLikeFb/UserUploadPage";

function App() {
  return (
    <GoogleOAuthProvider clientId="541822869933-8nlqkrjpfcqklul80s33c943jjpr7unb.apps.googleusercontent.com">
      <CreatePostStore>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/AllRecipe" element={<FoodMain />} />
            <Route path="/searchRecipe" element={<SearchRecipe />} />
            <Route path="/Prticular/:id" element={<OneItem />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/addRecipes" element={<AddRecipe />} />
            <Route path="/useruploadRecipe" element={<UserUploadPage />} />
          </Routes>
          {/* <Analytics /> */}
        </Router>
      </CreatePostStore>
    </GoogleOAuthProvider>
  );
}

export default App;
