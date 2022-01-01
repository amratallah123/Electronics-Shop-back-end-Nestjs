import {
  FindOperator,
  MoreThan,
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  Between,
  Equal,
  Not,
  In
} from "typeorm"

export function applyTypeOrmOperator(query: string) : FindOperator<string> {
  let [operator, value] = query.replace(')', '').split('(')
  switch (operator) {
    case 'Not':
      return Not(value)
    case 'MoreThan':
      return MoreThan(value)
    case 'MoreThanOrEqual':
      return MoreThanOrEqual(value)
    case 'LessThan':
      return LessThan(value)
    case 'LessThanOrEqual':
      return LessThanOrEqual(value)
    case 'Between':
      const [min, max] = value.split(',')
      return Between(min, max)
    case 'In':
      return In(value.split(','))
    default:
      return Equal(value)
  }
}
