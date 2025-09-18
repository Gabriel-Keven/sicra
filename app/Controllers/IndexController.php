<?php

namespace App\Controllers;

class IndexController extends BaseController
{
    public function index()
    {
       echo view('IndexView');
    }
}
