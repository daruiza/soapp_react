export const ImgIconsType = {
    PDFicon: `${window.location.origin}/src/assets/PDFicon.png`,
    DOCicon: `${window.location.origin}/src/assets/doc.png`,
    EXCELicon: `${window.location.origin}/src/assets/excel.png`,
    ImageJPEGicon: `${window.location.origin}/src/assets/imagejpeg.png`,
    ImagePNGicon: `${window.location.origin}/src/assets/imagepng.png`,
    TextPlainicon: `${window.location.origin}/src/assets/textplainicon.png`,
    

    setSrcIcon(type) {
        switch (type) {
            case 'image/jpg':
                return this.ImageJPEGicon;
            case 'image/jpeg':
                return this.ImageJPEGicon;
            case 'image/png':
                return this.ImagePNGicon;
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return this.EXCELicon;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return this.DOCicon;
            case 'application/pdf':
                return this.PDFicon;
            case 'text/plain':
                return this.TextPlainicon;
            default: return this.PDFicon;;
        }
    }
}