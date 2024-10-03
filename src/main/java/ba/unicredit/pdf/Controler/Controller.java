package ba.unicredit.pdf.Controler;


import ba.unicredit.pdf.Model.SignaturePoint;
import ba.unicredit.pdf.impl.PdfEditor;
import ba.unicredit.pdf.Model.SignatureRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class Controller {



    @PostMapping("/upload-pdf")
    public ResponseEntity<String> uploadPdf(@RequestBody SignatureRequest request) {
        try {
            // Inicijalizuj PdfEditor sa base64 PDF-om
            PdfEditor pdfEditor = new PdfEditor(request.getDocumentBase64());

            String formattedDate = new SimpleDateFormat("dd.MM.yyyy").format(new Date());

            // Definiši dimenzije stranice
            float pageWidth = 600;
            float pageHeight = 800;

            for (SignaturePoint point : request.getSignaturePoints()) {

                float originalX = point.getX().floatValue();
                float originalY = point.getY().floatValue();

                // Preokrenuta y koordinata
                float adjustedX = originalX;
                float adjustedY = pageHeight - originalY;

                // Proveri da li su koordinate validne
                if (adjustedX < 0 || adjustedX > pageWidth || adjustedY < 0 || adjustedY > pageHeight) {
                    return ResponseEntity.badRequest().body("Invalid coordinates for page: " + point.getPageNumber());
                }


                pdfEditor.addTextToPdf(point.getPageNumber(), adjustedX, adjustedY, "Your Signature Text Here");


                float rectX = adjustedX;
                float rectY = adjustedY + 10;
                float rectWidth = 200;
                float rectHeight = 30;


                pdfEditor.drawRectangle(point.getPageNumber(), rectX, rectY, rectWidth, rectHeight);


                pdfEditor.addTextToPdf(point.getPageNumber(), rectX + 5, rectY + 10, formattedDate); // +5 i +10 da se tekst ne dodiruje ivice
            }


            String modifiedPdfBase64 = pdfEditor.encodePdfToBase64();
            return ResponseEntity.ok(modifiedPdfBase64);
        } catch (Exception e) {
            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR).body("Greška prilikom obrade PDF-a: " + e.getMessage());
        }
    }


}
