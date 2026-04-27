
  # CUI组织切换new (Copy)

  This is a code bundle for CUI组织切换new (Copy). The original project is available at https://www.figma.com/design/JKXfYfiC2ZWSc2uD28ugSL/CUI%E7%BB%84%E7%BB%87%E5%88%87%E6%8D%A2new--Copy-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server（默认 **http://127.0.0.1:3000/**）。若怀疑缓存未更新，可执行 `npm run dev:clear` 清掉 Vite 预构建缓存后再开。

  **看「多主体下日历合并为一行」等最新交互**：请从首页点「场景五」，或直接打开  
  **http://127.0.0.1:3000/main-ai?scenario=scenario-five**  
  再按界面操作；地址栏会保留 `?scenario=`，**刷新页面不会丢场景**（已改为 Browser History，不再只用 memory 路由）。

  ## E2E（Playwright）

  首次在本机跑端到端前请安装浏览器：`npm run playwright:install`（仅 Chromium）。

  - `npm run test:e2e`：自动起 dev 服务（默认端口 `4173`，可用环境变量 `E2E_PORT` 覆盖）并执行 `e2e/` 下用例。
  - `npm run test:e2e:ui`：Playwright UI 模式调试。
  - `npm run test:e2e:headed`：有头浏览器。
  - 跑完后查看 HTML 报告：`npm run test:e2e:report`。
