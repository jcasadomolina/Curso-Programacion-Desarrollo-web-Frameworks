<?php

namespace Application\Form;

use Laminas\Form\Element;
use Laminas\Form\Form;
use Laminas\InputFilter\InputFilterProviderInterface;
use Laminas\Validator\EmailAddress;
use Laminas\Validator\NotEmpty;
use Laminas\Validator\StringLength;

class ContactForm extends Form implements InputFilterProviderInterface
{
    public function __construct($name = null)
    {
        parent::__construct('contact-form');

        // Configuración del método de envío
        $this->setAttribute('method', 'post');

        // Campo: Nombre
        $this->add([
            'name' => 'nombre',
            'type' => Element\Text::class,
            'options' => [
                'label' => 'Nombre completo',
            ],
            'attributes' => [
                'class'       => 'form-control',
                'placeholder' => 'Escribe tu nombre',
                'required'    => 'required',
            ],
        ]);

        // Campo: Email
        $this->add([
            'name' => 'email',
            'type' => Element\Email::class,
            'options' => [
                'label' => 'Correo Electrónico',
            ],
            'attributes' => [
                'class'       => 'form-control',
                'placeholder' => 'ejemplo@correo.com',
                'required'    => 'required',
            ],
        ]);

        // Campo: Mensaje
        $this->add([
            'name' => 'mensaje',
            'type' => Element\Textarea::class,
            'options' => [
                'label' => 'Mensaje',
            ],
            'attributes' => [
                'class'       => 'form-control',
                'rows'        => 5,
                'placeholder' => 'Escribe tu consulta o mensaje aquí...',
                'required'    => 'required',
            ],
        ]);

        // Botón de Envío
        $this->add([
            'name' => 'submit',
            'type' => Element\Submit::class,
            'attributes' => [
                'value' => 'Enviar Mensaje',
                'class' => 'btn btn-primary mt-3',
            ],
        ]);
    }

    /**
     * Define los filtros y validaciones para garantizar datos correctos y seguros
     */
    public function getInputFilterSpecification(): array
    {
        return [
            'nombre' => [
                'required' => true,
                'filters'  => [
                    ['name' => 'StringTrim'],
                    ['name' => 'StripTags'],
                ],
                'validators' => [
                    [
                        'name' => NotEmpty::class,
                        'options' => [
                            'messages' => [
                                NotEmpty::IS_EMPTY => 'El campo nombre no puede estar vacío.',
                            ],
                        ],
                    ],
                    [
                        'name' => StringLength::class,
                        'options' => [
                            'min' => 2,
                            'max' => 100,
                            'messages' => [
                                StringLength::TOO_SHORT => 'El nombre debe tener al menos %min% caracteres.',
                                StringLength::TOO_LONG  => 'El nombre no puede superar los %max% caracteres.',
                            ],
                        ],
                    ],
                ],
            ],
            'email' => [
                'required' => true,
                'filters'  => [
                    ['name' => 'StringTrim'],
                    ['name' => 'StripTags'],
                ],
                'validators' => [
                    [
                        'name' => NotEmpty::class,
                        'options' => [
                            'messages' => [
                                NotEmpty::IS_EMPTY => 'El correo electrónico es obligatorio.',
                            ],
                        ],
                    ],
                    [
                        'name' => EmailAddress::class,
                        'options' => [
                            'messages' => [
                                EmailAddress::INVALID_FORMAT => 'El formato del correo electrónico no es válido.',
                            ],
                        ],
                    ],
                ],
            ],
            'mensaje' => [
                'required' => true,
                'filters'  => [
                    ['name' => 'StringTrim'],
                    ['name' => 'StripTags'],
                ],
                'validators' => [
                    [
                        'name' => NotEmpty::class,
                        'options' => [
                            'messages' => [
                                NotEmpty::IS_EMPTY => 'Por favor, escribe un mensaje.',
                            ],
                        ],
                    ],
                    [
                        'name' => StringLength::class,
                        'options' => [
                            'min' => 10,
                            'messages' => [
                                StringLength::TOO_SHORT => 'El mensaje debe contener al menos %min% caracteres.',
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}