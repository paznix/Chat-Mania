import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider";
import { Provider } from "react-redux";
import {store} from "../src/redux/store"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
  <Provider store={store}>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
  </ChatProvider>
  </Provider>
  
  </BrowserRouter>
);
