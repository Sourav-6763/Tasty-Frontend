// import React, { useContext, useEffect, useRef, useState } from "react";
// import axios from "axios";
// import Header from "../Header/Header";
// import Footer from "../Footer/Footer";
// import { baseUrl } from "../Url";
// import { PostList } from "../Store/AllStore";
// import "./UserUploadPage.css";
// import Loder2 from "../Loder/Loder2";
// import Loder from "../Loder/Loder";
// import { FaRegHeart } from "react-icons/fa6";
// import { FaHeart } from "react-icons/fa6";
// import { toast, Toaster } from "sonner";
// import UserComment from "./UserComment";

// const UserUploadPage = () => {
//   const [recipes, setRecipes] = useState([]);
//   const { reload, setReload } = useContext(PostList);
//   const user = JSON.parse(sessionStorage.getItem("user")) || {};
//   let [loading, setLoading] = useState({});
//   const [commentBoxOpen, setCommentBoxOpen] = useState(false);
//   const [recipeiIId, setrecipeId] = useState("");

//   useEffect(() => {
//     const fetchUserRecipes = async () => {
//       try {
//         const res = await axios.get(`${baseUrl}/api/recipe/getUserRecipe`);

//         setRecipes(res.data.payload.results);
//       } catch (err) {
//         console.error("Failed to fetch user recipes", err);
//       }
//     };
//     fetchUserRecipes();
//   }, [reload]);

//   const handleLike = async (recipeId) => {
//     if (!user._id) {
//       toast.warning("Please log in to like this recipe");
//       return;
//     }
//     setLoading((prev) => ({ ...prev, [recipeId]: true }));
//     try {
//       const res = await axios.post(
//         `${baseUrl}/api/user/upload/like/${recipeId}`,
//         {
//           userId: user._id,
//         }
//       );
//       // console.log(res);
//       // setLikedTrack(!likedTrack);

//       setReload(!reload); // Trigger refetch if needed
//     } catch (error) {
//       // if (error.response?.status === 400) {
//       //   alert("You already liked this recipe.");
//       // } else {
//       //   console.error("Error liking recipe", error);
//       // }
//     } finally {
//       setLoading((prev) => ({ ...prev, [recipeId]: false })); // hide loader after API call
//     }
//   };
//   const handleComment = (recipeid) => {
//     setrecipeId(recipeid);
//     setCommentBoxOpen(!commentBoxOpen);
//   };

//   const popupRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setCommentBoxOpen(false);
//       }
//     }

//     function handleKeyDown(event) {
//       if (event.key === "Escape") {
//         setCommentBoxOpen(false);
//       }
//     }

//     if (commentBoxOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//       document.addEventListener("keydown", handleKeyDown);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [commentBoxOpen]);

//   return (
//     <div className="useruploadPageContainer">
//       <Header />
//       <Toaster position="top-right" richColors />
//       <div className="backgroundblur" />
//       <div className="background-overlay" />
//       <div
//         className={` ${
//           recipes.length <= 0 ? "giveheight" : "user-recipe-container"
//         }`}
//       >
//         {recipes.length > 0 ? (
//           recipes.map((recipe) => (
//             <div className="recipe-card" key={recipe._id}>
//               <div className="recipe-card-img-box">
//                 <div className="recipeCardImg">
//                   <img src={recipe.imageUrl} alt={recipe.title} />
//                 </div>
//                 <div className="recipe-actions">
//                   <button onClick={() => handleLike(recipe._id)}>
//                     {loading[recipe._id] ? (
//                       <Loder2 loading={true} /> // loader shows
//                     ) : (
//                       <>
//                         {recipe.likes?.includes(user._id) ? (
//                           <FaHeart />
//                         ) : (
//                           <FaRegHeart />
//                         )}
//                         {recipe.likes?.length || 0}
//                       </>
//                     )}
//                   </button>

//                   <button onClick={() => handleComment(recipe._id)}>
//                     Comment
//                   </button>
//                   <button>Share</button>
//                 </div>
//               </div>

//               <div className="recipe-card-content">
//                 <div className="userIdentityBox">
//                   <p className="recipe-source">
//                     {recipe.user?.name || "User Submitted"}
//                   </p>
//                   <p>{recipe.createdAt.split("T")[0]}</p>
//                 </div>

//                 <h2 className="recipe-title">{recipe.title}</h2>
//                 <p className="recipe-desc">
//                   {recipe.description || "No description provided."}
//                 </p>

//                 <div className="ingredients-section">
//                   <h4>Ingredients</h4>
//                   <ul className="ingredient-list">
//                     {recipe.ingredients.map((value, index) => (
//                       <li key={index} className="ingredient-item">
//                         {value}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="no-recipe-container">
//             <img
//               src="./HomePageImage/search-not-found.png"
//               alt="No recipes"
//               className="no-recipe-image"
//             />
//             <p className="no-recipe-text">No uploaded recipes found.</p>
//           </div>
//         )}
//       </div>
//       <div className={commentBoxOpen ? "commentContainerUser" : ""}>
//         {commentBoxOpen && (
//           <div ref={popupRef}>
//             <UserComment recipeId={recipeiIId} />
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default UserUploadPage;

