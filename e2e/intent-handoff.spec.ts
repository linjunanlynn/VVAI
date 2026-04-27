import { test, expect } from "@playwright/test"

test("主会话意图卡片点击后进入 dock 并出现【从主对话转入】", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "场景0（未加入任何空间和组织）" }).click()

  await page.locator('button[title="《主AI入口》"]').click()

  await page.getByRole("button", { name: /试试：查订单/ }).click()

  const handoffBtn = page.getByRole("button", { name: /在「商品管理」中继续/ })
  await expect(handoffBtn).toBeVisible({ timeout: 15_000 })
  await handoffBtn.click()

  await expect(page.getByText("【从主对话转入】")).toBeVisible({ timeout: 10_000 })
})
