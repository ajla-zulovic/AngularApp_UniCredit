
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  editorContent: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => { 
      this.editorContent = params['content'] || '';
    });
  }
  @ViewChild('content', { static: false }) contentRef!: ElementRef;
  downloadPDF(): void {
    const element = document.createElement('div');
    element.innerHTML = this.editorContent;

    const options = {
      margin: 1,
      filename: 'preview-content.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }; 
    html2pdf().from(element).set(options).save();
  }
}
