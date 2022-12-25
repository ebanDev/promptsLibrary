<template>
  <textarea v-model="text"></textarea>
  <button @click="send">🎩 Make the magic happen</button>
  <code>{{ output }}</code>
</template>

<script lang="ts">
export default {
  props: {
    selectedPrompt: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      text: "",
      output: "Here goes the output",
      token: "",
      promptId: "",
    };
  },
  methods: {
    async send() {
      const response = await fetch(
        "http://127.0.0.1:3000/completion?" +
          new URLSearchParams({
            query: this.text,
            prompt: this.promptId,
            token: this.token,
          })
      );

      this.output = await response.text();
    },

    getToken() {
      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("OpenapiToken="));
      if (tokenCookie) {
        this.token = tokenCookie.split("=")[1];
      } else {
        this.token = prompt("Please enter your OpenAI API token") || "";
        document.cookie = `OpenapiToken=${this.token}`;
      }
    },
  },
  created() {
    this.getToken();
  },
  watch: {
    selectedPrompt(newValue: string) {
      this.promptId = newValue;
    },
  },
};
</script>

<style scoped>
textarea {
  border-radius: 10px;
  border: none;
  resize: none;
  width: 600px;
  height: 200px;
  outline: none;
  padding: 15px;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.07);
}

code {
  background: #333;
  display: block;
  color: #fff;
  padding: 15px;
  border-radius: 10px;
  white-space: pre-line;
}

button {
  background: #eeffee;
  border: 4px solid #007500;
  border-radius: 10px;
  color: #007500;
  font-weight: 600;
  font-size: 20px;
  padding: 5px 15px;
  cursor: pointer;
  margin: 15px 0px;
}
</style>
