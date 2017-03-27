import { NgFacetrackerPage } from './app.po';

describe('ng-facetracker App', () => {
  let page: NgFacetrackerPage;

  beforeEach(() => {
    page = new NgFacetrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
