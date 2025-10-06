import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import "./ChatBot.css";
import { baseUrl } from "../Url";
import { Link } from "react-router-dom";
import { PostList } from "../Store/AllStore";
import BlurText from "../Animation/BlurText";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false); // ✅ Scroll trigger
  const chatBoxRef = useRef(null);
  const { reload, setReload, loadingContent, setloadingContent } =
    useContext(PostList);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setIsBotTyping(true);
      const res = await axios.get(`${baseUrl}/api/recipe/quickAns`, {
        params: { q: userMessage.text },
      });

      const botText =
        res.data?.payload?.answerText ||
        res.data?.payload ||
        "No answer received.";
      const media = res.data?.payload?.media || [];

      simulateBotTyping(botText, media);
    } catch (err) {
      console.error(err);
      simulateBotTyping("Error fetching data.", []);
    }
  };

  const simulateBotTyping = (botFullMessage, media) => {
    let currentText = "";
    let i = 0;

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "", media: [], time: "" },
    ]);

    const interval = setInterval(() => {
      currentText += botFullMessage[i];
      i++;

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          sender: "bot",
          text: currentText,
          media,
          time: new Date().toLocaleTimeString(),
        };
        return newMessages;
      });

      // setShouldScroll(true); // ✅ Scroll after DOM updates

      if (i === botFullMessage.length) {
        clearInterval(interval);
        setShouldScroll(true); // ✅ Scroll after DOM updates
        setIsBotTyping(false);
      }
    }, 30);
  };

  // ✅ Scroll after DOM updates (not during state update)
  useEffect(() => {
    if (shouldScroll && chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
      setShouldScroll(false);
    }
  }, [shouldScroll]);

  // const getRecipeInformation = async (id) => {
  //   sessionStorage.removeItem("ViewItem");
  //   setloadingContent(true);
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/api/recipe/recipeDetails/${id}`
  //     );
  //     sessionStorage.setItem("ViewItem", JSON.stringify(response.data));
  //     setReload(!reload);
  //   } catch (err) {
  //     console.error("Failed to fetch recipe details:", err);
  //   }
  // };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 && <div className="initialBotChat"><p className="empty-chat">"Hey foodie!</p><p className="empty-chat1"> I'm here to help you find amazing recipes. Ask me anything!"</p></div>}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.sender}`}>
            <div className={`message-bubble ${msg.sender}`}>
              {msg.sender === "bot" ? (
                <BlurText
                  text={msg.text}
                  delay={30}
                  animateBy="words"
                  direction="top"
                  className="text-base"
                />
              ) : (
                <p>{msg.text}</p>
              )}
              <span className="time">{msg.time}</span>
             
            </div>

            {/* {msg.sender === "bot" && msg.media && msg.media.length > 0 && (
              <div className="media-group">
                {msg.media.map((item, i) => {
                  const parts = item.link.split("-");
                  const recipeId = parts[parts.length - 1];
                  return (
                    <div key={i} className="media-card">
                      <p>{item.title}</p>
                      <img src={item.image} alt={item.title} />
                      <Link to={`/Prticular/${recipeId}`}>
                        <button onClick={() => getRecipeInformation(recipeId)}>
                          Get Recipe
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )} */}
          </div>
        ))}

        {isBotTyping && (
          <div className="typing-indicator">Bot is typing...</div>
        )}
      </div>

      <div className="input-box">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          autoFocus
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;
