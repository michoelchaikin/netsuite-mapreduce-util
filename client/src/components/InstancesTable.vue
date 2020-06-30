<template>
  <v-card>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>Instances</v-toolbar-title>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="instances"
      item-key="taskId"
      :options.sync="options"
      :expanded.sync="expanded"
      show-expand
      single-expand
      height="30vh"
      fixed-header
      disable-pagination
      hide-default-footer
    >
      <template v-slot:item.dateCreated="{ item }">
        <td>{{ item.dateCreated | formatDate }}</td>
      </template>
      <template v-slot:item.startDate="{ item }">
        {{ item.startDate | formatDate }}
      </template>
      <template v-slot:item.endDate="{ item }">
        {{ item.endDate | formatDate }}
      </template>
      <template v-slot:item.percentComplete="{ item }">
        {{ item.percentComplete }}%
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="padding:0">
          <v-data-table
            :headers="headers"
            :items="item.stages"
            item-key="stage"
            hide-default-header
            hide-default-footer
            style="border-radius:0"
          >
            <template v-slot:item="{ item, headers }">
              <tr>
                <td :width="headers[0].width" style="padding-left:100px">
                  {{ item.stage }}
                </td>
                <td :width="headers[1].width">
                  {{ item.startDate | formatDate }}
                </td>
                <td :width="headers[2].width">
                  {{ item.endDate | formatDate }}
                </td>
                <td :width="headers[3].width">
                  {{ item.status }}
                </td>
                <td :width="headers[4].width">
                  {{ item.percentComplete }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'InstancesTable',

  props: {
    instances: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      headers: [
        { text: 'Date Created', value: 'dateCreated', width: '19%' },
        { text: 'Date Started', value: 'startDate', width: '19%' },
        { text: 'Date Finished', value: 'endDate', width: '19%' },
        { text: 'Status', value: 'status', width: '19%' },
        { text: 'Percent Complete', value: 'percentComplete', width: '19%' },
      ],
      expanded: [],
      options: {
        sortBy: ['dateCreated'],
        sortDesc: [true],
      },
    };
  },
});
</script>
