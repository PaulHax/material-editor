import { useRef } from "react";
import { useComputed, useSignalEffect } from "@preact/signals-react";
import type { Mesh } from "three";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { selectedMaterial, materials } from "./materials.store.js";

const MESH_SPACING = 2.5;

function MaterialMesh({
  materialId,
  x,
  fitCamera,
}: {
  materialId: string;
  x: number;
  fitCamera: (mesh: Mesh) => void;
}) {
  const mesh = useRef<Mesh>(null);

  const handleClick = () => {
    selectedMaterial.value = materialId;
    if (mesh.current) {
      fitCamera(mesh.current);
    }
  };

  const selected = useComputed(() => selectedMaterial.value === materialId);
  useSignalEffect(() => {
    if (selected.value && mesh.current) {
      fitCamera(mesh.current);
    }
  });

  const roughness = useComputed(() => {
    return materials.value[materialId].roughness;
  });
  const metalness = useComputed(() => {
    return materials.value[materialId].metalness;
  });
  const color = useComputed(() => {
    return materials.value[materialId].color;
  });

  return (
    <mesh ref={mesh} position={[x, 0, 0]} onClick={handleClick}>
      <sphereGeometry />
      <meshStandardMaterial
        color={color.value}
        roughness={roughness.value}
        metalness={metalness.value}
      />
    </mesh>
  );
}

export function MaterialViewer() {
  const controls = useRef<CameraControls>(null);
  const fitCamera = (mesh: Mesh) => {
    if (controls.current) controls.current?.fitToSphere(mesh, true);
  };

  return (
    <Canvas camera={{ fov: 10 }}>
      <CameraControls ref={controls} />
      <ambientLight />
      <directionalLight position={[1, 1, 1]} />
      {Object.keys(materials.value)
        .reverse()
        .map((id, index) => {
          return (
            <MaterialMesh
              key={id}
              materialId={id}
              x={index * MESH_SPACING}
              fitCamera={fitCamera}
            />
          );
        })}
    </Canvas>
  );
}
