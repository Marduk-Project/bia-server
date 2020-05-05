<template>
  <div class="">
    <div class="form-row">
      <div class="form-group col-12">
        <label>Pesquisar</label>
        <input
          type="text"
          class="form-control"
          placeholder="digite o nome do produto que está procurando."
          v-model="searchText"
        />
      </div>
      <div class="form-group col-12">
        <div class="form-check">
          <label
            class="form-check-label"
            :class="{ 'text-info': filters.withQuantity }"
            v-b-tooltip.hover
            title="Exibir "
          >
            <input
              class="form-check-input"
              type="checkbox"
              value="1"
              v-model="filters.withQuantity"
            />
            Exibir apenas itens com quantidade preenchida.
          </label>
        </div>
      </div>
    </div>
    <div class="text-center">
      <small class="text-muted"
        >Exibindo {{ this.productFilteredList.length }} produto(s).</small
      >
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th style="width: 60%;">Item</th>
            <th style="width: 15%;" class="text-right">Quantidade</th>
            <th style="width: 15%;">Unidade</th>
            <th style="width: 10%;" class="app-table-actions"
              >A. <app-info title="Ações"></app-info
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="productData in productFilteredList"
            :key="productData.glProductId"
            :class="{ 'table-info': productData.quantity > 0 }"
          >
            <td
              v-b-tooltip.hover
              :title="productData.description"
              style="word-wrap: break-word;"
              >{{ productData.name }}</td
            >
            <td class="text-right">
              <input
                v-model="productData.quantity"
                type="number"
                :min="0"
                class="form-control text-right"
                @input="onInputQuantity(productData)"
                @change="onChangeQuantity(productData)"
              />
            </td>
            <td>
              {{ productData.unit.name }}
            </td>
            <td class="app-table-actions">
              <i
                class="app-table-action fas fa-comment"
                v-b-tooltip.hover
                :title="
                  productData.notes
                    ? productData.notes
                    : 'Adicionar comentários'
                "
                :class="{
                  'text-info cursor-pointer': productData.notes,
                  'text-muted cursor-pointer':
                    !productData.notes && productData.quantity > 0,
                  'app-table-action-disabled': productData.quantity <= 0,
                }"
                @click="onProductCommentClick(productData)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { API as ProductAPI } from '@resources/gl_product/product_api';
  import { apiMixin } from '@mixins/api-mixin';
  import { mapActions, mapState } from 'vuex';

  export default {
    mixins: [apiMixin],
    props: {
      entity: {
        type: Object,
        default: () => {
          return {
            notes: '',
            items: [],
          };
        },
      },
    },
    data() {
      return {
        searchText: '',
        filters: {
          withQuantity: false,
        },
        productList: [],
        productDataList: [],
      };
    },
    computed: {
      productFilteredList() {
        if (!this.searchText && !this.filters.withQuantity) {
          return this.productDataList;
        }
        return this.productDataList.filter(productData => {
          if (this.searchText) {
            if (
              !productData.name
                .toLowerCase()
                .includes(this.searchText.toLowerCase())
            ) {
              return false;
            }
          }
          if (this.filters.withQuantity) {
            if (productData.quantity <= 0) {
              return false;
            }
          }
          return true;
        });
      },
    },
    methods: {
      onProductCommentClick(productData) {
        if (productData.quantity <= 0) {
          return;
        }
        productData.notes = prompt(
          'Observações sobre o item',
          productData.notes
        );
      },
      updateProductData(productList) {
        if (!productList) {
          productList = this.productList;
        } else {
          this.productList = productList;
        }
        this.productDataList = productList.map(product => {
          const productData = {};
          productData.glProductId = product.id;
          productData.glProduct = product;
          productData.glUnitId = product.unit.id;
          productData.name = product.name;
          productData.unit = product.unit;
          productData.notes = '';
          productData.quantity = 0;
          const itemData = this.entity.items.find(item => {
            return (
              item.glProductId == product.id &&
              item.glProduct.unitId == item.glUnitId
            );
          });
          if (itemData) {
            productData.id = itemData.id;
            productData.quantity = itemData.quantity;
            productData.notes = itemData.notes;
          }
          return productData;
        });
      },
      async requestList() {
        try {
          this.api_loadingShow();
          const api = new ProductAPI();
          const response = await api.requestList(-1, null, {
            requestFormActive: 1,
          });
          await this.api_thenDoneExec(true);
          this.updateProductData(response.data);
        } catch (err) {
          await this.api_catchExec(err);
        }
      },
      onInputQuantity(productData) {
        this.$emit('input', {
          items: this.productDataList.filter(item => item.quantity > 0),
        });
      },
      onChangeQuantity(productData) {
        if (productData.quantity <= 0) {
          productData.quantity = 0;
        }
      },
    },
    beforeMount() {
      this.requestList();
    },
  };
</script>

<style scoped></style>
