// Script principal para a aplicação PREV+ (versão Firebase)

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const btnNovoPedidoDestaque = document.getElementById('btnNovoPedidoDestaque');
    const formNovoPedido = document.getElementById('formNovoPedido');
    const formLogin = document.getElementById('formLogin');
    const formConclusao = document.getElementById('formConclusao');
    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    const btnLogout = document.getElementById('btnLogout');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    
    // Contadores e containers
    const countSugestoes = document.getElementById('countSugestoes');
    const countManutencoes = document.getElementById('countManutencoes');
    const countReclamacoes = document.getElementById('countReclamacoes');
    const percentConcluidos = document.getElementById('percentConcluidos');
    const progressBar = document.getElementById('progressBar');
    const pedidosAbertosContainer = document.getElementById('pedidosAbertosContainer');
    const pedidosConcluidosContainer = document.getElementById('pedidosConcluidosContainer');
    
    // Campos de busca e filtros
    const searchAbertos = document.getElementById('searchAbertos');
    const searchConcluidos = document.getElementById('searchConcluidos');
    const filterTipo = document.getElementById('filterTipo');
    const filterBloco = document.getElementById('filterBloco');
    
    // Variáveis de estado
    let pedidosAbertos = [];
    let pedidosConcluidos = [];
    let pedidoParaExcluir = null;
    let isAdmin = false;
    
    // Modais
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const conclusaoModal = new bootstrap.Modal(document.getElementById('conclusaoModal'));
    const exclusaoModal = new bootstrap.Modal(document.getElementById('exclusaoModal'));
    
    // Referências do Firebase
    const pedidosRef = database.ref('pedidos');
    const configRef = database.ref('config');
    
    // Inicialização
    verificarAutenticacao();
    inicializarListeners();
    
    // Botão de novo pedido em destaque com rolagem automática
    btnNovoPedidoDestaque.addEventListener('click', function() {
        document.getElementById('novo-tab').click();
        // Adicionar pequeno atraso para garantir que a aba seja exibida antes da rolagem
        setTimeout(function() {
            // Rolar para a seção de formulário
            const formElement = document.getElementById('formNovoPedido');
            formElement.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    });
    
    // Formulário de novo pedido
    formNovoPedido.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novoPedido = {
            nome: document.getElementById('nome').value,
            bloco: document.getElementById('bloco').value,
            apartamento: document.getElementById('apartamento').value,
            tipo: document.getElementById('tipo').value,
            descricao: document.getElementById('descricao').value,
            status: 'Aberto',
            data_criacao: formatarData(new Date()),
            data_conclusao: null,
            conclusao: null
        };
        
        adicionarPedido(novoPedido);
    });
    
    // Formulário de login
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const senha = document.getElementById('senha').value;
        
        login(senha);
    });
    
    // Botão de logout
    btnLogout.addEventListener('click', logout);
    
    // Formulário de conclusão
    formConclusao.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const pedidoId = document.getElementById('pedidoId').value;
        const conclusao = document.getElementById('conclusao').value;
        
        concluirPedido(pedidoId, conclusao);
    });
    
    // Botão de confirmação de exclusão
    btnConfirmarExclusao.addEventListener('click', function() {
        if (pedidoParaExcluir) {
            excluirPedido(pedidoParaExcluir);
        }
    });
    
    // Campos de busca
    searchAbertos.addEventListener('input', filtrarPedidosAbertos);
    searchConcluidos.addEventListener('input', filtrarPedidosConcluidos);
    
    // Filtros
    filterTipo.addEventListener('change', filtrarPedidosConcluidos);
    filterBloco.addEventListener('change', filtrarPedidosConcluidos);
    
    // Funções
    function inicializarListeners() {
        // Listener para pedidos (em tempo real)
        pedidosRef.on('value', function(snapshot) {
            atualizarPedidos(snapshot);
        });
    }
    
    function atualizarPedidos(snapshot) {
        pedidosAbertos = [];
        pedidosConcluidos = [];
        
        if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
                const pedido = childSnapshot.val();
                pedido.id = childSnapshot.key;
                
                if (pedido.status === 'Aberto') {
                    pedidosAbertos.push(pedido);
                } else if (pedido.status === 'Concluído') {
                    pedidosConcluidos.push(pedido);
                }
            });
        }
        
        // Atualizar contadores
        const contagem = {
            sugestoes: pedidosAbertos.filter(p => p.tipo === 'Sugestão').length,
            manutencoes: pedidosAbertos.filter(p => p.tipo === 'Manutenção').length,
            reclamacoes: pedidosAbertos.filter(p => p.tipo === 'Reclamação').length
        };
        
        countSugestoes.textContent = contagem.sugestoes;
        countManutencoes.textContent = contagem.manutencoes;
        countReclamacoes.textContent = contagem.reclamacoes;
        
        // Atualizar progresso
        const totalPedidos = pedidosAbertos.length + pedidosConcluidos.length;
        const percentual = totalPedidos > 0 ? Math.round((pedidosConcluidos.length / totalPedidos) * 100) : 0;
        
        percentConcluidos.textContent = percentual + '%';
        progressBar.style.width = percentual + '%';
        
        // Renderizar pedidos
        renderizarPedidosAbertos();
        renderizarPedidosConcluidos();
    }
    
    function renderizarPedidosAbertos() {
        if (pedidosAbertos.length === 0) {
            pedidosAbertosContainer.innerHTML = '<div class="alert alert-info">Não há pedidos abertos no momento.</div>';
            return;
        }
        
        let html = '';
        
        // Ordenar por data de criação (mais recentes primeiro)
        pedidosAbertos.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
        
        pedidosAbertos.forEach(pedido => {
            html += criarCardPedido(pedido, true);
        });
        
        pedidosAbertosContainer.innerHTML = html;
        
        // Adicionar event listeners para botões de ação
        document.querySelectorAll('.btn-concluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const pedidoId = this.getAttribute('data-id');
                document.getElementById('pedidoId').value = pedidoId;
                conclusaoModal.show();
            });
        });
        
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                pedidoParaExcluir = this.getAttribute('data-id');
                exclusaoModal.show();
            });
        });
        
        // Mostrar/esconder botões de administrador
        atualizarBotoesAdmin();
    }
    
    function renderizarPedidosConcluidos() {
        if (pedidosConcluidos.length === 0) {
            pedidosConcluidosContainer.innerHTML = '<div class="alert alert-info">Não há pedidos concluídos no momento.</div>';
            return;
        }
        
        let html = '';
        
        // Ordenar por data de conclusão (mais recentes primeiro)
        pedidosConcluidos.sort((a, b) => new Date(b.data_conclusao) - new Date(a.data_conclusao));
        
        pedidosConcluidos.forEach(pedido => {
            html += criarCardPedido(pedido, false);
        });
        
        pedidosConcluidosContainer.innerHTML = html;
        
        // Adicionar event listeners para botões de exclusão em pedidos concluídos
        document.querySelectorAll('.btn-excluir-concluido').forEach(btn => {
            btn.addEventListener('click', function() {
                pedidoParaExcluir = this.getAttribute('data-id');
                exclusaoModal.show();
            });
        });
        
        // Mostrar/esconder botões de administrador
        atualizarBotoesAdmin();
    }
    
    function criarCardPedido(pedido, aberto) {
        let tipoClass = '';
        
        switch (pedido.tipo) {
            case 'Sugestão':
                tipoClass = 'sugestao';
                break;
            case 'Manutenção':
                tipoClass = 'manutencao';
                break;
            case 'Reclamação':
                tipoClass = 'reclamacao';
                break;
        }
        
        let html = `
            <div class="card pedido-card ${tipoClass} mb-3">
                <div class="card-body">
                    <div class="pedido-header">
                        <span class="pedido-tipo ${tipoClass}">${pedido.tipo}</span>
                        <span class="pedido-data">${pedido.data_criacao}</span>
                    </div>
                    <div class="pedido-descricao">
                        <p>${pedido.descricao}</p>
                    </div>
                    <div class="pedido-footer">
                        <span class="pedido-solicitante">${pedido.nome}</span>
                        <span class="pedido-local">Bloco ${pedido.bloco}, Apto ${pedido.apartamento}</span>
                    </div>
        `;
        
        if (!aberto) {
            html += `
                    <hr>
                    <div class="conclusao-header">
                        <strong>Conclusão:</strong>
                        <span class="pedido-data">${pedido.data_conclusao}</span>
                    </div>
                    <div class="conclusao-descricao">
                        <p>${pedido.conclusao}</p>
                    </div>
                    <div class="mt-3 admin-actions" style="display: none;">
                        <button class="btn btn-danger btn-sm btn-excluir-concluido" data-id="${pedido.id}">
                            <i class="fas fa-trash me-1"></i> Excluir
                        </button>
                    </div>
            `;
        } else {
            html += `
                    <div class="mt-3 admin-actions" style="display: none;">
                        <button class="btn btn-success btn-sm btn-concluir" data-id="${pedido.id}">
                            <i class="fas fa-check me-1"></i> Concluir
                        </button>
                        <button class="btn btn-danger btn-sm btn-excluir" data-id="${pedido.id}">
                            <i class="fas fa-trash me-1"></i> Excluir
                        </button>
                    </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    function filtrarPedidosAbertos() {
        const termo = searchAbertos.value.toLowerCase();
        
        if (termo === '') {
            renderizarPedidosAbertos();
            return;
        }
        
        const pedidosFiltrados = pedidosAbertos.filter(pedido => 
            pedido.nome.toLowerCase().includes(termo) ||
            pedido.descricao.toLowerCase().includes(termo) ||
            pedido.tipo.toLowerCase().includes(termo) ||
            pedido.bloco.toString().includes(termo) ||
            pedido.apartamento.toString().includes(termo)
        );
        
        if (pedidosFiltrados.length === 0) {
            pedidosAbertosContainer.innerHTML = '<div class="alert alert-info">Nenhum pedido encontrado com os critérios de busca.</div>';
            return;
        }
        
        let html = '';
        
        pedidosFiltrados.forEach(pedido => {
            html += criarCardPedido(pedido, true);
        });
        
        pedidosAbertosContainer.innerHTML = html;
        
        // Adicionar event listeners para botões de ação
        document.querySelectorAll('.btn-concluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const pedidoId = this.getAttribute('data-id');
                document.getElementById('pedidoId').value = pedidoId;
                conclusaoModal.show();
            });
        });
        
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                pedidoParaExcluir = this.getAttribute('data-id');
                exclusaoModal.show();
            });
        });
        
        // Mostrar/esconder botões de administrador
        atualizarBotoesAdmin();
    }
    
    function filtrarPedidosConcluidos() {
        const termo = searchConcluidos.value.toLowerCase();
        const tipo = filterTipo.value;
        const bloco = filterBloco.value;
        
        if (termo === '' && tipo === '' && bloco === '') {
            renderizarPedidosConcluidos();
            return;
        }
        
        const pedidosFiltrados = pedidosConcluidos.filter(pedido => {
            const matchTermo = termo === '' || 
                pedido.nome.toLowerCase().includes(termo) ||
                pedido.descricao.toLowerCase().includes(termo) ||
                pedido.tipo.toLowerCase().includes(termo) ||
                pedido.bloco.toString().includes(termo) ||
                pedido.apartamento.toString().includes(termo) ||
                (pedido.conclusao && pedido.conclusao.toLowerCase().includes(termo));
                
            const matchTipo = tipo === '' || pedido.tipo === tipo;
            const matchBloco = bloco === '' || pedido.bloco.toString() === bloco;
            
            return matchTermo && matchTipo && matchBloco;
        });
        
        if (pedidosFiltrados.length === 0) {
            pedidosConcluidosContainer.innerHTML = '<div class="alert alert-info">Nenhum pedido encontrado com os critérios de busca.</div>';
            return;
        }
        
        let html = '';
        
        pedidosFiltrados.forEach(pedido => {
            html += criarCardPedido(pedido, false);
        });
        
        pedidosConcluidosContainer.innerHTML = html;
        
        // Adicionar event listeners para botões de exclusão em pedidos concluídos
        document.querySelectorAll('.btn-excluir-concluido').forEach(btn => {
            btn.addEventListener('click', function() {
                pedidoParaExcluir = this.getAttribute('data-id');
                exclusaoModal.show();
            });
        });
        
        // Mostrar/esconder botões de administrador
        atualizarBotoesAdmin();
    }
    
    function adicionarPedido(novoPedido) {
        // Gerar ID único para o pedido
        const novoPedidoRef = pedidosRef.push();
        
        // Adicionar ID ao pedido
        novoPedido.id = novoPedidoRef.key;
        
        // Salvar no Firebase
        novoPedidoRef.set(novoPedido)
            .then(() => {
                // Limpar formulário
                formNovoPedido.reset();
                
                // Mostrar mensagem de sucesso
                alert('Pedido registrado com sucesso!');
                
                // Voltar para a aba de pedidos abertos
                document.getElementById('abertos-tab').click();
            })
            .catch(error => {
                console.error('Erro ao adicionar pedido:', error);
                alert('Erro ao registrar pedido. Tente novamente mais tarde.');
            });
    }
    
    function verificarAutenticacao() {
        // Verificar se o usuário está autenticado (via localStorage)
        isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (isAdmin) {
            loginButton.classList.add('d-none');
            logoutButton.classList.remove('d-none');
        } else {
            loginButton.classList.remove('d-none');
            logoutButton.classList.add('d-none');
        }
        
        // Atualizar visibilidade dos botões de administrador
        atualizarBotoesAdmin();
    }
    
    function atualizarBotoesAdmin() {
        // Mostrar/esconder botões de administrador com base no status de autenticação
        document.querySelectorAll('.admin-actions').forEach(el => {
            el.style.display = isAdmin ? 'block' : 'none';
        });
    }
    
    function login(senha) {
        // Buscar senha do administrador no Firebase
        configRef.child('admin_password').once('value')
            .then(snapshot => {
                const adminPassword = snapshot.val() || '480013'; // Senha padrão se não estiver definida
                
                if (senha === adminPassword) {
                    // Armazenar status de autenticação
                    localStorage.setItem('isAdmin', 'true');
                    isAdmin = true;
                    
                    // Fechar modal
                    loginModal.hide();
                    
                    // Limpar formulário
                    formLogin.reset();
                    
                    // Atualizar interface
                    verificarAutenticacao();
                } else {
                    alert('Senha incorreta!');
                }
            })
            .catch(error => {
                console.error('Erro ao verificar senha:', error);
                
                // Fallback para senha padrão em caso de erro
                if (senha === '480013') {
                    localStorage.setItem('isAdmin', 'true');
                    isAdmin = true;
                    loginModal.hide();
                    formLogin.reset();
                    verificarAutenticacao();
                } else {
                    alert('Senha incorreta!');
                }
            });
    }
    
    function logout() {
        // Remover status de autenticação
        localStorage.removeItem('isAdmin');
        isAdmin = false;
        
        // Atualizar interface
        verificarAutenticacao();
    }
    
    function concluirPedido(pedidoId, conclusao) {
        // Buscar pedido atual
        pedidosRef.child(pedidoId).once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    const pedido = snapshot.val();
                    
                    // Atualizar status e adicionar conclusão
                    pedido.status = 'Concluído';
                    pedido.conclusao = conclusao;
                    pedido.data_conclusao = formatarData(new Date());
                    
                    // Salvar no Firebase
                    return pedidosRef.child(pedidoId).update(pedido);
                } else {
                    throw new Error('Pedido não encontrado');
                }
            })
            .then(() => {
                // Fechar modal
                conclusaoModal.hide();
                
                // Limpar formulário
                formConclusao.reset();
                
                // Mostrar mensagem de sucesso
                alert('Pedido concluído com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao concluir pedido:', error);
                alert('Erro ao concluir pedido. Tente novamente mais tarde.');
            });
    }
    
    function excluirPedido(pedidoId) {
        // Remover pedido do Firebase
        pedidosRef.child(pedidoId).remove()
            .then(() => {
                // Fechar modal
                exclusaoModal.hide();
                
                // Resetar variável
                pedidoParaExcluir = null;
                
                // Mostrar mensagem de sucesso
                alert('Pedido excluído com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao excluir pedido:', error);
                alert('Erro ao excluir pedido. Tente novamente mais tarde.');
            });
    }
    
    function formatarData(data) {
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        const hora = data.getHours().toString().padStart(2, '0');
        const minuto = data.getMinutes().toString().padStart(2, '0');
        
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    }
});
