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

    #[Route('/random', name: 'app_manga_random', methods: ['GET'])]
    public function randomManga(): JsonResponse
    {
        $mangaData = $this->mangaDexService->getRandomManga();

        return $this->json($mangaData);
    }

    #[Route('/autocomplete', name: 'app_manga_autocomplete', methods: ['GET'])]
    public function autocompleteManga(Request $request): JsonResponse
    {
        $query = $request->query->get('q');

        $mangaData = $this->mangaDexService->getMangaForAutocomplete($query);

        return $this->json($mangaData);
    }
}
