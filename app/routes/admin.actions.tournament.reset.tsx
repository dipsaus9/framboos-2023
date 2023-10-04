import type { ActionFunctionArgs } from '@remix-run/node'
import { typedjson } from 'remix-typedjson'

import { reset } from '~/lib/api/@generated/framboos'
import { isLoggedIn } from '~/services/auth.server'

export async function action({ request }: ActionFunctionArgs) {
  if (!(await isLoggedIn(request))) {
    return typedjson(
      {
        status: 401,
        statusText: 'Unauthorized',
      },
      401,
    )
  }

  await reset()

  return typedjson({
    status: 200,
    statusText: 'OK',
  })
}

export default function View() {
  return <div>Oops... You should not see this.</div>
}
