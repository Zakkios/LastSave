<?php

namespace App\Service\External;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Contracts\HttpClient\Exception\ExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class MangaDexCoverProxyService
{
    private const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';

    private const MIME_TYPES = [
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png'  => 'image/png',
        'webp' => 'image/webp',
    ];

    public function __construct(private HttpClientInterface $httpClient) {}

    /**
     * @return array{content: string, contentType: string}
     */
    public function fetchCover(string $mangaId, string $fileName): array
    {
        $url = sprintf('%s/%s/%s', self::COVER_BASE_URL, $mangaId, $fileName);

        try {
            $response = $this->httpClient->request('GET', $url, [
                'headers' => [
                    'Accept' => 'image/*',
                ],
                'timeout' => 10,
            ]);

            $statusCode = $response->getStatusCode();
        } catch (ExceptionInterface $e) {
            throw new HttpException(502, 'Failed to reach MangaDex', $e);
        }

        if ($statusCode === 404) {
            throw new HttpException(404, 'Cover not found');
        }

        if ($statusCode >= 400) {
            throw new HttpException(502, 'MangaDex returned an unexpected status');
        }

        try {
            $content = $response->getContent();
        } catch (ExceptionInterface $e) {
            throw new HttpException(502, 'Failed to read MangaDex response', $e);
        }

        return [
            'content'     => $content,
            'contentType' => $this->resolveContentType($fileName),
        ];
    }

    private function resolveContentType(string $fileName): string
    {
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        return self::MIME_TYPES[$extension] ?? 'application/octet-stream';
    }
}
