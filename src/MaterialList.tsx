import { Material } from "./material.store";

function MaterialPreview({ material }: { material: Material }) {
  const { name, color } = material;
  return (
    <div
      className="aspect-square rounded-md"
      style={{ backgroundColor: color }}
    >
      <div>{name}</div>
      <div>{color}</div>
    </div>
  );
}

export function MaterialList() {
  const materials = {
    0: {
      name: "Material 0",
      color: "red",
    },
    1: {
      name: "Material 1",
      color: "green",
    },
    2: {
      name: "Material 2",
      color: "blue",
    },
    3: {
      name: "Material 2",
      color: "blue",
    },
    4: {
      name: "Material 2",
      color: "blue",
    },
  };

  return (
    <div className="p-4 @container">
      <div className="grid @[12rem]:grid-cols-2 @md:grid-cols-3 gap-4">
        {Object.entries(materials).map(([id, material]) => (
          <MaterialPreview key={id} material={material} />
        ))}
      </div>
    </div>
  );
}
