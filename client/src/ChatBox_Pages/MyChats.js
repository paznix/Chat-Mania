import {
  Box,
  Button,
  Flex,
  Stack,
  useToast,
  Text,
  Tooltip,
  Image,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
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
      p={4}
      w={{ base: "100%", md: "31%" }}
      borderRadius="2xl"
    >
      <Tabs variant="enclosed" className="w-full h-full overflow-hidden ">
        <TabList mb="1em">
          <Tab
            fontFamily={"Palanquin"}
            color={"purple.200"}
            _selected={{
              color: "purple.400",
              border: "1px",
              bgColor: "purple.100",
              fontWeight: "bold",
            }}
            width={"50%"}
          >
            My Chats
          </Tab>
          <Tab
            fontFamily={"Palanquin"}
            color={"purple.200"}
            _selected={{
              color: "purple.400",
              border: "1px",
              bgColor: "purple.100",
              fontWeight: "bold",
            }}
            width={"50%"}
          >
            Voice Calls
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box
              className="hidden md:flex"
              pb={7}
              fontSize={{ base: "28px", md: "22px" }}
              fontFamily="Palanquin"
              width="100%"
              justifyContent="start"
              alignItems="center"
              fontWeight="bold"
            >
              {/* if we want to display modal on click with the button then wrap the button with the component which is going to visible on click */}
              <GroupChatModal>
                <button className="flex gap-3 justify-between items-center pb-2 px-2 py-1 mt-1 rounded-md">
                  Create Group <AddIcon />
                </button>
              </GroupChatModal>
            </Box>
            <div className="flex md:hidden absolute bottom-3 right-3 z-10 shadow-lg">
              {/* if we want to display modal on click with the button then wrap the button with the component which is going to visible on click */}
              <GroupChatModal>
                <button className="flex gap-3 justify-between items-center">
                Create Group <AddIcon />
                </button>
              </GroupChatModal>
            </div>
            <Box
              display="flex"
              flexDir="column"
              width="100%"
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
                              ? chat.latestMessage.content.substring(0, 51) +
                                "..."
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MyChats;
