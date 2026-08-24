"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { RoverProgress } from "@/components/RoverProgress";
import type {
  AgeRange,
  TechLevel,
  Profession,
  Hobby,
  TourDuration,
  CommunicationStyle,
} from "@/types";

const TOTAL_STEPS = 7;

const Q2_OPTIONS: { id: AgeRange; key: string }[] = [
  { id: "18-25", key: "quiz.q2_opt1" },
  { id: "25-35", key: "quiz.q2_opt2" },
  { id: "35-45", key: "quiz.q2_opt3" },
  { id: "45plus", key: "quiz.q2_opt4" },
];

const Q3_OPTIONS: { id: TechLevel; key: string }[] = [
  { id: "none", key: "quiz.q3_opt1" },
  { id: "medium", key: "quiz.q3_opt2" },
  { id: "advanced", key: "quiz.q3_opt3" },
];

const Q4_OPTIONS: { id: Profession; key: string }[] = [
  { id: "it", key: "quiz.q4_opt1" },
  { id: "design-media", key: "quiz.q4_opt2" },
  { id: "education-science", key: "quiz.q4_opt3" },
  { id: "business", key: "quiz.q4_opt4" },
  { id: "student", key: "quiz.q4_opt5" },
  { id: "other", key: "quiz.q4_opt6" },
];

const Q5_OPTIONS: { id: Hobby; key: string }[] = [
  { id: "videogames", key: "quiz.q5_opt1" },
  { id: "programming-robotics", key: "quiz.q5_opt2" },
  { id: "photography", key: "quiz.q5_opt3" },
  { id: "music", key: "quiz.q5_opt4" },
  { id: "painting", key: "quiz.q5_opt5" },
  { id: "travel", key: "quiz.q5_opt6" },
  { id: "reading-history", key: "quiz.q5_opt7" },
  { id: "none", key: "quiz.q5_opt8" },
];

const Q6_OPTIONS: { id: TourDuration; key: string }[] = [
  { id: "30", key: "quiz.q6_opt1" },
  { id: "60", key: "quiz.q6_opt2" },
  { id: "90", key: "quiz.q6_opt3" },
];

const Q7_OPTIONS: { id: CommunicationStyle; key: string }[] = [
  { id: "formal", key: "quiz.q7_opt1" },
  { id: "informal", key: "quiz.q7_opt2" },
];

const STEP_ICONS = ["\uD83D\uDC64", "\uD83C\uDF82", "\uD83E\uDDE0", "\uD83C\uDFAF", "\uD83C\uDFAE", "\u23F1\uFE0F", "\uD83D\uDDE3\uFE0F"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const optionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.25, ease: "easeOut" },
  }),
};

