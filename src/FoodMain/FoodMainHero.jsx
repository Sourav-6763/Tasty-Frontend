import React, { useState, useRef, useEffect, useContext } from "react";
import "./FoodMainHero.css";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { baseUrl } from "../Url";
import ScrollReveal from "scrollreveal";
import { PostList } from "../Store/AllStore";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const FoodMainHero = ({ loading, setLoading }) => {
  const [searchIconShow, setSearchIconShow] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const searchIconRef = useRef(null);
  const searchInputRef = useRef(null);

  const fetchSearchResults = async (searchQuery) => {
    if (!searchQuery) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/recipe/search/${searchQuery}`
      );
      sessionStorage.setItem(
        "searchQuery",
        JSON.stringify(response.data.payload.results)
      );
      sessionStorage.setItem("searchQueryName", query);
      if (response.data && response.data.payload.results.length > 0) {
        navigate(`/searchRecipe?query=${searchQuery}`);
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setLoading(false);
  };

  const searchShowHandler = () => {
    if (query) {
      fetchSearchResults(query);
    } else {
      setSearchIconShow((prev) => !prev);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query) {
      fetchSearchResults(query);
    } else {
      setSearchIconShow((prev) => !prev);
    }
  };

  const handleSearchInput = (e) => {
    setQuery(e.target.value);
  };

  const { UserLoggedInOrNot } = useContext(PostList);
  const [userIsLoggedIn, setuserIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    const IsLoggedIn = sessionStorage.getItem("isLoggedIn");
    setuserIsLoggedIn(IsLoggedIn);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [UserLoggedInOrNot]);

  const [randomRecipe, setRandomRecipe] = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("randomRecipes");
    if (saved) {
      const parsed = JSON.parse(saved);
      setRandomRecipe(parsed || []);
    } else {
      setRandomRecipe([]);
    }
    setRecipeLoading(false);
  }, []);

  useEffect(() => {
    if (randomRecipe.length > 0) {
      setTimeout(() => {
        const sr = ScrollReveal({
          distance: "50px",
          duration: 1000,
          delay: 100,
          reset: true,
          mobile: true,
        });

        sr.reveal(".recipeBox1", { origin: "right", delay: 100 });
        sr.reveal(".recipeBox2", { origin: "right", delay: 200 });
        sr.reveal(".recipeBox3", { origin: "right", delay: 300 });
        sr.reveal(".textSection", { origin: "bottom" });
      }, 100);
    }
  }, [randomRecipe]);

  return (
    <>
      <div className={`foodMainContainer ${loading ? "loadingBlur" : ""}`}>
        <Header />
        <Link to="/useruploadRecipe"> <button className="newrecipe-vertical">new Recipe</button></Link>
      
        <div className="searchFoodByMainpage">
          <div className="searchIcon" ref={searchIconRef}>
            <form className="searchFrom" onSubmit={handleSearchSubmit}>
              <input
                ref={searchInputRef}
                type="text"
                className={`searchIconInput ${
                  searchIconShow ? "searchActive" : "searchHide"
                }`}
                placeholder="Search for ingredients..."
                value={query}
                onChange={handleSearchInput}
              />
              <CiSearch className="searchIconSvg" onClick={searchShowHandler} />
            </form>
          </div>
        </div>

        <div className="foodMainContainerHero">
          {/* <Button>ggg</Button> */}
          <div className="textSection">
            <h1>
              Food
              <br />
              &nbsp;&nbsp;Zone
            </h1>
            <p>
              &#9472;&#9472;&#9472;&#9472;Lorem ipsum dolor sit <br /> amet
              consectetur . dignissimos.
            </p>
          </div>

          <div className="imageHeroOuterCircle">
            <div className="imageHero">
              <img src="/HomePageImage/recipeMain.png" alt="hero" />
            </div>
          </div>

          <div className="boxSection">
            {recipeLoading ? (
              <p>Loading recipes...</p>
            ) : randomRecipe && randomRecipe.length > 0 ? (
              randomRecipe.map((item, index) => (
                <div className={`recipeBox${index + 1}`} key={index}>
                  <img src={item.image} alt="recipe" loading="lazy" />
                  <div className="recipeText">
                    <p>{item.title}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No item found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodMainHero;
