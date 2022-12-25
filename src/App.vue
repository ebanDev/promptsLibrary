<template>
  <h1>Prompts Library</h1>
  <prompt-selector v-model="selectedPrompt" />
  <user-data-input v-bind:selectedPrompt="selectedPrompt" />
</template>

<script lang="ts">
import userDataInput from "./components/userDataInput.vue";
import promptSelector from "./components/promptSelector.vue";

export default {
  components: {
    userDataInput,
    promptSelector,
  },
  data() {
    return {
      selectedPrompt: "",
    };
  },
};
</script>

<style scoped>
h1 {
  font-weight: 600;
  font-size: 40px;
  margin-bottom: 30px;
  text-align: center;
}
</style>
