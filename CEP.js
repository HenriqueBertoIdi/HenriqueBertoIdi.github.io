document.addEventListener('DOMContentLoaded', function () {
    const cepInput = document.getElementById('cep-input');
    const consultarBtn = document.getElementById('consultar-btn');
    const salvarBtn = document.getElementById('salvar-btn');
    const resultDiv = document.getElementById('result');
    const savedAddressesDiv = document.getElementById('saved-addresses');

    consultarBtn.addEventListener('click', () => {
        const cep = cepInput.value.trim();
        if (cep.length === 8 && /^[0-9]+$/.test(cep)) {
            consultarCep(cep);
        } else {
            alert('Digite um CEP de 8 Digitos.');
        }
    });

    salvarBtn.addEventListener('click', salvarEndereco);

    function consultarCep(cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da consulta');
                }
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    resultDiv.innerHTML = '<p>Esse CEP não Existe.</p>';
                    salvarBtn.disabled = true;
                } else {
                    resultDiv.innerHTML = `
                        <p><strong>CEP:</strong> ${data.cep}</p>
                        <p><strong>Logradouro:</strong> ${data.logradouro}</p>
                        <p><strong>Bairro:</strong> ${data.bairro}</p>
                        <p><strong>Cidade:</strong> ${data.localidade}</p>
                        <p><strong>Estado:</strong> ${data.uf}</p>
                        <p><strong>DDD:</strong> ${data.ddd}</p>
                    `;
                    salvarBtn.disabled = false;
                    salvarBtn.dataset.endereco = JSON.stringify(data);
                }
            })
            .catch(error => {
                console.error('Erro na consulta do CEP:', error);
                resultDiv.innerHTML = '<p>A Consulta de CEP FALHOU.</p>';
                salvarBtn.disabled = true;
            });
    }

    function salvarEndereco() {
        const endereco = JSON.parse(salvarBtn.dataset.endereco);
        let enderecosSalvos = JSON.parse(localStorage.getItem('enderecos')) || [];
        enderecosSalvos.push(endereco);
        localStorage.setItem('enderecos', JSON.stringify(enderecosSalvos));
        exibirEnderecosSalvos();
    }

    function exibirEnderecosSalvos() {
        let enderecosSalvos = JSON.parse(localStorage.getItem('enderecos')) || [];
        savedAddressesDiv.innerHTML = '';
        enderecosSalvos.forEach((endereco, index) => {
            const enderecoDiv = document.createElement('div');
            enderecoDiv.classList.add('endereco');
            enderecoDiv.innerHTML = `
                <p><strong>CEP:</strong> ${endereco.cep}</p>
                <p><strong>Logradouro:</strong> ${endereco.logradouro}</p>
                <p><strong>Bairro:</strong> ${endereco.bairro}</p>
                <p><strong>Cidade:</strong> ${endereco.localidade}</p>
                <p><strong>Estado:</strong> ${endereco.uf}</p>
                <p><strong>DDD:</strong> ${endereco.ddd}</p>
                <button onclick="deletarEndereco(${index})">Deletar</button>
            `;
            savedAddressesDiv.appendChild(enderecoDiv);
        });
    }

    window.deletarEndereco = function (index) {
        if (confirm('Tem certaza mesmo que vai EXCLUIR este endereço?')) {
            let enderecosSalvos = JSON.parse(localStorage.getItem('enderecos')) || [];
            enderecosSalvos.splice(index, 1);
            localStorage.setItem('enderecos', JSON.stringify(enderecosSalvos));
            exibirEnderecosSalvos();
        }
    }

    exibirEnderecosSalvos();
});