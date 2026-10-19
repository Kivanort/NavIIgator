import assert from "node:assert/strict";
import test from "node:test";
import { readJsonBody, RequestBodyError } from "../src/lib/request-body.ts";

const rejectsWithStatus = (status) => (error) =>
  error instanceof RequestBodyError && error.status === status;

function request(body, headers = {}) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body,
    duplex: "half",
  });
}

test("accepts bounded JSON with a charset parameter", async () => {
  assert.deepEqual(await readJsonBody(request('{"message":"hello"}', {
    "Content-Type": "application/json; charset=utf-8",
  })), { message: "hello" });
});

test("rejects malformed JSON and invalid UTF-8", async () => {
  await assert.rejects(readJsonBody(request("{")), rejectsWithStatus(400));
  await assert.rejects(readJsonBody(request(new Uint8Array([0xff, 0xfe]))), rejectsWithStatus(400));
});

test("rejects non-JSON content types", async () => {
  await assert.rejects(readJsonBody(request("{}", { "Content-Type": "text/plain" })), rejectsWithStatus(415));
});

test("rejects declared oversize before reading the body", async () => {
  await assert.rejects(readJsonBody(request("{}", { "Content-Length": "100" }), 10), rejectsWithStatus(413));
});

test("bounds and cancels streamed bodies without trusting Content-Length", async () => {
  let cancelled = false;
  let pulls = 0;
  const stream = new ReadableStream({
    pull(controller) {
      pulls++;
      controller.enqueue(new Uint8Array(16));
    },
    cancel() { cancelled = true; },
  });
  await assert.rejects(readJsonBody(request(stream), 20), rejectsWithStatus(413));
  assert.equal(cancelled, true);
  assert.ok(pulls <= 4, "the reader must stop instead of consuming the remaining body");
});
