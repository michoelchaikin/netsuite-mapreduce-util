<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs12 lg10 xl8>
            <deployment-picker
              v-model="selectedDeployment"
              :deployments="deployments"
              :is-starting-run="isStartingRun"
              @runScript="runScript"
            />
            <instances-table :instances="instances" />
            <execution-log-table :logs="logs" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { REST } from './utils';

import DeploymentPicker from './components/DeploymentPicker.vue';
import InstancesTable from './components/InstancesTable.vue';
import ExecutionLogTable from './components/ExecutionLogTable.vue';

export default Vue.extend({
  name: 'App',

  components: {
    DeploymentPicker,
    InstancesTable,
    ExecutionLogTable,
  },

  data() {
    return {
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
});
</script>
