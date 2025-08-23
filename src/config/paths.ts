export const paths = {
  home: {
    getHref: () => '/',
  },
  dashboard: {
    getHref: () => '/home',
  },
  auth: {
    signup: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },
};
