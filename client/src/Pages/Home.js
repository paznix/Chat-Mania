import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Img,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  background,
} from "@chakra-ui/react";

import Signup from "../components/Authentication/Signup";
import Login from "../components/Authentication/Login";
import { useNavigate } from "react-router-dom";
import { easeIn } from "framer-motion";
import Logo from "../logo.png";

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

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <div className=" bg-purple-100 md:bg-purple-100/75 backdrop-blur-3xl w-full text-black "
    >
      <Container
        className="bg-white backdrop-blur-2xl"
        centerContent
      >
        <Box
        className=" md:bg-purple-100 backdrop-blur-xl md:shadow-lg w-full "
          display="flex"
          flexDirection="column"
          justifyContent="center"
          p={3}
          borderRadius="2xl"
          position={"absolute"}
          top={{base:16, md:20}}
          
        >
          <div className=" text-[#793add]  flex items-center justify-center w-full pr-3 gap-2 " fontFamily={"Roboto"} >
            <img src={Logo} className="w-24 h-24" />
            <h3 className="text-3xl pt-1 font-bold italic">CHAT MANIA</h3>
          </div>
        </Box>

        <Box
        className="md:bg-purple-100 backdrop-blur-xl md:shadow-lg w-full"
          position={"absolute"}
          top={{base:250, md:250}}
          
          w="100%"
          p={4}
          borderRadius="2xl"

        >
          <Tabs variant="enclosed">
            <TabList my="1em" >
              <Tab
                fontFamily={"Farro"}
                color={"purple.300"}
                _selected={{
                  color: "purple.400",
                  border: "1px",
                  bgColor: "purple.100",
                  fontWeight: "bold",
                }}
                width={"50%"}
              >
                Login
              </Tab>
              <Tab
                fontFamily={"Farro"}
                color={"purple.300"}
                _selected={{
                  color: "purple.400",
                  border: "1px",
                  bgColor: "purple.100",
                  fontWeight: "bold",
                }}
                width={"50%"}
              >
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
