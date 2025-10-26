<?=view("static/HeaderView.php");?>
<?=view("static/MenuView.php");?>
 <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-10 col-lg-12">
                <div class="alert alert-primary d-none" role="alert" id="message">
                    <p class="text-center" id="contentMessage"></p>
                </div>
                <div class="card">
                    <div class="card-header text-center">
                        <h4>Seus arquivos disponíveis para download</h4>
                    </div>
                    <div class="card-body">
                        <table class="table" id="tableDownloadsFile">
                            <thead id="">
                                <tr>
                                <th>Id do Upload</th>
                                <th>Id do Emissor</th>
                                <th>Nome do Emissor</th>
                                <th>Nome do arquivo</th>
                                <th>Data do envio</th>
                                </tr>
                            </thead>
                            <tbody id="tableDownloadsFileContent">
                                
                            </tbody>
                        </table>
                        <form class="form-control" method="POST">
                            <div class="form-group">
                                <label for="file">Selecione o arquivo que você deseja baixar.</label>
                                <select class="form-control" id="selectIdSender">
                                    <option value="">Selecione o arquivo que deseja fazer download.</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="file">Fazer upload da chave privada(Não divgulge para ninguém)</label>
                                <input type="file" class="form-control" id="privateKeyInput" placeholder="Envie a chave privada aqui" accept=".pem" required>
                            </div>
                            <button type="submit" class="mt-3 btn btn-success btn-block" id="buttonDownloadFile">Baixar Arquivo descriptografado</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
<script src="<?php echo base_url();?>/utils/js/descrypto.js"></script>
<!-- Biblioteca para realizar a criptografia -->
<script src="https://cdn.jsdelivr.net/npm/jsencrypt@latest/bin/jsencrypt.min.js"></script>
</html>