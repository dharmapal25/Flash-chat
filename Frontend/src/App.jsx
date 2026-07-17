import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle, Rect } from "react-konva";
import { socket } from "./socket";
import ConnectedUser from "./Components/socket/ConnectedUser";

export default function App() {

  const stageRef = useRef(null);

  const [tool, setTool] = useState("circle");
  const [shapes, setShapes] = useState([]);

  const [current, setCurrent] = useState(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {

    // socket.on("connected", (msg) => {
    //   console.log("msg : ",msg);
    // });

    socket.on("cur_stages", (data) => {
      console.log("Received", data);
      setShapes(data);
    });

    return () => {
      // socket.off("connected");
      socket.off("cur_stages");
    };

  }, []);

  function getMouse() {
    return stageRef.current.getPointerPosition();
  }

  function handleMouseDown() {

    if (tool === "select") return;

    const pos = getMouse();
    setDrawing(true);

    if (tool === "circle") {

      setCurrent({
        type: "circle",
        x: pos.x,
        y: pos.y,
        radius: 0,
      });

    } else {
      setCurrent({
        type: "rect",
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      });
    }
  }

  function handleMouseMove() {

    if (!drawing || !current) return;

    const pos = getMouse();

    if (current.type === "circle") {

      const dx = pos.x - current.x;
      const dy = pos.y - current.y;

      setCurrent({
        ...current,
        radius: Math.sqrt(dx * dx + dy * dy),
      });

    } else {
      setCurrent({
        ...current,
        width: pos.x - current.x,
        height: pos.y - current.y,
      });
    }
  }

  function handleMouseUp() {

    if (!drawing || !current) return;

    const updatedShapes = [...shapes, current];
    setShapes(updatedShapes);

    socket.emit("canvas_stages", updatedShapes);

    setCurrent(null);
    setDrawing(false);

  }

  return (
    <>
      <div style={{ display: "flex", gap: 10, padding: 10 }}>

        <button onClick={() => setTool("circle")}>
          Circle
        </button>

        <button onClick={() => setTool("rect")}>
          Rectangle
        </button>

        <button onClick={() => setTool("select")}>
          Select
        </button>

      </div>

      <ConnectedUser/>

      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ background: "#ddd" }}
      >

        <Layer>

          {shapes.map((shape, i) =>
            shape.type === "circle" ?
              <Circle
                key={i}
                {...shape}
                fill="green"
                stroke="black"
                draggable={tool === "select"}
              />
              :
              <Rect
                key={i}
                {...shape}
                stroke="blue"
                draggable={tool === "select"}
              />

          )}

          {current && (
            current.type === "circle"
              ?
              <Circle
                {...current}
                stroke="red"
              />
              :
              <Rect
                {...current}
                stroke="red"
              />

          )}

        </Layer>

      </Stage>

    </>
  );

}