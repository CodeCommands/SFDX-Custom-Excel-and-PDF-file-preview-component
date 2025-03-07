import { LightningElement, api, track } from 'lwc';

export default class ExcelPreviewModal extends LightningElement {
    @track isExcelModalOpen = false;
    @track sheets = [];
    @track currentSheetIndex = 0;  // Track the active sheet
    workbook = null;

    @api openModal(workbook) {
        this.workbook = workbook;
        this.sheets = this.workbook.SheetNames.map((name, index) => ({ name, index }));
        this.isExcelModalOpen = true;
        this.renderSheet(0);
    }

    closeModal() {
        this.isExcelModalOpen = false;
    }

    handleSheetPreview(event) {
        const sheetIndex = event.target.dataset.index;
        this.renderSheet(sheetIndex);
    }

    renderSheet(sheetIndex) {
        this.currentSheetIndex = sheetIndex;  // Update the active sheet index
        const sheetName = this.workbook.SheetNames[sheetIndex];
        const worksheet = this.workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(worksheet, { editable: true });

        const style = `
            <style>
                table {
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 5px;
                }
                col {
                    width: 64px;
                }
            </style>
        `;

        const styledHtml = style + html;

        requestAnimationFrame(() => {
            const htmlContainer = this.template.querySelector('.html-content');
            if (htmlContainer) {
                htmlContainer.innerHTML = styledHtml;
            }
        });
    }

    get sheetButtons() {
        return this.sheets.map((sheet, index) => ({
            ...sheet,
            class: index == this.currentSheetIndex ? 'slds-button slds-button_brand' : 'slds-button slds-button_outline-brand'
        }));
    }
}