<?php

namespace App\Controller;

use App\Entity\GameEntry;
use App\Entity\User;
use App\Service\Library\GameEntryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class GameEntryController extends AbstractController
{
    public function __construct(
        private readonly GameEntryService $gameEntryService,
    ) {}

    #[Route('/game_entries', name: 'app_game_entry_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'User not authenticated'], 401);
        }

        $payload = $this->readPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        try {
            $gameEntry = $this->gameEntryService->createNewGameEntry($user, $payload['providerId'], $payload['status']);
        } catch (\DomainException $e) {
            return $this->json(['message' => $e->getMessage()], 409);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }

        return $this->json($this->describe($gameEntry, 'Game entry created successfully'), 201);
    }

    #[Route('/game_entries', name: 'app_game_entry_update', methods: ['PATCH'])]
    public function update(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'User not authenticated'], 401);
        }

        $payload = $this->readPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $gameEntry = $this->gameEntryService->findUserEntryForGame($user, $payload['providerId']);

        if (!$gameEntry) {
            return $this->json(['message' => 'Game entry not found'], 404);
        }

        try {
            $this->gameEntryService->updateGameEntry($gameEntry, $payload['status']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }

        return $this->json($this->describe($gameEntry, 'Game entry updated successfully'));
    }

    // Removes the game from the user's library (added by mistake): 204 on success.
    #[Route('/game_entries/{providerId}', name: 'app_game_entry_delete', requirements: ['providerId' => '\d+'], methods: ['DELETE'])]
    public function delete(int $providerId): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'User not authenticated'], 401);
        }

        $gameEntry = $this->gameEntryService->findUserEntryForGame($user, $providerId);

        if (!$gameEntry) {
            return $this->json(['message' => 'Game entry not found'], 404);
        }

        $this->gameEntryService->removeGameEntry($gameEntry);

        return new JsonResponse(null, 204);
    }

    /**
     * Expected JSON: {"providerId": <IGDB id, positive integer>, "status": "<GameStatus value>"}.
     *
     * @return array{providerId: int, status: string}|JsonResponse
     */
    private function readPayload(Request $request): array|JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json(['message' => 'Invalid JSON'], 400);
        }

        if (!isset($data['providerId'], $data['status'])) {
            return $this->json(['message' => 'Missing required fields'], 400);
        }

        if (!is_int($data['providerId']) || $data['providerId'] <= 0 || !is_string($data['status'])) {
            return $this->json(['message' => 'Invalid data type'], 400);
        }

        return ['providerId' => $data['providerId'], 'status' => $data['status']];
    }

    private function describe(GameEntry $gameEntry, string $message): array
    {
        return [
            'message' => $message,
            'id' => $gameEntry->getId(),
            'providerId' => $gameEntry->getProviderId(),
            'status' => $gameEntry->getStatus()?->value,
        ];
    }
}
