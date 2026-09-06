const chat = document.getElementById("chat");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

let conversation = [];

sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", clearChat);

promptInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
    // Get the user's message

    const prompt = promptInput.value.trim();

    // Don't send an empty message

    if (prompt === "") {
        return;
    }

    // Show the user's message

    chat.innerHTML += `
        <div class="message user">
            ${prompt}
        </div>
    `;

    // Add user message to conversation

    conversation.push({
        role: "user",
        content: prompt,
    });

    // Clear input

    promptInput.value = "";

    // Show loading

    chat.innerHTML += `
        <div id="loading" class="message ai">
             Thinking...
        </div>
    `;

    try {
        // Send request to AI
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },

            body: JSON.stringify({
                model: "gemini-3.7-flash",
                messages: conversation,
            }),
        });

        const data = await response.json();

        const aiMessage = data.choices[0].message.content;

        // Remove loading

        document.getElementById("loading").remove();

        // Show AI response

        const formattedMessage = marked.parse(aiMessage);

        chat.innerHTML += `
        <div class="AI-response"><div class="aiIcon"><img src="images/AI icon2.png" alt="AI"></div>
            <div class="message ai">
               ${formattedMessage}
            </div></div>
        `;

        // Add AI response to conversation

        conversation.push({
            role: "assistant",
            content: aiMessage,
        });
    } catch (error) {
        console.log(error);

        // Remove loading

        const loading = document.getElementById("loading");

        if (loading) {
            loading.remove();
        }

        // Show error

        chat.innerHTML += `
        <div class="AI-response"><div class="aiIcon"><img src="images/AI icon2.png" alt="AI"></div>
            <div class="message ai">
                 Sorry, something went wrong.
            </div></div>
        `;
    }
}

function clearChat() {
    chat.innerHTML = "";
    conversation = [];
}