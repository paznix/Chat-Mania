import React, { useState } from "react";
import {
  Text,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Box,
  FormControl,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ContextState } from "../Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import { BaseUrl } from "../config/Baseurl";
import UserListItem from "../ChatBox_Pages/UsersSideDrawer/UserListItem";
import { IoMdInformationCircleOutline } from "react-icons/io";



const UpdateGroupChat = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ContextState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove !== user._id) {
      //here user._id is current login user
      toast({
        title: "Only admin can remove the people!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${BaseUrl}chat/groupremove`,
        { chatId: selectedChat._id, userId: userToRemove._id },
        config
      );
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages(); //by dpoing that all the message get refresh
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occored!",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${BaseUrl}chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error in Renaming",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!search) {
      return;
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
    }
  };

  const handleAddUser = async (userToAdd) => {
    //if selected user already in group then (selectedchat store the current selected group chat id so we access users,name ,etc as well)
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already in group!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      //here user._id is current login user
      toast({
        title: "Only admin can add the people!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${BaseUrl}chat/groupadd`,
        { chatId: selectedChat._id, userId: userToAdd._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occored!",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  return (
    <>
     <IconButton
          display={{ base: "flex" }}
          icon={<IoMdInformationCircleOutline className="text-2xl "/>}
          onClick={onOpen}
          bgColor={"transparent"}
          _hover={{bgColor:"transparent"}}
          color={"purple.700"}
        />
      <Modal size="md" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          mx={5}
          px={6}
          pt={6}
          pb={2}
          transitionTimingFunction="ease-in"
          borderRadius={"2xl"}
        >
          <ModalHeader
            fontSize="35px"
            fontFamily="Roboto"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton className="p-3" size="xl" />
          <ModalBody
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDir="column"
          >
            <Box display="flex" justifyContent="flex-start" alignItems="center" mb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem user={u} handleRemove={() => handleRemove(u)} />
              ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Rename Group"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <Button
                variant="solid"
                bgColor="transparent"
                color={"purple.500"}
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
                _hover={{ bgColor: "transparent", color: "purple.400" }}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner ml="auto" display="flex" />
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              color={"red.500"}
              bgColor={"transparent"}
              _hover={{ bgColor: "transparent", color: "red.300" }}
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChat;
