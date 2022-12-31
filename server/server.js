import express  from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // required
    basePath: "https://api.openai.com/v1",  // required
    
})

console.log(configuration)

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Hello World"
    })
})


app.post("/", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature:0,  //higher temp, model will take more risks, but also more likely to generate nonsensical text
            max_tokens:3000, // max number of tokens to generate, for 3000 it will give long response
            top_p:1,    // 1 means model will not consider next token probability, 0.5 means model will consider next token probability
            frequency_penalty:0.5, // frequency penalty means, model will not repeat same word again and again in response for 0.5
            presence_penalty:0,
        })

        res.status(200).send({
            bot: response.data.choices[0].text
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            error
        })

    }
})

app.listen(5000, ()=>{console.log("Server is running on port http://localhost:5000")})

