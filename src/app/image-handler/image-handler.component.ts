import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ham-image-handler',
  imports: [CommonModule],
  templateUrl: './image-handler.component.html',
  styleUrl: './image-handler.component.scss'
})
export class ImageHandlerComponent implements OnInit {
  @Input({required: true}) smallSource!: string;
  @Input({required: true}) mediumSource!: string;
  @Input({required: false}) giganticSource?: string;
  @Input({required: true}) sourceLink?: string;
  @Input({required: false}) imageAltText?: string;

  constructor(private modalService: NgbModal) {

  }

  ngOnInit(): void {
    
  }

  public imageClick(): void {
    this.modalService
  }
}
