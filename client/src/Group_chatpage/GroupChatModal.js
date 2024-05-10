import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Spinner,
  Box,
} from "@chakra-ui/react";
import ChatProvider, { ContextState } from "../Context/ChatProvider";
import axios from "axios";
import { BaseUrl } from "../config/Baseurl";
import UserListItem from "../ChatBox_Pages/UsersSideDrawer/UserListItem";
import UserBadgeItem from "./UserBadgeItem";




const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user, chats, setChats } = ContextState();

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
      console.log(searchResult);
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

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${BaseUrl}chat/group`,
        {
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
          name: groupChatName,
        },
        config
      );
      setLoading(false);
      console.log(data);
      setChats([data, ...chats]);
      onclose();
      toast({
        title: "New Group Chat Created",
        status: "Success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Error occored!",
        description: "Failed to Create group chat",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };
  const handleRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((id) => id != user));
  };

  return (
    <>
      <Button onClick={onOpen}>{children}</Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered height="30%">
        <ModalOverlay />
        <ModalContent background={"transparent"}>
          <div className="flex flex-col p-6 bg-white w-full h-full rounded-2xl text-black shadow-lg">
            <ModalHeader
              fontFamily={"Roboto"}
              fontSize="35px"
              display="flex"
              justifyContent="center"
            >
              Create Group
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDir="column"
              alignItems="center"
              fontFamily={"Roboto"}
            >
              <FormControl>
                <Input
                  placeholder="Group Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Search Users"
                  value={search}
                  mb={3}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>

              {/* showing selected users */}
              <Box
                display="flex"
                width="95%"
                flexWrap="wrap"
                alignItems="center"
              >
                {selectedUsers.map((user) => (
                  <UserBadgeItem
                    user={user}
                    handleRemove={() => handleRemove(user)}
                  />
                ))}
              </Box>

              {/* search user and select */}
              {loading ? (
                <Spinner ml="auto" display="flex" />
              ) : (
                searchResult
                  .slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </ModalBody>

            <ModalFooter>
              <button
                style={{ transitionDuration: "0.33s" }}
                className="hover:bg-purple-300 bg-purple-500 px-3 py-1 rounded-md font-semibold text-white"
                onClick={handleSubmit}
              >
                Create
              </button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
