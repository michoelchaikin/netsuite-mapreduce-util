import Vue from "vue"
import axios from "axios"
import App from "./App.vue"
import nsConnect from "./ns-connect-dev"
import vuetify from "./plugin/vuetify"
import "./filters"
import { REST } from './utils'

if (process.env.NODE_ENV === "development") {
  //@ts-ignore
  window.REST = REST
  axios.interceptors.request.use((req) => {
    req.headers.Authorization = nsConnect(req)
    return req
  })
}

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app")
