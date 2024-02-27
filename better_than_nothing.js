import { browser } from 'k6/experimental/browser';
import { sleep } from 'k6';
import faker from 'https://cdn.jsdelivr.net/npm/faker@5.5.3/dist/faker.min.js'
import { Counter } from 'k6/metrics';

// Counter for completed transactions
//let completedTransactions = new Counter('completed_transactions');

export const options = {
  scenarios: {
    constant_load: {
      executor: 'shared-iterations',
      vus: 20, // Number of VUs to distribute the iterations
      iterations: 400, // Total number of iterations to be completed by all VUs
      maxDuration: '10m', // Maximum duration of the test
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
};



export default async function () {
  const context = browser.newContext();
  const page = context.newPage();

  // 01. Go to the homepage
  try {
    await page.goto('https://14900k.gprocket.com');

    page.waitForSelector('li.product.type-product.post-27.status-publish.first.instock.product_cat-music.has-post-thumbnail.downloadable.virtual.purchasable.product-type-simple');

    page.screenshot({ path: 'screenshots/01_homepage.png' });

    context.clearCookies()

    sleep(2);

    // 02. View products
    const element2 = page.locator(
      'li.product.type-product.post-27.status-publish.first.instock.product_cat-music.has-post-thumbnail.downloadable.virtual.purchasable.product-type-simple'
    );
    await element2.click();

    page.waitForSelector('//*[@id="product-27"]/div[2]/form/button');

    sleep(3);

    page.screenshot({ path: 'screenshots/02_view-product.png' });

    sleep(1);

    // 03. Add item to cart

    const element3 = page.locator(
      '//*[@id="product-27"]/div[2]/form/button'
    );

    await element3.click();

    //page.waitForSelector('div.wc-block-components-notice-banner.is-success')

    sleep(1);

    page.screenshot({ path: 'screenshots/03_product-added.png' });

    // 04. View cart

    //const element4 = page.locator(
      //'a.button.wc-forward'
    //);
    await page.goto('https://14900k.gprocket.com/cart/');

    sleep(1);

    page.waitForSelector('span.wc-block-components-button__text')

    page.screenshot({ path: 'screenshots/04_view-cart.png' });

    sleep(2);

    // 05. Billing details

    const element5 = page.locator(
      'span.wc-block-components-button__text'
    );
    await element5.click();

    sleep(2);

    page.waitForSelector('div.woocommerce-billing-fields')

    //page.screenshot({ path: 'screenshots/05_billing-fields.png' });

    sleep(3);

    // 06. Enter customer data

    const fields = {
        billing_first_name: faker.name.firstName(),
        billing_last_name: faker.name.lastName(),
        billing_country: 'US',
        billing_state: faker.address.stateAbbr(),
        billing_address_1: faker.address.streetAddress(),
        billing_city: faker.address.city(),
        billing_postcode: faker.address.zipCodeByState('DE'),
        billing_phone: faker.phone.phoneNumberFormat(),
        billing_email: faker.internet.exampleEmail(),
    }

    //page.locator('input[name=billing-first_name').type(fields.billing_first_name); NOPE

    page.locator("input[name='billing_first_name']").type(fields.billing_first_name);

    sleep(2);

    page.locator("input[name='billing_last_name']").type(fields.billing_last_name);

    sleep(2);

    page.locator("input[name='billing_address_1']").type(fields.billing_address_1);

    sleep(2);

    //sleep(3); SKIPPING COUNTRY DROP DOWN

    page.locator("input[name='billing_city']").type(fields.billing_city);

    sleep(1);

    //sleep(3); SKIPPING STATE DROPDOWN

    page.locator("input[name='billing_postcode']").type(fields.billing_postcode);

    sleep(1);

    page.locator("input[name='billing_phone']").type(fields.billing_phone);

    sleep(1);

    page.locator("input[name='billing_email']").type(fields.billing_email);

    page.screenshot({ path: 'screenshots/05_billing-done-maybe.png' });

    // Switch to the iframe for the credit card number field

    // NOOOOOO page.locator("iframe#braintree-hosted-field-number.input[name='credit-card-number']").type("4111 1111 1111 1111");

    sleep(2);

    // Define the place order element BEFORE switching contexts to the iframes
    const element7 = page.locator('button[name*="woocommerce_checkout_place_order"]');

    sleep(1);

    const iframeHandle = page.waitForSelector('iframe[id*="braintree-hosted-field-number"]');
    const frame = iframeHandle.contentFrame();
    const field1 = frame.waitForSelector("input[name='credit-card-number']");
    await field1.type("4111 1111 1111 1111");

    page.screenshot({ path: 'screenshots/06_cc-number-correct-maybe.png' });

    sleep(2);

    const iframeHandle2 = page.waitForSelector('iframe[id*="braintree-hosted-field-expirationDate"]');
    const frame2 = iframeHandle2.contentFrame();
    const field2 = frame2.waitForSelector("input[name='expiration']");
    await field2.type("12/25");

    sleep(2);

    page.screenshot({ path: 'screenshots/07_cc-number-correct-maybe.png' });

    sleep(3);

// 07. Click Checkout

    await element7.click();

    page.screenshot({ path: 'screenshots/08_checking-out.png' });

    sleep(3);

    // Try this...

    // Press Tab twice
    //await page.keyboard.press('Tab');

    //sleep(1);

    //page.screenshot({ path: 'screenshots/TAB_test1.png' });

    //await page.keyboard.press('Tab');

    //sleep(1);

    //page.screenshot({ path: 'screenshots/TAB_test1.png' });

    // Press Enter
    //await page.keyboard.press('Enter');

    page.screenshot({ path: 'screenshots/09_checked-out-maybe.png' });

    sleep(1);

    await page.waitForSelector('div.woocommerce-order')

    sleep(3);

    page.screenshot({ path: 'screenshots/10_order-complete-maybe.png' });

    sleep(3);

  } finally {
    page.close();
  }
}
