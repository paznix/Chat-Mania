import {Button} from "@chakra-ui/button"
import React, { useState } from 'react'
import {FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack} from "@chakra-ui/react";
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
    <VStack spacing="8px" fontFamily={'Palanquin'}>

    <FormControl className='border-gray-700 border-hidden'  id='email' isRequired>
     <FormLabel>Email</FormLabel>
     <Input value={email} placeholder='Enter Your Email' onChange={(e)=>setEmail(e.target.value)}/>
    </FormControl>

    <FormControl   id='password' isRequired>
     <FormLabel>Password</FormLabel>
     <InputGroup className='border-gray-700 border-hidden'>
     <Input value={password} type={show?"text":"password"} placeholder='Enter Your Password' onChange={(e)=>setPassword(e.target.value)}/>
     <InputRightElement width="4.5rem">
      <Button colorScheme="black" h="1.75rem" size="lg" onClick={handleclick}>
      {show? <Icon as={FaEye}/> : <Icon as={FaEyeSlash}/>}
      </Button>
     </InputRightElement>
     </InputGroup>
    </FormControl>


    <button className="w-full bg-purple-500 hover:bg-purple-400 transition rounded-lg py-2.5 font-farro font-medium mt-5" onClick={submitHandler} isLoading={loading}>
      Login
    </button>
    {/* <Button
      colorScheme="blue"
      width="100%"
      style={{ marginTop: 15 }}
      onClick={submitHandler}
      isLoading={loading}
    >Login</Button> */}
    
    <button className="w-full bg-white/10 hover:bg-white/15 transition py-2.5 rounded-lg" onClick={()=> {
      setEmail("guest@example.com");
      setPassword("123456");
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
