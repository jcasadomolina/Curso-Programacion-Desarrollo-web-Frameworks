function getRandomDog() {
	const listaPerros = $("#lista-perros");

	listaPerros.html("<li>Cargando...</li>");

	$.ajax({
		url: "https://dog.ceo/api/breeds/image/random",
		method: "GET",
		dataType: "json"
	})
	.done(function (respuesta) {
		const partesRuta = new URL(respuesta.message).pathname.split("/");
		const nombreRaza = partesRuta[2]
			.replace(/-/g, " ")
			.replace(/\b\w/g, function (letra) {
				return letra.toUpperCase();
			});
		const titulo = $("<h3>").text("Raza: " + nombreRaza);
		const imagen = $("<img>", {
			src: respuesta.message,
			alt: "Perro de raza " + nombreRaza,
			width: 400
		});

		listaPerros.empty().append(titulo, imagen);
	})
	.fail(function () {
		listaPerros.html("<li>No se pudo obtener la imagen del perro.</li>");
	});
}

function getBreeds() {
	const selectorRaza = $("#raza-perro");

	$.getJSON("https://dog.ceo/api/breeds/list/all")
		.done(function (respuesta) {
			selectorRaza.empty().append("<option value=''>Selecciona una raza</option>");

			Object.keys(respuesta.message).forEach(function (raza) {
				const subrazas = respuesta.message[raza];

				if (subrazas.length === 0) {
					selectorRaza.append(
						$("<option>", { value: raza }).text(raza)
					);
					return;
				}

				subrazas.forEach(function (subraza) {
					selectorRaza.append(
						$("<option>", { value: raza + "/" + subraza })
							.text(subraza + " " + raza)
					);
				});
			});

			$("#busca-perro").prop("disabled", false);
		})
		.fail(function () {
			selectorRaza.html("<option value=''>No se pudieron cargar las razas</option>");
		});
}

function getDogByBreed() {
	const raza = $("#raza-perro").val();
	const listaPerros = $("#lista-perros");

	if (!raza) {
		listaPerros.text("Selecciona una raza para realizar la búsqueda.");
		return;
	}

	listaPerros.text("Buscando...");

	$.getJSON("https://dog.ceo/api/breed/" + raza + "/images/random")
		.done(function (respuesta) {
			const nombreRaza = raza.replace("/", " ");
			const titulo = $("<h3>").text("Raza: " + nombreRaza);
			const imagen = $("<img>", {
				src: respuesta.message,
				alt: "Perro de raza " + nombreRaza,
				width: 400
			});

			listaPerros.empty().append(titulo, imagen);
		})
		.fail(function () {
			listaPerros.text("No se pudo obtener la imagen de esa raza.");
		});
}
