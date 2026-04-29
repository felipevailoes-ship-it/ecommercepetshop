async function fazerLogin() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const mensagemErro = document.getElementById('mensagemErro');

    mensagemErro.classList.add('d-none');
    mensagemErro.textContent = '';

    if (!email || !senha) {
        mensagemErro.textContent = 'Preencha todo os campos.';
        mensagemErro.classList.remove('d-none');
        return;
    }

    const usuario = await buscarUsuarioPorEmail(email);

    if(!usuario || usuario.senha !== senha) {
        mensagemErro.textContent = 'E-mail ou senha incorretos.';
        mensagemErro.classList.remove('d-none');
        return;
    }

    sessionStorage.setItem('usuarioLogado', JSON.stringify({
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
    }));

    if (usuario.tipo === 'admin') {
        window.location.href = 'admin-produtos.html';
    } else {
        window.location.href = 'index.html';
    }
}