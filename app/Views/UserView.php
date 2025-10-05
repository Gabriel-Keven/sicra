<?=view("static/HeaderView.php");?>
<?=view("static/MenuView.php");?>
<?=view("static/HeaderView.php");?>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-10 col-lg-6">
                <div class="alert alert-primary d-none" role="alert" id="message">
                       <p class="text-center" id="contentMessage"></p>
                    </div>
                <div class="card">
                    <div class="card-header text-center">
                        <h4>Atualizar seus dados</h4>
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
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <label for="password">Se desejar digite uma nova senha. Se não alterar, será mantida a senha.</label>
                                <input 
                                    type="password"
                                    id="password" 
                                    name="password"
                                    class="form-control"
                                    placeholder="Digite aqui sua senha." 
                                >
                            </div>
                            </div>
                            <div class="card-footer">
                                <button type="submit" class="mt-3 btn btn-success btn-block" id="buttonUpdate">Atualizar</button>
                                <br>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>
</body>
<script src="<?php echo base_url();?>/utils/js/user.js"></script>
<!-- Biblioteca para realizar a criptografia -->
<script src="https://cdn.jsdelivr.net/npm/jsencrypt@latest/bin/jsencrypt.min.js"></script>
</html>