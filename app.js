let apiKey = 'AIzaSyAZzefc8yJKK2L-8Rwqz8DzV9N-8axf4yc';
let prompts = {
  prompt1: 'Текст промта 1',
  prompt2: 'Текст промта 2',
  prompt3: 'Текст промта 3',
  prompt4: 'Текст промта 4',
  prompt5: 'Текст промта 5'
};

async function loadConfig() {
  try {
    const resp = await fetch('config.json');
    const cfg = await resp.json();
    apiKey = cfg.apiKey || '';
  } catch (e) {
    console.error('Не удалось загрузить config.json', e);
  }
}

function renderPrompts() {
  const list = document.getElementById('promptsList');
  list.innerHTML = '';
  let i = 1;
  for (const key in prompts) {
    const group = document.createElement('div');
    group.className = 'flex items-center gap-2';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-button btn-edit';
    editBtn.textContent = '✎';
    editBtn.onclick = () => {
      const newText = prompt('Редактировать промт:', prompts[key]);
      if (newText !== null) {
        prompts[key] = newText;
        renderPrompts();
      }
    };

    const promptBtn = document.createElement('button');
    promptBtn.className = 'prompt-button btn-prompt flex-grow';
    promptBtn.textContent = `Промт ${i}`;
    promptBtn.onclick = () => {
      document.getElementById('chatInput').value = prompts[key];
      document.getElementById('chatInput').focus();
    };

    const sendBtn = document.createElement('button');
    sendBtn.className = 'icon-button btn-send';
    sendBtn.textContent = '→';
    sendBtn.onclick = () => {
      addMessageToChat(prompts[key], 'user');
    };

    group.appendChild(editBtn);
    group.appendChild(promptBtn);
    group.appendChild(sendBtn);
    list.appendChild(group);
    i++;
  }
}

function addMessageToChat(text, sender) {
  const chat = document.getElementById('chatContainer');
  const msg = document.createElement('div');
  msg.className = 'chat-message ' + (sender === 'user' ? 'user-message' : 'model-message');
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById('btnAdd').onclick = () => {
  const key = `prompt${Object.keys(prompts).length + 1}`;
  prompts[key] = 'Новый промт';
  renderPrompts();
};

document.getElementById('sendChatButton').onclick = () => {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  addMessageToChat(text, 'user');
  input.value = '';
  if (apiKey) {
    sendToGemini(text);
  }
};

async function sendToGemini(text) {
  const chat = document.getElementById('chatContainer');
  const loading = document.createElement('div');
  loading.className = 'chat-message model-message';
  loading.textContent = '...';
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  const payload = { contents: [{ role: 'user', parts: [{ text }] }] };
  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    loading.remove();
    const modelText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    addMessageToChat(modelText || 'Ошибка ответа модели', 'model');
  } catch (e) {
    loading.remove();
    addMessageToChat('Ошибка отправки запроса', 'model');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  renderPrompts();
});
