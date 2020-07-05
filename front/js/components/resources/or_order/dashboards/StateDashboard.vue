<template>
  <div id="my-body">
    <div class="container-fluid">
      <br />
      <h1>Dashboard</h1>
      <div class="row" v-if="stateData">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <strong>Entidades cadastradas por TIPO</strong>
            </div>
            <div class="card-body">
              <app-horizontalbar-chart
                style="height: 400px;"
                :chart-data="personByTypeChartData"
                :height="400"
                :options="{
                  legend: {
                    display: false,
                  },
                }"
              ></app-horizontalbar-chart>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <strong>Distribuição por REGIÃO</strong>
            </div>
            <div class="card-body">
              <app-pie-chart
                style="height: 400px;"
                :chart-data="personByStateRegionChartData"
                :height="400"
              ></app-pie-chart>
            </div>
          </div>
        </div>
        <div class="col-lg-12 mt-4">
          <div class="card">
            <div class="card-header">
              <strong>Itens PRIORITÁRIOS</strong>&nbsp;&nbsp;<small
                class="text-muted"
                >(em unidades ou litros)</small
              >
            </div>
            <div class="card-body">
              <app-bar-chart
                style="height: 300px;"
                :chart-data="priorityOrderProductsChartData"
                :height="300"
                :options="{
                  legend: {
                    display: false,
                  },
                }"
              ></app-bar-chart>
              <br />
              <br />
              <h4>Listagem de todos os itens solicitados</h4>
              <table class="table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>Produto/Item</th>
                    <th class="text-right">Quantidade solicitada</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="orderProduct in stateData.priorityOrderProducts"
                    :key="orderProduct.productId"
                  >
                    <td>{{ orderProduct.productName }}</td>
                    <td class="text-right">{{
                      orderProduct.requestQuantitySum
                    }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <br />
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import axios from '@mixins/axios-auth';
  import { apiMixin } from '@mixins/api-mixin';
  import HorizontalBarChart from '../../../common/charts/HorizontalBarChart.js';
  import PieChart from '../../../common/charts/PieChart.js';
  import BarChart from '../../../common/charts/BarChart.js';

  const BASE_CHART_COLOR = '#f87979';

  export default {
    mixins: [apiMixin],
    components: {
      'app-horizontalbar-chart': HorizontalBarChart,
      'app-pie-chart': PieChart,
      'app-bar-chart': BarChart,
    },
    data() {
      return {
        stateData: null,
      };
    },
    computed: {
      ...mapGetters({
        isUserStaff: 'isUserStaff',
        isContextAdmin: 'isContextAdmin',
      }),
      personByTypeChartData() {
        if (!this.stateData) {
          return null;
        }
        const list = this.stateData.personsByType.items;
        let data = {
          labels: list.map(item => {
            let name = item.personTypeName
              ? item.personTypeName
              : 'Desconhecido';
            name = `${name} (${parseFloat(item.percentual).toFixed(1)}%)`;
            return name;
          }),
          datasets: [
            {
              backgroundColor: BASE_CHART_COLOR,
              borderColor: BASE_CHART_COLOR,
              data: list.map(item => item.count),
              type: 'horizontalBar',
            },
          ],
        };
        return data;
      },
      personByStateRegionChartData() {
        if (!this.stateData) {
          return null;
        }
        const colors = [
          '#f87979',
          '#ff8888',
          '#ff9090',
          '#ffaaaa',
          '#ffbbbb',
          '#ffcccc',
          '#ffdddd',
          '#ffeeee',
          '#dddddd',
        ];
        const list = this.stateData.personsByStateRegion.items;
        let data = {
          labels: list.map(item => {
            let name = item.stateRegionName
              ? item.stateRegionName
              : 'Desconhecido';
            name = `${name} (${parseFloat(item.percentual).toFixed(1)}%)`;
            return name;
          }),
          type: 'pie',
          datasets: [
            {
              backgroundColor: list.map((item, index) => {
                return colors[index] ? colors[index] : '#dddddd';
              }),
              data: list.map(item => item.count),
            },
          ],
        };
        return data;
      },
      priorityOrderProductsChartData() {
        if (!this.stateData) {
          return null;
        }
        let list = this.stateData.priorityOrderProducts;
        list = list.slice(0, Math.min(list.length, 10));
        let data = {
          labels: list.map(item => item.productName),
          datasets: [
            {
              backgroundColor: BASE_CHART_COLOR,
              borderColor: BASE_CHART_COLOR,
              data: list.map(item => parseInt(item.requestQuantitySum)),
              type: 'bar',
            },
          ],
        };
        return data;
      },
    },
    methods: {
      requestStateData() {
        this.api_loadingShow();
        axios
          .get(
            `api/visitor/or_order_report/state/${this.$route.params.id}/dashboard`
          )
          .then(res => {
            this.api_loadingHide();
            this.stateData = res.data.data;
            console.log(res.data); // TODO retirar
          })
          .catch(this.api_catch());
      },
    },
    mounted() {
      this.requestStateData();
    },
  };
</script>

<style scoped>
  #my-body {
    background: #eeeeee;
  }
</style>
