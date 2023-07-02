const mapping: Record<string, string> = {
  inquiries: 'inquiry',
  organizations: 'organization',
  products: 'product',
  tasks: 'task',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
