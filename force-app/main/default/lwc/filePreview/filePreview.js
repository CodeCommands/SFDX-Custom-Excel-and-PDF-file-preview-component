import { LightningElement, api, wire, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { NavigationMixin } from 'lightning/navigation';
import SHEETJS from '@salesforce/resourceUrl/SheetJS';
import getVersionFiles from '@salesforce/apex/FileController.getVersionFiles';
import getFileContent from '@salesforce/apex/FileController.getFileContent';

export default class FilePreview extends NavigationMixin(LightningElement) {
    @api recordId;
    @track files = [];
    @track excelFiles = [];
    @track pdfFiles = [];
    @track showModal = false;
    @track modalTitle = '';
    @track pdfUrl = '';
    sheetJSLoaded = false;
    workbook = null;

    connectedCallback() {
        loadScript(this, SHEETJS)
            .then(() => {
                this.sheetJSLoaded = true;
                console.log('SheetJS library loaded');
            })
            .catch(error => {
                console.error('Error loading SheetJS: ', error);
            });
    }

    @wire(getVersionFiles, { recordId: '$recordId' })
    wiredFiles({ error, data }) {
        if (data) {
            this.files = data;
            this.excelFiles = data.filter(file => file.FileExtension && 
                ['xlsx', 'xls', 'csv'].includes(file.FileExtension.toLowerCase()));
            this.pdfFiles = data.filter(file => file.FileExtension && 
                file.FileExtension.toLowerCase() === 'pdf');
        } else if (error) {
            console.error('Error fetching files: ', error);
        }
    }

    handleFilePreview(event) {
        const fileId = event.target.dataset.id;
        const fileExtension = event.target.dataset.extension.toLowerCase();

        if (fileExtension === 'pdf') {
            this.previewPdf(fileId);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv') {
            this.previewExcel(fileId);
        }
    }

    previewPdf(fileId) {
        const file = this.pdfFiles.find(file => file.Id === fileId);
        if (file) {
            this.modalTitle = file.Title;
            console.log('ModalTitle ---', this.modalTitle);
            this.pdfUrl = file.VersionDataUrl;
            console.log('pdfURL ---', this.pdfUrl);
            //this.pdfUrl = `/sfc/servlet.shepherd/Version/download/${fileId}`;
            this.showModal = true;
        }
    }

    previewExcel(fileId) {
        getFileContent({ fileId })
            .then(result => {
                const binary = atob(result);
                this.workbook = XLSX.read(binary, { type: 'binary' });
                this.template.querySelector('c-excel-preview-modal').openModal(this.workbook);
            })
            .catch(error => {
                console.error('Error fetching file content: ', error);
            });
    }

    closeModal() {
        this.showModal = false;
    }

    closeImageModal() {
        this.showImageModal = false;
    }
}