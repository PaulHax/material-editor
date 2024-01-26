import { useRef } from "react";
import { useSignal, useComputed, useSignalEffect } from "@preact/signals-react";
import type { Mesh } from "three";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { selectedMaterial, materials } from "./materials.store.js";

const MESH_SPACING = 2.5;

function MaterialMesh({
  materialId,
  x,
  y,
  fitCamera,
}: {
  materialId: string;
  x: number;
  y: number;
  fitCamera: (mesh: Mesh) => void;
}) {
  const material = materials.value[materialId];
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

  const hover = useSignal(false);
  const scale = useComputed(() => {
    if (hover.value) return 1.1;
    return 1;
  });
  const s = scale.value;

  return (
    <mesh
      ref={mesh}
      position={[x, y, 0]}
      scale={[s, s, s]}
      onClick={handleClick}
      onPointerOver={() => (hover.value = true)}
      onPointerOut={() => (hover.value = false)}
    >
      <sphereGeometry />
      <meshStandardMaterial color={material.color} />
    </mesh>
  );
}

export function MaterialViewer() {
  const controls = useRef<CameraControls>(null);
  const fitCamera = (mesh: Mesh) => {
    if (controls.current) controls.current?.fitToBox(mesh, true);
  };

  return (
    <Canvas camera={{ fov: 10 }}>
      <CameraControls ref={controls} makeDefault />
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
              fitCamera={fitCamera}
            />
          );
        })}
    </Canvas>
  );
}
