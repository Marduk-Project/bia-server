import axios from '../libs/mixins/axios-auth';

var reloadSessionTimestamp = Math.round(new Date().getTime() / 1000);

export const redirectToHome = (context, message) => {
  if (message) {
    context.dispatch('notifyDanger', 'Erro ao buscar sessão: ' + message);
  }
  setTimeout(() => window.location.href = window.app_baseURL + '', 3000); // devolve para a home
}

function checkUser(context, user) {
  let userCurrent = context.getters.getUser;
  if (user == null) {
    return false;
  }
  if (userCurrent == null) {
    return true;
  }
  // changed user
  if (user.id != userCurrent.id) {
    return false;
  }
  return true;
}

function reloadSession(context, ignoreLoading) {
  if (!ignoreLoading) {
    context.commit('setLoading', true);
  }
  // atualiza timestamp do check de sessao
  reloadSessionTimestamp = Math.round(new Date().getTime() / 1000);
  // busca sessao
  axios.get("api/auth/session")
    .then(res => {
      if (!ignoreLoading) {
        context.commit('setLoading', false);
      }
      if (res.data) {
        // status error
        if (res.data.status) {
          if (res.data.status == 400) {
            redirectToHome(context, 'Sessão expirada.');
            return;
          }
        }
        let user = res.data.user;
        let currentUser = context.getters.getUser;
        if (checkUser(context, user)) {
          // salva o status somente se for null
          if (currentUser == null) {
            context.commit('setSession', res.data);
          }
        } else {
          redirectToHome(context, 'Sessão expirada.');
        }
      }
    }).catch(reason => {
      if (!ignoreLoading) {
        context.commit('setLoading', false);
      }
      redirectToHome(context, reason);
    });
}

export const checkReloadSession = (context) => {
  // apenas se estiver logado
  if (!window.app_loggedIn) {
    // console.warn('Session Check Error - User not logged in');
    return;
  }
  if (!window.app_windowActive) {
    // console.log('Session Check - Window not active');
    return;
  }
  let tsNow = Math.floor(new Date().getTime() / 1000);
  // aceita a cada x min
  let secondsCheck = tsNow - reloadSessionTimestamp;
  if ((secondsCheck) > (60 * 5)) {
    console.log('Session Check - Refreshing session...');
    reloadSession(context, true);
  } else {
    // console.log('Session Check - Waiting session check ' + secondsCheck);
  }
}

export const loadSession = (context) => {
  reloadSession(context, false);
}

export const setTitle = (context, titulo) => {
  window.document.title = titulo + ' - ' + window.app_short_name;
}
