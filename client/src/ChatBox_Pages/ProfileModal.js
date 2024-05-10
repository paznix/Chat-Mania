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
import { IoMdInformationCircleOutline } from "react-icons/io";


const ProfileModal = ({user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<IoMdInformationCircleOutline className="text-2xl "/>}
          onClick={onOpen}
          bgColor={"transparent"}
          _hover={{bgColor:"transparent"}}
          color={"purple.700"}
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
            
            
          
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
