import React, { useRef } from "react";
import {
  useDisclosure,
  Image,
  Text,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  IconButton,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axiosInstance from "../config/axios";

import { socket } from "../socket";
import { ResetAudioCallQueue, UpdateAudioCallDialog } from "../redux/audioCall";
import { FaVideo, FaPhoneAlt } from "react-icons/fa";
import { ContextState } from "../Context/ChatProvider";
var ZegoExpressEngine = require("zego-express-engine-webrtc").ZegoExpressEngine;

const IncomingDialog = ({ sender, children }) => {
  const dispatch = useDispatch();
  const {isOpen, onOpen, onClose} = useDisclosure();

  const { user } = ContextState();
  const [call_details] = useSelector((state) => state.audioCall.call_queue);

  const handleAccept = () => {
    socket?.emit("audio_call_accepted", { ...call_details });
    dispatch(UpdateAudioCallDialog({ state: true }));
  };

  const handleDeny = () => {
    //
    socket?.emit("audio_call_denied", { ...call_details });
    dispatch(ResetAudioCallQueue());
    onClose();
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<FaPhoneAlt className="text-lg " />}
          onClick={onOpen}
          bgColor={"transparent"}
          _hover={{ bgColor: "transparent" }}
          color={"purple.700"}
        />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
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
            Incoming Call ...
          </ModalHeader>
          <ModalCloseButton className="p-3" size="xl" />
          <ModalBody
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            flexDir="column"
            width={"100%"}
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={sender.pic}
              alt={sender.name}
            />
            <Text
            className="text-2xl font-semibold ">
              {sender.name}
            </Text>
          </ModalBody>
          <div className="w-full flex justify-end items-baseline pt-10 gap-3 px-3">
            <Button
              color={"white"}
              bgColor={"green.500"}
              _hover={{ bgColor: "green" }}
              onClick={handleAccept}
              width={"50%"}
            >
              Accept
            </Button>
            <Button
            width={"50%"}
              color={"white"}
              bgColor={"red.500"}
              _hover={{ bgColor: "red" }}
              onClick={handleDeny}
            >
              Deny
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default IncomingDialog;
