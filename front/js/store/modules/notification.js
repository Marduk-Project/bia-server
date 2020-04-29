const _ = require('lodash');
const $ = require('jquery');

import EventBus from '../../bootstrap/event-bus';

const state = {};

const mutations = {};

const notifyHelper = (mobj, type) => {
  var options = {};
  var settings = {
    delay: 1500,
    newest_on_top: true,
    type: type,
    mouse_over: 'pause',
    placement: {
      from: 'top',
      align: 'center',
    },
  };
  if (_.isObject(mobj)) {
    options.message = mobj.message;
    if (mobj.title) {
      options.title = mobj.title;
    }
    if (mobj.icon) {
      options.icon = mobj.icon;
    }
    if (mobj.onClickURL) {
      options.url = mobj.onClickURL;
    }
    if (mobj.onClickTarget) {
      options.target = mobj.onClickTarget;
    }
    if (type == 'warning' || type == 'danger') {
      settings.delay = 60000;
    }
    if (mobj.timer) {
      settings.delay = mobj.timer;
    }
  } else {
    options.message = mobj;
    if (type == 'warning' || type == 'danger') {
      settings.delay = 60000;
    }
    if (type == 'info') {
      settings.delay = 3000;
    }
  }
  // notify
  $.notify(options, settings);
};

const actions = {
  notify(context, mobj) {
    notifyHelper(mobj.message, mobj.type);
  },
  notifyDone(context, mobj) {
    // if (!mobj) {
    //   mobj = {
    //     message: ''
    //   }
    // }
    // mobj.icon = 'fa fa-check fa-5x';
    // notifyHelper(mobj, 'success');
    EventBus.$emit('notify_done');
  },
  notifySuccess(context, mobj) {
    notifyHelper(mobj, 'success');
  },
  notifyInfo(context, mobj) {
    notifyHelper(mobj, 'info');
  },
  notifyWarning(context, mobj) {
    notifyHelper(mobj, 'warning');
  },
  notifyDanger(context, mobj) {
    notifyHelper(mobj, 'danger');
  },
};

const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
