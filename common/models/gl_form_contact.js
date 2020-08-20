// type
const TYPE_CONTACT = 'contact';
const TYPE_ENTITY = 'entity';
const TYPE_SUPPLY = 'supply';

exports.TYPE_CONTACT = TYPE_CONTACT;
exports.TYPE_ENTITY = TYPE_ENTITY;
exports.TYPE_SUPPLY = TYPE_SUPPLY;
exports.TYPE_ALL = [TYPE_CONTACT, TYPE_ENTITY, TYPE_SUPPLY];

const typeToString = value => {
  switch (value) {
    case TYPE_CONTACT:
      return 'Contato e/ou dúvidas';

    case TYPE_ENTITY:
      return 'Cadastro de Entidade';

    case TYPE_SUPPLY:
      return 'Ajuda e/ou doação';
  }
  return 'Desconhecido';
};
exports.typeToString = typeToString;
