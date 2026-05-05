<?php

namespace App\Controller;

use App\Service\External\MangaDexService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/manga', name: 'app_manga')]
class MangaController extends AbstractController
{

    public function __construct(
        private MangaDexService $mangaDexService
    ) {}

    #[Route('/autocomplete', name: 'app_manga_autocomplete', methods: ['GET'])]
    public function autocompleteManga(Request $request): JsonResponse
    {
        $query = $request->query->get('query');
        $page = $request->query->get('page');
        $mangaData = $this->mangaDexService->getMangaForAutocomplete($query, $page);

        return $this->json($mangaData);
    }

    #[Route('/{id}', name: 'app_manga_by_id', methods: ['GET'])]
    public function mangaById(string $id): JsonResponse
    {
        $mangaData = $this->mangaDexService->getMangaById($id);

        return $this->json($mangaData);
    }

    #[Route('/page/{page}', name: 'app_manga_by_page', methods: ['GET'])]
    public function mangaByPage(int $page): JsonResponse
    {
        $mangaData = $this->mangaDexService->getMangaByPage($page);

        return $this->json($mangaData);
    }
}
