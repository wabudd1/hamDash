import { Component } from '@angular/core';
import { ImageHandlerComponent } from '../../image-handler/image-handler.component';

@Component({
    standalone: true,
    imports: [ImageHandlerComponent],
    selector: 'ham-radio-propagation',
    templateUrl: './radio-propagation.component.html',
    styleUrl: './radio-propagation.component.scss'
})
export class RadioPropagationComponent {

}
