import { readFile, readdir, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (message) => errors.push(message);
const readJson = async (path) => {
  try { return JSON.parse(await readFile(join(root, path), "utf8")); }
  catch (error) { fail(`${path}: ${error.message}`); return null; }
};

const site = await readJson("data/site.json");
if (site) {
  if (!site.term || !site.announcement || !site.announcementEs || !site.contact?.email) fail("site.json: term, bilingual announcements, and contact.email are required");
  if (!Array.isArray(site.courses) || site.courses.length === 0) fail("site.json: at least one course is required");
  for (const course of site.courses || []) {
    if (!course.name || !course.nameEs || !course.description || !course.descriptionEs || !course.url || !course.shortLabel) fail("site.json: every course needs bilingual names/descriptions, url, and shortLabel");
    try { await access(join(root, course.url)); } catch { fail(`site.json: missing course page ${course.url}`); }
  }
}

const courseFiles = (await readdir(join(root, "data/courses"))).filter((name) => name.endsWith(".json"));
for (const name of courseFiles) {
  const path = `data/courses/${name}`;
  const course = await readJson(path);
  if (!course) continue;
  if (!course.name || !course.nameEs || !course.description || !course.descriptionEs || !Array.isArray(course.weeks)) fail(`${path}: bilingual name/description and weeks are required`);
  const ids = new Set();
  let currentCount = 0;
  for (const week of course.weeks || []) {
    if (!week.id || !week.label || !week.startDate || !week.endDate) fail(`${path}: each week needs id, label, startDate, and endDate`);
    if (ids.has(week.id)) fail(`${path}: duplicate week id ${week.id}`);
    ids.add(week.id);
    if (week.status === "current") currentCount += 1;
    if (!["current", "archived"].includes(week.status)) fail(`${path}: invalid status for ${week.id}`);
    if (Number.isNaN(Date.parse(week.startDate)) || Number.isNaN(Date.parse(week.endDate))) fail(`${path}: invalid date in ${week.id}`);
    for (const day of week.days || []) {
      if (!day.dayLabel || !day.title) fail(`${path}: every day needs dayLabel and title`);
      if (day.link && !/^https:\/\//.test(day.link)) fail(`${path}: assignment links must use https`);
      const content = JSON.stringify(day).toLowerCase();
      if (/student name|student email|classroom code|join code/.test(content)) fail(`${path}: possible private student or join-code content in ${week.id}`);
    }
  }
  if (currentCount > 1) fail(`${path}: only one week can be current`);
}

const htmlFiles = (await readdir(root)).filter((name) => name.endsWith(".html"));
for (const name of htmlFiles) {
  const html = await readFile(join(root, name), "utf8");
  if (!/<html lang=/.test(html)) fail(`${name}: missing document language`);
  if (!/<meta name="viewport"/.test(html)) fail(`${name}: missing viewport metadata`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|data:)/.test(target)) continue;
    try { await access(join(root, target)); } catch { fail(`${name}: missing local target ${target}`); }
  }
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Validated ${courseFiles.length} course data files and ${htmlFiles.length} HTML pages.`);
