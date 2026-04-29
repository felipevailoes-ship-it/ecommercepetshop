function verificarSessao() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    const menuUsuario = document.getElementById('menuUsuario');

    if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        menuUsuario.innerHTML = `
            ${usuario.tipo === 'admin' ? `
                <li class="nav-item">
                    <a class="nav-link" href="admin-produtos.html">Produtos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="admin-usuarios.html">Usuários</a>
                </li>` : ''}
            <li class="nav-item">
                <span class="nav-link text-white">Olá, ${usuario.nome}</span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="sair()">Sair</a>
            </li>
        `;
    } else {
        menuUsuario.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Entrar</a>
            </li>
        `;
    }
}

function sair() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}

function criarCard(produto) {
    return `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${produto.imagemUrl || 'img/sem-imagem.png'}" 
                     class="card-img-top" 
                     alt="${produto.nome}"
                     style="height: 180px; object-fit: cover;">
                <div class="card-body">
                    <h6 class="card-title">${produto.nome}</h6>
                    <p class="text-muted small">${produto.categoria}</p>
                    <p class="fw-bold text-primary">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                    <a href="produto.html?id=${produto._id}" class="btn btn-outline-primary btn-sm w-100">Ver detalhes</a>
                </div>
            </div>
        </div>
    `;
}

async function carregarDestaque() {
    const todos = await listarProdutos();
    const embaralhados = todos.sort(() => Math.random() - 0.5);
    const destaque = embaralhados.slice(0, 3);
    const container = document.getElementById('produtosDestaque');
    container.innerHTML = destaque.length
        ? destaque.map(criarCard).join('')
        : '<p class="text-muted">Nenhum produto cadastrado ainda.</p>';
}

async function filtrarCategoria(categoria) {
    const titulo = document.getElementById('tituloLista');
    const container = document.getElementById('listaProdutos');

    const produtos = categoria === 'Todos'
        ? await listarProdutos()
        : await listarPorCategoria(categoria);

    titulo.textContent = categoria === 'Todos' ? 'Todos os Produtos' : `Categoria: ${categoria}`;
    container.innerHTML = produtos.length
        ? produtos.map(criarCard).join('')
        : '<p class="text-muted">Nenhum produto nesta categoria.</p>';
}

verificarSessao();
carregarDestaque();
filtrarCategoria('Todos');