import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Circle } from "react-konva";

const STORAGE_KEY = "konva-circles";

export default function App() {
  const stageRef = useRef();

  const [tool, setTool] = useState("circle");
  const [circles, setCircles] = useState([]);
  const [current, setCurrent] = useState(null);
  const [drawing, setDrawing] = useState(false);

  // Load circles from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setCircles(JSON.parse(saved));
    }
  }, []);

  // Save circles whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(circles));
  }, [circles]);

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
    if (!drawing || !current) return;

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
    if (!drawing || !current) return;

    setCircles((prev) => [...prev, current]);

    setCurrent(null);
    setDrawing(false);
  }

  // Update localStorage after dragging
  function handleDragEnd(index, e) {
    const updated = [...circles];

    updated[index] = {
      ...updated[index],
      x: e.target.x(),
      y: e.target.y(),
    };

    setCircles(updated);
  }

  // Clear all circles
  function clearCanvas() {
    setCircles([]);
    localStorage.removeItem(STORAGE_KEY);
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

        <button onClick={clearCanvas}>
          Clear
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
          background: "#bbbbbb",
        }}
      >
        <Layer>
          {circles.map((circle, index) => (
            <Circle
              key={index}
              {...circle}
              stroke="black"
              draggable={tool === "select"}
              onDragEnd={(e) => handleDragEnd(index, e)}
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