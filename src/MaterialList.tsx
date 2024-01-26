import {
  materials,
  createMaterial,
  deleteMaterial,
  Material,
} from "./materials.store.js";

function MaterialPreview({ material }: { material: Material }) {
  const { name, color } = material;
  return (
    <div
      className="relative aspect-square rounded-md"
      style={{ backgroundColor: color }}
    >
      <div>{name}</div>
      <div>{color}</div>
      <button
        className="absolute -top-2 -right-1 text-xs -mr-1 px-2 py-1 text-black bg-gray-200 rounded-full"
        onClick={() => deleteMaterial(material.id)}
      >
        X
      </button>
    </div>
  );
}

export function MaterialList() {
  return (
    <div className="p-4 @container">
      <div className="grid @[14rem]:grid-cols-2 @[28rem]:grid-cols-3 gap-4 ">
        <div className="aspect-square rounded-md flex justify-center items-center">
          <button
            className="w-full h-full bg-gray-200 select-none"
            onClick={() => createMaterial()}
          >
            Create Material
          </button>
        </div>
        {Object.entries(materials.value)
          .reverse()
          .map(([id, material]) => (
            <MaterialPreview key={id} material={material} />
          ))}
      </div>
    </div>
  );
}
