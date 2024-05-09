import React from 'react'
import { ContextState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat}=ContextState();
  return (
    <Box
    className=" font-pal bg-purple-100/30 text-black shadow-lg"
    display={{base:selectedChat ? "flex" : "none",md:"flex"}}
    alignItems="center"
    flexDir="column"
    p={3}
    px={5}
    width={{base:"100%",md:"68%"}}
    // borderRadius={{base: "2xl", md:"none"}}

    
    >
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
