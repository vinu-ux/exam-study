import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/enviornment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-canvaslist',
  templateUrl: './canvaslist.component.html',
  styleUrls: ['./canvaslist.component.scss']
})
export class CanvaslistComponent implements OnInit {
  canvases: any[] = [];
  path: any;

  constructor(private http: HttpClient, private route: ActivatedRoute,) {
  }

  // ngOnDestroy(): void {
  //   localStorage.clear()
  // }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      const path = params.get('path');
      if (path) {
        this.path = path;
        localStorage.setItem('canvasType', this.path)
      }
    });
    this.getCanvasList();
  }

  getCanvasList() {
    this.http.get<any[]>(enviroment.apiUrl + '/api/canvas/').subscribe(data => {
      this.canvases = data.filter((e: any) => e.type == this.path)
    });
  }

  deleteCanvas(id: number) {
    if (confirm('Are you sure you want to delete this canvas?')) {
      this.http.delete(enviroment.apiUrl + '/api/canvas/' + id + '/').subscribe(() => {
        this.canvases = this.canvases.filter(c => c.id !== id);
      });
    }
  }
}
