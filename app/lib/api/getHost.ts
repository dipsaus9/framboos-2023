export function getHost(): string {
  return process.env.PUBLIC_HOST ?? 'http://localhost:3000'
}
