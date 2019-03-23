function callNetSuiteAPI(action, payload = null) {
  const url = `scriptlet.nl?script=customscript_mos_mapreduceutil_sl&deploy=customdeploy_mos_mapreduceutil_sl&cust_action=${action}`;
  return payload ? axios.post(url, payload) : axios.get(url);
}

new Vue({
  el: '#app',
  data() {
    return {
      instancesHeaders: [
        { text: '', value: '', sortable: false, width: '5%' },
        { text: 'Date Created', value: 'dateCreated', width: '19%' },
        { text: 'Date Started', value: '', width: '19%' },
        { text: 'Date Finished', value: '', width: '19%' },
        { text: 'Percent Complete', value: 'percentComplete', width: '19%' },
        { text: 'Status', value: 'status', width: '19%' },
      ],
      logsHeaders: [
        { text: 'Type', value: 'type', width: '10%' },
        { text: 'Date', value: 'date', width: '10%' },
        { text: 'Time', value: 'time', width: '10%' },
        { text: 'Title', value: 'title', width: '20%' },
        { text: 'Details', value: 'details', width: '50%' },
      ],
      instancesPagination: {
        sortBy: 'dateCreated',
        descending: true,
      },
      logsPagination: {
        sortBy: 'id',
        descending: true,
      },
      expand: false,
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
      const response = await callNetSuiteAPI('getDeployments');
      this.deployments = response.data;
    },
    async runScript() {
      this.isStartingRun = true;
      await callNetSuiteAPI('runScript', this.selectedDeployment.value);
      this.isStartingRun = false;
      this.updateDeploymentInfo();
    },
    async updateInstances() {
      const response = await callNetSuiteAPI(
        'getInstances',
        this.selectedDeployment.value
      );
      this.instances = response.data;
    },
    async updateLogs() {
      const response = await callNetSuiteAPI('getLogs', {
        lastLogId: this.lastLogId,
        deploymentInternalID: this.selectedDeployment.value
          .deploymentInternalID,
      });
      // TODO: check response for errors
      if(response.data.length) {
        this.logs = this.logs.concat(response.data);
        this.lastLogId = this.logs[this.logs.length - 1].id;  
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
    formatDate: date => (date ? new Date(date).toLocaleString() : ''),
  },
});
