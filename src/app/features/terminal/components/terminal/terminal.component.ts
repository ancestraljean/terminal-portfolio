import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalService } from '../../../../core/services/terminal.service';
import { TerminalLine, Project } from '../../../../core/models';
import { ProjectModalComponent } from '../../../../shared/components/project-modal/project-modal.component';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectModalComponent],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent implements OnInit, AfterViewChecked {
  @ViewChild('terminalOutput') terminalOutput!: ElementRef<HTMLDivElement>;
  @ViewChild('commandInput') commandInput!: ElementRef<HTMLInputElement>;

  currentInput = '';
  private shouldScrollToBottom = false;

  // Modal state
  isModalOpen = false;
  selectedProject: Project | null = null;

  // Computed signals del servicio
  readonly lines;

  constructor(public terminalService: TerminalService) {
    // Inicializar lines después del servicio
    this.lines = this.terminalService.lines;

    // Effect para scroll automático cuando cambian las líneas
    effect(() => {
      // Acceder al signal para registrar la dependencia
      this.lines();
      // Marcar que necesitamos hacer scroll
      this.shouldScrollToBottom = true;
    });
  }

  ngOnInit(): void {
    // Focus automático en el input al cargar
    setTimeout(() => {
      this.focusInput();
    }, 100);
  }

  ngAfterViewChecked(): void {
    // Hacer scroll al final si es necesario
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  /**
   * Maneja el evento de tecla presionada en el input
   */
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.handleEnter();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.handleArrowUp();
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.handleArrowDown();
        break;

      case 'Tab':
        event.preventDefault();
        this.handleTab();
        break;

      case 'l':
        // Ctrl+L para limpiar
        if (event.ctrlKey) {
          event.preventDefault();
          this.terminalService.executeCommand('clear');
          this.currentInput = '';
        }
        break;

      case 'c':
        // Ctrl+C para cancelar el input actual
        if (event.ctrlKey) {
          event.preventDefault();
          this.currentInput = '';
        }
        break;
    }
  }

  /**
   * Maneja la tecla Enter - ejecuta el comando
   */
  private handleEnter(): void {
    if (this.currentInput.trim()) {
      this.terminalService.executeCommand(this.currentInput);
    } else {
      // Comando vacío, solo agregar nueva línea
      this.terminalService.executeCommand('');
    }
    this.currentInput = '';
    this.focusInput();
  }

  /**
   * Maneja flecha arriba - comando anterior del historial
   */
  private handleArrowUp(): void {
    const previousCommand = this.terminalService.getPreviousCommand();
    if (previousCommand !== null) {
      this.currentInput = previousCommand;
    }
  }

  /**
   * Maneja flecha abajo - comando siguiente del historial
   */
  private handleArrowDown(): void {
    const nextCommand = this.terminalService.getNextCommand();
    if (nextCommand !== null) {
      this.currentInput = nextCommand;
    }
  }

  /**
   * Maneja la tecla Tab - autocompletado
   */
  private handleTab(): void {
    if (!this.currentInput.trim()) return;

    const suggestion = this.terminalService.getAutoCompleteSuggestion(this.currentInput.trim());
    if (suggestion) {
      this.currentInput = suggestion;
    } else {
      // Si hay múltiples coincidencias, mostrarlas
      const matches = this.terminalService.getAutoCompleteMatches(this.currentInput.trim());
      if (matches.length > 1) {
        // Agregar línea mostrando las coincidencias
        const matchesLine = matches.join('  ');
        this.terminalService.executeCommand('');
        // Aquí podríamos mostrar las opciones, pero para mantenerlo simple
        // solo dejamos el input como está
      }
    }
  }

  /**
   * Hace scroll al final del output del terminal
   */
  private scrollToBottom(): void {
    if (this.terminalOutput) {
      const element = this.terminalOutput.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  /**
   * Da foco al input del comando
   */
  focusInput(): void {
    if (this.commandInput) {
      this.commandInput.nativeElement.focus();
    }
  }

  /**
   * Maneja el click en el contenedor del terminal
   */
  onTerminalClick(): void {
    this.focusInput();
  }

  /**
   * Obtiene la clase CSS según el tipo de línea
   */
  getLineClass(line: TerminalLine): string {
    switch (line.type) {
      case 'command':
        return 'terminal-prompt font-bold';
      case 'error':
        return 'terminal-error';
      case 'success':
        return 'terminal-success';
      case 'warning':
        return 'terminal-warning';
      default:
        return '';
    }
  }

  /**
   * Verifica si una línea tiene un componente custom
   */
  hasCustomComponent(line: TerminalLine): boolean {
    return !!line.component;
  }

  /**
   * Maneja el click en un enlace social
   */
  onSocialLinkClick(data: any): void {
    if (data && data.url) {
      window.open(data.url, '_blank');
    }
  }

  /**
   * Maneja el evento de abrir el modal de proyecto
   */
  onOpenProjectModal(data: any): void {
    this.selectedProject = data;
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal de proyecto
   */
  onCloseModal(): void {
    this.isModalOpen = false;
    this.selectedProject = null;
    this.focusInput();
  }
}
