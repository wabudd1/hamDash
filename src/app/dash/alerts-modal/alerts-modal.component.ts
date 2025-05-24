import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { INwsRoot } from '../../models/nws/iNwsRoot';

@Component({
    selector: 'ham-alerts-modal',
    imports: [CommonModule],
    templateUrl: './alerts-modal.component.html',
    styleUrl: './alerts-modal.component.scss'
})
export class AlertsModalComponent {
  @Input() weatherZone!: INwsRoot;

	activeModal = inject(NgbActiveModal);
}
