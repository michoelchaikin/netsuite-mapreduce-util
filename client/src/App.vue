<template>
  <v-app>
    <v-main>
      <MapReduceUtil />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import MapReduceUtil from './components/MapReduceUtil.vue';

export default Vue.extend({
  name: 'App',

  components: {
    MapReduceUtil,
  },
});
</script>
