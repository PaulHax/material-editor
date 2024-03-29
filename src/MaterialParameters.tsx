import {
  selectedMaterial,
  materials,
  updateMaterial,
} from "./materials.store.js";
import { useComputed } from "@preact/signals-react";
import { ChromePicker } from "react-color";

export function MaterialParameters() {
  const material = useComputed(() => materials.value[selectedMaterial.value]);

  return (
    <div className="absolute top-0 right-0 bg-gray-200 rounded-bl-lg drop-shadow-lg">
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <label className="flex gap-2 items-center">
            <span>Roughness</span>
            <input
              type="range"
              className="w-18 h-4"
              value={(material.value?.roughness ?? 0.5) * 100}
              onChange={(event) => {
                updateMaterial(selectedMaterial.value, {
                  roughness: Number(event.target.value) / 100,
                });
              }}
            />
          </label>
          <label className="flex gap-2 items-center">
            <span>Metalness</span>
            <input
              type="range"
              className="w-18 h-4"
              value={(material.value?.metalness ?? 0.5) * 100}
              onChange={(event) => {
                updateMaterial(selectedMaterial.value, {
                  metalness: Number(event.target.value) / 100,
                });
              }}
            />
          </label>
          <ChromePicker
            color={material.value?.color ?? "#ffffff"}
            onChange={(color: { hex: string }) => {
              updateMaterial(selectedMaterial.value, {
                color: color.hex,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
