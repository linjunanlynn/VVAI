import {
  approvalCommands,
  docsCommands,
  driveCommands,
  mailCommands,
  meetingCommands,
  scheduleCommands,
  todoCommands,
} from "./vvCommands"
import { docsSeed, driveSeed, mailSeed } from "./seeds"

export function inferUserCommand(text: string): string | null {
  const content = text || ""

  const editSchedule = content.match(/请把“(.+?)”这条日程修改为：标题“(.+?)”，时间 (.+?) - (.+?)，地点“(.+?)”，提醒“(.+?)”。/)
  if (editSchedule) {
    const [, , title, start, end, location, reminder] = editSchedule
    return `vvcli calendar events patch --event-id evt_xxx --title "${title}" --start "${start}" --end "${end}" --location "${location}" --reminder "${reminder}"`
  }

  const cancelSchedule = content.match(/请取消“(.+?)”这条日程，取消原因是“(.+?)”(，并且(通知相关参与人|不要通知相关参与人))?。/)
  if (cancelSchedule) {
    const [, , reason] = cancelSchedule
    return `vvcli calendar events delete --event-id evt_xxx --reason "${reason}" --notify true`
  }

  const createSchedule = content.match(/请新建一条日程：标题“(.+?)”，时间“(.+?)”，地点“(.+?)”，参与人“(.+?)”。/)
  if (createSchedule) {
    const [, title, time, location, attendees] = createSchedule
    return `vvcli calendar events create --title "${title}" --time "${time}" --location "${location}" --attendees "${attendees}"`
  }

  const startMeeting = content.match(/请现在发起一场会议：标题“(.+?)”，参会人“(.+?)”，会议方式“(.+?)”。/)
  if (startMeeting) {
    const [, title, participants, room] = startMeeting
    return `vvcli vc meetings start --topic "${title}" --participants "${participants}" --room "${room}"`
  }

  const bookMeeting = content.match(/请预约一场会议：标题“(.+?)”，时间“(.+?)”，参会人“(.+?)”，会议方式“(.+?)”。/)
  if (bookMeeting) {
    const [, title, time, participants, room] = bookMeeting
    return `vvcli vc meetings create --topic "${title}" --time "${time}" --participants "${participants}" --room "${room}"`
  }

  const complexMeeting = content.match(/今天帮我约一个(.+?)和(.+?)的空闲时间开会，主题是：(.+?)，地点是：(.+?)。/)
  if (complexMeeting) {
    const [, personA, personB] = complexMeeting
    return `vvcli calendar freebusy query --users "${personA},${personB}" --range today`
  }

  const sendMessage = content.match(/请把这条通知发送出去：对象“(.+?)”，接收人“(.+?)”，内容“(.+?)”。/)
  if (sendMessage) {
    const [, , to, body] = sendMessage
    return `vvcli im +send --to "${to}" --text "${body}"`
  }

  const createApproval = content.match(/请发起一条审批：标题“(.+?)”，审批模板“(.+?)”，审批人“(.+?)”，抄送“(.+?)”，金额“(.+?)”，说明“(.+?)”。/)
  if (createApproval) {
    const [, title, template, approvers, cc, amount, detail] = createApproval
    return `vvcli approval create --title "${title}" --template "${template}" --approvers "${approvers}" --cc "${cc}" --amount "${amount}" --detail "${detail}"`
  }

  const createMail = content.match(/请新建一封邮件：收件人“(.+?)”，抄送“(.+?)”，主题“(.+?)”，内容“([\s\S]+?)”。/)
  if (createMail) {
    const [, to, cc, subject, body] = createMail
    return `vvcli mail send --to "${to}" --cc "${cc}" --subject "${subject}" --body "${body}"`
  }

  const uploadFile = content.match(/请上传一个文件：文件名“(.+?)”，目录“(.+?)”，文件类型“(.+?)”。/)
  if (uploadFile) {
    const [, name, directory, fileType] = uploadFile
    return `vvcli drive files upload --name "${name}" --directory "${directory}" --type "${fileType}"`
  }

  const shareFile = content.match(/请共享“(.+?)”这个文件给“(.+?)”，权限“(.+?)”。/)
  if (shareFile) {
    const [, name, to, permission] = shareFile
    return `vvcli drive files share --file "${name}" --to "${to}" --permission "${permission}"`
  }

  const downloadFile = content.match(/下载“(.+?)”/)
  if (downloadFile) {
    const [, name] = downloadFile
    return `vvcli drive files download --file "${name}" --target "~/Downloads"`
  }

  const guiModifySchedule = content.match(/修改“(.+?)”/)
  if (guiModifySchedule) return scheduleCommands.edit

  const guiCancelSchedule = content.match(/取消“(.+?)”/)
  if (guiCancelSchedule) return scheduleCommands.cancel

  const guiNotifySchedule = content.match(/通知“(.+?)”的参与人/)
  if (guiNotifySchedule) return scheduleCommands.notify

  const guiJoinMeeting = content.match(/加入“(.+?)”/)
  if (guiJoinMeeting) return meetingCommands.join

  const guiRecordSummary = content.match(/为“(.+?)”生成摘要/)
  if (guiRecordSummary) return "vvcli vc records summarize --record-id rec_xxx"

  const guiRecordSend = content.match(/发送“(.+?)”会议记录/)
  if (guiRecordSend) return meetingCommands.send

  const genericDetail = content.match(/查看“(.+?)”详情/)
  if (genericDetail) {
    const [, title] = genericDetail
    if (title.includes("日程")) return scheduleCommands.detail
    if (title.includes("审批：") || title.includes("事项：") || title.includes("抄送：")) return todoCommands.detail
    if (mailSeed.some((item) => item.subject === title)) return mailCommands.detail
    if (docsSeed.some((item) => item.title === title)) return docsCommands.detail
    if (driveSeed.some((item) => item.name === title)) return driveCommands.detail
    if (title.includes("记录")) return meetingCommands.record
    if (title.includes("会")) return meetingCommands.detail
  }

  const todoApprove = content.match(/同意“(.+?)”/)
  if (todoApprove) return todoCommands.approve

  const todoReject = content.match(/拒绝“(.+?)”/)
  if (todoReject) return todoCommands.reject

  const todoComplete = content.match(/处理“(.+?)”/)
  if (todoComplete) return todoCommands.complete

  if (content.includes("共同空闲") || (content.includes("空闲") && (content.includes("查询") || content.includes("李四"))))
    return scheduleCommands.freebusy
  if (content.includes("新建日历")) return null
  if (content.includes("查询今日日程") || content.includes("查看今日日程") || content.includes("今天安排"))
    return scheduleCommands.agenda
  if (content.includes("全部日程")) return scheduleCommands.all
  if (/查看【.+?】日程/.test(content)) return scheduleCommands.detail
  if (content.includes("查看") && content.includes("日程") && content.includes("详情")) return scheduleCommands.detail
  if (content === "修改日程" || content.includes("修改日程")) return scheduleCommands.edit
  if (content === "修改今日日程" || content.includes("修改今日日程")) return scheduleCommands.edit
  if (content === "取消日程" || content.includes("取消日程")) return scheduleCommands.cancel
  if (content === "取消今日日程" || content.includes("取消今日日程")) return scheduleCommands.cancel
  if (content.includes("新建日程")) return null
  if (content.includes("发起会议")) return null
  if (content.includes("加入会议")) return meetingCommands.join
  if (content.includes("预约会议")) return null
  if (content.includes("会议记录") || (content.includes("查看") && content.includes("记录"))) return meetingCommands.record
  if (content.includes("查看") && content.includes("会议") && content.includes("详情")) return meetingCommands.detail
  if (content.includes("打开我的全部待办") || content.includes("我的待办")) return todoCommands.mine
  if (content.includes("全部待办")) return todoCommands.all
  if (content.includes("待处理")) return todoCommands.pending
  if (content.includes("已处理")) return todoCommands.done
  if (content.includes("抄送我")) return todoCommands.cc
  if (content.includes("草稿")) return todoCommands.draft
  if (content.includes("全部流程")) return approvalCommands.allProcesses
  if (content.includes("发起审批")) return null
  if (content.includes("我发起的") || content.includes("我发起")) return todoCommands.initiated
  if (content.includes("收件箱")) return mailCommands.inbox
  if (content.includes("新建邮件")) return null
  if (content.includes("取消新建邮件")) return "vvcli mail compose discard --local-draft"
  if (content.includes("我的文件")) return driveCommands.mine
  if (content.includes("上传文件")) return null
  if (content.includes("下载文件")) return driveCommands.download
  if (content.includes("共享文件")) return driveCommands.share
  if (content.includes("全部文档")) return docsCommands.all
  if (content.includes("我创建的")) return docsCommands.created
  if (content.includes("与我共享")) return docsCommands.shared
  if (content.includes("我收藏的")) return docsCommands.favorite
  if (content.includes("取消发起会议")) return "vvcli vc meetings discard --local-draft"
  if (content.includes("取消发起审批")) return "vvcli approval discard --local-draft"
  if (content.includes("生成摘要")) return "vvcli vc records summarize --record-id rec_xxx"
  if (content.includes("发送“") && content.includes("会议记录")) return meetingCommands.send

  return null
}
