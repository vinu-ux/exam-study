import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CanvasaddeditComponent } from './canvasaddedit/canvasaddedit.component';
import { CanvaslistComponent } from './canvaslist/canvaslist.component';
import { CatagoryComponent } from './catagory/catagory.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasaddeditComponent,
    CanvaslistComponent,
    CatagoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
