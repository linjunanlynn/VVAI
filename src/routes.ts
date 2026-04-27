import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./Home";
import { MainAIPage } from "./pages/MainAIPage";
import { MainAIFreshUserPage } from "./pages/MainAIFreshUserPage";
import { NotFound } from "./pages/NotFound";
import { ScenarioShowcase } from "./pages/ScenarioShowcase";

/** 使用 Browser History：地址栏与 /main-ai?scenario= 一致，刷新后仍能进入对应场景（不再只用 memory state） */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "main-ai", Component: MainAIPage },
      { path: "main-ai-fresh-user", Component: MainAIFreshUserPage },
      { path: "scenario-showcase", Component: ScenarioShowcase },
      { path: "*", Component: NotFound },
    ],
  },
]);