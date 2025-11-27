# SICRA - Sistema de Criptografia de Arquivos

![PHP](https://img.shields.io/badge/PHP-8.1-777BB4?style=for-the-badge&logo=php)
![CodeIgniter](https://img.shields.io/badge/CodeIgniter-4.0-EF4223?style=for-the-badge&logo=codeigniter)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> **Projeto de Trabalho de Conclusão de Curso (TCC)**
> Engenharia de Controle e Automação

## O Projeto

O **SICRA** é um protótipo web desenvolvido para garantir a confidencialidade e integridade no armazenamento e compartilhamento de arquivos. O projeto visa resolver o problema de segurança na troca de informações sensíveis utilizando **Criptografia Híbrida**.

## A Criptografia (Arquitetura)

O SICRA foi idealizaod para implementar a criptografia híbrida para otimizar desempenho e segurança:

1.  **Criptografia do Arquivo (AES-256):**
    * O arquivo enviado é criptografado usando o algoritmo simétrico **AES** (Advanced Encryption Standard) com uma chave aleatória gerada para aquela sessão. Isso garante velocidade no processamento de arquivos grandes.

2.  **Proteção da Chave (RSA):**
    * A chave AES gerada no passo anterior é criptografada utilizando a **Chave Pública RSA** do destinatário.
    * Apenas o dono da **Chave Privada** correspondente consegue descriptografar a chave AES e, consequentemente, acessar o conteúdo do arquivo.

3.  **Estrutura do Arquivo Final:**
    * O arquivo salvo no servidor contém: `[Chave AES Cifrada] + [IV] + [Conteúdo do Arquivo Cifrado]`.

## Tecnologias Utilizadas

* **Linguagem:** PHP 8.1+
* **Framework:** CodeIgniter 4
* **Criptografia:** OpenSSL Library (AES-256-CBC, RSA-2048)
* **Ambiente:** Docker & Docker Compose
* **Servidor Web:** Apache / Nginx
* **Banco de Dados:** MySQL/MariaDB

## Instalação e Execução

### Opção 1: Via Docker (Recomendado)

Certifique-se de ter o Docker e o Docker Compose instalados.

1. Clone o repositório:
   ```bash
   git clone [https://github.com/Gabriel-Keven/sicra.git](https://github.com/Gabriel-Keven/sicra.git)
   cd sicra
2. Configure as variáveis de ambiente:
```Bash
    cp env .env
    # Edite o arquivo .env se necessário (configurações de DB, baseURL, etc)
```
3. Suba os containers:
```bash

    docker-compose up -d --build
```
4. Acesse o sistema: Abra o navegador em http://localhost:8080 (ou a porta configurada).

Opção 2: Instalação Manual

1. Instale as dependências via Composer:
```bash

composer install
```
2. Inicie o servidor embutido do CodeIgniter:
```bash

    php spark serve
```
Contribuição

Este é um projeto acadêmico. Sugestões e feedbacks são bem-vindos para fins de aprendizado e melhoria da arquitetura de segurança.

Desenvolvido por Gabriel Keven