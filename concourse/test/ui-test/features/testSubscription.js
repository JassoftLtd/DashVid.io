const assert = require('assert');

const userHelper = require('../helpers/userHelper')
const StripeTestCards = require('../../testData/stripeTestCards')

const Nav = require('../pages/nav.page');
const Account = require('../pages/account.page');
const Plans = require('../pages/plans.page');
const AddCard = require('../pages/addCard.page');

describe('Subscription', function () {

    describe('Upgrade / Downgrade', function () {

        it('Given I am a new User on a Free plan, When i upgrade and add my card details, Then i should be on a Standard plan', function () {

            // Given
            userHelper.getLoggedInUser()

            browser.click(Nav.accountButton)

            browser.waitForVisible(Account.pageContent, 5000);

            browser.waitForVisible(Account.currentPlan, 5000);

            expect(browser.getText(Account.currentPlan)).to.equal('Current Plan: free')

            // When
            browser.click(Plans.standardPlan)
            browser.waitForVisible(AddCard.pageContent, 60000)

            browser.setValue(AddCard.nameField, "Test Account")
            browser.setValue(AddCard.cardNumberField, StripeTestCards.visa.number)
            browser.setValue(AddCard.expirationField, '12/20')
            browser.setValue(AddCard.cvcField, '123')
            browser.click(AddCard.addCardButton)

            // Then
            browser.waitForVisible(Account.pageContent, 5000);

            browser.waitForVisible(Account.currentPlan, 5000);

            browser.pause(5000)
            browser.url('/account')

            browser.waitForVisible(Account.pageContent, 5000);

            browser.waitForVisible(Account.currentPlan, 5000);

            expect(browser.getText(Account.currentPlan)).to.equal('Current Plan: standard')

        });
    });

});
