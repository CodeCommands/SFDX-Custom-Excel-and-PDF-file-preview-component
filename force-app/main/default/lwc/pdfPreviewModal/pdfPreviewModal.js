import { LightningElement, api } from 'lwc';

export default class PdfPreviewModal extends LightningElement {
    @api modalTitle;
    @api pdfUrl;

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    get iframeSrc() {
        return `${this.pdfUrl}#toolbar=0`; // Appending #toolbar=0 to hide the toolbar in some PDF viewers
    }
}