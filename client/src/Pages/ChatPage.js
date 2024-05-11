import React, { useState } from "react";
import { Box } from "@chakra-ui/layout";
import { ContextState } from "../Context/ChatProvider";
import SideDrawer from "../ChatBox_Pages/SideDrawer";
import MyChats from "../ChatBox_Pages/MyChats";
import ChatBox from "../ChatBox_Pages/ChatBox";


const ChatPage = () => {
  const { user } = ContextState();
  const [fetchAgain,setFetchAgain]=useState(false);

  return (
    <div className=" bg-white backdrop-blur-2xl z-10" style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box className="relative -z-10" fontFamily={"Roboto"}
       display="flex" flexDirection="row" justifyContent="space-between" h={{base:"90.8vh", md:"90.4vh"}}>
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
