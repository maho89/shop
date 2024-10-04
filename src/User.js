import {ref} from "vue";

export default {
  install(app) {
    let lu = true;
    localStorage.getItem('user');
    let user = ref(false);
    if (lu) user.value = JSON.parse(lu);
    app.config.globalProperties.$user = user;
    app.provide('$user', user)
  }
};
