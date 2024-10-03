

export interface SignatureRequest {
  documentBase64: string;    
  signaturePoints: SignaturePoint[];  
  pageNumbers: number[];       
}

export interface SignaturePoint {
  x: number;      
  y: number;   
  pageNumber: number; 
}
