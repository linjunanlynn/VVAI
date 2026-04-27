const PREFIX = "dock-mirror:" as const

/** 主会话消息 id → dock 镜像会话内对位消息 id（用于 patch 同步） */
export function toDockMirrorPeerMessageId(sourceMessageId: string): string {
  if (sourceMessageId.startsWith(PREFIX)) return sourceMessageId
  return `${PREFIX}${sourceMessageId}`
}
