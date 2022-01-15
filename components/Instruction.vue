<template>
  <div v-html="instruction" class="html-content"></div>
</template>


<script>
export default {
  props: {
    instruction: {
      type: String,
      default: '',
    },
  },
}
</script>

<style>
.html-content strong, .html-content b {
  font-weight: bold
}

.html-content ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

.html-content ol {
  display: block;
  list-style-type: decimal;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

.html-content li {
  display: list-item;
  text-align: match-parent;
}

.html-content p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

.html-content mark {
  background: #e3e3e3;
  color: black;
}

</style>
