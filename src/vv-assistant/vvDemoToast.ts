import { toast } from "sonner@2.0.3"

/** 演示样板：说明按钮在真实客户端会调起原生能力，此处仅为示意 */
const DEMO_NATIVE_DESC =
  "真实客户端将调起视频会议、即时会话等原生能力；本环境为演示样板，按钮仅作交互示意，不会实际打开或跳转。"

export function vvDemoNativeCapabilityToast(actionLabel: string) {
  toast(actionLabel, {
    description: DEMO_NATIVE_DESC,
    duration: 4800,
  })
}
