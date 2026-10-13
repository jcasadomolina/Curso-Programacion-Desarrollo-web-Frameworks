<?php

declare(strict_types=1);

namespace Comments\Model;

final class Comment
{
    public function __construct(
        private string $id,
        private string $author,
        private string $content,
        private string $createdAt,
        private string $updatedAt,
    ) {
    }

    public static function create(string $author, string $content): self
    {
        $now = gmdate(DATE_ATOM);

        return new self(bin2hex(random_bytes(16)), $author, $content, $now, $now);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            (string) $data['id'],
            (string) $data['author'],
            (string) $data['content'],
            (string) $data['createdAt'],
            (string) $data['updatedAt'],
        );
    }

    public function update(string $author, string $content): void
    {
        $this->author = $author;
        $this->content = $content;
        $this->updatedAt = gmdate(DATE_ATOM);
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getAuthor(): string
    {
        return $this->author;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'author' => $this->author,
            'content' => $this->content,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
