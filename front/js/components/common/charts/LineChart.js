import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
import _ from 'lodash'

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    computedOptions() {
      let options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'second',
              },
            },
          ],
        },
        maintainAspectRatio: false,
      }
      if (this.options) {
        _.merge(options, this.options)
      }
      return options
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.computedOptions)
  },
}
