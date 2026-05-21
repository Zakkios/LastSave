<?php

namespace App\Controller;

use App\Service\External\MangaDexCoverProxyService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Routing\Attribute\Route;

class MangaCoverController extends AbstractController
{
    private const UUID_PATTERN = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

    private const FILE_NAME_PATTERN = '[A-Za-z0-9_-]+\.(?:jpg|jpeg|png|webp)(?:\.(?:256|512)\.jpg)?';

    public function __construct(
        private readonly MangaDexCoverProxyService $coverProxyService,
    ) {}

    #[Route(
        '/manga/cover/{mangaId}/{fileName}',
        name: 'app_manga_cover_proxy',
        requirements: [
            'mangaId'  => self::UUID_PATTERN,
            'fileName' => self::FILE_NAME_PATTERN,
        ],
        methods: ['GET']
    )]
    public function proxyCover(string $mangaId, string $fileName): Response
    {
        try {
            $cover = $this->coverProxyService->fetchCover($mangaId, $fileName);
        } catch (HttpException $e) {
            return new Response('', $e->getStatusCode());
        }

        $response = new Response($cover['content'], Response::HTTP_OK, [
            'Content-Type'  => $cover['contentType'],
            'Cache-Control' => 'public, max-age=86400',
        ]);

        $response->setPublic();
        $response->setMaxAge(86400);

        return $response;
    }
}
