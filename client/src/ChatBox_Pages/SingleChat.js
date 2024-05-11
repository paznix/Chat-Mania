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
  FormLabel,
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
import { IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { IoMdInformationCircleOutline } from "react-icons/io";
import UploadFile from "../Helper/UploadFile";
import CallDialog from "../CallElements/CallDialog";
import VideoDialog from "../CallElements/VideoDialog";
import IncomingDialog from "../CallElements/IncomingDialog";
import { PushToAudioCallQueue, UpdateAudioCallDialog } from "../redux/audioCall";


//socket code start
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
//socket code end

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState();
  const [newmessages, setNewMessages] = useState({
    sender: "",
    content: "",
    chat: "",
    imageUrl: "",
  });
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
    if ((event.key === "Enter" || event.type === "click") && newmessages) {
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
          {
            chatId: selectedChat,
            content: newmessages,
            imageUrl: newmessages.imageUrl,
          },
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

  const buttonSend = async (event) => {
    if (newmessages) {
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
          {
            chatId: selectedChat,
            content: newmessages,
            imageUrl: newmessages.imageUrl,
          },
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

  const handleSend = async () => {
    await buttonSend();
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await UploadFile(file);

    setNewMessages((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url,
      };
    });
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
          <div className="w-full flex items-center">
            <Text
              className="font-medium"
              fontFamily="Roboto"
              fontSize={{ base: "20px", md: "30px" }}
              pb={3}
              px={2}s0
              w="100%"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
              color={"purple.700"}
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                background={"transparent"}
                _hover={{ background: "transparent" }}
                color={"purple.700"}
                size={"2px"}
              />

              {messages &&
                (!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}

                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    />
                  </>
                ) : (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChat
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </>
                ))}
            </Text>
            <div className="flex items-center justify-center pb-3 mr-3 gap-2">
              <CallDialog
              sender = {getSenderFull(user, selectedChat.users)}/>
              <VideoDialog/>
            </div>
          </div>

          <Box
            className="bg-purple-100/25 outline-purple-300/10 outline text-white shadow-xl"
            display="flex"
            flexDir="column "
            justifyContent="flex-end"
            p={3}
            width="100%"
            height="100%"
            borderRadius="2xl"
            overflow="hidden"
            fontFamily={"roboto"}
          >
            {/* Image Preview */}
            {newmessages.imageUrl && (
              <div className="w-1/2 h-1/2 bg-black/10 backdrop-blur-xl">
                <img
                  src={newmessages.imageUrl}
                  alt="preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* messages here */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                color="purple.700"
              />
            ) : (
              <div className="">
                <div className="messages">
                  <ScrollableChat messages={messages} />
                  {istyping ? (
                    <Lottie
                      options={defaultOptions}
                      height={50}
                      width={50}
                      style={{
                        marginBottom: 0,
                        marginLeft: 33,
                        marginTop: 5,
                        background: "transparent",
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}

            <Box
              display={"flex"}
              alignItems={"end"}
              justifyItems="space-between"
              gap={2}
              mt={3}
              flexDir={"row"}
              className="drop-shadow-xl"
            >
              <FormControl isRequired onKeyDown={sendMessage}>
                {/* onKeyDown is used when we click enter this run */}

                <div className="flex bg-purple-100 rounded-xl text-purple-950">
                  <Input
                    borderRadius={12}
                    pl={6}
                    placeholder="Type your message here..."
                    value={newmessages.content}
                    onChange={typingHandler}
                    _hover={{ outline: "none" }}
                    _focus={{ outline: "none", border: "none" }}
                  />
                  <div className="bg-transparent flex justify-center items-center l z-10">
                    <FormControl>
                      <FormLabel
                        type="button"
                        className="text-2xl text-purple-400 scale-125 hover:scale-150 ease-in-out px-0.5 mt-2 ml-3 duration-200  hover:cursor-pointer"
                        cente
                      >
                        <Input
                          type="file"
                          className="hidden"
                          onChange={handleUploadFile}
                        />
                        <ImAttachment />
                      </FormLabel>
                    </FormControl>
                  </div>
                </div>
              </FormControl>

              <div className="bg-purple-600 rounded-xl flex justify-center items-center h-full shadow-xl">
                <button
                  className="text-2xl text-white -rotate-45 hover:scale-110 ease-in-out px-1.5 pb-2 duration-200 ml-3"
                  borderRadius={"xl"}
                  cursor={"pointer"}
                  onClick={handleSend}
                >
                  <IoSend />
                </button>
              </div>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Roboto" color={"purple.700"}>
            Click on a User to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
