const {
  convertTimestampToDate
} = require("../db/seeds/utils");

const{checkUserExists, checkArticleExists} = require('../utils.js')

describe.skip("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe.skip('checkUserExists', () => {
  test('checkUserExists returns if a user exists within the database', () => {
    const input = 'icellusedkars'
    const expected = {
    username: "icellusedkars",
    name: "sam",
    avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
    }
    return checkUserExists(input).then((actual) => {
    expect(actual).toEqual(expected)
  })
  })
  test('checkUserExists returns a created user if the username provided does not exist within the database', () => {
    const input = 'Ricketycricket'
    const expected = {
      username: 'Ricketycricket',
      name: 'Unknown',
      avatar_url: 'https://example.url/random.jpg'
    }
    return checkUserExists(input).then((actual) => {
      expect(actual).toEqual(expected)
    })
  })
})

describe.skip('checkArticleExists', () => {
  test('checkArticleExists resolves with no error if the article exists', () => {
    const input = 1;
    const expected = undefined;
    return checkArticleExists(input).then((actual) => {
      expect(actual).toBe(expected)
    })
  })
  test('checkArticlesExist rejets with 404 if the article does not exist', () => {
    const input = 505;
    const expected = {status:404, msg: 'Article ID 505 not found'}
    return checkArticleExists(input).catch((actual) => {
      expect(actual).toEqual(expected)
    })
  })
})

