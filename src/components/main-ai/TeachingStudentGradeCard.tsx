import * as React from "react"
import { GenericCard } from "./GenericCard"

export type TeachingGradeRow = {
  subject: string
  score: number
  fullScore: number
  level: string
}

export type TeachingStudentGradePayload = {
  studentName: string
  term: string
  rows: TeachingGradeRow[]
  averageScore: number
  classRank: string
}

export function TeachingStudentGradeCard({ data }: { data: TeachingStudentGradePayload }) {
  return (
    <GenericCard title="学生成绩查询结果">
      <p className="text-[length:var(--font-size-sm)] text-text-secondary mb-[var(--space-200)] leading-relaxed">
        以下为演示数据；接入成绩服务后将展示实时查询结果。
      </p>
      <div className="grid grid-cols-2 gap-[var(--space-200)] mb-[var(--space-300)] text-[length:var(--font-size-sm)]">
        <div>
          <span className="text-text-secondary">学生姓名</span>
          <p className="text-text font-[var(--font-weight-medium)] mt-[var(--space-100)]">{data.studentName}</p>
        </div>
        <div>
          <span className="text-text-secondary">学期</span>
          <p className="text-text font-[var(--font-weight-medium)] mt-[var(--space-100)]">{data.term}</p>
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-[length:var(--font-size-sm)] border-collapse">
          <thead>
            <tr className="bg-bg-secondary border-b border-border">
              <th className="px-[var(--space-300)] py-[var(--space-200)] font-[var(--font-weight-medium)] text-text">
                科目
              </th>
              <th className="px-[var(--space-300)] py-[var(--space-200)] font-[var(--font-weight-medium)] text-text">
                得分
              </th>
              <th className="px-[var(--space-300)] py-[var(--space-200)] font-[var(--font-weight-medium)] text-text">
                满分
              </th>
              <th className="px-[var(--space-300)] py-[var(--space-200)] font-[var(--font-weight-medium)] text-text">
                等级
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.subject} className="border-b border-border last:border-0">
                <td className="px-[var(--space-300)] py-[var(--space-200)] text-text">{row.subject}</td>
                <td className="px-[var(--space-300)] py-[var(--space-200)] text-text tabular-nums">{row.score}</td>
                <td className="px-[var(--space-300)] py-[var(--space-200)] text-text-secondary tabular-nums">
                  {row.fullScore}
                </td>
                <td className="px-[var(--space-300)] py-[var(--space-200)] text-text-secondary">{row.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-[var(--space-300)] flex flex-wrap gap-[var(--space-400)] text-[length:var(--font-size-sm)]">
        <div>
          <span className="text-text-secondary">平均分 </span>
          <span className="text-text font-[var(--font-weight-medium)] tabular-nums">{data.averageScore}</span>
        </div>
        <div>
          <span className="text-text-secondary">班级排名 </span>
          <span className="text-text font-[var(--font-weight-medium)]">{data.classRank}</span>
        </div>
      </div>
    </GenericCard>
  )
}

/** 演示用成绩行；接入后端后由接口返回 */
export function buildMockTeachingGradePayload(studentName: string): TeachingStudentGradePayload {
  const name = studentName.trim() || "（未识别姓名）"
  return {
    studentName: name,
    term: "2025 学年 · 第一学期",
    rows: [
      { subject: "语文", score: 88, fullScore: 100, level: "良" },
      { subject: "数学", score: 92, fullScore: 100, level: "优" },
      { subject: "英语", score: 85, fullScore: 100, level: "良" },
      { subject: "科学", score: 84, fullScore: 100, level: "良" },
    ],
    averageScore: 87.3,
    classRank: "12 / 45",
  }
}
