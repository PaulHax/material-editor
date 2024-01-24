import React from "react";
import "./App.css";

const SIDE_BAR_START_WIDTH = 200; // in pixels

function App() {
  const [width, setWidth] = React.useState(SIDE_BAR_START_WIDTH);

  const handlePointerDown = (e: React.PointerEvent) => {
    const start = e.clientX;
    const startWidth = width;
    document.body.style.cursor = "ew-resize";

    const handleMove = (e: PointerEvent) => {
      const delta = e.clientX - start;
      setWidth(startWidth + delta);
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.removeProperty("cursor");
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="flex w-full h-full">
      <div className="relative bg-slate-50">
        <div
          className="bg-slate-50 overflow-hidden dark:bg-slate-800/25"
          style={{ width: `${width}px` }}
        >
          Materials
        </div>

        <div
          className="pointer-events-auto absolute top-1/2 -right-10 w-8 cursor-ew-resize"
          draggable="false"
          style={{
            userSelect: "none",
            touchAction: "pan-y",
          }}
          onPointerDown={handlePointerDown}
        >
          <div className="w-1.5 h-8 bg-slate-500/60 border-4 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 flex place-content-center">
        <div>Material</div>
      </div>
    </div>
  );
}

export default App;
