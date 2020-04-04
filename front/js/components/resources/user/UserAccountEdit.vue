<template>
  <div v-if="entity" class="container">
    <br>
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br>
    <h1>{{ crud_title }}</h1>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-lg-8">
          <label>Nome</label>
          <input class="form-control" name="name" readonly :value="entity.name">
        </div>
        <div class="form-group col-lg-4">
          <label>Apelido</label>
          <input class="form-control" name="nickname" readonly :value="entity.nickname">
        </div>
        <div class="form-group col-lg-4">
          <label>E-mail</label>
          <input class="form-control" name="email" readonly :value="entity.email">
        </div>
        <div class="form-group col-lg-4">
          <label>Intervalo de relatório</label>
          <input
            class="form-control"
            name="report_interval"
            type="number"
            step="1"
            v-model="entity.report_interval"
          >
          <small>Segundos, à partir do momento atual, para buscar dados passados dos relatórios.</small>
        </div>
      </div>
      <br>
      <h4>Regras</h4>
      <div class="form-row">
        <div class="form-group col-lg-12">
          <div class="form-check">
            <label class="form-check-label" :class="{ 'text-danger': entity.inactive }">
              <input class="form-check-input" type="checkbox" value="1" v-model="entity.inactive">
              Inativo / Bloqueado.
            </label>
          </div>
        </div>
      </div>
      <br>
      <h4>Grupos de alertas</h4>
      <div class="form-row">
        <div class="form-group col-lg-9">
          <label>Grupo</label>
          <app-alert-group-select v-model="alertGroupEntity"></app-alert-group-select>
        </div>
        <div class="form-group col-lg-3">
          <label>&nbsp;</label>
          <button
            class="btn btn-outline-success w-100"
            type="button"
            @click="alertGroup_onAddClick"
          >
            <i class="fas fa-plus"></i> Adicionar
          </button>
        </div>
      </div>
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th>Grupo de alerta</th>
            <th class="app-table-actions">
              A.
              <app-info title="Ações"></app-info>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in entity.alert_groups" :key="item._id">
            <td>{{ item.name }}</td>
            <td class="app-table-actions">
              <i
                @click.stop="alertGroup_onDeleteClick(item)"
                class="fas fa-trash text-danger app-table-action cursor-pointer"
                v-b-tooltip.hover
                title="Excluir"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <br>
      <div class="form-row">
        <div class="form-group col-lg-9">
          <label>Grupo</label>
          <app-report-group-select v-model="reportGroupEntity.report_group_id"></app-report-group-select>
        </div>
        <div class="form-group col-lg-3">
          <label>&nbsp;</label>
          <button
            class="btn btn-outline-success w-100"
            type="button"
            @click="reportGroup_onAddClick"
          >
            <i
              class="fas"
              :class="{ 'fa-plus': reportGroupEntity.new, 'fa-check': !reportGroupEntity.new } "
            ></i>
            {{ reportGroupEntity.new ? 'Adicionar' : 'Alterar' }}
          </button>
        </div>
      </div>
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th>Grupo de relatório</th>
            <th class="app-table-actions">
              A.
              <app-info title="Ações"></app-info>
            </th>
          </tr>
        </thead>
        <app-draggable v-model="entity.report_groups" tag="tbody">
          <tr
            style="cursor: pointer"
            v-for="item in entity.report_groups"
            :key="item.mid"
            @click="reportGroup_onItemClick(item)"
            :class="{ 'table-active': reportGroup_isItemSelected(item) }"
          >
            <td>{{ item.report_group_id.name }}</td>
            <td class="app-table-actions">
              <i
                @click.stop="reportGroup_onDeleteClick(item)"
                class="fas fa-trash text-danger app-table-action"
                v-b-tooltip.hover
                title="Excluir"
              ></i>
            </td>
          </tr>
        </app-draggable>
      </table>
      <br>
      <br>
      <div class="form-row">
        <app-crud-buttons
          @onSave="crud_onSaveAction"
          @onDelete="crud_onDeleteAction"
          :delete-show="false"
        ></app-crud-buttons>
      </div>
      <br>
      <app-entitybaseinfo :entity="entity"></app-entitybaseinfo>
    </form>
  </div>
</template>

