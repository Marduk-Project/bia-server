<template>
  <div class="container-fluid">
    <div v-if="hasAnyDataToShow">
      <div class="text-center">
        <img src="@front/img/theme/logo-header.png" alt="logo" height="30" />
        <br />
        <br />
        <!-- state data -->
        <div v-if="stateData">
          <h4
            >Dashboard de solicitações do Estado
            <strong>{{ stateData.entity.name }}</strong>
            <button
              type="button"
              class="btn btn-link btn-sm"
              @click="onShareStateClick"
              v-b-tooltip.hover
              title="Compartilhar"
            >
              <i class="fas fa-share-square"></i>
            </button>
          </h4>
        </div>
        <!-- region data -->
        <div v-if="stateRegionData && !cityData">
          <h5
            >Exibindo dados da Região:
            <strong
              v-b-tooltip.hover
              title="Remover filtro"
              style="cursor: pointer;"
              @click="onStateRegionAllClick"
            >
              <i class="fas fa-times-circle text-muted"></i>
              {{ stateRegionData.entity.name }}</strong
            >
          </h5>
        </div>
        <!-- city data -->
        <div v-if="cityData">
          <h5
            >Exibindo dados da Cidade de
            <strong
              v-b-tooltip.hover
              title="Remover filtro"
              style="cursor: pointer;"
              @click="onCityUnselect"
            >
              <i class="fas fa-times-circle text-muted"></i>
              {{ cityData.entity.name }}</strong
            >
            <button
              type="button"
              class="btn btn-link btn-sm"
              @click="onShareCityClick"
              v-b-tooltip.hover
              title="Compartilhar"
            >
              <i class="fas fa-share-square"></i>
            </button>
          </h5>
        </div>
        <br />
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header">
              <strong>Filtrar dados</strong>
            </div>
            <div class="card-body">
              <div class="form-row">
                <div class="form-group col-12">
                  <label>Região do Estado</label>
                  <div class="btn-toolbar">
                    <div class="btn-group">
                      <button
                        type="button"
                        @click="onStateRegionAllClick"
                        class="btn btn-outline-secondary"
                        :class="{ active: !stateRegionIdSelected }"
                      >
                        Todas
                      </button>
                    </div>
                    <div class="btn-group ml-2">
                      <b-form-radio-group
                        v-model="stateRegionIdSelected"
                        :options="stateRegionOptions"
                        @change="onStateRegionChange"
                        buttons
                        button-variant="outline-secondary"
                      ></b-form-radio-group>
                    </div>
                  </div>
                </div>
                <div class="form-group col-12">
                  <label>Cidade</label>
                  <app-city-select
                    v-model="city"
                    @onSelect="onCitySelect"
                    @onUnselect="onCityUnselect"
                    :extraparams="{ stateId: this.$route.params.id }"
                  ></app-city-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 p-2"></div>
        <div
          :class="{
            'col-lg-9': shouldShowPersonsByStateRegionChartData,
            'col-12': !shouldShowPersonsByStateRegionChartData,
          }"
        >
          <div class="card">
            <div class="card-header">
              <strong
                >Entidades cadastradas por TIPO - Total
                {{ persontTotalComputed }}</strong
              >
            </div>
            <div class="card-body">
              <app-horizontalbar-chart
                style="height: 400px;"
                :chart-data="personsByTypeChartData"
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
        <div class="col-lg-3" v-if="shouldShowPersonsByStateRegionChartData">
          <div class="card">
            <div class="card-header">
              <strong>Distribuição por REGIÃO</strong>
            </div>
            <div class="card-body">
              <app-pie-chart
                style="height: 400px;"
                :chart-data="personsByStateRegionChartData"
                :height="400"
              ></app-pie-chart>
            </div>
          </div>
        </div>
        <div class="col-12 p-2"></div>
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header">
              <strong>Itens PRIORITÁRIOS</strong>&nbsp;&nbsp;<small
                class="text-muted"
                >(em unidades ou litros. Mostrando gráfico dos 10 mais
                solicitados)</small
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
                    <th class="text-right">Quantidade solicitada *</th>
                    <th>Unidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="orderProduct in priorityOrderProductsListComputed"
                    :key="orderProduct.productId"
                  >
                    <td>{{ orderProduct.productName }}</td>
                    <td class="text-right">{{
                      parseInt(orderProduct.requestQuantitySum)
                    }}</td>
                    <td>{{ orderProduct.unitName }}</td>
                  </tr>
                </tbody>
              </table>
              <br />
              <div class="text-muted">
                * Caso existam quantidades negativas, isto significa que a soma
                das doações é maior do que as entidades inicialmente pediram.
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 p-2"></div>
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header">
              <strong>Entidades solicitantes e doadoras cadastradas</strong
              >&nbsp;&nbsp;<small class="text-muted"
                >(exibindo entidades que se cadastraram conosco, conforme os
                filtros selecionados)</small
              >
            </div>
            <div class="card-body">
              <div class="form-row">
                <div class="form-group col-12">
                  <label>Pesquisar entidades</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="digite o nome da entidade que procura."
                    v-model="citySearch"
                  />
                </div>
              </div>
              <table class="table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>Entidade</th>
                    <th>Tipo</th>
                    <th>Cidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="person in personListComputed" :key="person.id">
                    <td>{{ person.name }}</td>
                    <td>{{
                      person.personType ? person.personType.name : '-'
                    }}</td>
                    <td>{{ person.city ? person.city.name : '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!hasAnyDataToShow" class="text-center">
      <p class="text-muted">Carregando dados, aguarde...</p>
    </div>
    <br />
    <br />
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import axios from '@mixins/axios-auth';
  import { utilsMixin } from '@mixins/utils-mixin';
  import { apiMixin } from '@mixins/api-mixin';
  import HorizontalBarChart from '../../../common/charts/HorizontalBarChart.js';
  import PieChart from '../../../common/charts/PieChart.js';
  import BarChart from '../../../common/charts/BarChart.js';
  import CitySelect from '@resources/gl_city/CitySelect.vue';
  import { API as CityApi } from '@resources/gl_city/city_api';

  const BASE_CHART_COLOR = '#ff6060';

  export default {
    mixins: [apiMixin, utilsMixin],
    components: {
      'app-horizontalbar-chart': HorizontalBarChart,
      'app-pie-chart': PieChart,
      'app-bar-chart': BarChart,
      'app-city-select': CitySelect,
    },
    data() {
      return {
        stateData: null,
        stateRegionIdSelected: null,
        stateRegionData: null,
        city: null,
        citySearch: null,
        cityData: null,
      };
    },
    computed: {
      ...mapGetters({
        isUserStaff: 'isUserStaff',
        isContextAdmin: 'isContextAdmin',
      }),
      hasAnyDataToShow() {
        return this.stateData || this.stateRegionData || this.cityData;
      },
      persontTotalComputed() {
        if (!this.hasAnyDataToShow) {
          return null;
        }
        let count = [];
        if (this.cityData) {
          count = this.cityData.personsByType.count;
        } else if (this.stateRegionData) {
          count = this.stateRegionData.personsByType.count;
        } else {
          count = this.stateData.personsByType.count;
        }
        return count;
      },
      personsByTypeChartData() {
        if (!this.hasAnyDataToShow) {
          return null;
        }
        let list = [];
        if (this.cityData) {
          list = this.cityData.personsByType.items;
        } else if (this.stateRegionData) {
          list = this.stateRegionData.personsByType.items;
        } else {
          list = this.stateData.personsByType.items;
        }
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
      shouldShowPersonsByStateRegionChartData() {
        if (!this.hasAnyDataToShow) {
          return false;
        }
        if (this.stateRegionData || this.cityData) {
          return false;
        }
        return true;
      },
      personsByStateRegionChartData() {
        if (!this.hasAnyDataToShow) {
          return null;
        }
        const colors = [
          BASE_CHART_COLOR,
          '#ff8888',
          '#ff9090',
          '#ffaaaa',
          '#ffbbbb',
          '#ffcccc',
          '#ffdddd',
          '#ffeeee',
          '#dddddd',
        ];
        let list;
        if (this.cityData) {
          list = this.cityData.personsByStateRegion.items;
        } else if (this.stateRegionData) {
          list = this.stateRegionData.personsByStateRegion.items;
        } else {
          list = this.stateData.personsByStateRegion.items;
        }
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
        if (!this.hasAnyDataToShow) {
          return null;
        }
        let list;
        if (this.cityData) {
          list = this.cityData.priorityOrderProducts;
        } else if (this.stateRegionData) {
          list = this.stateRegionData.priorityOrderProducts;
        } else {
          list = this.stateData.priorityOrderProducts;
        }
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
      priorityOrderProductsListComputed() {
        if (!this.hasAnyDataToShow) {
          return [];
        }
        let list;
        if (this.cityData) {
          list = this.cityData.priorityOrderProducts;
        } else if (this.stateRegionData) {
          list = this.stateRegionData.priorityOrderProducts;
        } else {
          list = this.stateData.priorityOrderProducts;
        }
        return list;
      },
      personListComputed() {
        let list;
        if (this.cityData) {
          list = this.cityData.personList;
        } else if (this.stateRegionData) {
          list = this.stateRegionData.personList;
        } else {
          list = this.stateData.personList;
        }
        if (this.citySearch) {
          list = list.filter(person => {
            if (
              !person.name.toLowerCase().includes(this.citySearch.toLowerCase())
            ) {
              return false;
            }
            return true;
          });
        }
        return list;
      },
      stateRegionOptions() {
        if (!this.stateData) {
          return [];
        }
        return this.stateData.stateRegionList.map(item => {
          return {
            value: item.id,
            text: item.name,
          };
        });
      },
    },
    methods: {
      /**
       * @param {Object} params
       * @param {int=undefined} params.glStateId
       * @param {int=undefined} params.glStateRegionId
       * @param {int=undefined} params.glCityId
       * @param {function<Object>} responseHandler
       */
      requestDashboardData(params, responseHandler) {
        this.api_loadingShow();
        let url = `api/visitor/or_order_report/dashboard?`;
        if (params.glStateId) {
          url += `glStateId=${params.glStateId}`;
        }
        if (params.glStateRegionId) {
          url += `glStateRegionId=${params.glStateRegionId}`;
        }
        if (params.glCityId) {
          url += `glCityId=${params.glCityId}`;
        }
        axios
          .get(url)
          .then(res => {
            this.api_loadingHide();
            responseHandler(res.data.data);
          })
          .catch(this.api_catch());
      },
      onStateRegionAllClick() {
        this.stateRegionIdSelected = null;
        this.stateRegionData = null;
        this.onCityUnselect();
      },
      onStateRegionChange(stateRegionId) {
        if (stateRegionId) {
          this.requestDashboardData(
            { glStateRegionId: stateRegionId },
            data => {
              this.stateRegionData = data;
            }
          );
        }
      },
      onCitySelect(city) {
        this.city = city;
        this.requestDashboardData({ glCityId: city.id }, data => {
          this.cityData = data;
        });
      },
      onCityUnselect() {
        this.city = null;
        this.cityData = null;
      },
      requestFirstDataForCityId(id) {
        this.api_loadingShow();
        const api = new CityApi();
        api
          .requestList(null, null, {
            id: id,
          })
          .then(res => {
            this.api_loadingHide();
            if (res.data.length == 1) {
              this.city = res.data[0];
              this.onCitySelect(this.city);
            } else {
              throw new Error('Cidade não encontrada.');
            }
          })
          .catch(this.api_catch());
      },
      requestFirstStateData() {
        this.requestDashboardData(
          { glStateId: this.$route.params.id },
          data => {
            this.stateData = data;
            this.$store.dispatch(
              'setTitle',
              `Dashboard de solicitações do Estado do ${this.stateData.entity.name}`
            );
          }
        );
      },
      onShareStateClick() {
        this.utils_shareData({
          title: `Dashboard do Estado ${this.stateData.entity.name}`,
          url: `${window.app_url}r/stateDashboard/${this.$route.params.id}`,
        })
          .then(res => {
            if (res.needsFeedback) {
              this.notify_success('Link copiado para área de transferência!');
            }
          })
          .catch(this.api_catch());
      },
      onShareCityClick() {
        this.utils_shareData({
          title: `Dashboard da Cidade de ${this.cityData.entity.name}`,
          url: `${window.app_url}r/cityDashboard/${this.cityData.entity.id}`,
        })
          .then(res => {
            if (res.needsFeedback) {
              this.notify_success('Link copiado para área de transferência!');
            }
          })
          .catch(this.api_catch());
      },
    },
    mounted() {
      this.requestFirstStateData();
      if (this.$route.query.cityId) {
        this.requestFirstDataForCityId(this.$route.query.cityId);
      }
    },
  };
</script>

<style>
  body {
    background: #dddddd !important;
  }
</style>
