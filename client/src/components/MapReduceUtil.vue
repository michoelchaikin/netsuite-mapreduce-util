<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-flex xs12 lg10 xl8>
        <v-layout>
          <v-select
            v-model="selectedDeployment"
            :items="deployments"
            item-text="text"
            item-value="value"
            label="Select Deployment"
            return-object
          ></v-select>
          <v-btn
            :disabled="!selectedDeployment"
            :loading="isStartingRun"
            @click="runScript"
          >
            Run
          </v-btn>
        </v-layout>

        <v-card>
          <v-toolbar color="indigo" dark>
            <v-toolbar-title>Instances</v-toolbar-title>
          </v-toolbar>

          <v-data-table
            :headers="instancesHeaders"
            :items="instances"
            item-key="taskId"
            :options.sync="instancesOptions"
            :expanded.sync="instancesExpanded"
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

        <v-card style="margin-top: 20px">
          <v-toolbar color="indigo" dark>
            <v-toolbar-title>Execution Log</v-toolbar-title>
          </v-toolbar>

          <v-data-table
            :headers="logsHeaders"
            :items="logs"
            :options.sync="logsOptions"
            :expanded.sync="logsExpanded"
            show-expand
            single-expand
            height="30vh"
            fixed-header
            disable-pagination
            hide-default-footer
          >
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <pre>{{ item.detail }}</pre>
                <!-- <json-tree :raw="props.item.detail" /> -->
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
// TODO: break this into individual components

import Vue from 'vue';
import { REST } from '../utils';

export default Vue.extend({
  name: 'MapReduceUtil',

  data() {
    return {
      instancesHeaders: [
        { text: 'Date Created', value: 'dateCreated', width: '19%' },
        { text: 'Date Started', value: 'startDate', width: '19%' },
        { text: 'Date Finished', value: 'endDate', width: '19%' },
        { text: 'Status', value: 'status', width: '19%' },
        { text: 'Percent Complete', value: 'percentComplete', width: '19%' },
      ],
      logsHeaders: [
        { text: 'Type', value: 'type', width: '10%' },
        { text: 'Date', value: 'date', width: '10%' },
        { text: 'Time', value: 'time', width: '10%' },
        { text: 'Title', value: 'title', width: '20%' },
        { text: 'Details', value: 'detail', width: '50%' },
      ],
      logsOptions: {
        sortBy: ['id'],
        sortDesc: [true],
      },
      logsExpanded: [],
      instancesExpanded: [],
      instancesOptions: {
        sortBy: ['dateCreated'],
        sortDesc: [true],
      },
      isStartingRun: false,
      deployments: [],
      instances: [],
      logs: [],
      lastLogId: 0,
      selectedDeployment: null,
    };
  },

  mounted() {
    this.updateDeployments();
    setInterval(this.updateDeploymentInfo, 10000);
  },

  watch: {
    selectedDeployment() {
      this.instances = [];
      this.logs = [];
      this.updateDeploymentInfo();
    },
  },

  methods: {
    async updateDeployments() {
      this.deployments = await REST.get({ action: 'getDeployments' });
    },

    async runScript() {
      if (!this.selectedDeployment) {
        return;
      }

      this.isStartingRun = true;
      // TODO: fix this TS error :-)
      // @ts-ignore: Object is possibly 'null'.
      const deploymentId = this.selectedDeployment.value;
      await REST.post({
        action: 'runScript',
        data: deploymentId,
      });
      this.isStartingRun = false;
      this.updateDeploymentInfo();
    },

    async updateInstances() {
      if (!this.selectedDeployment) {
        return;
      }

      // TODO: fix this TS error :-)
      // @ts-ignore: Object is possibly 'null'.
      const deploymentId = this.selectedDeployment.value;
      this.instances = await REST.post({
        action: 'getInstances',
        data: deploymentId,
      });
    },

    async updateLogs() {
      if (!this.selectedDeployment) {
        return;
      }

      // TODO: fix this TS error :-)
      // @ts-ignore: Object is possibly 'null'.
      const deploymentInternalID = this.selectedDeployment.value
        .deploymentInternalID;

      const logs = await REST.post({
        action: 'getLogs',
        data: {
          lastLogId: this.lastLogId,
          deploymentInternalID,
        },
      });

      if (logs.length) {
        this.logs = this.logs.concat(logs);
        // TODO: fix this TS error :-)
        // @ts-ignore: Property 'id' does not exist on type 'never'.
        this.lastLogId = this.logs[this.logs.length - 1]?.id;
      }
    },

    async updateDeploymentInfo() {
      if (this.selectedDeployment) {
        this.updateInstances();
        this.updateLogs();
      }
    },
  },

  filters: {
    formatDate: (date: string) =>
      date
        ? new Date(date).toLocaleString([], {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',
  },
});
</script>
