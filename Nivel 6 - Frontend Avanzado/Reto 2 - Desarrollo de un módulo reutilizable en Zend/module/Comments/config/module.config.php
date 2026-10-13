<?php

declare(strict_types=1);

namespace Comments;

use Comments\Controller\CommentController;
use Comments\Model\CommentRepository;
use Comments\Service\CommentService;
use Comments\Service\ModeratorAuthenticator;
use Laminas\Router\Http\Literal;
use Laminas\Router\Http\Segment;

return [
    'comments' => [
        'storage_path' => dirname(__DIR__, 3) . '/data/comments.json',
        'moderator_password' => getenv('COMMENTS_MODERATOR_PASSWORD') ?: 'moderator',
    ],
    'router' => [
        'routes' => [
            'comments' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/comments',
                    'defaults' => [
                        'controller' => CommentController::class,
                        'action' => 'index',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'create' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/create',
                            'defaults' => ['action' => 'create'],
                        ],
                    ],
                    'login' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/login',
                            'defaults' => ['action' => 'login'],
                        ],
                    ],
                    'logout' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/logout',
                            'defaults' => ['action' => 'logout'],
                        ],
                    ],
                    'edit' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/edit/:id',
                            'defaults' => ['action' => 'edit'],
                        ],
                    ],
                    'delete' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/delete/:id',
                            'defaults' => ['action' => 'delete'],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            CommentController::class => static function ($container): CommentController {
                return new CommentController(
                    $container->get(CommentService::class),
                    $container->get(ModeratorAuthenticator::class),
                );
            },
        ],
    ],
    'service_manager' => [
        'factories' => [
            CommentRepository::class => static function ($container): CommentRepository {
                $config = $container->get('config');
                $commentsConfig = $config['comments'] ?? [];

                return new CommentRepository(
                    $commentsConfig['storage_path'] ?? dirname(__DIR__, 3) . '/data/comments.json'
                );
            },
            CommentService::class => static function ($container): CommentService {
                return new CommentService($container->get(CommentRepository::class));
            },
            ModeratorAuthenticator::class => static function ($container): ModeratorAuthenticator {
                $config = $container->get('config');
                $commentsConfig = $config['comments'] ?? [];

                return new ModeratorAuthenticator(
                    $commentsConfig['moderator_password'] ?? 'moderator'
                );
            },
        ],
    ],
    'view_manager' => [
        'template_map' => [
            'comments/comment/index' => __DIR__ . '/../view/comments/comment/index.phtml',
            'comments/comment/form' => __DIR__ . '/../view/comments/comment/form.phtml',
            'comments/comment/login' => __DIR__ . '/../view/comments/comment/login.phtml',
        ],
        'template_path_stack' => [__DIR__ . '/../view'],
    ],
];
