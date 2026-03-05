# ExamAI – Técnicas de Inteligencia Artificial

Plataforma web interactiva para preparar el examen de **Técnicas de Inteligencia Artificial**.  
Construida con React + Vite + Tailwind CSS + Recharts.

## 🚀 Demo en vivo

👉 **[https://artemisaix.github.io/guia_tecnicas_ai_code](https://artemisaix.github.io/guia_tecnicas_ai_code)**

---

## ✨ Funcionalidades

| Pantalla | Descripción |
|----------|-------------|
| **Inicio** | Selecciona dificultad, número de preguntas y temas; visualiza el historial de sesiones con gráfica de progreso |
| **Examen** | Una pregunta a la vez, timer en tiempo real, feedback inmediato (verde/rojo) y explicación pedagógica |
| **Resultados** | Score con calificación A–F, desglose por tema (gráfica de barras), fortalezas, áreas de oportunidad y repaso personalizado |

## 📚 Temas cubiertos (50 preguntas)

| Tema | Preguntas |
|------|-----------|
| Búsqueda en Espacios de Estado | 7 |
| Satisfacción de Restricciones (CSP) | 6 |
| Lógica y Representación del Conocimiento | 6 |
| Aprendizaje Automático (ML) | 8 |
| Redes Neuronales y Deep Learning | 5 |
| Algoritmos Genéticos y Evolutivos | 5 |
| Agentes Inteligentes | 6 |
| Incertidumbre y Probabilidad | 7 |

## 🛠 Stack tecnológico

- **React 19** — hooks: `useState`, `useReducer`, `useMemo`, `useCallback`, `useEffect`
- **Vite 7** — bundler y servidor de desarrollo
- **Tailwind CSS 4** — estilos via `@tailwindcss/vite`
- **Recharts 3** — gráficas de línea y barras
- **Google Fonts** — Nunito + Space Grotesk

## 💻 Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

## 🚀 Despliegue en GitHub Pages

### Opción A — Automático (recomendado con GitHub Student)

1. En GitHub, ve a **Settings → Pages**
2. En *Source* selecciona **GitHub Actions**
3. Haz push a `main` — el workflow `.github/workflows/deploy.yml` construye y publica automáticamente

### Opción B — Manual con `gh-pages`

```bash
npm run deploy
```

> Requiere que hayas configurado `homepage` en `package.json` con tu URL de GitHub Pages.

## 📂 source_docs

Carpeta reservada para los archivos PDF y TXT de los microtest del semestre.  
Sube aquí tus PDFs para futuras iteraciones de preguntas.
