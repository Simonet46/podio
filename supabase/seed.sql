-- ─────────────────────────────────────────────────────────────
-- PODIO — datos sembrados (8 atletas, todos verified=true para el demo)
-- Aplicar después de schema.sql. Refleja src/lib/data/seed.ts
-- ─────────────────────────────────────────────────────────────

insert into public.athletes
  (slug, full_name, first_name, sport, discipline, city, province, bio, goal_amount, raised_amount, verified, stats, fund_items)
values
  ('lucia-ferreyra', 'Lucía Ferreyra', 'Lucía', 'canotaje', 'K1 1000m', 'Tigre', 'Buenos Aires',
   'Entrena en el Delta desde los 11 años. En 2025 fue subcampeona panamericana en K1 1000m y hoy pelea cada centésima para meterse en el ciclo de clasificación.',
   18000, 7400, true,
   '[["#3","Ranking nacional"],["1000m","Distancia K1"],["6","Días de entreno/sem"]]',
   '[["Concentraciones","Viajes a competencias clasificatorias en Europa y Brasil."],["Equipo","Mantenimiento de su kayak de competición y palas de carbono."],["Entrenador","Honorarios del entrenador técnico durante el ciclo."]]'),

  ('mateo-quispe', 'Mateo Quispe', 'Mateo', 'escalada', 'Boulder & Lead', 'San Carlos de Bariloche', 'Río Negro',
   'Empezó escalando en las paredes de Bariloche y hoy compite en el circuito sudamericano de boulder.',
   15000, 11200, true,
   '[["#2","Ranking sudamericano"],["8a+","Tope en lead"],["24","Años"]]',
   '[["Viajes a torneos","Clasificatorios en muros homologados de la región."],["Pies de gato & material","Recambio de calzado técnico y seguros."],["Preparación física","Sesiones con preparador y fisioterapia."]]'),

  ('camila-roldan', 'Camila Roldán', 'Camila', 'natacion', '200m mariposa', 'Santa Fe', 'Santa Fe',
   'Récord argentino sub-21 en 200m mariposa. Nada dos turnos por día y estudia kinesiología en paralelo.',
   20000, 4300, true,
   '[["2:09","Mejor marca 200m"],["x2","Turnos diarios"],["#1","Récord sub-21"]]',
   '[["Competencias internacionales","Inscripciones y pasajes a mitines clasificatorios."],["Recuperación","Fisioterapia y tecnología de recuperación muscular."],["Entrenador","Apoyo al cuerpo técnico durante la temporada."]]'),

  ('tomas-aguirre', 'Tomás Aguirre', 'Tomás', 'atletismo', '400m con vallas', 'Córdoba', 'Córdoba',
   'Corre los 400m con vallas y viene bajando su marca temporada a temporada.',
   16000, 9800, true,
   '[["49.2","Mejor marca 400v"],["400m","Prueba"],["#2","Ranking nacional"]]',
   '[["Gira europea","Serie de competencias para sumar puntos de ranking."],["Zapatillas de pista","Recambio de spikes homologadas."],["Nutrición","Plan nutricional y suplementación deportiva."]]'),

  ('valentina-moretti', 'Valentina Moretti', 'Valentina', 'vela', 'Fórmula Kite', 'San Fernando', 'Buenos Aires',
   'Compite en Fórmula Kite, una de las clases más rápidas del agua.',
   22000, 13500, true,
   '[["#1","Ranking nacional"],["35kn","Velocidad punta"],["3","Alas de competición"]]',
   '[["Equipo de kite","Alas, tabla de hidrofoil y recambios."],["Campos de regata","Viajes a sedes con condiciones de clasificación."],["Coach técnico","Análisis de navegación y estrategia de regata."]]'),

  ('joaquin-benitez', 'Joaquín Benítez', 'Joaquín', 'judo', '-73 kg', 'Posadas', 'Misiones',
   'Judoca de la categoría -73 kg, medallista en el Panamericano junior.',
   17000, 6100, true,
   '[["-73kg","Categoría"],["#3","Ranking nacional"],["12","Torneos/año objetivo"]]',
   '[["Circuito mundial","Inscripción y viajes a Grand Slam y Continental Open."],["Judogi y material","Kimonos homologados y vendajes."],["Sparring","Concentraciones con compañeros de entrenamiento de nivel."]]'),

  ('renata-silva', 'Renata Silva', 'Renata', 'remo', 'Single scull (1x)', 'Rosario', 'Santa Fe',
   'Rema en single scull sobre el Paraná. Entrena al amanecer antes de la facultad.',
   21000, 8900, true,
   '[["1x","Modalidad"],["7:35","Mejor 2000m"],["5am","Inicio de entreno"]]',
   '[["Bote de competición","Aporte a un single scull de gama internacional."],["Regatas clasificatorias","Viajes a sedes de clasificación continental."],["Remos & accesorios","Palas de carbono y mantenimiento."]]'),

  ('thiago-navarro', 'Thiago Navarro', 'Thiago', 'bmx', 'BMX Racing', 'La Plata', 'Buenos Aires',
   'Corre BMX Racing desde los 8 años. Es un deporte explosivo donde cada décima cuenta.',
   14000, 12600, true,
   '[["#2","Ranking nacional"],["8s","Tiempo de manga"],["20\"","Bici de competición"]]',
   '[["Copas del Mundo","Viajes a fechas puntuables en Europa y EE.UU."],["Bicicleta","Cuadro y componentes de competición."],["Protección","Casco integral, guantes y equipo de seguridad."]]')
on conflict (slug) do nothing;
