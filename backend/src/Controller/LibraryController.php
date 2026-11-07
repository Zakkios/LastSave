<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\Library\LibraryOverviewService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Whole library (mangas and games together), for the home page.
 */
#[Route('/library', name: 'app_library_')]
class LibraryController extends AbstractController
{
    public function __construct(
        private readonly LibraryOverviewService $libraryOverviewService,
    ) {}

    #[Route('/stats', name: 'stats', methods: ['GET'])]
    public function stats(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'User not authenticated'], 401);
        }

        return $this->json($this->libraryOverviewService->getStatsForUser($user));
    }

    #[Route('/recent', name: 'recent', methods: ['GET'])]
    public function recent(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'User not authenticated'], 401);
        }

        return $this->json($this->libraryOverviewService->getRecentEntriesForUser($user));
    }
}
