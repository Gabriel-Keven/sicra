<?= $this->extend(config('Halberd')->views['layout']) ?>
<?= $this->section('main') ?>
<link rel="stylesheet" href="<?= base_url(config('TOTP')->stylesheet) ?>">

<div class="totp-container">

    <h2><?= lang('Auth.2FAHeader') ?></h2>

    <p><?= lang('Auth.2FABackup') ?></p>

    <ul class="totp-codes">
        <?php foreach ($codes as $code) : ?>
            <li><?= $code ?></li>
        <?php endforeach ?>
    </ul>

    <p><?= lang('Auth.2FABackupWarning') ?></p>

</div>
<?= $this->endSection() ?>