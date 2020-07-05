import { HorizontalBar, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
import _ from 'lodash';

export default {
  extends: HorizontalBar,
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
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        maintainAspectRatio: false,
      };
      if (this.options) {
        _.merge(options, this.options);
      }
      return options;
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.computedOptions);
  },
};
