<template>
  <v-card style="margin-top: 20px;">
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>Execution Log</v-toolbar-title>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="logs"
      :options.sync="options"
      :expanded.sync="expanded"
      show-expand
      single-expand
      height="30vh"
      fixed-header
      disable-pagination
      hide-default-footer
    >
      <template v-slot:expanded-item="{ item, headers: logsHeaders }">
        <td :colspan="logsHeaders.length">
          <ExecutionLogItem :item="item" />
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

import ExecutionLogItem from './ExecutionLogItem.vue';

export default Vue.extend({
  name: 'ExecutionLogTable',

  components: {
    ExecutionLogItem,
  },

  props: {
    logs: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      headers: [
        { text: 'Type', value: 'type', width: '10%' },
        { text: 'Date', value: 'date', width: '10%' },
        { text: 'Time', value: 'time', width: '10%' },
        { text: 'Title', value: 'title', width: '20%' },
        { text: 'Details', value: 'detail', width: '50%' },
      ],
      options: {
        sortBy: ['id'],
        sortDesc: [true],
      },
      expanded: [],
    };
  },
});
</script>
