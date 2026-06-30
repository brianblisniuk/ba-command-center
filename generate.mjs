# Pasaporte Negro Carousel Pro

Generador programático de carruseles editoriales para Pasaporte Negro.

## Qué incluye

- 1 template HTML/CSS.
- 5 layouts profesionales.
- JSON editable.
- Export automático PNG.
- Feed 1080×1350.
- Story / Reel cover 1080×1920.
- Auto-fit básico de texto.
- Temas visuales.
- Fallback visual si falta una imagen.
- Export de HTML preview.
- Manifest de salida.

## Instalación

```bash
npm install
npx playwright install chromium
```

## Uso

```bash
npm run generate
```

Exporta PNG en:

```bash
exports/png/
```

También genera previews HTML en:

```bash
exports/html/
```

## Generar solo feed

```bash
npm run generate:feed
```

## Generar solo story/reel covers

```bash
npm run generate:story
```

## Validar JSON

```bash
npm run validate
```

## Agregar imágenes

Poné tus imágenes en:

```bash
assets/images/
```

Y en `slides.json` cambiá:

```json
"background": {
  "src": "assets/images/engadin.jpg",
  "fallback": "alpine",
  "position": "center center",
  "zoom": 1.04
}
```

Si la imagen no existe, el sistema no se rompe: usa un fondo fallback.

## Layouts

### 1. destination-editorial
Portada editorial de destino.

Campos:
- `title.script`
- `title.main`
- `title.kicker`
- `body`
- `meta`

### 2. activity-specific
Actividad específica del itinerario.

Campos:
- `title.script`
- `title.main`
- `title.kicker`
- `body`
- `details`

### 3. comparison
Comparativo.

Campos:
- `title.main`
- `left.label`
- `left.text`
- `right.label`
- `right.text`
- `question`

### 4. final-cta
Cierre comercial del carrusel.

Campos:
- `title.script`
- `title.main`
- `body`
- `cta.headline`
- `cta.text`

### 5. story-cover
Story / reel cover.

Campos:
- `title.script`
- `title.main`
- `title.kicker`
- `body`
- `meta`

## Temas

Incluidos:
- `alpine-dark`
- `noir-city`
- `warm-editorial`

Ejemplo:

```json
"theme": "alpine-dark"
```

## Tamaños

- Feed: `1080 × 1350`
- Story: `1080 × 1920`

## Tipografías

No se incluyen fuentes comerciales. El sistema usa fuentes del sistema.

Para usar fuentes premium, agregá tus `.woff2` licenciadas en:

```bash
assets/fonts/
```

Y activá el bloque `@font-face` en `src/styles.css`.

No subas ni compartas fuentes si no tenés licencia.

## Recomendación de uso

Para un carrusel Pasaporte Negro real:

1. `destination-editorial`
2. `activity-specific`
3. `activity-specific`
4. `comparison`
5. `final-cta`

Para stories o reels:

1. `story-cover`
2. `activity-specific` en formato story
3. `final-cta` en formato story
