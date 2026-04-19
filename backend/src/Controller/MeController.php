<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class MeController extends AbstractController
{
    #[Route('/me', name: 'me')]
    public function me(): JsonResponse
    {
        $user = $this->getUser();

        return new JsonResponse(['username' => $user->getUserIdentifier()]);
    }
}
