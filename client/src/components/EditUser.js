import React, { useEffect, useRef, useState } from "react";
import {
  IconButton,
  useDisclosure,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
} from "@chakra-ui/react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ContextState } from "../Context/ChatProvider";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import UploadFile from "../Helper/UploadFile";
import { BaseUrl } from "../config/Baseurl";

const EditUser = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = ContextState();
  const [name, setName] = useState(user.name); // State for the updated name

  // Function to handle onChange event for input field
  const handleOnChange = (e) => {
    setName(e.target.value);
  };

  // Function to handle updating user details
  const handleUpdateUser = async () => {
    try {
      const updatedUser = { ...user, name }; // Update only the name for now
      const response = await axios.post(`${BaseUrl}update`, updatedUser); // Adjust the API endpoint accordingly
      const { data } = response;
      // Assuming the response contains the updated user data
      dispatch(setUser(data)); // Dispatch an action to update the user details in Redux store
      onClose(); // Close the modal after successful update
      showToast("User details updated successfully", "success"); // Show a success toast message
    } catch (error) {
      console.error("Error updating user details:", error.response.data);
      showToast("Failed to update user details", "error"); // Show an error toast message
    }
  };

  // Function to display toast messages
  const showToast = (message, status) => {
    toast({
      title: message,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  const dispatch = useDispatch();
  const toast = useToast();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<IoMdInformationCircleOutline className="text-2xl " />}
          onClick={onOpen}
          bgColor={"transparent"}
          _hover={{ bgColor: "transparent" }}
          color={"purple.700"}
        />
      )}

      <Modal size="md" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalContent mx={5} height="450px" p={6} borderRadius={"2xl"}>
          <ModalHeader
            fontSize="32px"
            fontFamily="Roboto"
            display="flex"
            justifyContent="space-around"
          >
            Change Profile Picture
          </ModalHeader>
          <ModalCloseButton className="p-3" size="xl" />
          <ModalBody
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDir="column"
            color={"purple.700"}
          >
            <Box display={"flex"} flexDir={"column"} gap={4}>
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
              />
              <FormControl>
                      <FormLabel
                        type="button"
                        className="text-2xl text-purple-400 scale-125 hover:scale-150 ease-in-out px-0.5 mt-2 ml-3 duration-200  hover:cursor-pointer"
                        cente
                      >
                        <Input
                          type="file"
                          className="hidden"
                        />
                        <Button>Check</Button>
                      </FormLabel>
                    </FormControl>
            </Box>

  
            <Button
              bottom={0}
              right={0}
              position={"absolute"}
              m={4}
              borderRadius={"lg"}
              color={"white"}
              bgColor={"purple.500"}
              _hover={{ bgColor: "purple.400" }}
              onClick={handleUpdateUser} // Call the handleUpdateUser function on button click
            >
              Save Changes
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditUser;