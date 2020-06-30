import Vue from 'vue';

Vue.filter('formatDate', (date: string) =>
  date
    ? new Date(date).toLocaleString([], {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''
);
