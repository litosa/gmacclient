import { GetMeAColleaguePage } from './app.po';

describe('get-me-a-colleague App', function() {
  let page: GetMeAColleaguePage;

  beforeEach(() => {
    page = new GetMeAColleaguePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
