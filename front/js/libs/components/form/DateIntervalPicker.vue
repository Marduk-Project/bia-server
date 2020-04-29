<template>
  <div class="input-group">
    <div class="input-group-prepend">
      <div class="input-group-text" v-if="checkboxShow">
        <input
          type="checkbox"
          value="1"
          :checked="value.checked"
          @change="onCheckedClick"
        />
      </div>
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="onSubYearClick"
      >
        <i class="fa fa-angle-double-left"></i>
      </button>
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="onSubMonthClick"
        v-if="value.type == 'month'"
      >
        <i class="fa fa-angle-left"></i>
      </button>
    </div>
    <input
      v-b-tooltip.hover
      :title="helpString"
      class="form-control text-center"
      type="text"
      :value="periodString"
      readonly
    />
    <div class="input-group-append">
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="onAddMonthClick"
        v-if="value.type == 'month'"
      >
        <i class="fa fa-angle-right"></i>
      </button>
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="onAddYearClick"
      >
        <i class="fa fa-angle-double-right"></i>
      </button>
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="onChangeTypeClick"
      >
        <i
          class="fa"
          :class="{
            'fa-search-minus': value.type == 'month',
            'fa-search-plus': value.type == 'year',
          }"
        ></i>
      </button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'

export default {
  props: {
    value: {
      type: Object,
      required: false,
      default: () => {
        return {
          currentDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
          type: 'month',
          checked: true,
        }
      },
    },
    checkboxShow: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    let data = {
      periodString: '-',
      helpString: '-',
    }
    return data
  },
  watch: {
    value(newValue) {
      this.sendInputNotify(false)
    },
  },
  methods: {
    sendInputNotify(notify, changes = {}) {
      if (!this.value) {
        this.periodString = '-'
        this.helpString = '-'
        return
      }
      if (!this.value.currentDate) {
        return
      }
      // check
      let checked = this.value.checked
      if (changes.checkedChange) {
        checked = changes.checked
      }
      // type
      const type = changes.type ? changes.type : this.value.type
      let currentDate = moment(this.value.currentDate)
      if (changes.add && changes.addType) {
        currentDate.add(changes.add, changes.addType)
        checked = true
      }
      // calc
      let startDate = currentDate.clone().startOf(type)
      let endDate = currentDate.clone().endOf(type)
      switch (type) {
        case 'month':
          this.periodString = currentDate.format('MMMM YYYY')
          break

        case 'year':
          this.periodString = currentDate.format('YYYY')
          break
      }
      this.helpString = `${startDate.format('L LTS')} - ${endDate.format(
        'L LTS'
      )}`
      // send
      if (notify) {
        let newValue = {
          type: type,
          currentDate: currentDate.format('YYYY-MM-DDTHH:mm:ss'),
          startDate: startDate.format('YYYY-MM-DDTHH:mm:ss'),
          endDate: endDate.format('YYYY-MM-DDTHH:mm:ss'),
          checked: checked,
        }
        this.$emit('input', newValue)
      }
    },
    onAdd(amount, type) {
      this.sendInputNotify(true, { add: amount, addType: type })
    },
    onAddMonthClick() {
      this.onAdd(1, 'month')
    },
    onSubMonthClick() {
      this.onAdd(-1, 'month')
    },
    onAddYearClick() {
      this.onAdd(1, 'year')
    },
    onSubYearClick() {
      this.onAdd(-1, 'year')
    },
    onChangeTypeClick() {
      if (!this.value) {
        this.sendInputNotify(true, { type: 'month' })
        return
      }
      switch (this.value.type) {
        default:
        case 'month':
          this.sendInputNotify(true, { type: 'year' })
          break

        case 'year':
          this.sendInputNotify(true, { type: 'month' })
          break
      }
    },
    onCheckedClick() {
      this.sendInputNotify(true, {
        checkedChange: true,
        checked: !this.value.checked,
      })
    },
  },
  mounted() {
    setTimeout(() => {
      this.sendInputNotify(false)
    }, 1)
  },
}
</script>

<style scoped></style>
