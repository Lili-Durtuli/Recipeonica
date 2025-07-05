import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (!userMessage) return;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Ты — дружелюбный кулинарный помощник Рецептоника. Подскажи рецепты по ингредиентам, посоветуй блюда и помоги составить список покупок.",
        },
        { role: "user", content: userMessage }
      ],
    });

    const reply = completion.choices[0]?.message?.content || "Не удалось получить ответ 😕";
    bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error("Ошибка:", err);
    bot.sendMessage(chatId, "Произошла ошибка при обращении к кулинарному ассистенту.");
  }
});
