<template lang="pug">
.item-table
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
    b-field
      b-button(@click="randomFromSelection") Random From Selection
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
      b-taglist
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
    b-table-column(field="Source", label="Source", sortable, v-slot="props")
      | {{ props.row.Source }}
    template(#detail="props")
      article.details
        .columns
          .column.is-half
            .content
              p {{ props.row.Description }}
          .column
            b-message(v-if="props.row.Notes", type="is-info", has-icon) {{ props.row.Notes }}
            .content.tag-notes(v-if="props.row.Tags.length")
              strong Tags
              ul
                li(v-for="tag in props.row.Tags")
                  b-tag(type="is-primary") {{ tag | startCase }}
                  span &nbsp;{{ tagDescs[tag] }}
        p Source: {{ props.row.Source }}
</template>

<style lang="sass" scoped>
.item-table
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
import Fuse from 'fuse.js'
import _sortBy from 'lodash/sortBy'
import _throttle from 'lodash/throttle'
import _sample from 'lodash/sample'
import _filter from 'lodash/filter'
import { fetchDataTable } from '@/lib/tables'

export default {
  name: 'WeaponsTable'
  , props: {
    fuzzySearchKeys: {
      type: Array
    }
  }
  , data: () => ({
    search: ''
    , searchCommit: ''
    , raw: []
    , selected: null
    , tagDescs: {
      long_reload: 'Takes two rounds of effort to reload'
      , burst: 'Can use burst fire. A burst gains +2 to hit and damage and uses up three rounds of ammunition.'
      , suppress: 'Can Suppress. Double the usual ammunition is fired in one round, and every target in front of the weapon that is not under hard cover is automatically hit for half normal damage. A successful Evasion or Luck saving throw eliminates this damage.'
      , nonlethal: 'Does not deal lethal damage if it deals damage at all.'
      , spray_and_pray: 'Can target 3x3 area to hit multiple enemies at -3 chance to hit, consumes 10 ammo.'
      , ap1: 'Armor Piercing. Decreases target’s AC by 1.'
    }
  })
  , mounted(){
    fetchDataTable('data/weapons.csv').then(data => {
      this.raw = Object.freeze(_sortBy(data, ['Tech', 'Class']).map(r => {
        const tags = r.Tags.replace(/\s/g, '').split(',')
        r.Tags = r.Tags ? tags : []
        return r
      }))
    })
  }
  , watch: {
    search: _throttle(function(v){
      this.searchCommit = v
    }, 500)
  }
  , computed: {
    expanded(){
      if (!this.selected){ return [] }
      return [this.selected.Name]
    }
    , rows(){
      if (this.searchCommit){
        let search = this.searchCommit.split(' ')
        const filters = search.filter(s => s.indexOf(':') > -1).reduce((o, f) => {
          const [key, val] = f.split(':')
          o[key] = val
          return o
        }, {})
        search = search.filter(s => s.indexOf(':') === -1).join(' ')
        let rawResults = this.raw
        if (search){
          rawResults = this.fuse.search(search).map(a => a.item)
        }
        return _filter(rawResults, filters)
      }
      return this.raw
    }
    , fuse(){
      return new Fuse(this.raw, {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        keys: this.fuzzySearchKeys || Object.keys(this.raw[0])
      })
    }
  }
  , methods: {
    resetSorting(){
      this.$refs.table.resetMultiSorting()
    }
    , randomFromSelection(){
      this.selected = _sample(this.rows)
      this.$nextTick(() => {
        this.$refs.table.$el.querySelector('.detail').scrollIntoView({ block: 'center' })
      })
    }
  }
}
</script>
