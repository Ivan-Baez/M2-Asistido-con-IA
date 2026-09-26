'use client';

export const HISTORY_SECTIONS = [
  {
    id: 'cinematografo',
    year: '1895',
    label: 'EL NACIMIENTO',
    title: 'El Cinematógrafo de los Lumière',
    subtitle: 'La creación del dispositivo que cambió la historia',
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Institut_Lumi%C3%A8re_-_CINEMATOGRAPHE_Camera.jpg/250px-Institut_Lumi%C3%A8re_-_CINEMATOGRAPHE_Camera.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
    alt: 'Cinematógrafo de los hermanos Lumière',
    content: [
      'La idea de capturar, crear y reproducir el movimiento por medios mecánicos es muy antigua, y existieron antecedentes como la cámara oscura, el taumatropo, la linterna mágica o el fusil fotográfico.',
      'Inspirándose en estos y otros inventos como el rollo de fotos de Eastman, los hermanos Lumière crearon el cinematógrafo: un dispositivo que permitía la toma, proyección y copiado de imágenes en movimiento.',
      'A diferencia del quinetoscopio de Edison (visualización individual), el cinematógrafo permitía la proyección colectiva, sentando las bases del cine como experiencia social.',
    ],
    sideNote:
      'El cinematógrafo pesaba solo 5 kg y servía como cámara, proyector y copiadora.',
  },

  {
    id: 'primera-proyeccion',
    year: '1895',
    label: 'LA PRIMERA VEZ',
    title: 'Primera Proyección Pública',
    subtitle: 'Salón Indio del Gran Café, París — 28 diciembre 1895',
    image:
      ' https://newpostcity.wordpress.com/wp-content/uploads/2016/03/salon-indien-grand-cafe2.jpg ',
    alt: 'Llegada del tren a La Ciotat - primer filme proyectado',
    content: [
      'El 28 de diciembre de 1895 se realiza la primera proyección abierta al público en el Salón Indio del Gran Café de París. Por solo un franco, cualquier persona interesada pudo asistir a este evento histórico.',
      'Se proyectaron 10 películas de aproximadamente 50 segundos cada una, incluyendo "La salida de la fábrica Lumière en Lyon" y "La llegada del tren a La Ciotat".',
      'La leyenda cuenta que el público huyó despavorido al ver el tren acercarse en pantalla, aunque los historiadores debaten la veracidad de este mito fundacional.',
    ],
    sideNote:
      'Los Lumière consideraban el cine "un invento sin futuro comercial".',
  },

  {
    id: 'melies',
    year: '1902',
    label: 'LA FICCIÓN',
    title: 'Georges Méliès y el Cine de Ficción',
    subtitle: 'Viaje a la Luna — La primera película de ciencia ficción',
    image:
      'https://encadenados.org/wp-content/uploads/2016/01/rashomon_num_91_viaje-a-la-luna-0.jpg',
    alt: 'Viaje a la Luna - Georges Méliès',
    content: [
      'Georges Méliès, ilusionista y cineasta francés, llevó el cine más allá de la documentación de la realidad. En 1902 estrenó "Viaje a la Luna", considerada la primera película de ciencia ficción y la primera en usar efectos especiales narrativos.',
      'Méliès inventó técnicas como la sustitución (stop trick), la exposición múltiple, la disolución encadenada y el uso de maquetas pintadas, sentando las bases del lenguaje cinematográfico narrativo.',
      'Su estudio en Montreuil fue el primer "estudio de cine" de la historia, donde controlaba totalmente la iluminación y el decorado — precursor del sistema de estudios de Hollywood.',
    ],
    sideNote:
      'Méliès dirigió más de 500 películas; la mayoría se perdieron al fundir el celuloide para hacer botones de uniforme en la WWI.',
  },

  {
    id: 'sonido',
    year: '1927',
    label: 'EL SONIDO',
    title: 'El Cine Habla',
    subtitle: 'The Jazz Singer y el nacimiento del cine sonoro',
    image:
      ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV4A5M4XUZKGj5z4Wrtlo7AZHgo7KU8NqRGthQmBXuDGpJ9zaIbSC0ZfiU&s=10 ',
    alt: 'The Jazz Singer de 1927',
    content: [
      'La llegada del sonido sincronizado transformó radicalmente la experiencia cinematográfica. Las películas dejaron de depender exclusivamente de la imagen y comenzaron a incorporar diálogos, música y efectos sonoros sincronizados.',
      'The Jazz Singer, estrenada en 1927, marcó un punto de inflexión comercial en la transición hacia el cine sonoro.',
      'La nueva tecnología obligó a los estudios, actores y directores a modificar sus métodos de trabajo y cambió para siempre el lenguaje cinematográfico.',
    ],
    sideNote:
      'La transición al sonido hizo que muchas estrellas del cine mudo perdieran popularidad debido a sus voces o dificultades para adaptarse.',
  },

  {
    id: 'color',
    year: '1939',
    label: 'EL COLOR',
    title: 'El Cine se Llena de Color',
    subtitle: 'Technicolor y la transformación visual de Hollywood',
    image:
      'https://m.media-amazon.com/images/M/MV5BYmYxZTE3YzMtYmE2Yy00NmFlLTkzYTAtYTAzN2IzNDFkN2E0XkEyXkFqcGc@._V1_.jpg',
    alt: 'Gone with the Wind y el cine en Technicolor',
    content: [
      'El desarrollo de sistemas de color cada vez más sofisticados permitió que las películas adquirieran una nueva dimensión visual.',
      'Technicolor se convirtió en uno de los sistemas más importantes de la época y fue utilizado en grandes producciones de Hollywood.',
      'Gone with the Wind, estrenada en 1939, se convirtió en uno de los ejemplos más conocidos del impacto espectacular que podía producir el color en una gran producción cinematográfica.',
    ],
    sideNote:
      'El color no reemplazó inmediatamente al blanco y negro: durante décadas ambos sistemas coexistieron.',
  },

  {
    id: 'nuevas-formas',
    year: '1950',
    label: 'NUEVAS FORMAS',
    title: 'La Pantalla se Transforma',
    subtitle: 'Televisión, nuevos formatos y nuevas experiencias',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaR9lzaKoXwpA2trIZeRtm1csJcKm7ZxQpV38LcasOhTxIauoQXAjMoSQx&s=10',
    alt: 'Vertigo y la transformación del cine clásico',
    content: [
      'La expansión de la televisión obligó al cine a buscar nuevas formas de atraer al público hacia las salas.',
      'Las producciones comenzaron a experimentar con formatos panorámicos, nuevas tecnologías de sonido y experiencias visuales cada vez más espectaculares.',
      'Durante este periodo surgieron algunas de las obras más influyentes del cine moderno, mientras Hollywood buscaba diferenciar la experiencia cinematográfica de la televisión doméstica.',
    ],
    sideNote:
      'La aparición de la televisión fue uno de los grandes desafíos comerciales que enfrentó la industria cinematográfica.',
  },

  {
    id: 'blockbuster',
    year: '1977',
    label: 'BLOCKBUSTER',
    title: 'El Nacimiento del Cine Espectáculo',
    subtitle: 'Star Wars y una nueva era para Hollywood',
    image:
      'https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg',
    alt: 'Póster de Star Wars de 1977',
    content: [
      'En 1977, Star Wars transformó la manera en que Hollywood concebía las grandes producciones comerciales.',
      'George Lucas combinó efectos especiales, aventura, ciencia ficción y una estrategia de lanzamiento que convirtió la película en un fenómeno cultural.',
      'El éxito de estas grandes producciones consolidó el modelo de blockbuster y cambió la relación entre cine, merchandising, publicidad y cultura popular.',
    ],
    sideNote:
      'Star Wars ayudó a establecer una nueva forma de entender una película como una experiencia cultural que podía extenderse mucho más allá de la sala.',
  },

  {
    id: 'digital',
    year: '1995',
    label: 'ERA DIGITAL',
    title: 'El Cine Entra en la Era Digital',
    subtitle: 'Toy Story y la revolución de la animación por ordenador',
    image:
      'https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg',
    alt: 'Póster de Toy Story',
    content: [
      'La llegada de las herramientas digitales comenzó a transformar profundamente la producción cinematográfica.',
      'En 1995, Toy Story se convirtió en un momento histórico para la animación al ser el primer largometraje completamente realizado mediante imágenes generadas por ordenador.',
      'La tecnología digital abrió nuevas posibilidades creativas y cambió progresivamente la forma de producir, editar, distribuir y experimentar el cine.',
    ],
    sideNote:
      'La revolución digital no ocurrió de un día para otro: durante años convivieron procesos tradicionales y digitales.',
  },

  {
    id: 'streaming',
    year: '2020',
    label: 'STREAMING',
    title: 'El Cine Cambia de Pantalla',
    subtitle: 'La expansión definitiva de las plataformas digitales',
    image:
      ' https://www.socialfuturo.com/wp-content/uploads/2023/11/netflix-vs-cine-aburrimiento-vs-diversion.jpg ',
    alt: 'Sala de cine y experiencia audiovisual',
    content: [
      'La expansión del streaming transformó profundamente la manera en que el público accede a películas y series.',
      'Durante la pandemia de 2020, el cierre de las salas cinematográficas aceleró todavía más la adopción de plataformas digitales y nuevas formas de distribución.',
      'El cine continúa evolucionando entre las salas tradicionales, las plataformas digitales y nuevas experiencias audiovisuales.',
    ],
    sideNote:
      'La historia del cine continúa escribiéndose con cada nueva tecnología y cada nueva forma de contar historias.',
  },
];