export default function QuizPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { updateProfile } = useApp();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [age, setAge] = useState<AgeRange | "">("");
  const [techLevel, setTechLevel] = useState<TechLevel | "">("");
  const [profession, setProfession] = useState<Profession | "">("");
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [tourTime, setTourTime] = useState<TourDuration | "">("");
  const [style, setStyle] = useState<CommunicationStyle | "">("");

  const progressPct = ((step + 1) / TOTAL_STEPS) * 100;
  const { display: roverProgress } = useProgress({ target: progressPct, duration: 400 });

  const validateName = (value: string): string => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return "";
    if (trimmed.length < 2) return t("quiz.nameErrorMin");
    if (trimmed.length > 50) return t("quiz.nameErrorMax");
    return "";
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(validateName(value));
  };

  const canNext = (): boolean => {
    switch (step) {
      case 0:
        return name.trim().length >= 2 && name.trim().length <= 50;
      case 1:
        return age !== "";
      case 2:
        return techLevel !== "";
      case 3:
        return profession !== "";
      case 4:
        return hobbies.length > 0;
      case 5:
        return tourTime !== "";
      case 6:
        return style !== "";
      default:
        return false;
    }
  };

  const goStep = (next: number) => {
    if (next < 0 || next >= TOTAL_STEPS || next === step) return;
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNext = () => goStep(step + 1);
  const handleBack = () => goStep(step - 1);

  const handleHobbyToggle = useCallback((hobby: Hobby) => {
    setHobbies((prev) => {
      if (hobby === "none") {
        return prev.includes("none") ? [] : ["none"];
      }
      if (prev.includes(hobby)) {
        return prev.filter((h) => h !== hobby);
      }
      return [...prev.filter((h) => h !== "none"), hobby];
    });
  }, []);

  const handleSubmit = () => {
    updateProfile({
      name: name.trim(),
      age: age as AgeRange,
      techLevel: techLevel as TechLevel,
      profession: profession as Profession,
      hobbies,
      tourTime: tourTime as TourDuration,
      style: style as CommunicationStyle,
    });
    router.push("/routes");
  };

  const questionLabel = (idx: number) => {
    const keys = [
      "quiz.question1",
      "quiz.question2",
      "quiz.question3",
      "quiz.question4",
      "quiz.question5",
      "quiz.question6",
      "quiz.question7",
    ];
    return t(keys[idx]);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl dark:text-dark-text">
          {t("quiz.title")}
        </h1>
        <p className="text-sm text-yandex-gray-400 dark:text-dark-muted">
          {step + 1} / {TOTAL_STEPS}
        </p>
      </div>

      {/* Rover progress bar */}
      <div className="mb-6">
        <RoverProgress progress={roverProgress} />
      </div>

      {/* Question card */}
      <div className="relative overflow-hidden rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card shadow-card dark:shadow-dark-card transition-colors duration-300">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }}
            className="p-6 sm:p-8"
          >
            {/* Question title */}
            <div className="mb-6 flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yandex-red-light dark:bg-red-500/10 text-xl">
                {STEP_ICONS[step]}
              </span>
              <h2 className="text-lg font-bold leading-snug text-yandex-dark dark:text-dark-text sm:text-xl">
                {questionLabel(step)}
              </h2>
            </div>

            {/* Step 0: Name */}
            {step === 0 && (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`quiz-input w-full ${nameError ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                  placeholder={t("quiz.question1")}
                  autoFocus
                  maxLength={50}
                />
                {nameError && (
                  <p className="mt-2 text-xs text-red-600">{nameError}</p>
                )}
                <p className="mt-1 text-xs text-yandex-gray-400">
                  {name.length}/50
                </p>
              </div>
            )}

            {/* Step 1: Age */}
            {step === 1 && (
              <div className="space-y-2.5">
                {Q2_OPTIONS.map((opt, i) => (
                  <motion.label
                    key={opt.id}
                    custom={i}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    className={`quiz-option ${age === opt.id ? "quiz-option-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="age"
                      checked={age === opt.id}
                      onChange={() => setAge(opt.id)}
                      className="quiz-radio"
                    />
                    <span>{t(opt.key)}</span>
                  </motion.label>
                ))}
              </div>
            )}

            {/* Step 2: Tech level */}
            {step === 2 && (
              <div className="space-y-2.5">
                {Q3_OPTIONS.map((opt, i) => (
                  <motion.label
                    key={opt.id}
                    custom={i}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    className={`quiz-option ${techLevel === opt.id ? "quiz-option-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="techLevel"
                      checked={techLevel === opt.id}
                      onChange={() => setTechLevel(opt.id)}
                      className="quiz-radio"
                    />
                    <span>{t(opt.key)}</span>
                  </motion.label>
                ))}
              </div>
            )}

            {/* Step 3: Profession */}
            {step === 3 && (
              <div className="space-y-2.5">
                {Q4_OPTIONS.map((opt, i) => (
                  <motion.label
                    key={opt.id}
                    custom={i}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    className={`quiz-option ${profession === opt.id ? "quiz-option-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="profession"
                      checked={profession === opt.id}
                      onChange={() => setProfession(opt.id)}
                      className="quiz-radio"
                    />
                    <span>{t(opt.key)}</span>
                  </motion.label>
                ))}
              </div>
            )}

            {/* Step 4: Hobbies — checkboxes, multi-select */}
            {step === 4 && (
              <div className="space-y-2.5">
                {Q5_OPTIONS.map((opt, i) => {
                  const isNone = opt.id === "none";
                  const checked = hobbies.includes(opt.id);
                  return (
                    <motion.label
                      key={opt.id}
                      custom={i}
                      variants={optionVariants}
                      initial="hidden"
                      animate="visible"
                      className={`quiz-option ${checked ? "quiz-option-active" : ""} ${
                        isNone && checked ? "!border-yandex-red/40 !bg-yandex-red-light/50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleHobbyToggle(opt.id)}
                        className="quiz-checkbox"
                      />
                      <span>{t(opt.key)}</span>
                    </motion.label>
                  );
                })}
              </div>
            )}

            {/* Step 5: Tour time */}
            {step === 5 && (
              <div className="space-y-2.5">
                {Q6_OPTIONS.map((opt, i) => (
                  <motion.label
                    key={opt.id}
                    custom={i}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    className={`quiz-option ${tourTime === opt.id ? "quiz-option-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="tourTime"
                      checked={tourTime === opt.id}
                      onChange={() => setTourTime(opt.id)}
                      className="quiz-radio"
                    />
                    <span>{t(opt.key)}</span>
                  </motion.label>
                ))}
              </div>
            )}

            {/* Step 6: Communication style */}
            {step === 6 && (
              <div className="space-y-2.5">
                {Q7_OPTIONS.map((opt, i) => (
                  <motion.label
                    key={opt.id}
                    custom={i}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    className={`quiz-option ${style === opt.id ? "quiz-option-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="style"
                      checked={style === opt.id}
                      onChange={() => setStyle(opt.id)}
                      className="quiz-radio"
                    />
                    <span>{t(opt.key)}</span>
                  </motion.label>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-yandex-gray-100 dark:border-dark-border/30 px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="group flex items-center gap-2 rounded-xl border border-yandex-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-5 py-2.5 text-sm font-semibold text-yandex-gray-600 dark:text-dark-muted transition-all hover:border-yandex-gray-300 dark:hover:border-dark-muted hover:bg-yandex-gray-50 dark:hover:bg-dark-card disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("quiz.back")}
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext()}
              className="group flex items-center gap-2 rounded-xl bg-yandex-red px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-yandex-red/20 transition-all hover:bg-yandex-red-hover hover:shadow-md hover:shadow-yandex-red/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {t("quiz.next")}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canNext()}
              className="group flex items-center gap-2 rounded-xl bg-yandex-red px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-yandex-red/20 transition-all hover:bg-yandex-red-hover hover:shadow-md hover:shadow-yandex-red/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {t("quiz.submit")}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
