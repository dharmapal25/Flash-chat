import { useState, useRef } from "react";
import { Stage, Layer, Circle } from "react-konva";

export default function App() {
  const stageRef = useRef();

  const [tool, setTool] = useState("circle");
  const [circles, setCircles] = useState([]);
  const [current, setCurrent] = useState(null);

  const [drawing, setDrawing] = useState(false);

  function getMouse() {
    return stageRef.current.getPointerPosition();
  }

  function handleMouseDown() {
    if (tool !== "circle") return;

    const pos = getMouse();

    setDrawing(true);

    setCurrent({
      x: pos.x,
      y: pos.y,
      radius: 0,
    });
  }

  function handleMouseMove() {
    if (!drawing) return;

    const pos = getMouse();

    const dx = pos.x - current.x;
    const dy = pos.y - current.y;

    const radius = Math.sqrt(dx * dx + dy * dy);

    setCurrent({
      ...current,
      radius,
    });
  }

  function handleMouseUp() {
    if (!drawing) return;

    setCircles([...circles, current]);

    setCurrent(null);

    setDrawing(false);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: 10,
        }}
      >
        <button onClick={() => setTool("circle")}>
          Circle
        </button>

        <button onClick={() => setTool("select")}>
          Select
        </button>
      </div>

      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          background: "#f5f5f5",
        }}
      >
        <Layer>
          {circles.map((circle, index) => (
            <Circle
              key={index}
              {...circle}
              stroke="black"
              draggable={tool === "select"}
            />
          ))}

          {current && (
            <Circle
              {...current}
              stroke="red"
            />
          )}
        </Layer>
      </Stage>
    </>
  );
}