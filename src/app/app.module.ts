import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { PreviewComponent } from './preview/preview.component';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PostDocumentationComponent } from './post-documentation/post-documentation.component';

const routes:Routes=[
   { path: '', component: EditorComponent },
  { path: 'preview', component: PreviewComponent },
  {path:'post',component:PostDocumentationComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    PreviewComponent,
    PostDocumentationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(routes),
    CKEditorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
