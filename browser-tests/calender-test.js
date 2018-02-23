const puppeteer = require('puppeteer');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();


describe('Tests for calendar page', async function() {
  let browser;
  let page;
  beforeEach(async() => {
    browser = await puppeteer.launch({headless: true});
    page =  await browser.newPage();
    try {
      await page.goto('http://localhost:3000/', {waitUntil: 'networkidle2'});
    } catch (e) {
      console.log(e.message);
      process.exit(1);
    }
  });

  describe('Tests for the behaviours on calendar page', function() {
    this.timeout(10000);
    this.retries(3);
    // Add your test cases here, refer https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md on how to write tests
    it('should contain a previous week button with id equal to prevButton', async() => {
      await page.$('#prevButton').should.eventually.not.equal(null);
    });
    it('should contain a next week button with id equal to nextButton', async() => {
      await page.$('#nextButton').should.eventually.not.equal(null);
    });
    it('should contain heading section with appropriate heading', async() => {
      const heading = await page.$eval('h1', h1 => h1.innerText);
      heading.should.equal('Your schedule for the week');
    });
    it('should contain a calendar with id equal to calendar-id', async() => {
      await page.$('#calendar-id').should.eventually.not.equal(null);
    });
  });
  await page.close();
  await browser.close();
});
