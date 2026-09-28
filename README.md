# Habit & Workout Tracker ⚡

Aplicativo moderno e futurista de acompanhamento de hábitos, rotina e treinos com suporte multiusuário, divisão semanal, painéis laterais de exercícios, anotações e suporte a PWA mobile.

![Design Preview](public/icon.svg)

## 🚀 Principais Funcionalidades

- **Treinos Integrados na Rotina Diária**:
  - Clique na atividade de treino de qualquer dia (Terça Musculação A, Quarta Complementar, Quinta Musculação B, etc.) para abrir a ficha completa ao lado com séries, repetições, taxas de esforço (RIR), tempo de descanso e registro de cargas automático.
- **Visualização de Abas Lado a Lado (Desktop) e Bottom Sheet (Mobile)**:
  - Todo hábito ou evento pode ser aberto para visualizar diário, anotações detalhadas, cronômetro de foco e lista de subetapas/checklists.
- **Aba "Treinos" com Plano Transcrito**:
  - Transcrição fiel do plano de treino oficial de 1 página com checkboxes interativos na frente de cada exercício e indicador percentual de progresso.
- **Tema Claro e Escuro (Light / Dark Mode)**:
  - Alternância instantânea de tema no cabeçalho ou nas configurações.
- **Multiusuário com Login e Senha**:
  - Cada usuário possui sua própria conta, rotinas, hábitos, anotações e fichas salvas de forma privada.
- **Design Minimalista & Responsivo**:
  - Estilo de interface mobile similar ao React Native com safe-area insets para iOS e Android.
  - Suporte a instalação como PWA (tela cheia).

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express, Vite
- **Persistência**: Armazenamento local seguro com sincronização de banco de dados (`data/db.json`)

## 📦 Como Rodar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd NOME_DO_REPOSITORIO
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no navegador:
```
http://localhost:3000
```

## 🏗️ Build de Produção

```bash
npm run build
npm start
```
