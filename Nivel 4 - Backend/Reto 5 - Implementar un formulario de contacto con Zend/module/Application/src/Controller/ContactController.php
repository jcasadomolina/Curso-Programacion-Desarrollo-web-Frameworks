<?php

namespace Application\Controller;

use Application\Form\ContactForm;
use Application\Model\Contacto;
use Application\Model\ContactoMapper;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\ViewModel;

class ContactController extends AbstractActionController
{
    private ContactoMapper $contactoMapper;

    public function __construct(ContactoMapper $contactoMapper)
    {
        $this->contactoMapper = $contactoMapper;
    }

    /**
     * Muestra la vista con el formulario de contacto
     */
    public function indexAction(): ViewModel
    {
        $form = new ContactForm();

        return new ViewModel([
            'form' => $form,
        ]);
    }

    /**
     * Recibe y procesa los datos enviados mediante POST
     */
    public function processAction()
    {
        $request = $this->getRequest();

        if (!$request->isPost()) {
            return $this->redirect()->toRoute('contacto');
        }

        $form = new ContactForm();
        $form->setData($request->getPost());

        if (!$form->isValid()) {
            $viewModel = new ViewModel(['form' => $form]);
            $viewModel->setTemplate('application/contact/index');
            return $viewModel;
        }

        // Instanciar y mapear el contacto
        $contacto = new Contacto();
        $contacto->exchangeArray($form->getData());

        // Guardar en MySQL mediante el Mapper
        $this->contactoMapper->saveContacto($contacto);

        // Renderizar directamente la vista de confirmación (success)
        $viewModel = new ViewModel();
        $viewModel->setTemplate('application/contact/success');
        return $viewModel;
    }
}