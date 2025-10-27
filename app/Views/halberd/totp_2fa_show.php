<?= $this->extend(config('Halberd')->views['layout']) ?>
<?= $this->section('main') ?>
<link rel="stylesheet" href="<?= base_url(config('TOTP')->stylesheet) ?>">

<div class="totp-container">

    <h2><?= lang('Auth.2FAHeader') ?></h2>

    <p><?= lang('Auth.2FAEnable') ?></p>

    <img src="<?= $qrCodeUrl ?>" alt="QR Code">

    <p><?= lang('Auth.2FASecret') ?>: <code><?= $secret ?></code></p>

    <?= form_open(url_to('2fa-enable'), 'class="totp-form"') ?>
        <label for="token"><?= lang('Auth.2FACode') ?></label>
        <input type="text" name="token" id="token" required>
        <input type="submit" value="<?= lang('Auth.2FAEnable') ?>">
    <?= form_close() ?>

</div>
<?= $this->endSection() ?>