import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { baseUrl } from "../Url";
import { PostList } from "../Store/AllStore";
import "./UserUploadPage.css";
import Loder2 from "../Loder/Loder2";
import { toast, Toaster } from "sonner";
import UserComment from "./UserComment";

// MUI
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loder from "../Loder/Loder2";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const UserUploadPage = () => {
  const [recipes, setRecipes] = useState([]);
  const { reload, setReload } = useContext(PostList);
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  let [loading, setLoading] = useState({});
  const [commentBoxOpen, setCommentBoxOpen] = useState(false);
  const [recipeId, setRecipeId] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [loadingpage, setLoadingpage] = useState(false);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      setLoadingpage(true);
      try {
        const res = await axios.get(`${baseUrl}/api/recipe/getUserRecipe`);
        setRecipes(res.data.payload.results);
        setLoadingpage(false);
      } catch (err) {
        console.error("Failed to fetch user recipes", err);
        setLoadingpage(false);
      }
    };
    
    fetchUserRecipes();
  }, [reload]);

  const handleLike = async (id) => {
    if (!user._id) {
      toast.warning("Please log in to like this recipe");
      return;
    }
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post(`${baseUrl}/api/user/upload/like/${id}`, {
        userId: user._id,
      });
      setReload(!reload);
    } catch (error) {
      console.error("Error liking recipe", error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleComment = (id) => {
    setRecipeId(id);
    setCommentBoxOpen(!commentBoxOpen);
  };

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setCommentBoxOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setCommentBoxOpen(false);
      }
    }
    if (commentBoxOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [commentBoxOpen]);

  return (
    <div className="useruploadPageContainer">
      <Header />
       {loadingpage && (
        <div className="loadingOverlay">
          <Loder loading={loading} />
        </div>
      )}
      <Toaster position="top-right" richColors />
      <div className="backgroundblur" />
      <div className="background-overlay" />

      <div
        className={`${
          recipes.length <= 0 ? "giveheight" : "user-recipe-container"
        }`}
      >
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Card className="recipe-card" key={recipe._id}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }}>
                    {recipe.user?.name?.charAt(0) || "U"}
                  </Avatar>
                }
                action={
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                }
                title={recipe.user?.name || "User Submitted"}
                subheader={recipe.createdAt.split("T")[0]}
              />

              <CardMedia
                component="img"
                height="250"
                image={recipe.imageUrl}
                alt={recipe.title}
                className="recipeCardImg"
              />

              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  className="recipe-title"
                >
                  {recipe.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="recipe-desc"
                >
                  {recipe.description || "No description provided."}
                </Typography>
              </CardContent>

              <CardActions disableSpacing className="recipe-actions">
                <IconButton onClick={() => handleLike(recipe._id)}>
                  {loading[recipe._id] ? (
                    <Loder2 loading={true} />
                  ) : (
                    <FavoriteIcon
                      color={
                        recipe.likes?.includes(user._id) ? "error" : "inherit"
                      }
                    />
                  )}
                  <span>{recipe.likes?.length || 0}</span>
                </IconButton>

                <IconButton onClick={() => handleComment(recipe._id)}>
                  <CommentIcon />
                </IconButton>

                <IconButton>
                  <ShareIcon />
                </IconButton>

                <ExpandMore
                  expand={expanded === recipe._id}
                  onClick={() => handleExpandClick(recipe._id)}
                  aria-expanded={expanded === recipe._id}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>

              <Collapse
                in={expanded === recipe._id}
                timeout="auto"
                unmountOnExit
              >
                <CardContent>
                  <Typography variant="h6">Description:</Typography>
                  <Typography sx={{ marginBottom: 2 }}>
                    {recipe.description || "No description provided."}
                  </Typography>

                  <Typography variant="h6">Ingredients:</Typography>
                  <ul className="ingredient-list">
                    {recipe.ingredients.map((value, index) => (
                      <li key={index} className="ingredient-item">
                        {value}
                      </li>
                    ))}
                  </ul>
                    <Typography variant="h6">Steps:</Typography>
                  <ul className="ingredient-list">
                    {recipe.steps.map((value, index) => (
                      <li key={index} className="ingredient-item">
                        {index+1+" "}{value}
                      </li>
                    ))}
                  </ul>


                  {/* Example: If you want to also show created date again */}
                  <Typography
                    variant="body2"
                    sx={{ marginBottom: 8,marginTop:5, color: "gray" }}
                  >
                    Posted on: {recipe.createdAt.split("T")[0]}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          ))
        ) : (
          <div className="no-recipe-container">
            <img
              src="./HomePageImage/search-not-found.png"
              alt="No recipes"
              className="no-recipe-image"
            />
            <p className="no-recipe-text">No uploaded recipes found.</p>
          </div>
        )}
      </div>

      <div className={commentBoxOpen ? "commentContainerUser" : ""}>
        {commentBoxOpen && (
          <div ref={popupRef}>
            <UserComment recipeId={recipeId} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserUploadPage;
