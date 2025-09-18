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
            <div class="col-md-6 col-lg-4">
                <div class="card">
                    <div class="card-header text-center">
                        <h4>SICRA - Sistema de Criptografia - MVP</h4>
                    </div>
                    <div class="card-body">
                        <p>IFMG - Campus Betim</p>
                        <p>Nome: Gabriel Keven</p>
                        <p>Sistema desenvolvido como o trabalho final do curso de Engenharia de Controle e Automação.</p>
                        <div class="col-md-6">
                             <a href="<?=base_url('/register')?>" class="btn btn-success">Tela de Cadastro</a>
                        </div>
                       <div class="mt-3 col-md-6">
                            <a href="<?=base_url('/login')?>" class="btn btn-primary">Tela de Login</a>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>
<script src="<?php echo base_url();?>/utils/js/index.js"></script>
<!-- Biblioteca para realizar a criptografia -->
<script src="https://cdn.jsdelivr.net/npm/jsencrypt@latest/bin/jsencrypt.min.js"></script>
</html>