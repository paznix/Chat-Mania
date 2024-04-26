import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  background,
} from "@chakra-ui/react";

import Signup from "../components/Authentication/Signup";
import Login from "../components/Authentication/Login"
import { useNavigate } from "react-router-dom";
import { easeIn } from "framer-motion";
const Home = () => {
  // const [name, setname] = useState();
  // const getdata = async () => {
  //   const data = await axios.get("http://localhost:5000/api/chat");
  //   // setname(data);
  //   console.log(data.data);
  // };

  // useEffect(() => {
  //   getdata();
  // }, []);
  
  const navigate=useNavigate();
  useEffect(()=>{
     const user=JSON.parse(localStorage.getItem("userInfo"));
     if(user){
      navigate("/chat");
     }

  },[navigate]);

  return (
    <Container className="align-center justify-center" maxW="xl" centerContent>
      <Box
      className=" bg-black bg-opacity-50 backdrop-blur-2xl shadow-lg"
        display="flex"
        justifyContent="center"
        p={3}

        w="100%"
        m="40px 0 15px 0"
        borderRadius="2xl"

      >
        <div className="text-white pt-2">
        <h2 className='relative select-none text-purple-500 md:py-2 py-3 md:text-4xl text-3xl font-bold italic font-farro'>CHAT MANIA</h2>
        <h2 className='absolute select-none top-4  md:py-2 py-3 md:text-4xl text-3xl font-bold italic font-farro'>CHAT MANIA</h2>
        </div>
        
      </Box>

      
      <Box
      className=" bg-black bg-opacity-50 backdrop-blur-2xl text-white shadow-lg "
       w="100%" p={4} borderRadius="2xl" >
        <Tabs variant="enclosed">
          <TabList  mb="1em">
            <Tab fontFamily={'Farro'} color={"purple.200"} _selected={{color:'purple.400', border:'1px', bgColor:'purple.100', fontWeight:'bold'}} width={"50%"}>Login</Tab>
            <Tab fontFamily={'Farro'} color={"purple.200"} _selected={{color:'purple.400', border:'1px', bgColor:'purple.100', fontWeight:'bold'}} width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      
    </Container>
  );
};

export default Home;
