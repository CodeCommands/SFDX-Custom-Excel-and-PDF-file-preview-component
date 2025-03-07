import { LightningElement, api } from 'lwc';

export default class ImagePreviewModal extends LightningElement {
    @api imageUrl;
    @api imageTitle;

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}