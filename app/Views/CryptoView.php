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
                        <h4>Criação das chaves públicas e privadas.</h4>
                    </div>
                    <div class="card-body">
                        <div id="cardFirstCreatePairOfKeys" class="d-none">
                            <p>Primeira vez? Clique no botão abaixo para gerar o par de chaves.
                            </p>
                            <p>
                                <b>Atenção:</b>
                                Lembre-se que a chave privada NÃO pode ser divulgada a ninguém. Essa chave será baixada automaticamente para o computador.
                            </p>
                            <p>
                                A chave pública, por sua vez, será compartilhada com outros usuários e estará disponível para sua visualização nesse sistema.
                            </p>
                            <button type="button" class="mt-3 btn btn-success btn-block" id="buttonFirstPairKeys">Criar Par de Chaves</button>
                        </div>
                        <div id="cardCreateNewPairOfKeys" class="d-none">
                            <h5 class="text-center">As chaves estão criadas.</h5>
                            <p class="text-justify">Para criar um novo par de chaves clique no botão abaixo.</p>
                            <p class="text-justify"><b>Atenção:</b>
                                Após criar um novo par de chaves, a chave pública atual será descartada e uma nova chave privada será criada.
                            </p>
                            <button type="button" class="mt-3 btn btn-primary btn-block" id="buttonNewPairKeys">Criar Novo Par de Chaves</button>
                        </div>
                        <div id="cardDeletePairOfKeys" class="mt-3 d-none">
                            <p class="text-justify">Para deletar a chave pública clique no botão abaixo.</p>
                            <p class="text-justify"><b>Atenção:</b>
                                Após deletar a chave pública, descarte a chave privada. Além disso, você estará sem um par de chaves.
                            </p>
                            <button type="button" class="mt-3 btn btn-danger btn-block" id="buttonDeletePublicKey">Deletar Atual Par de Chaves</button>
                        </div>
                        <div id="cardTablePublicKey" class="table-responsive mt-3">
                            <table class="table" id="tablePublicKey">
                                <thead id="tablePublicKeyHeader">
                                    <tr>
                                    <th scope="col">Chave Pública</th>
                                    </tr>
                                </thead>
                                <tbody id="tablePublicKeyContent">
                                    
                                </tbody>
                            </table>
                        </div>
                        <div id="cardTablePublicKeyUsers" class="table-responsive mt-3 ">
                            <h4>Usuários disponíveis para enviar o arquivo.</h4>
                            <table class="table">
                                <thead class="tablePublicKeyUsersHeader">
                                    <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Chave Pública</th>
                                    </tr>
                                </thead>
                                <tbody id="tablePublicKeyUsersContent">
                                </tbody>
                            </table>
                        </div>
                        <form>
                                <!-- Colocar verificação se a chave já foi criada e em seguida no outro usuário colocar a opção de enviar o arquivo para o gerador da chave -->
                            <div class="form-group">
                                <!-- <label for="file">Fazer upload do arquivo</label> -->
                                <!-- <input type="file" class="form-control" id="file" placeholder="Envie aqui o arquivo" required> -->
                            </div>
                            <!-- <button type="submit" class="mt-3 btn btn-primary btn-block" id="buttonSend">Enviar</button> -->
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>
<script src="<?php echo base_url();?>/utils/js/crypto.js"></script>
<!-- Biblioteca para realizar a criptografia -->
<script src="https://cdn.jsdelivr.net/npm/jsencrypt@latest/bin/jsencrypt.min.js"></script>
</html>