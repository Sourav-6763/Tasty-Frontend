import React, { useRef, useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./SuggestItem.css";
import { PostList } from "../Store/AllStore";
import axios from "axios";
import { baseUrl } from "../Url";
import { Link } from "react-router-dom";

export default function SuggestItem() {
  const { reload, setReload, loadingContent, setloadingContent } =
    useContext(PostList);
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let result = sessionStorage.getItem("ViewItem");
    if (result) {
      const result2 = JSON.parse(result);
      setProducts(result2.payload.similarRecipe);
    }
  }, []);

  const suggestProductHandeler = async (id) => {
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
    <div className="categoryContainer">
      {loading ? (
        <div className="loadingIndicator">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="suggestItemText">
            <h2>Similar kinds of food</h2>
          </div>
          <div className="categoryContainerInner">
            <div
              className="leftArrow"
              onClick={() => swiperRef.current.swiper.slidePrev()}
            >
              <i className="fa-solid fa-angle-left"></i>
            </div>

            <Swiper
              ref={swiperRef}
              spaceBetween={10}
              autoplay={{
                delay: 5500,
                disableOnInteraction: false,
              }}
              speed={1000}
              breakpoints={{
                0: { slidesPerView: 2, spaceBetween: 5 }, // Mobile
                425: { slidesPerView: 3, spaceBetween: 5 }, // Mobile
                640: { slidesPerView: 3, spaceBetween: 10 }, // Tablets
                768: { slidesPerView: 4, spaceBetween: 10 }, // Larger tablets
                1024: { slidesPerView: 6, spaceBetween: 10 }, // Desktops
              }}
              modules={[Pagination, Autoplay]}
              className="mySwiperBySuggestedItem"
            >
              {products?.map((item, index) => {
                return (
                  <SwiperSlide key={index} className="CategorySlide">
                    <Link to={`/Prticular/${item.id}`}>
                      <div
                        className="productContainer"
                        onClick={() => suggestProductHandeler(item.id)}
                      >
                        <img
                          src={`https://img.spoonacular.com/recipes/${item.id}-556x370.jpg`}
                          alt={item.name}
                        />
                        <h2 className="CategoryName">
                          {item.title.length > 20
                            ? `${item.title.substring(0, 20)}...`
                            : item.title}
                        </h2>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <div
              className="rightArrow"
              onClick={() => swiperRef.current.swiper.slideNext()}
            >
              <i className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
