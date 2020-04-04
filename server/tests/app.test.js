const expect = require('expect');
const config = require('../config');

describe('general tests', () => {

  it('config file', () => {
    expect(config).toBeTruthy();
  });

});
