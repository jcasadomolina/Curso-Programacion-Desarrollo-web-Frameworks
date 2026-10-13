<?php

declare(strict_types=1);

namespace Comments\Model;

final class CommentRepository
{
    public function __construct(private string $storagePath)
    {
    }

    /** @return list<Comment> */
    public function findAll(): array
    {
        $comments = [];
        foreach ($this->readData() as $data) {
            $comments[] = Comment::fromArray($data);
        }

        usort($comments, static fn (Comment $left, Comment $right): int =>
            strcmp($right->getCreatedAt(), $left->getCreatedAt()));

        return $comments;
    }

    public function find(string $id): ?Comment
    {
        foreach ($this->findAll() as $comment) {
            if ($comment->getId() === $id) {
                return $comment;
            }
        }

        return null;
    }

    public function save(Comment $comment): void
    {
        $data = $this->readData();
        $updated = false;

        foreach ($data as $index => $item) {
            if (($item['id'] ?? '') === $comment->getId()) {
                $data[$index] = $comment->toArray();
                $updated = true;
                break;
            }
        }

        if (! $updated) {
            $data[] = $comment->toArray();
        }

        $this->writeData($data);
    }

    public function delete(string $id): bool
    {
        $data = $this->readData();
        $filtered = array_values(array_filter(
            $data,
            static fn (array $item): bool => ($item['id'] ?? '') !== $id
        ));

        if (count($filtered) === count($data)) {
            return false;
        }

        $this->writeData($filtered);
        return true;
    }

    /** @return list<array<string, string>> */
    private function readData(): array
    {
        if (! is_file($this->storagePath)) {
            return [];
        }

        $contents = file_get_contents($this->storagePath);
        if ($contents === false || trim($contents) === '') {
            return [];
        }

        $data = json_decode($contents, true);
        return is_array($data) ? array_values(array_filter($data, 'is_array')) : [];
    }

    /** @param list<array<string, string>> $data */
    private function writeData(array $data): void
    {
        $directory = dirname($this->storagePath);
        if (! is_dir($directory)) {
            mkdir($directory, 0775, true);
        }

        file_put_contents(
            $this->storagePath,
            json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
            LOCK_EX
        );
    }
}
