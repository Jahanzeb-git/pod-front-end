import { PRINTFUL_ACCESS_TOKEN } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

const PRINTFUL_API_URL = 'https://api.printful.com';

const handler: RequestHandler = async ({ request, params, url }) => {
	const proxyUrl = `${PRINTFUL_API_URL}/${params.proxy}${url.search}`;

	// 1. Create request headers for Printful
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('authorization', `Bearer ${PRINTFUL_ACCESS_TOKEN}`);
	requestHeaders.delete('cookie'); // Do not forward client cookies

	// 2. Make the actual request to Printful
	const printfulResponse = await fetch(proxyUrl, {
		method: request.method,
		headers: requestHeaders,
		body: request.body,
		// @ts-expect-error - duplex is required for streaming
		duplex: 'half'
	});

	// 3. Create response headers for the client
	const responseHeaders = new Headers(printfulResponse.headers);
	// Remove headers that can cause issues when proxying
	responseHeaders.delete('content-encoding');
	responseHeaders.delete('content-length');

	// 4. Return a new response to the client
	return new Response(printfulResponse.body, {
		status: printfulResponse.status,
		statusText: printfulResponse.statusText,
		headers: responseHeaders
	});
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
