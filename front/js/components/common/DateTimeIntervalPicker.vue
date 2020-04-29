<template>
  <div class="form-row">
    <!-- dt -->
    <div class="form-group col-md-5">
      <label>Início</label>
      <app-input-datetime v-model="mDateTimeFrom"></app-input-datetime>
    </div>
    <div class="form-group col-md-5">
      <label>Fim</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input
              type="checkbox"
              v-model="dateTimeToNow"
              v-b-tooltip.hover
              title="Horário atual"
            />
          </div>
        </div>
        <app-input-datetime
          v-if="!dateTimeToNow"
          v-model="mDateTimeTo"
        ></app-input-datetime>
        <input
          type="text"
          class="form-control"
          readonly
          v-if="dateTimeToNow"
          placeholder="momento atual"
        />
      </div>
    </div>
    <div class="form-group col-md-2">
      <label class="d-sm-none d-md-inline-block">&nbsp;</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input
              type="checkbox"
              v-model="refreshAuto"
              v-b-tooltip.hover
              title="Atualizar automaticamente"
            />
          </div>
        </div>
        <input
          type="text"
          class="form-control text-center"
          readonly
          :value="refreshAuto ? refreshTime : '-'"
        />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" @click="timerOnExec">
            <div class="fas fa-sync-alt"></div>
          </button>
        </div>
      </div>
    </div>
    <!-- sub -->
    <div class="form-group col-2">
      <button
        class="btn btn-outline-info w-100"
        @click="onDateChangeClick(-86400)"
      >
        <i class="fas fa-minus"></i> 1d
      </button>
    </div>
    <div class="form-group col-2">
      <button
        class="btn btn-outline-info w-100"
        @click="onDateChangeClick(-14400)"
      >
        <i class="fas fa-minus"></i> 4h
      </button>
    </div>
    <div class="form-group col-2">
      <button
        class="btn btn-outline-info w-100"
        @click="onDateChangeClick(-3600)"
      >
        <i class="fas fa-minus"></i> 1h
      </button>
    </div>
    <!-- add -->
    <div class="form-group col-2">
      <button
        class="btn btn-outline-success w-100"
        @click="onDateChangeClick(3600)"
      >
        <i class="fas fa-plus"></i> 1h
      </button>
    </div>
    <div class="form-group col-2">
      <button
        class="btn btn-outline-success w-100"
        @click="onDateChangeClick(14400)"
      >
        <i class="fas fa-plus"></i> 4h
      </button>
    </div>
    <div class="form-group col-2">
      <button
        class="btn btn-outline-success w-100"
        @click="onDateChangeClick(86400)"
      >
        <i class="fas fa-plus"></i> 1d
      </button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

const REFRESH_TIME = 30;

export default {
  props: {
    dateTimeFrom: {
      type: [String, Date],
      required: false,
    },
    dateTimeTo: {
      type: [String, Date],
      required: false,
    },
  },
  data() {
    let dtFrom = this.dateTimeFrom
      ? moment(this.dateTimeFrom)
      : moment().subtract(1, 'hour');
    dtFrom = dtFrom.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
    let dtTo = this.dateTimeTo
      ? moment(this.dateTimeTo).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
      : null;
    return {
      mDateTimeFrom: dtFrom,
      mDateTimeTo: dtTo,
      dateTimeToNow: !dtTo,
      dateTimeIgnoreWatch: 0,
      refreshAuto: false,
      refreshTime: REFRESH_TIME,
      refreshIntervalId: null,
    };
  },
  watch: {
    dateTimeToNow(value) {
      if (value) {
        this.mDateTimeTo = null;
      } else {
        this.mDateTimeTo = moment().format(
          moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
        );
      }
    },
    dateTimeFrom(value) {
      this.dateTimeIgnoreWatch += 1;
      this.mDateTimeFrom = value;
    },
    dateTimeTo(value) {
      this.dateTimeIgnoreWatch += 1;
      this.mDateTimeTo = value;
    },
    mDateTimeFrom(value) {
      if (this.dateTimeIgnoreWatch <= 0) {
        this.emitChanges();
      } else {
        this.dateTimeIgnoreWatch -= 1;
      }
    },
    mDateTimeTo(value) {
      if (this.dateTimeIgnoreWatch <= 0) {
        this.emitChanges();
      } else {
        this.dateTimeIgnoreWatch -= 1;
      }
    },
    refreshAuto(value) {
      if (value) {
        this.dateTimeToNow = true;
        this.timerStart();
      } else {
        this.timerStop();
      }
    },
  },
  methods: {
    emitChanges() {
      this.$emit('input', {
        dateTimeFrom: this.mDateTimeFrom,
        dateTimeTo: this.dateTimeToNow ? null : this.mDateTimeTo,
      });
    },
    timerStart() {
      this.timerStop();
      this.refreshTime = REFRESH_TIME;
      this.refreshIntervalId = setInterval(() => {
        this.timerHandleInterval();
      }, 1000);
    },
    timerHandleInterval() {
      this.refreshTime -= 1;
      if (this.refreshTime <= 0) {
        this.timerOnExec();
      }
    },
    timerStop() {
      if (this.refreshIntervalId) {
        clearInterval(this.refreshIntervalId);
      }
      this.refreshIntervalId = null;
    },
    timerOnExec() {
      this.refreshTime = REFRESH_TIME;
      this.$emit('refresh_exec', {
        dateTimeFrom: this.mDateTimeFrom,
        dateTimeTo: this.dateTimeToNow ? null : this.mDateTimeTo,
      });
    },
    onDateChangeClick(secs) {
      // from
      let dt = isNaN(Date.parse(this.mDateTimeFrom))
        ? new Date()
        : this.mDateTimeFrom;
      dt = moment(dt);
      dt.add(secs, 'seconds');
      this.dateTimeIgnoreWatch = 1;
      this.mDateTimeFrom = dt.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
      // to
      if (!this.dateTimeToNow) {
        dt = isNaN(Date.parse(this.mDateTimeTo))
          ? new Date()
          : this.mDateTimeTo;
        dt = moment(dt);
        dt.add(secs, 'seconds');
        this.dateTimeIgnoreWatch += 1;
        this.mDateTimeTo = dt.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
      }
      this.emitChanges();
      this.timerOnExec();
    },
  },
};
</script>
