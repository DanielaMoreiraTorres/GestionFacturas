import {
    AfterViewInit,
    Component,
    inject,
    Input,
    OnInit,
    Renderer2,
    ViewChild,
    Output,
    EventEmitter
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicioMensaje } from 'src/app/core/services/message.service';
import { Peticion } from 'src/app/core/models/peticion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
})
export class ModalComponent {
    @Input() titulo: string = '';
    @Input() isVisible: boolean = false;
    @Input() tamano: 'small' | 'medium' | 'large' = 'medium';
    @Output() cerrarModal = new EventEmitter<void>();
    @Output() confirmarModal = new EventEmitter<void>();

    cerrar() {
        this.cerrarModal.emit();
    }

    confirmar() {
        this.confirmarModal.emit();
        //this.cerrar();
    }
}