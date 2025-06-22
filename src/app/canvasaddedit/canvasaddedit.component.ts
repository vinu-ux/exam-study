import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fabric } from 'fabric';
import { enviroment } from 'src/enviornment';

@Component({
  selector: 'app-canvasaddedit',
  templateUrl: './canvasaddedit.component.html',
  styleUrls: ['./canvasaddedit.component.scss']
})
export class CanvasaddeditComponent implements AfterViewInit {
  @ViewChild('htmlCanvas', { static: true }) htmlCanvas!: ElementRef<HTMLCanvasElement>;
  canvas!: fabric.Canvas;
  backgroundImgObj: fabric.Image | null = null;
  canvasName: any = '';

  // For input field
  showInput = false;
  inputLeft = 0;
  inputTop = 0;
  inputComment = '';
  inputHeader = '';
  currentMarker: fabric.Circle | null = null;

  // For tooltip
  showTooltip = false;
  tooltipLeft = 0;
  tooltipTop = 0;
  tooltipHeader = '';
  tooltipComment = '';
  tooltipMarker: fabric.Circle | null = null;

  dataId!: any;
  popupTimeout: any;
  ts = 3000;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.htmlCanvas.nativeElement, {
      selection: false,
      hoverCursor: 'pointer'
    });
    this.canvas.setWidth(800);
    this.canvas.setHeight(600);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.dataId = id;
        this.loadFromApi();
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.setBackgroundImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  setBackgroundImage(url: string) {
    fabric.Image.fromURL(url, (img) => {
      this.canvas.clear();
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: true,
        scaleX: this.canvas.getWidth() / img.width!,
        scaleY: this.canvas.getHeight() / img.height!
      });
      this.backgroundImgObj = img;
      this.canvas.add(img);
      this.canvas.sendToBack(img);

      // Listen for clicks on the canvas (for marker placement)
      this.canvas.off('mouse:down');
      this.canvas.on('mouse:down', (opt: any) => {
        if (opt.target === img) {
          const pointer = this.canvas.getPointer(opt.e);
          this.addMarker(pointer.x, pointer.y);
        }
      });
    });
  }

  addMarker(x: number, y: number) {
    const marker = new fabric.Circle({
      left: x - 10,
      top: y - 10,
      radius: 10,
      fill: 'red',
      selectable: false,
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'pointer'
    });

    (marker as any).header = '';
    (marker as any).comment = '';

    marker.on('mouseover', () => {
      this.showTooltipWithDelay(
        (marker as any).header || '',
        (marker as any).comment || '',
        marker.left! + 25,
        marker.top! - 10,
        marker
      );
    });

    marker.on('mouseout', () => {
      // Tooltip will auto-close after 3 seconds, so nothing needed here
    });

    this.canvas.add(marker);
    this.canvas.renderAll();

    // Show form immediately for new marker
    this.inputLeft = marker.left! + 25;
    this.inputTop = marker.top! - 10;
    this.inputHeader = '';
    this.inputComment = '';
    this.currentMarker = marker;
    this.showInput = true;
    this.showTooltip = false;
  }

  submitComment() {
    if (this.currentMarker) {
      (this.currentMarker as any).header = this.inputHeader;
      (this.currentMarker as any).comment = this.inputComment;
      // After save, show tooltip and hide form
      this.showTooltipWithDelay(
        this.inputHeader,
        this.inputComment,
        this.currentMarker.left! + 25,
        this.currentMarker.top! - 10,
        this.currentMarker
      );
      this.showInput = false;
      this.currentMarker = null;
      this.inputHeader = '';
      this.inputComment = '';
    }
  }

  removeCurrentMarker() {
    if (this.currentMarker) {
      this.canvas.remove(this.currentMarker);
      this.showInput = false;
      this.currentMarker = null;
      this.inputHeader = '';
      this.inputComment = '';
      this.canvas.renderAll();
    }
  }

  showTooltipWithDelay(header: string, comment: string, left: number, top: number, marker: fabric.Circle) {
    this.tooltipHeader = header;
    this.tooltipComment = comment;
    this.tooltipLeft = left;
    this.tooltipTop = top;
    this.tooltipMarker = marker;
    this.showTooltip = true;

    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
    }
    this.popupTimeout = setTimeout(() => {
      this.showTooltip = false;
      this.tooltipMarker = null;
    }, this.ts); // 3 seconds
  }

  loadFromApi() {
    this.http.get<any>(enviroment.apiUrl + `/api/canvas/${this.dataId}/`).subscribe(data => {
      this.canvasName = data?.name
      this.setBackgroundImage(data.image);
      // Wait for image to load before adding markers
      setTimeout(() => {
        data.markers.forEach((m: any) => {
          this.addMarker(m.x, m.y);
          // Set header/comment for the last marker
          const marker = this.canvas.getObjects('circle').slice(-1)[0] as any;
          marker.header = m.header;
          marker.comment = m.comment;
        });
        this.showInput = false
        this.canvas.renderAll();
      }, 500);
    });
  }

  editCurrentTooltipMarker() {
    if (this.tooltipMarker) {
      this.inputLeft = this.tooltipMarker.left! + 25;
      this.inputTop = this.tooltipMarker.top! - 10;
      this.inputHeader = (this.tooltipMarker as any).header || '';
      this.inputComment = (this.tooltipMarker as any).comment || '';
      this.currentMarker = this.tooltipMarker;
      this.showInput = true;
      this.showTooltip = false;
    }
  }

  deleteCurrentTooltipMarker() {
    if (this.tooltipMarker) {
      this.canvas.remove(this.tooltipMarker);
      this.showTooltip = false;
      this.tooltipMarker = null;
      this.canvas.renderAll();
    }
  }

  getCanvasData() {
    const imageUrl =
      (this.backgroundImgObj as any)?.toDataURL?.() ||
      (this.backgroundImgObj as any)?.getSrc?.() ||
      '';

    const markers = this.canvas.getObjects('circle').map((marker: any) => ({
      x: marker.left + marker.radius,
      y: marker.top + marker.radius,
      header: marker.header,
      comment: marker.comment
    }));

    return {
      image: imageUrl,
      markers
    };
  }

  saveToApi() {
    let data: any = this.getCanvasData();
    data['name'] = this.canvasName;
    data['type'] = localStorage.getItem('canvasType')

    if (this.dataId) {
      // Update existing canvas
      this.http.put(enviroment.apiUrl + '/api/canvas/' + this.dataId + '/', data).subscribe(res => {
        this.router.navigate(['/canvas-list', data['type']]);
      });
    } else {
      // Create new canvas
      this.http.post(enviroment.apiUrl + '/api/canvas/', data).subscribe(res => {
        this.router.navigate(['/canvas-list', data['type']]);
      });
    }
  }
}
