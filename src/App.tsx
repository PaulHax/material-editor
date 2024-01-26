import React, { useState } from "react";
import cn from "classnames";
import "./App.css";
import { MaterialList } from "./MaterialList.js";
import { ShareButton } from "./ShareButton.js";

// in pixels
const SIDE_BAR_START_WIDTH = 200;
const SIDE_BAR_MIN_WIDTH = 160;
const COLLAPSE_WIDTH = 56;

function DotGrid() {
  return (
    <div className="w-6 h-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <g>
          <circle cx="6" cy="6" r="1" />
          <circle cx="12" cy="6" r="1" />
          <circle cx="18" cy="6" r="1" />
          <circle cx="6" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="18" cy="12" r="1" />
          <circle cx="6" cy="18" r="1" />
          <circle cx="12" cy="18" r="1" />
          <circle cx="18" cy="18" r="1" />
        </g>
      </svg>
    </div>
  );
}

function CollapseArrow({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="w-6 h-6 mt-0.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn("transform", {
          "rotate-180": collapsed,
          "rotate-90": !collapsed,
        })}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <g>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </g>
      </svg>
    </div>
  );
}

function App() {
  const [dragWidth, setDragWidth] = useState(SIDE_BAR_START_WIDTH);
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const startResize = (e: React.PointerEvent) => {
    const start = e.clientX;
    const startWidth = dragWidth;
    document.body.style.cursor = "ew-resize";
    setDragging(true);

    const handleMove = (e: PointerEvent) => {
      const delta = e.clientX - start;
      const width = startWidth + delta;
      setDragWidth(Math.max(width, SIDE_BAR_MIN_WIDTH));
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.removeProperty("cursor");
      setDragging(false);
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const toggleCollapse = () => {
    setCollapsed((collapsed) => !collapsed);
  };

  const widthPixels = collapsed ? COLLAPSE_WIDTH : dragWidth;
  const width = `${widthPixels}px`;

  return (
    <div className="relative flex w-full h-full">
      <div className="relative bg-slate-50">
        <div
          className={cn("h-full flex flex-col", {
            "transition-width ease-in-out duration-100": !dragging,
          })}
          style={{ width, maxWidth: "calc(100vw - 1.5rem)" }}
        >
          <div
            className={cn("bg-gray-200 px-4 py-2 select-none", {
              "h-full": collapsed,
            })}
            onPointerDown={toggleCollapse}
          >
            <div className="flex flex-wrap">
              <CollapseArrow collapsed={collapsed} />

              {collapsed ? (
                <DotGrid />
              ) : (
                <h1 className="ml-2 text-lg font-semibold">Materials</h1>
              )}
            </div>
          </div>
          <div className={cn("overflow-auto", { hidden: collapsed })}>
            <MaterialList />
          </div>
        </div>

        <div
          className={cn(
            "absolute top-1/2 -right-10 w-8 cursor-ew-resize transition-opacity",
            { "pointer-events-none": collapsed }
          )}
          draggable="false"
          style={{
            userSelect: "none",
            touchAction: "pan-y",
            opacity: collapsed ? 0 : 1,
          }}
          onPointerDown={startResize}
        >
          <div className="w-1.5 h-8 bg-slate-500/60 border-4 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 flex place-content-center">
        <div>Material</div>
      </div>

      <ShareButton />
    </div>
  );
}

export default App;
