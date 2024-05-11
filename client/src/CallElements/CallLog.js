import {
    Box,
    Button,
    useToast,
    Text,
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
  import ChatLoading from "../ChatBox_Pages/ChatLoading";
  import { getSender, getSenderPic } from "../config/ChatLogic";
  import GroupChatModal from "../Group_chatpage/GroupChatModal";
  import { BaseUrl } from "../config/Baseurl";
  import { FaUserGroup } from "react-icons/fa6";
  import GroupImage from "../grp.png";
  import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
  import { FaVideo, FaPhoneAlt } from "react-icons/fa";
  
  const CallLogElement = ({ fetchAgain, incoming, missed, audioCall }) => {
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
      <>
        <Box
          display="flex"
          flexDir="column"
          width="100%"
          // borderRadius="xl"
          overflow="hidden"
          mt={4}
        >
          {chats ? (
            <Box overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  mb={3}
                  className="shadow-md transition flex items-center justify-start gap-5"
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
                  <div className="flex  w-full items-center justify-between">
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
                        <div className="flex items-end gap-2">
                          {incoming ? (
                            <GoArrowDownLeft
                              color={missed ? "red" : "purple.700"}
                            />
                          ) : (
                            <GoArrowUpRight className="text-lg text-[#00cf15]" />
                          )}
                          <Text fontSize={12} color={"gray.500"}> Yesterday 00:24</Text>
                            
                        </div>
                      </div>
                    </div>
                    <div className="mr-3 hover:cursor-pointer">
                      {audioCall ? <FaPhoneAlt /> : <FaVideo />}
                    </div>
                  </div>
                </Box>
              ))}
            </Box>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </>
    );
  };
  
  export default CallLogElement;
  