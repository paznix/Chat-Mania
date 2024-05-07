import {
  Box,
  Tooltip,
  Text,
  Menu,
  Avatar,
  MenuItem,
  Input,
  useDisclosure,
  Toast,
  Spinner,
  Flex,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import React, { useState } from "react";
import { ContextState } from "../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../config/Baseurl";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UsersSideDrawer/UserListItem";
import NotificationBadge, { Effect } from "react-notification-badge";
import { IoIosNotifications } from "react-icons/io";
import { getSender } from "../config/ChatLogic";
import Logo from "../logo.png";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ContextState();
  const navigate = useNavigate();
  const toast = useToast();
  //for right side drawer
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${BaseUrl}user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
      //console.log(searchResult);
    } catch (error) {
      toast({
        title: "Error occored!",
        description: "Failed to load the result",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      //we also pass json data to this api so we add content-type in header
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${BaseUrl}chat`,
        { userId: userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error in fetching chat!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setLoadingChat(false);
    }
  };

  return (
    <div>
      <Box
        fontFamily="Palanquin"
        className=" bg-[#10001c] backdrop-blur-2xl text-black shadow-xl "
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="2px 10px 4px 20px"
        px={{ base: 5, md: 6 }}
      >
        <Tooltip
          label="Search Users to chat"
          hasArrow
          placeContent="bottom-end"
        >
          <Button
            color={"white"}
            _hover={{ background: "transparent" }}
            background={"transparent"}
            className="bg-white/20 bg-opacity-10 text-white hover:text-gray-400"
            onClick={onOpen}
          >
            <i class="fa-solid fa-search "></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <div className="text-white pt-2 font-farro flex items-center justify-center w-full gap-3 mb-2 ml-14 md:ml-0">
          <img src={Logo} className="w-16 h-16" />
          <h3 className="text-3xl pt-1 hidden md:block">Chat Mania</h3>
        </div>

        <div className="flex justify-center md:justify-between text-slate-600">
          <Menu>
            <MenuButton p={1} mr={{base:"2", md:"5"}}>
              <NotificationBadge
                count={notification?.length}
                effect={Effect.SCALE}
              />
              <IoIosNotifications className="text-2xl text-gray-300 mr-2 " />
            </MenuButton>

            <MenuList px={2}>
              {!notification?.length && "No New Messages"}
              {notification?.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => n.chat._id !== notif.chat._id)
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                  {notif.chat.users && notif.chat.users.length > 0}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <ProfileModal>
              <Tooltip label="Profile" hasArrow>
                <MenuItem background={"transparent"}>
                  <Avatar
                    className="bg-transparent hover:scale-150 scale-125"
                    _hover={{ transitionDuration: "0.33s" }}
                    size="sm"
                    cursor="pointer"
                    name={user.name}
                    src={user.pic}
                  />
                </MenuItem>
              </Tooltip>
            </ProfileModal>
          </Menu>
        </div>
      </Box>

      {/* code for drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <div className=" w-full h-full bg-purple-100/20   shadow-black shadow-2xl">
            <DrawerHeader>Search Users</DrawerHeader>
            <DrawerBody>
              <Box display="flex" justifyContent="space-between" gap={2}>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter Name or Email"
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult.map((user) => {
                  return (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  );
                })
              )}
              {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
