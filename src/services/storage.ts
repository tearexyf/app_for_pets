import type { Pet } from "../types/Pet";
import type { Task } from "../types/Task";
import type { AppSettings } from "../types/Settings";
import type { GalleryPhoto } from "../types/GalleryPhoto";
import { DEFAULT_SETTINGS } from "../types/Settings";
import { scheduleTaskNotificationsSync } from "./notifications";

const PETS_KEY = "pets";
const TASKS_KEY = "tasks";
const SELECTED_PET_KEY = "selectedPetId";
const SETTINGS_KEY = "settings";
const DIARY_KEY = "diaryEntries";
const GALLERY_KEY = "galleryPhotos";


export const getPets = (): Pet[] => {
  return JSON.parse(localStorage.getItem(PETS_KEY) || "[]");
};

export const getPet = (id?: number): Pet | undefined => {
  const pets = getPets();
  const petId = id ?? getSelectedPetId();
  return pets.find((p) => p.id === petId);
};

export const getSelectedPetId = (): number => {
  return Number(localStorage.getItem(SELECTED_PET_KEY));
};

export const setSelectedPetId = (id: number) => {
  localStorage.setItem(SELECTED_PET_KEY, String(id));
};

export const savePet = (pet: Pet) => {
  const pets = getPets();
  pets.push(pet);
  localStorage.setItem(PETS_KEY, JSON.stringify(pets));
  localStorage.setItem(SELECTED_PET_KEY, String(pet.id));
};

export const updatePet = (id: number, updates: Partial<Pet>) => {
  const pets = getPets();
  const updated = pets.map((p) => (p.id === id ? { ...p, ...updates } : p));
  localStorage.setItem(PETS_KEY, JSON.stringify(updated));
};

export const deletePet = (id: number) => {
  const pets = getPets().filter((p) => p.id !== id);
  localStorage.setItem(PETS_KEY, JSON.stringify(pets));

  const tasks = getTasks().filter((t) => t.petId !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

  const gallery = getGalleryPhotos().filter((p) => p.petId !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));

  if (getSelectedPetId() === id) {
    localStorage.removeItem(SELECTED_PET_KEY);
  }

  scheduleTaskNotificationsSync();
};



export const getTasks = (): Task[] => {
  return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
};

export const getTask = getTasks;

export const getTasksForPet = (petId: number): Task[] => {
  return getTasks().filter((t) => t.petId === petId);
};

export const saveTask = (task: Task) => {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  scheduleTaskNotificationsSync();
};

export const updateTask = (id: number, updates: Partial<Task>) => {
  const tasks = getTasks();
  const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
  localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  scheduleTaskNotificationsSync();
};

export const toggleTaskCompleted = (id: number) => {
  const tasks = getTasks();
  const updated = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  scheduleTaskNotificationsSync();
};

export const deleteTask = (id: number) => {
  const tasks = getTasks().filter((t) => t.id !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  scheduleTaskNotificationsSync();
};



export const getSettings = (): AppSettings => {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    if (parsed.accentColor === "#e9967a") {
      parsed.accentColor = "#8b8794";
      saveSettings(parsed);
    }
    return parsed;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const updateSettings = (updates: Partial<AppSettings>): AppSettings => {
  const next = { ...getSettings(), ...updates };
  saveSettings(next);
  scheduleTaskNotificationsSync();
  return next;
};



export const clearAllData = () => {
  localStorage.removeItem(PETS_KEY);
  localStorage.removeItem(TASKS_KEY);
  localStorage.removeItem(SELECTED_PET_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(DIARY_KEY);
  localStorage.removeItem(GALLERY_KEY);
  scheduleTaskNotificationsSync();
};

export const getGalleryPhotos = (): GalleryPhoto[] => {
  return JSON.parse(localStorage.getItem(GALLERY_KEY) || "[]");
};

export const getGalleryPhotosForPet = (petId: number): GalleryPhoto[] => {
  return getGalleryPhotos().filter((p) => p.petId === petId);
};

export const saveGalleryPhoto = (photo: GalleryPhoto) => {
  const photos = getGalleryPhotos();
  photos.push(photo);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(photos));
};

export const updateGalleryPhoto = (id: number, updates: Partial<GalleryPhoto>) => {
  const photos = getGalleryPhotos().map((p) =>
    p.id === id ? { ...p, ...updates } : p
  );
  localStorage.setItem(GALLERY_KEY, JSON.stringify(photos));
};

export const deleteGalleryPhoto = (id: number) => {
  const photos = getGalleryPhotos().filter((p) => p.id !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(photos));
};

export interface DiaryEntry {
  id:number;
  title:string;
  text:string;
  image?:string;
  createdAt:string;
}
export const getDiaryEntries=():DiaryEntry[]=>JSON.parse(localStorage.getItem(DIARY_KEY)||'[]');
export const saveDiaryEntry=(entry:DiaryEntry)=>localStorage.setItem(DIARY_KEY,JSON.stringify([entry,...getDiaryEntries()]));
export const updateDiaryEntry=(id:number,updates:Partial<DiaryEntry>)=>localStorage.setItem(DIARY_KEY,JSON.stringify(getDiaryEntries().map(e=>e.id===id?{...e,...updates}:e)));
export const deleteDiaryEntry=(id:number)=>localStorage.setItem(DIARY_KEY,JSON.stringify(getDiaryEntries().filter(e=>e.id!==id)));
