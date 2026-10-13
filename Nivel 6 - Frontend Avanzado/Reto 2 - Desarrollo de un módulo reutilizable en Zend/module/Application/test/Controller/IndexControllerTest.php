<?php

declare(strict_types=1);

namespace ApplicationTest\Controller;

use Comments\Controller\CommentController;
use Laminas\Stdlib\ArrayUtils;
use Laminas\Test\PHPUnit\Controller\AbstractHttpControllerTestCase;

class IndexControllerTest extends AbstractHttpControllerTestCase
{
    public function setUp(): void
    {
        $configOverrides = [];

        $this->setApplicationConfig(ArrayUtils::merge(
            include __DIR__ . '/../../../../config/application.config.php',
            $configOverrides
        ));

        parent::setUp();
    }

    public function testIndexActionCanBeAccessed(): void
    {
        $this->dispatch('/', 'GET');
        $this->assertResponseStatusCode(200);
        $this->assertModuleName('comments');
        $this->assertControllerName(CommentController::class);
        $this->assertControllerClass('CommentController');
        $this->assertMatchedRouteName('home');
    }

    public function testIndexActionViewModelTemplateRenderedWithinLayout(): void
    {
        $this->dispatch('/', 'GET');
        $this->assertQuery('body h1');
    }

    public function testCommentCreationFormCanBeRendered(): void
    {
        $this->dispatch('/comments/create', 'GET');
        $this->assertResponseStatusCode(200);
        $this->assertQuery('form textarea[name="content"]');
    }

    public function testCommentEditRequiresModeratorAccess(): void
    {
        $this->dispatch('/comments/edit/not-authorized', 'GET');
        $this->assertResponseStatusCode(302);
        $this->assertRedirectTo('/comments/login');
    }

    public function testInvalidRouteDoesNotCrash(): void
    {
        $this->dispatch('/invalid/route', 'GET');
        $this->assertResponseStatusCode(404);
    }
}
