import React, { useState } from "react";
import FoodMainHero from "../FoodMain/FoodMainHero";
import "./FoodMain.css";
import SearchFoodByCountry from "../Category/SearchFoodByCountry";
import Loder from "../Loder/Loder";
import ChatBot from "../ChatBot/ChatBot";
import Footer from "../Footer/Footer";
import ImageTrail from "../Animation/ImageTrail";

function FoodMain() {
  const [loading, setLoading] = useState(false);
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const openChatBoxHandelar = () => {
    setChatBoxOpen(!chatBoxOpen);
  };
  return (
    <div className="foodmaincontainerRoot">
      {loading && (
        <div className="loadingOverlay">
          <Loder loading={loading} />
        </div>
      )}
      <FoodMainHero loading={loading} setLoading={setLoading} />
      <div className="chatBot" onClick={() => openChatBoxHandelar()}>
        <img src="./HomePageImage/chatbot-marketing.gif" alt="" srcSet="" />
      </div>
      {chatBoxOpen && <ChatBot />}
      <SearchFoodByCountry loading={loading} setLoading={setLoading} />

      <div
        style={{ height: "500px", position: "relative", overflow: "hidden" }}
      >
        <ImageTrail
          // key={key}
          items={[
            "https://tse4.mm.bing.net/th/id/OIP.87rC-vQdkf1I5qv74_2LjwHaHp?pid=Api&P=0&h=180",
            "https://picsum.photos/id/1001/300/300",
            "https://picsum.photos/id/1025/300/300",
            "https://picsum.photos/id/1026/300/300",
            "https://picsum.photos/id/1027/300/300",
            "https://picsum.photos/id/1028/300/300",
            "https://picsum.photos/id/1029/300/300",
            "https://picsum.photos/id/1030/300/300",
            // ...
          ]}
          variant={7}
        />
      </div>

      <Footer></Footer>
    </div>
  );
}

export default FoodMain;
