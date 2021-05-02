<template lang="pug">
.home
  .section
    .container
      b-message(type="is-info") This is a work in progress. If you have any problems/suggestions please comment over at <a href="https://github.com/wellcaffeinated/swn-tables/issues">github issues</a>.
      .columns
        .column
          RandomTable(title="Random Artifact", :spec="itemsTableSpec", roll-target="#artifact")
          RandomTable(title="Random Person", :spec="personTableSpec", roll-target="#person")
          RandomTable(title="Random NPC", :spec="npcTableSpec", roll-target="#npc")
          RandomTable(title="Random Patron", :spec="patronTableSpec", roll-target="#patron")
          RandomTable(title="Random Beast", :spec="beastTableSpec", roll-target="#beast")
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
import RandomTable from '@/components/RandomTable'
import RollBox from '@/components/RollBox'
import { evaluateRandomTableExpression } from '@/lib/tables'
import axios from 'axios'

export default {
  name: 'Home'
  , components: {
    WeaponsTable
    , RollBox
    , RandomTable
  }
  , data: () => ({
    itemsTableSpec: {}
    , npcTableSpec: {}
    , personTableSpec: {}
    , patronTableSpec: {}
    , beastTableSpec: {}
  })
  , mounted(){
    axios('data/random-tables/random-artifacts.json').then(res => {
      this.itemsTableSpec = res.data
    })
    axios('data/random-tables/random-npc.json').then(res => {
      this.npcTableSpec = res.data
    })
    axios('data/random-tables/random-person.json').then(res => {
      this.personTableSpec = res.data
    })
    axios('data/random-tables/random-patron.json').then(res => {
      this.patronTableSpec = res.data
    })
    axios('data/random-tables/random-beast.json').then(res => {
      this.beastTableSpec = res.data
    })
  }
  , computed: {
  }
  , methods: {
  }
}
</script>
