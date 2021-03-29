<template lang="pug">
.home
  .section
    .container
      b-message(type="is-info") This is a work in progress. If you have any problems/suggestions please comment over at <a href="https://github.com/wellcaffeinated/swn-tables/issues">github issues</a>.
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

export default {
  name: 'Home'
  , components: {
    WeaponsTable
    , RollBox
  }
  , data: () => ({
  })
  , mounted(){
  }
  , computed: {
  }
  , methods: {
  }
}
</script>
