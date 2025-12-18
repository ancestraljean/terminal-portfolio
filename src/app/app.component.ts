import { Component } from '@angular/core';
import { TerminalComponent } from './features/terminal/components/terminal/terminal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TerminalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'terminal-portfolio';
}
