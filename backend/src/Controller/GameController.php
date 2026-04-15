<?php

namespace App\Controller;

use App\Service\External\GameService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/game', name: 'app_game')]

class GameController extends AbstractController
{
    public function __construct(
        private GameService $gameService
    ) {}

    #[Route('/random', name: 'app_game_random', methods: ['GET'])]
    public function randomGame(): JsonResponse
    {
        $gameData = $this->gameService->getRandomGame();
        return $this->json($gameData);
    }
}
