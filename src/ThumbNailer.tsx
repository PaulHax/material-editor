import { Canvas, useThree } from "@react-three/fiber";
import { Vector3, MeshStandardMaterial } from "three";
import { useComputed, useSignalEffect } from "@preact/signals-react";
import { MutableRefObject, useRef } from "react";
import { materials, updateThumbnails, thumbnails } from "./materials.store.js";

function MaterialMakeup({
  materialId,
  meshMaterial,
}: {
  materialId: string;
  meshMaterial: MutableRefObject<MeshStandardMaterial>;
}) {
  const roughness = useComputed(() => {
    return materials.value[materialId].roughness;
  });
  const metalness = useComputed(() => {
    return materials.value[materialId].metalness;
  });
  const color = useComputed(() => {
    return materials.value[materialId]?.color;
  });
  const { gl, scene, camera } = useThree();
  useSignalEffect(() => {
    if (!color.value || !meshMaterial.current) return;
    meshMaterial.current.color.set(color.value);
    meshMaterial.current.metalness = metalness.value;
    meshMaterial.current.roughness = roughness.value;
    gl.render(scene, camera);
    const shot = gl.domElement.toDataURL();
    thumbnails.value[String(materialId)] = shot;
    updateThumbnails();
  });

  return <></>;
}

export function ThumbNailer() {
  const meshMaterial = useRef<MeshStandardMaterial>(null);
  return (
    <div className="absolute w-60 aspect-square -left-[300px]">
      <Canvas camera={{ fov: 10, position: new Vector3(0, 0, 14) }}>
        <ambientLight />
        <directionalLight position={[1, 1, 1]} />

        <mesh>
          <sphereGeometry />
          <meshStandardMaterial ref={meshMaterial} />
        </mesh>

        {Object.keys(materials.value)
          .reverse()
          .map((id) => {
            return (
              <MaterialMakeup
                key={id}
                materialId={id}
                meshMaterial={meshMaterial}
              />
            );
          })}
      </Canvas>
    </div>
  );
}
