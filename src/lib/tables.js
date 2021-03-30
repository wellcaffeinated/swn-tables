import axios from 'axios'
import parse from 'csv-parse'
import _random from 'lodash/random'
import _sumBy from 'lodash/sumBy'
import _isArray from 'lodash/isArray'
import _isString from 'lodash/isString'
import _sampleSize from 'lodash/sampleSize'
import { result } from 'lodash'

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

// Evaluate a roll expression like "2d6+5"
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

const tableIdsReg = /(^|[^#])#(({([A-Za-z\-_]+)})|(([A-Za-z\-_]+)))/g
const tableIdReg = /#(({(?<id1>[A-Za-z\-_]+)})|((?<id2>[A-Za-z\-_]+)))/
const tableExpressionReg = /^(?<before>[^#]+(##)*)?(#(({(?<id1>[A-Za-z\-_]+)})|((?<id2>[A-Za-z\-_]+))))?(?<after>.+)?/

export function evaluateRandomTableExpression(expression, tableSpec) {
  const tree = assembleRandomTableTree(expression, tableSpec)
  const result = evaluateRandomTableTree(tree)
  const html = evaluateRandomTableTreeHTML(tree)
  return {
    tree
    , result
    , html
  }
}

export function evaluateRandomTableTree(tree){
  return tree.reduce((acc, a) => {
    if (_isArray(a.value)){
      return acc + evaluateRandomTableTree(a.value)
    }
    return acc + a.value
  }, '')
}

export function evaluateRandomTableTreeHTML(tree) {
  return tree.reduce((acc, a) => {
    if (_isArray(a.value)) {
      return acc + ['<span class="rollable">', evaluateRandomTableTreeHTML(a.value), '</span>'].join('')
    }
    return acc + a.value
  }, '')
}

export function assembleRandomTableTree(expression, tableSpec){
  if (_isArray(expression)){
    const result = _sampleSize(expression)[0]
    return assembleRandomTableTree(result, tableSpec)
  } else if (!_isString(expression)){
    return ''
  }

  const groups = expression.match(tableExpressionReg).groups
  let tree = []

  if (groups.before){
    tree = [{
      type: 'text'
      , value: groups.before
    }]
  }

  const id = groups.id1 || groups.id2
  if (id){
    const roll = assembleRandomTableTree(tableSpec[id], tableSpec)
    tree.push({
      type: 'roll'
      , id
      , value: roll
    })
  }

  if (groups.after){
    const after = assembleRandomTableTree(groups.after, tableSpec)
    tree = tree.concat(after)
  }

  return tree

  // parse table expression
  // return expression.replace(tableIdsReg, match => {
  //   const g = match.match(tableIdReg).groups
  //   const id = g.id1 || g.id2
  //   const result = evaluateRandomTableExpression(tableSpec[id], tableSpec)
  //   if (match[0] === ' '){
  //     return ' ' + result
  //   }
  //   return result
  // })
}
