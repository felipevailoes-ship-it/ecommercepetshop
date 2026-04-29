const dbUsuarios = new PouchDB('usuarios');
const dbProdutos = new PouchDB('produtos');

function gerarId() {
    return new Date().toISOString() + '-' + Math.random().toString(36).substring(2, 11);
} // Gera ID para usuário

async function criarUsuario(nome, email, senha, tipo) {
    const existe = await buscarUsuarioPorEmail(email);
    if (existe) {
        return { sucesso: false, mensagem: 'Este e-mail já está cadastrado'};
    }
    
    const usuario = {
        _id: gerarId(), // ID do usuário
        nome,
        email,
        senha,
        tipo // tipo administrador ou cliente
    };

    try {
        await dbUsuarios.put(usuario);
        console.log('Usuário criado com sucesso!');
        return { sucesso: true, mensagem: 'Usuário criado com sucesso!'};
    } catch (erro) {
        console.error ('Erro ao criar usuário', erro);
        return { sucesso: false, mensagem: 'Erro ao criar usuário.'};
            
        }
    } // Criar novo usuário e validar se já possui um e-mail cadastrado

async function buscarUsuarioPorEmail(email) {
    try {
        const resultado = await dbUsuarios.allDocs({ include_docs: true });
        const usuarios = resultado.rows.map(row => row.doc);
        return usuarios.find(u => u.email === email) || null;
    } catch (erro) {
        return null;
    }
} // Busca um único usuário pelo e-mail cadastrado

async function buscarUsuarioPorId(id) {
    try {
        return await dbUsuarios.get(id);
    } catch (erro) {
        return null;
    }
}

async function listarUsuarios() {
    try {
        const resultado = await dbUsuarios.allDocs({ include_docs: true});
        return resultado.rows.map(row => row.doc);
    } catch (erro) {
        console.error('Erro ao listar usuários', erro);
        return [];
    }
} // Busca todos os usuários no banco de dados

async function atualizarUsuario(id, novosDados) {

    if (novosDados.email) {
        const existente = await buscarUsuarioPorEmail(novosDados.email);
        if (existente && existente._id !== id) {
            return { sucesso: false, mensagem: 'E-mail já está em uso'}
        }
    }

    try {
        const usuario = await dbUsuarios.get(id);
        const atualizado = { ...usuario, ...novosDados };
        await dbUsuarios.put(atualizado);
        return { sucesso: true, mensagem: 'Usuário atualizado com sucesso!'};
    } catch (erro) {
        console.error('Erro ao atualizar usuário:', erro);
        return { sucesso: false, mensagem: 'Erro ao atualizar usuário.'};
    }
} // Faz a atualização dos dados

async function deletarUsuario(id) {
    try {
        const usuario = await dbUsuarios.get(id);
        await dbUsuarios.remove(usuario);
        return { sucesso: true, mensagem: 'Usuário deletado com sucesso!'};
    } catch (erro) {
        console.error('Erro ao deletar usuário:', erro);
        return { sucesso: false, mensagem: 'Erro ao deletar usuário.'};
    }
} // Para deletar usuários

// Para criar produtos

async function criarProduto(nome, descricao, preco, categoria, imagemUrl) {
    const produto = {
        _id: new Date().toISOString(), // ID único
        nome,
        descricao,
        preco,
        categoria,
        imagemUrl
    };

    try {
        await dbProdutos.put(produto);
        console.log('Produto criado com sucesso!');
        return true;
    } catch (erro) {
        console.error('Erro ao criar produto:', erro);
        return false;
    }
}

async function listarProdutos() {
    try {
        const resultado = await dbProdutos.allDocs({include_docs: true});
        return resultado.rows.map(row => row.doc);
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);
        return [];
    }
}

async function buscarProduto(id) {
    try {
        return await dbProdutos.get(id);
    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);
        return null;
    }
}

async function listarPorCategoria(categoria) {
    const todos = await listarProdutos();
    return todos.filter(p => p.categoria === categoria);
}

// Usuário administrador padrão

async function criarAdminPadrao() {
    const existe = await buscarUsuarioPorEmail('admin@petshop.com');
    if (!existe) {
        await criarUsuario('Administrador', 'admin@petshop.com', 'admin123', 'admin');
        console.log('Admin padrão criado.');
    }
}

// Funcção que criar o usuário admin padrão no banco

criarAdminPadrao();