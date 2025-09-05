const btnPerguntar = document.getElementById("btnPerguntar");
const btnLimpar = document.getElementById("btnLimpar");
const btnCopiar = document.getElementById("btnCopiar");
const perguntaInput = document.getElementById("pergunta");
const respostaDiv = document.getElementById("resposta");
const apiKeyInput = document.getElementById("apiKey");
const btnTema = document.getElementById("btnTema");

window.addEventListener("load", () => {
  const savedKey = localStorage.getItem("apiKey");
  if (savedKey) apiKeyInput.value = savedKey;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    btnTema.textContent = "☀️ Modo Claro";
  }
});

btnTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    btnTema.textContent = "☀️ Modo Claro";
  } else {
    localStorage.setItem("theme", "light");
    btnTema.textContent = "🌙 Modo Escuro";
  }
});

btnPerguntar.addEventListener("click", async () => {
  const pergunta = perguntaInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    alert("Digite sua API Key antes de continuar!");
    return;
  }
  if (!pergunta) {
    alert("Digite uma pergunta antes de enviar!");
    return;
  }

  localStorage.setItem("apiKey", apiKey);

  respostaDiv.textContent = "⏳ Carregando resposta...";
  respostaDiv.classList.remove("hidden");
  btnPerguntar.disabled = true;
  btnLimpar.disabled = true;
  btnCopiar.disabled = true;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: pergunta }]
      })
    });

    if (!response.ok) {
      throw new Error("Erro na API: " + response.statusText);
    }

    const data = await response.json();
    const respostaIA = data.choices[0].message.content;

    respostaDiv.textContent = `Você perguntou: ${pergunta}\n\nResposta da IA:\n${respostaIA}`;

    btnLimpar.disabled = false;
    btnCopiar.disabled = false;
  } catch (error) {
    respostaDiv.textContent = "❌ Ocorreu um erro: " + error.message;
  } finally {
    btnPerguntar.disabled = false;
  }
});

btnLimpar.addEventListener("click", () => {
  respostaDiv.textContent = "";
  respostaDiv.classList.add("hidden");
  perguntaInput.value = "";
  btnLimpar.disabled = true;
  btnCopiar.disabled = true;
});

btnCopiar.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(respostaDiv.textContent);
    alert("✅ Resposta copiada!");
  } catch (err) {
    alert("❌ Erro ao copiar: " + err);
  }
});

perguntaInput.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    btnPerguntar.click();
  }
});