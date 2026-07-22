/* ============================================================
   Vital40 — Base de ejercicios y motor de generación de rutinas
   Pensado para adultos de 40+ años: prioriza calentamiento,
   movilidad articular, técnica controlada y progresión segura.
   ============================================================ */

// equipment: "ninguno" | "mancuernas" | "banda" | "gym"
// avoid: lista de limitaciones para las que el ejercicio NO es recomendable
// level: nivel mínimo requerido: "principiante" | "intermedio" | "avanzado"
// pattern: agrupador funcional usado por el generador de rutinas
// steps: pasos breves de ejecución, para el modal "cómo se hace"

const PATTERN_META = {
  warmup:    { label: "Calentamiento", color: "#14B8A6", icon: "🔥" },
  piernas:   { label: "Piernas",       color: "#3B82F6", icon: "🦵" },
  gluteos:   { label: "Glúteos",       color: "#A855F7", icon: "🍑" },
  espalda:   { label: "Espalda",       color: "#6366F1", icon: "🔙" },
  pecho:     { label: "Pecho",         color: "#EF4444", icon: "💪" },
  hombros:   { label: "Hombros",       color: "#F97316", icon: "🏋️" },
  brazos:    { label: "Brazos",        color: "#F59E0B", icon: "💪" },
  core:      { label: "Core",          color: "#EAB308", icon: "⭐" },
  cardio:    { label: "Cardio",        color: "#EC4899", icon: "❤️" },
  cooldown:  { label: "Estiramiento",  color: "#14B8A6", icon: "🧘" },
};

