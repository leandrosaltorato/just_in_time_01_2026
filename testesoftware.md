# 8 - Descritivo de Teste de Software

## 8.1 Ferramentas e Ambiente de Testes

### Ferramentas utilizadas

- Google Chrome para testes da interface Web
- Insomnia para testes das rotas da API
- Visual Studio Code para desenvolvimento e execução do projeto
- XAMPP para execução do servidor MySQL
- Prisma ORM para comunicação entre a aplicação e o banco de dados
- Node.js para execução do servidor Backend

### Ambiente de testes

- Sistema Web executado localmente
- Backend executado através do Node.js
- Banco de dados MySQL executado pelo XAMPP
- Banco de dados utilizado: `preparacao_db`
- ORM utilizado: Prisma
- Navegador utilizado: Google Chrome
- Testes realizados em ambiente de desenvolvimento local
- Testes realizados com usuário previamente cadastrado no banco de dados

---

## 8.2 Casos de Teste

### CT01 - Solicitar email e senha

**Requisito Funcional:** RF01.1

**Descrição:** Verificar se a interface de autenticação solicita email e senha

**Pré-condições:** O sistema deve estar acessível

**Passos:**

1. Acessar a tela de login
2. Verificar se o campo de email está disponível
3. Verificar se o campo de senha está disponível
4. Verificar se o botão de entrada está disponível

**Resultado Esperado:** Os campos de email e senha e o botão de entrada devem estar disponíveis

---

### CT02 - Validar credenciais do usuário

**Requisito Funcional:** RF01.2

**Descrição:** Verificar se o sistema valida as credenciais informadas pelo usuário

**Pré-condições:** Deve existir um usuário cadastrado no banco de dados

**Passos:**

1. Acessar a tela de login
2. Informar um email válido
3. Informar uma senha válida
4. Clicar no botão de entrada

**Resultado Esperado:** O sistema deve validar as credenciais e permitir o acesso ao sistema

---

### CT03 - Falha de autenticação

**Requisito Funcional:** RF01.2

**Descrição:** Verificar o tratamento de credenciais inválidas

**Pré-condições:** O sistema deve estar acessível

**Passos:**

1. Acessar a tela de login
2. Informar um email inválido ou não cadastrado
3. Informar uma senha incorreta
4. Clicar no botão de entrada

**Resultado Esperado:** O sistema deve informar que as credenciais são inválidas e impedir o acesso

---

### CT04 - Redirecionamento após login

**Requisito Funcional:** RF01.3

**Descrição:** Verificar se o usuário autenticado é redirecionado para a interface principal

**Pré-condições:** Deve existir um usuário válido cadastrado no banco de dados

**Passos:**

1. Acessar a tela de login
2. Informar email e senha válidos
3. Clicar no botão de entrada

**Resultado Esperado:** O usuário deve ser redirecionado para a interface principal do sistema

---

### CT05 - Exibir nome do usuário

**Requisito Funcional:** RF02.1

**Descrição:** Verificar se o nome do usuário autenticado é exibido na interface principal

**Pré-condições:** O usuário deve estar autenticado

**Passos:**

1. Realizar login com um usuário válido
2. Acessar a interface principal
3. Verificar a área destinada às informações do usuário

**Resultado Esperado:** O nome do usuário autenticado deve ser exibido

---

### CT06 - Acessar cadastro de produtos

**Requisito Funcional:** RF02.2

**Descrição:** Verificar se é possível acessar a interface de cadastro de produtos

**Pré-condições:** O usuário deve estar autenticado

**Passos:**

1. Acessar a interface principal
2. Localizar a opção Produtos
3. Clicar na opção Produtos

**Resultado Esperado:** O sistema deve abrir a interface de cadastro de produtos

---

### CT07 - Acessar gestão de produção

**Requisito Funcional:** RF02.3

**Descrição:** Verificar se é possível acessar a interface de gestão de produção

**Pré-condições:** O usuário deve estar autenticado

