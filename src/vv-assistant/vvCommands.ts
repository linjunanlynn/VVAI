/** Mirrors 助手/src/App.jsx — vvcli 提示文案 */
export const scheduleCommands = {
  agenda: "vvcli calendar +agenda --date today",
  all: "vvcli calendar +agenda --range all",
  detail: "vvcli calendar events get --event-id evt_xxx",
  edit: "vvcli calendar events patch --event-id evt_xxx --start 16:00 --end 16:30",
  cancel: "vvcli calendar events delete --event-id evt_xxx --notify true",
  freebusy: 'vvcli calendar freebusy query --users "李四,王五,商业化团队" --range next-week',
  create: 'vvcli calendar events create --title "产品评审日程" --time "下周二 10:00-11:00"',
  notify: 'vvcli im +send --to "参与人" --text "日程有变动，请注意"',
}

export const meetingCommands = {
  start: 'vvcli vc meetings start --topic "临时讨论会" --participants "李四,王五"',
  join: "vvcli vc meetings join --meeting-id mtg_xxx",
  detail: "vvcli vc meetings get --meeting-id mtg_xxx",
  book: 'vvcli vc meetings create --topic "产品评审会" --time "下周二 10:00-11:00"',
  record: "vvcli vc records get --record-id rec_xxx",
  send: 'vvcli im +send --to "参会人" --text "会议记录已整理好"',
}

export const approvalCommands = {
  allProcesses: "vvcli approval templates list --all",
}

export const todoCommands = {
  mine: 'vvcli todo list --scope "my-todos"',
  all: "vvcli todo list --scope all --with-history",
  pending: "vvcli todo list --status pending",
  initiated: "vvcli todo list --status initiated-by-me",
  done: "vvcli todo list --status done",
  cc: "vvcli todo list --status cc",
  draft: "vvcli todo list --status draft",
  detail: "vvcli todo get --todo-id todo_xxx",
  approve: "vvcli approval task approve --task-id todo_xxx",
  reject: "vvcli approval task reject --task-id todo_xxx",
  complete: "vvcli todo complete --todo-id todo_xxx",
  createApproval: 'vvcli approval create --template "通用审批"',
}

export const mailCommands = {
  inbox: "vvcli mail inbox list --folder inbox",
  detail: "vvcli mail get --mail-id mail_xxx",
  send: 'vvcli mail send --to "…" --cc "…" --subject "…" --body "…"',
}

export const docsCommands = {
  all: "vvcli docs list --scope all",
  created: "vvcli docs list --scope created-by-me",
  shared: "vvcli docs list --scope shared-with-me",
  favorite: "vvcli docs list --scope favorited",
  detail: "vvcli docs get --doc-id doc_xxx",
}

export const driveCommands = {
  mine: "vvcli drive files list --scope mine",
  upload: 'vvcli drive files upload --path "/tmp/file.pdf"',
  download: 'vvcli drive files download --file-id file_xxx --target "~/Downloads"',
  share: 'vvcli drive files share --file-id file_xxx --to "团队" --permission read',
  detail: "vvcli drive files get --file-id file_xxx",
}
