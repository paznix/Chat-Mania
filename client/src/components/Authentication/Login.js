import {Button} from "@chakra-ui/button"
import React, { useState } from 'react'
import {FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, background} from "@chakra-ui/react";
import { Icon, useToast } from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../config/Baseurl";


const Login = () => {
  const [show,setShow]=useState(false);
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const toast=useToast();

  const handleclick=()=>{
    setShow(!show);
  }

  const submitHandler=async ()=>{
      setLoading(true);
      if(!email || !password){
        toast({
          title: 'Please fill all the fields',
          status: 'Warning',
          duration: 5000,
          isClosable: true,
          position:"top",
        });
        setLoading(false);
        return;
      }
      
      try {
        const config={
          headers:{
            "Content-type":"application/json",
          },
        };

        const {data}=await axios.post(`${BaseUrl}user/login`,
         {email,password},config
        );
        if(data.message==='user not found'){
          toast({
            title: data.message,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"top",
          });
        }
        else if(data.message==="Invalid Email or Password"){
          toast({
            title: data.message,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"top",
          });          
        }
        else{
        toast({
          title: 'Login Successful',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:"top",
        });
        navigate("/chat");
      }
        localStorage.setItem("userinfo",JSON.stringify(data));
        setLoading(false);

      } catch (error) {
        toast({
          title: 'Error occured',
          description:error.response.data.message,
          status: 'Error',
          duration: 5000,
          isClosable: true,
          position:"top",
        });
        setLoading(false);
      }
  }
  return (
    <VStack color={"purple.600"} spacing="8px" fontFamily={'Roboto'} className="font-medium ">

    <FormControl className='border-purple-700/40 border-hidden' id='email' isRequired>
     <FormLabel color={"purple.470"} fontWeight={"semibold"}>Email</FormLabel>
     <Input  color={"purple.400"} value={email} placeholder='guest@chatmania.com' onChange={(e)=>setEmail(e.target.value)}/>
    </FormControl>

    <FormControl   id='password' isRequired>
     <FormLabel fontWeight={"semibold"}>Password</FormLabel>
     <InputGroup className='border-purple-700/40 border-hidden'>
     <Input value={password} type={show?"text":"password"} color={"purple.400"} placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
     <InputRightElement width="4.5rem">
      <Button _hover={{background:"transparent"}} background={"transparent"} color={"purple.700"} h="1.75rem" size="lg" onClick={handleclick}>
      {show? <Icon as={FaEye}/> : <Icon as={FaEyeSlash}/>}
      </Button>
     </InputRightElement>
     </InputGroup>
    </FormControl>


    <Button
        className="w-full bg-purple-500 hover:bg-purple-400 transition rounded-lg py-2.5 text-white font-medium mt-5"
        onClick={submitHandler}
        isLoading={loading}
        color={"white"}
        bgColor={"purple.500"}
        _hover={{bgColor:"purple.400"}}
      >
        Login
      </Button>
    {/* <Button
      colorScheme="blue"
      width="100%"
      style={{ marginTop: 15 }}
      onClick={submitHandler}
      isLoading={loading}
    >Login</Button> */}
    
    <button className="w-full bg-[#bf74f7]/30 hover:bg-[#bf74f7]/15 transition py-2.5 rounded-lg" onClick={()=> {
      setEmail("guest@chatmania.com");
      setPassword("Guest@1234");
    }}>
      Get GUEST user credentials
    </button>
    {/* <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get GUEST user credentials
      </Button> */}
    </VStack>
)
}

export default Login;
