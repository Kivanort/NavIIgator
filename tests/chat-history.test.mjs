import assert from "node:assert/strict";
import test from "node:test";
import { MemoryStorage, renderChat, tick } from "./helpers/chat-renderer.mjs";

test("sending and streaming preserve the question, persist the answer and restore after reload", async () => {
  const storage = new MemoryStorage();
  const chat = renderChat({ storage });
  const greeting = chat.messages()[0];
  const initialReads = storage.reads;
  chat.type("What is interesting about Apple I?");
  const sending = chat.click("chat.send");
  chat.flush();
  assert.deepEqual(chat.messages(), [greeting, "What is interesting about Apple I?"]);
  assert.equal(chat.requests.length, 1);
  assert.equal(chat.requests[0].payload.messages.at(-1).content, "What is interesting about Apple I?");
  const stream = chat.respond();
  await tick();
  chat.flush();
  stream.chunk("Apple I was ");
  await tick();
  chat.flush();
  assert.equal(chat.messages().at(-1), "Apple I was ");
  stream.chunk("an early personal computer.");
  stream.finish();
  await sending;
  await tick();
  chat.flush();
  const expected = [greeting, "What is interesting about Apple I?", "Apple I was an early personal computer."];
  assert.deepEqual(chat.messages(), expected);
  assert.equal(storage.reads, initialReads, "stream updates must not rehydrate old history");
  assert.deepEqual(JSON.parse(storage.values.get("chatHistory")).map((message) => message.content), expected);
  const reloaded = renderChat({ storage });
  assert.deepEqual(reloaded.messages(), expected);
});

test("pending mode does not load history until the visitor chooses the generic chat", () => {
  const storage = new MemoryStorage();
  storage.setItem("chatHistory", JSON.stringify([{ role: "user", content: "Previous museum question" },
    { role: "assistant", content: "Previous museum answer" }]));
  const chat = renderChat({ storage, name: "" });
  assert.equal(storage.reads, 0);
  chat.click("chat.continueWithoutQuiz");
  chat.flush();
  assert.deepEqual(chat.messages(), ["Previous museum question", "Previous museum answer"]);
  const initialReads = storage.reads;
  chat.updateProfile({ name: "New profile", style: "informal" });
  assert.deepEqual(chat.messages(), ["Previous museum question", "Previous museum answer"]);
  assert.equal(storage.reads, initialReads, "profile changes must not replace an active conversation");
});

test("empty, malformed or structurally invalid history opens a usable greeting", async () => {
  for (const raw of [null, "[]", "{broken", "null", '{"length":2}',
    '[null,17,{"role":"system","content":"untrusted"},{"role":"user","content":""}]']) {
    const storage = new MemoryStorage();
    if (raw !== null) storage.setItem("chatHistory", raw);
    const chat = renderChat({ storage });
    assert.equal(chat.messages().length, 1);
    assert.match(chat.messages()[0], /QA visitor/);
    chat.type("Museum question");
    const sending = chat.click("chat.send");
    chat.flush();
    const stream = chat.respond();
    await tick();
    stream.chunk("Museum answer");
    stream.finish();
    await sending;
    await tick();
    chat.flush();
    assert.equal(chat.messages().at(-1), "Museum answer");
  }
});

test("restoring mixed history keeps valid messages and removes errors or invalid roles", () => {
  const storage = new MemoryStorage();
  storage.setItem("chatHistory", JSON.stringify([
    { role: "user", content: "Valid question" }, null,
    { role: "assistant", content: "Failed request", error: true },
    { role: "system", content: "Not a conversation message" },
    { role: "assistant", content: "Valid answer" },
  ]));
  const chat = renderChat({ storage });
  assert.deepEqual(chat.messages(), ["Valid question", "Valid answer"]);
  assert.deepEqual(JSON.parse(storage.values.get("chatHistory")), [
    { role: "user", content: "Valid question" }, { role: "assistant", content: "Valid answer" },
  ]);
});
