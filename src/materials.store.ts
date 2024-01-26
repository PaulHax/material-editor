import { signal, effect } from "@preact/signals-react";

export type Material = {
  id: string;
  roughness: number;
  metalness: number;
  color: string;
};

const MATERIAL_DEFAULT = {
  color: "red",
  roughness: 0.9,
  metalness: 0.5,
};

const MATERIALS_DEFAULT = {
  0: {
    id: "0",
    roughness: 0.5,
    metalness: 0.5,
    color: "red",
  },
  1: {
    id: "1",
    roughness: 0.1,
    metalness: 0.5,
    color: "green",
  },
  2: {
    id: "2",
    roughness: 0.9,
    metalness: 0.5,
    color: "blue",
  },
};

const MATERIALS_STORAGE_KEY = "materials";
const SELECTED_MATERIAL_STORAGE_KEY = "selected-material";

const urlParams = new URLSearchParams(window.location.search);
const startingMaterials = (() => {
  const urlMaterials = urlParams.get(MATERIALS_STORAGE_KEY);
  if (urlMaterials) {
    return JSON.parse(urlMaterials) as Record<string, Material>;
  }

  const storedMaterials = localStorage.getItem(MATERIALS_STORAGE_KEY);
  if (storedMaterials) {
    return JSON.parse(storedMaterials) as Record<string, Material>;
  }

  return MATERIALS_DEFAULT;
})();

let lastId = Math.max(...Object.keys(startingMaterials).map(Number));
export const materials = signal<Record<string, Material>>(startingMaterials);

const startingSelection =
  urlParams.get(SELECTED_MATERIAL_STORAGE_KEY) ??
  localStorage.getItem(SELECTED_MATERIAL_STORAGE_KEY) ??
  Object.keys(materials.value).reverse()?.[0] ??
  "";

export const selectedMaterial = signal<string>(startingSelection);

export const createMaterial = (material: Partial<Material> = {}) => {
  const id = String(++lastId);
  const newMaterial = { ...MATERIAL_DEFAULT, ...material, id };
  materials.value = { [id]: newMaterial, ...materials.value };
  selectedMaterial.value = id;
  return lastId;
};

export const deleteMaterial = (id: string) => {
  materials.value = Object.fromEntries(
    Object.entries(materials.value).filter(([key]) => key !== id)
  );
};

export const updateMaterial = (id: string, material: Partial<Material>) => {
  const existingMaterial = materials.value[id];
  if (!existingMaterial) throw new Error(`Material ${id} does not exist`);
  materials.value[id] = { ...existingMaterial, ...material };
  materials.value = { ...materials.value };
};

// serialize and save state
effect(() => {
  const materialJson = JSON.stringify(materials.value);
  const selectedString = selectedMaterial.value;

  localStorage.setItem(MATERIALS_STORAGE_KEY, materialJson);
  localStorage.setItem(SELECTED_MATERIAL_STORAGE_KEY, selectedString);

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(MATERIALS_STORAGE_KEY, materialJson);
  urlParams.set(SELECTED_MATERIAL_STORAGE_KEY, selectedString);
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState(null, "", newUrl);
});
