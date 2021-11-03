<template lang="pug">
.roll(:class="{ crit: bigCrit, fail: bigFail }")
  .roll-name(@click="$emit('click')") {{ roll.name ? roll.name + ' ' : ''}}({{ roll.result.expression }})
  b-collapse(:open="false")
    template(#trigger="props")
      .total
        b-icon(:icon="props.open ? 'chevron-down' : 'chevron-right'")
        span(v-if="roll.comparison") {{ compareSuccess ? 'PASS' : 'FAIL' }}
        span(v-else) {{ roll.result.total }}
    .parts
      .part(v-for="part in roll.result.parts", :class="{ ['roll-' + part.type]: true, crit: part.isCrit, fail: part.isFail }")
        span {{ part.value }}
    .comparison(v-if="roll.comparison")
      span {{ roll.comparison }}
</template>

<script>
import _every from 'lodash/every'

export default {
  name: 'Roll'
  , props: {
    roll: Object
  }
  , computed: {
    rollParts(){
      return this.roll.result.parts.filter(a => a.type === 'roll')
    }
    , bigFail(){
      return _every(this.rollParts, a => a.isFail)
    }
    , bigCrit(){
      return _every(this.rollParts, a => a.isCrit)
    }
    , compareSuccess(){
      const matches = (/([<>=]*)\s?(\d+)/).exec(this.roll.comparison)
      const total = this.roll.result.total
      if (!matches){ return false }
      const cmp = parseInt(matches[2], 10)
      if (matches[1] === '>'){ return total > cmp }
      if (matches[1] === '>='){ return total >= cmp }
      if (matches[1] === '<'){ return total < cmp }
      if (matches[1] === '<='){ return total > cmp }
      return false
    }
  }
}
</script>

<style lang="sass" scoped>
$die-size: 1rem
.roll
  display: block
  border-radius: 3px
  margin-bottom: 0.5rem

.roll-name
  display: inline-block
  color: $grey
  border-bottom: 1px solid $grey
  margin-bottom: 0.25rem
  cursor: pointer
  transition: color 0.15s ease
  &:hover,
  &:focus
    color: $blue
  &:active
    color: $grey

.total
  position: relative
  right: 0.3em
  font-size: 1.5rem
  color: $blue
  line-height: 2rem
  margin-bottom: 0.5rem
  .icon
    font-size: 0.85rem
    position: relative
    bottom: 0.2em

.roll.crit .total
  color: $critColor
.roll.fail .total
  color: $failColor
.comparison
  display: flex
  flex-direction: row
  flex-wrap: wrap
  margin-left: 1rem
  margin-top: 0.5rem
.parts
  display: flex
  flex-direction: row
  flex-wrap: wrap
  margin-left: 1rem

  .roll-number,
  .roll-roll
    display: flex
    margin-right: 1rem
    font-size: $die-size

    span
      display: block
      width: 2em
      height: 2em
      line-height: 2em
      margin-right: 0.7em
      text-align: center
      border: 1px solid $grey
      color: darken($grey, 30)
      border-radius: 3px
      box-shadow: 1px 1px 3px transparentize($grey, 0.5)

    &::after
      content: '+'
      color: $grey
      line-height: 2em

    &:last-child::after
      content: none

    &.crit span
      color: $critColor
      border: 1px solid $critColor
      box-shadow: 1px 1px 3px transparentize($critColor, 0.5)
    &.fail span
      color: $failColor
      border: 1px solid $failColor
      box-shadow: 1px 1px 3px transparentize($failColor, 0.5)

  .roll-number span
    border-radius: 50%
    color: $grey-dark
    box-shadow: none

</style>
