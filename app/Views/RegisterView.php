<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SICRA - Sistema de Criptografia RSA para arquivos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-10 col-lg-6">
                <div class="alert alert-primary d-none" role="alert" id="message">
                       <p class="text-center" id="contentMessage"></p>
                    </div>
                <div class="card">
                    <div class="card-header text-center">
                        <h4>Cadastrar novo usuário</h4>
                    </div>
                    <div class="card-body">
                        <form method="POST">
                            <div class="form-group">
                                <label for="name">Nome Completo</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    class="form-control" 
                                    placeholder="Digite aqui o nome completo." 
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <label for="email">E-mail</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    class="form-control" 
                                    placeholder="Digite aqui o seu melhor e-mail." 
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <label for="password">Senha</label>
                                <input 
                                    type="password"
                                    id="password" 
                                    name="password"
                                    class="form-control"
                                    placeholder="Digite aqui sua senha." 
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirme a Senha</label>
                                <input  
                                    type="password" 
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    class="form-control"
                                    placeholder="Confirme sua senha." 
                                    required
                                >
                            </div>
                            <button type="submit" class="mt-3 btn btn-success btn-block" id="registerButton">Cadastrar</button>
                            <br>
                            <a href="<?=base_url('/login')?>" class="mt-3 btn btn-primary btn-block">Tela de Login</a>
                            <a href="<?=base_url('/')?>" class="mt-3 btn btn-secondary btn-block">Tela Inicial</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>
<script src="<?php echo base_url();?>/utils/js/register.js"></script>
<!-- Biblioteca para realizar a criptografia -->
<script src="https://cdn.jsdelivr.net/npm/jsencrypt@latest/bin/jsencrypt.min.js"></script>
</html>