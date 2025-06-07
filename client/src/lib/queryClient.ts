import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  console.log('[API REQUEST] Response status:', res.status, 'OK:', res.ok);
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.log('[API REQUEST] Error response text:', text);
    
    // Try to parse JSON error response
    let errorData: any = {};
    try {
      errorData = JSON.parse(text);
    } catch {
      // If not JSON, use text as error message
      errorData = { error: text };
    }
    
    const error = new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
    (error as any).status = res.status;
    (error as any).needsUpgrade = errorData.needsUpgrade;
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
  let token = localStorage.getItem('veefore_auth_token');
  
  // Validate and refresh token if needed
  if (token && (!token.includes('.') || token.split('.').length !== 3)) {
    console.log(`[CLIENT DEBUG] Invalid token format detected for ${method} ${url}, refreshing...`);
    try {
      const { auth } = await import('./firebase');
      if (auth?.currentUser) {
        const freshToken = await auth.currentUser.getIdToken(true);
        if (freshToken && freshToken.split('.').length === 3) {
          localStorage.setItem('veefore_auth_token', freshToken);
          token = freshToken;
          console.log(`[CLIENT DEBUG] Token refreshed successfully for ${method} ${url}`);
        }
      }
    } catch (error) {
      console.error(`[CLIENT DEBUG] Token refresh failed for ${method} ${url}:`, error);
    }
  }
  
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

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get Firebase token from local storage or auth state
    let token = localStorage.getItem('veefore_auth_token');
    
    // If no token or invalid format, try to get a fresh one from Firebase
    if (!token || token.split('.').length !== 3) {
      console.log('[CLIENT] No valid token found, attempting to get fresh token');
      
      // Try to get Firebase auth instance and fresh token
      try {
        const { auth } = await import('../lib/firebase');
        if (auth?.currentUser) {
          const freshToken = await auth.currentUser.getIdToken(true);
          if (freshToken && freshToken.split('.').length === 3) {
            localStorage.setItem('veefore_auth_token', freshToken);
            token = freshToken;
            console.log('[CLIENT] Fresh token obtained and stored');
          }
        }
      } catch (error) {
        console.error('[CLIENT] Failed to get fresh token:', error);
      }
    }
    
    const headers: Record<string, string> = {};
    if (token && token.split('.').length === 3) {
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
