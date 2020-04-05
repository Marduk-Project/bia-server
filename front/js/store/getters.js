export const getUser = state => {
  return state.user;
}

export const getUserName = state => {
  if (state.user) {
    return state.user.name;
  }
  return '...';
}

export const getUserId = state => {
  if (state.user) {
    return state.user.id;
  }
  return '...';
}

export const getUserNickname = state => {
  if (state.user) {
    return state.user.nickname;
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

export const isLoading = state => {
  return state.loading > 0;
}
