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

const startingSelection =
  urlParams.get(SELECTED_MATERIAL_STORAGE_KEY) ??
  localStorage.getItem(SELECTED_MATERIAL_STORAGE_KEY) ??
  Object.keys(materials.value).reverse()?.[0] ??
  "";

export const selectedMaterial = signal<string>(startingSelection);

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
