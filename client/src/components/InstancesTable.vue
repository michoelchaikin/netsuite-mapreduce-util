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

      <template v-slot:expanded-item="{ item, headers: instancesHeaders }">
        <td :colspan="instancesHeaders.length" style="padding: 0;">
          <v-data-table
            :headers="instancesHeaders"
            :items="item.stages"
            item-key="stage"
            hide-default-header
            hide-default-footer
            style="border-radius: 0;"
          >
            <template v-slot:item="{ item: stage }">
              <tr>
                <td
                  :width="instancesHeaders[0].width"
                  style="padding-left: 100px;"
                >
                  {{ stage.stage }}
                </td>
                <td :width="instancesHeaders[1].width">
                  {{ stage.startDate | formatDate }}
                </td>
                <td :width="instancesHeaders[2].width">
                  {{ stage.endDate | formatDate }}
                </td>
                <td :width="instancesHeaders[3].width">
                  {{ stage.status }}
                </td>
                <td :width="instancesHeaders[4].width">
                  {{ stage.percentComplete }}
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
