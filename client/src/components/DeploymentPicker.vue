<template>
  <v-layout>
    <v-select
      :value="value"
      :items="deployments"
      item-text="text"
      item-value="value"
      label="Select Deployment"
      return-object
      @input="$emit('input', $event)"
    />
    <v-btn
      :disabled="!value"
      :loading="isStartingRun"
      @click="$emit('runScript')"
    >
      Run
    </v-btn>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DeploymentPicker',

  props: {
    value: {
      type: Object,
      default: null,
    },
    deployments: {
      type: Array,
      required: true,
    },
    isStartingRun: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
