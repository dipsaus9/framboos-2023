require('dotenv').config({
  path: '.env',
})

function getHost() {
  return process.env.PUBLIC_HOST
}

module.exports = {
  framboos: {
    input: `${getHost()}/v3/api-docs`,
    output: {
      mode: 'split',
      target: './app/lib/api/@generated/framboos.ts',
      mock: true,
      prettier: true,
      clean: true,
      headers: true,
      override: {
        useDates: true,
        mutator: {
          path: './app/lib/api/customFetchInstance.ts',
          name: 'customFetchInstance',
        },
        mock: {
          delay: 300,
          required: true,
          arrayMin: 10,
          arrayMax: 50,
        },
      },
    },
  },
}
