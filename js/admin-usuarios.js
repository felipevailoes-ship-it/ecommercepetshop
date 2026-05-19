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

async function salvarUsuario() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const tipo = document.getElementById('tipo').value;

    if (!nome || !email || !senha || !tipo) {
        exibirMensagem('Preencha todos os campos.', 'danger');
        return;
    }

    const resultado = await criarUsuario(nome, email, senha, tipo);

    if (resultado.sucesso) {
        exibirMensagem(resultado.mensagem, 'success');
        document.getElementById('nome').value = '';
        document.getElementById('email').value = '';
        document.getElementById('senha').value = '';
        document.getElementById('tipo').value = '';
        carregarTabelaUsuarios();
    } else {
        exibirMensagem(resultado.mensagem, 'danger');
    }
}

async function carregarTabelaUsuarios() {
    const tbody = document.getElementById('tabelaUsuarios');
    const usuarios = await listarUsuarios();

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum usuário cadastrado.</td></tr>';
        return;
    }

    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.nome}</td>
            <td>${u.email}</td>
            <td>${u.tipo}</td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="abrirEdicao('${u._id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${u._id}')">Excluir</button>
            </td>
        </tr>
    `).join('');
}

async function abrirEdicao(id) {
    const usuario = await buscarUsuarioPorId(id);
    if (!usuario) return;

    document.getElementById('editarId').value = usuario._id;
    document.getElementById('editarNome').value = usuario.nome;
    document.getElementById('editarEmail').value = usuario.email;
    document.getElementById('editarSenha').value = '';
    document.getElementById('editarTipo').value = usuario.tipo;

    const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
    modal.show();
}

async function confirmarEdicao() {
    const id = document.getElementById('editarId').value;
    const nome = document.getElementById('editarNome').value.trim();
    const email = document.getElementById('editarEmail').value.trim();
    const senha = document.getElementById('editarSenha').value.trim();
    const tipo = document.getElementById('editarTipo').value;

    const novosDados = { nome, email, tipo };
    if (senha) novosDados.senha = senha;

    const resultado = await atualizarUsuario(id, novosDados);

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
    modal.hide();

    if (resultado.sucesso) {
        exibirMensagem(resultado.mensagem, 'success');
        carregarTabelaUsuarios();
    } else {
        exibirMensagem(resultado.mensagem, 'danger');
    }
}

async function excluirUsuario(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    const resultado = await deletarUsuario(id);

    if (resultado.sucesso) {
        exibirMensagem(resultado.mensagem, 'success');
        carregarTabelaUsuarios();
    } else {
        exibirMensagem(resultado.mensagem, 'danger');
    }
}

verificarAdmin();
carregarTabelaUsuarios();