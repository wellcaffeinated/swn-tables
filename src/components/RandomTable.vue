<template lang="pug">
a.box(@click="roll()")
  h6.title {{title}}
  .content(v-if="result.html", v-html="result.html")
  .content(v-else) Click to Roll
</template>

<style lang="sass" scoped>

</style>

<script>
import { evaluateRandomTableExpression } from '@/lib/tables'

export default {
  name: 'RandomTable'
  , props: {
    title: String
    , spec: Object
    , rollTarget: String
  }
  , components: {
  }
  , data: () => ({
    result: {}
  })
  , methods: {
    roll(){
      this.result = evaluateRandomTableExpression(this.rollTarget, this.spec)
    }
  }
}
</script>
