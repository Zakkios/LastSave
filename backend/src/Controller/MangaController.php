<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\MangaReadingStatus;
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

    // Optional ?status=<MangaReadingStatus value> keeps only the mangas with that status.
    #[Route('/library/page/{page}', name: 'app_manga_library', methods: ['GET'])]
    public function mangaLibrary(int $page, Request $request): JsonResponse
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

        $statusValue = (string) $request->query->get('status', '');
        $status = $statusValue === '' ? null : MangaReadingStatus::tryFrom($statusValue);

        if ($statusValue !== '' && !$status) {
            return $this->json([
                'message' => 'Invalid status',
            ], 400);
        }

        $mangasData = $this->mangaLibraryQueryService->getMangaLibraryForUser($user, $page, $status);

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

    // ?ids=<uuid>,<uuid>… (12 at most): latest French chapter of those mangas of the
    // user's library followed by chapter, for the "N new" badges. Declared before /{id}.
    #[Route('/latest-chapters', name: 'app_manga_latest_chapters', methods: ['GET'])]
    public function latestChapters(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $mangaIds = [];

        foreach (explode(',', (string) $request->query->get('ids', '')) as $id) {
            if (trim($id) === '') {
                continue;
            }

            try {
                $mangaIds[] = Uuid::fromString(trim($id));
            } catch (\InvalidArgumentException) {
                return $this->json([
                    'message' => 'Invalid UUID',
                ], 400);
            }
        }

        // JsonResponse + (object): an empty result stays a JSON object ({}), not an empty array.
        return new JsonResponse((object) $this->mangaLibraryQueryService->getLatestFrenchChaptersForUser($user, $mangaIds));
    }

    // Finished mangas with a new French chapter, to offer putting them back "reading".
    #[Route('/resumable', name: 'app_manga_resumable', methods: ['GET'])]
    public function resumable(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        return $this->json($this->mangaLibraryQueryService->getResumableMangasForUser($user));
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
