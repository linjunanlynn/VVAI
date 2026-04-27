import { test, expect } from "@playwright/test"

/** 首次点 dock 新建日历会话时的欢迎语 */
const CALENDAR_ASSISTANT_LINE = /你好，我是「日历」智能助手/

/**
 * 场景五：多组织下同一应用（日历）按「应用 × 组织」拆成多条会话栏，
 * 每行展示应用名、会话组织名、最近活动时间（切换组织后再点 dock 会新增一行）。
 */
test("场景五：两所机构各开日历后会话列表为两条日历栏且分属不同组织", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "场景五（学校 + 教育机构 + 医院 · 底部并集）" }).click()
  /** 场景五首次进入为「消息」视图，需先进入《主AI入口》才有会话列表收展 */
  await page.locator('button[title="《主AI入口》"]').click()

  /** createMemoryRouter 不更新地址栏，用界面元素等待《主CUI交互》 */
  await expect(page.getByRole("button", { name: "展开侧栏" })).toBeVisible({ timeout: 20_000 })

  await page.getByRole("button", { name: "展开侧栏" }).click()

  const sidebar = page.getByTestId("session-list-sidebar")
  await expect(sidebar.getByRole("heading", { name: "会话历史" })).toBeVisible({ timeout: 15_000 })
  /** 未从 dock 打开过日历时，列表中不应出现应用 Agent 行 */
  await expect(sidebar.getByTestId("session-list-dock-app-org-row")).toHaveCount(0)

  const dockBar = page.getByTestId("main-dock-bar")
  /** 三组织并集：医院门户在条首 */
  await expect(dockBar.locator("button").filter({ hasText: /^医院$/ }).first()).toBeVisible({
    timeout: 10_000,
  })
  await expect(dockBar.locator("button").filter({ hasText: /^教育$/ }).first()).toBeVisible()
  /** 通用应用较多，「日历」可能在横向滚动区右侧 */
  await dockBar.evaluate((el) => {
    el.scrollLeft = el.scrollWidth
  })
  const dockCalendar = dockBar.locator("button").filter({ hasText: /^日历$/ })
  await dockCalendar.scrollIntoViewIfNeeded()
  await dockCalendar.click()
  await expect(page.getByText(CALENDAR_ASSISTANT_LINE).first()).toBeVisible({ timeout: 15_000 })

  await expect(sidebar.getByTestId("session-list-dock-app-org-row")).toHaveCount(1)
  const firstRow = sidebar.getByTestId("session-list-dock-app-org-row").first()
  await expect(firstRow).toContainText("日历")
  await expect(firstRow).toContainText("示范学校")

  await page.getByRole("button", { name: /组织：示范学校/ }).click()
  await page.getByRole("menuitem", { name: "示范教育机构" }).click()

  await dockCalendar.click()
  await expect(page.getByText(CALENDAR_ASSISTANT_LINE).first()).toBeVisible({ timeout: 15_000 })

  await expect(sidebar.getByTestId("session-list-dock-app-org-row")).toHaveCount(2)
  await expect(sidebar.getByTestId("session-list-dock-app-org-row").filter({ hasText: "示范学校" })).toHaveCount(1)
  await expect(sidebar.getByTestId("session-list-dock-app-org-row").filter({ hasText: "示范教育机构" })).toHaveCount(1)
})
