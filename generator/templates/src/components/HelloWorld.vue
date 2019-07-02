<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div
      v-for="i of books"
      :key="i.id"
    >
      <span>name: {{ i.name }}</span>|
      <span>desc: {{ i.desc }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',

  props: {
    msg: String,
  },

  computed: {
    books() {
      return this.$store.state.book.items;
    },
  },

  serverPrefetch() {
    return this.fetchBookItem();
  },

  mounted() {
    if (this.books === null) this.fetchBookItem();
  },

  methods: {
    fetchBookItem() {
      return this.$store.dispatch('book/fetch');
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
