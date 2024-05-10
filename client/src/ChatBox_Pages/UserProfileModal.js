import React, { useState, useEffect, useRef } from "react";
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
  Divider,
  FormControl,
  Input,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ContextState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { BaseUrl } from "../config/Baseurl";
import socketIOClient from "socket.io-client";
import UploadFile from "../Helper/UploadFile";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";

const UserProfileModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = ContextState();
  const navigate = useNavigate();
  const [data, setData] = useState({
    pic: children?.pic,
  });

  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((preve) => {
      return {
        ...preve,
        ...user,
      };
    });
  }, [children]);

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();

    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await UploadFile(file);

    setData((preve) => {
      return {
        ...preve,
        pic: uploadPhoto?.url,
      };
    });
  };


  const handleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const URL = `${BaseUrl}update`;

      const response = await axios({
        method: "post",
        url: URL,
        data: data,
        withCredentials: true,
      });

      console.log("response", response);

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal size="md" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          mx={5}
          height="450px"
          p={6}
          transitionTimingFunction="ease-in"
          borderRadius={"2xl"}
        >
          <ModalHeader
            fontSize="40px"
            fontFamily="Roboto"
            display="flex"
            justifyContent="space-around"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton className="p-3" size="xl" />
          <ModalBody
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            flexDir="column"
          >
            <div className="flex">
              <Image
                borderRadius="full"
                boxSize="150px"
                src={data?.pic}
                alt={data?.name}
                mb={10}
              />
              <div className="absolute mt-[6.4rem] ml-28 bg-purple-500/30 backdrop-blur-xl shadow-xl w-12 h-12 text-white  rounded-full">
                <FormControl>
                  <FormLabel
                    type="button"
                    className="flex justify-center items-center"
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadPhoto}
                    />
                    <MdModeEdit className="ml-3 mt-3 text-2xl hover:cursor-pointer hover:scale-110 ease-in-out duration-200" />
                  </FormLabel>
                </FormControl>
              </div>
            </div>

            <Text fontSize={{ base: "20px", md: "30px" }} fontFamily="Roboto">
              {user.email}
            </Text>
          </ModalBody>
          <div className="flex w-full">
            <div
              className="flex items-center justify-center mt-2 w-1/2
            "
            >
              <Button
                bgColor={"transparent"}
                _hover={{ bgColor: "transparent" }}
                onClick={handleSave}
                color={"purple.500"}
              >
                Save
              </Button>
            </div>
            <div className="flex justify-center items-center mt-2 w-1/2">
              <button
                className=" px-3 py-1 rounded-lg text-red-600 font-semibold font-pal"
                onClick={() => {
                  localStorage.removeItem("userinfo");
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserProfileModal;
