import { HttpClient } from '@angular/common/http'; 
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PDFDocumentProxy, getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { SignatureRequest, SignaturePoint } from '../PdfModel'; 

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
  x: number = 0;
  y: number = 0;
  brojStranica: number = 0; 

  originalWidth: number = 0; 
  originalHeight: number = 0; 
  scaleX: number = 1;  
  scaleY: number = 1;  
  signaturePoints: { [pageNumber: number]: SignaturePoint[] } = {}; 


  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];

        if (this.selectedFile.type !== 'application/pdf') {
            console.error('Odabrani fajl nije PDF.');
            return;
        }

        console.log('Odabran PDF: ', this.selectedFile.name);
        
        // ukoliko ucitavam novi dokument da se stare tacke pobrisu 
        this.signaturePoints = []; 
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


  

  async renderPage(brojStranica: number): Promise<void> {
    if (!this.pdf) return; 

    const canvas = this.pdfCanvas.nativeElement;
    const context = canvas.getContext('2d');

    const page = await this.pdf.getPage(brojStranica);
    const viewport = page.getViewport({ scale: 1.5 }); 

    this.originalWidth = viewport.width / 1.5;  
    this.originalHeight = viewport.height / 1.5;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context!,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    console.log(`Stranica ${brojStranica} prikazana.`);

  
    this.drawSignaturePoints();
}


drawSignaturePoints(): void {
  const context = this.pdfCanvas.nativeElement.getContext('2d');
  if (!context) return;

  const pointsOnCurrentPage = this.signaturePoints[this.currentPage] || [];
  pointsOnCurrentPage.forEach(point => {
      context.beginPath();
      context.arc(point.x / this.scaleX, point.y / this.scaleY, 5, 0, Math.PI * 2, true);
      context.fillStyle = 'red';
      context.fill();

  
  });
}



captureCoordinates(event: MouseEvent): void {
  const canvas = this.pdfCanvas.nativeElement;
  const rect = canvas.getBoundingClientRect();

  this.scaleX = this.originalWidth / rect.width; 
  this.scaleY = this.originalHeight / rect.height; 

  this.x = (event.clientX - rect.left) * this.scaleX; 
  this.y = (event.clientY - rect.top) * this.scaleY; 

  if (this.x < 0 || this.x > this.originalWidth || this.y < 0 || this.y > this.originalHeight) {
      console.warn(`Klik izvan granica stranice: X: ${this.x}, Y: ${this.y}`);
      return; 
  }

  const currentPage = this.currentPage; 
  console.log(`Klik na stranici ${currentPage} - Koordinate: X: ${this.x}, Y: ${this.y}`);


  if (!this.signaturePoints[currentPage]) {
      this.signaturePoints[currentPage] = [];
  }
  const signaturePoint: SignaturePoint = { x: this.x, y: this.y, pageNumber: currentPage };
  this.signaturePoints[currentPage].push(signaturePoint); 
  console.log(`Koordinate za slanje: X: ${this.x}, Y: ${this.y}`);

  this.redrawCanvas();
}


 
onCanvasClick(event: MouseEvent): void {
  const canvas = this.pdfCanvas.nativeElement;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (!this.signaturePoints[this.currentPage]) {
      this.signaturePoints[this.currentPage] = [];
  }

  const newPoint = { x, y, pageNumber: this.currentPage };
  this.signaturePoints[this.currentPage].push(newPoint);
  
  console.log("Dodana tačka:", newPoint);
  console.log("Trenutne tačke:", this.signaturePoints); 

  this.redrawCanvas();
}


redrawCanvas(): void {
  const canvas = this.pdfCanvas.nativeElement;
  const context = canvas.getContext('2d');
  if (!this.pdf || !context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);


  this.renderPage(this.currentPage).then(() => {
    const pointsOnCurrentPage = this.signaturePoints[this.currentPage] || []; 

    pointsOnCurrentPage.forEach(point => {
    
      context.beginPath();
      context.arc(point.x / this.scaleX, point.y / this.scaleY, 5, 0, Math.PI * 2, true);
      context.fillStyle = 'red';
      context.fill();

    
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const rectX = point.x / this.scaleX;
      const rectY = point.y / this.scaleY + 10;
      const rectWidth = 200; 
      const rectHeight = 30;  


      context.beginPath();
      context.rect(rectX, rectY, rectWidth, rectHeight);
      context.strokeStyle = 'black';
      context.stroke();

      context.font = '12px Arial';
      context.fillStyle = 'black';
      context.fillText(formattedDate, rectX + 5, rectY + 20);
    });
  });
}


savePdfDocument(): void {
  if (!this.selectedFile) {
      console.error("Nije odabran PDF dokument za slanje.");
      return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(this.selectedFile);

  reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];

  
      const signatureRequest: SignatureRequest = {
          documentBase64: base64String,  
          signaturePoints: [],  
          pageNumbers: []  
   
      };

 
      for (const page in this.signaturePoints) {
          if (this.signaturePoints.hasOwnProperty(page)) {
              const points = this.signaturePoints[page];
              if (points.length > 0) {
                  signatureRequest.signaturePoints.push(...points);
                  signatureRequest.pageNumbers.push(Number(page)); 
              }
          }
      }


      this.http.post('http://localhost:8080/upload-pdf', signatureRequest, { responseType: 'text' })
          .subscribe({
              next: (response) => {
                  console.log("PDF uspješno poslan na backend.", response);

                  
                  const byteCharacters = atob(response);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], { type: 'application/pdf' });

                  const downloadLink = document.createElement('a');
                  downloadLink.href = window.URL.createObjectURL(blob);
                  downloadLink.download = 'new-dokument.pdf';
                  downloadLink.click();
              },
              error: (error) => {
                  console.error("Greška prilikom slanja PDF-a.", error);
              }
          });
  };
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
        this.signaturePoints[this.currentPage] = []; 
        this.renderPage(this.currentPage);
    }
}


}
