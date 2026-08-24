import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

const ALL_INDUSTRIES_OPTION = { label: 'Todas las industrias', value: 'ALL' };
const DEFAULT_ERROR_MESSAGE = 'Ocurrió un problema al cargar las cuentas.';

export default class AccountExplorer extends LightningElement {
    accounts = [];
    searchKey = '';
    selectedIndustry = ALL_INDUSTRIES_OPTION.value;
    sortDirection = 'asc';
    isLoading = true;
    errorMessage = '';

    @wire(getAccounts)
    wiredAccounts({ data, error }) {
        this.isLoading = false;

        if (data) {
            this.accounts = data.map((account) => ({
                ...account,
                IndustryDisplay: account.Industry || 'Sin industria',
                PhoneDisplay: account.Phone || 'Sin teléfono'
            }));
            this.errorMessage = '';
            return;
        }

        if (error) {
            this.accounts = [];
            this.errorMessage = this.reduceError(error);
        }
    }

    get industryOptions() {
        const industries = [...new Set(
            this.accounts
                .map((account) => account.Industry)
                .filter((industry) => Boolean(industry))
        )].sort((left, right) => left.localeCompare(right));

        return [
            ALL_INDUSTRIES_OPTION,
            ...industries.map((industry) => ({ label: industry, value: industry }))
        ];
    }

    get filteredAccounts() {
        const normalizedSearch = this.searchKey.trim().toLowerCase();
        const matchesIndustry = (account) => this.selectedIndustry === ALL_INDUSTRIES_OPTION.value
            || account.Industry === this.selectedIndustry;
        const matchesSearch = (account) => account.Name.toLowerCase().includes(normalizedSearch);

        const filtered = this.accounts.filter((account) => matchesIndustry(account) && matchesSearch(account));
        const direction = this.sortDirection === 'asc' ? 1 : -1;

        return [...filtered].sort((left, right) => direction * left.Name.localeCompare(right.Name));
    }

    get sortButtonLabel() {
        return this.sortDirection === 'asc' ? 'Orden: Ascendente' : 'Orden: Descendente';
    }

    get hasAccounts() {
        return this.filteredAccounts.length > 0;
    }

    get hasError() {
        return Boolean(this.errorMessage);
    }

    get showEmptyState() {
        return !this.isLoading && !this.hasError && this.filteredAccounts.length === 0;
    }

    handleSearchChange(event) {
        this.searchKey = event.target.value;
    }

    handleIndustryChange(event) {
        this.selectedIndustry = event.detail.value;
    }

    handleSortToggle() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    reduceError(error) {
        if (Array.isArray(error?.body)) {
            return error.body.map((issue) => issue.message).join(', ');
        }

        return error?.body?.message || error?.message || DEFAULT_ERROR_MESSAGE;
    }
}
