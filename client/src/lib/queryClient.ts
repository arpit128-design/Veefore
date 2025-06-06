import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  console.log('[API REQUEST] Response status:', res.status, 'OK:', res.ok);
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.log('[API REQUEST] Error response text:', text);
    const error = new Error(`${res.status}: ${text}`);
    console.log('[API REQUEST] Throwing error:', error);
    throw error;
  }
  console.log('[API REQUEST] Response OK, continuing');
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = localStorage.getItem('veefore_auth_token');
  
  console.log(`[CLIENT DEBUG] ${method} ${url} - Token:`, token ? 'Present' : 'Missing');
  
  const headers: Record<string, string> = {};
  let body: string | FormData | undefined;

  if (data instanceof FormData) {
    // Don't set Content-Type for FormData, let browser set it with boundary
    body = data;
  } else if (data) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn(`[CLIENT WARNING] No auth token found for ${method} ${url}`);
  }

  console.log(`[CLIENT DEBUG] Request headers:`, Object.keys(headers));

  const res = await fetch(url, {
    method,
    headers,
    body,
    credentials: "include",
  });

  // Clone the response so we can read it multiple times if needed
  const clonedRes = res.clone();
  await throwIfResNotOk(clonedRes);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get Firebase token from local storage or auth state
    const token = localStorage.getItem('veefore_auth_token');
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
