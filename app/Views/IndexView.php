    <?=view("static/HeaderView.php");?>
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
                        <div class="card-footer" >
                            <a href="<?=base_url('/register')?>" class="btn btn-success">Cadastro</a>
                            <a href="<?=base_url('/login')?>" class="btn btn-primary">Login</a>
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