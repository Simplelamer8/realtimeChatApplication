"use client"
import axios from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UserDataInterface {
    user: {
        email: string;
        _id: string;
    };
}

export default function Chats() {
    let socket = useRef<Socket | null>(null);
    const [userData, setUserData]: [UserDataInterface | null, Dispatch<SetStateAction<UserDataInterface | null>>] = useState<UserDataInterface | null>(null);
    const [chatId, setChatId] = useState();
    const [messages, setMessages] = useState<{chatId: undefined, senderId: string | undefined, text: string, receiverId: string;}[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [receiverEmail, setReceiverEmail] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [chatData, setChatData] = useState<{members:[]} | null>(null);
    const [receiverStatus, setReceiverStatus] = useState(false);
    const [isTypingStatus, setIsTypingStatus] = useState(false);
    const [receiverTyping, setReceiverTyping] = useState(false);
    let timeout:ReturnType<typeof setTimeout>  | null = null;
    


    useEffect(() => {
        const storedData = localStorage.getItem("userData");
        if (storedData) {
            setUserData(JSON.parse(storedData) as UserDataInterface);
        }

        socket.current = io("http://localhost:9000/");
        // socket.current.emit("join-chat", "conversation_id")
        // socket.current.on("receive-message", (message) => {
        //     debugger;
        //     console.log("meesage", message);
            
        //     if (userData?.user._id === message.receiverId)
        //     {
        //         setMessages([...messages, message])
        //     }
        // })
    }, []); // Empty dependency array ensures this runs only once on mount


    useEffect(() => {
        if (socket.current)
        {
                socket.current.emit("new-user-add", userData?.user._id);
                socket.current.on("get-users", (users) => {
                    if (!users.some((user:{userId: string}) => user.userId === receiverId))
                    {
                        setReceiverStatus(false);
                    }
                    else
                    {
                        setReceiverStatus(true);
                    }
                    setOnlineUsers(users);
                    console.log(onlineUsers);
                })
        }
        
    }, [userData, receiverId])

    useEffect(() => {
        if (socket.current)
        {
            socket.current.on("receive-message", (message) => {
                console.log("meesage", message);
                
                if (userData?.user._id === message.receiverId)
                {
                    setMessages([...messages, message])
                }
            })

            socket.current.on("typing", (senderId) => {
                if (senderId === receiverId)
                {
                    setReceiverTyping(true);
                    setTimeout(() => setReceiverTyping(false), 3000);
                }
            })
        }
    }, [userData, messages])


    useEffect(() => {
        const fetchChatId = async () => {
            if (userData)
            {
                const response = await axios.get(`http://localhost:5000/api/chat/${userData.user._id}`);
                console.log(response);
                setReceiverId(response.data[0].members.filter((userId:string) => userId !== userData.user._id)[0]);

                setChatId(response.data[0]["_id"]);
                setChatData(response.data);
            }
        };

        if (userData) {
            fetchChatId();
        }
    }, [userData]); // This useEffect depends on userData

    useEffect(() => {
        const fetchData = async () => {
            if (receiverId)
            {
                const response = await axios.get(`http://localhost:5000/api/getUser/${receiverId}`);

                setReceiverEmail(response.data.email);
            }
        }
        fetchData();
    }, [receiverId])


    useEffect(() => {
        const fetchData = async () => {
            if (chatId)
            {
                const response = await axios.get(`http://localhost:5000/api/${chatId}`);
                console.log(response);
                setMessages(response.data);
            }
        }

        fetchData();
    }, [chatId])


    async function handleSendMessage(e: React.MouseEvent<HTMLButtonElement>)
    {
        e.preventDefault();
        const message = {chatId, senderId: userData?.user._id, text: inputValue, receiverId};
        const response = await axios.post(`http://localhost:5000/api/message`, message);
        console.log(response.data);
        setMessages([...messages, message]);
        setInputValue("");

        if (socket.current)
        {
            socket.current.emit("send-message", message);
            // socket.current.on("receive-message", (message) => {
            //     if (userData?.user._id !== message.senderId)
            //     {
            //         setMessages([...messages, message])
            //     }
            // })
        }
    }


    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        e.preventDefault();
        setInputValue((e.target as HTMLInputElement).value);
        if (isTypingStatus === false)
        {
            setIsTypingStatus(true);
            if (socket.current && userData)
            {
                socket.current.emit("typing", {senderId: userData.user._id, receiverId});
            }
        }
        else 
        {
            if (timeout)
            {
                clearTimeout(timeout);
            }
            if (socket.current && userData)
            {
                socket.current?.emit("typing", {senderId: userData.user._id, receiverId})
                timeout = setTimeout(() => {
                    setIsTypingStatus(false);
                }, 3000);
            }
        }
    }


    if (!userData) {
        return (
            <h1>Please wait, fetching user data...</h1>
        );
    }

    return (
        <main className='flex flex-col items-center relative min-h-screen justify-end py-20'>
            <div className="receiver absolute top-5">{receiverEmail} {receiverStatus ? "online" : "offline"}{receiverTyping ? "typing..." : ""}</div>
            <div className="messages flex flex-col items-center">
                {
                    messages && messages.map((message, index) => (
                        <p key={index} className='mt-5' >{message.text} <span className="text-xs">{message.senderId === userData.user._id ? "you" : "receiver"}</span></p>
                    ))
                }
            </div>
            <form className='mt-10 p-10 bg-slate-700'>
                <input type="text" value={inputValue} onChange={handleInputChange} />
                <button onClick={handleSendMessage}>
                    Send Message
                </button>
            </form>
        </main>
    );
}
