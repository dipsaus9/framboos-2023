require('dotenv').config({
  path: '.env',
})

module.exports = {
  framboos: {
    input: process.env.PUBLIC_HOST
      ? `${process.env.PUBLIC_HOST}/v3/api-docs`
      : './open-api.json',
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
