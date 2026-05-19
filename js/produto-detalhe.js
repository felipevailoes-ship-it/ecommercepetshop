async function carregarProduto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.getElementById('conteudoProduto');

    if (!id) {
        container.innerHTML = '<p class="text-danger">Produto não encontrado.</p>';
        return;
    }

    const produto = await buscarProduto(id);

    if (!produto) {
        container.innerHTML = '<p class="text-danger">Produto não encontrado.</p>';
        return;
    }

    container.innerHTML = `
        <a href="index.html" class="btn btn-outline-secondary btn-sm mb-4">← Voltar</a>
        <div class="row">
            <div class="col-md-5 mb-4">
                <img src="${produto.imagemUrl || 'img/sem-imagem.png'}" 
                     alt="${produto.nome}" 
                     class="img-fluid rounded shadow">
            </div>
            <div class="col-md-7">
                <span class="badge bg-secondary mb-2">${produto.categoria}</span>
                <h2 class="fw-bold">${produto.nome}</h2>
                <p class="text-muted">${produto.descricao}</p>
                <h3 class="text-primary fw-bold">R$ ${parseFloat(produto.preco).toFixed(2)}</h3>
            </div>
        </div>
    `;
}

verificarSessao();
carregarProduto();