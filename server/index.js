const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const AudioCall = require("./models/audioCall");
const updateUserRoutes = require("./routes/updateUserRoutes");

// const {notFound,errorHandler} =require("./middleware/errorMiddleware");
// require('dotenv').config({path:'./.env'})
require("dotenv").config({ path: __dirname + "../" });
const app = express();
connectDB();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/update", updateUserRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

const server = app.listen(process.env.PORT, () =>
  console.log(`server is running on port ${process.env.PORT}`)
);

//Chat app work fine but it is not real time chat so make it real time chat we need to include socket io in the project

const io = require("socket.io")(server, {
  pingTimeout: 60000, //the connection is active only for the 60 sec and after that the connection is closed to save the bandwidth
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // this required a name and we give the name connection
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    //here we create new socket setup in which only one user can join which has id (provided by the forntend part)
    socket.join(userData._id); //creating room with logged in user
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    //console.log("user joined Room: ",room);
  });

  socket.on("new message", (newmessageRecieved) => {
    var chat = newmessageRecieved.chat;
    if (!chat.users) return console.log("chat users not defined");

    chat.users.forEach((user) => {
      if (user._id === newmessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newmessageRecieved);
    });
  });

  // -------------- HANDLE AUDIO CALL SOCKET EVENTS ----------------- //

  // handle start_audio_call event
  socket.on("start_audio_call", async (data) => {
    const { from, to, roomID } = data;

    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    console.log("to_user", to_user);

    // send notification to receiver of call
    io.to(to_user?.socket_id).emit("audio_call_notification", {
      from: from_user,
      roomID,
      streamID: from,
      userID: to,
      userName: to,
    });
  });

  // handle audio_call_not_picked
  socket.on("audio_call_not_picked", async (data) => {
    console.log(data);
    // find and update call record
    const { to, from } = data;

    const to_user = await User.findById(to);

    await AudioCall.findOneAndUpdate(
      {
        participants: { $size: 2, $all: [to, from] },
      },
      { verdict: "Missed", status: "Ended", endedAt: Date.now() }
    );

    // TODO => emit call_missed to receiver of call
    io.to(to_user?.socket_id).emit("audio_call_missed", {
      from,
      to,
    });
  });

  // handle audio_call_accepted
  socket.on("audio_call_accepted", async (data) => {
    const { to, from } = data;

    const from_user = await User.findById(from);

    // find and update call record
    await AudioCall.findOneAndUpdate(
      {
        participants: { $size: 2, $all: [to, from] },
      },
      { verdict: "Accepted" }
    );

    // TODO => emit call_accepted to sender of call
    io.to(from_user?.socket_id).emit("audio_call_accepted", {
      from,
      to,
    });
  });

  // handle audio_call_denied
  socket.on("audio_call_denied", async (data) => {
    // find and update call record
    const { to, from } = data;

    await AudioCall.findOneAndUpdate(
      {
        participants: { $size: 2, $all: [to, from] },
      },
      { verdict: "Denied", status: "Ended", endedAt: Date.now() }
    );

    const from_user = await User.findById(from);
    // TODO => emit call_denied to sender of call

    io.to(from_user?.socket_id).emit("audio_call_denied", {
      from,
      to,
    });
  });

  // handle user_is_busy_audio_call
  socket.on("user_is_busy_audio_call", async (data) => {
    const { to, from } = data;
    // find and update call record
    await AudioCall.findOneAndUpdate(
      {
        participants: { $size: 2, $all: [to, from] },
      },
      { verdict: "Busy", status: "Ended", endedAt: Date.now() }
    );

    const from_user = await User.findById(from);
    // TODO => emit on_another_audio_call to sender of call
    io.to(from_user?.socket_id).emit("on_another_audio_call", {
      from,
      to,
    });
  });


  //typing
  socket.on('typing' , (room) => socket.in(room).emit("typing"));
  socket.on('stop typing' , (room) => socket.in(room).emit("stop typing"));

  // handle file input
  socket.on("file-upload", (data) => {
    const buffer = Buffer.from(data.data, 'base64');
    // Save the file using fs or a database (implement logic here)
    console.log(`Received file: ${data.name}`);
    
  });

  
});
