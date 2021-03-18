<template lang="pug">
.home
  .section
    .container
      h2.title Weapons
      .weapons-table
        b-field(grouped)
          b-field
            b-input(
              v-model="search"
              , placeholder="filter..."
              , @keydown.native.esc="search = ''"
              , icon-right="close-circle"
              , icon-right-clickable
              , @icon-right-click="search = ''"
            )
          b-field
            b-button(@click="resetSorting") Clear Sorting
        b-table(
          ref="table"
          , :data="rows"
          , :sort-multiple="true"
          , detailed
          , detail-key="Name"
          , :opened-detailed="expanded"
          , :sticky-header="true"
          , :height="800"
          , focusable
          , :selected.sync="selected"
        )
          b-table-column(field="Name", label="Name", sortable, v-slot="props")
            | {{ props.row.Name }}
          b-table-column(field="Damage", label="Damage", sortable, v-slot="props")
            | {{ props.row.Damage }}
          b-table-column(field="Tags", label="Tags", sortable, v-slot="props")
            b-tag-list
              template(v-for="tag in props.row.Tags")
                b-tooltip(:label="tagDescs[tag]", multilined)
                  b-tag(type="is-primary") {{ tag | startCase }}
          b-table-column(field="Magazine", label="Magazine", sortable, numeric, v-slot="props")
            | {{ props.row.Magazine }}
          b-table-column(field="Ammo/Power", label="Ammo / Power", sortable, v-slot="props")
            | {{ props.row['Ammo/Power'] }}
          b-table-column(field="Range", label="Range", sortable, numeric, v-slot="props")
            | {{ props.row.Range }}
          b-table-column(field="Max Range", label="Max Range", numeric, sortable, v-slot="props")
            | {{ props.row['Max Range'] }}
          b-table-column(field="Enc", label="Enc", sortable, numeric, v-slot="props")
            | {{ props.row.Enc }}
          b-table-column(field="Attribute", label="Attribute", sortable, v-slot="props")
            | {{ props.row.Attribute }}
          b-table-column(field="Cost", label="Cost", sortable, numeric, v-slot="props")
            | {{ props.row.Cost }}
          b-table-column(field="Tech", label="Tech", sortable, numeric, v-slot="props")
            | {{ props.row.Tech }}
          b-table-column(field="Class", label="Class", sortable, v-slot="props")
            | {{ props.row.Class }}
          template(#detail="props")
            article.details
              .columns
                .column.is-half
                  .content
                    p {{ props.row.Description }}
                .column(v-if="props.row.Notes")
                  b-message(type="is-info", has-icon) {{ props.row.Notes }}
              p Source: {{ props.row.Source }}
</template>

<style lang="sass" scoped>
.weapons-table
  border: 1px solid $grey-light
  border-radius: 3px
  padding: 1rem
  ::v-deep .b-table table:focus
    outline: none
    border: none
  ::v-deep tr
    cursor: pointer
  ::v-deep tr.detail
    background: $ivory
    .details
      font-size: 0.85rem
</style>

<script>
import _filter from 'lodash/filter'
import _some from 'lodash/some'
import { fetchDataTable } from '@/lib/tables'

function fuzzyFilter(arr, str){
  return _filter(arr, o => {
    return _some(Object.values(o), v => v.indexOf(str) > -1)
  })
}

export default {
  name: 'Home'
  , data: () => ({
    search: ''
    , raw: []
    , selected: null
    , tagDescs: {
      long_reload: 'Takes two rounds of effort to reload'
      , burst: 'Can use burst fire. A burst gains +2 to hit and damage and uses up three rounds of ammunition.'
      , suppress: 'Can Suppress. Double the usual ammunition is fired in one round, and every target in front of the weapon that is not under hard cover is automatically hit for half normal damage. A successful Evasion or Luck saving throw eliminates this damage.'
      , nonlethal: 'Does not deal lethal damage if it deals damage at all.'
      , spray_and_pray: 'Can target 3x3 area to hit multiple enemies at -3 chance to hit, consumes 10 ammo.'
    }
  })
  , mounted(){
    fetchDataTable('data/weapons.csv').then(data => {
      this.raw = Object.freeze(data.map(r => {
        const tags = r.Tags.split(',')
        r.Tags = r.Tags ? tags : []
        return r
      }))
    })
  }
  , computed: {
    expanded(){
      if (!this.selected){ return [] }
      return [this.selected.Name]
    }
    , rows(){
      if (this.search){
        return fuzzyFilter(this.raw, this.search)
      }
      return this.raw
    }
  }
  , methods: {
    resetSorting(){
      this.$refs.table.resetMultiSorting()
    }
  }
}
</script>
