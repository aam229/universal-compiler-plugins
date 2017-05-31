export function createCookiesStore(values) {
  const storeCookies = {};
  Object.keys(values).forEach((key) => {
    storeCookies[key] = { value: values[key] };
  });
  return storeCookies;
}
