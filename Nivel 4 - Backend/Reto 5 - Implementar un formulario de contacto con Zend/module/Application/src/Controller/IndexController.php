<?php

declare(strict_types=1);

namespace Application\Controller;

use Application\Form\ContactForm;
use Application\Model\Contacto;
use Application\Model\ContactoMapper;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    public function __construct(private ContactoMapper $contactoMapper)
    {
    }

    public function indexAction(): ViewModel
    {
        $form = new ContactForm();

        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());

            if ($form->isValid()) {
                $contacto = new Contacto();
                $contacto->exchangeArray($form->getData());
                $this->contactoMapper->saveContacto($contacto);

                return new ViewModel(['saved' => true]);
            }
        }

        return new ViewModel(['form' => $form]);
    }
}