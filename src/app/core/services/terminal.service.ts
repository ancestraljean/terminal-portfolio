import { Injectable, signal, computed } from '@angular/core';
import { Command, CommandResult, TerminalLine } from '../models';
import portfolioData from '../config/portfolio-data.json';
import { PortfolioData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
  private readonly data: PortfolioData = portfolioData as PortfolioData;

  // Signals para manejo de estado reactivo
  private _lines = signal<TerminalLine[]>([]);
  private _commandHistory = signal<string[]>([]);
  private _historyIndex = signal<number>(-1);
  private _currentInput = signal<string>('');

  // Computed signals
  readonly lines = computed(() => this._lines());
  readonly commandHistory = computed(() => this._commandHistory());
  readonly availableCommands = computed(() => Object.keys(this.data.commands));

  // Mapa de comandos disponibles
  private readonly commandHandlers: Map<string, (args: string[]) => CommandResult> = new Map([
    ['help', (args) => this.handleHelp(args)],
    ['whoami', (args) => this.handleWhoami(args)],
    ['ls', (args) => this.handleLs(args)],
    ['skills', (args) => this.handleSkills(args)],
    ['experience', (args) => this.handleExperience(args)],
    ['projects', (args) => this.handleProjects(args)],
    ['view', (args) => this.handleView(args)],
    ['social', (args) => this.handleSocial(args)],
    ['clear', (args) => this.handleClear(args)],
  ]);

  constructor() {
    this.addWelcomeMessage();
  }

  /**
   * Agrega el mensaje de bienvenida al terminal
   */
  private addWelcomeMessage(): void {
    const welcomeLines: TerminalLine[] = [
      {
        type: 'success',
        content: '╔══════════════════════════════════════════════════════════╗',
        timestamp: new Date()
      },
      {
        type: 'success',
        content: '║                                                          ║',
        timestamp: new Date()
      },
      {
        type: 'success',
        content: `║     Bienvenido/a al Portfolio Terminal de ${this.data.whoami.name.padEnd(15)} ║`,
        timestamp: new Date()
      },
      {
        type: 'success',
        content: '║                                                          ║',
        timestamp: new Date()
      },
      {
        type: 'success',
        content: '╚══════════════════════════════════════════════════════════╝',
        timestamp: new Date()
      },
      {
        type: 'output',
        content: '',
        timestamp: new Date()
      },
      {
        type: 'output',
        content: 'Escribe "help" para ver la lista de comandos disponibles.',
        timestamp: new Date()
      },
      {
        type: 'output',
        content: '',
        timestamp: new Date()
      }
    ];

    this._lines.set(welcomeLines);
  }

  /**
   * Ejecuta un comando ingresado por el usuario
   */
  executeCommand(input: string): void {
    const trimmedInput = input.trim();

    // Agregar comando al output
    this.addLine({
      type: 'command',
      content: `$ ${trimmedInput}`,
      timestamp: new Date()
    });

    // No ejecutar si el comando está vacío
    if (!trimmedInput) {
      return;
    }

    // Agregar al historial
    this.addToHistory(trimmedInput);

    // Parsear el comando
    const command = this.parseCommand(trimmedInput);

    // Ejecutar el comando
    const handler = this.commandHandlers.get(command.name);

    if (handler) {
      const result = handler(command.args);
      result.output.forEach(line => this.addLine(line));
    } else {
      this.addLine({
        type: 'error',
        content: `bash: ${command.name}: command not found`,
        timestamp: new Date()
      });
      this.addLine({
        type: 'output',
        content: `Intenta 'help' para ver los comandos disponibles.`,
        timestamp: new Date()
      });
    }

    // Agregar línea vacía después del output
    this.addLine({
      type: 'output',
      content: '',
      timestamp: new Date()
    });
  }

  /**
   * Parsea un string de comando en un objeto Command
   */
  private parseCommand(input: string): Command {
    const parts = input.trim().split(/\s+/);
    return {
      name: parts[0].toLowerCase(),
      args: parts.slice(1),
      raw: input
    };
  }

  /**
   * Agrega una línea al output del terminal
   */
  private addLine(line: TerminalLine): void {
    this._lines.update(lines => [...lines, line]);
  }

  /**
   * Agrega un comando al historial
   */
  private addToHistory(command: string): void {
    this._commandHistory.update(history => [...history, command]);
    this._historyIndex.set(-1);
  }

  /**
   * Obtiene el comando anterior del historial
   */
  getPreviousCommand(): string | null {
    const history = this._commandHistory();
    const currentIndex = this._historyIndex();

    if (history.length === 0) return null;

    let newIndex: number;
    if (currentIndex === -1) {
      newIndex = history.length - 1;
    } else if (currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return history[currentIndex];
    }

    this._historyIndex.set(newIndex);
    return history[newIndex];
  }

  /**
   * Obtiene el siguiente comando del historial
   */
  getNextCommand(): string | null {
    const history = this._commandHistory();
    const currentIndex = this._historyIndex();

    if (currentIndex === -1) return '';

    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      this._historyIndex.set(newIndex);
      return history[newIndex];
    } else {
      this._historyIndex.set(-1);
      return '';
    }
  }

  /**
   * Obtiene sugerencias de autocompletado para un input parcial
   */
  getAutoCompleteSuggestion(partial: string): string | null {
    if (!partial) return null;

    const commands = this.availableCommands();
    const matches = commands.filter(cmd => cmd.startsWith(partial.toLowerCase()));

    return matches.length === 1 ? matches[0] : null;
  }

  /**
   * Obtiene todas las coincidencias de autocompletado
   */
  getAutoCompleteMatches(partial: string): string[] {
    if (!partial) return [];

    const commands = this.availableCommands();
    return commands.filter(cmd => cmd.startsWith(partial.toLowerCase()));
  }

  // ==================== COMMAND HANDLERS ====================

  private handleHelp(args: string[]): CommandResult {
    const output: TerminalLine[] = [
      {
        type: 'output',
        content: 'Comandos disponibles:',
        timestamp: new Date()
      },
      {
        type: 'output',
        content: '',
        timestamp: new Date()
      }
    ];

    Object.entries(this.data.commands).forEach(([cmd, info]) => {
      output.push({
        type: 'output',
        content: `  ${cmd.padEnd(15)} - ${info.description}`,
        timestamp: new Date()
      });

      // Mostrar opciones si existen
      if (info.options && info.options.length > 0) {
        info.options.forEach(option => {
          output.push({
            type: 'output',
            content: `      ${option.flag.padEnd(11)} - ${option.description}`,
            timestamp: new Date()
          });
        });
      }

      // Mostrar ejemplo si existe
      if (info.example) {
        output.push({
          type: 'output',
          content: `      Ejemplo: ${info.example}`,
          timestamp: new Date()
        });
      }
    });

    output.push({
      type: 'output',
      content: '',
      timestamp: new Date()
    });
    output.push({
      type: 'output',
      content: 'Usa TAB para autocompletar comandos.',
      timestamp: new Date()
    });
    output.push({
      type: 'output',
      content: 'Usa ↑/↓ para navegar por el historial.',
      timestamp: new Date()
    });

    return { success: true, output };
  }

  private handleWhoami(args: string[]): CommandResult {
    const { name, role, bio, location, yearsOfExperience } = this.data.whoami;

    const output: TerminalLine[] = [
      {
        type: 'success',
        content: `┌─ ${name}`,
        timestamp: new Date()
      },
      {
        type: 'output',
        content: `│`,
        timestamp: new Date()
      },
      {
        type: 'output',
        content: `│  🎯 ${role}`,
        timestamp: new Date()
      },
      {
        type: 'output',
        content: `│  📍 ${location}`,
        timestamp: new Date()
      },
      {
        type: 'output',
        content: `│  💼 ${yearsOfExperience}+ años de experiencia`,
        timestamp: new Date()
      },
      {
        type: 'output',
        content: `│`,
        timestamp: new Date()
      },
      {
        type: 'output',
        content: `│  ${bio}`,
        timestamp: new Date()
      },
      {
        type: 'output',
        content: `└─`,
        timestamp: new Date()
      }
    ];

    return { success: true, output };
  }

  private handleLs(args: string[]): CommandResult {
    const output: TerminalLine[] = [
      {
        type: 'output',
        content: 'about.txt  experience.log  projects/  skills/  social.links',
        timestamp: new Date()
      }
    ];

    return { success: true, output };
  }

  private handleSkills(args: string[]): CommandResult {
    const output: TerminalLine[] = [
      {
        type: 'success',
        content: '📂 Skills Directory',
        timestamp: new Date()
      },
      {
        type: 'output',
        content: '',
        timestamp: new Date()
      }
    ];

    // Frameworks
    output.push({
      type: 'warning',
      content: '⚡ Frameworks:',
      timestamp: new Date()
    });
    this.data.skills.frameworks.forEach(skill => {
      output.push({
        type: 'output',
        content: `   ${skill.icon} ${skill.name.padEnd(20)} [${skill.level}]`,
        timestamp: new Date()
      });
    });
    output.push({ type: 'output', content: '', timestamp: new Date() });

    // Languages
    output.push({
      type: 'warning',
      content: '🔤 Languages:',
      timestamp: new Date()
    });
    this.data.skills.languages.forEach(skill => {
      output.push({
        type: 'output',
        content: `   ${skill.icon} ${skill.name.padEnd(20)} [${skill.level}]`,
        timestamp: new Date()
      });
    });
    output.push({ type: 'output', content: '', timestamp: new Date() });

    // Databases
    output.push({
      type: 'warning',
      content: '🗄️  Databases:',
      timestamp: new Date()
    });
    this.data.skills.databases.forEach(skill => {
      output.push({
        type: 'output',
        content: `   ${skill.icon} ${skill.name.padEnd(20)} [${skill.level}]`,
        timestamp: new Date()
      });
    });
    output.push({ type: 'output', content: '', timestamp: new Date() });

    // Tools
    output.push({
      type: 'warning',
      content: '🛠️  Tools:',
      timestamp: new Date()
    });
    this.data.skills.tools.forEach(skill => {
      output.push({
        type: 'output',
        content: `   ${skill.icon} ${skill.name.padEnd(20)} [${skill.level}]`,
        timestamp: new Date()
      });
    });
    output.push({ type: 'output', content: '', timestamp: new Date() });

    // Idiomas hablados
    output.push({
      type: 'warning',
      content: '🌍 Idiomas:',
      timestamp: new Date()
    });
    this.data.languages.forEach(language => {
      output.push({
        type: 'output',
        content: `   ${language.icon} ${language.name.padEnd(20)} [${language.level}]`,
        timestamp: new Date()
      });
    });

    return { success: true, output };
  }

  private handleExperience(args: string[]): CommandResult {
    const output: TerminalLine[] = [
      {
        type: 'success',
        content: '📋 Historial Laboral',
        timestamp: new Date()
      },
      {
        type: 'output',
        content: '',
        timestamp: new Date()
      }
    ];

    this.data.experience.forEach((exp, index) => {
      output.push({
        type: 'warning',
        content: `[${exp.period}]`,
        timestamp: new Date()
      });
      output.push({
        type: 'success',
        content: `🏢 ${exp.company}`,
        timestamp: new Date()
      });
      output.push({
        type: 'output',
        content: `   Rol: ${exp.role}`,
        timestamp: new Date()
      });
      output.push({
        type: 'output',
        content: `   ${exp.description}`,
        timestamp: new Date()
      });
      output.push({
        type: 'output',
        content: `   Tecnologías: ${exp.technologies.join(', ')}`,
        timestamp: new Date()
      });

      if (index < this.data.experience.length - 1) {
        output.push({ type: 'output', content: '', timestamp: new Date() });
      }
    });

    return { success: true, output };
  }

  private handleProjects(args: string[]): CommandResult {
    const output: TerminalLine[] = [
      {
        type: 'success',
        content: '🚀 Proyectos Destacados',
        timestamp: new Date()
      },
      {
        type: 'output',
        content: '',
        timestamp: new Date()
      }
    ];

    this.data.projects.forEach((project, index) => {
      const statusColor = project.status === 'Completado' ? 'success' : 'warning';

      output.push({
        type: 'warning',
        content: `[${index + 1}] ${project.name}`,
        timestamp: new Date()
      });
      output.push({
        type: 'output',
        content: `    ID: ${project.id}`,
        timestamp: new Date()
      });
      output.push({
        type: 'output',
        content: `    ${project.description}`,
        timestamp: new Date()
      });
      output.push({
        type: statusColor as any,
        content: `    Status: ${project.status}`,
        timestamp: new Date()
      });
      output.push({
        type: 'output',
        content: `    Tech: ${project.technologies.join(', ')}`,
        timestamp: new Date()
      });
      output.push({
        type: 'output',
        content: `    💡 Escribe: view ${project.id}`,
        timestamp: new Date()
      });

      if (index < this.data.projects.length - 1) {
        output.push({ type: 'output', content: '', timestamp: new Date() });
      }
    });

    return { success: true, output };
  }

  private handleView(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        success: false,
        output: [
          {
            type: 'error',
            content: 'Error: Debes especificar un project-id',
            timestamp: new Date()
          },
          {
            type: 'output',
            content: 'Uso: view <project-id>',
            timestamp: new Date()
          },
          {
            type: 'output',
            content: 'Ejemplo: view terminal-portfolio',
            timestamp: new Date()
          }
        ]
      };
    }

    const projectId = args[0];
    const project = this.data.projects.find(p => p.id === projectId);

    if (!project) {
      return {
        success: false,
        output: [
          {
            type: 'error',
            content: `Error: Proyecto "${projectId}" no encontrado`,
            timestamp: new Date()
          },
          {
            type: 'output',
            content: 'Usa "projects" para ver los IDs disponibles.',
            timestamp: new Date()
          }
        ]
      };
    }

    // Retornar línea especial que indica que se debe abrir el modal
    return {
      success: true,
      output: [
        {
          type: 'output',
          content: `Abriendo vista del proyecto: ${project.name}...`,
          timestamp: new Date(),
          component: 'project-modal',
          data: project
        }
      ]
    };
  }

  private handleSocial(args: string[]): CommandResult {
    const output: TerminalLine[] = [
      {
        type: 'success',
        content: '🔗 Enlaces Sociales',
        timestamp: new Date()
      },
      {
        type: 'output',
        content: '',
        timestamp: new Date()
      }
    ];

    this.data.social.forEach(social => {
      output.push({
        type: 'output',
        content: `  ${this.getIconForPlatform(social.icon)} ${social.platform.padEnd(12)} → ${social.url}`,
        timestamp: new Date(),
        component: 'social-link',
        data: social
      });
    });

    return { success: true, output };
  }

  private handleClear(args: string[]): CommandResult {
    this._lines.set([]);
    this.addWelcomeMessage();
    return { success: true, output: [] };
  }

  /**
   * Obtiene el icono para una plataforma social
   */
  private getIconForPlatform(icon: string): string {
    const icons: Record<string, string> = {
      'github': '🐙',
      'linkedin': '💼',
      'twitter': '🐦',
      'mail': '📧'
    };
    return icons[icon] || '🔗';
  }
}