<script>
import { crudMixin } from "../../../libs/mixins/crud-mixin";
import axios from "../../../libs/mixins/axios-auth";
import _ from "lodash";
import ReportGroupSelect from "../report_group/ReportGroupSelect.vue";
import Draggable from "vuedraggable";
import AlertGroupSelect from "../alert_group/AlertGroupSelect.vue";

export default {
  mixins: [crudMixin],
  components: {
    "app-report-group-select": ReportGroupSelect,
    "app-alert-group-select": AlertGroupSelect,
    "app-draggable": Draggable
  },
  data() {
    return {
      entity: {
        _id: null,
        name: null,
        nickname: null,
        email: null,
        inactive: false,
        report_interval: 0,
        report_groups: []
      },
      reportGroupEntity: this.reportGroup_makeNew(),
      alertGroupEntity: null
    };
  },
  methods: {
    crud_data() {
      return {
        id: this.entity._id,
        inactive: this.entity.inactive ? true : false,
        report_interval: this.entity.report_interval,
        report_groups: this.entity.report_groups.map(el => {
          return {
            mid: el.mid,
            report_group_id: el.report_group_id
              ? el.report_group_id._id
              : undefined
          };
        }),
        alert_groups: this.entity.alert_groups.map(el => el._id)
      };
    },
    reportGroup_onDeleteClick(item) {
      if (confirm("Excluir registro?")) {
        let list = this.entity.report_groups;
        list = list.filter(el => {
          return el.mid != item.mid;
        });
        // clear selected
        this.reportGroupEntity = this.reportGroup_makeNew();
        // upd
        this.$set(this.entity, "report_groups", list);
      }
    },
    reportGroup_onItemClick(item) {
      if (this.reportGroup_isItemSelected(item)) {
        this.reportGroupEntity = this.reportGroup_makeNew();
      } else {
        this.reportGroupEntity = _.cloneDeep(item);
      }
    },
    reportGroup_isItemSelected(item) {
      return (
        this.reportGroupEntity.mid == item.mid && !this.reportGroupEntity.new
      );
    },
    reportGroup_onAddClick() {
      if (!this.reportGroupEntity.report_group_id) {
        this.notify_warning("Selecione um relatório.");
        return;
      }
      let list = this.entity.report_groups;
      // if already exist and not new
      if (this.reportGroupEntity.new) {
        if (
          list.find(el => {
            return (
              el.report_group_id._id ==
              this.reportGroupEntity.report_group_id._id
            );
          })
        ) {
          this.notify_warning("Grupo já vinculado.");
          return;
        }
      }
      const item = {
        mid: this.reportGroupEntity.mid,
        report_group_id: this.reportGroupEntity.report_group_id
      };
      if (this.reportGroupEntity.new) {
        list.push(item);
      } else {
        list = list.map(el => {
          return el.mid == item.mid ? item : el;
        });
      }
      this.$set(this.entity, "report_groups", list);
      this.reportGroupEntity = this.reportGroup_makeNew();
    },
    reportGroup_makeNew() {
      return {
        new: true,
        mid: new Date().getTime(),
        report_group_id: null
      };
    },
    // alerts
    alertGroup_onAddClick() {
      if (!this.alertGroupEntity) {
        this.notify_warning("Selecione um grupo.");
        return;
      }
      let list = this.entity.alert_groups;
      // if already exist and not new
      if (
        list.find(el => {
          return el._id == this.alertGroupEntity._id;
        })
      ) {
        this.notify_warning("Grupo já vinculado.");
        return;
      }
      list.push(this.alertGroupEntity);
      this.$set(this.entity, "alert_groups", list);
      this.alertGroupEntity = null;
    },
    alertGroup_onDeleteClick(item) {
      if (confirm("Excluir registro?")) {
        let list = this.entity.alert_groups;
        list = list.filter(el => {
          return el._id != item._id;
        });
        // upd
        this.$set(this.entity, "alert_groups", list);
      }
    }
  },
  computed: {
    crud_title() {
      var ok = this.entity != null;
      if (ok) {
        ok = this.entity.name;
      }
      if (ok) {
        return "" + this.entity.name;
      } else {
        return "Configurações de usuário";
      }
    },
    crud_url_base() {
      return "/api/account/user";
    },
    crud_route_base() {
      return "user";
    }
  }
};
</script>

<style scoped>
</style>
