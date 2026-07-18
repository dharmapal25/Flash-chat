import React, { useEffect, useState } from 'react'
import { socket } from '../../socket';

function ConnectedUser() {

    const [conncted, setconncted] = useState([]);
    const [data, setData] = useState("");

    useEffect(() => {
        socket.on("connected", (msg) => {
            console.log("msg : ", msg);
            setconncted(prevItems => [...prevItems, msg])
            console.log(conncted)
        });
        socket.on("private", (msg) => {
            console.log("data",msg);
            setData(msg.message)
        });

    }, [])

    return (
        <div>
            <h1> {data}, Connected users </h1>
            {
                conncted.map((userId, idx) => {
                    return (
                        <div className="user__connect" key={idx} >
                            <span> userID :  {userId}</span><br />
                            <button onClick={() => socket.emit("private", { userId, message: "hello" })} >connect</button>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ConnectedUser