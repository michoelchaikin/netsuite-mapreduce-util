<template>
  <v-layout>
    <v-row dense>
      <v-col cols="5">
        <v-select
          :value="scriptFilter"
          :items="scripts"
          item-text="name"
          item-value="id"
          label="Select Script"
          @input="updateScriptFilter"
        />
      </v-col>
      <v-col cols="5">
        <v-select
          :value="value"
          :items="filteredDeployments"
          item-text="text"
          item-value="value"
          label="Select Deployment"
          return-object
          @input="$emit('input', $event)"
        />
      </v-col>
      <v-spacer />
      <v-col>
        <v-btn
          :disabled="!value"
          :loading="isStartingRun"
          @click="$emit('runScript')"
        >
          Run
        </v-btn>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { uniqBy } from 'lodash';

// TODO: move types to own file(s), probably shared between client and SDF
type Deployment = {
  text: string;
  value: {
    scriptId: string;
    scriptName: string;
    deploymentId: string;
    deploymentInternalID: string;
  };
};

type Script = {
  id: string;
  name: string;
};

export default Vue.extend({
  name: 'DeploymentPicker',

  props: {
    value: {
      type: Object,
      default: null,
    },
    deployments: {
      type: Array as () => Deployment[],
      required: true,
    },
    isStartingRun: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      scriptFilter: 'all',
    };
  },

  computed: {
    scripts(): Script[] {
      const scripts: Script[] = this.deployments.map((deployment) => ({
        id: deployment.value.scriptId,
        name: deployment.value.scriptName,
      }));

      const uniqueScripts = uniqBy(scripts, 'id');
      uniqueScripts.unshift({ id: 'all', name: '- All -' });

      return uniqueScripts;
    },

    filteredDeployments(): Deployment[] {
      if (this.scriptFilter === 'all') {
        return this.deployments;
      }

      return this.deployments.filter(
        (elem) => elem.value.scriptId === this.scriptFilter
      );
    },
  },

  methods: {
    updateScriptFilter(value: string) {
      this.scriptFilter = value;
      this.$emit('input', null);

      this.$nextTick(() => {
        if (this.filteredDeployments.length === 1) {
          this.$emit('input', this.filteredDeployments[0]);
        }
      });
    },
  },
});
</script>
