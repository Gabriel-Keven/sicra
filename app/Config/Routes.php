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
// Register

// Crypto
//1 - Página Incial do Login
$routes->get('/crypto', 'CryptoController::index');

//2 - Método de inserir a chave pública no banco de dados
$routes->post('insertPublicKey', 'CryptoController::insertPublicKey');

//3 - Método para verificar se as chaves já foram geradas
$routes->post('checkPublicKey', 'CryptoController::checkPairOfKeysIsCreated');

//4 - Método para deletar a chave pública
$routes->post('deletePublicKey', 'CryptoController::deletePublicKey');

//5 - Método para verificar usuários que têm a chave pública
$routes->post('searchUsersHavePublicKey', 'CryptoController::searchUsersHavePublicKey');

// Crypto