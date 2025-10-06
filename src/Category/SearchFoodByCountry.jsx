import React, { useRef, useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./SearchFoodByCountry.css";
import { PostList } from "../Store/AllStore";
import axios from "axios";
import { baseUrl } from "../Url";
import { Link, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';


const SearchFoodByCountry=({loading,setLoading})=> {
  const {reload, setReload,loadingContent, setloadingContent}=useContext(PostList);
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const getSlidesPerView = () => {
    const count = products.length;
    if (count <= 4) return count;
    return 5;
  };
const SearchFoodByCountryHandel=async(searchQuery)=>{
  setLoading(true);
  // setloadingContent(true);
  try {
    const response = await axios.get(
        `${baseUrl}/api/recipe/search/${searchQuery}`
      );
      sessionStorage.setItem(
        "searchQuery",
        JSON.stringify(response.data.payload.results)
      );
      sessionStorage.setItem("searchQueryName", searchQuery);
      if (response.data && response.data.payload.results.length > 0) {
        setReload(!reload);
        navigate(`/searchRecipe?query=${searchQuery}`);
      } else {
        console.log("No results found");
      }
    
    // setloadingContent(false);
     
  } catch (err) {
    console.error("Failed to fetch recipe details:", err);
  }
  setLoading(false);
}
const cuisines = [
    { name: "African", imageUrl: "https://static.vecteezy.com/system/resources/previews/000/006/894/original/south-african-flag-vector.jpg" },
    { name: "Asian", imageUrl: "https://s.yimg.com/zb/imgv1/6d250c3e-ee7c-3d22-ade1-707a95c78b95/t_500x300" },
    { name: "American", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" },
    { name: "British", imageUrl: "https://tse3.mm.bing.net/th?id=OIP.KAlySVjyf9lFh2dAfY_aTAHaEa&pid=Api&P=0&h=180" },
    { name: "Cajun", imageUrl: "https://tse4.mm.bing.net/th?id=OIP.ugSvgCbc7xlqabbxpwY_HwHaFW&pid=Api&P=0&h=180" },
    { name: "Caribbean", imageUrl: "https://preview.redd.it/h9wy2hfj7hn11.jpg?auto=webp&s=1649c23c3b03d479938fb4790472adb4861ce7b6" },
    { name: "Chinese", imageUrl: "https://tse2.mm.bing.net/th?id=OIP.wjN7jAdy5evtymlw1-AZogHaE7&pid=Api&P=0&h=180" },
    { name: "Eastern European", imageUrl: "https://images.wikia.com/althistory/images/archive/c/cb/20131214212912!Eastern_European_Republic_flag.png" },
    { name: "European", imageUrl: "https://cdn.britannica.com/66/96866-050-BBAE91CE/Flag-European-Union.jpg" },
    { name: "French", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" },
    { name: "German", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" },
    { name: "Greek", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Greece.svg" },
    { name: "Indian", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg" },
    { name: "Irish", imageUrl: "https://tse3.mm.bing.net/th?id=OIP.4CqFrTEhTaNQCdAAERWevQHaE8&pid=Api&P=0&h=180" },
    { name: "Italian", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" },
    { name: "Japanese", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg" },
    { name: "Jewish", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Israel.svg" },
    { name: "Korean", imageUrl: "https://s.yimg.com/zb/imgv1/99e3ea04-4aee-34bf-b99d-3c760db6ee91/t_500x300" },
    { name: "Latin American", imageUrl: "https://i.redd.it/mbfe96jsg3s51.png" },
    { name: "Mediterranean", imageUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/fb15c93a-b027-4581-b707-8c6a923ae1c6/dbkthnx-64ef6850-ae79-42d0-901b-2a76fb70158f.jpg/v1/fill/w_1095,h_730,q_70,strp/mediterranean_kingdom_flag_by_salesworlds_dbkthnx-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTMzMyIsInBhdGgiOiJcL2ZcL2ZiMTVjOTNhLWIwMjctNDU4MS1iNzA3LThjNmE5MjNhZTFjNlwvZGJrdGhueC02NGVmNjg1MC1hZTc5LTQyZDAtOTAxYi0yYTc2ZmI3MDE1OGYuanBnIiwid2lkdGgiOiI8PTE5OTkifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.4r7SMcZYVJM9fMR7Vg-YkHF_Ub9vw8vfCvpAnQSvexc" },
    { name: "Mexican", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg" },
    { name: "Middle Eastern", imageUrl: "https://www.flagsmore.com/wp-content/uploads/2021/04/ae-2048x1024.png" },
    { name: "Nordic", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Sweden.svg" },
    { name: "Southern", imageUrl: "https://daily.jstor.org/wp-content/uploads/2015/04/confederate.jpg" },
    { name: "Spanish", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" },
    { name: "Thai", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" },
    { name: "Vietnamese", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" }
  ];
  
  

 
  return (
   
    <div className={`categoryContainer  ${loading ? "loadingBlur" : ""}`}>
          {/* {loading && (
          <div className="loadingOverlay">
            <Loder loading={loading} />
          </div>
        )} */}
        <>
          <div className="featuredTextByCountry">
            <h2>Delicious foods from around the world</h2>
          </div>
          <div className="categoryContainerByCountry">
            <div
              className="leftArrow"
              onClick={() => swiperRef.current.swiper.slidePrev()}
            >
              <i className="fa-solid fa-angle-left"></i>
            </div>

            <Swiper
              ref={swiperRef}
              slidesPerView={getSlidesPerView()}
              spaceBetween={10}
              autoplay={{
                delay: 5500,
                disableOnInteraction: false,
              }}
              speed={1000}
              breakpoints={{
                0: { slidesPerView: 3, spaceBetween: 5 },     // 👈 For mobile (0px and up)
                640: { slidesPerView: 3, spaceBetween: 10 },  // Small tablets
                768: { slidesPerView: 4, spaceBetween: 10 },  // Tablets
                1024: { slidesPerView: 5, spaceBetween: 10 }, // Desktop
              }}
              modules={[Pagination, Autoplay]}
              className="mySwiperByCountry"
            >
              {cuisines?.map((item, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    className="CategorySlide"
                  >
                    {/* <Link to={`/Prticular/${item.id}`}> */}
                      <div className="productContainer" onClick={()=>SearchFoodByCountryHandel(item.name)}>
                        <img src={item.imageUrl} alt={item.name} />
                        <h2 className="CategoryName">{item.name}</h2>
                      </div>
                    {/* </Link> */}
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
      
    </div>
  );
}
export default SearchFoodByCountry;
