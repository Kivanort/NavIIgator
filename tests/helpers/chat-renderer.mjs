import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

export class MemoryStorage {
  values = new Map();
  reads = 0;

  getItem(key) {
    this.reads++;
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }
}

// Exercise the real component's handlers/effects without adding a DOM dependency.
// State updates commit together; effects finish before the next render, as in React.
export function renderChat({ storage = new MemoryStorage(), name = "QA visitor" } = {}) {
  const slots = [];
  let cursor = 0;
  let effects = [];
  let dirty = false;
  let tree;
  let profile = { name, age: "25-35", techLevel: "medium", profession: "it",
    hobbies: ["reading-history"], tourTime: "30", style: "formal" };
  let resolveResponse;
  const requests = [];
  const changed = (previous, dependencies) => !previous ||
    dependencies.some((value, index) => !Object.is(value, previous.dependencies[index]));
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!slots[index]) slots[index] = { value: initial };
      return [slots[index].value, (next) => {
        const previous = slots[index].value;
        const value = typeof next === "function" ? next(previous) : next;
        if (!Object.is(value, previous)) {
          slots[index].value = value;
          dirty = true;
        }
      }];
    },
    useRef(initial) {
      const index = cursor++;
      return slots[index] ||= { current: initial };
    },
    useCallback(callback, dependencies) {
      const index = cursor++;
      if (changed(slots[index], dependencies)) slots[index] = { callback, dependencies };
      return slots[index].callback;
    },
    useEffect(callback, dependencies) {
      const index = cursor++;
      if (changed(slots[index], dependencies)) {
        const previous = slots[index];
        slots[index] = { dependencies };
        effects.push(() => {
          previous?.cleanup?.();
          slots[index].cleanup = callback();
        });
      }
    },
  };
  const jsx = (type, props) => ({ type, props });
  const exports = {};
  const source = fs.readFileSync(new URL("../../src/components/Chat.tsx", import.meta.url), "utf8");
  const javascript = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022, esModuleInterop: true,
  } }).outputText;
  vm.runInNewContext(javascript, {
    exports, console, TextDecoder, localStorage: storage,
    fetch(url, options) {
      requests.push({ url, payload: JSON.parse(options.body) });
      return new Promise((resolve) => { resolveResponse = resolve; });
    },
    require(module) {
      if (module === "react") return react;
      if (module === "react/jsx-runtime") return { jsx, jsxs: jsx };
      if (module === "framer-motion") return { motion: new Proxy({}, { get: (_, key) => key }), AnimatePresence: "AnimatePresence" };
      if (module === "next/link") return "Link";
      if (module === "@/context/AppContext") return { useApp: () => ({ profile }) };
      if (module === "@/context/LanguageContext") return { useLanguage: () => ({ t: (key) => key, lang: "ru" }) };
      if (module === "./Button") return { Button: "Button" };
      throw new Error("Unexpected component import: " + module);
    },
  }, { filename: "Chat.tsx", timeout: 1000 });

  const nodes = () => {
    const result = [];
    function visit(node) {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(visit);
      result.push(node);
      visit(node.props?.children);
    }
    visit(tree);
    return result;
  };
  const api = {
    storage, requests,
    flush() {
      for (let count = 0; count < 30; count++) {
        cursor = 0;
        effects = [];
        dirty = false;
        tree = exports.Chat();
        for (const effect of effects) effect();
        if (!dirty) return;
      }
      throw new Error("Chat did not settle after 30 commits");
    },
    messages() {
      return nodes().filter((node) => node.props?.className === "whitespace-pre-wrap")
        .map((node) => node.props.children);
    },
    type(text) {
      nodes().find((node) => node.type === "textarea").props.onChange({ target: { value: text } });
      api.flush();
    },
    click(label) {
      return nodes().find((node) => node.type === "Button" && node.props.children === label).props.onClick();
    },
    updateProfile(patch) {
      profile = { ...profile, ...patch };
      api.flush();
    },
    respond() {
      let controller;
      const body = new ReadableStream({ start(value) { controller = value; } });
      resolveResponse({ ok: true, body });
      return {
        chunk(content) {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
        },
        finish() {
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        },
      };
    },
  };
  api.flush();
  return api;
}

export const tick = () => new Promise((resolve) => setImmediate(resolve));
