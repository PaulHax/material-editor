import { useState } from "react";
import cn from "classnames";

function copyAddressToClipboard() {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
}

export function ShareButton() {
  const [open, setOpen] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    copyAddressToClipboard();
  };

  return (
    <>
      <div className="absolute right-16 top-2 w-6 h-6 mt-0.5">
        <button onClick={() => setOpen(!open)}>Share</button>
      </div>
      <div
        className={cn("absolute flex h-screen w-screen bg-gray-700/30", {
          hidden: !open,
        })}
        onClick={() => {
          setOpen(false);
        }}
      >
        <div className="m-auto p-6 bg-white rounded-lg shadow relative">
          <button onClick={handleCopy}>Copy link to clipboard</button>

          <button
            className="absolute -top-2 -right-1 text-xs -mr-1 px-2 py-1 text-black bg-gray-200 rounded-full"
            onClick={() => setOpen(false)}
          >
            X
          </button>
        </div>
      </div>
    </>
  );
}
