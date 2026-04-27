<?php

namespace App\Service\Http;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class ApiClient
{
    private HttpClientInterface $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function get(string $url, string $endpoint, array $params = []): array
    {
        $response = $this->httpClient->request('GET', $url . $endpoint, [
            'query' => $params,
        ]);

        return $response->toArray();
    }

    public function post(string $url, string $endpoint, array $params = []): array
    {
        $response = $this->httpClient->request('POST', $url . $endpoint, [
            'query' => $params,
        ]);
        return $response->toArray();
    }
}
