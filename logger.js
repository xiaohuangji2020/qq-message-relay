"use strict";
const fs = require("fs");
const path = require("path");

function getTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return { yyyy, MM, dd, HH, mm, ss };
}

function getLogPath() {
  const { yyyy, MM, dd } = getTimestamp();
  const month = `${yyyy}-${MM}`;
  const day = `${yyyy}-${MM}-${dd}`;
  const dir = path.join(__dirname, "logs", month);
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${day}.log`);
}

function formatLine(level, msg) {
  const { yyyy, MM, dd, HH, mm, ss } = getTimestamp();
  const datetime = `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  return `[${datetime}] [${level}] ${msg}\n`;
}

function log(msg) {
  const line = formatLine("INFO", msg);
  process.stdout.write(line);
  fs.appendFileSync(getLogPath(), line);
}

function error(msg) {
  const line = formatLine("ERROR", msg);
  process.stderr.write(line);
  fs.appendFileSync(getLogPath(), line);
}

module.exports = { log, error };
