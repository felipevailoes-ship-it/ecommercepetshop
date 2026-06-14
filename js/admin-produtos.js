function verificarAdmin() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }
    const usuario = JSON.parse(usuarioLogado);
    if (usuario.tipo !== 'admin') {
        window.location.href = 'index.html';
    }
}

function exibirMensagem(texto, tipo) {
    const mensagem = document.getElementById('mensagem');
    mensagem.textContent = texto;
    mensagem.className = `alert alert-${tipo}`;
    mensagem.classList.remove('d-none');
    setTimeout(() => mensagem.classList.add('d-none'), 3000);
}

document.getElementById('nome').addEventListener('input', function() {
    document.getElementById('descricao').value = this.value;
}); // Preenche o campo descrição de acordo com o nome inserido no produto

async function salvarProduto() {
    const nome = document.getElementById('nome').value.trim();
    const categoria = document.getElementById('categoria').value;
    const preco = document.getElementById('preco').value;
    const imagemUrl = document.getElementById('imagemUrl').value.trim();
    const descricao = document.getElementById('descricao').value.trim();

    if (!nome || !categoria || !preco || !descricao) {
        exibirMensagem('Preencha todos os campos obrigatórios.', 'danger');
        return;
    }

    const sucesso = await criarProduto(nome, descricao, preco, categoria, imagemUrl);

    if (sucesso) {
        exibirMensagem('Produto cadastrado com sucesso!', 'success');
        // Limpa o formulário
        document.getElementById('nome').value = '';
        document.getElementById('categoria').value = '';
        document.getElementById('preco').value = '';
        document.getElementById('imagemUrl').value = '';
        document.getElementById('descricao').value = '';
        carregarTabelaProdutos();
    } else {
        exibirMensagem('Erro ao cadastrar produto.', 'danger');
    }
}

async function carregarTabelaProdutos() {
    const tbody = document.getElementById('tabelaProdutos');
    const produtos = await listarProdutos();

    if (produtos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    tbody.innerHTML = produtos.map(p => `
        <tr>
            <td>${p.nome}</td>
            <td>${p.categoria}</td>
            <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
        </tr>
    `).join('');
}

verificarAdmin();
carregarTabelaProdutos();