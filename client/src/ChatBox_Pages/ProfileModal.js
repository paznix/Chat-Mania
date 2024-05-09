import React from "react";
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
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ContextState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = ContextState();
  const navigate = useNavigate();

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
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
              />

              <Text
                fontSize={{ base: "20px", md: "30px" }}
                fontFamily="Roboto"
              >
                {user.email}
              </Text>
            </ModalBody>

            <div className="flex justify-center items-center mt-2">
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
          
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
