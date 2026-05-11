# 📦 Sistema de Gestão de Encomendas — Mercado Central BH

<div align="center">

![Status](https://img.shields.io/badge/status-produção-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v22%20LTS-339933?logo=node.js&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoftsqlserver&logoColor=white)
![License](https://img.shields.io/badge/licença-visualização%20permitida-blue)

> Sistema interno de rastreamento e gestão de encomendas desenvolvido para o **Mercado Central BH**, com suporte a múltiplos dispositivos, sincronização em tempo real e leitor de código de barras.

</div>

---

## 📋 Sobre o Projeto

Sistema web completo para controle de encomendas recebidas na central do Mercado Central BH. Permite que a equipe registre, acompanhe e entregue encomendas de forma organizada, com acesso simultâneo de múltiplos dispositivos via rede interna.

---

## ✨ Funcionalidades

- 📷 **Leitor de código de barras** via câmera do celular (Correios, Jadlog, Mercado Livre, Shopee, TikTok Shop e outros)
- 🔄 **Sincronização em tempo real** entre todos os dispositivos a cada 15 segundos
- 📶 **Modo offline** com fila de pendentes — dados sincronizados automaticamente ao voltar a internet
- 👥 **Controle de perfis** — Gerente de Sistemas, Admin e Aprendiz com permissões individuais
- 📊 **Relatórios** com busca, paginação e modo compacto
- 💾 **Backup automático** agendado (diário, semanal, ao sair)
- 📱 **Responsivo** — funciona em celular, tablet e computador
- 🔒 **HTTPS** com certificado SSL para acesso seguro em rede
- 🔐 **Rate limiting** — bloqueio automático após 5 tentativas de login incorretas
- 🏪 **Cadastro de clientes** por loja e corredor
- 📷 **Fotos de perfil** para membros da equipe

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript puro |
| Backend atual | Node.js + HTTPS nativo |
| Banco atual | JSON file (`db.json`) |
| Banco futuro | Microsoft SQL Server 2022 |
| Scanner | html5-qrcode v2.3.8 |
| Processo | PM2 (produção) |

---

## 🚀 Como Executar (Ambiente Local)

### Pré-requisitos

- [Node.js v22 LTS](https://nodejs.org/en/download)
- Windows 10/11

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/mcbh-encomendas.git

# 2. Entre na pasta
cd mcbh-encomendas/servidor_local_8501

# 3. Inicie o servidor
INICIAR_SERVIDOR.bat
```

### Acesso

```
https://localhost:8501
```

> ⚠️ Na primeira abertura o navegador exibirá aviso de certificado autoassinado.  
> Clique em **"Avançado"** → **"Continuar assim mesmo"**. Isso é necessário apenas uma vez por dispositivo.

---

## 🗂️ Estrutura do Projeto

```
servidor_local_8501/
├── Mercado_central_bh_v3.html  ← aplicação completa (frontend + lógica)
├── servidor.js                 ← servidor HTTPS Node.js
├── INICIAR_SERVIDOR.bat        ← inicialização no Windows
├── cert.pem                    ← certificado SSL
├── key.pem                     ← chave SSL
├── LEIA-ME.md                  ← instruções de uso
└── dados/
    └── db.json                 ← banco de dados local (não commitar)
```

---

## 👥 Perfis de Acesso

| Perfil | Permissões |
|---|---|
| **Gerente de Sistemas** | Acesso total, backup, exclusão de encomendas e contas |
| **Admin** | Gerencia equipe, registra e atualiza encomendas |
| **Aprendiz** | Apenas marca encomendas como entregues |

---

## 🔒 Segurança

- Comunicação via **HTTPS** (certificado SSL)
- Senhas armazenadas com **hash** criptográfico
- **Rate limiting**: 5 tentativas → bloqueio de 2 minutos
- Conta do Gerente de Sistemas protegida contra exclusão
- Permissões por perfil em todas as rotas e ações

---

## 📱 Acesso em Rede

Para acessar de outros dispositivos na mesma rede:

```
https://IP_DA_MÁQUINA_SERVIDORA:8501
```

O IP é exibido automaticamente na janela do servidor ao iniciar.

---

## 🗄️ Migração para SQL Server

O sistema está sendo migrado para **Microsoft SQL Server 2022**. O banco `mc_encomendas` já foi criado na infraestrutura da empresa.

**Pendente:** configuração das credenciais e geração dos arquivos do backend SQL.

---

## 📄 Licença

[![License](https://img.shields.io/badge/licença-visualização%20permitida-blue)](#)

Visualização permitida — uso, cópia e redistribuição proibidos.  
Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.  
Para solicitar autorização de uso: ✉️ arturg_oliveira@outlook.com

---

## 👨‍💻 Desenvolvedor

**Artur Gabriel Oliveira da Silva**  
Gerente de Sistemas — Mercado Central BH  
✉️ [arturg_oliveira@outlook.com](mailto:arturg_oliveira@outlook.com)
