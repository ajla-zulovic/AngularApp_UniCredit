package ba.unicredit.pdf.Model;


import java.math.BigDecimal;

public class SignaturePoint {

    private BigDecimal x;
    private BigDecimal y;
    private int pageNumber;

    // Getteri i setteri
    public BigDecimal getX() {
        return x;
    }

    public void setX(BigDecimal x) {
        this.x = x;
    }

    public BigDecimal getY() {
        return y;
    }

    public void setY(BigDecimal y) {
        this.y = y;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }
}

