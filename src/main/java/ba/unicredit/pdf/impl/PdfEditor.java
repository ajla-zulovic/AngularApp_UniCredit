package ba.unicredit.pdf.impl;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.*;
import java.util.Base64;
;

public class PdfEditor {

    private byte[] pdfBytes;

    public PdfEditor(String base64Pdf) throws IOException {
        this.pdfBytes = Base64.getDecoder().decode(base64Pdf);
    }


    public void addTextToPdf(int pageNumber, float x, float y, String text) throws IOException {
        try (PDDocument document = PDDocument.load(new ByteArrayInputStream(pdfBytes))) {

            PDPage page = document.getPage(pageNumber - 1);


            PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true);


            contentStream.setFont(PDType1Font.TIMES_BOLD, 12);


            contentStream.beginText();
            contentStream.newLineAtOffset(x, y);
            contentStream.showText(text);
            contentStream.endText();


            contentStream.close();


            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);


            this.pdfBytes = outputStream.toByteArray();
        }
    }


    public String encodePdfToBase64() {
        return Base64.getEncoder().encodeToString(pdfBytes);
    }

    public void drawRectangle(int pageNumber, float x, float y, float width, float height) throws IOException {
        try (PDDocument document = PDDocument.load(new ByteArrayInputStream(pdfBytes))) {
            PDPage page = document.getPage(pageNumber - 1);
            PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true);


            contentStream.setNonStrokingColor(255, 255, 255);
            contentStream.addRect(x, y - height, width, height);
            contentStream.fill();

            contentStream.setStrokingColor(0, 0, 0);
            contentStream.addRect(x, y - height, width, height);
            contentStream.stroke();

            contentStream.close();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            this.pdfBytes = outputStream.toByteArray();
        }
    }



    public static void main(String[] args) {
        try {
            String base64Pdf = "...";

            PdfEditor pdfEditor = new PdfEditor(base64Pdf);

            pdfEditor.addTextToPdf(1, 100, 150, "Hello, PDF!");

            String newBase64Pdf = pdfEditor.encodePdfToBase64();
            System.out.println("Modified Base64 PDF: " + newBase64Pdf);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
