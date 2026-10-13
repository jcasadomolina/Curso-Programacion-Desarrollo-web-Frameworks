<?php

declare(strict_types=1);

namespace Comments\Service;

use Comments\Model\Comment;
use Comments\Model\CommentRepository;
use InvalidArgumentException;

final class CommentService
{
    public function __construct(private CommentRepository $repository)
    {
    }

    /** @return list<Comment> */
    public function list(): array
    {
        return $this->repository->findAll();
    }

    public function get(string $id): ?Comment
    {
        return $this->repository->find($id);
    }

    public function create(string $author, string $content): Comment
    {
        [$author, $content] = $this->validate($author, $content);
        $comment = Comment::create($author, $content);
        $this->repository->save($comment);

        return $comment;
    }

    public function update(string $id, string $author, string $content): ?Comment
    {
        $comment = $this->repository->find($id);
        if ($comment === null) {
            return null;
        }

        [$author, $content] = $this->validate($author, $content);
        $comment->update($author, $content);
        $this->repository->save($comment);

        return $comment;
    }

    public function delete(string $id): bool
    {
        return $this->repository->delete($id);
    }

    /** @return array{string, string} */
    private function validate(string $author, string $content): array
    {
        $author = trim($author);
        $content = trim($content);

        if ($author === '' || mb_strlen($author) > 80) {
            throw new InvalidArgumentException('El nombre debe tener entre 1 y 80 caracteres.');
        }

        if ($content === '' || mb_strlen($content) > 2000) {
            throw new InvalidArgumentException('El comentario debe tener entre 1 y 2000 caracteres.');
        }

        return [$author, $content];
    }
}
