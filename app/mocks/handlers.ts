import { getOpenAPIDefinitionMSW } from '~/lib/api/@generated/framboos.msw'

export const handlers = [...getOpenAPIDefinitionMSW()]
