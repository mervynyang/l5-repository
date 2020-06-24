import L5Repository from '../index';

test('wheres accepts two arguments', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository.where('status', 1);

  expect(
    query.toString(),
  ).toBe('search=status:1&searchFields=status:=&searchJoin=or');

  expect(
    query.toPairs(),
  ).toEqual({
    search: 'status:1',
    searchFields: 'status:=',
    searchJoin: 'or',
  })
})

test('wheres accepts three arguments', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository.where('name', 'like', 'hachi');

  expect(
    query.toString(),
  ).toBe('search=name:hachi&searchFields=name:like&searchJoin=or');

  expect(
    query.toPairs(),
  ).toEqual({
    search: 'name:hachi',
    searchFields: 'name:like',
    searchJoin: 'or',
  })
})

test('where with invalid operator', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository.where('name', 1, null);

  expect(
    query.toString(),
  ).toBe('search=name:1&searchFields=name:=&searchJoin=or');

  expect(
    query.toPairs(),
  ).toEqual({
    search: 'name:1',
    searchFields: 'name:=',
    searchJoin: 'or',
  })
})

test('where with not supported operator', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository.where('status', '>', 1);

  expect(
    query.toString(),
  ).toBe('search=status:1&searchFields=status:=&searchJoin=or');

  expect(
    query.toPairs(),
  ).toEqual({
    search: 'status:1',
    searchFields: 'status:=',
    searchJoin: 'or',
  })
})

test('where with array value', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository.where([
    ['status', 1],
    ['name', 'like', 'hachi'],
  ]);

  expect(
    query.toString(),
  ).toBe('search=status:1;name:hachi&searchFields=status:=;name:like&searchJoin=or');

  expect(
    query.toPairs(),
  ).toEqual({
    search: 'status:1;name:hachi',
    searchFields: 'status:=;name:like',
    searchJoin: 'or',
  })
})

test('filter some fields', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository.filter(['status', 'name']);

  expect(
    query.toString(),
  ).toBe('filter=status;name&searchJoin=or');

  expect(
    query.toPairs(),
  ).toEqual({
    filter: 'status;name',
    searchJoin: 'or',
  })
})

test('orderBy and orderByDesc', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository.orderBy('status').orderByDesc('name');

  expect(
    query.toString(),
  ).toBe('orderBy=status;name&sortedBy=asc;desc&searchJoin=or');

  expect(
    query.toPairs(),
  ).toEqual({
    orderBy: 'status;name',
    sortedBy: 'asc;desc',
    searchJoin: 'or',
  })
})

test('with relationships', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository.with('survey');

  expect(
    query.toString(),
  ).toBe('with=survey&searchJoin=or');

  expect(
    query.toPairs(),
  ).toEqual({
    with: 'survey',
    searchJoin: 'or',
  })
})

test('searchJoin comparison', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository.searchJoin('and');

  expect(
    query.toString(),
  ).toBe('searchJoin=and');

  expect(
    query.toPairs(),
  ).toEqual({
    searchJoin: 'and',
  })
})

test('fully statement', () => {
  const l5Repository = new L5Repository();
  const query = l5Repository
    .where('name', 'like', 'hachi')
    .where([
      ['status', 1],
      ['country', '=', 'japan']
    ])
    .orderBy('name')
    .orderByDesc('country')
    .with('author')
    .filter(['name', 'status', 'country'])
    .searchJoin('or');

  expect(
    query.toString(),
  ).toBe('search=name:hachi;status:1;country:japan&searchFields=name:like;status:=;country:=&orderBy=name;country&sortedBy=asc;desc&with=author&filter=name;status;country&searchJoin=or');

  expect(
    query.toPairs(),
  ).toEqual({
    search: 'name:hachi;status:1;country:japan',
    searchFields: 'name:like;status:=;country:=',
    orderBy: 'name;country',
    sortedBy: 'asc;desc',
    with: 'author',
    filter: 'name;status;country',
    searchJoin: 'or',
  })
})
