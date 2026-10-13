<?php

namespace App\Tests\Security;

use App\Entity\Post;
use App\Entity\User;
use App\Security\PostVoter;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\NullToken;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

final class PostVoterTest extends TestCase
{
    public function testAuthorIsGrantedPostActions(): void
    {
        $author = new User();
        $post = new Post();
        $post->setAuthor($author);
        $token = new UsernamePasswordToken($author, 'main', [User::ROLE_USER]);

        $voter = new PostVoter();

        self::assertSame(PostVoter::ACCESS_GRANTED, $voter->vote($token, $post, [PostVoter::SHOW]));
        self::assertSame(PostVoter::ACCESS_GRANTED, $voter->vote($token, $post, [PostVoter::EDIT]));
        self::assertSame(PostVoter::ACCESS_GRANTED, $voter->vote($token, $post, [PostVoter::DELETE]));
    }

    public function testNonAuthorIsDeniedPostActions(): void
    {
        $author = new User();
        $otherUser = new User();
        $post = new Post();
        $post->setAuthor($author);
        $token = new UsernamePasswordToken($otherUser, 'main', [User::ROLE_USER]);

        $voter = new PostVoter();

        self::assertSame(PostVoter::ACCESS_DENIED, $voter->vote($token, $post, [PostVoter::EDIT]));
    }

    public function testAnonymousUserIsDenied(): void
    {
        $post = new Post();
        $token = new NullToken();

        $voter = new PostVoter();

        self::assertSame(PostVoter::ACCESS_DENIED, $voter->vote($token, $post, [PostVoter::SHOW]));
    }
}
