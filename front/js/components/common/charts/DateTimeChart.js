import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
import _ from 'lodash';
import moment from 'moment';

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
        tooltips: {
          callbacks: {
            // label: function (tooltipItem, data) {
            //   var label = data.datasets[tooltipItem.datasetIndex].label || '';
            //   return label;
            // },
            title: function (tooltipItem, data) {
              if (_.isArray(tooltipItem)) {
                tooltipItem = tooltipItem[0];
              }
              const dt =
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                  .x || '';
              return moment(dt).format('L LTS');
            },
          },
        },
        elements: {
          line: {
            tension: 0,
          },
        },
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
                displayFormats: {
                  hour: 'HH',
                  minute: 'HH:mm',
                  second: 'HH:mm:ss',
                  millisecond: 'HH:mm:ss.SSS',
                },
              },
            },
          ],
        },
        maintainAspectRatio: false,
        bezierCurve: false,
      };
      if (this.options) {
        _.merge(options, this.options);
      }
      return options;
    },
  },
  methods: {
    renderTheChart() {
      this.renderChart(this.chartData, this.computedOptions);
    },
  },
  mounted() {
    this.renderTheChart();
  },
};
