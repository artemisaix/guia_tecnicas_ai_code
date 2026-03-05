import { useState, useReducer, useMemo, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION BANK  (50 questions — Técnicas de Inteligencia Artificial)
// Topics: Búsqueda, CSP, Lógica, Aprendizaje, Redes Neuronales,
//         Algoritmos Genéticos, Agentes, Incertidumbre
// ─────────────────────────────────────────────────────────────────────────────
const TOPICS = [
  { id: 'busqueda',      label: 'Búsqueda en Espacios de Estado' },
  { id: 'csp',           label: 'Satisfacción de Restricciones (CSP)' },
  { id: 'logica',        label: 'Lógica y Representación del Conocimiento' },
  { id: 'aprendizaje',   label: 'Aprendizaje Automático (ML)' },
  { id: 'redes',         label: 'Redes Neuronales y Deep Learning' },
  { id: 'geneticos',     label: 'Algoritmos Genéticos y Evolutivos' },
  { id: 'agentes',       label: 'Agentes Inteligentes' },
  { id: 'incertidumbre', label: 'Incertidumbre y Probabilidad' },
];

const ALL_QUESTIONS = [
  // ──────────── BÚSQUEDA (7) ────────────
  {
    id: 1, topic: 'busqueda', difficulty: 'basico',
    question: '¿Cuál de las siguientes afirmaciones describe correctamente la búsqueda en amplitud (BFS)?',
    options: [
      'Expande primero el nodo con menor costo acumulado',
      'Expande todos los nodos a profundidad d antes de pasar a profundidad d+1',
      'Siempre encuentra la solución óptima independientemente del costo de los arcos',
      'Requiere una función heurística admisible para garantizar completitud',
    ],
    answer: 1,
    explanation: 'BFS explora el espacio nivel por nivel (FIFO). Es completo y encuentra el camino con menos arcos, pero no necesariamente el de menor costo cuando los arcos tienen costos distintos.',
  },
  {
    id: 2, topic: 'busqueda', difficulty: 'basico',
    question: '¿Qué propiedad garantiza que el algoritmo A* encuentre la solución óptima?',
    options: [
      'Que la heurística sea consistente (monótona)',
      'Que el factor de ramificación sea mayor que 1',
      'Que el grafo de búsqueda sea un árbol',
      'Que la heurística sea maximalista (sobreestimadora)',
    ],
    answer: 0,
    explanation: 'Una heurística consistente implica admisibilidad. Con heurística consistente, A* no reexpande nodos, garantizando optimalidad y completitud en grafos.',
  },
  {
    id: 3, topic: 'busqueda', difficulty: 'intermedio',
    question: 'En la búsqueda en profundidad con límite (DLS), si el límite ℓ es menor que la profundidad de la solución más superficial, ¿qué ocurre?',
    options: [
      'El algoritmo devuelve la solución más cercana al límite',
      'El algoritmo falla (no encuentra solución)',
      'El algoritmo automáticamente incrementa el límite',
      'El algoritmo convierte su búsqueda en BFS',
    ],
    answer: 1,
    explanation: 'DLS no es completo si ℓ < profundidad de la solución; simplemente no encuentra la meta al no poder alcanzar la profundidad requerida.',
  },
  {
    id: 4, topic: 'busqueda', difficulty: 'intermedio',
    question: '¿Cuál es la principal ventaja de IDA* frente a A*?',
    options: [
      'IDA* tiene menor complejidad temporal en el peor caso',
      'IDA* usa memoria O(bd) en lugar de O(b^d)',
      'IDA* no requiere función heurística',
      'IDA* garantiza encontrar la solución en tiempo polinomial',
    ],
    answer: 1,
    explanation: 'IDA* (Iterative Deepening A*) realiza búsqueda por profundidad iterativa usando el costo f como umbral, consumiendo memoria lineal O(bd) a diferencia de A* que almacena todos los nodos en la frontera.',
  },
  {
    id: 5, topic: 'busqueda', difficulty: 'avanzado',
    question: 'Una heurística h es admisible si y solo si para todo nodo n:',
    options: [
      'h(n) ≥ h*(n), donde h*(n) es el costo real al objetivo',
      'h(n) ≤ h*(n), donde h*(n) es el costo real al objetivo',
      'h(n) = 0 para todos los nodos hoja',
      'h(n) es monótonamente creciente a lo largo de cualquier camino',
    ],
    answer: 1,
    explanation: 'Una heurística admisible nunca sobreestima el costo real. Esta condición garantiza que A* no descarte el camino óptimo antes de explorarlo.',
  },
  {
    id: 6, topic: 'busqueda', difficulty: 'intermedio',
    question: '¿Cuál es la complejidad espacial de BFS en función del factor de ramificación b y la profundidad d de la solución?',
    options: [
      'O(d)',
      'O(b·d)',
      'O(b^d)',
      'O(d^b)',
    ],
    answer: 2,
    explanation: 'BFS almacena en memoria todos los nodos de la frontera y los explorados. En el peor caso esto es O(b^d), lo que lo hace inviable para espacios grandes.',
  },
  {
    id: 7, topic: 'busqueda', difficulty: 'avanzado',
    question: 'El algoritmo de búsqueda bidireccional reduce la complejidad temporal de O(b^d) a:',
    options: [
      'O(b^(d/3))',
      'O(b^(d/2))',
      'O(b·d)',
      'O(d log b)',
    ],
    answer: 1,
    explanation: 'La búsqueda bidireccional lanza dos búsquedas simultáneas desde el estado inicial y la meta. Cada una profundiza d/2, reduciendo la complejidad total a O(b^(d/2)).',
  },

  // ──────────── CSP (6) ────────────
  {
    id: 8, topic: 'csp', difficulty: 'basico',
    question: '¿Qué es un Problema de Satisfacción de Restricciones (CSP)?',
    options: [
      'Un problema de búsqueda que minimiza una función de costo continua',
      'Un problema definido por variables, dominios y restricciones que deben satisfacerse simultáneamente',
      'Un método de aprendizaje supervisado para clasificación binaria',
      'Un algoritmo de búsqueda heurística que utiliza información del problema',
    ],
    answer: 1,
    explanation: 'Un CSP se define mediante un conjunto de variables X, dominios D (valores posibles para cada variable) y restricciones C que especifican las combinaciones de valores permitidas.',
  },
  {
    id: 9, topic: 'csp', difficulty: 'intermedio',
    question: '¿Qué garantiza la consistencia de arco (AC-3) en un CSP?',
    options: [
      'Que cada valor del dominio de Xi tiene al menos un valor compatible en el dominio de Xj para toda restricción entre Xi y Xj',
      'Que cada variable tiene exactamente un valor en su dominio',
      'Que las restricciones forman un árbol sin ciclos',
      'Que el CSP tiene al menos una solución factible',
    ],
    answer: 0,
    explanation: 'La consistencia de arco elimina valores de los dominios que no tienen soporte en los dominios de las variables vecinas, reduciendo los dominios antes de la búsqueda.',
  },
  {
    id: 10, topic: 'csp', difficulty: 'intermedio',
    question: '¿Cuál heurística para CSP selecciona la variable con el menor número de valores restantes en su dominio?',
    options: [
      'Grado (degree heuristic)',
      'MRV (Minimum Remaining Values)',
      'Valor menos restrictivo (LCV)',
      'Propagación de restricciones',
    ],
    answer: 1,
    explanation: 'MRV (también llamada "fail-first") elige la variable más difícil de asignar, detectando pronto los fracasos y podando ramas improductivas del árbol de búsqueda.',
  },
  {
    id: 11, topic: 'csp', difficulty: 'avanzado',
    question: 'En un CSP con estructura de árbol (sin ciclos), la complejidad para encontrar una solución es:',
    options: [
      'O(n²·d²)',
      'O(n·d²)',
      'O(n·2^n)',
      'O(d^n)',
    ],
    answer: 1,
    explanation: 'Si el grafo de restricciones es un árbol, se puede resolver con consistencia de arco directa en O(n·d²), procesando las variables de hojas a raíz sin backtracking.',
  },
  {
    id: 12, topic: 'csp', difficulty: 'basico',
    question: '¿Qué técnica permite detectar fallos anticipadamente durante el backtracking en CSPs?',
    options: [
      'Forward checking',
      'Hill climbing',
      'Simulated annealing',
      'Búsqueda en amplitud',
    ],
    answer: 0,
    explanation: 'Forward checking, al asignar un valor a una variable, elimina de los dominios de las variables no asignadas los valores inconsistentes, detectando dominios vacíos antes de continuar la búsqueda.',
  },
  {
    id: 13, topic: 'csp', difficulty: 'avanzado',
    question: 'La heurística de "valor menos restrictivo" (LCV) en CSPs selecciona:',
    options: [
      'La variable con más restricciones con otras variables no asignadas',
      'El valor que elimina el menor número de valores de los dominios de las variables vecinas',
      'El valor que satisface el mayor número de restricciones globales',
      'La variable con el mayor dominio restante',
    ],
    answer: 1,
    explanation: 'LCV maximiza las opciones futuras al elegir el valor menos restrictivo para las variables vecinas. Se combina bien con MRV para asignar variables.',
  },

  // ──────────── LÓGICA (6) ────────────
  {
    id: 14, topic: 'logica', difficulty: 'basico',
    question: '¿Cuál es la forma normal conjuntiva (FNC) de la fórmula (A → B)?',
    options: [
      'A ∧ ¬B',
      '¬A ∨ B',
      'A ∨ ¬B',
      '¬A ∧ B',
    ],
    answer: 1,
    explanation: 'A → B es equivalente a ¬A ∨ B por definición de la implicación material. Esta es su representación en cláusula (FNC).',
  },
  {
    id: 15, topic: 'logica', difficulty: 'intermedio',
    question: '¿Qué regla de inferencia aplica Modus Ponens?',
    options: [
      'De (P → Q) y Q, se concluye P',
      'De (P → Q) y P, se concluye Q',
      'De (P → Q) y ¬Q, se concluye ¬P',
      'De P y Q, se concluye P ∧ Q',
    ],
    answer: 1,
    explanation: 'Modus Ponens: si P implica Q y se sabe que P es verdadero, entonces Q es verdadero. Es la regla de inferencia más básica.',
  },
  {
    id: 16, topic: 'logica', difficulty: 'intermedio',
    question: 'En lógica de predicados, la fórmula ∀x P(x) → ∃x P(x) es:',
    options: [
      'Siempre falsa (contradicción)',
      'Siempre verdadera (tautología)',
      'Verdadera solo en dominios finitos',
      'Equivalente a ∃x ¬P(x)',
    ],
    answer: 1,
    explanation: 'Si P(x) es válido para todo x del dominio, en particular existe al menos un x para el que P(x) es válido (asumiendo dominio no vacío), haciendo la implicación una tautología.',
  },
  {
    id: 17, topic: 'logica', difficulty: 'avanzado',
    question: '¿Qué distingue a la lógica de primer orden (FOL) de la lógica proposicional?',
    options: [
      'FOL admite incertidumbre probabilística',
      'FOL introduce cuantificadores (∀, ∃) y predicados sobre objetos del dominio',
      'FOL solo puede representar hechos ciertos, no reglas',
      'FOL es semidecidible pero no completa',
    ],
    answer: 1,
    explanation: 'La lógica de primer orden añade cuantificadores universales (∀) y existenciales (∃), variables, predicados y funciones, permitiendo representar conocimiento relacional sobre objetos del mundo.',
  },
  {
    id: 18, topic: 'logica', difficulty: 'avanzado',
    question: '¿En qué consiste el procedimiento de resolución en lógica proposicional?',
    options: [
      'Aplicar sucesivamente Modus Tollens a todas las cláusulas',
      'Dado dos cláusulas con literales complementarios, producir su resolvente eliminando esos literales',
      'Convertir todas las fórmulas a FND y evaluar cada minterms',
      'Asignar valores de verdad por backtracking hasta satisfacer todas las cláusulas',
    ],
    answer: 1,
    explanation: 'La resolución toma dos cláusulas con literales complementarios (L y ¬L) y genera el resolvente, que es consecuencia lógica de ambas cláusulas originales.',
  },
  {
    id: 19, topic: 'logica', difficulty: 'basico',
    question: 'En un sistema de encadenamiento hacia adelante (forward chaining), el razonamiento parte de:',
    options: [
      'La consulta (goal) hacia los hechos conocidos',
      'Los hechos conocidos hacia la conclusión',
      'Las hipótesis más probables hacia las más improbables',
      'Las reglas con mayor número de precondiciones',
    ],
    answer: 1,
    explanation: 'El encadenamiento hacia adelante (data-driven) dispara reglas a partir de los hechos conocidos y genera nuevos hechos hasta alcanzar la meta o agotar las reglas aplicables.',
  },

  // ──────────── APRENDIZAJE AUTOMÁTICO (8) ────────────
  {
    id: 20, topic: 'aprendizaje', difficulty: 'basico',
    question: '¿Cuál es la diferencia entre aprendizaje supervisado y no supervisado?',
    options: [
      'El supervisado usa redes neuronales; el no supervisado usa árboles de decisión',
      'El supervisado entrena con pares (entrada, etiqueta); el no supervisado solo con entradas sin etiquetas',
      'El supervisado requiere más datos que el no supervisado',
      'El no supervisado solo sirve para problemas de regresión',
    ],
    answer: 1,
    explanation: 'En aprendizaje supervisado el modelo aprende de ejemplos etiquetados. En no supervisado descubre estructuras (clústeres, representaciones) sin etiquetas de salida.',
  },
  {
    id: 21, topic: 'aprendizaje', difficulty: 'intermedio',
    question: '¿Qué problema ocurre cuando un modelo tiene sobreajuste (overfitting)?',
    options: [
      'El modelo tiene demasiado error en el conjunto de entrenamiento',
      'El modelo memoriza los datos de entrenamiento y generaliza mal a nuevos datos',
      'El modelo no converge durante el entrenamiento',
      'El modelo clasifica correctamente todos los puntos de prueba pero falla en entrenamiento',
    ],
    answer: 1,
    explanation: 'El sobreajuste ocurre cuando el modelo captura el ruido de los datos de entrenamiento. Tiene error bajo en entrenamiento pero error alto en datos nuevos (alta varianza).',
  },
  {
    id: 22, topic: 'aprendizaje', difficulty: 'intermedio',
    question: '¿Cuál es el objetivo de la validación cruzada (cross-validation) k-fold?',
    options: [
      'Aumentar artificialmente el tamaño del conjunto de entrenamiento',
      'Estimar el error de generalización del modelo usando k particiones del conjunto de datos',
      'Seleccionar automáticamente el número óptimo de características',
      'Reducir la varianza del modelo mediante promediado de predicciones',
    ],
    answer: 1,
    explanation: 'En k-fold CV se divide el dataset en k partes, se entrena k veces usando k-1 partes y se valida con la restante. El error estimado es el promedio de los k errores de validación.',
  },
  {
    id: 23, topic: 'aprendizaje', difficulty: 'basico',
    question: '¿Qué mide la entropía en un árbol de decisión como criterio de división?',
    options: [
      'La profundidad máxima del árbol resultante',
      'La impureza del nodo; alta entropía implica alta mezcla de clases',
      'La velocidad de convergencia del algoritmo de entrenamiento',
      'El número de hojas necesarias para clasificar todos los ejemplos',
    ],
    answer: 1,
    explanation: 'La entropía mide la impureza de un nodo. Un nodo con distribución uniforme de clases tiene entropía máxima; un nodo con una sola clase tiene entropía 0. Se usa para calcular ganancia de información.',
  },
  {
    id: 24, topic: 'aprendizaje', difficulty: 'avanzado',
    question: 'El teorema de No Free Lunch en aprendizaje automático establece que:',
    options: [
      'Todo algoritmo de aprendizaje necesita al menos O(n log n) ejemplos',
      'Ningún algoritmo de aprendizaje es superior a todos los demás en todos los problemas posibles',
      'Los algoritmos lineales siempre tienen mejor complejidad que los no lineales',
      'La regularización siempre reduce el sesgo del modelo',
    ],
    answer: 1,
    explanation: 'El NFL establece que promediado sobre todos los posibles problemas, cualquier algoritmo de aprendizaje tiene el mismo rendimiento esperado. Justifica adaptar el algoritmo al dominio específico.',
  },
  {
    id: 25, topic: 'aprendizaje', difficulty: 'intermedio',
    question: '¿Qué técnica de regularización añade a la función de pérdida la suma de los valores absolutos de los pesos?',
    options: [
      'Regularización L2 (Ridge)',
      'Regularización L1 (Lasso)',
      'Dropout',
      'Batch Normalization',
    ],
    answer: 1,
    explanation: 'La regularización L1 (Lasso) añade λ·Σ|wᵢ| a la pérdida. Promueve soluciones dispersas al llevar coeficientes no importantes a exactamente cero.',
  },
  {
    id: 26, topic: 'aprendizaje', difficulty: 'avanzado',
    question: 'En una SVM de margen blando (soft-margin), el hiperparámetro C controla:',
    options: [
      'El número de vectores de soporte que se permiten',
      'El equilibrio entre maximizar el margen y penalizar las violaciones de margen',
      'El kernel utilizado para la transformación del espacio de características',
      'La tasa de aprendizaje del optimizador de gradiente',
    ],
    answer: 1,
    explanation: 'Un C grande penaliza fuertemente los errores de clasificación (menor margen, menos errores de entrenamiento). Un C pequeño permite más errores a cambio de un margen más amplio.',
  },
  {
    id: 27, topic: 'aprendizaje', difficulty: 'basico',
    question: '¿Cuál es la función de activación más utilizada en capas ocultas de redes neuronales modernas?',
    options: [
      'Sigmoide',
      'Tanh',
      'ReLU (Rectified Linear Unit)',
      'Función escalón de Heaviside',
    ],
    answer: 2,
    explanation: 'ReLU(x) = max(0, x) es la activación más popular en redes profundas por su simplicidad computacional y porque mitiga el problema de gradientes que desaparecen (vanishing gradients).',
  },

  // ──────────── REDES NEURONALES (5) ────────────
  {
    id: 28, topic: 'redes', difficulty: 'basico',
    question: '¿Qué calcula la retropropagación (backpropagation) en una red neuronal?',
    options: [
      'Los valores de activación de cada neurona en la capa de salida',
      'El gradiente de la función de pérdida respecto a cada peso de la red',
      'El número óptimo de capas ocultas para un problema dado',
      'La distribución de probabilidad de las etiquetas de clase',
    ],
    answer: 1,
    explanation: 'Backpropagation aplica la regla de la cadena para propagar el error desde la capa de salida hacia las anteriores, calculando el gradiente ∂L/∂wᵢⱼ para actualizar cada peso.',
  },
  {
    id: 29, topic: 'redes', difficulty: 'intermedio',
    question: '¿Cuál es la diferencia fundamental entre una CNN y una red totalmente conectada (FC)?',
    options: [
      'Las CNN solo pueden procesar texto; las FC solo imágenes',
      'Las CNN usan filtros con pesos compartidos que explotan la localidad espacial de los datos',
      'Las CNN no requieren función de activación entre capas',
      'Las FC son superiores en todas las tareas de visión por computadora',
    ],
    answer: 1,
    explanation: 'Las Redes Neuronales Convolucionales usan filtros locales con pesos compartidos entre posiciones espaciales, reduciendo drásticamente los parámetros y explotando la invarianza de traslación en imágenes.',
  },
  {
    id: 30, topic: 'redes', difficulty: 'avanzado',
    question: '¿Qué problema resuelven las conexiones residuales (skip connections) en redes como ResNet?',
    options: [
      'El sobreajuste en conjuntos de datos pequeños',
      'El problema de gradientes que desaparecen/explotan en redes muy profundas',
      'La necesidad de normalizar las entradas antes de entrenar',
      'El desbalance de clases en problemas de clasificación',
    ],
    answer: 1,
    explanation: 'Las skip connections permiten que el gradiente fluya directamente desde capas posteriores a anteriores sin atenuarse, permitiendo entrenar redes de cientos de capas (ResNet-152, etc.).',
  },
  {
    id: 31, topic: 'redes', difficulty: 'intermedio',
    question: '¿Cuál es el propósito principal de la capa de pooling en una CNN?',
    options: [
      'Introducir no linealidad en la representación',
      'Reducir las dimensiones espaciales y proporcionar invarianza a pequeñas traslaciones',
      'Normalizar los valores de activación para acelerar el entrenamiento',
      'Conectar la parte convolucional con la parte totalmente conectada',
    ],
    answer: 1,
    explanation: 'El pooling (max/avg) reduce el tamaño espacial del mapa de características, disminuyendo el cómputo y proporcionando cierta invarianza a traslaciones y distorsiones menores.',
  },
  {
    id: 32, topic: 'redes', difficulty: 'avanzado',
    question: 'En una red LSTM, ¿cuál es la función de la "puerta de olvido" (forget gate)?',
    options: [
      'Decidir qué nueva información se añade al estado de la celda',
      'Decidir qué parte del estado de la celda anterior se descarta',
      'Controlar qué parte del estado de la celda se expone como salida',
      'Regular la tasa de aprendizaje durante el entrenamiento',
    ],
    answer: 1,
    explanation: 'La forget gate aplica σ(Wf·[h_{t-1}, x_t] + b_f) y multiplica el resultado por el estado de celda anterior, determinando qué información "olvidar" de la memoria a largo plazo.',
  },

  // ──────────── ALGORITMOS GENÉTICOS (5) ────────────
  {
    id: 33, topic: 'geneticos', difficulty: 'basico',
    question: '¿Cuáles son los operadores básicos de un Algoritmo Genético canónico?',
    options: [
      'Selección, gradiente y regularización',
      'Selección, cruzamiento y mutación',
      'Inicialización, convergencia y terminación',
      'Codificación, decodificación y evaluación',
    ],
    answer: 1,
    explanation: 'Los tres operadores fundamentales son: (1) selección —elige individuos según su aptitud—, (2) cruzamiento —combina cromosomas de dos padres— y (3) mutación —introduce cambios aleatorios menores.',
  },
  {
    id: 34, topic: 'geneticos', difficulty: 'intermedio',
    question: '¿Qué es la función de aptitud (fitness) en un algoritmo genético?',
    options: [
      'La probabilidad de que un individuo sea seleccionado para mutación',
      'Una medida cuantitativa de qué tan buena es una solución candidata respecto al objetivo',
      'El número de cromosomas distintos en la población inicial',
      'La tasa de mutación adaptativa del algoritmo',
    ],
    answer: 1,
    explanation: 'La función de aptitud evalúa cada individuo y asigna un valor que guía la selección. Individuos con mayor aptitud tienen mayor probabilidad de reproducirse.',
  },
  {
    id: 35, topic: 'geneticos', difficulty: 'intermedio',
    question: '¿Qué problema puede ocurrir si la tasa de mutación en un AG es demasiado alta?',
    options: [
      'Convergencia prematura a un óptimo local',
      'El algoritmo se comporta como una búsqueda aleatoria, perdiendo la información útil acumulada',
      'La población converge antes de explorar suficientemente el espacio',
      'Los operadores de cruzamiento dejan de ser efectivos',
    ],
    answer: 1,
    explanation: 'Una mutación muy alta destruye los building blocks útiles encontrados, haciendo que el AG explore el espacio de forma casi aleatoria sin explotar las buenas soluciones.',
  },
  {
    id: 36, topic: 'geneticos', difficulty: 'avanzado',
    question: 'El "Teorema de los Esquemas" de Holland establece que los esquemas con:',
    options: [
      'Alta aptitud, longitud definida corta y orden bajo crecen exponencialmente en generaciones siguientes',
      'Baja aptitud y alta definición tienen mayor probabilidad de supervivencia',
      'Longitud definida larga y orden alto son los más robustos a la mutación',
      'Alta entropía de bits son los que más contribuyen a la convergencia',
    ],
    answer: 0,
    explanation: 'El Teorema de Esquemas muestra que esquemas cortos, de bajo orden y con aptitud superior al promedio crecen exponencialmente en la población, explicando el poder de los AGs.',
  },
  {
    id: 37, topic: 'geneticos', difficulty: 'basico',
    question: '¿En qué se diferencia la Programación Genética (PG) de los Algoritmos Genéticos (AG)?',
    options: [
      'En que la PG usa codificación binaria y el AG usa codificación real',
      'En que la PG evoluciona programas o expresiones (árboles), no vectores de parámetros fijos',
      'En que la PG requiere una función de aptitud y el AG no',
      'En que la PG solo sirve para optimización continua',
    ],
    answer: 1,
    explanation: 'En Programación Genética los individuos son programas representados como árboles sintácticos. Los operadores intercambian subárboles en lugar de segmentos de cromosoma.',
  },

  // ──────────── AGENTES INTELIGENTES (6) ────────────
  {
    id: 38, topic: 'agentes', difficulty: 'basico',
    question: '¿Cuáles son los cuatro componentes del marco PEAS para describir un agente?',
    options: [
      'Percepción, actuación, aprendizaje, comunicación',
      'Medida de rendimiento, entorno, actuadores, sensores',
      'Búsqueda, planificación, ejecución, monitoreo',
      'Conocimiento, razonamiento, aprendizaje, comunicación',
    ],
    answer: 1,
    explanation: 'PEAS: Performance measure (medida de rendimiento), Environment (entorno), Actuators (actuadores) y Sensors (sensores). Caracteriza completamente la tarea de un agente.',
  },
  {
    id: 39, topic: 'agentes', difficulty: 'intermedio',
    question: '¿Qué diferencia a un agente reactivo simple de un agente basado en modelo?',
    options: [
      'El agente reactivo usa planificación; el basado en modelo usa reglas',
      'El agente basado en modelo mantiene un estado interno que representa el mundo no directamente observable',
      'El agente reactivo puede aprender; el basado en modelo no',
      'El agente basado en modelo solo funciona en entornos totalmente observables',
    ],
    answer: 1,
    explanation: 'Un agente basado en modelo mantiene un estado interno que refleja partes del mundo no visibles desde la percepción actual, permitiéndole actuar coherentemente en entornos parcialmente observables.',
  },
  {
    id: 40, topic: 'agentes', difficulty: 'intermedio',
    question: 'En la teoría de agentes, un entorno es "episódico" si:',
    options: [
      'El agente puede observar el estado completo del entorno en todo momento',
      'La acción actual no afecta el siguiente episodio; cada percepción es atómica e independiente',
      'El entorno cambia con el tiempo independientemente del agente',
      'El agente recibe una recompensa acumulada al final de una secuencia de acciones',
    ],
    answer: 1,
    explanation: 'Un entorno episódico divide la experiencia en episodios independientes donde la acción tomada no afecta episodios futuros. Ejemplo: clasificar imágenes una a una.',
  },
  {
    id: 41, topic: 'agentes', difficulty: 'avanzado',
    question: '¿Qué es un agente de aprendizaje por refuerzo (Reinforcement Learning)?',
    options: [
      'Un agente que aprende de un conjunto de ejemplos etiquetados con la acción correcta',
      'Un agente que aprende mediante interacción con el entorno, maximizando una señal de recompensa acumulada',
      'Un agente que usa lógica de primer orden para inferir la acción óptima',
      'Un agente que memoriza todas las situaciones vistas y las acciones tomadas en ellas',
    ],
    answer: 1,
    explanation: 'En RL el agente recibe recompensas del entorno tras ejecutar acciones. El objetivo es aprender una política π(s) que maximice la recompensa acumulada esperada (retorno) a largo plazo.',
  },
  {
    id: 42, topic: 'agentes', difficulty: 'basico',
    question: '¿Cuál de las siguientes propiedades describe un entorno "estocástico"?',
    options: [
      'El estado siguiente está completamente determinado por el estado actual y la acción del agente',
      'El estado siguiente no está completamente determinado por el estado actual y la acción',
      'El agente puede observar solo parte del estado del entorno',
      'El entorno no cambia entre percepción y acción del agente',
    ],
    answer: 1,
    explanation: 'Un entorno estocástico introduce aleatoriedad: el mismo estado y acción pueden llevar a estados distintos. Opuesto al determinista, donde el resultado de las acciones es predecible.',
  },
  {
    id: 43, topic: 'agentes', difficulty: 'avanzado',
    question: '¿Qué tipo de agente es capaz de mejorar su rendimiento a partir de la experiencia?',
    options: [
      'Agente reactivo simple',
      'Agente basado en metas',
      'Agente de aprendizaje',
      'Agente basado en utilidad',
    ],
    answer: 2,
    explanation: 'Un agente de aprendizaje tiene un componente aprendiz que modifica al componente de rendimiento basándose en retroalimentación. Puede mejorar a lo largo del tiempo mediante experiencia.',
  },

  // ──────────── INCERTIDUMBRE (7) ────────────
  {
    id: 44, topic: 'incertidumbre', difficulty: 'basico',
    question: '¿Cuál es el enunciado del Teorema de Bayes?',
    options: [
      'P(A|B) = P(A) · P(B)',
      'P(A|B) = P(B|A) · P(A) / P(B)',
      'P(A|B) = P(A) + P(B) − P(A ∩ B)',
      'P(A|B) = 1 − P(¬A|B)',
    ],
    answer: 1,
    explanation: 'El Teorema de Bayes: P(A|B) = P(B|A)·P(A) / P(B). Es la base del razonamiento probabilístico bajo incertidumbre en IA, permitiendo actualizar creencias con nueva evidencia.',
  },
  {
    id: 45, topic: 'incertidumbre', difficulty: 'intermedio',
    question: '¿Qué supone el "naive" en el clasificador Naive Bayes?',
    options: [
      'Que todas las clases son igualmente probables a priori',
      'Que las características son condicionalmente independientes dado el valor de la clase',
      'Que los datos siguen una distribución normal multivariada',
      'Que la función de decisión es lineal en el espacio de características',
    ],
    answer: 1,
    explanation: 'El supuesto "naive" afirma que P(x₁,...,xₙ|C) = ∏P(xᵢ|C). Las features son independientes dada la clase, simplificando el cálculo aunque rara vez se cumple en la práctica.',
  },
  {
    id: 46, topic: 'incertidumbre', difficulty: 'intermedio',
    question: '¿Qué es una Red Bayesiana?',
    options: [
      'Una red neuronal que usa función softmax para clasificación probabilística',
      'Un grafo acíclico dirigido que representa dependencias condicionales entre variables aleatorias',
      'Un método de muestreo Monte Carlo para estimar distribuciones complejas',
      'Un árbol de decisión que minimiza la entropía en cada nodo',
    ],
    answer: 1,
    explanation: 'Una Red Bayesiana es un DAG donde los nodos son variables aleatorias y los arcos representan dependencias directas. Cada nodo almacena P(Xᵢ | Padres(Xᵢ)).',
  },
  {
    id: 47, topic: 'incertidumbre', difficulty: 'avanzado',
    question: 'En una Red Bayesiana, la independencia condicional de X e Y dado Z implica que:',
    options: [
      'P(X,Y|Z) = P(X|Z) + P(Y|Z)',
      'P(X,Y|Z) = P(X|Z) · P(Y|Z)',
      'P(X|Z) = P(Y|Z) para todo valor de Z',
      'P(Z|X,Y) = P(Z)',
    ],
    answer: 1,
    explanation: 'Independencia condicional X ⊥ Y | Z significa P(X,Y|Z) = P(X|Z)·P(Y|Z). Al conocer Z, X e Y no aportan información mutua. Es la base de la factorización en redes Bayesianas.',
  },
  {
    id: 48, topic: 'incertidumbre', difficulty: 'avanzado',
    question: '¿Cuál es la diferencia entre inferencia exacta e inferencia aproximada en Redes Bayesianas?',
    options: [
      'La inferencia exacta usa muestreo; la aproximada usa eliminación de variables',
      'La inferencia exacta computa probabilidades exactas; la aproximada usa métodos estocásticos como MCMC',
      'La inferencia exacta solo funciona con distribuciones discretas; la aproximada con continuas',
      'La inferencia aproximada es siempre más precisa que la exacta en redes grandes',
    ],
    answer: 1,
    explanation: 'La inferencia exacta (Variable Elimination, Junction Tree) es intratable en redes grandes. Los métodos aproximados (MCMC, Gibbs Sampling) ofrecen estimaciones con costo computacional manejable.',
  },
  {
    id: 49, topic: 'incertidumbre', difficulty: 'intermedio',
    question: 'La lógica difusa (fuzzy logic) se distingue de la lógica clásica en que:',
    options: [
      'Permite valores de verdad continuos en el intervalo [0, 1]',
      'No admite operadores lógicos de negación',
      'Solo puede representar incertidumbre de tipo epistémico',
      'Requiere probabilidades como entrada en lugar de valores de membresía',
    ],
    answer: 0,
    explanation: 'La lógica difusa extiende la lógica booleana {0,1} a valores de membresía en [0,1], permitiendo modelar conceptos vagos como "temperatura alta" con grados de pertenencia graduales.',
  },
  {
    id: 50, topic: 'incertidumbre', difficulty: 'avanzado',
    question: 'En un Proceso de Decisión de Markov (MDP), la propiedad de Markov establece que:',
    options: [
      'La recompensa futura solo depende de la acción actual y no del estado',
      'El estado siguiente solo depende del estado actual y la acción tomada, no del historial anterior',
      'La política óptima es siempre determinista para MDPs finitos',
      'La función de valor es lineal en el espacio de estados',
    ],
    answer: 1,
    explanation: 'La propiedad de Markov garantiza P(s_{t+1}|s_t,a_t) = P(s_{t+1}|s_t,a_t,s_{t-1},...,s_0). El futuro es independiente del pasado dado el presente, haciendo los MDPs tractables.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(pct) {
  if (pct >= 90) return { letter: 'A', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-300', label: 'Excelente' };
  if (pct >= 80) return { letter: 'B', color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-300',    label: 'Bien' };
  if (pct >= 70) return { letter: 'C', color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-300',   label: 'Regular' };
  if (pct >= 60) return { letter: 'D', color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-300',  label: 'Suficiente' };
  return           { letter: 'F', color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-300',     label: 'Insuficiente' };
}

function topicLabel(id) {
  return TOPICS.find(t => t.id === id)?.label ?? id;
}

// ─────────────────────────────────────────────────────────────────────────────
// HISTORY REDUCER
// ─────────────────────────────────────────────────────────────────────────────
const initialHistory = { sessions: [] };

function historyReducer(state, action) {
  switch (action.type) {
    case 'SAVE_SESSION':
      return { sessions: [...state.sessions, action.payload] };
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMER HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useTimer(active) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  return elapsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function HomeScreen({ history, onStart }) {
  const [difficulty, setDifficulty] = useState('mixto');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTopics, setSelectedTopics] = useState(TOPICS.map(t => t.id));

  const toggleTopic = id =>
    setSelectedTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );

  const allSelected = selectedTopics.length === TOPICS.length;
  const toggleAll = () => setSelectedTopics(allSelected ? [] : TOPICS.map(t => t.id));

  const handleStart = () => {
    if (selectedTopics.length === 0) return alert('Selecciona al menos un tema.');
    onStart({ difficulty, questionCount, selectedTopics });
  };

  const sessions = history.sessions;
  const chartData = sessions.slice(-10).map((s, i) => ({
    name: `#${sessions.length > 10 ? sessions.length - 10 + i + 1 : i + 1}`,
    score: s.score,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            🧠 Plataforma de Preparación para Examen
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
            ExamAI
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Técnicas de Inteligencia Artificial</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Config Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <h2 className="font-bold text-slate-800 text-lg">Configurar examen</h2>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Dificultad</label>
              <div className="grid grid-cols-2 gap-2">
                {['basico','intermedio','avanzado','mixto'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${
                      difficulty === d
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {{ basico: '🌱 Básico', intermedio: '🔥 Intermedio', avanzado: '⚡ Avanzado', mixto: '🎲 Mixto' }[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Número de preguntas</label>
              <div className="flex gap-2 flex-wrap">
                {[5,10,15,20,30].map(n => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`w-12 h-10 rounded-xl text-sm font-bold border transition-all ${
                      questionCount === n
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-600">Temas</label>
                <button onClick={toggleAll} className="text-xs text-indigo-600 hover:underline font-medium">
                  {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {TOPICS.map(t => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(t.id)}
                      onChange={() => toggleTopic(t.id)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">
                      {t.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={selectedTopics.length === 0}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
            >
              Comenzar Examen →
            </button>
          </div>

          {/* History panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">
            <h2 className="font-bold text-slate-800 text-lg">Historial de sesiones</h2>
            {sessions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-10 gap-3">
                <span className="text-5xl">📊</span>
                <p className="text-sm">Aún no hay sesiones guardadas.<br/>¡Completa tu primer examen!</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => [`${v}%`, 'Score']} />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="overflow-y-auto max-h-44">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="text-left py-1.5 font-semibold">#</th>
                        <th className="text-left py-1.5 font-semibold">Fecha</th>
                        <th className="text-center py-1.5 font-semibold">Pregs.</th>
                        <th className="text-right py-1.5 font-semibold">Score</th>
                        <th className="text-right py-1.5 font-semibold">Δ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s, i) => {
                        const prev = sessions[i - 1];
                        const delta = prev ? s.score - prev.score : null;
                        return (
                          <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="py-1.5 text-slate-500">{i + 1}</td>
                            <td className="py-1.5 text-slate-600">{s.date}</td>
                            <td className="py-1.5 text-center text-slate-600">{s.total}</td>
                            <td className="py-1.5 text-right font-bold" style={{ color: s.score >= 70 ? '#16a34a' : '#dc2626' }}>
                              {s.score}%
                            </td>
                            <td className="py-1.5 text-right">
                              {delta !== null && (
                                <span className={delta >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                                  {delta >= 0 ? '▲' : '▼'}{Math.abs(delta)}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats summary */}
        {sessions.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Sesiones', value: sessions.length, icon: '📝' },
              { label: 'Mejor score', value: `${Math.max(...sessions.map(s => s.score))}%`, icon: '🏆' },
              { label: 'Promedio', value: `${Math.round(sessions.reduce((a,s) => a + s.score, 0) / sessions.length)}%`, icon: '📈' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAM SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function ExamScreen({ questions, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);

  const elapsed = useTimer(true);
  const q = questions[currentIdx];
  const progress = (currentIdx / questions.length) * 100;
  const isLast = currentIdx === questions.length - 1;

  const handleSelect = (idx) => { if (!submitted) setSelected(idx); };

  const handleSubmit = () => { if (selected !== null) setSubmitted(true); };

  const handleNext = () => {
    const newAnswers = [...answers, { question: q, selected, correct: selected === q.answer }];
    if (isLast) {
      onFinish(newAnswers, elapsed);
    } else {
      setAnswers(newAnswers);
      setSelected(null);
      setSubmitted(false);
      setCurrentIdx(i => i + 1);
    }
  };

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const optionStyle = (idx) => {
    const base = 'option-btn w-full text-left p-3.5 rounded-xl border font-medium text-sm transition-all';
    if (!submitted) {
      return `${base} ${selected === idx
        ? 'bg-indigo-50 border-indigo-400 text-indigo-800'
        : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40'} cursor-pointer`;
    }
    if (idx === q.answer) return `${base} bg-emerald-50 border-emerald-500 text-emerald-800 pulse-green`;
    if (idx === selected && selected !== q.answer) return `${base} bg-red-50 border-red-400 text-red-800 pulse-red`;
    return `${base} bg-white border-slate-200 text-slate-400 opacity-60`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-2xl animate-fade-in-up">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
              {topicLabel(q.topic).split(' ').slice(0,2).join(' ')}
            </span>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full capitalize">
              {q.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-mono bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
            ⏱ {formatTime(elapsed)}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Pregunta {currentIdx + 1} de {questions.length}</span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-4 animate-fade-in">
          <p className="text-slate-800 font-semibold text-base md:text-lg leading-relaxed mb-6">
            {q.question}
          </p>

          <div className="space-y-2.5">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={submitted}
                className={optionStyle(idx)}
              >
                <span className="inline-flex items-start gap-2.5">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold mt-0.5 ${
                    !submitted && selected === idx ? 'bg-indigo-600 text-white'
                    : submitted && idx === q.answer ? 'bg-emerald-500 text-white'
                    : submitted && idx === selected && selected !== q.answer ? 'bg-red-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </span>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {submitted && (
            <div className={`mt-5 p-4 rounded-xl border text-sm leading-relaxed animate-fade-in ${
              selected === q.answer
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <div className="flex gap-2">
                <span className="text-lg flex-shrink-0">{selected === q.answer ? '✅' : '💡'}</span>
                <div>
                  {selected !== q.answer && (
                    <p className="font-bold mb-1">
                      Respuesta correcta: <span className="text-emerald-700">{q.options[q.answer]}</span>
                    </p>
                  )}
                  <p>{q.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              Enviar respuesta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              {isLast ? 'Ver resultados →' : 'Siguiente pregunta →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function ResultsScreen({ answers, totalTime, onRetry, onSave, saved }) {
  const total = answers.length;
  const correct = answers.filter(a => a.correct).length;
  const score = Math.round((correct / total) * 100);
  const grade = getGrade(score);

  const formatTime = s => s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;

  const topicStats = useMemo(() => {
    const map = {};
    answers.forEach(a => {
      const tid = a.question.topic;
      if (!map[tid]) map[tid] = { correct: 0, total: 0 };
      map[tid].total++;
      if (a.correct) map[tid].correct++;
    });
    return Object.entries(map).map(([id, s]) => ({
      id,
      label: topicLabel(id).split(' ').slice(0, 2).join(' '),
      pct: Math.round((s.correct / s.total) * 100),
      correct: s.correct,
      total: s.total,
    }));
  }, [answers]);

  const strengths  = topicStats.filter(t => t.pct >= 70);
  const weaknesses = topicStats.filter(t => t.pct <  60);
  const wrongAnswers = answers.filter(a => !a.correct);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">

        {/* Score card */}
        <div className={`${grade.bg} rounded-2xl border-2 ${grade.border} p-6 text-center`}>
          <div className={`text-7xl font-bold ${grade.color} mb-2`}>{grade.letter}</div>
          <div className="text-4xl font-bold text-slate-800 mb-1">{score}%</div>
          <div className={`text-lg font-semibold ${grade.color}`}>{grade.label}</div>
          <div className="text-slate-500 text-sm mt-2">
            {correct} de {total} correctas · ⏱ {formatTime(totalTime)}
          </div>
        </div>

        {/* Topic breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-slate-800 text-lg mb-4">Desglose por tema</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topicStats} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => [`${v}%`, 'Score']} />
              <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                {topicStats.map((t, i) => (
                  <Cell key={i} fill={t.pct >= 70 ? '#22c55e' : t.pct >= 60 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-emerald-700 mb-3 flex items-center gap-2">💪 Fortalezas detectadas</h3>
            {strengths.length === 0 ? (
              <p className="text-sm text-slate-400">Sigue practicando para identificar tus fortalezas.</p>
            ) : (
              <ul className="space-y-2">
                {strengths.map(t => (
                  <li key={t.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-medium">{topicLabel(t.id)}</span>
                    <span className="font-bold text-emerald-600">{t.pct}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-red-600 mb-3 flex items-center gap-2">📌 Áreas de oportunidad</h3>
            {weaknesses.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium">¡Sin áreas críticas! Excelente desempeño.</p>
            ) : (
              <ul className="space-y-2">
                {weaknesses.map(t => (
                  <li key={t.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-medium">{topicLabel(t.id)}</span>
                    <span className="font-bold text-red-500">{t.pct}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Personalized review */}
        {wrongAnswers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 text-lg mb-4">📚 Repaso personalizado</h2>
            <p className="text-sm text-slate-500 mb-4">
              Revisa los conceptos clave de las {wrongAnswers.length} preguntas que fallaste:
            </p>
            <div className="space-y-4">
              {wrongAnswers.map((a, i) => (
                <div key={i} className="border-l-4 border-indigo-300 pl-4 py-1">
                  <p className="text-sm font-semibold text-slate-700 mb-1">{a.question.question}</p>
                  <p className="text-xs text-emerald-700 font-medium mb-1">
                    ✓ Respuesta correcta: {a.question.options[a.question.answer]}
                  </p>
                  <p className="text-xs text-slate-500">{a.question.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center pb-8">
          <button
            onClick={onSave}
            disabled={saved}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-100 active:scale-95"
          >
            {saved ? '✓ Guardado' : '💾 Guardar sesión'}
          </button>
          <button
            onClick={() => onRetry('same')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95"
          >
            🔁 Repetir mismo temario
          </button>
          <button
            onClick={() => onRetry('new')}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95"
          >
            🏠 Nuevo examen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home');
  const [examConfig, setExamConfig] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examAnswers, setExamAnswers] = useState([]);
  const [examTime, setExamTime] = useState(0);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [history, dispatch] = useReducer(historyReducer, initialHistory);

  const buildExam = useCallback((config) => {
    const { difficulty, questionCount, selectedTopics } = config;
    let pool = ALL_QUESTIONS.filter(q => selectedTopics.includes(q.topic));
    if (difficulty !== 'mixto') pool = pool.filter(q => q.difficulty === difficulty);
    if (pool.length === 0) pool = ALL_QUESTIONS.filter(q => selectedTopics.includes(q.topic));
    return shuffle(pool).slice(0, Math.min(questionCount, pool.length));
  }, []);

  const handleStart = (config) => {
    const qs = buildExam(config);
    setExamConfig(config);
    setExamQuestions(qs);
    setExamAnswers([]);
    setExamTime(0);
    setSessionSaved(false);
    setScreen('exam');
  };

  const handleFinish = (answers, time) => {
    setExamAnswers(answers);
    setExamTime(time);
    setScreen('results');
  };

  const handleSave = () => {
    const total = examAnswers.length;
    const correct = examAnswers.filter(a => a.correct).length;
    const score = Math.round((correct / total) * 100);
    const now = new Date();
    dispatch({
      type: 'SAVE_SESSION',
      payload: {
        id: Date.now(),
        date: `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`,
        total,
        score,
        topics: [...new Set(examAnswers.map(a => a.question.topic))],
      },
    });
    setSessionSaved(true);
  };

  const handleRetry = (mode) => {
    if (mode === 'same') {
      const qs = buildExam(examConfig);
      setExamQuestions(qs);
      setExamAnswers([]);
      setExamTime(0);
      setSessionSaved(false);
      setScreen('exam');
    } else {
      setScreen('home');
    }
  };

  return (
    <>
      {screen === 'home'    && <HomeScreen    history={history} onStart={handleStart} />}
      {screen === 'exam'    && <ExamScreen    questions={examQuestions} onFinish={handleFinish} />}
      {screen === 'results' && <ResultsScreen answers={examAnswers} totalTime={examTime} onRetry={handleRetry} onSave={handleSave} saved={sessionSaved} />}
    </>
  );
}

