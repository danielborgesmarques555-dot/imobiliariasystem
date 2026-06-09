# Regis Imobiliaria

Sistema local para gestao da imobiliaria e vitrine publica de imoveis disponiveis.

## Site publico

- A vitrine publica exibe automaticamente apenas imoveis com disponibilidade ativa.
- Quando um imovel fica indisponivel no sistema interno, ele deixa de aparecer no site.
- Visitantes nao precisam de login para consultar imoveis e entrar em contato.

## Login e usuarios

- Usuarios sao cadastrados em `Configuracoes > Usuarios`.
- No primeiro login, o usuario informa o email cadastrado e a senha digitada passa a ser sua senha atual.
- O usuario pode alterar a propria senha em `Configuracoes > Minha senha`.
- Se esquecer a senha, o usuario solicita recuperacao na tela de login.
- O administrador libera a nova senha em `Configuracoes > Usuarios`.
- Depois da liberacao, no proximo login do usuario, a senha digitada passa a ser a nova senha.

## Niveis de acesso

- `Administrador`: acesso total. Pode mexer em imoveis, clientes, contratos, faturas, equipe, configuracoes, aparencia, backup e permissoes.
- `Gerente`: acompanha quase toda a operacao, cadastra e edita registros, ve relatorios e contratos, mas nao altera configuracoes criticas nem permissoes de outros usuarios.
- `Operacional`: uso do dia a dia. Pode cadastrar imoveis, clientes, proprietarios, agendamentos e faturas, com menos poder sobre contratos, exclusoes e configuracoes.
- `Somente visualizacao`: apenas consulta. Nao salva, edita, exclui nem altera status.

## Permissoes liberadas

As permissoes controlam quais modulos o usuario pode acessar, independentemente do cargo.

- `Cadastros`: permite cadastrar e editar proprietarios, clientes e imoveis.
- `Imoveis`: permite ver e gerenciar a carteira de imoveis.
- `Clientes`: permite acessar dados dos clientes.
- `Contratos`: permite consultar, emitir, assinar, rescindir ou baixar contratos conforme o nivel de acesso.
- `Faturas`: permite criar cobrancas, registrar pagamentos e baixar faturas.
- `Agendamentos`: permite criar visitas, manutencoes e concluir agenda.
- `Relatorios`: permite ver painel e indicadores.
- `Configuracoes`: permite acessar ferramentas de configuracao conforme o nivel de acesso.

## Observacao de seguranca

Este projeto e um app estatico/local que salva dados no navegador. Para uso em producao, o ideal e ter backend, banco de dados e senhas protegidas com hash.

## Deploy

O projeto esta preparado para GitHub e publicacao estatica.

Arquivos principais:

- `index.html`
- `styles.css`
- `script.js`
- `assets/`

Documentacao de publicacao:

- `DEPLOY.md`
- `deploy/nginx-regis-imobiliaria.conf`
- `deploy/Caddyfile`
- `.env.example`

## GitHub

Fluxo recomendado:

```powershell
git branch -M main
git add .
git commit -m "Versao inicial do sistema imobiliario"
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

## Producao

Para colocar em dominio real, sera necessario:

- dominio comprado;
- hospedagem ou servidor;
- HTTPS/SSL;
- GitHub conectado;
- backup;
- backend para banco, storage, Google Maps e WhatsApp quando sair do modo local.
