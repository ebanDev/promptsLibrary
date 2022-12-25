const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors())

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const { Configuration, OpenAIApi } = require("openai");
const {encode, decode} = require('gpt-3-encoder')

app.get("/prompts", async (req, res) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  promptList = [];

  for (let i = 0; i < response.results.length; i++) {
    const prompt = response.results[i];

    if (prompt.properties.Quality.status.name != "Crap") {
      const pageId = prompt.id;
      const pageContent = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 50,
      });

      const promptContent = pageContent.results[1].code.rich_text[0].text.content;
      const promptDesc = pageContent.results[0].paragraph.rich_text[0].text.content;

      promptList.push({
        id: prompt.id,
        name: prompt.icon.emoji + " " + prompt.properties.Name.title[0].plain_text,
        description: promptDesc,
        content: promptContent
      });
    }
  }

  res.send(promptList);
});

app.get("/completion", async (req, res) => {
  const promptId = req.query.prompt
  const pageContent = await notion.blocks.children.list({
    block_id: promptId,
    page_size: 50,
  });

  const promptContent = pageContent.results[1].code.rich_text[0].text.content;
  const openaiInput = promptContent.replace("CHANGEME", req.query.query)
  console.log(openaiInput)

  const configuration = new Configuration({
    apiKey: req.query.token,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-curie-001",
    prompt: openaiInput,
    temperature: 0.5,
    max_tokens: 2048 - encode(openaiInput).length,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
    stop: ["```"],
  });
  res.send(response.data.choices[0].text);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;