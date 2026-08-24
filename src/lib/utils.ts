import type {
  UserProfile,
  TourState,
  Route,
  Exhibit,
  Reward,
  TourDuration,
  Profession,
  Hobby,
  QuizResult,
} from "@/types";
import type { Lang } from "@/context/LanguageContext";
import exhibitsRu from "@/data/exhibits.json";
import exhibitsEn from "@/data/exhibits.en.json";
import exhibitsKk from "@/data/exhibits.kk.json";
import exhibitsSr from "@/data/exhibits.sr.json";

const exhibitsByLang: Record<Lang, Exhibit[]> = {
  ru: exhibitsRu as Exhibit[],
  en: exhibitsEn as Exhibit[],
  kk: exhibitsKk as Exhibit[],
  sr: exhibitsSr as Exhibit[],
};

export function getLocalizedExhibits(lang: Lang): Exhibit[] {
  return exhibitsByLang[lang] || exhibitsByLang.ru;
}

export function getLocalizedExhibit(id: number, lang: Lang): Exhibit | undefined {
  return getLocalizedExhibits(lang).find((e) => e.id === id);
}

/** Текст экспоната: fullDescription */
export function getExhibitText(
  exhibit: Exhibit,
  _profile: UserProfile,
  lang: Lang = "ru"
): string {
  const localized = getLocalizedExhibit(exhibit.id, lang) || exhibit;
  return localized.fullDescription;
}

/** Секунды на экспонат из ответа об времени экскурсии */
export function getExhibitDurationSec(tourTime: TourDuration | ""): number {
  switch (tourTime) {
    case "30":
      return 30;
    case "60":
      return 60;
    case "90":
      return 90;
    default:
      return 60;
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function calcQuizScore(
  answers: Record<string, string>,
  questions: { id: string; options: { id: string; correct: boolean }[] }[]
): number {
  if (!questions.length) return 0;
  let correct = 0;
  questions.forEach((q) => {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (opt?.correct) correct++;
  });
  return Math.round((correct / questions.length) * 100);
}

export function calcQuizRewards(score: number): string[] {
  if (score < 50) return [];
  const rewards: string[] = ["sticker"];
  if (score >= 80) rewards.unshift("badge-expert");
  else rewards.unshift("avatar");
  return rewards;
}

const QUIZ_RESULT_PREFIX = "quizResult:";

export function loadQuizResult(routeId: string): QuizResult | null {
  try {
    const raw = sessionStorage.getItem(QUIZ_RESULT_PREFIX + routeId);
    if (!raw) return null;
    return JSON.parse(raw) as QuizResult;
  } catch {
    return null;
  }
}

export function saveQuizResult(routeId: string, result: QuizResult): void {
  sessionStorage.setItem(QUIZ_RESULT_PREFIX + routeId, JSON.stringify(result));
}

export function clearQuizResult(routeId: string): void {
  sessionStorage.removeItem(QUIZ_RESULT_PREFIX + routeId);
}

export function clearAllQuizResults(): void {
  const keys: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith(QUIZ_RESULT_PREFIX)) keys.push(key);
  }
  keys.forEach((k) => sessionStorage.removeItem(k));
}

export function isProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.name.trim() &&
    profile.age &&
    profile.techLevel &&
    profile.profession &&
    profile.hobbies.length > 0 &&
    profile.tourTime &&
    profile.style
  );
}

export type { Route, Exhibit, Reward, TourState, UserProfile, QuizResult };
