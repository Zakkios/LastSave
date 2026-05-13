<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\Library\MangaLibraryQueryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;

#[Route('/manga', name: 'app_manga')]
class MangaController extends AbstractController
{
    public function __construct(
        private readonly MangaLibraryQueryService $mangaLibraryQueryService,
    ) {}

    #[Route('/autocomplete', name: 'app_manga_autocomplete', methods: ['GET'])]
    public function autocompleteManga(Request $request): JsonResponse
    {
        $query = (string) $request->query->get('query', '');
        $page = (int) $request->query->get('page', 0);
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $mangaData = $this->mangaLibraryQueryService->getMangaAutocompleteForUser(
            $query,
            $page,
            $user
        );

        return $this->json($mangaData);
    }

    #[Route('/library/page/{page}', name: 'app_manga_library', methods: ['GET'])]
    public function mangaLibrary(int $page): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        if ($page < 0) {
            return $this->json([
                'message' => 'Invalid page',
            ], 400);
        }

        $mangasData = $this->mangaLibraryQueryService->getMangaLibraryForUser($user, $page);

        return $this->json($mangasData);
    }

    #[Route('/page/{page}', name: 'app_manga_by_page', methods: ['GET'])]
    public function mangaByPage(int $page): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $mangasData = $this->mangaLibraryQueryService->getMangaPageForUser(
            $page,
            $user
        );

        return $this->json($mangasData);
    }

    #[Route('/{id}', name: 'app_manga_by_id', methods: ['GET'])]
    public function mangaById(string $id): JsonResponse
    {
        try {
            $mangaId = Uuid::fromString($id);
        } catch (\InvalidArgumentException) {
            return $this->json([
                'message' => 'Invalid UUID',
            ], 400);
        }

        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $mangaData = $this->mangaLibraryQueryService->getMangaByIdForUser(
            $mangaId,
            $user
        );

        return $this->json($mangaData);
    }
}
