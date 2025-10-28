// __tests__/index.test.js
const { getResponseText } = require('../index');

test('Devuelve Hola Mundo', () => {
  expect(getResponseText()).toBe('Hola Mundo desde Node.js');
});

