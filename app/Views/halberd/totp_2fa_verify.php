<?= $this->extend(config('Halberd')->views['layout']) ?>
<?= $this->section('main') ?>
<link rel="stylesheet" href="<?= base_url(config('TOTP')->stylesheet) ?>">

<div class="totp-container">

    <h2><?= lang('Auth.2FAVerify') ?></h2>

    <?= form_open(url_to('2fa-verify'), 'class="totp-form"') ?>
        <label for="token"><?= lang('Auth.2FACode') ?></label>
        <input type="text" name="token" id="token" required>
        <input type="submit" value="<?= lang('Auth.2FAVerify') ?>">
    <?= form_close() ?>

</div>
<?= $this->endSection() ?>