# 💻 Terminal Portfolio

Portafolio web interactivo con interfaz de Terminal Linux (TUI) construido con Angular 18, TypeScript y Tailwind CSS. Una forma única y moderna de presentar tu experiencia profesional.

## ✨ Características

- 🎨 **Interfaz TUI Retro-Moderna**: Diseño inspirado en terminales de Linux con estética GitHub Dark
- 🔄 **Signals de Angular**: Manejo de estado reactivo con la última API de Angular
- 🏗️ **Clean Architecture**: Estructura modular y escalable
- ⌨️ **Command History**: Navegación con flechas ↑/↓ para comandos anteriores
- 📝 **Tab Completion**: Autocompletado inteligente de comandos
- 🎯 **Standalone Components**: Componentes independientes sin módulos
- 🎭 **Animaciones Suaves**: Cursor parpadeante y transiciones fluidas
- 📱 **Responsive Design**: Optimizado para todos los dispositivos
- 🔍 **Modal Interactivo**: Vista detallada de proyectos con multimedia

## 🎮 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `help` | Muestra la lista de comandos disponibles |
| `whoami` | Información profesional sobre ti |
| `ls -skills` | Lista todas tus tecnologías y habilidades |
| `experience` | Muestra tu trayectoria laboral |
| `projects` | Lista todos tus proyectos |
| `view <project-id>` | Visualiza detalles de un proyecto específico |
| `social` | Muestra tus enlaces de redes sociales |
| `clear` | Limpia la pantalla del terminal |

### Atajos de Teclado

- `↑` / `↓`: Navegar por el historial de comandos
- `Tab`: Autocompletar comandos
- `Ctrl + L`: Limpiar pantalla
- `Ctrl + C`: Cancelar input actual

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js v18.x o superior
- npm v8.x o superior
- Angular CLI v18.x

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/terminal-portfolio.git
cd terminal-portfolio

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Build para Producción

```bash
# Compilar para producción
npm run build

# Los archivos estarán en dist/terminal-portfolio
```

## 📁 Estructura del Proyecto

```
src/app/
├── core/                           # Lógica central de la aplicación
│   ├── services/                   # Servicios singleton
│   │   └── terminal.service.ts    # Servicio principal del terminal
│   ├── models/                     # Interfaces y tipos TypeScript
│   │   ├── terminal.model.ts
│   │   ├── portfolio.model.ts
│   │   └── index.ts
│   └── config/                     # Configuración y datos
│       └── portfolio-data.json    # Datos del portafolio (PERSONALIZAR AQUÍ)
│
├── features/                       # Módulos por funcionalidad
│   └── terminal/
│       ├── components/
│       │   └── terminal/          # Componente principal del terminal
│       └── models/
│
├── shared/                         # Componentes compartidos
│   └── components/
│       └── project-modal/         # Modal de proyectos
│
└── app.component.ts               # Componente raíz
```

## 🎨 Personalización

### 1. Actualizar Información Personal

Edita el archivo `src/app/core/config/portfolio-data.json`:

```json
{
  "whoami": {
    "name": "Tu Nombre",
    "role": "Tu Rol Profesional",
    "bio": "Tu biografía...",
    "location": "Tu Ciudad, País",
    "yearsOfExperience": 5
  },
  // ... más configuración
}
```

### 2. Agregar Proyectos

Añade nuevos proyectos en `portfolio-data.json`:

```json
{
  "projects": [
    {
      "id": "mi-proyecto",
      "name": "Mi Proyecto",
      "description": "Descripción del proyecto",
      "technologies": ["Angular", "TypeScript"],
      "status": "Completado",
      "github": "https://github.com/...",
      "demo": "https://...",
      "features": [
        "Feature 1",
        "Feature 2"
      ],
      "media": {
        "type": "images",
        "items": ["/assets/projects/mi-proyecto/img1.png"]
      }
    }
  ]
}
```

### 3. Personalizar Colores

Modifica `tailwind.config.js` para cambiar los colores del terminal:

```javascript
colors: {
  terminal: {
    bg: '#0d1117',        // Fondo principal
    text: '#c9d1d9',      // Texto principal
    prompt: '#58a6ff',    // Color del prompt
    error: '#f85149',     // Mensajes de error
    success: '#3fb950',   // Mensajes de éxito
    warning: '#d29922',   // Advertencias
    accent: '#a371f7',    // Color de acento
  }
}
```

### 4. Agregar Nuevos Comandos

Para agregar un nuevo comando, edita `src/app/core/services/terminal.service.ts`:

```typescript
// 1. Agregar el handler al mapa de comandos
private readonly commandHandlers: Map<string, (args: string[]) => CommandResult> = new Map([
  // ... comandos existentes
  ['tucomando', (args) => this.handleTuComando(args)],
]);

// 2. Implementar el método handler
private handleTuComando(args: string[]): CommandResult {
  const output: TerminalLine[] = [
    {
      type: 'output',
      content: 'Tu salida aquí',
      timestamp: new Date()
    }
  ];
  return { success: true, output };
}
```

## 🏛️ Arquitectura

### Clean Architecture

El proyecto sigue principios de Clean Architecture:

- **Core**: Lógica de negocio y modelos de dominio
- **Features**: Características específicas organizadas por módulos
- **Shared**: Componentes y utilidades reutilizables

### Patrones Utilizados

- **Signals**: Manejo de estado reactivo nativo de Angular
- **Service Pattern**: TerminalService como singleton
- **Component Pattern**: Componentes standalone reutilizables
- **Data-Driven**: Configuración centralizada en JSON

## 🛠️ Tecnologías

- **Angular 18** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Tailwind CSS** - Framework de estilos
- **RxJS** - Programación reactiva
- **Signals** - Gestión de estado

## 📦 Scripts Disponibles

```bash
npm start          # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm test           # Ejecutar tests (si están configurados)
npm run lint       # Ejecutar linter
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

## 🙏 Agradecimientos

- Inspirado en terminales de Linux y GitHub Dark Theme
- Construido con las últimas características de Angular 18
- Diseñado para desarrolladores que aman la línea de comandos

---

⭐️ Si te gustó este proyecto, no olvides darle una estrella!
