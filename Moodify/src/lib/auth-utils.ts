// Token management utilities

const TOKEN_KEY = "auth_token";

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  // Also set as cookie for credentials: "include" to work
  document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = "token=; path=/; max-age=0";
};

export const getTokenFromURL = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
};

export const removeTokenFromURL = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  window.history.replaceState({}, "", url.toString());
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};
