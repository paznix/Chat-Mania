import React from 'react'
import { ContextState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat}=ContextState();
  return (
    <Box
    className=" font-pal bg-black bg-opacity-50 backdrop-blur-2xl text-white shadow-lg"
    display={{base:selectedChat ? "flex" : "none",md:"flex"}}
    alignItems="center"
    flexDir="column"
    p={3}
    width={{base:"100%",md:"68%"}}
    borderRadius="xl"

    
    >
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
