import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Icon, useToast } from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../config/Baseurl";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const nevigate = useNavigate();
  const toast = useToast();
  const handleclick = () => {
    setShow(!show);
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics == undefined) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (pics.type == "image/jpeg" || pics.type == "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "daruus6qx");
      fetch("https://api.cloudinary.com/v1_1/daruus6qx/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${BaseUrl}user`,
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      if (data.success) {
        toast({
          title: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      } else {
        toast({
          title: "Registration Successful✅ Login to Continue",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="8px">
      <FormControl
        className="border-gray-700 border-hidden"
        id="first-name"
        isRequired
      >
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl
        className="border-gray-700 border-hidden"
        id="email"
        isRequired
      >
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup className="border-gray-700 border-hidden">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              colorScheme="black"
              h="1.75rem"
              size="lg"
              onClick={handleclick}
            >
              {show ? <Icon as={FaEye} /> : <Icon as={FaEyeSlash} />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup className="border-gray-700 border-hidden">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm your Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              colorScheme="black"
              h="1.75rem"
              size="lg"
              onClick={handleclick}
            >
              {show ? <Icon as={FaEye} /> : <Icon as={FaEyeSlash} />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl className="border-gray-700 border-hidden" id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          pt={1}
          pl={1}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <button className="w-full bg-purple-500 hover:bg-purple-400 transition rounded-lg py-2.5 font-farro font-medium mt-5" onClick={submitHandler} isLoading={loading}>
      Sign Up
    </button>
      {/* <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button> */}
    </VStack>
  );
};

export default Signup;
