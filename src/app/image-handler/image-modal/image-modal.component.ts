import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ham-image-modal',
  imports: [],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.scss'
})
export class ImageModalComponent implements OnInit{
  @Input({required: true}) mediumImage?: string;
  @Input({required: true}) imageTitle: string = "Embiggened Image"

  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit(): void {
  }
}
