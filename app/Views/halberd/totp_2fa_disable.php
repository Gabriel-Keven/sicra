<?= $this->extend(config('Halberd')->views['layout']) ?>
<?= $this->section('main') ?>
<link rel="stylesheet" href="<?= base_url(config('TOTP')->stylesheet) ?>">

<div class="totp-container">

    <h2><?= lang('Auth.2FAHeader') ?></h2>

    <p><?= lang('Auth.2FADisable') ?></p>

    <?= form_open(url_to('2fa-disable'), 'class="totp-form"') ?>
        <input type="submit" value="<?= lang('Auth.2FADisable') ?>">
    <?= form_close() ?>

</div>
<?= $this->endSection() ?>