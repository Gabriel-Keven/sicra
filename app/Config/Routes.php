<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
// Index
$routes->get('/', 'IndexController::index');


// Register
//1 - Página Incial do cadastro do usuário
$routes->get('/register', 'RegisterController::index');

//2 - Método de cadastar usuário
$routes->post('register', 'RegisterController::createUser');

// Register
// Login
//1 - Página Incial do Login
$routes->get('/login', 'LoginController::index');

//2 - Método de login do usuário
$routes->post('login', 'LoginController::login');

//3 - Método logout
$routes->get('logout', 'LoginController::logout');

// Register

// Crypto
//1 - Página Incial de criptografia arquivo
$routes->get('/crypto', 'CryptoController::index');

//2 - Método de inserir a chave pública no banco de dados
$routes->post('insertPublicKey', 'CryptoController::insertPublicKey');

//3 - Método para verificar se as chaves já foram geradas
$routes->post('checkPublicKey', 'CryptoController::checkPublicKey');

//4 - Método para deletar a chave pública
$routes->post('deletePublicKey', 'CryptoController::deletePublicKey');

//5 - Método para verificar usuários que têm a chave pública
$routes->post('searchUsersHavePublicKey', 'CryptoController::searchUsersHavePublicKey');

//6 - Método que recebe o arquivo criptografado do JS
$routes->post('sendFileCrypted', 'CryptoController::sendFileCrypted');

// Crypto

// Descrypto

//1 - Página Incial de descriptografia arquivo
$routes->get('/descrypto', 'DescryptoController::index');

//2 - Método para verificar os arquivos enviados
$routes->post('searchCryptedFiles', 'DescryptoController::searchCryptedFiles');

//2 - Obter o arquivo criptografado
$routes->post('getEncryptedFile', 'DescryptoController::getEncryptedFile');

// Rota para a API que baixa o conteúdo JSON do arquivo
$routes->get('/files/download/(:num)', 'DescryptoController::downloadFile/$1');

// Descrypto

// User

//1 - Página Incial de descriptografia arquivo
$routes->get('/user', 'UserController::index');

//2 - Obter dados do usuário do banco de dados
$routes->post('getDateUser', 'UserController::getDateUser');

//2 - Atualizar os dados do usuário no banco de dados
$routes->post('updateUser', 'UserController::updateUser');

// User