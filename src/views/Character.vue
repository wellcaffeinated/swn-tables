<template lang="pug">
.character
  .section
    .container
      .columns
        .column.is-one-third
          .box
            b-tabs(:animated="false", expanded)
              b-tab-item(label="Overview")
                .content
                  p.image.character-image
                    img(:src="character.image")
                  h4.is-size-6.heading {{ character.name }}
                  table.table.character-overview
                    tr
                      td Level
                      td
                        b-input(type="number", size="is-small", min="1", v-model.number="character.level")
                    tr
                      td HP
                      td
                        b-slider(
                          v-model="character.hp",
                          indicator,
                          :tooltip="false",
                          :max="totalHP",
                          type="is-success"
                        )
                          b-slider-tick(:value="0") 0
                          b-slider-tick(:value="character.maxHP") max
                          b-slider-tick(v-if="character.bonusHP", :value="totalHP") bonus
                    tr
                      td Bonus HP
                      td
                        b-input(type="number", min="0", size="is-small", v-model.number="character.bonusHP")
                        //- b-progress(
                        //-   :value="character.hp",
                        //-   :max="character.maxHP",
                        //-   type="is-success"
                        //- )
                  b-field(grouped, group-multiline)
                    .control
                      b-taglist(attached)
                        b-tag(type="is-dark", size="is-medium") AC
                        b-tag(type="is-success", size="is-medium") {{ characterAC }}
                    .control
                      b-taglist(attached)
                        b-tag(type="is-dark", size="is-medium") AB
                        b-tag(type="is-danger", size="is-medium") {{ characterAB }}
              b-tab-item(label="Bio")
                table.table
                  tbody
                    tr
                      td Name
                      td
                        b-input(size="is-small", v-model="character.name")
                    tr
                      td Gender
                      td
                        b-input(size="is-small", v-model="character.gender")
                    tr
                      td Class
                      td
                        b-input(size="is-small", v-model="character.class")
                    tr
                      td Background
                      td
                        b-input(size="is-small", v-model="character.background")
                    tr
                      td Homeworld
                      td
                        b-input(size="is-small", v-model="character.homeworld")
                    tr
                      td Faction
                      td
                        b-input(size="is-small", v-model="character.faction")
              b-tab-item(label="Stats")
                table.table
                  tbody
                    tr
                      td Max HP
                      td
                        b-input(type="number", size="is-small", min="0", v-model.number="character.maxHP")
                table.table
                  thead
                    tr
                      th Attribute
                      th Value
                      th Adj
                      th Mod
                  tbody
                    tr.attribute(v-for="attr in Attributes")
                      td {{ attr }}
                      td
                        b-input.attr-value(type="number", size="is-small", min="0", max="18", v-model.number="character.attributes[attr]")
                      td
                        b-input.attr-adj(type="number", size="is-small", v-model.number="character.attributeAdjustments[attr]")
                      td
                        .result {{ attributeMods[attr] }}

        .column
          .box
            h4.heading saving throws
            b-field(grouped, group-multiline)
              .control.clickable(@click="rollSave('mental')")
                b-taglist(attached)
                  b-tag(type="is-dark", size="is-large") mental
                  b-tag(type="is-primary", size="is-large") {{ savingThrows.mental }}
              .control.clickable(@click="rollSave('physical')")
                b-taglist(attached)
                  b-tag(type="is-dark", size="is-large") physical
                  b-tag(type="is-primary", size="is-large") {{  savingThrows.physical }}
              .control.clickable(@click="rollSave('evasion')")
                b-taglist(attached)
                  b-tag(type="is-dark", size="is-large") evasion
                  b-tag(type="is-primary", size="is-large") {{  savingThrows.evasion }}
          .columns
            .column.is-half
              .box
                table.table
                  thead
                    tr
                      th Skill
                      th Attr
                      th Level
                  tbody
                    tr.attribute(v-for="skill in Skills")
                      td
                        b-button(size="is-small", @click="rollSkill(skill)") {{ skill }}
                      td
                        b-select.skill-attr(type="number", size="is-small", v-model="character.skillAttrs[skill]")
                          option(v-for="attr in Attributes", :key="attr", :value="attr") {{ attr }}
                      td
                        b-input.skill-value(type="number", size="is-small", min="-1", max="4", v-model.number="character.skills[skill]")

            .column.is-half
              RollBox(ref="rollbox")

</template>

<style lang="sass" scoped>
.clickable
  cursor: pointer
  &:active
    box-shadow: 0 0 3px $primary
.scroll
  overflow: auto
  border: 1px solid $grey-light
.character-image
  max-width: 320px
  border-radius: 5px
  overflow: hidden
