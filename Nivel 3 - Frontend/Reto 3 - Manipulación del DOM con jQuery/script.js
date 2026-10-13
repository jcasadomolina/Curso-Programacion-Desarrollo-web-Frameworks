$(function () {
	// Selecciona todos los párrafos y modifica su contenido, estilo y atributo.
	$('.informacion')
		.css({
			color: '#24527a',
			'font-size': '1.1rem'
		})
		.attr('title', 'Información sobre la organización de tareas');

	$('#cambiar-estilo').on('click', function () {
		$('.informacion').css({
			'background-color': '#fff3cd',
			border: '1px solid #ffc107',
			padding: '10px'
		});
		$('.informacion').first().text('La planificación convierte tus objetivos en pasos sencillos.');
	});

	$('form').on('submit', function (event) {
		event.preventDefault();

		const tarea = $('#tarea').val().trim();
		const prioridad = $('#prioridad').val();

		if (tarea) {
			$('#lista-tareas').append(
				$('<li>').text(`${tarea} - prioridad ${prioridad}`)
			);
			$('#tarea').val('');
		}
	});

	$('#eliminar-tarea').on('click', function () {
		$('#lista-tareas li').last().remove();
	});
});
