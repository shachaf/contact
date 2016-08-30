export function validWord(s) {
  return !!s.match(/^[a-z]+$/)
}

export function wsAbort(ws, msg) {
  console.log("wsAbort: " + msg)
  ws.send(JSON.stringify({type: "error", ts: Date.now(), error: msg}), {}, (e) => ws.close());
}

export function wsWarn(ws, msg) {
  console.log("wsWarn: " + msg)
  ws.send(JSON.stringify({type: "error", ts: Date.now(), error: msg}));
}

export function deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

