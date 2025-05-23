// /lib/logic/staffingCheck.ts
import { STAFF_RATIO } from '../constants'

type ClassData = {
  class_name: string
  children_count: number
  age_in_months: number
}

type Result = {
  class_name: string
  children_count: number
  age_in_months: number
  required_staff: number
}

export function checkRequiredStaffPerClass(classes: ClassData[]): Result[] {
  return classes.map((cls) => {
    const rule = STAFF_RATIO.find(
      (r) => cls.age_in_months >= r.ageInMonthsMin && cls.age_in_months <= r.ageInMonthsMax
    )
    const ratio = rule ? rule.ratio : 20
    return {
      ...cls,
      required_staff: Math.ceil(cls.children_count / ratio),
    }
  })
}