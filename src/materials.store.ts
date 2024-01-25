import { signal, effect } from "@preact/signals-react";

export type Material = {
  id: string;
  name: string;
  color: string;
};

const MATERIAL_DEFAULT = {
  name: "New Material",
  color: "red",
};

const MATERIALS_DEFAULT = {
  0: {
    id: "0",
    name: "Material 0",
    color: "red",
  },
  1: {
    id: "1",
    name: "Material 1",
    color: "green",
  },
  2: {
    id: "2",
    name: "Material 2",
    color: "blue",
  },
};

const MATERIALS_LOCAL_STORAGE_KEY = "materials";

const startingMaterials = (() => {
  const storedMaterials = localStorage.getItem(MATERIALS_LOCAL_STORAGE_KEY);
  if (storedMaterials) {
    return JSON.parse(storedMaterials) as Record<string, Material>;
  }
  return MATERIALS_DEFAULT;
})();

let lastId = Math.max(...Object.keys(startingMaterials).map(Number));
export const materials = signal(startingMaterials);

effect(() => {
  localStorage.setItem(
    MATERIALS_LOCAL_STORAGE_KEY,
    JSON.stringify(materials.value)
  );
});

export const createMaterial = (material: Partial<Material> = {}) => {
  ++lastId;
  const newMaterial = { ...MATERIAL_DEFAULT, ...material, id: String(lastId) };
  materials.value = { [lastId]: newMaterial, ...materials.value };
  return lastId;
};

export const deleteMaterial = (id: string) => {
  materials.value = Object.fromEntries(
    Object.entries(materials.value).filter(([key]) => key !== id)
  );
  return lastId;
};