**Passos:**

1. Acessar a interface principal
2. Localizar a opção Produção
3. Clicar na opção Produção

**Resultado Esperado:** O sistema deve abrir a interface de gestão de produção

---

### CT08 - Realizar logout

**Requisito Funcional:** RF02.4

**Descrição:** Verificar se o usuário consegue sair do sistema

**Pré-condições:** O usuário deve estar autenticado

**Passos:**

1. Acessar qualquer interface do sistema
2. Clicar no botão Sair
3. Verificar a página apresentada

**Resultado Esperado:** O sistema deve remover os dados da sessão e redirecionar o usuário para a tela de login

---

### CT09 - Listar produtos

**Requisito Funcional:** RF03.1

**Descrição:** Verificar se os produtos cadastrados são listados automaticamente

**Pré-condições:** Deve existir pelo menos um produto cadastrado no banco de dados

**Passos:**

1. Realizar login
2. Acessar a interface de produtos
3. Verificar a tabela de produtos

**Resultado Esperado:** Os produtos cadastrados devem ser exibidos automaticamente na tabela

---

### CT10 - Buscar produto

**Requisito Funcional:** RF03.2

**Descrição:** Verificar se a busca de produtos funciona corretamente

**Pré-condições:** Devem existir produtos cadastrados

**Passos:**

1. Acessar a interface de produtos
2. Informar o nome ou parte do nome de um produto no campo de busca
3. Clicar no botão Buscar

**Resultado Esperado:** A tabela deve ser atualizada exibindo os produtos correspondentes ao termo pesquisado

---

### CT11 - Cadastrar produto

**Requisito Funcional:** RF03.3

**Descrição:** Verificar se é possível cadastrar um novo produto

**Pré-condições:** O usuário deve estar autenticado

**Passos:**

1. Acessar a interface de produtos
2. Informar o nome do produto
3. Informar a descrição
4. Informar o custo
5. Informar a quantidade em estoque
6. Informar o estoque mínimo
7. Clicar no botão Cadastrar

**Resultado Esperado:** O produto deve ser cadastrado no banco de dados e aparecer na listagem

---

### CT12 - Editar produto

**Requisito Funcional:** RF03.4

**Descrição:** Verificar se é possível editar um produto existente

**Pré-condições:** Deve existir um produto cadastrado

**Passos:**

1. Acessar a interface de produtos
2. Localizar um produto na tabela
3. Clicar na opção de edição
4. Alterar uma ou mais informações
5. Salvar a alteração

**Resultado Esperado:** As informações do produto devem ser atualizadas no banco de dados e na tabela

---

### CT13 - Excluir produto

**Requisito Funcional:** RF03.5

**Descrição:** Verificar se é possível excluir um produto existente

**Pré-condições:** Deve existir um produto cadastrado

**Passos:**

1. Acessar a interface de produtos
2. Localizar um produto na tabela
3. Clicar na opção de exclusão
4. Confirmar a exclusão caso seja solicitada

**Resultado Esperado:** O produto deve ser removido do banco de dados e da listagem

---

### CT14 - Validar cadastro de produto

**Requisito Funcional:** RF03.6

**Descrição:** Verificar se o sistema impede o cadastro de dados inválidos ou campos obrigatórios vazios

**Pré-condições:** O usuário deve estar autenticado

**Passos:**

1. Acessar a interface de produtos
2. Deixar um ou mais campos obrigatórios vazios
3. Clicar no botão Cadastrar

**Resultado Esperado:** O sistema deve impedir o cadastro e informar que os campos obrigatórios devem ser preenchidos

---

### CT15 - Retornar para interface principal

**Requisito Funcional:** RF03.7

**Descrição:** Verificar se o usuário consegue retornar para a interface principal

**Pré-condições:** O usuário deve estar autenticado

**Passos:**

1. Acessar a interface de produtos
2. Clicar no botão Voltar

