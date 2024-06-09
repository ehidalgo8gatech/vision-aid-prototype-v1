# Vision Aid Partners

Vision Aid Partners is a website used by members of hospitals across the Vision Aid organization to
manage distribution of Vision Aid products, generate reports and metrics, and track beneficiaries 
for the organization. Vision Aid is a non-profit based out of India. There main website can be found
at https://visionaid.org/.

## Local Setup

TODO

### Environment Variables

TODO

## Architecture

This application is setup using Next.js and React. Next.js is a full stack framework that combines
React components with an API layer, completing 2/3 of the ful stack structure. For database, the
team has chosen to use MySQL, with Prisma as an interface for the database.

The application is secured with an authentication layer that is managed through [Auth0](https://auth0.com/).
More details about the authentication framework can be found [here](./pages/api/auth/README.md).

The application is automatically deployed to Vercel through connection setup by the team. In Vercel,
sensitive environment variables are defined so as not to commit these to version control and make
them publically accessible.

## Developer Tools

It's important to note when developing for this repository, that both linting and unit-testing are
enforced through Github Actions. You can run the linter locally by running `npm run lint`, and the
test are also executable locally by running `npm run test`.

It's strongly recommended that you add in unit tests when developing content, especially for the
API. Tests should be stored in a `__tests__` directory, and are required to end with the extension
`.test.js` to be able to be detected by [Jest](https://jestjs.io/). While there are no examples of
React unit tests yet, they would be beneficial to implement in the future.

For linting, only errors in the linter will stop the Linter action from passing. It is recommneded
that you work to eliminate any warnings too; it's simply good practice and often more efficient to
address the warnings.

