import {useState,createContext, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext=createContext();

const ChatProvider=({children})=>{
    const navigate=useNavigate();
    const [user,setUser]=useState();
    const [selectedChat,setSelectedChat]=useState();
    const [chats,setChats]=useState([]);
     useEffect(()=>{
      const userInfo=JSON.parse(localStorage.getItem("userinfo"));
      // console.log("userInfo:",userInfo)
      setUser(userInfo);
      // 
      // console.log("user in context: ",user);
      if(!userInfo){
        navigate("/");
      }
     },[navigate]);
   
  const ContextValue={user,setUser,selectedChat,setSelectedChat,chats,setChats};
    return <ChatContext.Provider value={ContextValue}>{children}</ChatContext.Provider>
};

//how we make state accessible to every where by using useContext hooks
export const ContextState=()=>{
    return useContext(ChatContext);
}

export default ChatProvider;
 