import cn from "classnames";
import { useSignalEffect } from "@preact/signals-react";
import {
  materials,
  createMaterial,
  deleteMaterial,
  selectedMaterial,
  thumbnails,
  thumbnailsTrigger,
} from "./materials.store.js";
import { useState } from "react";

function MaterialPreview({ materialId }: { materialId: string }) {
  const { id } = materials.value[materialId];
  const [image, setImage] = useState("");
  useSignalEffect(() => {
    thumbnailsTrigger.value;
    setImage(thumbnails.value[materialId]);
  });
  const handleSelect = () => {
    selectedMaterial.value = id;
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMaterial(id);
  };
  const selected = selectedMaterial.value === id;
  return (
    <div className="relative flex">
      <button
        className={cn("flex-1", { "bg-gray-300 drop-shadow-lg": selected })}
        onClick={handleSelect}
      >
        <div className="relative aspect-square rounded-md"></div>
        {image && (
          <img
            className="absolute inset-0 w-full h-full object-cover p-4"
            src={image}
          />
        )}
      </button>

      <button
        className="absolute -top-1 -right-1 text-xs -mr-1 px-2 py-1 text-black bg-gray-200 rounded-full"
        onClick={(e) => handleDelete(e)}
      >
        X
      </button>
    </div>
  );
}

export function MaterialList() {
  return (
    <>
      <div className="p-4 @container">
        <div className="grid @[18rem]:grid-cols-2 @[32rem]:grid-cols-3 gap-4">
          <button onClick={() => createMaterial()} className="p-0">
            <div className="aspect-square rounded-md  select-none bg-gray-200 flex items-center justify-center">
              Create Material
            </div>
          </button>
          {Object.keys(materials.value)
            .reverse()
            .map((id) => (
              <MaterialPreview key={id} materialId={id} />
            ))}
        </div>
      </div>
    </>
  );
}
