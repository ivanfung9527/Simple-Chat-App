const goButton = document.getElementById("enter-api-key");
const inputBox = document.getElementById("input");
const container = document.getElementById("messages");
const submitButton = document.getElementById("submit-button");
const endpoint = 'https://api.openai.com/v1/chat/completions';
const buffer = {
    apiKey: null
};

async function sendMessage(msg) {
    let key = buffer['apiKey'];
    let data = {
        messages: [{ role: "user", "content": msg }],
        model: "gpt-3.5-turbo",
        max_tokens: 1000,
        temperature: 0,
    };
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(data),
    })
    const resp = await response.json();
    const result = resp.choices[0].message.content;
    console.log(result);
    return result;
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function createMessage(msgTxt, type) {
    let newMsg = document.createElement("div");
    newMsg.classList.add(type);
    newMsg.innerHTML = `<div class="message-container">
        <div class="msg-text">${msgTxt}</div>
        <div class="msg-timestamp">${formatAMPM(new Date())}</div>
    </div>`;
    container.appendChild(newMsg);
}

function apiKeyError(errCode) {
    let alert = document.createElement("p");
    let apiForm = document.getElementById("api-key-form");
    alert.classList.add("alert-msg");
    alert.innerHTML = "Unable to establish connection with OpenAI. Check Developer Tool for more info."
    apiForm.insertAdjacentElement("afterend", alert);
}

// Event Listeners
submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (buffer['apiKey'] === null) {
        return;
    }
    createMessage(inputBox.value, "user");
    sendMessage(inputBox.value).then(
        resp => createMessage(resp, "bot")
    );
    inputBox.value = '';
});

goButton.addEventListener('click', function (event) {
    event.preventDefault();
    let apiForm = document.getElementById("api-key-form");
    let apiKey = document.getElementById("api-key");
    try {
        let alert = document.querySelector(".alert-msg");
        alert.remove();
    } catch (error) { }
    // console.log(apiKey);
    buffer['apiKey'] = apiKey.value;
    // sessionStorage.setItem('apiKey', apiKey.value);
    sendMessage("Hello.")
        .then(resp => createMessage(resp, "bot"))
        .then(dummy => apiForm.remove())
        .catch(error => {
            console.log(error)
            apiKeyError()
            buffer['apiKey'] = null;
        });
});