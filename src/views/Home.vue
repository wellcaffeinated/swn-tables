<template lang="pug">
.home
  .section
    .container
      b-message(type="is-info") This is a work in progress. If you have any problems/suggestions please comment over at <a href="https://github.com/wellcaffeinated/swn-tables/issues">github issues</a>.
      .columns
        .column
          a.box(@click="randomTable()")
            h6.title Random Artifact
            .content(v-html="randomTableText")
        .column
          RollBox
      h2.title Weapons
      WeaponsTable
</template>

<style lang="sass" scoped>
.scroll
  overflow: auto
  border: 1px solid $grey-light
</style>

<script>
import WeaponsTable from '@/components/WeaponsTable'
import RollBox from '@/components/RollBox'
import { evaluateRandomTableExpression } from '@/lib/tables'
import axios from 'axios'

export default {
  name: 'Home'
  , components: {
    WeaponsTable
    , RollBox
  }
  , data: () => ({
    randomTableResult: []
    , itemsTableSpec: {}
  })
  , mounted(){
    axios('data/random-tables/random-artifacts.json').then(res => {
      this.itemsTableSpec = res.data
    })
  }
  , computed: {
    randomTableText(){
      if (!this.randomTableResult.html){ return '(click to roll)' }
      return this.randomTableResult.html
    }
  }
  , methods: {
    randomTable(){
      this.randomTableResult = evaluateRandomTableExpression('#artifact', this.itemsTableSpec)
    }
  }
}
</script>
