document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const fileNameElement = document.getElementById("fileName");

    if (file) {
        fileNameElement.textContent = `📄 Arquivo selecionado: ${file.name}`;
    } else {
        fileNameElement.textContent = "";
    }
});

let progress = 0;
const progressBar = document.querySelector(".progress-bar");

    
function updateProgress() {
    progress += 1;
    progressBar.style.width = progress + "%";
    progressBar.textContent = progress + "%";
    
    if (progress < 100) {
        setTimeout(updateProgress, 50); // 100% em 5 segundos (5000ms/100 = 50ms por incremento)
    }
}

function resetProgress() {
    progress = 0;
    progressBar.style.width = "0%";
    progressBar.textContent = "0%";
}


function displayData(data) {
    const outputDiv = document.querySelector(".output");
    outputDiv.innerHTML = ''; // Limpa o conteúdo anterior
    
    if (!data.data.nota_corrigida) {
        outputDiv.innerHTML = '<p>Dados inválidos.</p>';
        return;
    }
    
    const notaDiv = document.createElement('div');
    notaDiv.innerHTML = '<h2>Nota Corrigida</h2>';
    
    for (const [chave, valor] of Object.entries(data.data.nota_corrigida)) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${chave}:</strong> ${valor}`;
        notaDiv.appendChild(p);
    }
    
    outputDiv.appendChild(notaDiv);
}

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');
    const fileNameElement = document.getElementById("fileName");

    if (!fileInput.files.length) {
        status.textContent = '⚠️ Selecione um arquivo primeiro!';
        status.style.color = 'red';
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    status.textContent = "📤 Enviando arquivo...";
    status.style.color = "#007bff"; 

    try {
        resetProgress();
        updateProgress();
        console.log("📤 Enviando arquivo:", file.name);

        const response = await fetch('https://ejbp0hc13c.execute-api.us-east-1.amazonaws.com/Prod/api/v1/invoice', {
            method: 'POST',
            body: formData,
            headers: { "Accept": "application/json" }
        });

        console.log("🔄 Resposta da API:", response);

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            console.error("❌ Erro ao processar JSON:", jsonError);
            throw new Error("A resposta da API não está no formato esperado.");
        }

        if (response.ok) {
            status.textContent = "✅ Arquivo enviado com sucesso!";
            status.style.color = "green";
            fileNameElement.textContent = ""; // Limpa o nome do arquivo após envio
            fileInput.value = ""; // Reseta o input de arquivo
        } else {
            throw new Error(result.message || "Erro desconhecido ao enviar o arquivo.");
        }

        console.log("📜 Detalhes da resposta:", result);
        displayData(result);
    } catch (error) {
        status.textContent = `❌ ${error.message}`;
        status.style.color = "red";
        console.error("🚨 Erro ao fazer a requisição:", error);
    }
}
