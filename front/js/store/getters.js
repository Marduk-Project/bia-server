import constants from '../../../common/constants';

export const getUser = state => {
  return state.user;
};

export const getPersonContactList = state => {
  return state.personContactList ? state.personContactList : [];
};

export const getUserName = state => {
  if (state.user) {
    return state.user.name;
  }
  return '...';
};

export const getUserId = state => {
  if (state.user) {
    return state.user.id;
  }
  return '...';
};

export const getUserNickname = state => {
  if (state.user) {
    return state.user.nickname;
  }
  return '...';
};

// === user

export const isUserAdmin = state => {
  if (state.user) {
    return state.user.level <= 1;
  }
  return false;
};

export const isUserStaff = state => {
  if (state.user) {
    return state.user.level <= 5;
  }
  return false;
};

export const isUserAccount = state => {
  if (state.user) {
    return state.user.level <= 10;
  }
  return false;
};

export const isLoading = state => {
  return state.loading > 0;
};

// === context

export const isContextAdmin = state => {
  return state.context == constants.CONTEXT_ADMIN;
};

export const isContextAccount = state => {
  return state.context == constants.CONTEXT_ACCOUNT;
};

export const isContextVisitor = state => {
  return state.context == constants.CONTEXT_VISITOR;
};
