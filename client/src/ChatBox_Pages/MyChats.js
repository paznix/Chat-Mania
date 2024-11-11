import { Box, Button, useToast, Text, Image } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ContextState } from "../Context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderPic } from "../config/ChatLogic";
import GroupChatModal from "../Group_chatpage/GroupChatModal";
import { BaseUrl } from "../config/Baseurl";
import GroupImage from "../grp.png";
import { IoChatboxEllipses } from "react-icons/io5";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } =
    ContextState();
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${BaseUrl}chat`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error occored!",
        description: "Failed to load the chats",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userinfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      className=" md:bg-purple-100/20 text-black shadow-xl z-20 shadow-purple-900/35 h-full"
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      justifyItems={"space-between"}
      p={4}
      w={{ base: "100%", md: "32%" }}
      // borderRadius={{base:"2xl", md:"none"}}
    >
      <Box className="flex items-center justify-between w-full">
        <div className="flex gap-2 items-center text-xl md:text-2xl font-semibold text-purple-700 w-full my-7 pl-4 mb-9" >
          <IoChatboxEllipses className="text-2xl md:text-3xl" />
          <h3 className="pb-1">My Chats</h3>
        </div>
        <div className=" flex z-10 shadow-md rounded-xl mb-3 md:scale-100 scale-90">
          <GroupChatModal>
            <Button
              className="flex  gap-3 justify-between items-center"
              _hover={{ background: "transparent", color: "purple.400" }}
              background={"transparent"}
              color={"purple.700"}
            >
              Create Group <AddIcon />
            </Button>
          </GroupChatModal>
        </div>
      </Box>
        
      
      <Box
        pb={4}
        fontFamily="Roboto"
        width="100%"
        justifyContent="start"
        alignItems="center"
        fontWeight="bold"
        background={"transparent"}
      >
        {/* if we want to display modal on click with the button then wrap the button with the component which is going to visible on click */}
        

        <Box
          display="flex"
          flexDir="column"
          width="100%"
          // borderRadius="xl"
          overflow="hidden"
        >
          {chats ? (
            <Box overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  mb={3}
                  className="shadow-md transition flex items-center justify-start gap-5"
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  _hover={
                    selectedChat == chat
                      ? ""
                      : {
                          backgroundColor: "#bf74f7",
                          textColor: "white",
                          transitionDuration: "0.3s",
                          transitionTimingFunction: "ease-in-out",
                        }
                  }
                  color={selectedChat == chat ? "gray.200" : "gray.200"}
                  bgColor={selectedChat == chat ? "#a336f5" : "#c7b7ec77"}
                  textColor={selectedChat == chat ? "white" : "purple.700"}
                  fontSize="x-large"
                  px={5}
                  py={2}
                  pb={3}
                  borderRadius={{ base: "2xl", md: "xl" }}
                  key={chat._id}
                >
                  <div className="flex flex-row items-center gap-4">
                    <Image
                      w={16}
                      h={16}
                      mt={1.5}
                      borderRadius={40}
                      bgColor={"purple.500"}
                      color={"white"}
                      src={
                        !chat.isGroupChat
                          ? getSenderPic(loggedUser, chat.users)
                          : GroupImage
                      }
                    />
                    <div className="flex flex-col mt-1">
                      <Text>
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      {chat.latestMessage && (
                        <Text fontSize="xs">
                          <b>{chat.latestMessage.sender.name} : </b>
                          {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content}
                        </Text>
                      )}
                    </div>
                  </div>
                </Box>
              ))}
            </Box>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
      
    </Box>
  );
};

export default MyChats;
