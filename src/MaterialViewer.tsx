import { Canvas } from "@react-three/fiber";
import { materials } from "./materials.store.js";

const MESH_SPACING = 1.5;

function MaterialMesh({
  materialId,
  x,
  y,
}: {
  materialId: string;
  x: number;
  y: number;
}) {
  const material = materials.value[materialId];
  return (
    <mesh position={[x, y, 0]}>
      <sphereGeometry />
      <meshStandardMaterial color={material.color} />
    </mesh>
  );
}

export function MaterialViewer() {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight position={[1, 1, 1]} />
      {Object.keys(materials.value)
        .reverse()
        .map((id, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          return (
            <MaterialMesh
              key={id}
              materialId={id}
              x={col * MESH_SPACING}
              y={row * MESH_SPACING}
            />
          );
        })}
    </Canvas>
  );
}
