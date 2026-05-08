<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Security\Http\Event\LogoutEvent;

#[AsEventListener(event: LogoutEvent::class)]
class LogoutListener
{
    public function __invoke(LogoutEvent $event): void
    {
        $response = $event->getResponse();

        if (!$response) {
            return;
        }

        $response->headers->clearCookie(
            'BEARER',
            '/',
            null,
            true,
            true,
            'none'
        );
    }
}
