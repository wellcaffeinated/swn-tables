import axios from 'axios'
import parse from 'csv-parse'
import _random from 'lodash/random'
import _sumBy from 'lodash/sumBy'

export function fetchDataTable(url){
  return axios(url).then(res => {
    return new Promise((resolve, reject) => {
      parse(res.data, {
        columns: true
      }, (err, rows) => {
        if (err){ return reject(err) }
        resolve(rows)
      })
    })
  })
}

function roll(count, dice){
  const rolls = []
  while (count--){
    rolls.push(_random(1, dice))
  }
  return rolls
}

export class UnknownRollExpression extends Error {
  constructor(){
    super('Unknown Roll Expression')
  }
}

const rollExprReg = /^\s*((?<sign>[+-]?)\s*((?<value>\d+)|((?<count>\d+)?d(?<dice>\d+))))(\s*(?<more>[+-]+.*))?\s*$/

export function evaluateRollExpression(expr){
  let result = expr.match(rollExprReg)
  if (!result){ throw new UnknownRollExpression() }

  result = result.groups
  result.count = result.count === undefined ? 1 : result.count

  const sign = result.sign === '-' ? -1 : 1
  let parts = []
  if (result.value){
    parts.push({
      type: 'number'
      , value: parseInt(result.value, 10) * sign
    })
  } else {
    parts = parts.concat(roll(result.count, result.dice).map(value => {
      return {
        type: 'roll'
        , value: value * sign
        , isCrit: value === (result.dice | 0)
        , isFail: value === 1
      }
    }))
  }

  if (result.more){
    parts = parts.concat(evaluateRollExpression(result.more).parts)
  }

  return {
    expression: expr
    , parts
    , total: _sumBy(parts, 'value')
  }
}
