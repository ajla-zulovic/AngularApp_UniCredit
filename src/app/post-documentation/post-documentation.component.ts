 
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PDFDocumentProxy, getDocument, GlobalWorkerOptions } from 'pdfjs-dist';


GlobalWorkerOptions.workerSrc = 'assets/pdfjs-dist/build/pdf.worker.mjs';

@Component({
  selector: 'app-post-documentation',
  templateUrl: './post-documentation.component.html',
  styleUrls: ['./post-documentation.component.css']
})
export class PostDocumentationComponent {
  @ViewChild('pdfCanvas', { static: false }) pdfCanvas!: ElementRef<HTMLCanvasElement>;

  selectedFile: File | null = null;
  pdf: PDFDocumentProxy | null = null;
  currentPage: number = 1;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      if (this.selectedFile.type !== 'application/pdf') {
        console.error('Odabrani fajl nije PDF.');
        return;
      }

      console.log('Odabran PDF: ', this.selectedFile.name);
      this.renderPdfOnCanvas(this.selectedFile);
    }
  }

  async renderPdfOnCanvas(file: File): Promise<void> {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
      this.pdf = await getDocument(typedArray).promise;

      console.log('PDF učitan: ', this.pdf);
      this.currentPage = 1; 
      await this.renderPage(this.currentPage);
    };

    fileReader.readAsArrayBuffer(file);
  }


  async renderPage(pageNumber: number): Promise<void> {
    if (!this.pdf) return; 

    const canvas = this.pdfCanvas.nativeElement;
    const context = canvas.getContext('2d');

    const page = await this.pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context!,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    console.log(`Stranica ${pageNumber} prikazana.`);
  }

  captureCoordinates(event: MouseEvent): void {
    const canvas = this.pdfCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
  
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    
    const currentDate = new Date();
    const timestamp = currentDate.toLocaleString(); 
  
    console.log(`Klik na stranici ${this.currentPage} - Koordinate: X: ${x}, Y: ${y},
       Timestamp: ${timestamp}`);
  
    const context = canvas.getContext('2d');
    if (context) {
      
      context.beginPath();
      context.arc(x, y, 5, 0, Math.PI * 2, true);
      context.fillStyle = 'red';
      context.fill();

      
      context.font = '12px Arial';
      context.fillStyle = 'black'
      context.fillText(timestamp, x + 10, y);
    }
  }
  
  
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage(this.currentPage);
    }
  }
  
  goToNextPage(): void {
    if (this.pdf && this.currentPage < this.pdf.numPages) {
      this.currentPage++;
      this.renderPage(this.currentPage);
    }
  }
  
  clearCanvasPoint(): void {
    const canvas = this.pdfCanvas.nativeElement;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.renderPage(this.currentPage);
    }
  }
  
}
