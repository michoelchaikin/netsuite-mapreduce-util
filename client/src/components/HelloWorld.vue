<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to create-spa-netsuite (Vue)
        </h1>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Vue netsuite
          <br />please join our online
          <a href="" target="_blank">Slack Community</a>
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">
          {{user.id}}
        </h2>
        <h2 class="headline font-weight-bold mb-3">
          {{user.email}}
        </h2>
        <h2 class="headline font-weight-bold mb-3">
          {{user.name}}
        </h2>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { REST } from "../utils"

export default Vue.extend({
  name: "HelloWorld",

  data: () => ({
    user: {},
  }),
  mounted() {
    REST.get({
      action: "getCurrentUser",
      errorPolicy: "none",
    }).then((t: any) => {
      this.user = t
    })
  },
})
</script>
