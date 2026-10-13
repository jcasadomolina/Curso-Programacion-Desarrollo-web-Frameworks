<?php

declare(strict_types=1);

namespace Comments\Service;

final class ModeratorAuthenticator
{
    private const SESSION_KEY = 'comments_moderator';

    public function __construct(private string $password)
    {
    }

    public function authenticate(string $password): bool
    {
        if (! hash_equals($this->password, $password)) {
            return false;
        }

        $this->startSession();
        session_regenerate_id(true);
        $_SESSION[self::SESSION_KEY] = true;

        return true;
    }

    public function isAuthenticated(): bool
    {
        $this->startSession();
        return ($_SESSION[self::SESSION_KEY] ?? false) === true;
    }

    public function logout(): void
    {
        $this->startSession();
        unset($_SESSION[self::SESSION_KEY]);
    }

    private function startSession(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
}