.character-overview
  td
    font-size: 16px
  td:first-child
    width: 2em
::v-deep .field
  display: flex
  align-items: center
.table
  width: 100%
  font-size: 14px
  td
    vertical-align: middle
.attribute
  .attr-value,
  .attr-adj
    min-width: 4em
</style>

<script>
import axios from 'axios'
import RollBox from '@/components/RollBox'
import _sortedLastIndex from 'lodash/sortedLastIndex'
import _mapValues from 'lodash/mapValues'

const modifier = m => m >= 0 ? `+${m}` : `${m}`

const Attributes = [
  'Strength'
  , 'Dexterity'
  , 'Constitution'
  , 'Intelligence'
  , 'Wisdom'
  , 'Charisma'
]

const Skills = [
  'Administer'
  , 'Connect'
  , 'Exert'
  , 'Fix'
  , 'Heal'
  , 'Know'
  , 'Lead'
  , 'Notice'
  , 'Perform'
  , 'Pilot'
  , 'Program'
  , 'Punch'
  , 'Shoot'
  , 'Sneak'
  , 'Stab'
  , 'Survive'
  , 'Talk'
  , 'Trade'
  , 'Work'
]

const defaultSkillAttrs = {
  Administer: 'Intelligence'
  , Connect: 'Intelligence'
  , Exert: 'Strength'
  , Fix: 'Intelligence'
  , Heal: 'Intelligence'
  , Know: 'Intelligence'
  , Lead: 'Charisma'
  , Notice: 'Wisdom'
  , Perform: 'Charisma'
  , Pilot: 'Intelligence'
  , Program: 'Intelligence'
  , Punch: 'Strength'
  , Shoot: 'Dexterity'
  , Sneak: 'Dexterity'
  , Stab: 'Dexterity'
  , Survive: 'Intelligence'
  , Talk: 'Charisma'
  , Trade: 'Charisma'
  , Work: 'Dexterity'
}

function attributeMod(v){
  const scores = [0, 4, 8, 14, 18]
  return _sortedLastIndex(scores, v) - 3
}

export default {
  name: 'Character'
  , components: {
    RollBox
  }
  , data: () => ({
    Attributes
    , Skills
    , character: {
      name: 'John Smith'
      , gender: 'Male'
      , image: 'https://cyberpunk.city/uploads/default/original/2X/a/a97f691066122be1ca5fcb03812a21e4241ab030.jpeg'
      , class: 'Adventurer (Warrior + Expert)'
      , background: 'Official'
      , homeworld: 'Artanis V'
      , faction: 'N/A'
      , level: 1
      , hp: 6
      , maxHP: 8
      , bonusHP: 0
      , attributes: {
        Strength: 14
        , Dexterity: 12
        , Constitution: 11
        , Intelligence: 10
        , Wisdom: 9
        , Charisma: 7
      }
      , attributeAdjustments: {
        Strength: 0
        , Dexterity: 0
        , Constitution: 0
        , Intelligence: 0
        , Wisdom: 0
        , Charisma: 0
      }
      , skills: {
        Administer: -1
        , Connect: -1
        , Exert: -1
        , Fix: -1
        , Heal: -1
        , Know: -1
        , Lead: -1
        , Notice: -1
        , Perform: -1
        , Pilot: -1
        , Program: -1
        , Punch: -1
        , Shoot: -1
        , Sneak: -1
        , Stab: -1
        , Survive: -1
        , Talk: -1
        , Trade: -1
        , Work: -1
      }
      , skillAttrs: defaultSkillAttrs
    }
  })
  , mounted(){
  }
  , computed: {
    attributeMods(){
      return _mapValues(this.character.attributes, (v, attr) => {
        return attributeMod(v) + this.character.attributeAdjustments[attr]
      })
    }
    , characterAC(){
      return 15
    }
    , characterAB(){
      return 1
    }
    , totalHP(){
      return (this.character.maxHP + this.character.bonusHP) | 0
    }
    , savingThrows(){
      return {
        mental: 15
        , physical: 15
        , evasion: 15
      }
    }
  }
  , methods: {
    attributeMod
    , rollSave(type){
      const name = `${type} saving throw`
      this.$refs.rollbox.roll('d20', name, '>=' + this.savingThrows[type])
    }
    , rollSkill(type){
      const skillAttr = this.character.skillAttrs[type]
      const attr = this.attributeMods[skillAttr]
      const expr = '2d6' + modifier(this.character.skills[type]) + modifier(attr)
      this.$refs.rollbox.roll(expr, `${type} + ${skillAttr}`)
    }
  }
}
</script>
