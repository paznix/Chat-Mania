import Home from "./Pages/Home";
import ChatPage from "./Pages/ChatPage";
import Login from "./components/Authentication/Login";
import { Route, Routes} from 'react-router-dom';
import './App.css';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
        
      </Routes>
    </div>
  );
}

export default App;
