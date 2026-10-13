<?php

namespace Application\Model;

class Contacto
{
    private ?int $id;
    private string $nombre;
    private string $email;
    private string $mensaje;
    private ?string $fecha;

    public function __construct(?int $id = null, string $nombre = '', string $email = '', string $mensaje = '', ?string $fecha = null)
    {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->email = $email;
        $this->mensaje = $mensaje;
        $this->fecha = $fecha;
    }

    public function exchangeArray(array $data): void
    {
        $this->id      = !empty($data['id']) ? (int) $data['id'] : null;
        $this->nombre  = !empty($data['nombre']) ? $data['nombre'] : '';
        $this->email   = !empty($data['email']) ? $data['email'] : '';
        $this->mensaje = !empty($data['mensaje']) ? $data['mensaje'] : '';
        $this->fecha   = !empty($data['fecha']) ? $data['fecha'] : null;
    }

    public function getArrayCopy(): array
    {
        return [
            'id'      => $this->id,
            'nombre'  => $this->nombre,
            'email'   => $this->email,
            'mensaje' => $this->mensaje,
            'fecha'   => $this->fecha,
        ];
    }

    // Getters y Setters
    public function getId(): ?int { return $this->id; }
    public function getNombre(): string { return $this->nombre; }
    public function getEmail(): string { return $this->email; }
    public function getMensaje(): string { return $this->mensaje; }
    public function getFecha(): ?string { return $this->fecha; }

    public function setNombre(string $nombre): void { $this->nombre = $nombre; }
    public function setEmail(string $email): void { $this->email = $email; }
    public function setMensaje(string $mensaje): void { $this->mensaje = $mensaje; }
}