const EXERCISES = [
  // ---------- CALENTAMIENTO / MOVILIDAD ----------
  { id: "warm_marcha", name: "Marcha en el lugar con elevación de rodillas", pattern: "warmup", equipment: "ninguno", avoid: [], level: "principiante", cue: "1-2 min, ritmo suave para activar.",
    steps: ["Parate derecho, mirada al frente.", "Elevá una rodilla hacia la cadera y bajá, alterná con la otra.", "Movés los brazos como si caminaras, ritmo cómodo.", "Mantené 1-2 minutos respirando normal."] },
  { id: "warm_circ_hombro", name: "Círculos de hombros (adelante y atrás)", pattern: "warmup", equipment: "ninguno", avoid: [], level: "principiante", cue: "10 repeticiones por lado, movimiento amplio y lento.",
    steps: ["Parate con los brazos relajados al costado.", "Dibujá círculos grandes con los hombros hacia adelante, 10 veces.", "Repetí 10 veces hacia atrás.", "Mantené el cuello relajado durante todo el movimiento."] },
  { id: "warm_circ_cadera", name: "Círculos de cadera", pattern: "warmup", equipment: "ninguno", avoid: [], level: "principiante", cue: "10 por lado.",
    steps: ["Manos en la cintura, pies separados al ancho de cadera.", "Dibujá círculos amplios con la cadera, 10 hacia cada lado.", "Movimiento controlado, sin forzar la zona lumbar."] },
  { id: "warm_gato_camello", name: "Gato-camello (movilidad de columna)", pattern: "warmup", equipment: "ninguno", avoid: [], level: "principiante", cue: "8-10 repeticiones, sincronizado con la respiración.",
    steps: ["Apoyate en cuatro patas (manos y rodillas).", "Al inhalar, hundí el pecho y mirá hacia arriba (posición vaca).", "Al exhalar, redondeá la espalda hacia el techo y mirá el ombligo (posición gato).", "Repetí 8-10 veces con movimiento fluido."] },
  { id: "warm_sentadilla_aire", name: "Sentadilla al aire sin peso", pattern: "warmup", equipment: "ninguno", avoid: [], level: "principiante", cue: "10-12 repeticiones, activa piernas y cadera.",
    steps: ["Pies al ancho de hombros, pecho arriba.", "Bajá como si te sentaras en una silla, rodillas alineadas con los pies.", "Bajá hasta donde te sea cómodo y subí controlado.", "Repetí 10-12 veces sin peso, solo para activar."] },
  { id: "warm_zancadas_din", name: "Zancada dinámica con giro de tronco", pattern: "warmup", equipment: "ninguno", avoid: ["rodilla"], level: "principiante", cue: "6 por lado.",
    steps: ["Dá un paso largo hacia adelante con una pierna.", "Al bajar, girá suavemente el tronco hacia el lado de la pierna adelantada.", "Volvé al centro y regresá a la posición inicial.", "Alterná 6 veces por lado."] },
  { id: "warm_tobillo", name: "Movilidad de tobillo (rotaciones)", pattern: "warmup", equipment: "ninguno", avoid: [], level: "principiante", cue: "10 por lado.",
    steps: ["Sentado o apoyado en una pared, levantá un pie del piso.", "Rotá el tobillo 10 veces en un sentido y 10 en el otro.", "Cambiá de pie y repetí."] },

  // ---------- PIERNAS / GLÚTEOS (bajo impacto, cuidando rodilla y espalda baja) ----------
  { id: "leg_sentadilla_silla", name: "Sentadilla a silla (sit-to-stand)", pattern: "piernas", equipment: "ninguno", avoid: [], level: "principiante", cue: "Baja controlado hasta rozar la silla, sube sin impulso.",
    steps: ["Parate frente a una silla firme, de espaldas a ella.", "Bajá controlado flexionando cadera y rodillas hasta rozar el asiento.", "Sin dejarte caer, tocá apenas la silla y subí empujando con los talones.", "Repetí sin usar impulso ni las manos."] },
  { id: "leg_sentadilla_copa", name: "Sentadilla copa con mancuerna", pattern: "piernas", equipment: "mancuernas", avoid: ["rodilla"], level: "intermedio", cue: "Peso en talones, rodillas alineadas con los pies.",
    steps: ["Sostené una mancuerna con ambas manos a la altura del pecho.", "Pies un poco más abiertos que los hombros.", "Bajá manteniendo el pecho arriba y el peso en los talones.", "Subí empujando el piso, sin que las rodillas se vayan hacia adentro."] },
  { id: "leg_puente_gluteo", name: "Puente de glúteo", pattern: "gluteos", equipment: "ninguno", avoid: [], level: "principiante", cue: "Aprieta glúteo arriba 1-2 seg, cuida no hiperextender espalda.",
    steps: ["Acostate boca arriba, rodillas flexionadas, pies apoyados.", "Empujá con los talones y elevá la cadera apretando el glúteo.", "Sostené 1-2 segundos arriba sin arquear de más la espalda.", "Bajá controlado y repetí."] },
  { id: "leg_puente_un_pie", name: "Puente de glúteo a una pierna", pattern: "gluteos", equipment: "ninguno", avoid: ["espalda_baja"], level: "intermedio", cue: "Alterna lados.",
    steps: ["Igual que el puente normal, pero con una pierna estirada al aire.", "Elevá la cadera apoyando solo el pie que queda en el piso.", "Sostené arriba, bajá controlado.", "Completá las repeticiones de un lado y luego el otro."] },
  { id: "leg_zancada_estatica", name: "Zancada estática (split squat)", pattern: "piernas", equipment: "ninguno", avoid: ["rodilla"], level: "intermedio", cue: "Apoyo en pared si hace falta equilibrio.",
    steps: ["Un pie adelante, otro atrás, en posición de paso largo.", "Bajá la rodilla trasera hacia el piso sin golpearlo.", "La rodilla delantera no debe pasar la punta del pie.", "Subí y repetí; usá una pared o silla si necesitás equilibrio."] },
  { id: "leg_peso_muerto_pierna", name: "Peso muerto rumano a una pierna (con apoyo)", pattern: "gluteos", equipment: "mancuernas", avoid: ["espalda_baja", "rodilla"], level: "avanzado", cue: "Espalda neutra, cadera hacia atrás.",
    steps: ["Parate en una pierna, mancuerna en la mano contraria.", "Inclinate hacia adelante llevando la cadera hacia atrás, espalda recta.", "La otra pierna se eleva atrás para hacer contrapeso.", "Volvé a la posición inicial de forma controlada."] },
  { id: "leg_elevacion_talones", name: "Elevación de talones (pantorrillas)", pattern: "piernas", equipment: "ninguno", avoid: [], level: "principiante", cue: "15-20 repeticiones, apoyo en pared o silla.",
    steps: ["Parate con los pies apoyados, sostenido de una silla o pared.", "Elevate en punta de pies lo más alto posible.", "Bajá controlado sin dejarte caer.", "Repetí 15-20 veces."] },
  { id: "leg_abduccion_cadera", name: "Abducción de cadera de pie (con banda opcional)", pattern: "gluteos", equipment: "ninguno", avoid: [], level: "principiante", cue: "Controlado, sin balancear el tronco.",
    steps: ["Parate sosteniéndote de una silla o pared.", "Elevá una pierna hacia el costado sin inclinar el tronco.", "Bajá controlado y repetí antes de cambiar de lado."] },
  { id: "leg_step_up", name: "Subida a step/escalón", pattern: "piernas", equipment: "ninguno", avoid: ["rodilla"], level: "intermedio", cue: "Escalón bajo, controla el descenso.",
    steps: ["Ubicate frente a un escalón o step bajo.", "Subí apoyando todo el pie, empujando con esa pierna.", "Bajá controlado, sin dejarte caer.", "Alterná la pierna que inicia el movimiento."] },
  { id: "leg_prensa_gym", name: "Prensa de piernas (máquina)", pattern: "piernas", equipment: "gym", avoid: [], level: "intermedio", cue: "Recorrido controlado, no bloquees rodillas del todo.",
    steps: ["Sentate en la máquina con los pies al ancho de hombros en la plataforma.", "Bajá controlado flexionando las rodillas hacia el pecho.", "Empujá sin bloquear las rodillas del todo al extender.", "Mantené la zona lumbar apoyada en el respaldo."] },
  { id: "leg_extension_gym", name: "Extensión de cuádriceps (máquina)", pattern: "piernas", equipment: "gym", avoid: ["rodilla"], level: "intermedio", cue: "Peso moderado, foco en control.",
    steps: ["Sentate en la máquina con el respaldo ajustado.", "Extendé las piernas de forma controlada, sin trabar la rodilla.", "Bajá lento, sin soltar el peso de golpe."] },
  { id: "leg_femoral_gym", name: "Curl femoral (máquina)", pattern: "piernas", equipment: "gym", avoid: [], level: "intermedio", cue: "Buen apoyo lumbar.",
    steps: ["Acostate boca abajo o sentate según el modelo de máquina.", "Flexioná las rodillas llevando el peso hacia los glúteos.", "Volvé despacio a la posición inicial, sin soltar de golpe."] },

  // ---------- ESPALDA / TIRÓN ----------
  { id: "back_remo_mancuerna", name: "Remo con mancuerna a un brazo (apoyo en banco)", pattern: "espalda", equipment: "mancuernas", avoid: [], level: "principiante", cue: "Espalda plana, codo pegado al cuerpo.",
    steps: ["Apoyá una rodilla y una mano en un banco o silla firme.", "Sostené la mancuerna con el otro brazo, colgando hacia abajo.", "Tirá el codo hacia atrás pegado al cuerpo, apretando la espalda.", "Bajá controlado y repetí; cambiá de lado."] },
  { id: "back_remo_banda", name: "Remo con banda elástica", pattern: "espalda", equipment: "banda", avoid: [], level: "principiante", cue: "Aprieta escápulas al final del movimiento.",
    steps: ["Sentate con las piernas extendidas y la banda alrededor de los pies.", "Sostené los extremos de la banda con ambas manos.", "Tirá los codos hacia atrás apretando las escápulas.", "Volvé controlado a la posición inicial."] },
  { id: "back_superman", name: "Superman (extensión suave de espalda)", pattern: "espalda", equipment: "ninguno", avoid: ["espalda_baja"], level: "principiante", cue: "Eleva poco, sin forzar, controla la bajada.",
    steps: ["Acostate boca abajo, brazos extendidos al frente.", "Elevá levemente brazos y piernas del piso al mismo tiempo.", "Sostené 1-2 segundos sin forzar.", "Bajá controlado."] },
  { id: "back_jalon_gym", name: "Jalón al pecho (polea)", pattern: "espalda", equipment: "gym", avoid: ["hombro"], level: "intermedio", cue: "No lleves la barra detrás de la nuca.",
    steps: ["Sentate en la máquina y sujetá la barra con agarre amplio.", "Tirá la barra hacia el pecho, sin llevarla detrás de la nuca.", "Apretá la espalda al final del movimiento.", "Volvé controlado hacia arriba."] },
  { id: "back_remo_gym", name: "Remo en polea baja", pattern: "espalda", equipment: "gym", avoid: [], level: "intermedio", cue: "Espalda erguida, tira con los codos.",
    steps: ["Sentate con las rodillas levemente flexionadas, agarrá la manija.", "Tirá llevando los codos hacia atrás, espalda erguida.", "Apretá las escápulas al final.", "Volvé controlado sin redondear la espalda."] },
  { id: "back_face_pull", name: "Face pull con banda (salud de hombro)", pattern: "espalda", equipment: "banda", avoid: [], level: "principiante", cue: "Excelente para postura; tira hacia la cara controlado.",
    steps: ["Sostené la banda anclada al frente, a la altura de la cara.", "Tirá separando las manos, llevando los codos hacia atrás y arriba.", "Apretá las escápulas al final del recorrido.", "Volvé controlado."] },

  // ---------- PECHO / EMPUJE ----------
  { id: "chest_flexion_pared", name: "Flexión de brazos inclinada (pared o mesa)", pattern: "pecho", equipment: "ninguno", avoid: [], level: "principiante", cue: "Cuanto más vertical, más fácil. Progresa bajando el ángulo.",
    steps: ["Apoyá las manos en una pared o mesa, un poco más abiertas que los hombros.", "Cuerpo recto, alejate hasta sentir tensión.", "Flexioná los codos acercando el pecho a la superficie.", "Empujá para volver a la posición inicial."] },
  { id: "chest_flexion_rodillas", name: "Flexión de brazos con apoyo de rodillas", pattern: "pecho", equipment: "ninguno", avoid: ["hombro"], level: "intermedio", cue: "Cuerpo alineado de rodilla a cabeza.",
    steps: ["Apoyate en manos y rodillas, manos un poco más abiertas que los hombros.", "Mantené el cuerpo alineado desde la rodilla hasta la cabeza.", "Bajá el pecho hacia el piso flexionando los codos.", "Empujá para volver arriba sin perder la alineación."] },
  { id: "chest_press_mancuerna", name: "Press de pecho con mancuernas (suelo o banco)", pattern: "pecho", equipment: "mancuernas", avoid: ["hombro"], level: "intermedio", cue: "Rango cómodo, sin forzar el hombro al final.",
    steps: ["Acostate boca arriba con una mancuerna en cada mano a la altura del pecho.", "Empujá hacia arriba sin bloquear del todo los codos.", "Bajá controlado hasta un rango cómodo para el hombro.", "Repetí sin rebotar en el piso."] },
  { id: "chest_press_gym", name: "Press de banca en máquina", pattern: "pecho", equipment: "gym", avoid: ["hombro"], level: "intermedio", cue: "Ajusta el asiento para que el agarre quede a la altura del pecho.",
    steps: ["Ajustá el asiento para que las manijas queden a la altura del pecho.", "Empujá hacia adelante de forma controlada.", "Volvé despacio sin dejar caer el peso.", "Repetí manteniendo la espalda apoyada."] },
  { id: "chest_apertura_banda", name: "Aperturas con banda elástica", pattern: "pecho", equipment: "banda", avoid: [], level: "principiante", cue: "Movimiento amplio y controlado.",
    steps: ["Sostené la banda con ambas manos al frente del pecho.", "Abrí los brazos hacia los costados estirando la banda.", "Apretá el pecho al final del movimiento.", "Volvé controlado a la posición inicial."] },

  // ---------- HOMBROS (cuidando manguito rotador) ----------
  { id: "shoulder_elevacion_lateral", name: "Elevación lateral con mancuernas ligeras", pattern: "hombros", equipment: "mancuernas", avoid: ["hombro"], level: "intermedio", cue: "Hasta la altura del hombro, sin encoger el cuello.",
    steps: ["Parate con una mancuerna liviana en cada mano, al costado del cuerpo.", "Elevá los brazos hacia los lados hasta la altura del hombro.", "Evitá encoger el cuello durante el movimiento.", "Bajá controlado y repetí."] },
  { id: "shoulder_press_sentado", name: "Press de hombro sentado con mancuernas", pattern: "hombros", equipment: "mancuernas", avoid: ["hombro"], level: "intermedio", cue: "Rango cómodo, evita bloquear codos con fuerza.",
    steps: ["Sentate con una mancuerna en cada mano a la altura de los hombros.", "Empujá hacia arriba sin bloquear los codos con fuerza.", "Bajá controlado hasta la posición inicial.", "Mantené el core activado para no arquear la espalda."] },
  { id: "shoulder_rotacion_externa", name: "Rotación externa de hombro con banda (salud articular)", pattern: "hombros", equipment: "banda", avoid: [], level: "principiante", cue: "Codo pegado al cuerpo, muy recomendable para prevenir molestias.",
    steps: ["Sostené la banda con el codo pegado a las costillas, flexionado 90°.", "Girá el antebrazo hacia afuera sin despegar el codo del cuerpo.", "Volvé controlado a la posición inicial.", "Repetí de ambos lados."] },

  // ---------- BRAZOS ----------
  { id: "arm_curl_mancuerna", name: "Curl de bíceps con mancuernas", pattern: "brazos", equipment: "mancuernas", avoid: [], level: "principiante", cue: "Sin balancear el cuerpo.",
    steps: ["Parate con una mancuerna en cada mano, brazos extendidos.", "Flexioná los codos llevando el peso hacia los hombros.", "Bajá controlado sin balancear el cuerpo.", "Mantené los codos fijos junto al torso."] },
  { id: "arm_triceps_silla", name: "Fondos de tríceps en silla", pattern: "brazos", equipment: "ninguno", avoid: ["hombro"], level: "intermedio", cue: "Piernas más flexionadas = más fácil.",
    steps: ["Sentate en el borde de una silla firme, manos apoyadas a los costados.", "Deslizá la cadera hacia adelante, fuera de la silla.", "Bajá flexionando los codos hacia atrás.", "Empujá para volver arriba; a más flexión de piernas, más fácil."] },
  { id: "arm_triceps_mancuerna", name: "Extensión de tríceps con mancuerna", pattern: "brazos", equipment: "mancuernas", avoid: ["hombro"], level: "intermedio", cue: "Codo fijo, movimiento controlado.",
    steps: ["Sentado o de pie, sostené una mancuerna con ambas manos detrás de la cabeza.", "Mantené los codos apuntando hacia arriba y fijos.", "Extendé los brazos hacia arriba.", "Bajá controlado sin mover los codos."] },

  // ---------- CORE (cuidando espalda baja) ----------
  { id: "core_plancha_rodillas", name: "Plancha abdominal con apoyo de rodillas", pattern: "core", equipment: "ninguno", avoid: [], level: "principiante", cue: "Cuerpo alineado, respira normal, 15-30 seg.",
    steps: ["Apoyate en antebrazos y rodillas en el piso.", "Alineá cabeza, espalda y cadera en una línea recta.", "Sostené la posición respirando con normalidad.", "Mantené 15-30 segundos."] },
  { id: "core_plancha_completa", name: "Plancha abdominal completa", pattern: "core", equipment: "ninguno", avoid: [], level: "intermedio", cue: "20-40 seg, sin dejar caer la cadera.",
    steps: ["Apoyate en antebrazos y puntas de los pies.", "Alineá cabeza, espalda y cadera, sin que la cadera caiga ni suba de más.", "Activá el abdomen y sostené la posición.", "Mantené 20-40 segundos."] },
  { id: "core_muerto_insectos", name: "Dead bug (muerto de insecto)", pattern: "core", equipment: "ninguno", avoid: [], level: "principiante", cue: "Excelente y seguro para espalda baja. Lento y controlado.",
    steps: ["Acostate boca arriba, brazos hacia el techo, rodillas flexionadas a 90°.", "Bajá lentamente un brazo y la pierna contraria hacia el piso.", "Mantené la zona lumbar pegada al piso todo el tiempo.", "Volvé al centro y alterná del otro lado."] },
  { id: "core_pajaro_perro", name: "Bird dog (pájaro-perro)", pattern: "core", equipment: "ninguno", avoid: [], level: "principiante", cue: "Estabiliza cadera, no gires el tronco.",
    steps: ["Apoyate en cuatro patas, manos bajo los hombros, rodillas bajo la cadera.", "Extendé un brazo y la pierna contraria al mismo tiempo.", "Mantené la cadera estable, sin girar el tronco.", "Volvé al centro y alterná del otro lado."] },
  { id: "core_abdominal_curl", name: "Abdominal curl corto (crunch suave)", pattern: "core", equipment: "ninguno", avoid: ["espalda_baja"], level: "intermedio", cue: "Rango corto, sin tirar del cuello.",
    steps: ["Acostate boca arriba, rodillas flexionadas, manos detrás de la cabeza sin entrelazar.", "Elevá los hombros del piso en un rango corto.", "No tires del cuello con las manos.", "Bajá controlado y repetí."] },
  { id: "core_lateral", name: "Plancha lateral con apoyo de rodilla", pattern: "core", equipment: "ninguno", avoid: [], level: "intermedio", cue: "Alterna lados, 15-20 seg cada uno.",
    steps: ["Acostate de lado, apoyado en el antebrazo y la rodilla del mismo lado.", "Elevá la cadera formando una línea recta entre hombro y rodilla.", "Sostené 15-20 segundos.", "Cambiá de lado y repetí."] },

  // ---------- CARDIO (opciones bajo y alto impacto) ----------
  { id: "cardio_caminata", name: "Caminata a ritmo sostenido", pattern: "cardio", equipment: "ninguno", avoid: [], level: "principiante", impact: "bajo", cue: "15-25 min a ritmo que permita hablar con algo de esfuerzo.",
    steps: ["Caminá a un ritmo constante, algo más rápido que lo habitual.", "Deberías poder hablar, pero con algo de esfuerzo.", "Mantené el ritmo entre 15 y 25 minutos.", "Terminá bajando el ritmo los últimos 2 minutos."] },
  { id: "cardio_bici", name: "Bicicleta fija o elíptica", pattern: "cardio", equipment: "gym", avoid: [], level: "principiante", impact: "bajo", cue: "15-20 min, resistencia moderada.",
    steps: ["Ajustá el asiento a la altura de tu cadera.", "Pedaleá con resistencia moderada durante 15-20 minutos.", "Mantené un ritmo constante que te permita conversar."] },
  { id: "cardio_step_lento", name: "Step touch / paso lateral", pattern: "cardio", equipment: "ninguno", avoid: [], level: "principiante", impact: "bajo", cue: "3-4 min continuos.",
    steps: ["Dá un paso amplio hacia un costado y juntá el otro pie.", "Alterná de lado en lado a ritmo constante.", "Sumá movimiento de brazos si querés más intensidad.", "Mantené 3-4 minutos continuos."] },
  { id: "cardio_jumping_jacks", name: "Jumping jacks (saltos de tijera)", pattern: "cardio", equipment: "ninguno", avoid: ["rodilla"], level: "intermedio", impact: "alto", cue: "30-40 seg, sustituir por step touch si molesta la rodilla.",
    steps: ["Parado con pies juntos y brazos al costado.", "Saltá abriendo piernas y brazos al mismo tiempo.", "Saltá de nuevo volviendo a la posición inicial.", "Mantené un ritmo constante 30-40 segundos."] },
  { id: "cardio_burpee_suave", name: "Burpee sin salto (versión suave)", pattern: "cardio", equipment: "ninguno", avoid: ["rodilla", "hombro"], level: "avanzado", impact: "medio", cue: "8-10 repeticiones, sin remate de salto.",
    steps: ["Desde parado, agachate y apoyá las manos en el piso.", "Llevá los pies hacia atrás en posición de plancha.", "Volvé a traer los pies hacia las manos.", "Parate sin saltar y repetí."] },

  // ---------- ESTIRAMIENTO / VUELTA A LA CALMA ----------
  { id: "cool_isquios", name: "Estiramiento de isquiotibiales de pie o sentado", pattern: "cooldown", equipment: "ninguno", avoid: [], level: "principiante", cue: "30 seg por lado, sin rebotar.",
    steps: ["Sentado o de pie, extendé una pierna apoyando el talón.", "Inclinate hacia adelante desde la cadera, espalda recta.", "Sostené 30 segundos sin rebotar.", "Cambiá de lado."] },
  { id: "cool_cuadriceps", name: "Estiramiento de cuádriceps de pie (apoyo en pared)", pattern: "cooldown", equipment: "ninguno", avoid: ["rodilla"], level: "principiante", cue: "30 seg por lado.",
    steps: ["Apoyate en una pared con una mano para el equilibrio.", "Tomá el tobillo con la otra mano y llevalo hacia el glúteo.", "Mantené las rodillas juntas y la cadera alineada.", "Sostené 30 segundos y cambiá de lado."] },
  { id: "cool_pecho", name: "Estiramiento de pecho en marco de puerta", pattern: "cooldown", equipment: "ninguno", avoid: [], level: "principiante", cue: "30 seg por lado.",
    steps: ["Apoyá el antebrazo en el marco de una puerta, codo a la altura del hombro.", "Girá suavemente el cuerpo hacia el lado contrario.", "Sentí el estiramiento en el pecho sin forzar.", "Sostené 30 segundos y cambiá de lado."] },
  { id: "cool_espalda", name: "Estiramiento de espalda (postura de niño)", pattern: "cooldown", equipment: "ninguno", avoid: [], level: "principiante", cue: "30-45 seg, respiración profunda.",
    steps: ["Sentate sobre los talones y llevá el tronco hacia adelante.", "Estirá los brazos al frente, apoyando la frente en el piso.", "Respirá profundo, relajando la espalda.", "Sostené 30-45 segundos."] },
  { id: "cool_gluteo", name: "Estiramiento de glúteo (figura 4)", pattern: "cooldown", equipment: "ninguno", avoid: ["rodilla"], level: "principiante", cue: "30 seg por lado.",
    steps: ["Acostado boca arriba, cruzá un tobillo sobre la rodilla contraria.", "Tomá la pierna de apoyo con las manos y llevala hacia el pecho.", "Sentí el estiramiento en el glúteo del lado cruzado.", "Sostené 30 segundos y cambiá de lado."] },
  { id: "cool_gemelo", name: "Estiramiento de gemelo en pared", pattern: "cooldown", equipment: "ninguno", avoid: [], level: "principiante", cue: "30 seg por lado.",
    steps: ["Apoyá las manos en una pared, un pie adelante y otro atrás.", "Mantené el talón trasero apoyado en el piso y la pierna estirada.", "Inclinate hacia la pared hasta sentir el estiramiento en la pantorrilla.", "Sostené 30 segundos y cambiá de lado."] },
];

