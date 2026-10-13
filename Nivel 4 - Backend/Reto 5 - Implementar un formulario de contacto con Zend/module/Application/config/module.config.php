<?php

declare(strict_types=1);

namespace Application;

use Application\Controller\ContactController;
use Application\Controller\IndexController;
use Application\Model\Contacto;
use Application\Model\ContactoMapper;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Router\Http\Literal;

return [
    'router' => [
        'routes' => [
            // Ruta para la página de inicio (/)
            'home' => [
                'type'    => Literal::class,
                'options' => [
                    'route'    => '/',
                    'defaults' => [
                        'controller' => IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            // Ruta para ver el formulario (/contacto)
            'contacto' => [
                'type'    => Literal::class,
                'options' => [
                    'route'    => '/contacto',
                    'defaults' => [
                        'controller' => ContactController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            // Ruta para procesar el envío (/contacto/procesar)
            'contacto-procesar' => [
                'type'    => Literal::class,
                'options' => [
                    'route'    => '/contacto/procesar',
                    'defaults' => [
                        'controller' => ContactController::class,
                        'action'     => 'process',
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            IndexController::class => function ($container) {
                return new IndexController(
                    $container->get(ContactoMapper::class)
                );
            },
            // Registramos ContactController inyectando el Mapper desde el ServiceManager
            ContactController::class => function ($container) {
                return new ContactController(
                    $container->get(ContactoMapper::class)
                );
            },
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    ],
    'service_manager' => [
        'factories' => [
            ContactoMapper::class => function ($container) {
                $tableGateway = $container->get('ContactoTableGateway');
                return new ContactoMapper($tableGateway);
            },
            'ContactoTableGateway' => function ($container) {
                $dbAdapter = new Adapter($container->get('config')['db']);
                $resultSetPrototype = new ResultSet();
                $resultSetPrototype->setArrayObjectPrototype(new Contacto());
                return new TableGateway('mensajes_contacto', $dbAdapter, null, $resultSetPrototype);
            },
        ],
    ],
];