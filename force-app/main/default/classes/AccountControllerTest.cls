@IsTest
private class AccountControllerTest {
    @TestSetup
    static void setupTestData() {
        insert new List<Account>{
            new Account(Name = 'Beta Corp', Industry = 'Technology', Phone = '555-0102'),
            new Account(Name = 'Acme Corp', Industry = 'Finance', Phone = '555-0101'),
            new Account(Name = 'Zenith LLC', Industry = 'Technology', Phone = '555-0103')
        };
    }

    @IsTest
    static void shouldReturnAccountsOrderedByNameWhenAccountsExist() {
        User runningUser = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];

        System.runAs(runningUser) {
            Test.startTest();
            List<Account> results = AccountController.getAccounts();
            Test.stopTest();

            Assert.areEqual(3, results.size(), 'The controller should return all test accounts.');
            Assert.areEqual('Acme Corp', results[0].Name, 'Accounts should be sorted ascending by name.');
            Assert.areEqual('Beta Corp', results[1].Name, 'Accounts should be sorted ascending by name.');
            Assert.areEqual('Zenith LLC', results[2].Name, 'Accounts should be sorted ascending by name.');
            Assert.areEqual('Finance', results[0].Industry, 'The Industry field should be queried.');
            Assert.areEqual('555-0101', results[0].Phone, 'The Phone field should be queried.');
        }
    }

    @IsTest
    static void shouldReturnEmptyListWhenNoAccountsExist() {
        delete [SELECT Id FROM Account];
        User runningUser = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];

        System.runAs(runningUser) {
            Test.startTest();
            List<Account> results = AccountController.getAccounts();
            Test.stopTest();

            Assert.areEqual(0, results.size(), 'The controller should return an empty list when no accounts exist.');
        }
    }
}
