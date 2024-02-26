import { browser } from 'k6/experimental/browser';
import { sleep } from 'k6';
import faker from 'https://cdn.jsdelivr.net/npm/faker@5.5.3/dist/faker.min.js'
import { Counter } from 'k6/metrics';

// THIS IS ACTUALLY WORKING DON'T FUCK IT UP!!!

// Counter for completed transactions
//let completedTransactions = new Counter('completed_transactions');

export const options = {
  scenarios: {
    constant_load: {
      executor: 'shared-iterations',
      vus: 20, // Number of VUs to distribute the iterations
      iterations: 500, // Total number of iterations to be completed by all VUs
      maxDuration: '30m', // Maximum duration of the test
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
    //page.screenshot({ path: 'screenshots/01_homepage.png' });

    context.clearCookies()

    sleep(2);

    // 02. View products
    const element2 = page.locator(
      'li.product.type-product.post-27.status-publish.first.instock.product_cat-music.has-post-thumbnail.downloadable.virtual.purchasable.product-type-simple'
    );
    await element2.click();

    page.waitForSelector('//*[@id="product-27"]/div[2]/form/button');

    sleep(3);

    //page.screenshot({ path: 'screenshots/02_view-product.png' });

    sleep(2);

    // 03. Add item to cart

    const element3 = page.locator(
      '//*[@id="product-27"]/div[2]/form/button'
    );

    await element3.click();

    //page.waitForSelector('div.wc-block-components-notice-banner.is-success')

    sleep(3);

    //page.screenshot({ path: 'screenshots/03_product-added.png' });

    // 04. View cart

    //const element4 = page.locator(
      //'a.button.wc-forward'
    //);
    await page.goto('https://gprocket.com/cart');

    sleep(3);

    page.waitForSelector('span.wc-block-components-button__text')

    //page.screenshot({ path: 'screenshots/04_view-cart.png' });

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

    //page.locator("input[id='select2-billing_country-container']").type(fields.billing_country);

    //const options = page.locator("span[id='select2-billing_country-container.select2-selection__rendered']");
    //options.selectOption(fields.billing_country);

    //sleep(3); SKIPPING COUNTRY DROP DOWN

    page.locator("input[name='billing_city']").type(fields.billing_city);

    sleep(2);

    //page.locator("input[id='select2-billing_state-container']").type(fields.billing_state);

    //const options2 = page.locator("span[id='select2-billing_state-container']");
    //options.selectOption(fields.billing_state);

    //sleep(3); SKIPPING STATE DROPDOWN

    page.locator("input[name='billing_postcode']").type(fields.billing_postcode);

    sleep(2);

    page.locator("input[name='billing_phone']").type(fields.billing_phone);

    sleep(2);

    page.locator("input[name='billing_email']").type(fields.billing_email);

    sleep(3);

    //page.screenshot({ path: 'screenshots/06_data-inputs.png' });

// 07. Click Checkout

    const element7 = page.locator('button#place_order.button.alt');

    await element7.click();

    //page.screenshot({ path: 'screenshots/07_checking-out.png' });

    //page.waitForSelector('p.woocommerce-notice.woocommerce-notice--success.woocommerce-thankyou-order-received"')

    sleep(3);

    //page.screenshot({ path: 'screenshots/08_order-complete.png' });

  } finally {
    page.close();
  }
}
