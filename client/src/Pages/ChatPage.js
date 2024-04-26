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
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box className="justify-center gap-4"
       display="flex" flexDirection="row" justifyContent="space-between" w="100%" h="90vh" p="20px">
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
