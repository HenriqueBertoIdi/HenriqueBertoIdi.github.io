document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Mensagem enviada com sucesso!');
});

const repositories = document.querySelector('.content-main');

function getApiGitHub() {
    fetch('https://api.github.com/users/HenriqueBertoIdi/repos')
        .then(async res => {
            if (!res.ok) {
                throw new Error(res.status);
            }

            let data = await res.json();
            data.map(item => {
                let project = document.createElement('div');
                project.classList.add('project');

                project.innerHTML = `
                    <div>
                        <h4 class="title">${item.name}</h4>
                        <span class="date-create">${Intl.DateTimeFormat('pt-BR').format(new Date(item.created_at))}</span>
                    </div>
                    <div>
                        <a href="${item.html_url}">${item.html_url}</a>
                        <span class="language"><span class="circle"></span>${item.language}</span>
                    </div>
                `;

                repositories.appendChild(project);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar os repositórios:', error);
        });
}

getApiGitHub();