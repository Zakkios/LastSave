<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\Library\GameLibraryQueryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/game', name: 'app_game_')]
class GameController extends AbstractController
{
    public function __construct(
        private readonly GameLibraryQueryService $gameLibraryQueryService,
    ) {}

    #[Route('/autocomplete', name: 'autocomplete', methods: ['GET'])]
    public function autocomplete(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'User not authenticated'], 401);
        }

        $query = (string) $request->query->get('query', '');
        $page = max(0, $request->query->getInt('page', 0));

        return $this->json(
            $this->gameLibraryQueryService->getGameSearchForUser($query, $page, $user)
        );
    }

    #[Route('/library/page/{page}', name: 'library', requirements: ['page' => '\d+'], methods: ['GET'])]
    public function library(int $page): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'User not authenticated'], 401);
        }

        return $this->json(
            $this->gameLibraryQueryService->getGameLibraryForUser($user, $page)
        );
    }

    #[Route('/{id}', name: 'by_id', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function byId(int $id): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'User not authenticated'], 401);
        }

        $game = $this->gameLibraryQueryService->getGameByIdForUser($id, $user);

        if (!$game) {
            return $this->json(['message' => 'Game not found'], 404);
        }

        return $this->json($game);
    }
}
