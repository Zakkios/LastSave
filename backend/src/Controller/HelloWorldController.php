<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;

class HelloWorldController extends AbstractController
{
    #[Route('/hello', name: 'app_hello_world', methods: ['GET'])]
    public function index()
    {
        return $this->json([
            'message' => 'Hello, World!',
        ]);
    }
}
