import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // List of public routes that don't require authentication
  const publicRoutes = ['/auth', '/auth/verify', '/about', '/faq', '/'];
  
  const isPublicRoute = publicRoutes.some(route => 
    event.url.pathname === route || event.url.pathname.startsWith(route + '/')
  );
  
  if (!isPublicRoute) {
    // Check for authentication
    // This is a simplified example - implement based on your needs
    const token = event.cookies.get('refresh_token');
    
    if (!token && !event.url.pathname.startsWith('/api')) {
      return Response.redirect(`${event.url.origin}/auth`, 302);
    }
  }
  
  return await resolve(event);
};
