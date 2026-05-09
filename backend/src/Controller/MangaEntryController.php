<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\Library\MangaEntryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;

class MangaEntryController extends AbstractController
{
    public function __construct(
        private readonly MangaEntryService $mangaEntryService
    ) {}
    #[Route('/manga_entries', name: 'app_manga_entry_create', methods: ['POST'])]
    public function index(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json([
                'message' => 'Invalid JSON',
            ], 400);
        }

        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'message' => 'User not authenticated',
            ], 401);
        }


        if (!isset($data['providerId']) || !isset($data['status'])) {
            return $this->json([
                'message' => 'Missing required fields',
            ], 400);
        }

        if (!is_string($data['providerId']) || !is_string($data['status'])) {
            return $this->json([
                'message' => 'Invalid data type',
            ], 400);
        }

        try {
            $providerId = Uuid::fromString($data['providerId']);

            $mangaEntry = $this->mangaEntryService->createNewMangaEntry(
                $user,
                $providerId,
                $data['status']
            );
        } catch (\DomainException $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], 409);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], 400);
        }

        return $this->json([
            'message' => 'Manga entry created successfully',
            'id' => $mangaEntry->getId(),
            'providerId' => $mangaEntry->getProviderId()->toRfc4122(),
            'status' => $mangaEntry->getStatus()->value,
        ], 201);
    }

    #[Route('/manga_entries', name: 'app_manga_entry_update', methods: ['PATCH'])]
    public function update(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json([
                'message' => 'Invalid JSON',
            ], 400);
        }

        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        if (!isset($data['providerId']) || !isset($data['status'])) {
            return $this->json([
                'message' => 'Missing required fields',
            ], 400);
        }

        if (!is_string($data['providerId']) || !is_string($data['status'])) {
            return $this->json([
                'message' => 'Invalid data type',
            ], 400);
        }

        try {
            $providerId = Uuid::fromString($data['providerId']);
            $mangaEntry = $this->mangaEntryService->findUserEntryForManga($user, $providerId);

            if (!$mangaEntry) {
                return $this->json([
                    'message' => 'Manga entry not found',
                ], 404);
            }

            $this->mangaEntryService->updateMangaEntry(
                $mangaEntry,
                $data['status']
            );
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], 400);
        }

        return $this->json([
            'message' => 'Manga entry updated successfully',
            'id' => $mangaEntry->getId(),
            'providerId' => $mangaEntry->getProviderId()->toRfc4122(),
            'status' => $mangaEntry->getStatus()->value,
        ], 200);
    }
}
