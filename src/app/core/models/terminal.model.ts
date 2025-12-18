export interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success' | 'warning';
  content: string;
  timestamp: Date;
  component?: string; // Para outputs que requieren componentes custom
  data?: any; // Datos adicionales para el componente
}

export interface CommandResult {
  success: boolean;
  output: TerminalLine[];
}

export interface Command {
  name: string;
  args: string[];
  raw: string;
}

export interface CommandHandler {
  execute(command: Command): CommandResult;
  getAutoComplete?(partial: string): string[];
}

export type OutputType = 'text' | 'list' | 'table' | 'component';
