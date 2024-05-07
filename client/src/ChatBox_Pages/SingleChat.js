import React, { useEffect, useState } from "react";
import { ContextState } from "../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChat from "../Group_chatpage/UpdateGroupChat";
import axios from "axios";
import { BaseUrl } from "../config/Baseurl";
import "../style.css";
import ScrollableChat from "./UsersSideDrawer/ScrollableChat";
import animationData from "../animations/typing.json";
import Lottie from "react-lottie";

//socket code start
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
//socket code end

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState();
  const [newmessages, setNewMessages] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ContextState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${BaseUrl}messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      //console.log("Fetched chat:",messages);
      //which chat us selected it create a room with selected chat id
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the messages.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newmessages) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessages("");
        const { data } = await axios.post(
          `${BaseUrl}messages`,
          { chatId: selectedChat, content: newmessages },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occuredd!",
          description: "Failed to send the message.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        console.log(error);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //recieving the message
  useEffect(() => {
    socket.on("message recieved", (newmessagesRecieved) => {
      //console.log("Recieved message: ",newmessagesRecieved)
      // console.log("Message is ",messages);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newmessagesRecieved.chat._id
      ) {
        //give notification
        if (!notification?.includes(newmessagesRecieved)) {
          setNotification([newmessagesRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newmessagesRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            className="font-medium"
            fontFamily="Palanquin"
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              background={"transparent"}
              _hover={{background:"transparent"}}
              color={"black"}
              size={"2px"}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>{getSender(user, selectedChat.users)}</>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChat
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              ))}
          </Text>

          <Box
            className="bg-purple-100 text-white shadow-lg"
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
        
            width="100%"
            height="100%"
            borderRadius="2xl"
            overflow="hidden"
          >
            {/* messages here */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl isRequired mt={3} onKeyDown={sendMessage}>
              {/* onKeyDown is used when we click enter this run */}
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                borderRadius={8}
                pl={6}
                pb={1}
                placeholder="Enter a message"
                value={newmessages}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Palanquin">
            Click on a User to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
