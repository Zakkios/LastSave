<?php

namespace App\Controller;

use App\Service\External\MangaDexService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class MangaController extends AbstractController
{
    private MangaDexService $mangaDexService;

    public function __construct(MangaDexService $mangaDexService)
    {
        $this->mangaDexService = $mangaDexService;
    }

    #[Route('/manga/random', name: 'app_random_manga', methods: ['GET'])]
    public function randomManga(): JsonResponse
    {
        $mangaData = $this->mangaDexService->getRandomManga();

        return $this->json($mangaData);
    }
}
