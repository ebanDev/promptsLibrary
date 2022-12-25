<template>
  <select v-model="selectedPrompt">
    <option value="" selected disabled>Select a prompt</option>
    <option
      v-for="prompt in prompts"
      :value="String(prompt.id)"
      :key="prompt.id"
    >
      {{ prompt.name }}
    </option>
  </select>
</template>

<script lang="ts">
export default {
  data() {
    return {
      selectedPrompt: "",
      prompts: [
        {
          id: "Loading...",
          name: "Loading...",
          desc: "Loading...",
          prompt: "Loading...",
        },
      ],
    };
  },
  created() {
    this.fetchPrompts();
  },
  methods: {
    async fetchPrompts() {
      const response = await fetch("/api/prompts");
      const prompts = await response.json();
      this.prompts = prompts;
    },
  },
};
</script>

<style scoped>
select {
  background: #eeffee;
  border: 3px solid #007500;
  border-radius: 10px;
  color: #007500;
  font-weight: 600;
  font-size: 15px;
  padding: 3px 10px;
  cursor: pointer;
  margin: 15px 0px;
}
</style>
