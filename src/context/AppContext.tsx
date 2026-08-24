"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { UserProfile, TourState } from "@/types";
import routesData from "@/data/routes.json";
import exhibitsData from "@/data/exhibits.json";
import rewardsData from "@/data/rewards.json";
import {
  loadWithTTL,
  saveWithTTL,
  removeStorage,
  QUIZ_STORAGE_TTL_MS,
} from "@/lib/storage";
import type { Route, Exhibit, Reward } from "@/types";

const STORAGE_KEY = "navigator-v2-profile";
const TOUR_KEY = "navigator-v2-tour";

const defaultProfile: UserProfile = {
  name: "",
  age: "",
  techLevel: "",
  profession: "",
  hobbies: [],
  tourTime: "",
  style: "informal",
  theme: "",
};

interface AppContextValue {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  toggleHobby: (hobby: UserProfile["hobbies"][number]) => void;
  isProfileComplete: boolean;
  routes: Route[];
  exhibits: Exhibit[];
  rewards: Reward[];
  tour: TourState | null;
  startTour: (routeId: string) => void;
  nextExhibit: () => void;
  prevExhibit: () => void;
  setTimerDone: (done: boolean) => void;
  resetTour: () => void;
  resetAll: () => void;
  getRouteExhibits: (routeId: string) => Exhibit[];
  finishTour: () => void;
  showAiToast: boolean;
  setShowAiToast: (v: boolean) => void;
  pendingRouteId: string | null;
  setPendingRouteId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [tour, setTour] = useState<TourState | null>(null);
  const [showAiToast, setShowAiToast] = useState(false);
  const [pendingRouteId, setPendingRouteId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const routes = routesData as Route[];
  const exhibits = exhibitsData as Exhibit[];
  const rewards = rewardsData.rewards as Reward[];

  /** Загрузка профиля с TTL 2 минуты */
  useEffect(() => {
    const savedProfile = loadWithTTL<UserProfile>(STORAGE_KEY, defaultProfile);
    setProfile(savedProfile);
    try {
      const savedTour = localStorage.getItem(TOUR_KEY);
      if (savedTour) setTour(JSON.parse(savedTour));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  /** Сброс ответов опроса, если прошло больше 2 минут с последнего сохранения */
  useEffect(() => {
    if (!hydrated) return;
    const tick = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as { savedAt?: number };
        if (parsed.savedAt && Date.now() - parsed.savedAt > QUIZ_STORAGE_TTL_MS) {
          setProfile(defaultProfile);
          removeStorage(STORAGE_KEY);
        }
      } catch {
        removeStorage(STORAGE_KEY);
      }
    };
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [hydrated]);

  /** Сохранение профиля — каждое изменение обновляет таймер */
  useEffect(() => {
    if (!hydrated) return;
    const isEmpty =
      !profile.name &&
      !profile.age &&
      !profile.techLevel &&
      !profile.profession &&
      profile.hobbies.length === 0 &&
      !profile.tourTime &&
      profile.style === "informal" &&
      !profile.theme;
    if (isEmpty) {
      removeStorage(STORAGE_KEY);
    } else {
      saveWithTTL(STORAGE_KEY, profile);
    }
  }, [profile, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (tour) localStorage.setItem(TOUR_KEY, JSON.stringify(tour));
    else localStorage.removeItem(TOUR_KEY);
  }, [tour, hydrated]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleHobby = useCallback((hobby: UserProfile["hobbies"][number]) => {
    setProfile((prev) => {
      const has = prev.hobbies.includes(hobby);
      return {
        ...prev,
        hobbies: has
          ? prev.hobbies.filter((h) => h !== hobby)
          : [...prev.hobbies, hobby],
      };
    });
  }, []);

  const isProfileComplete = !!(
    profile.name.trim() &&
    profile.age &&
    profile.techLevel &&
    profile.profession &&
    profile.hobbies.length > 0 &&
    profile.tourTime &&
    profile.style
  );

  const getRouteExhibits = useCallback(
    (routeId: string) => {
      const route = routes.find((r) => r.id === routeId);
      if (!route) return [];
      return route.exhibits
        .map((id) => exhibits.find((e) => e.id === id))
        .filter(Boolean) as Exhibit[];
    },
    [routes, exhibits]
  );

  const startTour = useCallback((routeId: string) => {
    setTour({ routeId, exhibitIndex: 0, timerDone: false, visitedExhibits: 1 });
  }, []);

  const nextExhibit = useCallback(() => {
    setTour((prev) =>
      prev
        ? {
            ...prev,
            exhibitIndex: prev.exhibitIndex + 1,
            timerDone: false,
            visitedExhibits: Math.max(prev.visitedExhibits, prev.exhibitIndex + 2),
          }
        : prev
    );
  }, []);

  const prevExhibit = useCallback(() => {
    setTour((prev) =>
      prev && prev.exhibitIndex > 0
        ? { ...prev, exhibitIndex: prev.exhibitIndex - 1, timerDone: false }
        : prev
    );
  }, []);

  const setTimerDone = useCallback((done: boolean) => {
    setTour((prev) => (prev ? { ...prev, timerDone: done } : prev));
  }, []);

  const resetTour = useCallback(() => setTour(null), []);

  const finishTour = useCallback(() => {
    setTour(null);
    localStorage.removeItem(TOUR_KEY);
  }, []);

  const resetAll = useCallback(() => {
    setProfile(defaultProfile);
    setTour(null);
    removeStorage(STORAGE_KEY);
    localStorage.removeItem(TOUR_KEY);
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        toggleHobby,
        isProfileComplete,
        routes,
        exhibits,
        rewards,
        tour,
        startTour,
        nextExhibit,
        prevExhibit,
        setTimerDone,
        resetTour,
        resetAll,
        getRouteExhibits,
        finishTour,
        showAiToast,
        setShowAiToast,
        pendingRouteId,
        setPendingRouteId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
