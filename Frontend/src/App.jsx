import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle, Rect } from "react-konva";
import { socket } from "./socket";

export default function App() {
  const stageRef = useRef(null);

  const [tool, setTool] = useState("circle");
  const [shapes, setShapes] = useState([]);
  const [current, setCurrent] = useState(null);
  const [drawing, setDrawing] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [pair, setPair] = useState(null);           // { user1, user2 }
  const [incomingRequest, setIncomingRequest] = useState(null); // socket_id request

  // localStorage
  useEffect(() => {
    const saved = localStorage.getItem("canvas_shapes");
    if (saved) {
      try {
        setShapes(JSON.parse(saved));
      } catch (e) {
        console.log("localStorage parse error", e);
      }
    }
  }, []);

  // Onshapes change store in localStorage
  useEffect(() => {
    localStorage.setItem("canvas_shapes", JSON.stringify(shapes));
  }, [shapes]);

  useEffect(() => {
    socket.on("online_users", ({ onlineUsers, pair }) => {
      setOnlineUsers(onlineUsers);
      setPair(pair);
    });

    socket.on("incoming_request", (fromId) => {
      setIncomingRequest(fromId);
    });

    socket.on("request_accepted", (partnerId) => {
      setPair({ user1: socket.id, user2: partnerId });
      setIncomingRequest(null);
    });

    socket.on("pair_disconnected", () => {
      setPair(null); 
    });

    socket.on("cur_stages", (data) => {
      setShapes(data);
    });

    return () => {
      socket.off("online_users");
      socket.off("incoming_request");
      socket.off("request_accepted");
      socket.off("pair_disconnected");
      socket.off("cur_stages");
    };
  }, []);

  const isConnected = pair && (pair.user1 === socket.id || pair.user2 === socket.id);

  function sendRequest(targetId) {
    socket.emit("send_request", targetId);
  }

  function acceptRequest(fromId) {
    socket.emit("accept_request", fromId);
  }

  function disconnectPair() {
    socket.emit("disconnect_pair");
    setPair(null);
    
  }

  function getMouse() {
    return stageRef.current.getPointerPosition();
  }

  function handleMouseDown() {
    if (tool === "select") return; //self drawing allow anytime

    const pos = getMouse();
    setDrawing(true);

    if (tool === "circle") {
      setCurrent({ type: "circle", x: pos.x, y: pos.y, radius: 0 });
    } else {
      setCurrent({ type: "rect", x: pos.x, y: pos.y, width: 0, height: 0 });
    }
  }

  function handleMouseMove() {
    if (!drawing || !current) return;
    const pos = getMouse();

    if (current.type === "circle") {
      const dx = pos.x - current.x;
      const dy = pos.y - current.y;
      setCurrent({ ...current, radius: Math.sqrt(dx * dx + dy * dy) });
    } else {
      setCurrent({ ...current, width: pos.x - current.x, height: pos.y - current.y });
    }
  }

  function handleMouseUp() {
    if (!drawing || !current) return;

    const updatedShapes = [...shapes, current];
    setShapes(updatedShapes);

    // if paired send to partner, else local
    socket.emit("canvas_stages", updatedShapes);

    setCurrent(null);
    setDrawing(false);
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: 220, padding: 10, borderRight: "1px solid #444" }}>
        <h4>Online users</h4>

        {onlineUsers
          .filter((id) => id !== socket.id) // self id hide
          .map((id) => (
            <div
              key={id}
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
            >
              <span>{id}</span>

              {incomingRequest === id ? (
                <button onClick={() => acceptRequest(id)}>Accept</button>
              ) : pair ? null : (
                <button onClick={() => sendRequest(id)}>request</button>
              )}
            </div>
          ))}

        {isConnected && <button onClick={disconnectPair}>Disconnect</button>}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 10, padding: 10 }}>
          <button onClick={() => setTool("circle")}>Circle</button>
          <button onClick={() => setTool("rect")}>Rectangle</button>
          <button onClick={() => setTool("select")}>Select</button>
        </div>

        <Stage
          ref={stageRef}
          width={window.innerWidth - 220}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ background: "#ddd" }}
        >
          <Layer>
            {shapes.map((shape, i) =>
              shape.type === "circle" ? (
                <Circle key={i} {...shape} fill="green" stroke="black" draggable={tool === "select"} />
              ) : (
                <Rect key={i} {...shape} stroke="blue" draggable={tool === "select"} />
              )
            )}

            {current &&
              (current.type === "circle" ? (
                <Circle {...current} stroke="red" />
              ) : (
                <Rect {...current} stroke="red" />
              ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}