/* ---------- Utilidades ---------- */

function equipmentAllows(exEquip, userEquip) {
  // userEquip: "ninguno" | "mancuernas" | "gym"  (gym incluye todo)
  if (exEquip === "ninguno") return true;
  if (userEquip === "gym") return true; // gym cubre mancuernas y bandas también
  if (userEquip === "mancuernas") return exEquip === "mancuernas" || exEquip === "banda";
  return false;
}

function levelRank(l) {
  return { principiante: 0, intermedio: 1, avanzado: 2 }[l] ?? 0;
}

function filterPool(profile) {
  return EXERCISES.filter((ex) => {
    if (!equipmentAllows(ex.equipment, profile.equipment)) return false;
    if (levelRank(ex.level) > levelRank(profile.level)) return false;
    if (ex.avoid && ex.avoid.some((a) => profile.limitations.includes(a))) return false;
    if (ex.impact === "alto" && profile.limitations.includes("rodilla")) return false;
    return true;
  });
}

function pick(pool, pattern, count, excludeIds = []) {
  const candidates = pool.filter((e) => e.pattern === pattern && !excludeIds.includes(e.id));
  // orden pseudo-aleatorio pero estable por sesión
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Devuelve alternativas válidas para reemplazar un ejercicio dado, respetando
// el perfil del usuario (equipamiento, nivel, limitaciones) y el mismo patrón.
function getAlternatives(exercise, profile, excludeIds = []) {
  const pool = filterPool(profile);
  return pool.filter((e) => e.pattern === exercise.pattern && e.id !== exercise.id && !excludeIds.includes(e.id));
}

// Sets/reps/descanso según nivel y objetivo
function volumeFor(profile) {
  const { level, goal } = profile;
  const table = {
    fuerza: {
      principiante: { sets: 3, reps: "10-12", rest: 75 },
      intermedio: { sets: 4, reps: "8-10", rest: 90 },
      avanzado: { sets: 4, reps: "6-8", rest: 120 },
    },
    perdida_grasa: {
      principiante: { sets: 3, reps: "12-15", rest: 30 },
      intermedio: { sets: 3, reps: "15", rest: 30 },
      avanzado: { sets: 4, reps: "15-20", rest: 30 },
    },
    resistencia_cardio: {
      principiante: { sets: 2, reps: "12-15", rest: 45 },
      intermedio: { sets: 3, reps: "15", rest: 40 },
      avanzado: { sets: 3, reps: "15-20", rest: 30 },
    },
    movilidad: {
      principiante: { sets: 2, reps: "10-12", rest: 30 },
      intermedio: { sets: 2, reps: "12-15", rest: 30 },
      avanzado: { sets: 3, reps: "12-15", rest: 30 },
    },
    mantenimiento: {
      principiante: { sets: 2, reps: "12", rest: 60 },
      intermedio: { sets: 3, reps: "10-12", rest: 60 },
      avanzado: { sets: 3, reps: "10-12", rest: 60 },
    },
  };
  return table[goal][level];
}

// Define la "plantilla" de la semana según días disponibles
function splitFor(daysPerWeek) {
  if (daysPerWeek <= 2) return ["full", "full"];
  if (daysPerWeek === 3) return ["full", "full", "full"];
  if (daysPerWeek === 4) return ["superior", "inferior", "superior", "inferior"];
  return ["empuje", "tirón", "piernas", "superior", "cardio_movilidad"];
}

const DAY_LABELS = {
  full: "Cuerpo completo",
  superior: "Tren superior",
  inferior: "Tren inferior",
  empuje: "Empuje (pecho / hombro / tríceps)",
  "tirón": "Tirón (espalda / bíceps)",
  piernas: "Piernas / glúteos",
  cardio_movilidad: "Cardio + movilidad",
};

function buildDay(pool, dayType, profile) {
  const vol = volumeFor(profile);
  const used = [];
  const warmup = pick(pool, "warmup", 3, used);
  used.push(...warmup.map((e) => e.id));

  let main = [];
  if (dayType === "full") {
    main = [
      ...pick(pool, "piernas", 1, used),
      ...pick(pool, "gluteos", 1, used),
      ...pick(pool, "espalda", 1, used),
      ...pick(pool, "pecho", 1, used),
      ...pick(pool, "hombros", 1, used),
      ...pick(pool, "core", 1, used),
    ];
  } else if (dayType === "superior") {
    main = [
      ...pick(pool, "espalda", 2, used),
      ...pick(pool, "pecho", 2, used),
      ...pick(pool, "hombros", 1, used),
      ...pick(pool, "brazos", 1, used),
      ...pick(pool, "core", 1, used),
    ];
  } else if (dayType === "inferior") {
    main = [
      ...pick(pool, "piernas", 2, used),
      ...pick(pool, "gluteos", 2, used),
      ...pick(pool, "core", 1, used),
    ];
  } else if (dayType === "empuje") {
    main = [
      ...pick(pool, "pecho", 2, used),
      ...pick(pool, "hombros", 2, used),
      ...pick(pool, "brazos", 1, used),
    ];
  } else if (dayType === "tirón") {
    main = [
      ...pick(pool, "espalda", 3, used),
      ...pick(pool, "brazos", 1, used),
      ...pick(pool, "core", 1, used),
    ];
  } else if (dayType === "piernas") {
    main = [
      ...pick(pool, "piernas", 2, used),
      ...pick(pool, "gluteos", 2, used),
      ...pick(pool, "core", 1, used),
    ];
  } else if (dayType === "cardio_movilidad") {
    const cardioCount = profile.goal === "resistencia_cardio" ? 2 : 1;
    main = [...pick(pool, "cardio", cardioCount, used), ...pick(pool, "core", 1, used)];
  }
  used.push(...main.map((e) => e.id));

  // Si el objetivo es pérdida de grasa o resistencia, agrega un extra de cardio corto
  if ((profile.goal === "perdida_grasa" || profile.goal === "resistencia_cardio") && dayType !== "cardio_movilidad") {
    const extraCardio = pick(pool, "cardio", 1, used);
    main.push(...extraCardio);
    used.push(...extraCardio.map((e) => e.id));
  }

  const cooldown = pick(pool, "cooldown", 3, used);

  const exList = main.map((ex) => ({
    ...ex,
    sets: ex.pattern === "cardio" ? 1 : vol.sets,
    reps: ex.pattern === "cardio" ? "según indicación" : vol.reps,
    rest: vol.rest,
  }));

  return {
    label: DAY_LABELS[dayType],
    warmup,
    main: exList,
    cooldown,
  };
}

function generateRoutine(profile) {
  const pool = filterPool(profile);
  const split = splitFor(profile.daysPerWeek);
  const days = split.map((dayType, i) => ({
    day: i + 1,
    type: dayType,
    ...buildDay(pool, dayType, profile),
  }));
  return {
    createdAt: new Date().toISOString(),
    profile,
    days,
  };
}

const GOAL_LABELS = {
  fuerza: "Ganar fuerza y masa muscular",
  perdida_grasa: "Perder grasa / definir",
  resistencia_cardio: "Resistencia cardiovascular",
  movilidad: "Movilidad y flexibilidad",
  mantenimiento: "Mantenimiento general / salud",
};

const LIMITATION_LABELS = {
  rodilla: "Rodillas",
  hombro: "Hombros",
  espalda_baja: "Espalda baja",
};
