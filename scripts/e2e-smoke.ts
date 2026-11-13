/**
 * End-to-end smoke test against a running dev server that uses a throwaway test database.
 *   DATABASE_PATH=./data/test.db npm run db:seed
 *   NEXT_DIST_DIR=.next-test npx next build
 *   DATABASE_PATH=./data/test.db UPLOAD_DIR=./data/test-uploads NEXT_DIST_DIR=.next-test npx next start --port 3100
 *   node --env-file=.env.local --import tsx scripts/e2e-smoke.ts [screenshotDir]
 */
import { chromium, type Page, type BrowserContext } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.E2E_BASE ?? "http://localhost:3100";
const OUT = path.resolve(process.argv[2] ?? "./data/e2e-shots");
fs.mkdirSync(OUT, { recursive: true });
const failures: string[] = [];
const check = (cond: unknown, msg: string) => {
  if (!cond) {
    failures.push(msg);
    console.log(`  ✗ ${msg}`);
  } else console.log(`  ✓ ${msg}`);
};

function watch(page: Page, label: string) {
  page.on("pageerror", (e) => failures.push(`[${label}] page error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !/favicon|Download the React DevTools|net::ERR_ABORTED|status of 404|caret-color/.test(m.text())) failures.push(`[${label}] console error (${page.url()}): ${m.text().slice(0, m.text().includes("hydrated") ? 2500 : 300)}`);
  });
}

async function noOverflow(page: Page, label: string) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(over <= 1, `${label}: no horizontal overflow (${over}px)`);
}

async function login(ctx: BrowserContext, name: string, password: string) {
  const page = await ctx.newPage();
  watch(page, name);
  await page.goto(`${BASE}/`);
  check(page.url().endsWith("/login"), `${name}: unauthenticated visit redirects to /login`);
  await page.fill('input[name="username"]', name);
  await page.fill('input[name="password"]', "wrong-password");
  await page.click("button[type=submit]");
  const err = page.getByRole("alert").filter({ hasText: "don't match" });
  await err.waitFor();
  check(await err.isVisible(), `${name}: wrong password shows an error`);
  await page.fill('input[name="password"]', password);
  await page.click("button[type=submit]");
  await page.waitForFunction(() => location.pathname !== "/login", null, { timeout: 30000 });
  return page;
}

async function onboard(page: Page, name: string, weekday: string, weekend: string) {
  if (!page.url().includes("/welcome")) await page.goto(`${BASE}/welcome`);
  check(page.url().includes("/welcome"), `${name}: first login goes to onboarding`);
  // Steppers start at 3 h weekdays / 4 h weekends; step by half hours to the requested values.
  const stepTo = async (field: string, noun: string, target: number) => {
    for (let i = 0; i < 40; i++) {
      const v = Number(await page.locator(`input[name="${field}"]`).inputValue());
      if (v === target) return;
      await page.getByRole("button", { name: `${v < target ? "More" : "Fewer"} ${noun}`, exact: true }).click();
    }
  };
  await stepTo("hoursWeekday", "weekday hours", Number(weekday));
  await stepTo("hoursWeekend", "weekend hours", Number(weekend));
  check(Number(await page.locator('input[name="hoursWeekday"]').inputValue()) === Number(weekday), `${name}: weekday stepper reaches ${weekday} h`);
  await page.click("button[type=submit]");
  await page.waitForFunction(() => location.pathname === "/", null, { timeout: 60000 });
  await page.getByText("DECEMBER 31").first().waitFor();
  check(await page.getByText("DAYS UNTIL").first().isVisible(), `${name}: dashboard shows the countdown`);
}

async function visitAll(page: Page, name: string, shots: boolean) {
  const routes = ["/", "/today", "/roadmap", "/calendar", "/projects", "/proof", "/proof?add=1", "/resources", "/progress", "/settings"];
  for (const r of routes) {
    const res = await page.goto(`${BASE}${r}`);
    check(res?.status() === 200, `${name}: ${r} loads (${res?.status()})`);
    if (shots) await page.screenshot({ path: path.join(OUT, `${name.split(" ")[0].toLowerCase()}-${r.replace(/[/?=]/g, "_") || "home"}.png`), fullPage: true });
  }
}

async function main() {
  const browser = await chromium.launch();
  const adiPass = process.env.SEED_PASSWORD_ADITYA!;
  const harshPass = process.env.SEED_PASSWORD_HARSH!;

  // ── Aditya, desktop ──────────────────────────────────────────────
  console.log("Aditya (desktop)");
  const adi = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await login(adi, "Aditya Sharma", adiPass);
  await onboard(page, "Aditya", "3", "5");
  await visitAll(page, "Aditya Sharma", true);

  // Isolation: designer content must not be reachable.
  await page.goto(`${BASE}/roadmap/pd-t1-1-1`);
  await page.getByText("That topic isn't in your path.").waitFor();
  check(true, "Aditya cannot open a designer topic");
  // The syllabus endpoint requires a session and only serves the learner's own path.
  const anon = await page.request.get(`${BASE}/api/content`, { headers: { cookie: "" } });
  check(anon.status() === 401 || anon.url().endsWith("/login"), `Syllabus download needs a session (${anon.status()})`);

  // Topic workflow
  await page.goto(`${BASE}/roadmap/fe-t1-1-1`);
  await page.getByRole("button", { name: "Start learning" }).click();
  await page.getByRole("button", { name: "Mark as completed" }).waitFor();
  check(true, "Start learning moves topic to Learning");
  const firstBox = page.locator('input[type="checkbox"]').first();
  await firstBox.check({ force: true });
  await page.waitForTimeout(800);
  await page.fill("#notes-fe-t1-1-1", "CPU, RAM, storage and GPU — the memory hierarchy explains caching.");
  await page.getByRole("button", { name: "Save notes" }).click();
  await page.getByText("SAVED", { exact: true }).waitFor();
  check(true, "Notes save");
  await page.locator("aside summary", { hasText: "Log time without a timer" }).click();
  await page.locator("aside").getByLabel("Minutes").fill("35");
  await page.locator("aside").getByRole("button", { name: "Log time" }).click();
  await page.getByText("Logged 35 minutes").waitFor();
  check(true, "Time logged on topic");
  await page.getByRole("button", { name: "Mark as completed" }).click();
  await page.getByRole("button", { name: "Flag for revision" }).waitFor();
  check(true, "Topic marked completed");
  // Proof of work
  await page.getByLabel("Proof link").fill("https://github.com/example/hardware-notes");
  await page.locator("#proof").getByRole("button", { name: "Attach" }).click();
  await page.getByText("Proof of work saved").first().waitFor();
  check(true, "Proof of work saved");
  // Mastery
  const groups = page.locator('#mastery [role="radiogroup"]');
  const nCriteria = await groups.count();
  check(nCriteria >= 4, `Mastery form lists the criteria (${nCriteria})`);
  for (let g = 0; g < nCriteria; g++) await groups.nth(g).getByRole("radio", { name: "4" }).click();
  await page.locator("#mastery textarea").fill("A computer moves data through registers, caches, RAM and disk; each level is slower but larger, so locality and caching dominate performance everywhere.");
  await page.getByRole("button", { name: "Submit assessment" }).click();
  await page.getByText("Mastery recorded").waitFor();
  check(true, "Mastery assessment passes with evidence");
  await page.screenshot({ path: path.join(OUT, "aditya-topic.png"), fullPage: true });

  // Upload an image proof via the proof page
  await page.goto(`${BASE}/proof?add=1`);
  const add = page.locator('section[aria-label="Add proof of work"]');
  await add.locator('select[name="type"]').selectOption("image");
  await add.locator('input[name="title"]').fill("Screenshot of DevTools memory panel");
  const png = path.join(OUT, "tiny.png");
  fs.writeFileSync(png, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"));
  await add.locator('input[type="file"]').setInputFiles(png);
  await add.locator('select[name="topicId"]').selectOption("fe-t1-1-1");
  await add.getByRole("button", { name: "Save proof of work" }).click();
  await page.getByText("Proof of work saved").first().waitFor();
  const img = page.locator('img[alt="Screenshot of DevTools memory panel"]').first();
  await img.waitFor();
  const src = await img.getAttribute("src");
  check(src?.startsWith("blob:"), "Uploaded screenshot is shown from this browser's storage");
  const stored = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("groundwork:data:")));
  check(stored.length === 1, `Learner data is saved in localStorage (${stored.join(", ")})`);

  // Today planner: complete first task with time
  await page.goto(`${BASE}/today`);
  const firstTask = page.locator('button[aria-label^="Mark"][aria-label$="minutes"]').first();
  if (await firstTask.count()) {
    await firstTask.click();
    await page.getByText(/Done — \d+ minutes logged|Marked as done/).waitFor();
    check(true, "Daily task completed with logged time");
  }
  // Custom task
  await page.getByLabel("Add your own task").fill("Read the Fiber architecture doc");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page.getByText("Task added").waitFor();
  check(true, "Custom task added");

  // Projects: open the weekend project
  await page.goto(`${BASE}/projects`);
  const projLink = page.locator('a[href^="/projects?p="]').first();
  await projLink.waitFor();
  check((await projLink.count()) > 0, "A weekend project exists");
  await projLink.click();
  await page.waitForFunction(() => location.search.startsWith("?p="));
  await page.getByText("Requirements").first().waitFor();
  check(await page.getByText("Requirements").first().isVisible(), "Project brief shows requirements");
  const pid = new URL(page.url()).searchParams.get("p");
  await page.goto(`${BASE}/projects/${pid}`);
  check(page.url().includes(`/projects?p=${pid}`), `Old project URLs redirect to the projects page (${page.url()})`);
  await page.screenshot({ path: path.join(OUT, "aditya-project.png"), fullPage: true });

  // Resources: bookmark
  await page.goto(`${BASE}/resources`);
  await page.getByRole("button", { name: "☆ Save" }).first().click();
  await page.getByRole("button", { name: "★ Saved" }).first().waitFor();
  check(true, "Resource bookmarked");

  // Streak reflects meaningful activity
  await page.goto(`${BASE}/`);
  await page.getByText("1d", { exact: true }).first().waitFor();
  check(true, "Streak shows 1 day after meaningful activity");
  await page.screenshot({ path: path.join(OUT, "aditya-dashboard-after.png"), fullPage: true });

  // ── Aditya, mobile ───────────────────────────────────────────────
  console.log("Aditya (mobile)");
  const state = await adi.storageState();
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: state, isMobile: true, hasTouch: true });
  const mp = await mobile.newPage();
  watch(mp, "mobile");
  for (const r of ["/", "/today", "/roadmap", "/roadmap/fe-t1-1-1", "/calendar", "/projects", "/proof", "/resources", "/progress"]) {
    await mp.goto(`${BASE}${r}`);
    await noOverflow(mp, `mobile ${r}`);
    await mp.screenshot({ path: path.join(OUT, `mobile-${r.replace(/\//g, "_") || "home"}.png`), fullPage: r === "/" });
  }
  await mp.getByRole("button", { name: "More" }).click();
  check(await mp.getByRole("dialog", { name: "Command palette" }).isVisible(), "Mobile More opens the command palette");

  // Dark theme
  const dark = await browser.newContext({ viewport: { width: 1440, height: 1000 }, storageState: state, colorScheme: "dark" });
  const dp = await dark.newPage();
  await dp.goto(`${BASE}/`);
  await dp.screenshot({ path: path.join(OUT, "aditya-dark.png"), fullPage: true });
  await dp.goto(`${BASE}/progress`);
  await dp.screenshot({ path: path.join(OUT, "aditya-dark-progress.png"), fullPage: true });

  // Theme choice is saved in localStorage and survives a reload (no server round-trip).
  await page.goto(`${BASE}/settings`);
  await page.getByRole("radio", { name: "Dark" }).click();
  await page.reload();
  check((await page.evaluate(() => document.documentElement.getAttribute("data-theme"))) === "dark", "Theme choice persists across reloads (localStorage)");
  await page.screenshot({ path: path.join(OUT, "aditya-dark-settings.png"), fullPage: true });
  await page.getByRole("radio", { name: "System" }).click();
  check((await page.evaluate(() => document.documentElement.getAttribute("data-theme"))) === null, "System theme restored");
  // Session survives reloads and navigation.
  await page.reload();
  check(!page.url().endsWith("/login"), "Session persists after reload");

  // Backup: download, then restore it
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download backup" }).click()]);
  const backupPath = path.join(OUT, "backup.json");
  await download.saveAs(backupPath);
  const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));
  check(backup.app === "groundwork" && backup.tables.proofs.rows.length >= 2 && Object.keys(backup.files ?? {}).length === 1, "Backup contains proofs and the uploaded file");
  page.once("dialog", (d) => d.accept());
  await page.locator('input[aria-label="Backup file"]').setInputFiles(backupPath);
  await page.getByText(/restored/).first().waitFor();
  check(true, "Backup restores");

  // Settings: rebuild the plan
  await page.getByRole("button", { name: "Rebuild plan now" }).click();
  await page.getByText(/Plan rebuilt/).first().waitFor();
  check(true, "Plan rebuilds from Settings");

  // Logout
  await page.locator("aside").getByRole("button", { name: "Sign out" }).click();
  await page.waitForFunction(() => location.pathname === "/login");
  const after = await page.goto(`${BASE}/progress`);
  check(after?.url().endsWith("/login"), "After logout, private pages redirect to login");

  // ── Harsh ────────────────────────────────────────────────────────
  console.log("Harsh (desktop)");
  const harsh = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const hp = await login(harsh, "Harsh Suthar", harshPass);
  await onboard(hp, "Harsh", "2", "4");
  await visitAll(hp, "Harsh Suthar", true);
  await hp.goto(`${BASE}/roadmap/fe-t1-1-1`);
  await hp.getByText("That topic isn't in your path.").waitFor();
  check(true, "Harsh cannot open a frontend topic");
  await hp.goto(`${BASE}/roadmap`);
  await hp.getByText(/Product Designer/i).first().waitFor();
  check(true, "Harsh sees the product designer path");

  await browser.close();
  console.log(failures.length ? `\n${failures.length} FAILURES:\n- ${failures.join("\n- ")}` : "\nAll checks passed.");
  process.exit(failures.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  console.log(failures.length ? `\nFailures before crash:\n- ${failures.join("\n- ")}` : "");
  process.exit(1);
});
