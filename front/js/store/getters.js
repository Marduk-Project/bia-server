export const getUser = state => {
  return state.user;
}

export const getAccount = state => {
  return state.account;
}

export const getUserName = state => {
  if (state.user) {
    return state.user.name;
  }
  return '...';
}

export const getUserId = state => {
  if (state.user) {
    return state.user._id;
  }
  return '...';
}

export const getUserNickname = state => {
  if (state.user) {
    return state.user.nickname;
  }
  return '...';
}

export const getUserAccountLevel = state => {
  if (state.account) {
    return state.account.account_level;
  }
  return 20;
}

export const getUserAccountLevelDesc = state => {
  if (state.account) {
    return state.account.account_level_desc;
  }
  return '...';
}

// === user

export const isUserAdmin = state => {
  if (state.user) {
    return state.user.level <= 1;
  }
  return false;
}

export const isUserManager = state => {
  if (state.user) {
    return state.user.level <= 5;
  }
  return false;
}

// === account

export const isUserAccountAdmin = state => {
  if (state.account) {
    return state.account.account_level <= 10;
  }
  return false;
}

export const isUserAccountManager = state => {
  if (state.account) {
    return state.account.account_level <= 15;
  }
  return false;
}

export const isLoading = state => {
  return state.loading > 0;
}
