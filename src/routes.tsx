// import { isUndefined } from 'lodash';
import { Suspense, lazy } from 'react';
import type { PartialRouteObject } from 'react-router';
import AuthGuard from './components/AuthGuard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import GuestGuard from './components/GuestGuard';
import LoadingScreen from './components/LoadingScreen';
import MainLayout from './components/MainLayout';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);
// Error pages
const AuthorizationRequired = Loadable(lazy(() => import('./pages/AuthorizationRequired')));
const NotFound = Loadable(lazy(() => import('./pages/NotFound')));
const NoContentFound = Loadable(lazy(() => import('./pages/NoContentFound')));
const ServerError = Loadable(lazy(() => import('./pages/ServerError')));

// Authentication pages
const Login = Loadable(lazy(() => import('./pages/authentication/Login')));
const ForgotPassword = Loadable(lazy(() => import('./pages/authentication/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('./pages/authentication/ResetPassword')));

// Dashboard pages
const Analytics = Loadable(lazy(() => import('./pages/dashboard/Analytics')));

// Blog Pages
const BlogOverview = Loadable(lazy(() => import('./pages/blog/BlogOverview')));
const BlogAddView = Loadable(lazy(() => import('./pages/blog/BlogAddView')));
const BlogEditView = Loadable(lazy(() => import('./pages/blog/BlogEditView')));
const BlogCategoryAddView = Loadable(lazy(() => import('./pages/blog/BlogCategoryAddView')));
const BlogCategoryEditView = Loadable(lazy(() => import('./pages/blog/BlogCategoryEditView')));
const BlogCategoryView = Loadable(lazy(() => import('./pages/blog/BlogCategoryOverview')));
const BlogTagView = Loadable(lazy(() => import('./pages/blog/BlogTagOverview')));
const BlogPreview = Loadable(lazy(() => import('./pages/blog/BlogPreview')));
const TagAddView = Loadable(lazy(() => import('./pages/blog/TagAddView')));
const TagEditView = Loadable(lazy(() => import('./pages/blog/TagEditView')));
// Client Pages
const ClientOverview = Loadable(lazy(() => import('./pages/client/ClientOverview')));
const ClientSingleView = Loadable(lazy(() => import('./pages/client/ClientSingleView')));
const ClientSingleErrorView = Loadable(lazy(() => import('./pages/client/ClientSingleErrorView')));
const ClientEditView = Loadable(lazy(() => import('./pages/client/ClientEditView')));
const ClientAddView = Loadable(lazy(() => import('./pages/client/ClientAddView')));

const SettingView = Loadable(lazy(() => import('./pages/setting/SettingView')));

// Change Logs
const ChangeLogs = Loadable(lazy(() => import('./pages/ChangeLogs')));

// Search
const SearchOverview = Loadable(lazy(() => import('./pages/search/SearchOverview')));

const routes: PartialRouteObject[] = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <Analytics />
      },
    ]
  },
  {
    path: 'admin',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'users',
        children: [
          {
            path: '/',
            element: <ClientOverview />
          },
          {
            path: '/create',
            element: <ClientAddView />
          },
          {
            path: ':clientId',
            element: <ClientSingleView />
          },
          {
            path: 'edit/:clientId',
            element: <ClientEditView />
          },
          {
            path: 'error_devices/:clientId',
            element: <ClientSingleErrorView />
          },
        ]
      },
      {
        path: 'blogs',
        children: [
          {
            path: '/',
            element: <BlogOverview />
          },
          {
            path: '/create',
            element: <BlogAddView />
          },
          {
            path: '/:id',
            element: <BlogEditView />
          },
          {
            path: '/preview/:id',
            element: <BlogPreview />
          },
          {
            // path: 'error_devices/:clientId',
            // element: <ClientSingleErrorView />
          },
        ]
      },
      {
        path: '/create/categories',
        element: <BlogCategoryAddView />
      },
      {
        path: '/category/:id',
        element: <BlogCategoryEditView />
      },
      {
        path: '/categories',
        element: <BlogCategoryView />
      },
      {
        path: '/tags',
        element: <BlogTagView />
      },
      {
        path: '/create/tag',
        element: <TagAddView />
      },
      {
        path: '/tag/:id',
        element: <TagEditView />
      },
      {
        path: 'change_logs',
        element: <ChangeLogs />
      },
      {
        path: 'search',
        element: <SearchOverview />
      },
      {
        path: 'setting',
        children: [
          {
            path: '/',
            element: <SettingView />,
          },
        ]
      },
    ]
  },
  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        )
      },
      {
        path: '/login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        )
      },
      {
        path: '/forgot-password',
        element: (
          <GuestGuard>
            <ForgotPassword />
          </GuestGuard>
        )
      },
      {
        path: '/reset-password/:id',
        element: (
          <GuestGuard>
            <ResetPassword />
          </GuestGuard>
        )
      },
      {
        path: '401',
        element: <AuthorizationRequired />
      },
      {
        path: '404',
        element: <NotFound />
      },
      {
        path: 'not-found',
        element: <NoContentFound />
      },
      {
        path: '500',
        element: <ServerError />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

export default routes;
