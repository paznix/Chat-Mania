import {
  Box,
  Button,
  Flex,
  Stack,
  useToast,
  Text,
  Tooltip,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ContextState } from "../Context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogic";
import GroupChatModal from "../Group_chatpage/GroupChatModal";
import { BaseUrl } from "../config/Baseurl";
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
      className=" bg-black bg-opacity-50 backdrop-blur-2xl text-white shadow-lg "
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      w={{ base: "100%", md: "31%" }}
      borderRadius="xl"
    >
      <Box
        px={2}
        pb={4}
        fontSize={{ base: "28px", md: "22px" }}
        fontFamily="Palanquin"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
      >
        My Chats
        {/* if we want to display modal on click with the button then wrap the button with the component which is going to visible on click */}
        <GroupChatModal>
          <button className="flex gap-3 justify-between items-center pb-2 px-2 py-1 mt-1 rounded-md bg-transparent">
            Create Group <AddIcon />
          </button>
        </GroupChatModal>
      </Box>
      <Box
        className="bg-gray-500 bg-opacity-25 text-white shadow-lg"
        display="flex"
        flexDir="column"
        p={3}
        width="100%"
        h="100%"
        borderRadius="xl"
        overflow="hidden"
      >
        {chats ? (
          <Box overflowY="scroll">
            {chats.map((chat) => (
              <Box
                my={2}
                className="shadow-md transition flex items-center justify-start gap-5"
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                _hover={
                  selectedChat == chat
                    ? ""
                    : {
                        background:
                          "linear-gradient(rgba(191,116,247,0.3), rgba(191,161,247,0.3))",
                      }
                }
                color={selectedChat == chat ? "gray.200" : "gray.200"}
                bgImage={
                  selectedChat == chat
                    ? "linear-gradient(rgba(191, 116, 247, 0.5),rgba(191, 116, 247, 0.4))"
                    : "linear-gradient(rgba(255, 255, 255, 0.1),rgba(255, 255, 255, 0.2))"
                }
                fontSize="x-large"
                px={5}
                py={3}
                borderRadius="xl"
                key={chat._id}
              >
                <Image className="w-12 h-12"  borderRadius="full" src={chat.pic}
                
                />
                <div className="flex flex-col">
                  <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
                </div>
                
              </Box>
            ))}
          </Box>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
