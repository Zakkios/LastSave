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

    public function get(string $url, string $endpoint, array $options = []): array
    {
        $response = $this->httpClient->request('GET', $url . $endpoint, $options);
        return $response->toArray();
    }
}
