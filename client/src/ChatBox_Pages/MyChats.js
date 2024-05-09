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
      className=" md:bg-purple-100/20 text-black shadow-xl z-20 shadow-purple-900/35 "
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      w={{ base: "100%", md: "32%" }}
      // borderRadius={{base:"2xl", md:"none"}}
    >
      <Tabs variant="enclosed" className="w-full h-full overflow-hidden ">
        <TabList>
          <Tab
            fontFamily={"Roboto"}
            color={"purple.200"}
            _selected={{
              color: "purple.400",
              border: "1px",
              bgColor: "purple.100",
              fontWeight: "bold",
            }}
            width={"50%"}
            py={3}
          >
            My Chats
          </Tab>
          <Tab
            fontFamily={"Roboto"}
            color={"purple.200"}
            _selected={{
              color: "purple.400",
              border: "1px",
              bgColor: "purple.100",
              fontWeight: "bold",
            }}
            width={"50%"}
            py={3}
          >
            Voice Calls
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
              <Box className=" flex absolute bottom-3 right-3 z-10 shadow-md rounded-xl">
                <GroupChatModal
                >
                  <Button
                    className="flex  gap-3 justify-between items-center"
                    _hover={{ background: "transparent", color: "purple.400" }}
                    background={"transparent"}
                    color={"purple.700"}
                  >
                    Create Group <AddIcon />
                  </Button>
                </GroupChatModal>
              </Box>
            </Box>

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
