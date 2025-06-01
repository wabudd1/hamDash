import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ham-image-handler',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './image-handler.component.html',
  styleUrl: './image-handler.component.scss'
})
export class ImageHandlerComponent implements OnInit {
  @Input({required: true}) smallSource!: string;
  @Input({required: true}) mediumSource!: string;
  @Input({required: false}) giganticSource?: string;
  @Input({required: true}) sourceLink!: string;
  @Input({required: true}) imageTitle!: string;

  public readonly upRightIcon: IconDefinition = faArrowUpRightFromSquare;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void { }

  /**
   * Called when the user clicks the image embiggener button to open an XL sized modal.
   */
  public imageClick(): void {
    let modal = this.modalService.open(ImageModalComponent, { ariaLabelledBy: "image-modal-title", size: "xl", scrollable: true });
    modal.componentInstance.mediumImage = this.mediumSource;
    modal.componentInstance.imageTitle = this.imageTitle;

    modal.result.then((val) => {
      console.log(val);
    },
    (reason) => {
      console.log(reason);
    });
  }
}
