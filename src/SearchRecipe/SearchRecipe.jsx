import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./SearchRecipe.css";
import Header from "../Header/Header";
import { baseUrl } from "../Url";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import Loder from "../Loder/Loder";
import { Link } from "react-router-dom";
import { PostList } from "../Store/AllStore";
// import noImage from ".public/HomePageImage/noImage.jpg";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const SearchResults = () => {
  const { reload, setReload, loadingContent, setloadingContent } =
    useContext(PostList);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = sessionStorage.getItem("searchQueryName");

  useEffect(() => {
    fetchSearchResults(page);
  }, [page]);

  const fetchSearchResults = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/recipe/search/${query}`,
        {
          params: { page },
        }
      );
      const results = response.data.payload.results;
      const total = response.data.payload.totalResults;

      sessionStorage.setItem("searchQuery", JSON.stringify(results));
      setData(results);
      setTotalPages(Math.ceil(total / 12));
    } catch (error) {
      console.error("Error fetching search results:", error);
      setData([]);
      alert(
        "Oops! We're having trouble loading recipes right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "/HomePageImage/noImage.jpg";
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const getRecipeInformation = async (id) => {
    sessionStorage.removeItem("ViewItem");
    setloadingContent(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/recipe/recipeDetails/${id}`
      );
      sessionStorage.setItem("ViewItem", JSON.stringify(response.data));
      setReload(!reload);
    } catch (err) {
      console.error("Failed to fetch recipe details:", err);
    }
  };

  return (
    <>
      <Stack spacing={1}>
        <Header />
        <div className="backgroundblur" />
        <div className="background-overlay" />
        <div className="searchContainer">
          <div className="form">
            <h1 className="heading">Search Results</h1>
            {loading ? (
              <div className="results">
                {[...Array(11)].map((_, index) => (
                  
                  <div key={index} className="result-item skeleton-item">
                    <Skeleton className="skeletonForSearchFood" variant="rounded" />
                    <Skeleton
                    className="skeletonForSearchFoodText"
                      variant="text"    
                    />
                    <Skeleton
                    className="skeletonForSearchFoodButton"
                      variant="rounded"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="results">
                {data.length > 0 ? (
                  data.map((item) => (
                    <div key={item.id} className="result-item">
                      <div className="imageDiv">
                        <img
                          src={`https://img.spoonacular.com/recipes/${item.id}-636x393.jpg`}
                          alt={item.title}
                          className="result-image"
                          onError={handleImageError}
                        />
                      </div>

                      <h2 className="result-name">{item.title}</h2>
                      <Link to={`/Prticular/${item.id}`}>
                        <button
                          className="getRecipe"
                          onClick={() => getRecipeInformation(item.id)}
                        >
                          Get Recipe
                        </button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="noResultFound">
                    <img
                      src="./HomePageImage/search-not-found.png"
                      alt="No results"
                      className="noResultImage"
                    />
                    <div className="noResultText">No recipes found.</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pagination-number">
            <div className="totalpage">
              Page {page} of {totalPages}
            </div>

            <div
              className={`prevbtn ${page === 1 ? "disabled" : ""}`}
              onClick={handlePrevPage}
            >
              <GoChevronLeft />
            </div>

            {totalPages > 1 && (
              <>
                {page > 2 && (
                  <>
                    <div className="page-item" onClick={() => setPage(1)}>
                      1
                    </div>
                    {page > 3 && <div className="dots">...</div>}
                  </>
                )}

                {Array.from({ length: 3 }, (_, i) => page - 1 + i)
                  .filter((p) => p > 1 && p < totalPages)
                  .map((p) => (
                    <div
                      key={p}
                      className={`page-item ${page === p ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </div>
                  ))}

                {page < totalPages - 1 && (
                  <>
                    {page < totalPages - 2 && <div className="dots">...</div>}
                    <div
                      className="page-item"
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </div>
                  </>
                )}
              </>
            )}

            <div
              className={`nextbtn ${page === totalPages ? "disabled" : ""}`}
              onClick={handleNextPage}
            >
              <GoChevronRight />
            </div>
          </div>
        </div>
      </Stack>
    </>
  );
};

export default SearchResults;



