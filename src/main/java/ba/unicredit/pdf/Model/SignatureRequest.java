package ba.unicredit.pdf.Model;

import java.util.List;

public class SignatureRequest {
    private String documentBase64;  // B64 format PDF-a
    private List<SignaturePoint> signaturePoints;  // Niz sa informacijama o potpisima
    private List<Integer> pageNumbers;  // Niz stranica na kojima se nalaze potpisi

    // Getteri i setteri
    public String getDocumentBase64() {
        return documentBase64;
    }

    public void setDocumentBase64(String documentBase64) {
        this.documentBase64 = documentBase64;
    }

    public List<SignaturePoint> getSignaturePoints() {
        return signaturePoints;
    }

    public void setSignaturePoints(List<SignaturePoint> signaturePoints) {
        this.signaturePoints = signaturePoints;
    }

    public List<Integer> getPageNumbers() {
        return pageNumbers;
    }

    public void setPageNumbers(List<Integer> pageNumbers) {
        this.pageNumbers = pageNumbers;
    }
}
