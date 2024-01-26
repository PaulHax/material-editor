import {
  materials,
  createMaterial,
  deleteMaterial,
  selectedMaterial,
} from "./materials.store.js";
import cn from "classnames";

function MaterialPreview({ materialId }: { materialId: string }) {
  const { color, id } = materials.value[materialId];
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
        <div
          className="relative aspect-square rounded-md"
          style={{ backgroundColor: color }}
        ></div>
      </button>

      <button
        className="absolute top-0 right-4 text-xs -mr-1 px-2 py-1 text-black bg-gray-200 rounded-full"
        onClick={(e) => handleDelete(e)}
      >
        X
      </button>
    </div>
  );
}

export function MaterialList() {
  return (
    <div className="p-4 @container">
      <div className="grid @[14rem]:grid-cols-2 @[28rem]:grid-cols-3 gap-2">
        <button onClick={() => createMaterial()} className="">
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
  );
}
