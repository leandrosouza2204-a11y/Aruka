import assert from "node:assert/strict";
import test from "node:test";
import {
  combineAgendaTime,
  formatAgendaMinutes,
  parseAgendaTime,
  splitAgendaTime,
  suggestAgendaEndTime,
} from "./agendaTime.js";

test("suggests a 60 minute end while preserving selected minutes", () => {
  assert.deepEqual(suggestAgendaEndTime("09:30"), { value: "10:30", crossesMidnight: false });
  assert.deepEqual(suggestAgendaEndTime("18:00"), { value: "19:00", crossesMidnight: false });
  assert.deepEqual(suggestAgendaEndTime("19:45"), { value: "20:45", crossesMidnight: false });
});

test("does not silently wrap a suggested interval across midnight", () => {
  assert.deepEqual(suggestAgendaEndTime("23:00"), { value: "", crossesMidnight: true });
  assert.deepEqual(suggestAgendaEndTime("23:30"), { value: "", crossesMidnight: true });
  assert.deepEqual(suggestAgendaEndTime("23:59"), { value: "", crossesMidnight: true });
});

test("parses, formats, splits and combines valid 24 hour times", () => {
  assert.equal(parseAgendaTime("00:00"), 0);
  assert.equal(parseAgendaTime("23:59"), 1439);
  assert.equal(parseAgendaTime("24:00"), null);
  assert.equal(parseAgendaTime("9:30"), null);
  assert.equal(formatAgendaMinutes(645), "10:45");
  assert.deepEqual(splitAgendaTime("07:05"), { hour: "07", minute: "05" });
  assert.equal(combineAgendaTime("07", "05"), "07:05");
});
