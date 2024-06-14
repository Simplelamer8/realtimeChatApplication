import {Server} from "socket.io";

const io = new Server(9000, {
    cors: {
        origin: "*"
    }
});

let activeUsers:{userId: number, socketId: string}[] = [];

io.on("connection", (socket) => {
    socket.on("new-user-add", (newUserId) => {
        if (!activeUsers.some((user) => user.userId === newUserId))
        {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            });
        }
        console.log("Connected users", activeUsers);
        io.emit('get-users', activeUsers);
    })

    socket.on("join-chat", (data) => {
        const user = activeUsers.find((user) => user.userId === data.receiverId);
        console.log("Send message : ", user);
        if (user)
        {
            io.emit("receive-message", data);
        }
    })

    socket.on("send-message", (data) => {
        const user = activeUsers.find((user) => user.userId === data.receiverId);
        console.log("Send message : ", user);
        if (user)
        {
            io.emit("receive-message", data);
        }
    })

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User disconnected", activeUsers);
        io.emit("get-users", activeUsers);
    })
})