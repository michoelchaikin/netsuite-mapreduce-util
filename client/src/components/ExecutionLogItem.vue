<template>
  <JsonTree v-if="logDetailIsJSON" :raw="item.detail" />
  <pre v-else>{{ item.detail }}</pre>
</template>

<script lang="ts">
import Vue from 'vue';
import JsonTree from 'vue-json-tree';

export default Vue.extend({
  name: 'ExecutionLogItem',

  components: {
    JsonTree,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    logDetailIsJSON() {
      try {
        JSON.parse(this.item.detail);
        return true;
      } catch {
        return false;
      }
    },
  },
});
</script>
