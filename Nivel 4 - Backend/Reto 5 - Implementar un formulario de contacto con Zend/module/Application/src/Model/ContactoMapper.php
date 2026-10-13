<?php

namespace Application\Model;

use Laminas\Db\TableGateway\TableGatewayInterface;
use RuntimeException;

class ContactoMapper
{
    private TableGatewayInterface $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    /**
     * Obtener todos los mensajes
     */
    public function fetchAll()
    {
        return $this->tableGateway->select();
    }

    /**
     * Guardar o actualizar un mensaje de contacto
     */
    public function saveContacto(Contacto $contacto): void
    {
        $data = [
            'nombre'  => $contacto->getNombre(),
            'email'   => $contacto->getEmail(),
            'mensaje' => $contacto->getMensaje(),
            'fecha'   => date('Y-m-d H:i:s'),
        ];

        $id = $contacto->getId();

        if ($id === null || $id === 0) {
            $this->tableGateway->insert($data);
        } else {
            if ($this->getContacto($id)) {
                $this->tableGateway->update($data, ['id' => $id]);
            } else {
                throw new RuntimeException(sprintf('No se encontró el mensaje con el ID %d', $id));
            }
        }
    }

    /**
     * Obtener un mensaje por ID
     */
    public function getContacto(int $id): Contacto
    {
        $rowset = $this->tableGateway->select(['id' => $id]);
        $row = $rowset->current();
        if (!$row) {
            throw new RuntimeException(sprintf('No se pudo encontrar el registro %d', $id));
        }
        return $row;
    }
}