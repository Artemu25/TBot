const app = Vue.createApp({
  data() {
    return {
      title: 'Hello Daria'
    };
  },
  methods: {
    changeTitle() {
      this.title = 'С вас 1 миллион долларов';
    }
  }
});

app.mount('#app');
