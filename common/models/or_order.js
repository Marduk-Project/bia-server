// type
const TYPE_REQUEST = 1;
const TYPE_DELIVERY = 2;
const TYPE_SUPPLY_RESERVE = 3;
const TYPE_SUPPLY_TRANSPORT = 4;
const TYPE_MANUAL_ADJUST = 9;

exports.TYPE_REQUEST = TYPE_REQUEST;
exports.TYPE_DELIVERY = TYPE_DELIVERY;
exports.TYPE_SUPPLY_RESERVE = TYPE_SUPPLY_RESERVE;
exports.TYPE_SUPPLY_TRANSPORT = TYPE_SUPPLY_TRANSPORT;
exports.TYPE_MANUAL_ADJUST = TYPE_MANUAL_ADJUST;
exports.TYPE_ALL = [
  TYPE_REQUEST,
  TYPE_DELIVERY,
  TYPE_SUPPLY_RESERVE,
  TYPE_SUPPLY_TRANSPORT,
  TYPE_MANUAL_ADJUST,
];

const typeToString = value => {
  switch (parseInt(value)) {
    case TYPE_REQUEST:
      return 'Solicitação';

    case TYPE_DELIVERY:
      return 'Entrega';

    case TYPE_SUPPLY_RESERVE:
      return 'Entrega futura';

    case TYPE_SUPPLY_TRANSPORT:
      return 'Em transporte';

    case TYPE_MANUAL_ADJUST:
      return 'Ajuste manual';
  }
  return 'Desconhecido';
};
exports.typeToString = typeToString;

// status
const STATUS_NEW = 1;
const STATUS_REVIEW_REJECTED = 2;
const STATUS_REVIEW_OK = 3;
const STATUS_PROCESSED = 5;
const STATUS_CANCELED = 9;

exports.STATUS_NEW = STATUS_NEW;
exports.STATUS_REVIEW_REJECTED = STATUS_REVIEW_REJECTED;
exports.STATUS_REVIEW_OK = STATUS_REVIEW_OK;
exports.STATUS_PROCESSED = STATUS_PROCESSED;
exports.STATUS_CANCELED = STATUS_CANCELED;
exports.STATUS_ALL = [
  STATUS_NEW,
  STATUS_REVIEW_REJECTED,
  STATUS_REVIEW_OK,
  STATUS_PROCESSED,
  STATUS_CANCELED,
];

const statusToString = value => {
  switch (parseInt(value)) {
    case STATUS_NEW:
      return 'Novo';

    case STATUS_REVIEW_REJECTED:
      return 'Rejeitado';

    case STATUS_REVIEW_OK:
      return 'Revisão OK';

    case STATUS_PROCESSED:
      return 'Processado';

    case STATUS_CANCELED:
      return 'Cancelado';
  }
  return 'Desconhecido';
};
exports.statusToString = statusToString;
