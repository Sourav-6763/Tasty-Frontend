import React, { useEffect } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";
import ScrollReveal from 'scrollreveal';
import { baseUrl } from "../Url";
import axios from "axios";

const Hero = () => {
  useEffect(() => {
    // Initialize ScrollReveal
    const sr = ScrollReveal({
      distance: '50px',
      duration: 1000,
      delay: 200,
    });

    // Reveal elements with the class "reveal"
    sr.reveal('.image-content');
  }, []);


useEffect(()=>{
const getRandomRecipe = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/recipe/getRandomRecipe`);
    const recipes = response.data.payload.recipes;


    sessionStorage.setItem("randomRecipes", JSON.stringify(recipes));

  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};
getRandomRecipe();
});

  return (
    <div className="hero-container">
        <div className="text-content">
        <h1>Start to <span></span> <br /> Cooking Made Easy.</h1>
          <p>
            Say goodbye to long and frustrating food blogs and recipe videos.<br/>
            Access our recipe cards to prepare any dish in minutes.<br />
            Whether you're a beginner or a seasoned chef, our easy-to-follow guides will have you cooking like a pro in no time. <br />
            Explore a variety of cuisines, from quick meals to gourmet feasts, and share your culinary creations with friends and family!
          </p>
          <Link to="AllRecipe"><button className="browse-btn">Browse Dish</button></Link>
        </div>
        <div className="image-content">
          <img src="./HomePageImage/homePageMainImg.png" alt="Delicious Dish" />
        </div>
       
    </div>
  );
};

export default Hero;
