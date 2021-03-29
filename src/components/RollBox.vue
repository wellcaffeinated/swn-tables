<template lang="pug">
.rolls.box
  .level
    .level-left
      h6.title Rolling Board
    .level-right
      b-field(grouped)
        b-field
          b-button(@click="roll('d2')") d2
        b-field
          b-button(@click="roll('d6')") d6
        b-field
          b-button(@click="roll('2d6')") 2d6
        b-field
          b-button(@click="roll('d10')") d10
        b-field
          b-button(@click="roll('d20')") d20
  .content.scroll(style="height: 300px", ref="scroll")
      Roll(v-for="h in rollHistory", :roll="h", @click="roll(h.expression)")
  b-field
    b-input(ref="input", placeholder="eg: 1d6+2", v-model="rollExpression", @keydown.native.enter="roll(rollExpression)", @keydown.native.up="historyBack", @keydown.native.down="historyForward")
</template>

<style lang="sass" scoped>
.scroll
  overflow: auto
  border: 1px solid $grey-light
.rolls .content
  padding: 1rem
  .roll
    margin-bottom: 1rem
</style>

<script>
import Roll from './Roll'
import { evaluateRollExpression } from '@/lib/tables'

export default {
  name: 'RollBox'
  , components: {
    Roll
  }
  , data: () => ({
    rollExpression: ''
    , rollHistory: [evaluateRollExpression('2d6-5')]
    , historyBackPosition: 0
  })
  , mounted(){
  }
  , computed: {
  }
  , methods: {
    error(e){
      this.$buefy.toast.open({
        duration: 1000
        , message: e.message
        , position: 'is-top'
        , type: 'is-danger'
      })
    }
    , roll(expression){
      if (!expression){ return }
      try {
        const r = evaluateRollExpression(expression)
        this.rollHistory.push(r)
      } catch (e){
        this.error(e)
      }
      this.rollExpression = ''
      this.historyBackPosition = 0
      this.$nextTick(() => {
        this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight
      })
    }
    , historyBack(){
      this.historyBackPosition = Math.min(this.historyBackPosition + 1, this.rollHistory.length)
      if (this.historyBackPosition > 0){
        this.rollExpression = this.rollHistory[this.rollHistory.length - this.historyBackPosition].expression
      }
      this.cursorEnd()
    }
    , historyForward(){
      this.historyBackPosition = Math.max(this.historyBackPosition - 1, 0)
      if (this.historyBackPosition > 0){
        this.rollExpression = this.rollHistory[this.rollHistory.length - this.historyBackPosition].expression
      } else {
        this.rollExpression = ''
      }
      this.cursorEnd()
    }
    , cursorEnd(){
      const el = this.$refs.input.$el.querySelector('input')
      setTimeout(() => {
        if (typeof el.selectionStart === 'number') {
          el.selectionStart = el.selectionEnd = el.value.length
        } else if (typeof el.createTextRange !== 'undefined') {
          el.focus()
          const range = el.createTextRange()
          range.collapse(false)
          range.select()
        }
      }, 0)
    }
  }
}
</script>
