
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editor } from '@ckeditor/ckeditor5-core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  public Editor = ClassicEditor;
  public htmlContent: string = '';
  private editorInstance: Editor | undefined;

  public editorConfig = {
    toolbar: [
      'bold', 'italic', 'link', 'undo', 'redo', 'insertTable', 'heading',
      'bulletedList', 'numberedList', 'blockQuote', 'alignment', 'highlight',
      'fontColor', 'fontSize', 'mediaEmbed', 'imageUpload'
    ],
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    }
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onEditorReady(editor: Editor) {
    this.editorInstance = editor;
  }

  addPlaceholder(placeholder: string) {
    if (this.editorInstance) {
      const editor = this.editorInstance;
      editor.model.change(writer => {
        const selection = editor.model.document.selection;
        const position = selection.getFirstPosition();
  
      
        if (position) {
          writer.insertText(placeholder, position);
   
          const newPosition = position.getShiftedBy(placeholder.length);
          writer.setSelection(newPosition);
        } else {
          console.warn('Nema validne pozicije za umetanje.');
        }
      });
    }
  }
  
  user = {
    ime: 'Ajla',
    email: 'ajla@example.com',
    grad: 'Mostar'
  };
  goToPreview() {
    if (this.editorInstance) {
      const editor = this.editorInstance;
      let content = editor.getData();
  
      
      const placeholders = {
        '@ime': this.user.ime,
        '@email': this.user.email,
        '@grad': this.user.grad
      };
  
      for (const [placeholder, value] of Object.entries(placeholders)) {
        const regex = new RegExp(placeholder, 'g'); 
        content = content.replace(regex, value);   
      }
  
      
      this.htmlContent = content;
  
      
      this.router.navigate(['/preview'], { queryParams: { content: this.htmlContent } });
    }
  }

  showPdfSignComponent = false;

  openSignPdf(): void {
    this.showPdfSignComponent = true;
  }
  
}
