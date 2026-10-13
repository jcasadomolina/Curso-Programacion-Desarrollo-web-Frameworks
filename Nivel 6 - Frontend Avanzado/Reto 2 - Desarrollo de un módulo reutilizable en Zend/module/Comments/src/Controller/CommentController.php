<?php

declare(strict_types=1);

namespace Comments\Controller;

use Comments\Service\CommentService;
use Comments\Service\ModeratorAuthenticator;
use InvalidArgumentException;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\ViewModel;

final class CommentController extends AbstractActionController
{
    public function __construct(
        private CommentService $service,
        private ModeratorAuthenticator $moderatorAuthenticator,
    ) {
    }

    public function indexAction(): ViewModel
    {
        return new ViewModel([
            'comments' => $this->service->list(),
            'isModerator' => $this->moderatorAuthenticator->isAuthenticated(),
        ]);
    }

    public function createAction(): ViewModel
    {
        return $this->saveComment(null);
    }

    public function editAction(): mixed
    {
        if (! $this->moderatorAuthenticator->isAuthenticated()) {
            return $this->redirect()->toRoute('comments/login');
        }

        $id = (string) $this->params()->fromRoute('id', '');
        $comment = $this->service->get($id);
        if ($comment === null) {
            return $this->notFoundAction();
        }

        return $this->saveComment($comment);
    }

    public function deleteAction(): mixed
    {
        if (! $this->moderatorAuthenticator->isAuthenticated()) {
            return $this->redirect()->toRoute('comments/login');
        }

        if (! $this->getRequest()->isPost()) {
            return $this->redirect()->toRoute('comments');
        }

        $this->service->delete((string) $this->params()->fromRoute('id', ''));
        return $this->redirect()->toRoute('comments');
    }

    public function loginAction(): mixed
    {
        $error = null;
        if ($this->getRequest()->isPost()) {
            $password = (string) $this->getRequest()->getPost('password', '');
            if ($this->moderatorAuthenticator->authenticate($password)) {
                return $this->redirect()->toRoute('comments');
            }

            $error = 'La contraseña de moderador no es válida.';
        }

        return (new ViewModel(['error' => $error]))->setTemplate('comments/comment/login');
    }

    public function logoutAction(): mixed
    {
        if ($this->getRequest()->isPost()) {
            $this->moderatorAuthenticator->logout();
        }

        return $this->redirect()->toRoute('comments');
    }

    private function saveComment(?\Comments\Model\Comment $comment): mixed
    {
        $isEdit = $comment !== null;
        $data = [
            'author' => $comment?->getAuthor() ?? '',
            'content' => $comment?->getContent() ?? '',
        ];
        $errors = [];

        if ($this->getRequest()->isPost()) {
            $data = [
                'author' => (string) $this->getRequest()->getPost('author', ''),
                'content' => (string) $this->getRequest()->getPost('content', ''),
            ];

            try {
                if ($isEdit) {
                    $saved = $this->service->update(
                        $comment->getId(),
                        $data['author'],
                        $data['content']
                    );
                    if ($saved === null) {
                        return $this->notFoundAction();
                    }
                } else {
                    $this->service->create($data['author'], $data['content']);
                }

                return $this->redirect()->toRoute('comments');
            } catch (InvalidArgumentException $exception) {
                $errors[] = $exception->getMessage();
            }
        }

        return (new ViewModel([
            'comment' => $comment,
            'data' => $data,
            'errors' => $errors,
            'isEdit' => $isEdit,
        ]))->setTemplate('comments/comment/form');
    }
}
