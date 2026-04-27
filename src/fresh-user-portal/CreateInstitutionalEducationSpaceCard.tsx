import * as React from "react"
import { GenericCard } from "../components/main-ai/GenericCard"
import { Field } from "../components/ui/field"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Info, MapPin, Upload } from "lucide-react"

export interface InstitutionalEducationSpacePayload {
  name: string
  shortName: string
  logo?: File
  slogan: string
  adminCompany: string
  location: string
  email: string
  phoneCode: string
  phone: string
  introduction: string
}

interface CreateInstitutionalEducationSpaceCardProps {
  onSubmit: (data: InstitutionalEducationSpacePayload) => void
  /** 行政公司下拉选项（如已加入/创建的组织名称）；为空时使用演示默认项 */
  adminCompanyOptions?: string[]
}

export function CreateInstitutionalEducationSpaceCard({
  onSubmit,
  adminCompanyOptions,
}: CreateInstitutionalEducationSpaceCardProps) {
  const [name, setName] = React.useState("")
  const [shortName, setShortName] = React.useState("")
  const [logo, setLogo] = React.useState<File | undefined>(undefined)
  const [slogan, setSlogan] = React.useState("")
  const [adminCompany, setAdminCompany] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phoneCode, setPhoneCode] = React.useState("+65")
  const [phone, setPhone] = React.useState("")
  const [introduction, setIntroduction] = React.useState("")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 100 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, logo: "图片大小不能超过 100 MB" }))
      return
    }
    if (!["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, logo: "仅支持 jpg、png、gif 格式" }))
      return
    }
    setLogo(file)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.logo
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = "请输入名称"
    if (!shortName.trim()) next.shortName = "请输入机构对外简称"
    if (!adminCompany.trim()) next.adminCompany = "请选择行政公司"
    if (!location.trim()) next.location = "请输入地点"
    if (!email.trim()) {
      next.email = "请输入邮箱"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "邮箱格式不正确"
    }
    if (!introduction.trim()) next.introduction = "请填写介绍"
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    onSubmit({
      name: name.trim(),
      shortName: shortName.trim(),
      logo,
      slogan: slogan.trim(),
      adminCompany: adminCompany.trim(),
      location: location.trim(),
      email: email.trim(),
      phoneCode,
      phone: phone.trim(),
      introduction: introduction.trim(),
    })
  }

  return (
    <GenericCard title="创建机构教育空间">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-500)] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)]">
          <Field label="名称" required error={errors.name}>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((p) => ({ ...p, name: "" }))
              }}
              placeholder="请输入"
            />
          </Field>
          <Field label="机构对外简称" required error={errors.shortName}>
            <Input
              value={shortName}
              onChange={(e) => {
                setShortName(e.target.value)
                if (errors.shortName) setErrors((p) => ({ ...p, shortName: "" }))
              }}
              placeholder="请输入"
            />
          </Field>
        </div>

        <div className="flex flex-col gap-[var(--space-200)]">
          <span className="text-[length:var(--font-size-base)] text-text-muted font-normal leading-[var(--line-height-xs)]">
            Logo
          </span>
          <label className="flex flex-col items-center justify-center w-[130px] h-[130px] border-2 border-dashed border-border rounded-[var(--radius-200)] cursor-pointer hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleLogoChange}
              className="hidden"
            />
            {logo ? (
              <div className="flex flex-col items-center gap-[var(--space-100)]">
                <img src={URL.createObjectURL(logo)} alt="Logo" className="w-[80px] h-[80px] object-contain" />
                <span className="text-[length:var(--font-size-xs)] text-text-tertiary">点击更换</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-[var(--space-200)]">
                <Upload className="w-[24px] h-[24px] text-text-tertiary" />
                <span className="text-[length:var(--font-size-sm)] text-text-tertiary">上传图片</span>
              </div>
            )}
          </label>
          <p className="text-[length:var(--font-size-xs)] text-text-tertiary m-0">
            支持jpg、png、gif格式，图片大小不超过 100 MB，仅支持上传 1 张
          </p>
          {errors.logo && <p className="text-[length:var(--font-size-xs)] text-destructive m-0">{errors.logo}</p>}
        </div>

        <Field label="宣传语">
          <div className="relative w-full">
            <Input
              value={slogan}
              onChange={(e) => setSlogan(e.target.value.slice(0, 100))}
              placeholder="请输入"
              className="pr-[72px]"
            />
            <span className="absolute right-[var(--space-300)] top-1/2 -translate-y-1/2 text-[length:var(--font-size-xs)] text-text-tertiary pointer-events-none">
              {slogan.length} / 100
            </span>
          </div>
        </Field>

        <Field label="行政公司" required error={errors.adminCompany}>
          <Select
            value={adminCompany}
            onValueChange={(v) => {
              setAdminCompany(v)
              if (errors.adminCompany) setErrors((p) => ({ ...p, adminCompany: "" }))
            }}
          >
            <SelectTrigger className="w-full" error={!!errors.adminCompany}>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              {adminCompanyOptions && adminCompanyOptions.length > 0 ? (
                adminCompanyOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="示例教育科技有限公司">示例教育科技有限公司</SelectItem>
                  <SelectItem value="示例培训学校有限公司">示例培训学校有限公司</SelectItem>
                  <SelectItem value="其他关联主体">其他关联主体</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </Field>

        <Field label="地点" required error={errors.location}>
          <div className="relative">
            <Input
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                if (errors.location) setErrors((p) => ({ ...p, location: "" }))
              }}
              placeholder="请输入"
              className="pr-[var(--space-1000)]"
            />
            <MapPin className="absolute right-[var(--space-300)] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-tertiary" />
          </div>
        </Field>

        <Field label="邮箱" required error={errors.email}>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((p) => ({ ...p, email: "" }))
            }}
            placeholder="请输入"
          />
          <p className="text-[length:var(--font-size-xs)] text-text-tertiary m-0 flex items-center gap-[var(--space-100)]">
            <Info className="w-[12px] h-[12px] shrink-0" aria-hidden />
            用于接收通知与对公联系（演示环境不会真实发送邮件）
          </p>
        </Field>

        <Field label="电话">
          <div className="flex gap-[var(--space-200)]">
            <Select value={phoneCode} onValueChange={setPhoneCode}>
              <SelectTrigger className="w-[110px] shrink-0">
                <SelectValue placeholder="区号" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+65">🇸🇬 +65</SelectItem>
                <SelectItem value="+86">🇨🇳 +86</SelectItem>
                <SelectItem value="+1">🇺🇸 +1</SelectItem>
                <SelectItem value="+852">🇭🇰 +852</SelectItem>
              </SelectContent>
            </Select>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入" className="flex-1" />
          </div>
        </Field>

        <Field label="介绍" required error={errors.introduction}>
          <Textarea
            value={introduction}
            onChange={(e) => {
              setIntroduction(e.target.value)
              if (errors.introduction) setErrors((p) => ({ ...p, introduction: "" }))
            }}
            rows={8}
            placeholder="请输入机构介绍（支持在对话中继续补充完善）"
            showCount
            maxLength={5000}
          />
        </Field>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            提交创建
          </Button>
        </div>
      </form>
    </GenericCard>
  )
}
