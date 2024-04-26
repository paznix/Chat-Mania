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

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, setSelectedChat, chats, setChats } = ContextState();
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
      //Not understand
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
        className=" bg-black bg-opacity-50 backdrop-blur-2xl text-white shadow-lg "
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="15px 10px 15px 20px"
        px={{base:5, md:6 }}
      >
        <Tooltip
          label="Search Users to chat"
          hasArrow
          placeContent="bottom-end"
        >
          <Button
            className="bg-white bg-opacity-10 text-white hover:text-gray-600"
            onClick={onOpen}
          >
            <i class="fa-solid fa-search "></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <div className="text-white pt-1 lg:pr-24">
          <h2 className="select-none relative text-purple-500 md:py-2 py-3 md:text-4xl text-3xl font-bold italic font-farro">
            CHAT MANIA
          </h2>
          <h2 className="select-none absolute top-4  md:py-2 py-3 md:text-4xl text-3xl font-bold italic font-farro">
            CHAT MANIA
          </h2>
        </div>

        <div className="flex justify-between text-red-300">
          <Menu>
            <ProfileModal>
              <Tooltip label="Profile" hasArrow>
                <MenuItem>
                  <Avatar
                    className="active:bg-transparent hover:scale-150 scale-125"
                    _hover={{ transitionDuration: "0.33s" }}
                    size="sm"
                    cursor="pointer"
                    name={user.name}
                    src={user.pic}

                  />
                </MenuItem>
              </Tooltip>
            </ProfileModal>

            {/* <MenuItem onClick={()=>{
                localStorage.removeItem("userinfo");
                navigate("/");
              }}
              marginRight={0}
              w={100}>Logout</MenuItem> */}
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
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
