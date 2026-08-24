/**
 * Provides account data for Lightning components.
 */
public with sharing class AccountController {
    private static final String GENERIC_ERROR_MESSAGE = 'No fue posible obtener las cuentas en este momento.';

    /**
     * Returns account records for the explorer component.
     *
     * @return A list of Account records ordered by name.
     * @throws AuraHandledException When the account query cannot be completed.
     * @example
     * List<Account> accounts = AccountController.getAccounts();
     */
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        try {
            // Query only the fields required by the UI and respect user permissions.
            return [
                SELECT Id, Name, Industry, Phone
                FROM Account
                WHERE Name != null
                WITH USER_MODE
                ORDER BY Name ASC
            ];
        } catch (Exception e) {
            // Return a safe message to the client without exposing internal details.
            throw new AuraHandledException(GENERIC_ERROR_MESSAGE);
        }
    }
}
