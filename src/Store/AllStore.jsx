import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { baseUrl } from "../Url";

export const PostList = createContext({});

const CreatePostStore = ({ children }) => {
  const [reload, setReload] = useState(false);
  const [loadingContent, setloadingContent] = useState(false);
  const [UserLoggedInOrNot, setUserLoggedInOrNot] = useState(false);
  const [UserLoggedData, setUserLoggedData] = useState({});
  const [activeTab, setActiveTab] = useState("signin");



  return (
    <PostList.Provider
      value={{
        reload,
        setReload,
        loadingContent,
        setloadingContent,
        UserLoggedInOrNot,
        setUserLoggedInOrNot,
        UserLoggedData,
        setUserLoggedData,
        activeTab, setActiveTab
      }}
    >
      {children}
    </PostList.Provider>
  );
};

export default CreatePostStore;