**Resultado Esperado:** O sistema deve retornar para a interface principal

---

### CT16 - Listar produtos em ordem alfabética

**Requisito Funcional:** RF04.1

**Descrição:** Verificar se os produtos são apresentados em ordem alfabética na gestão de produção

**Pré-condições:** Devem existir pelo menos três produtos cadastrados com nomes diferentes

**Passos:**

1. Acessar a interface de gestão de produção
2. Observar a lista de produtos
3. Comparar a ordem dos nomes apresentados

**Resultado Esperado:** Os produtos devem ser apresentados em ordem alfabética

---

### CT17 - Selecionar produto para movimentação

**Requisito Funcional:** RF04.2

**Descrição:** Verificar se o usuário consegue selecionar um produto e o tipo de movimentação

**Pré-condições:** Devem existir produtos cadastrados

**Passos:**

1. Acessar a interface de gestão de produção
2. Abrir a seleção de produtos
3. Selecionar um produto
4. Selecionar o tipo Fabricado ou Pedido
5. Informar a quantidade

**Resultado Esperado:** O sistema deve permitir selecionar o produto, o tipo de movimentação e a quantidade

---

### CT18 - Registrar produção

**Requisito Funcional:** RF04.2

**Descrição:** Verificar se uma movimentação do tipo Fabricado aumenta o estoque

**Pré-condições:** Deve existir um produto cadastrado

**Passos:**

1. Acessar a gestão de produção
2. Selecionar um produto
3. Selecionar o tipo Fabricado
4. Informar uma quantidade válida
5. Informar a data
6. Clicar em Registrar

**Resultado Esperado:** A quantidade informada deve ser adicionada ao estoque do produto

---

### CT19 - Registrar pedido

**Requisito Funcional:** RF04.2

**Descrição:** Verificar se uma movimentação do tipo Pedido diminui o estoque

**Pré-condições:** Deve existir um produto com quantidade suficiente em estoque

**Passos:**

1. Acessar a gestão de produção
2. Selecionar um produto
3. Selecionar o tipo Pedido
4. Informar uma quantidade válida
5. Informar a data
6. Clicar em Registrar

**Resultado Esperado:** A quantidade informada deve ser retirada do estoque do produto

---

### CT20 - Informar data da movimentação

**Requisito Funcional:** RF04.3

**Descrição:** Verificar se o usuário consegue informar a data da movimentação

**Pré-condições:** O usuário deve estar autenticado

**Passos:**

1. Acessar a gestão de produção
2. Selecionar um produto
3. Selecionar o tipo de movimentação
4. Informar uma data válida
5. Informar a quantidade
6. Registrar a movimentação

**Resultado Esperado:** A movimentação deve ser registrada utilizando a data informada

---

### CT21 - Alertar estoque abaixo do mínimo

**Requisito Funcional:** RF04.4

**Descrição:** Verificar se o sistema gera um alerta quando o estoque fica abaixo do mínimo

**Pré-condições:** Deve existir um produto com estoque mínimo configurado

**Passos:**

1. Acessar a gestão de produção
2. Selecionar um produto
3. Selecionar o tipo Pedido
4. Informar uma quantidade que faça o estoque ficar abaixo do mínimo
5. Informar a data
6. Registrar a movimentação

**Resultado Esperado:** O sistema deve atualizar o estoque e apresentar um alerta informando que o estoque está abaixo do mínimo

---

### CT22 - Impedir quantidade inválida

**Requisito Funcional:** RF04.2

**Descrição:** Verificar se o sistema impede movimentações com quantidade menor ou igual a zero

**Pré-condições:** O usuário deve estar autenticado

**Passos:**

1. Acessar a gestão de produção
2. Selecionar um produto
3. Selecionar o tipo de movimentação
4. Informar quantidade igual a zero ou menor que zero
5. Tentar registrar a movimentação

**Resultado Esperado:** O sistema deve impedir o registro e informar que a quantidade deve ser maior que zero
