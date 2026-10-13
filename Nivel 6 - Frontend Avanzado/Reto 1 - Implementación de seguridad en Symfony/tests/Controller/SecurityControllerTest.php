<?php

namespace App\Tests\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class SecurityControllerTest extends WebTestCase
{
    public function testLoginPageIsPublic(): void
    {
        $client = static::createClient();

        $client->request('GET', '/en/login');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('input[name="_username"]');
        $this->assertSelectorExists('input[name="_csrf_token"]');
    }

    public function testInvalidCredentialsDoNotAuthenticate(): void
    {
        $client = static::createClient();

        $client->request('GET', '/en/login');
        $client->submitForm('Sign in', [
            '_username' => 'jane_admin',
            '_password' => 'wrong-password',
        ]);

        $this->assertResponseRedirects('http://localhost/en/login');
    }

    public function testValidCredentialsAuthenticate(): void
    {
        $client = static::createClient();

        $client->request('GET', '/en/login');
        $client->submitForm('Sign in', [
            '_username' => 'jane_admin',
            '_password' => 'kitten',
        ]);

        $this->assertResponseRedirects('/en/blog/');
    }

    public function testLogoutRejectsInvalidCsrfToken(): void
    {
        $client = static::createClient();

        /** @var UserRepository $userRepository */
        $userRepository = $client->getContainer()->get(UserRepository::class);
        /** @var User $user */
        $user = $userRepository->findOneByUsername('jane_admin');
        $client->loginUser($user);

        $client->request('POST', '/logout', ['_csrf_token' => 'invalid-token']);

        $this->assertResponseStatusCodeSame(403);
    }
}
