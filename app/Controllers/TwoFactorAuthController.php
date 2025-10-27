<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\Shield\Authentication\Authenticators\Session;
use Config\Halberd as HalberdConfig;

class TwoFactorAuthController extends BaseController
{
    protected $helpers = ['setting'];

    /**
     * @var Session
     */
    protected $auth;

    protected $config;

    public function __construct()
    {
        $this->auth   = service('auth')->getAuthenticator('session');
        $this->config = config('Halberd');
    }

    /**
     * Show 2FA page
     */
    public function show()
    {
        if ($this->auth->user()->is2FAEnabled()) {
            return $this->disableShow();
        }

        return $this->enableShow();
    }

    /**
     * Show 2FA verification page
     */
    public function verifyShow()
    {
        return view($this->config->views['verify'], [
            'user' => $this->auth->user(),
        ]);
    }

    /**
     * Verify 2FA code
     */
    public function verify()
    {
        $token = $this->request->getPost('token');

        if ($this->auth->user()->verify2FACode($token)) {
            $this->auth->user()->set2FAVerified();

            // Get the URL to redirect to
            $redirectURL = session()->get('redirect_url') ?? setting('Auth.loginRedirect');
            unset($_SESSION['redirect_url']);

            return redirect()->to($redirectURL)->with('message', lang('Auth.loginSuccess'));
        }

    return redirect()->back()->withInput()->with('error', lang('Auth.invalid2FACode'));
    }

    /**
     * Show backup codes
     */
    public function codesShow()
    {
        if (! $this->auth->user()->is2FAEnabled()) {
            return $this->enableShow();
        }

        return view($this->config->views['codes'], [
            'user'  => $this->auth->user(),
            'codes' => $this->auth->user()->get2FABackupCodes(),
        ]);
    }

    /**
     * Enable 2FA
     */
    public function enable()
    {
        $token = $this->request->getPost('token');

        if ($this->auth->user()->verify2FACode($token)) {
            $this->auth->user()->enable2FA();

            return redirect()->to(url_to('2fa-codes'))->with('message', lang('Auth.enable2FASuccess'));
        }

        return redirect()->back()->withInput()->with('error', lang('Auth.invalid2FACode'));
    }

    /**
     * Disable 2FA
     */
    public function disable()
    {
        $this->auth->user()->disable2FA();

        return redirect()->back()->with('message', lang('Auth.disable2FASuccess'));
    }

    /**
     * Show enable 2FA page
     */
    private function enableShow()
    {
        return view($this->config->views['show'], [
            'user'      => $this->auth->user(),
            'qrCodeUrl' => $this->auth->user()->get2FAQRCode(),
            'secret'    => $this->auth->user()->get2FASecret(),
        ]);
    }

    /**
     * Show disable 2FA page
     */
    private function disableShow()
    {
        return view($this->config->views['disable'], [
            'user' => $this->auth->user(),
        ]);
    }
}