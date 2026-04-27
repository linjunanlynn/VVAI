import { defineConfig, devices } from "@playwright/test"

/** 与日常 dev 错开；可用 E2E_PORT 覆盖，避免本机 4173 已被占用 */
const E2E_PORT = Number(process.env.E2E_PORT) || 4173
const E2E_ORIGIN = `http://127.0.0.1:${E2E_PORT}`

const isCi = !!process.env.CI

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: 1,
  /** 终端 + HTML 报告；失败时可在本机执行 npm run test:e2e:report 查看 */
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  outputDir: "test-results",
  timeout: 60_000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: E2E_ORIGIN,
    trace: "on-first-retry",
    actionTimeout: 20_000,
  },
  webServer: {
    /** 绑定 IPv4，否则 mac 上 localhost 可能仅 IPv6，Playwright 用 127.0.0.1 会连不上 */
    command: `npx vite --port ${E2E_PORT} --strictPort --host 127.0.0.1`,
    url: E2E_ORIGIN,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
