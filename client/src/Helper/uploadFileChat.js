import axios from "axios"

const uploadFileChat = async (data) => {
    try {
      return await axios.post(`http://localhost:5000/api/images/file/upload`, data);
    } catch (error) {
      console.log("Error while uploading File: ", error.message);
    }
  }

  export default uploadFileChat;