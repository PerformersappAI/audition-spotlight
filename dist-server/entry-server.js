var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a, _b;
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import * as React from "react";
import React__default, { Component, createContext, useState, useEffect, useContext, useMemo } from "react";
import { UNSAFE_invariant, Action, parsePath, stripBasename, UNSAFE_warning, joinPaths, UNSAFE_getResolveToMatches, resolveTo, matchRoutes, isRouteErrorResponse, createPath, matchPath } from "@remix-run/router";
import fastCompare from "react-fast-compare";
import invariant from "invariant";
import shallowEqual from "shallowequal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@supabase/supabase-js";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Zap, X, Menu, ChevronDown, ChevronUp, Check as Check$1, Users, Building2, DollarSign, MapPin, Briefcase, Trash2, Plus, Send, Crown, Loader2, Settings, CreditCard, Sparkles, Home } from "lucide-react";
import "react-dom";
import { toast as toast$1 } from "sonner";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
const DataRouterContext = /* @__PURE__ */ React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  DataRouterContext.displayName = "DataRouter";
}
const DataRouterStateContext = /* @__PURE__ */ React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  DataRouterStateContext.displayName = "DataRouterState";
}
const AwaitContext = /* @__PURE__ */ React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  AwaitContext.displayName = "Await";
}
const NavigationContext = /* @__PURE__ */ React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  NavigationContext.displayName = "Navigation";
}
const LocationContext = /* @__PURE__ */ React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  LocationContext.displayName = "Location";
}
const RouteContext = /* @__PURE__ */ React.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
if (process.env.NODE_ENV !== "production") {
  RouteContext.displayName = "Route";
}
const RouteErrorContext = /* @__PURE__ */ React.createContext(null);
if (process.env.NODE_ENV !== "production") {
  RouteErrorContext.displayName = "RouteError";
}
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(
    false,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  ) : UNSAFE_invariant(false) : void 0;
  let {
    basename,
    navigator
  } = React.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return React.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(
    false,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ) : UNSAFE_invariant(false) : void 0;
  return React.useContext(LocationContext).location;
}
const navigateEffectWarning = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function useIsomorphicLayoutEffect(cb) {
  let isStatic = React.useContext(NavigationContext).static;
  if (!isStatic) {
    React.useLayoutEffect(cb);
  }
}
function useNavigate() {
  let {
    isDataRoute
  } = React.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(
    false,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  ) : UNSAFE_invariant(false) : void 0;
  let dataRouterContext = React.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator
  } = React.useContext(NavigationContext);
  let {
    matches
  } = React.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(UNSAFE_getResolveToMatches(matches, future.v7_relativeSplatPath));
  let activeRef = React.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    process.env.NODE_ENV !== "production" ? UNSAFE_warning(activeRef.current, navigateEffectWarning) : void 0;
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
  }, [basename, navigator, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
function useParams() {
  let {
    matches
  } = React.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = React.useContext(NavigationContext);
  let {
    matches
  } = React.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(UNSAFE_getResolveToMatches(matches, future.v7_relativeSplatPath));
  return React.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(
    false,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  ) : UNSAFE_invariant(false) : void 0;
  let {
    navigator
  } = React.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = React.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  if (process.env.NODE_ENV !== "production") {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ('"' + parentPathname + '" (under <Route path="' + parentPath + '">) but the ') + `parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

` + ('Please change the parent <Route path="' + parentPath + '"> to <Route ') + ('path="' + (parentPath === "/" ? "*" : parentPath + "/*") + '">.'));
  }
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, the location pathname must begin with the portion of the URL pathname that was " + ('matched by all parent routes. The current pathname base is "' + parentPathnameBase + '" ') + ('but pathname "' + parsedLocationArg.pathname + '" was given in the `location` prop.')) : UNSAFE_invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  if (process.env.NODE_ENV !== "production") {
    process.env.NODE_ENV !== "production" ? UNSAFE_warning(parentRoute || matches != null, 'No routes matched location "' + location.pathname + location.search + location.hash + '" ') : void 0;
    process.env.NODE_ENV !== "production" ? UNSAFE_warning(matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0, 'Matched leaf route at location "' + location.pathname + location.search + location.hash + '" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.') : void 0;
  }
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ React.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let codeStyles = {
    padding: "2px 4px",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  if (process.env.NODE_ENV !== "production") {
    console.error("Error handled by React Router default ErrorBoundary:", error);
    devInfo = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ React.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ React.createElement("code", {
      style: codeStyles
    }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ React.createElement("code", {
      style: codeStyles
    }, "errorElement"), " prop on your route."));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ React.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ React.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ React.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ React.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ React.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = React.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ React.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m) => m.route.id && (errors == null ? void 0 : errors[m.route.id]) !== void 0);
    !(errorIndex >= 0) ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "Could not find a matching route for errors on route IDs: " + Object.keys(errors).join(",")) : UNSAFE_invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce("route-fallback", false, "No `HydrateFallback` element provided to render during initial hydration");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ React.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ React.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ React.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /* @__PURE__ */ function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
  DataRouterHook2["UseNavigateStable"] = "useNavigate";
  return DataRouterHook2;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook$1 || {});
function getDataRouterConsoleError$1(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
}
function useDataRouterContext$1(hookName) {
  let ctx = React.useContext(DataRouterContext);
  !ctx ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, getDataRouterConsoleError$1(hookName)) : UNSAFE_invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = React.useContext(DataRouterStateContext);
  !state ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, getDataRouterConsoleError$1(hookName)) : UNSAFE_invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = React.useContext(RouteContext);
  !route ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, getDataRouterConsoleError$1(hookName)) : UNSAFE_invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, hookName + ' can only be used on routes that contain a unique "id"') : UNSAFE_invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteId() {
  return useCurrentRouteId(DataRouterStateHook$1.UseRouteId);
}
function useRouteError() {
  var _state$errors;
  let error = React.useContext(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook$1.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook$1.UseRouteError);
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext$1(DataRouterHook$1.UseNavigateStable);
  let id = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = React.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = React.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    process.env.NODE_ENV !== "production" ? UNSAFE_warning(activeRef.current, navigateEffectWarning) : void 0;
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id
      }, options));
    }
  }, [router, id]);
  return navigate;
}
const alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned$1[key]) {
    alreadyWarned$1[key] = true;
    process.env.NODE_ENV !== "production" ? UNSAFE_warning(false, message) : void 0;
  }
}
function Route(_props) {
  process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.") : UNSAFE_invariant(false);
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.") : UNSAFE_invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = React.useMemo(() => ({
    basename,
    navigator,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = React.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  process.env.NODE_ENV !== "production" ? UNSAFE_warning(locationContext != null, '<Router basename="' + basename + '"> is not able to match the URL ' + ('"' + pathname + search + hash + '" because it does not start with the ') + "basename, so the <Router> won't render anything.") : void 0;
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ React.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
new Promise(() => {
});
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  React.Children.forEach(children, (element, index) => {
    if (!/* @__PURE__ */ React.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === React.Fragment) {
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "[" + (typeof element.type === "string" ? element.type : element.type.name) + "] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>") : UNSAFE_invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "An index route cannot have child routes.") : UNSAFE_invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}
/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
const defaultMethod = "get";
const defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return object != null && typeof object.tagName === "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
function createSearchParams(init) {
  if (init === void 0) {
    init = "";
  }
  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
    let value = init[key];
    return memo.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
  }, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
}
let _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      );
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
const supportedFormEncTypes = /* @__PURE__ */ new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    process.env.NODE_ENV !== "production" ? UNSAFE_warning(false, '"' + encType + '" is not a valid `encType` for `<Form>`/`<fetcher.Form>` ' + ('and will default to "' + defaultEncType + '"')) : void 0;
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let {
        name,
        type,
        value
      } = target;
      if (type === "image") {
        let prefix = name ? name + "." : "";
        formData.append(prefix + "x", "0");
        formData.append(prefix + "y", "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = void 0;
  }
  return {
    action,
    method: method.toLowerCase(),
    encType,
    formData,
    body
  };
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"], _excluded3 = ["fetcherKey", "navigate", "reloadDocument", "replace", "state", "method", "action", "onSubmit", "relative", "preventScrollReset", "viewTransition"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const ViewTransitionContext = /* @__PURE__ */ React.createContext({
  isTransitioning: false
});
if (process.env.NODE_ENV !== "production") {
  ViewTransitionContext.displayName = "ViewTransition";
}
const FetchersContext = /* @__PURE__ */ React.createContext(/* @__PURE__ */ new Map());
if (process.env.NODE_ENV !== "production") {
  FetchersContext.displayName = "Fetchers";
}
if (process.env.NODE_ENV !== "production") ;
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX$1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link = /* @__PURE__ */ React.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = React.useContext(NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX$1.test(to)) {
    absoluteHref = to;
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
        process.env.NODE_ENV !== "production" ? UNSAFE_warning(false, '<Link to="' + to + '"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.') : void 0;
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ React.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
if (process.env.NODE_ENV !== "production") {
  Link.displayName = "Link";
}
const NavLink = /* @__PURE__ */ React.forwardRef(function NavLinkWithRef(_ref8, ref) {
  let {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children
  } = _ref8, rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
  let path = useResolvedPath(to, {
    relative: rest.relative
  });
  let location = useLocation();
  let routerState = React.useContext(DataRouterStateContext);
  let {
    navigator,
    basename
  } = React.useContext(NavigationContext);
  let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useViewTransitionState(path) && viewTransition === true;
  let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
  }
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : void 0;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /* @__PURE__ */ React.createElement(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className,
    ref,
    style,
    to,
    viewTransition
  }), typeof children === "function" ? children(renderProps) : children);
});
if (process.env.NODE_ENV !== "production") {
  NavLink.displayName = "NavLink";
}
const Form = /* @__PURE__ */ React.forwardRef((_ref9, forwardedRef) => {
  let {
    fetcherKey,
    navigate,
    reloadDocument,
    replace,
    state,
    method = defaultMethod,
    action,
    onSubmit,
    relative,
    preventScrollReset,
    viewTransition
  } = _ref9, props = _objectWithoutPropertiesLoose(_ref9, _excluded3);
  let submit = useSubmit();
  let formAction = useFormAction(action, {
    relative
  });
  let formMethod = method.toLowerCase() === "get" ? "get" : "post";
  let submitHandler = (event) => {
    onSubmit && onSubmit(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    let submitter = event.nativeEvent.submitter;
    let submitMethod = (submitter == null ? void 0 : submitter.getAttribute("formmethod")) || method;
    submit(submitter || event.currentTarget, {
      fetcherKey,
      method: submitMethod,
      navigate,
      replace,
      state,
      relative,
      preventScrollReset,
      viewTransition
    });
  };
  return /* @__PURE__ */ React.createElement("form", _extends({
    ref: forwardedRef,
    method: formMethod,
    action: formAction,
    onSubmit: reloadDocument ? onSubmit : submitHandler
  }, props));
});
if (process.env.NODE_ENV !== "production") {
  Form.displayName = "Form";
}
if (process.env.NODE_ENV !== "production") ;
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function getDataRouterConsoleError(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
}
function useDataRouterContext(hookName) {
  let ctx = React.useContext(DataRouterContext);
  !ctx ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, getDataRouterConsoleError(hookName)) : UNSAFE_invariant(false) : void 0;
  return ctx;
}
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return React.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, viewTransition]);
}
function useSearchParams(defaultInit) {
  process.env.NODE_ENV !== "production" ? UNSAFE_warning(typeof URLSearchParams !== "undefined", "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.") : void 0;
  let defaultSearchParamsRef = React.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = React.useRef(false);
  let location = useLocation();
  let searchParams = React.useMemo(() => (
    // Only merge in the defaults if we haven't yet called setSearchParams.
    // Once we call that we want those to take precedence, otherwise you can't
    // remove a param with setSearchParams({}) if it has an initial value
    getSearchParamsForLocation(location.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current)
  ), [location.search]);
  let navigate = useNavigate();
  let setSearchParams = React.useCallback((nextInit, navigateOptions) => {
    const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
    hasSetSearchParamsRef.current = true;
    navigate("?" + newSearchParams, navigateOptions);
  }, [navigate, searchParams]);
  return [searchParams, setSearchParams];
}
function validateClientSideSubmission() {
  if (typeof document === "undefined") {
    throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
  }
}
let fetcherId = 0;
let getUniqueFetcherId = () => "__" + String(++fetcherId) + "__";
function useSubmit() {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseSubmit);
  let {
    basename
  } = React.useContext(NavigationContext);
  let currentRouteId = useRouteId();
  return React.useCallback(function(target, options) {
    if (options === void 0) {
      options = {};
    }
    validateClientSideSubmission();
    let {
      action,
      method,
      encType,
      formData,
      body
    } = getFormSubmissionInfo(target, basename);
    if (options.navigate === false) {
      let key = options.fetcherKey || getUniqueFetcherId();
      router.fetch(key, currentRouteId, options.action || action, {
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        flushSync: options.flushSync
      });
    } else {
      router.navigate(options.action || action, {
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        replace: options.replace,
        state: options.state,
        fromRouteId: currentRouteId,
        flushSync: options.flushSync,
        viewTransition: options.viewTransition
      });
    }
  }, [router, basename, currentRouteId]);
}
function useFormAction(action, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    basename
  } = React.useContext(NavigationContext);
  let routeContext = React.useContext(RouteContext);
  !routeContext ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "useFormAction must be used inside a RouteContext") : UNSAFE_invariant(false) : void 0;
  let [match] = routeContext.matches.slice(-1);
  let path = _extends({}, useResolvedPath(action ? action : ".", {
    relative
  }));
  let location = useLocation();
  if (action == null) {
    path.search = location.search;
    let params = new URLSearchParams(path.search);
    let indexValues = params.getAll("index");
    let hasNakedIndexParam = indexValues.some((v) => v === "");
    if (hasNakedIndexParam) {
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? "?" + qs : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function useViewTransitionState(to, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let vtContext = React.useContext(ViewTransitionContext);
  !(vtContext != null) ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?") : UNSAFE_invariant(false) : void 0;
  let {
    basename
  } = useDataRouterContext(DataRouterHook.useViewTransitionState);
  let path = useResolvedPath(to, {
    relative: opts.relative
  });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
function StaticRouter({
  basename,
  children,
  location: locationProp = "/",
  future
}) {
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let action = Action.Pop;
  let location = {
    pathname: locationProp.pathname || "/",
    search: locationProp.search || "",
    hash: locationProp.hash || "",
    state: locationProp.state != null ? locationProp.state : null,
    key: locationProp.key || "default"
  };
  let staticNavigator = getStatelessNavigator();
  return /* @__PURE__ */ React.createElement(Router, {
    basename,
    children,
    location,
    navigationType: action,
    navigator: staticNavigator,
    future,
    static: true
  });
}
function getStatelessNavigator() {
  return {
    createHref,
    encodeLocation,
    push(to) {
      throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
    },
    replace(to) {
      throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
    },
    go(delta) {
      throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
    },
    back() {
      throw new Error(`You cannot use navigator.back() on the server because it is a stateless environment.`);
    },
    forward() {
      throw new Error(`You cannot use navigator.forward() on the server because it is a stateless environment.`);
    }
  };
}
function createHref(to) {
  return typeof to === "string" ? to : createPath(to);
}
function encodeLocation(to) {
  let href = typeof to === "string" ? to : createPath(to);
  href = href.replace(/ $/, "%20");
  let encoded = ABSOLUTE_URL_REGEX.test(href) ? new URL(href) : new URL(href, "http://localhost");
  return {
    pathname: encoded.pathname,
    search: encoded.search,
    hash: encoded.hash
  };
}
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(
    propsList,
    "title"
    /* TITLE */
  );
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
  "base"
  /* BASE */
] !== "undefined").map((props) => props[
  "base"
  /* BASE */
]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = {
        ...approvedSeenTags[attributeKey],
        ...instanceSeenTags[attributeKey]
      };
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([
    "href"
    /* HREF */
  ], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
  linkTags: getTagsFromPropsList(
    "link",
    [
      "rel",
      "href"
      /* HREF */
    ],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta",
    [
      "name",
      "charset",
      "http-equiv",
      "property",
      "itemprop"
      /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript", [
    "innerHTML"
    /* INNER_HTML */
  ], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script",
    [
      "src",
      "innerHTML"
      /* INNER_HTML */
    ],
    propsList
  ),
  styleTags: getTagsFromPropsList("style", [
    "cssText"
    /* CSS_TEXT */
  ], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return {
    ...obj,
    [key]: void 0
  };
};
var SELF_CLOSING_TAGS = [
  "noscript",
  "script",
  "style"
  /* STYLE */
];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title, attributes) => {
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React__default.createElement("title", props, title)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React__default.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title":
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes":
    case "htmlAttributes":
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta", meta.priority),
      ...generateTagsAsReactComponent("link", link.priority),
      ...generateTagsAsReactComponent("script", script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta", meta.priority, encode)} ${getMethodsForTag(
        "link",
        link.priority,
        encode
      )} ${getMethodsForTag("script", script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => [],
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base", baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode),
    link: getMethodsForTag("link", linkTags, encode),
    meta: getMethodsForTag("meta", metaTags, encode),
    noscript: getMethodsForTag("noscript", noscriptTags, encode),
    script: getMethodsForTag("script", scriptTags, encode),
    style: getMethodsForTag("style", styleTags, encode),
    title: getMethodsForTag("title", { title, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  constructor(context, canUseDOM) {
    __publicField(this, "instances", []);
    __publicField(this, "canUseDOM", isDocument);
    __publicField(this, "context");
    __publicField(this, "value", {
      setHelmet: (serverState) => {
        this.context.helmet = serverState;
      },
      helmetInstances: {
        get: () => this.canUseDOM ? instances : this.instances,
        add: (instance) => {
          (this.canUseDOM ? instances : this.instances).push(instance);
        },
        remove: (instance) => {
          const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
          (this.canUseDOM ? instances : this.instances).splice(index, 1);
        }
      }
    });
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        encodeSpecialCharacters: true,
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};
var major = parseInt(React__default.version.split(".")[0], 10);
var isReact19 = major >= 19;
var defaultValue = {};
var Context = React__default.createContext(defaultValue);
var HelmetProvider = (_a = class extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "helmetData");
    if (isReact19) {
      this.helmetData = null;
    } else {
      this.helmetData = new HelmetData(this.props.context || {}, _a.canUseDOM);
    }
  }
  render() {
    if (isReact19) {
      return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, this.props.children);
    }
    return /* @__PURE__ */ React__default.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
}, __publicField(_a, "canUseDOM", isDocument), _a);
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector(
    "head"
    /* HEAD */
  );
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML") {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText") {
            const cssText = tag.cssText;
            newElement.appendChild(document.createTextNode(cssText));
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => {
    var _a2;
    return (_a2 = tag.parentNode) == null ? void 0 : _a2.removeChild(tag);
  });
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title, attributes) => {
  if (typeof title !== "undefined" && document.title !== title) {
    document.title = flattenArray(title);
  }
  updateAttributes("title", attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes
  } = newState;
  updateAttributes("body", bodyAttributes);
  updateAttributes("html", htmlAttributes);
  updateTitle(title, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base", baseTag),
    linkTags: updateTags("link", linkTags),
    metaTags: updateTags("meta", metaTags),
    noscriptTags: updateTags("noscript", noscriptTags),
    scriptTags: updateTags("script", scriptTags),
    styleTags: updateTags("style", styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;
var HelmetDispatcher = class extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "rendered", false);
  }
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const { context: _context, ...props } = instance.props;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};
var react19Instances = [];
var toHtmlAttributes = (props) => {
  const result = {};
  for (const key of Object.keys(props)) {
    result[HTML_TAG_MAP[key] || key] = props[key];
  }
  return result;
};
var toReactProps = (attrs) => {
  const result = {};
  for (const key of Object.keys(attrs)) {
    const mapped = REACT_TAG_MAP[key];
    result[mapped || key] = attrs[key];
  }
  return result;
};
var applyAttributes = (tagName, attributes) => {
  if (!isDocument)
    return;
  const el = document.getElementsByTagName(tagName)[0];
  if (!el)
    return;
  const managedAttr = "data-rh-managed";
  const prev = el.getAttribute(managedAttr);
  const prevKeys = prev ? prev.split(",") : [];
  const nextKeys = Object.keys(attributes);
  for (const key of prevKeys) {
    if (!nextKeys.includes(key)) {
      el.removeAttribute(key);
    }
  }
  for (const key of nextKeys) {
    const value = attributes[key];
    if (value === void 0 || value === null || value === false) {
      el.removeAttribute(key);
    } else if (value === true) {
      el.setAttribute(key, "");
    } else {
      el.setAttribute(key, String(value));
    }
  }
  if (nextKeys.length > 0) {
    el.setAttribute(managedAttr, nextKeys.join(","));
  } else {
    el.removeAttribute(managedAttr);
  }
};
var syncAllAttributes = () => {
  const htmlAttrs = {};
  const bodyAttrs = {};
  for (const instance of react19Instances) {
    const { htmlAttributes, bodyAttributes } = instance.props;
    if (htmlAttributes) {
      Object.assign(htmlAttrs, toHtmlAttributes(htmlAttributes));
    }
    if (bodyAttributes) {
      Object.assign(bodyAttrs, toHtmlAttributes(bodyAttributes));
    }
  }
  applyAttributes("html", htmlAttrs);
  applyAttributes("body", bodyAttrs);
};
var React19Dispatcher = class extends Component {
  componentDidMount() {
    react19Instances.push(this);
    syncAllAttributes();
  }
  componentDidUpdate() {
    syncAllAttributes();
  }
  componentWillUnmount() {
    const index = react19Instances.indexOf(this);
    if (index !== -1) {
      react19Instances.splice(index, 1);
    }
    syncAllAttributes();
  }
  resolveTitle() {
    const { title, titleTemplate, defaultTitle } = this.props;
    if (title && titleTemplate) {
      return titleTemplate.replace(/%s/g, () => Array.isArray(title) ? title.join("") : title);
    }
    return title || defaultTitle || void 0;
  }
  renderTitle() {
    const title = this.resolveTitle();
    if (title === void 0)
      return null;
    const titleAttributes = this.props.titleAttributes || {};
    return React__default.createElement("title", toReactProps(titleAttributes), title);
  }
  renderBase() {
    const { base } = this.props;
    if (!base)
      return null;
    return React__default.createElement("base", toReactProps(base));
  }
  renderMeta() {
    const { meta } = this.props;
    if (!meta || !Array.isArray(meta))
      return null;
    return meta.map(
      (attrs, i) => React__default.createElement("meta", {
        key: i,
        ...toReactProps(attrs)
      })
    );
  }
  renderLink() {
    const { link } = this.props;
    if (!link || !Array.isArray(link))
      return null;
    return link.map(
      (attrs, i) => React__default.createElement("link", {
        key: i,
        ...toReactProps(attrs)
      })
    );
  }
  renderScript() {
    const { script } = this.props;
    if (!script || !Array.isArray(script))
      return null;
    return script.map((attrs, i) => {
      const { innerHTML, ...rest } = attrs;
      const props = toReactProps(rest);
      if (innerHTML) {
        props.dangerouslySetInnerHTML = { __html: innerHTML };
      }
      return React__default.createElement("script", { key: i, ...props });
    });
  }
  renderStyle() {
    const { style } = this.props;
    if (!style || !Array.isArray(style))
      return null;
    return style.map((attrs, i) => {
      const { cssText, ...rest } = attrs;
      const props = toReactProps(rest);
      if (cssText) {
        props.dangerouslySetInnerHTML = { __html: cssText };
      }
      return React__default.createElement("style", { key: i, ...props });
    });
  }
  renderNoscript() {
    const { noscript } = this.props;
    if (!noscript || !Array.isArray(noscript))
      return null;
    return noscript.map((attrs, i) => {
      const { innerHTML, ...rest } = attrs;
      const props = toReactProps(rest);
      if (innerHTML) {
        props.dangerouslySetInnerHTML = { __html: innerHTML };
      }
      return React__default.createElement("noscript", { key: i, ...props });
    });
  }
  render() {
    return React__default.createElement(
      React__default.Fragment,
      null,
      this.renderTitle(),
      this.renderBase(),
      this.renderMeta(),
      this.renderLink(),
      this.renderScript(),
      this.renderStyle(),
      this.renderNoscript()
    );
  }
};
var Helmet = (_b = class extends Component {
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script":
      case "noscript":
        return {
          innerHTML: nestedChildren
        };
      case "style":
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren)
        }
      ]
    };
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title":
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps }
        };
      case "body":
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps }
        };
      case "html":
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps }
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps }
        };
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = { ...newProps };
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      };
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React__default.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const { children: nestedChildren, ...childProps } = child.props;
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)":
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link":
        case "meta":
        case "noscript":
        case "script":
        case "style":
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    if (isReact19) {
      return /* @__PURE__ */ React__default.createElement(React19Dispatcher, { ...newProps });
    }
    return helmetData ? /* @__PURE__ */ React__default.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ React__default.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React__default.createElement(HelmetDispatcher, { ...newProps, context }));
  }
}, __publicField(_b, "defaultProps", {
  defer: true,
  encodeSpecialCharacters: true,
  prioritizeSeoTags: false
}), _b);
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const SUPABASE_URL = "https://bwrzcaxpiyhnidwjpapt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cnpjYXhwaXlobmlkd2pwYXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzQ0MTQsImV4cCI6MjA3NDA1MDQxNH0.eYpQzQciIpNWFoYXHyvk4FcuDXfVGx8UTLu190TevPU";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : void 0,
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined"
  }
});
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("useAuth: Setting up auth state listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session2) => {
        console.log("useAuth: Auth state change event:", event, { user: !!(session2 == null ? void 0 : session2.user) });
        setSession(session2);
        setUser((session2 == null ? void 0 : session2.user) ?? null);
        if (session2 == null ? void 0 : session2.user) {
          const fetchProfile = async () => {
            try {
              console.log("useAuth: Fetching profile for user", session2.user.id);
              const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", session2.user.id).single();
              if (error) {
                console.log("useAuth: Profile fetch error", error);
                setUserProfile(null);
              } else {
                console.log("useAuth: Profile loaded", profile);
                setUserProfile(profile);
              }
            } catch (err) {
              console.log("useAuth: Profile fetch exception", err);
              setUserProfile(null);
            }
          };
          fetchProfile();
        } else {
          console.log("useAuth: No user session, clearing profile");
          setUserProfile(null);
        }
        setLoading(false);
      }
    );
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      console.log("useAuth: Initial session check", { user: !!(session2 == null ? void 0 : session2.user) });
      setSession(session2);
      setUser((session2 == null ? void 0 : session2.user) ?? null);
      if (!session2) {
        setLoading(false);
      }
    });
    return () => {
      console.log("useAuth: Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);
  const signUp = async (email, password, userData) => {
    const redirectUrl = `${window.location.origin}/membership`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    return { error };
  };
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };
  const signOut = async () => {
    try {
      console.log("useAuth: Starting sign out process");
      setUser(null);
      setSession(null);
      setUserProfile(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("useAuth: Sign out error (non-critical):", error.message);
        if (error.message.includes("session_not_found")) {
          console.log("useAuth: Session already cleared, sign out successful");
        }
      } else {
        console.log("useAuth: Sign out successful");
      }
    } catch (err) {
      console.log("useAuth: Sign out exception (non-critical):", err);
    }
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: {
    user,
    session,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut
  }, children });
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    console.warn("useAuth: AuthContext temporarily unavailable (likely HMR). Returning fallback.");
    return {
      user: null,
      session: null,
      userProfile: null,
      loading: true,
      signUp: async () => ({ error: new Error("Auth not ready") }),
      signIn: async () => ({ error: new Error("Auth not ready") }),
      signOut: async () => {
      }
    };
  }
  return context;
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-glow",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-glow",
        outline: "border border-border bg-transparent hover:bg-surface hover:border-primary/50 text-foreground",
        secondary: "bg-surface text-foreground hover:bg-surface/80 border border-border",
        ghost: "hover:bg-surface/50 text-muted-foreground hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        burgundy: "bg-red-900 text-white hover:bg-red-800 border-2 border-gray-200 font-semibold",
        teal: "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105",
        gold: "bg-gradient-to-r from-gold to-gold-light text-gold-foreground hover:from-gold-dark hover:to-gold shadow-lg hover:shadow-xl transition-all duration-300 font-semibold",
        red: "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:from-destructive/90 hover:to-destructive shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size: size2, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size: size2, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const useCredits = () => {
  const { user, userProfile } = useAuth();
  const [credits, setCredits] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCredits = async () => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from("user_credits").select("*").eq("user_id", user.id).maybeSingle();
      if (error) {
        console.error("Error fetching credits:", error);
        return;
      }
      setCredits(data);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };
  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      return;
    }
    try {
      const { data, error } = await supabase.from("user_subscriptions").select("*").eq("user_id", user.id).maybeSingle();
      if (error) {
        console.error("Error fetching subscription:", error);
        return;
      }
      setSubscription(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };
  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      return;
    }
    try {
      const { data, error } = await supabase.from("credit_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCredits(),
        fetchSubscription(),
        fetchTransactions()
      ]);
      setLoading(false);
    };
    loadData();
  }, [user]);
  const deductCredits = async (amount, description) => {
    if (!user || !credits) {
      toast$1.error("Please log in to use credits");
      return false;
    }
    if (credits.available_credits < amount) {
      toast$1.error(`Insufficient credits. You need ${amount} credits but only have ${credits.available_credits}.`);
      return false;
    }
    try {
      const { error: updateError } = await supabase.from("user_credits").update({
        used_credits: credits.used_credits + amount,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("user_id", user.id);
      if (updateError) {
        console.error("Error updating credits:", updateError);
        toast$1.error("Failed to deduct credits");
        return false;
      }
      const { error: transactionError } = await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount: -amount,
        transaction_type: "usage",
        description
      });
      if (transactionError) {
        console.error("Error recording transaction:", transactionError);
      }
      await fetchCredits();
      await fetchTransactions();
      return true;
    } catch (error) {
      console.error("Error deducting credits:", error);
      toast$1.error("Failed to deduct credits");
      return false;
    }
  };
  const addCredits = async (amount, source, stripePaymentId) => {
    if (!user || !credits) {
      return false;
    }
    try {
      const { error: updateError } = await supabase.from("user_credits").update({
        total_credits: credits.total_credits + amount,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("user_id", user.id);
      if (updateError) {
        console.error("Error adding credits:", updateError);
        return false;
      }
      const { error: transactionError } = await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount,
        transaction_type: source.includes("subscription") ? "subscription" : "purchase",
        description: source,
        stripe_payment_id: stripePaymentId
      });
      if (transactionError) {
        console.error("Error recording transaction:", transactionError);
      }
      await fetchCredits();
      await fetchTransactions();
      toast$1.success(`${amount} credits added to your account!`);
      return true;
    } catch (error) {
      console.error("Error adding credits:", error);
      return false;
    }
  };
  const hasEnoughCredits = (amount) => {
    return credits ? credits.available_credits >= amount : false;
  };
  return {
    credits,
    subscription,
    transactions,
    loading,
    fetchCredits,
    fetchSubscription,
    fetchTransactions,
    deductCredits,
    addCredits,
    hasEnoughCredits
  };
};
const fgLogo = "/assets/filmmaker-genius-logo-etPyjBIJ.png";
const TEAL$8 = "#00d4aa";
const TEAL_HOVER$3 = "#00f0c0";
const VIOLET = "#a855f7";
const VIOLET_HOVER = "#c084fc";
const GlobalLayout = ({ children }) => {
  var _a2, _b2, _c, _d;
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { credits } = useCredits();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hideLayout = location.pathname === "/admin-login";
  if (hideLayout) {
    return /* @__PURE__ */ jsx(Fragment, { children });
  }
  const navLinkClass = "text-[15px] font-medium text-white/65 hover:text-white transition-colors";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxs(
      "header",
      {
        className: "sticky top-0 backdrop-blur-[12px] border-b",
        style: {
          zIndex: 100,
          height: 96,
          background: "rgba(0,0,0,0.85)",
          borderBottomColor: "rgba(255,255,255,0.08)"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 h-full grid grid-cols-[1fr_auto_1fr] items-center gap-6", children: [
            /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center shrink-0 justify-self-start", children: /* @__PURE__ */ jsx("img", { src: fgLogo, alt: "Filmmaker Genius", className: "h-20 w-auto rounded-md" }) }),
            /* @__PURE__ */ jsxs("nav", { className: "hidden min-[600px]:flex items-center gap-8 justify-self-center", children: [
              /* @__PURE__ */ jsx(Link, { to: "/toolbox", className: navLinkClass, children: "Toolbox" }),
              /* @__PURE__ */ jsx(Link, { to: "/academy", className: navLinkClass, children: "Academy" }),
              /* @__PURE__ */ jsx(Link, { to: "/blog", className: navLinkClass, children: "Blog" }),
              /* @__PURE__ */ jsx(Link, { to: "/pricing", className: navLinkClass, children: "Membership" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 justify-self-end", children: [
              user ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Link, { to: "/membership", className: "hidden sm:block", children: /* @__PURE__ */ jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "border-[#00d4aa]/40 text-[#00d4aa] hover:bg-[#00d4aa]/10 transition-colors cursor-pointer flex items-center gap-1.5",
                    children: [
                      /* @__PURE__ */ jsx(Zap, { className: "h-3.5 w-3.5" }),
                      (credits == null ? void 0 : credits.available_credits) || 0,
                      " Credits"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-lg", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "h-8 w-8 rounded-full flex items-center justify-center",
                      style: { background: `linear-gradient(135deg, ${TEAL$8}, ${VIOLET})` },
                      children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-black", children: ((_a2 = userProfile == null ? void 0 : userProfile.first_name) == null ? void 0 : _a2[0]) || ((_c = (_b2 = user.email) == null ? void 0 : _b2[0]) == null ? void 0 : _c.toUpperCase()) || "U" })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "hidden md:block leading-tight", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: (userProfile == null ? void 0 : userProfile.first_name) || ((_d = user.email) == null ? void 0 : _d.split("@")[0]) }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-white/50", children: user.email })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "hidden min-[600px]:flex items-center gap-5", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/crew-hire",
                    className: "px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors",
                    style: { backgroundColor: VIOLET },
                    onMouseEnter: (e) => e.currentTarget.style.backgroundColor = VIOLET_HOVER,
                    onMouseLeave: (e) => e.currentTarget.style.backgroundColor = VIOLET,
                    children: "Crew Jobs"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "w-px h-5", style: { background: "rgba(255,255,255,0.12)" } }),
                /* @__PURE__ */ jsx(Link, { to: "/auth", className: "text-sm font-medium text-white/75 hover:text-white transition-colors", children: "Sign In" }),
                /* @__PURE__ */ jsx("div", { className: "w-px h-5", style: { background: "rgba(255,255,255,0.12)" } }),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/membership",
                    className: "px-4 py-2 rounded-md text-sm font-semibold text-black transition-colors",
                    style: { backgroundColor: TEAL$8 },
                    onMouseEnter: (e) => e.currentTarget.style.backgroundColor = TEAL_HOVER$3,
                    onMouseLeave: (e) => e.currentTarget.style.backgroundColor = TEAL$8,
                    children: "Get Started"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "min-[600px]:hidden text-white hover:bg-white/10",
                  onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                  children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
                }
              )
            ] })
          ] }),
          mobileMenuOpen && /* @__PURE__ */ jsx(
            "div",
            {
              className: "min-[600px]:hidden border-t",
              style: { background: "rgba(0,0,0,0.95)", borderTopColor: "rgba(255,255,255,0.08)" },
              children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-4 space-y-1", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/toolbox",
                    onClick: () => setMobileMenuOpen(false),
                    className: "block px-3 py-2 rounded-md text-sm font-medium text-white/75 hover:text-white hover:bg-white/5",
                    children: "Toolbox"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/academy",
                    onClick: () => setMobileMenuOpen(false),
                    className: "block px-3 py-2 rounded-md text-sm font-medium text-white/75 hover:text-white hover:bg-white/5",
                    children: "Academy"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/blog",
                    onClick: () => setMobileMenuOpen(false),
                    className: "block px-3 py-2 rounded-md text-sm font-medium text-white/75 hover:text-white hover:bg-white/5",
                    children: "Blog"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/pricing",
                    onClick: () => setMobileMenuOpen(false),
                    className: "block px-3 py-2 rounded-md text-sm font-medium text-white/75 hover:text-white hover:bg-white/5",
                    children: "Membership"
                  }
                ),
                user && /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/dashboard",
                    onClick: () => setMobileMenuOpen(false),
                    className: "block px-3 py-2 rounded-md text-sm font-medium text-white/75 hover:text-white hover:bg-white/5",
                    children: "Dashboard"
                  }
                ),
                !user && /* @__PURE__ */ jsxs("div", { className: "pt-3 mt-2 border-t border-white/10 flex flex-col gap-2", children: [
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/crew-hire",
                      onClick: () => setMobileMenuOpen(false),
                      className: "px-4 py-2 rounded-md text-sm font-semibold text-white text-center",
                      style: { backgroundColor: VIOLET },
                      children: "Crew Jobs"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/auth",
                      onClick: () => setMobileMenuOpen(false),
                      className: "px-4 py-2 rounded-md text-sm font-medium text-white/80 text-center border border-white/15",
                      children: "Sign In"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/membership",
                      onClick: () => setMobileMenuOpen(false),
                      className: "px-4 py-2 rounded-md text-sm font-semibold text-black text-center",
                      style: { backgroundColor: TEAL$8 },
                      children: "Get Started"
                    }
                  )
                ] })
              ] })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsx(
      "footer",
      {
        className: "border-t mt-auto",
        style: { background: "#080808", borderTopColor: "rgba(255,255,255,0.06)" },
        children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-10 flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsx("nav", { className: "flex flex-wrap justify-center gap-x-6 gap-y-2", children: [
            { label: "About", to: "/about" },
            { label: "Academy", to: "/academy" },
            { label: "Blog", to: "/blog" },
            { label: "Membership", to: "/membership" },
            { label: "Contact", to: "/contact" },
            { label: "FAQ", to: "/faq" }
          ].map((l) => /* @__PURE__ */ jsx(
            Link,
            {
              to: l.to,
              className: "text-sm text-white/65 hover:text-white transition-colors",
              children: l.label
            },
            l.to
          )) }),
          /* @__PURE__ */ jsx("div", { className: "my-6 h-px w-full", style: { background: "rgba(255,255,255,0.06)" } }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 w-full", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/50 flex items-center justify-center sm:justify-start", children: "© 2026 Filmmaker Genius" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center sm:items-end gap-3", children: [
              /* @__PURE__ */ jsx("img", { src: fgLogo, alt: "Filmmaker Genius", className: "h-12 w-auto rounded-md" }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
                /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "text-xs text-white/55 hover:text-white transition-colors", children: "Privacy Policy" }),
                /* @__PURE__ */ jsx(Link, { to: "/terms", className: "text-xs text-white/55 hover:text-white transition-colors", children: "Terms of Service" })
              ] })
            ] })
          ] })
        ] })
      }
    )
  ] });
};
const DEFAULT_IMAGE = "https://filmmakergenius.com/og-image.jpg";
const SITE_NAME = "Filmmaker Genius";
const BRAND_SUFFIXES = [
  " | Filmmaker Genius",
  " — Filmmaker Genius Academy",
  " — Filmmaker Genius"
];
const TITLE_MAX = 60;
const DESC_MAX = 160;
const DESC_SOFT = 148;
function normalizeTitle(raw2) {
  const t = (raw2 || "").trim();
  if (!t || t.length <= TITLE_MAX) return t;
  for (const suffix of BRAND_SUFFIXES) {
    if (t.endsWith(suffix)) {
      const stripped = t.slice(0, -suffix.length).trim().replace(/[—\-|]\s*$/, "").trim();
      if (stripped.length > 0) return stripped;
    }
  }
  return t;
}
function clampDescription(raw2) {
  const d = (raw2 || "").trim();
  if (d.length <= DESC_MAX) return d;
  const slice = d.slice(0, DESC_SOFT);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[\s.,;:!?—-]+$/, "") + "…";
}
function Seo({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "article",
  jsonLd
}) {
  const ldArray = jsonLd ? Array.isArray(jsonLd) ? jsonLd : [jsonLd] : [];
  const finalTitle = normalizeTitle(title);
  const finalDesc = clampDescription(description);
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: finalTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: finalDesc }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonical }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: finalTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: finalDesc }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: canonical }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: SITE_NAME }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: image }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: finalTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: finalDesc }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: image }),
    ldArray.map((obj, i) => /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(obj) }, i))
  ] });
}
const imgSceneAnalysis = "/assets/tool-script-analysis-new-BiY7WnKF.jpg";
const imgStoryboard = "/assets/tool-storyboard-DJdyK2rH.jpg";
const imgPitchDeck = "/assets/tool-pitch-deck-new-DOumyjBm.webp";
const imgCallSheet = "/assets/tool-call-sheet-C6LxJaWv.jpg";
const imgAuditions = "/assets/tool-auditions-Dhre6Jb1.jpg";
const imgCrewHire = "/assets/tool-crew-hire-BPwDQxLv.jpg";
const TEAL$7 = "#00d4aa";
const CtaPill = ({ label }) => /* @__PURE__ */ jsx(
  "span",
  {
    className: "text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors",
    style: { color: TEAL$7, borderColor: `${TEAL$7}66` },
    children: label
  }
);
const ToolCard$1 = ({
  card,
  aspect,
  className = ""
}) => {
  const ratioStyle = aspect === "tall" ? { height: "100%", minHeight: 300 } : { aspectRatio: aspect === "16/9" ? "16 / 9" : "16 / 10" };
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: card.to,
      className: `group relative flex flex-col overflow-hidden rounded-xl bg-[#111] border transition-all duration-200 hover:-translate-y-1 ${className}`,
      style: { borderColor: "rgba(255,255,255,0.08)" },
      onMouseEnter: (e) => e.currentTarget.style.borderColor = TEAL$7,
      onMouseLeave: (e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full overflow-hidden flex-1", style: ratioStyle, children: /* @__PURE__ */ jsx(
          "img",
          {
            src: card.img,
            alt: `${card.title} tool screenshot`,
            width: 800,
            height: aspect === "tall" ? 1e3 : aspect === "16/9" ? 450 : 500,
            loading: "lazy",
            decoding: "async",
            className: "w-full h-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-t", style: { borderTopColor: "rgba(255,255,255,0.06)" }, children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-white font-bold",
              style: { fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: 22 },
              children: card.title
            }
          ),
          /* @__PURE__ */ jsx(CtaPill, { label: card.cta })
        ] })
      ]
    }
  );
};
const HomeMarketing = () => {
  const sceneAnalysis = { title: "Scene Analysis", to: "/scene-analysis", cta: "Let's Go", img: imgSceneAnalysis };
  const storyboard = { title: "Storyboard Generator", to: "/storyboarding", cta: "Visualize", img: imgStoryboard };
  const pitchDeck = { title: "Pitch Deck Maker", to: "/pitch-deck", cta: "Create", img: imgPitchDeck };
  const callSheet = { title: "Call Sheet Generator", to: "/call-sheet", cta: "Build", img: imgCallSheet };
  const auditions = { title: "Auditions", to: "/upload-auditions", cta: "Post", img: imgAuditions };
  const crewHire = { title: "Crew Hire", to: "/crew-hire", cta: "Hire", img: imgCrewHire };
  return /* @__PURE__ */ jsxs("div", { style: { background: "#000" }, className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Filmmaker Genius — AI Tools & Training for Indie Film",
        description: "AI tools and step-by-step training for indie filmmakers — script and scene analysis, storyboards, pitch decks, funding, distribution, and a full academy.",
        canonical: "https://filmmakergenius.com/",
        type: "website",
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Filmmaker Genius",
            url: "https://filmmakergenius.com/",
            logo: "https://filmmakergenius.com/og-image.jpg",
            description: "AI tools and training for indie filmmakers — script analysis, storyboards, pitch decks, funding, distribution, and academy courses."
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Filmmaker Genius",
            url: "https://filmmakergenius.com/"
          }
        ]
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "flex flex-col items-center", style: { padding: "0 24px 44px" }, children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: fgLogo,
          alt: "Filmmaker Genius logo",
          decoding: "async",
          className: "h-auto",
          style: { width: "88%", maxWidth: 580, marginTop: 40 }
        }
      ),
      /* @__PURE__ */ jsx(
        "h1",
        {
          className: "text-white text-center",
          style: {
            textTransform: "uppercase",
            fontWeight: 300,
            letterSpacing: "0.14em",
            fontSize: 42,
            marginTop: 60,
            lineHeight: 1.15
          },
          children: "Every Tool You Need — One Place."
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { style: { background: "#050505", padding: "44px 24px 72px" }, children: /* @__PURE__ */ jsxs("div", { className: "mx-auto", style: { maxWidth: 1040 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 min-[960px]:grid-cols-[1fr_337px] gap-[14px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[14px]", children: [
          /* @__PURE__ */ jsx(ToolCard$1, { card: sceneAnalysis, aspect: "16/9" }),
          /* @__PURE__ */ jsx(ToolCard$1, { card: storyboard, aspect: "16/9" })
        ] }),
        /* @__PURE__ */ jsx(ToolCard$1, { card: pitchDeck, aspect: "tall", className: "h-full" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-[14px] mt-[14px]", children: [
        /* @__PURE__ */ jsx(ToolCard$1, { card: callSheet, aspect: "16/10" }),
        /* @__PURE__ */ jsx(ToolCard$1, { card: auditions, aspect: "16/10" }),
        /* @__PURE__ */ jsx(ToolCard$1, { card: crewHire, aspect: "16/10" })
      ] })
    ] }) })
  ] });
};
const willRobertsPhoto = "/assets/will-roberts-CjW-MOnm.webp";
const salFramondiPhoto = "/assets/sal-framondi-bnwkzMLy.webp";
const TEAL$6 = "#00d4aa";
const TEAL_HOVER$2 = "#00f0c0";
const MEMBERS = [
  {
    photo: willRobertsPhoto,
    alt: "Will Roberts, Co-Founder of Filmmaker Genius",
    sameAs: ["https://www.imdb.com/name/nm5659247/"],
    name: "Will Roberts",
    title: "Co-Founder",
    role: "CO-FOUNDER",
    tagline: "Actor • Business Coach • Keynote Speaker",
    bio: [
      /* @__PURE__ */ jsxs(Fragment, { children: [
        "For over 35 years, I've lived and breathed the art of performance. From the stages of Cirque du Soleil to the film set of ",
        /* @__PURE__ */ jsx("em", { style: { fontStyle: "italic" }, children: "Oppenheimer" }),
        ", from musical theater to dramatic television, my journey has taken me through every corner of the entertainment industry."
      ] }),
      /* @__PURE__ */ jsxs(Fragment, { children: [
        "As a ",
        /* @__PURE__ */ jsx("strong", { style: { color: "#fff", fontWeight: 600 }, children: "SAG Award Winner" }),
        " and ",
        /* @__PURE__ */ jsx("strong", { style: { color: "#fff", fontWeight: 600 }, children: "People's Choice Award Winner" }),
        " with 60+ film and television credits, I understand what it takes to succeed in this business — not just as an artist, but as a professional navigating an ever-changing industry."
      ] }),
      /* @__PURE__ */ jsxs(Fragment, { children: [
        "Today, I combine my decades of on-set experience with cutting-edge technology to help actors, filmmakers, and industry professionals not just survive, but thrive. As the creator of ",
        /* @__PURE__ */ jsx("strong", { style: { color: "#fff", fontWeight: 600 }, children: "The Actors Toolbox" }),
        ", I'm bringing professional tools and coaching to artists around the world."
      ] })
    ],
    links: [
      { label: "View on IMDb ↗", href: "https://www.imdb.com/name/nm5659247/", variant: "teal", external: true }
    ]
  },
  {
    photo: salFramondiPhoto,
    alt: "Sal Framondi, Co-Founder of Filmmaker Genius",
    sameAs: ["https://www.linkedin.com/in/salframondi/"],
    name: "Sal Framondi",
    title: "Co-Founder",
    role: "CO-FOUNDER",
    tagline: "Producer • Entrepreneur",
    reversed: true,
    isLast: true,
    bio: [
      /* @__PURE__ */ jsx(Fragment, { children: "Sal spent years as an actor working the LA, New York, and Boston markets. He knows firsthand what it costs — in time, money, and resilience — to chase a career that doesn't break your way. That experience never left him, and it shaped everything he built after." }),
      /* @__PURE__ */ jsxs(Fragment, { children: [
        "Before returning to the entertainment industry, Sal built and led ",
        /* @__PURE__ */ jsx("strong", { style: { color: "#fff", fontWeight: 600 }, children: "Strategic Tax Resolutions" }),
        " — a 40-person tax resolution firm in a 7,000 sq. ft. facility in Carlsbad, California — generating more than $1 million in quarterly revenue while overseeing all sales, marketing, and operations. He previously built and operated a successful business in financial services as well."
      ] }),
      /* @__PURE__ */ jsxs(Fragment, { children: [
        "Sal founded ",
        /* @__PURE__ */ jsx("strong", { style: { color: "#fff", fontWeight: 600 }, children: "OPPRIME.tv" }),
        ", an independent video-on-demand platform with over 1,200 films in its library, and spent the next decade working directly with more than 1,500 independent filmmakers on marketing, distribution, and monetization strategies. Those years gave him firsthand insight into the obstacles filmmakers face at every stage — from production and distribution to audience growth and revenue generation."
      ] }),
      /* @__PURE__ */ jsx(Fragment, { children: "The lessons from OPPRIME.tv became the foundation for Post Hollywood and its family of companies, all focused on helping actors and filmmakers build sustainable careers through practical tools, education, and opportunity." })
    ],
    links: []
  }
];
function PhotoCard({ photo, alt, name, title }) {
  return /* @__PURE__ */ jsxs("div", { style: {
    borderRadius: 20,
    overflow: "hidden",
    background: "#0d0d1a",
    border: "1px solid #1e1e35",
    aspectRatio: "3 / 4",
    maxWidth: 420,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24
  }, children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: photo,
        alt,
        width: 220,
        height: 220,
        loading: "lazy",
        decoding: "async",
        style: {
          width: 220,
          height: 220,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid rgba(0,212,170,0.3)",
          boxShadow: "0 0 40px rgba(0,212,170,0.15)",
          background: "rgba(0,212,170,0.1)"
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { style: { fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 600 }, children: name }),
    /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.2)" }, children: title })
  ] });
}
function MemberBlock({ m }) {
  const photo = /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx(PhotoCard, { photo: m.photo, alt: m.alt, name: m.name, title: m.title }) });
  const info = /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { style: { fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL$6, marginBottom: 10 }, children: m.role }),
    /* @__PURE__ */ jsx("h2", { className: "about-name", style: { fontFamily: "'Fraunces', serif", fontSize: 36, lineHeight: 1.1, margin: 0, fontWeight: 700 }, children: m.name }),
    /* @__PURE__ */ jsx("div", { style: { fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 8, fontWeight: 500 }, children: m.tagline }),
    /* @__PURE__ */ jsx("div", { style: { marginTop: 24, display: "flex", flexDirection: "column", gap: 16, fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }, children: m.bio.map((p, i) => /* @__PURE__ */ jsx("p", { style: { margin: 0 }, children: p }, i)) }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }, children: m.links.map((l, i) => {
      const teal = l.variant === "teal";
      const style = {
        height: 44,
        padding: "0 24px",
        borderRadius: 9999,
        fontSize: 14,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
        border: teal ? "none" : "1px solid rgba(255,255,255,0.15)",
        background: teal ? TEAL$6 : "rgba(255,255,255,0.05)",
        color: teal ? "#000" : "#fff",
        transition: "background 0.2s",
        fontFamily: "inherit"
      };
      return /* @__PURE__ */ jsx(
        "a",
        {
          href: l.href,
          target: l.external ? "_blank" : void 0,
          rel: l.external ? "noopener noreferrer" : void 0,
          style,
          className: teal ? "about-btn-teal" : "about-btn-outline",
          children: l.label
        },
        i
      );
    }) })
  ] });
  return /* @__PURE__ */ jsx("div", { style: {
    paddingBottom: m.isLast ? 0 : 80,
    marginBottom: m.isLast ? 0 : 80,
    borderBottom: m.isLast ? "none" : "1px solid #1e1e35"
  }, children: /* @__PURE__ */ jsx("div", { className: "about-member-grid", children: m.reversed ? /* @__PURE__ */ jsxs(Fragment, { children: [
    info,
    photo
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    photo,
    info
  ] }) }) });
}
function About() {
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "About Filmmaker Genius — Built by Working Filmmakers",
        description: "Meet the team behind Filmmaker Genius: SAG Award winner Will Roberts and OPPRIME.tv founder Sal Framondi.",
        canonical: "https://filmmakergenius.com/about",
        jsonLd: MEMBERS.map((m) => ({
          "@context": "https://schema.org",
          "@type": "Person",
          name: m.name,
          jobTitle: "Co-Founder",
          image: `https://filmmakergenius.com${m.photo}`,
          worksFor: { "@type": "Organization", name: "Filmmaker Genius" },
          sameAs: m.sameAs
        }))
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .about-h1 { font-size: 52px; }
        @media (min-width: 640px) { .about-h1 { font-size: 68px; } }
        .about-member-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
        @media (min-width: 720px) {
          .about-member-grid { grid-template-columns: 1fr 1fr; gap: 72px; }
        }
        @media (min-width: 900px) {
          .about-name { font-size: 44px !important; }
        }
        .about-btn-teal:hover { background: ${TEAL_HOVER$2} !important; }
        .about-btn-outline:hover { background: rgba(255,255,255,0.1) !important; }
      ` }),
    /* @__PURE__ */ jsxs("section", { style: { position: "relative", overflow: "hidden", padding: "72px 24px 56px", borderBottom: "1px solid #1e1e35", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 700,
        height: 500,
        filter: "blur(80px)",
        opacity: 0.13,
        background: "radial-gradient(ellipse at center, rgba(0,212,170,0.6) 0%, transparent 70%)",
        pointerEvents: "none"
      } }),
      /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
        /* @__PURE__ */ jsxs("h1", { className: "about-h1", style: { fontFamily: "'Fraunces', serif", lineHeight: 1.1, margin: 0, fontWeight: 700 }, children: [
          "Meet the ",
          /* @__PURE__ */ jsx("span", { style: { color: TEAL$6 }, children: "Team" })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 16, fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }, children: "Professional actors and creators dedicated to helping you succeed in the entertainment industry." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { maxWidth: 1120, margin: "0 auto", padding: "80px 24px 96px" }, children: MEMBERS.map((m) => /* @__PURE__ */ jsx(MemberBlock, { m }, m.name)) })
  ] });
}
const TEAL$5 = "#00d4aa";
const TEAL_HOVER$1 = "#00f0c0";
const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid #1e1e35",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 14,
  color: "#fff",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box"
};
const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(255,255,255,0.35)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 8
};
function Field({ label, children }) {
  return /* @__PURE__ */ jsxs("div", { style: { marginBottom: 18 }, children: [
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: label }),
    children
  ] });
}
function QrPlaceholder() {
  return /* @__PURE__ */ jsx("div", { style: {
    width: 120,
    height: 120,
    background: "#fff",
    borderRadius: 8,
    padding: 8,
    boxSizing: "border-box"
  }, children: /* @__PURE__ */ jsx("div", { style: {
    width: "100%",
    height: "100%",
    backgroundImage: `repeating-linear-gradient(0deg, #000 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, #000 0 6px, transparent 6px 12px)`,
    backgroundSize: "12px 12px",
    opacity: 0.85,
    borderRadius: 2
  } }) });
}
function Contact() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const submit = (e) => {
    e.preventDefault();
    alert("Thanks! We'll get back to you within 24 hours.");
    setFirst("");
    setLast("");
    setEmail("");
    setSubject("");
    setMessage("");
  };
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Contact Filmmaker Genius — Support, Sales & Feedback",
        description: "Get in touch with the Filmmaker Genius team for product support, partnership questions, feature requests, and press inquiries.",
        canonical: "https://filmmakergenius.com/contact"
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .contact-h1 { font-size: 52px; }
        @media (min-width: 640px) { .contact-h1 { font-size: 68px; } }
        .contact-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 560px) { .contact-cards { grid-template-columns: 1fr; } }
        .contact-name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .contact-name-row { grid-template-columns: 1fr; } }
        .contact-card:hover { border-color: rgba(0,212,170,0.35) !important; }
        .contact-qr:hover { border-color: rgba(0,212,170,0.3) !important; }
        .contact-input:focus { border-color: rgba(0,212,170,0.5) !important; }
        .contact-btn-teal:hover { background: ${TEAL_HOVER$1} !important; }
        .contact-btn-outline:hover { background: rgba(0,212,170,0.1) !important; }
      ` }),
    /* @__PURE__ */ jsxs("section", { style: { position: "relative", overflow: "hidden", padding: "72px 24px 56px", borderBottom: "1px solid #1e1e35", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 700,
        height: 500,
        filter: "blur(80px)",
        opacity: 0.13,
        background: "radial-gradient(ellipse at center, rgba(0,212,170,0.6) 0%, transparent 70%)",
        pointerEvents: "none"
      } }),
      /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
        /* @__PURE__ */ jsxs("h1", { className: "contact-h1", style: { fontFamily: "'Fraunces', serif", lineHeight: 1.1, margin: 0, fontWeight: 700 }, children: [
          "Contact ",
          /* @__PURE__ */ jsx("span", { style: { color: TEAL$5 }, children: "Us" })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 14, fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 500, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }, children: "Have questions about our tools or membership? Need technical support? Want to discuss your project? We're here to help." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { maxWidth: 760, margin: "64px auto 0", padding: "0 24px" }, children: /* @__PURE__ */ jsx("div", { className: "contact-cards", children: [
      { icon: "✉️", h: "Email Support", sub: "Get help via email within 24 hours", value: "sal@filmmakergenius.com", btn: "Send Email", href: "mailto:sal@filmmakergenius.com" },
      { icon: "📞", h: "Phone Support", sub: "Talk to our team during business hours", value: "702-481-5829", btn: "Call Now", href: "tel:7024815829" }
    ].map((c) => /* @__PURE__ */ jsxs("div", { className: "contact-card", style: {
      background: "#0d0d1a",
      border: "1px solid #1e1e35",
      borderRadius: 20,
      padding: 36,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      transition: "border-color 0.2s"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        width: 52,
        height: 52,
        borderRadius: 14,
        background: "rgba(0,212,170,0.1)",
        border: "1px solid rgba(0,212,170,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        marginBottom: 16
      }, children: c.icon }),
      /* @__PURE__ */ jsx("h2", { style: { fontSize: 18, fontWeight: 700, margin: 0 }, children: c.h }),
      /* @__PURE__ */ jsx("div", { style: { marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.4)" }, children: c.sub }),
      /* @__PURE__ */ jsx("div", { style: { marginTop: 12, fontSize: 15, fontWeight: 600, color: TEAL$5 }, children: c.value }),
      /* @__PURE__ */ jsx("a", { href: c.href, className: "contact-btn-teal", style: {
        marginTop: 20,
        width: "100%",
        height: 44,
        borderRadius: 10,
        background: TEAL$5,
        color: "#000",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        transition: "background 0.2s"
      }, children: c.btn })
    ] }, c.h)) }) }),
    /* @__PURE__ */ jsxs("section", { style: { maxWidth: 560, margin: "72px auto 0", padding: "0 24px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "'Fraunces', serif", fontSize: 28, margin: 0, fontWeight: 700 }, children: [
        "Scan to ",
        /* @__PURE__ */ jsx("span", { style: { color: TEAL$5 }, children: "Connect" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }, children: [
        { label: "Visit Our Website", sub: "filmmakergenius.com" },
        { label: "Follow Us", sub: "Social media placeholder" }
      ].map((q) => /* @__PURE__ */ jsxs("div", { className: "contact-qr", style: {
        background: "#0d0d1a",
        border: "1px solid #1e1e35",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transition: "border-color 0.2s"
      }, children: [
        /* @__PURE__ */ jsx(QrPlaceholder, {}),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 14, fontWeight: 700 }, children: q.label }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)" }, children: q.sub })
      ] }, q.label)) })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { maxWidth: 680, margin: "72px auto 0", padding: "0 24px" }, children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, style: {
      background: "#0d0d1a",
      border: "1px solid #1e1e35",
      borderRadius: 20,
      padding: 40
    }, children: [
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "'Fraunces', serif", fontSize: 24, margin: 0, textAlign: "center", fontWeight: 700 }, children: "Send us a Message" }),
      /* @__PURE__ */ jsx("div", { style: { textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 6, marginBottom: 28 }, children: "We'll get back to you within 24 hours" }),
      /* @__PURE__ */ jsxs("div", { className: "contact-name-row", style: { marginBottom: 18 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "First Name" }),
          /* @__PURE__ */ jsx("input", { className: "contact-input", style: inputStyle, value: first, onChange: (e) => setFirst(e.target.value), placeholder: "Jane" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Last Name" }),
          /* @__PURE__ */ jsx("input", { className: "contact-input", style: inputStyle, value: last, onChange: (e) => setLast(e.target.value), placeholder: "Smith" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Field, { label: "Email", children: /* @__PURE__ */ jsx("input", { type: "email", className: "contact-input", style: inputStyle, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "jane@example.com" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Subject", children: /* @__PURE__ */ jsx("input", { className: "contact-input", style: inputStyle, value: subject, onChange: (e) => setSubject(e.target.value), placeholder: "How can we help you?" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Message", children: /* @__PURE__ */ jsx(
        "textarea",
        {
          className: "contact-input",
          style: { ...inputStyle, minHeight: 130, resize: "vertical" },
          value: message,
          onChange: (e) => setMessage(e.target.value),
          placeholder: "Tell us more about your inquiry..."
        }
      ) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "contact-btn-teal",
          style: {
            width: "100%",
            height: 50,
            borderRadius: 12,
            background: TEAL$5,
            color: "#000",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            marginTop: 4,
            transition: "background 0.2s"
          },
          children: "Send Message"
        }
      )
    ] }) })
  ] });
}
const TEAL$4 = "#00d4aa";
const TEAL_HOVER = "#00f0c0";
const FAQS = [
  {
    q: "What are credits and how do they work?",
    a: `Credits are what you spend to run the AI tools. Every plan comes with a monthly allowance — Basic gives you 50, Pro gives you 100 — and they reset each month.

Different tools cost different amounts: Scene Analysis is 3 credits, Script Analysis is 5, a Storyboard frame is 10, and a document upload is 2.

If you run low, you can buy more in packs of 25, 50, 100, or 250. Purchased credits never expire and stack on top of your monthly allowance.`
  },
  {
    q: "Do my scripts, project files, and footage stay private?",
    a: `Yes. Your work is yours. We do not sell your content. We do not license it. We do not share it with other users, advertisers, or data brokers — ever. We do not use your scripts, footage, or project files to train AI models.

The only time your content leaves our systems is when you actively run an AI tool on it — the text is sent to our AI processing partner solely to generate your result, and for no other purpose.

When you delete a file, it's gone. Permanently, from our systems. We don't keep a copy "just in case."`
  },
  {
    q: "What is the difference between the Basic and Pro plans?",
    a: `Basic is $19.99 a month and gives you 50 credits, AI Script Analysis, Storyboard Generation, Scene Breakdown, PDF export, and standard support.

Pro is $24.99 a month and gives you everything in Basic plus double the credits (100), priority support, advanced analytics, custom branding, and early access to new features.

If you're working on one project at a time, Basic is usually enough. If you're running multiple productions, Pro pays for itself in credits alone.`
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: `Yes. Anytime, for any reason, with no notice period, no cancellation fee, and no phone call to some retention specialist. One click in your account settings and you're done.

You keep full access until the end of the billing period you've already paid for. You will not be charged again. Any credits you purchased outright are yours and don't expire.`
  },
  {
    q: "Are the AI tools a replacement for professional services or a supplement?",
    a: `A supplement. Full stop.

These tools handle the work that eats your hours — breaking down a script, generating a storyboard, hearing your dialogue read aloud, building a call sheet. They give you a fast, cheap first pass so you can spend your real time on the decisions only a filmmaker can make.

They are not a replacement for a working cinematographer, a real editor, a script consultant, or an experienced producer sitting across the table from you. No AI has ever been on a set at 2am when the location fell through. Use these tools to move faster and arrive better prepared — not to skip the people who make films good.`
  },
  {
    q: "Is my payment information secure?",
    a: `Yes. Payments are handled by Stripe, one of the most trusted payment processors in the world — the same infrastructure used by Amazon, Google, and Shopify.

Your card number never touches our servers. We never see it, never store it, and couldn't retrieve it if we tried. Stripe is PCI-DSS Level 1 certified — the highest level of payment security that exists.`
  }
];
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a }
  }))
};
function FAQ() {
  const [open, setOpen] = useState(null);
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "FAQ — Filmmaker Genius: Answers for Indie Filmmakers",
        description: "Answers to common questions about Filmmaker Genius: pricing, credits, tools, the academy, exports, and how filmmakers use the platform on real productions.",
        canonical: "https://filmmakergenius.com/faq",
        jsonLd: faqJsonLd
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .faq-q { transition: background 0.15s, color 0.15s; }
        .faq-q:hover { background: #111122; }
        .faq-chev { transition: transform 0.2s, color 0.2s; display: inline-block; }
        .faq-btn-teal:hover { background: ${TEAL_HOVER} !important; }
        .faq-answer {
          overflow: hidden;
          max-height: 0;
          visibility: hidden;
          transition: max-height 0.25s ease, visibility 0s linear 0.25s;
        }
        .faq-answer.is-open {
          max-height: 2000px;
          visibility: visible;
          transition: max-height 0.35s ease, visibility 0s;
        }
        .faq-answer-inner p { margin: 0 0 12px; }
        .faq-answer-inner p:last-child { margin-bottom: 0; }
      ` }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 760, margin: "0 auto", padding: "72px 24px 96px" }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: TEAL$4,
        marginBottom: 14
      }, children: "Support" }),
      /* @__PURE__ */ jsx("h1", { style: {
        fontFamily: "'Fraunces', serif",
        fontSize: "2.4em",
        fontWeight: 700,
        letterSpacing: "-0.03em",
        lineHeight: 1.1,
        marginBottom: 16,
        margin: 0
      }, children: "Frequently Asked Questions" }),
      /* @__PURE__ */ jsx("p", { style: {
        fontSize: "1em",
        color: "rgba(255,255,255,0.45)",
        lineHeight: 1.6,
        maxWidth: 560,
        marginTop: 16,
        marginBottom: 56
      }, children: "Quick answers about our tools, credits, membership, and privacy. Don't see your question? Reach out below." }),
      /* @__PURE__ */ jsx("div", { style: {
        border: "1px solid #1e1e35",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 48
      }, children: FAQS.map(({ q, a }, i) => {
        const isOpen = open === i;
        const isLast = i === FAQS.length - 1;
        const paragraphs = a.split(/\n\n+/);
        return /* @__PURE__ */ jsxs("div", { style: { borderBottom: isLast ? "none" : "1px solid #1e1e35" }, children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "faq-q",
              onClick: () => setOpen(isOpen ? null : i),
              "aria-expanded": isOpen,
              style: {
                width: "100%",
                background: isOpen ? "#111122" : "#0d0d1a",
                color: isOpen ? TEAL$4 : "#fff",
                border: "none",
                fontSize: "0.95em",
                fontWeight: 600,
                textAlign: "left",
                padding: "22px 24px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                fontFamily: "inherit"
              },
              children: [
                /* @__PURE__ */ jsx("span", { children: q }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "faq-chev",
                    style: {
                      fontSize: 18,
                      color: isOpen ? TEAL$4 : "rgba(255,255,255,0.3)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                    },
                    children: "⌄"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: `faq-answer${isOpen ? " is-open" : ""}`, children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "faq-answer-inner",
              style: {
                background: "#0a0a12",
                padding: "18px 24px 22px",
                borderTop: "1px solid #1e1e35",
                fontSize: "0.9em",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.75
              },
              children: paragraphs.map((p, j) => /* @__PURE__ */ jsx("p", { children: p }, j))
            }
          ) })
        ] }, i);
      }) })
    ] })
  ] });
}
const basicFeatures = [
  "50 monthly credits",
  "AI Script Analysis",
  "Storyboard Generation",
  "Scene Breakdown",
  "Basic Support",
  "Export to PDF"
];
const proFeatures = [
  "100 monthly credits",
  "Everything in Basic",
  "Priority Support",
  "Advanced Analytics",
  "Early Access to Features",
  "Custom Branding"
];
const creditCosts = [
  "Script Analysis: 5 credits",
  "Scene Analysis: 3 credits",
  "Storyboard Frame: 10 credits",
  "Document Upload / OCR: 2 credits"
];
const benefits = [
  "Credits never expire",
  "Use across all tools",
  "Monthly subscription credits reset",
  "Purchased credits stack with subscription"
];
const Check = () => /* @__PURE__ */ jsx("span", { style: { color: "#00d4aa", fontWeight: 700, flexShrink: 0 }, children: "✓" });
const Bullet = () => /* @__PURE__ */ jsx("span", { style: { color: "#00d4aa", fontWeight: 700, flexShrink: 0 }, children: "•" });
const Pricing = () => {
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Membership & Pricing — Filmmaker Genius",
        description: "Simple membership and pricing for indie filmmakers: Basic and Pro monthly plans with credits for AI script analysis, storyboards, scene breakdowns, and PDF exports.",
        canonical: "https://filmmakergenius.com/pricing"
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .pr-card:hover { border-color: #2e2e50 !important; }
        .pr-btn-basic:hover { background: #222240 !important; }
        .pr-btn-pro:hover { background: #00f0c0 !important; }
        .pr-btn-purchase:hover { background: #222240 !important; }
        @media (max-width: 720px) {
          .pr-plan-grid { grid-template-columns: 1fr !important; }
          .pr-credits-grid { grid-template-columns: 1fr !important; }
          .pr-credits-header { flex-direction: column !important; align-items: flex-start !important; }
        }
      ` }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", style: { paddingTop: 18, paddingBottom: 0 }, children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        style: {
          display: "inline-block",
          fontSize: 13,
          color: "#9ab1c2",
          textDecoration: "none",
          transition: "color 0.15s"
        },
        onMouseEnter: (e) => e.currentTarget.style.color = "#fff",
        onMouseLeave: (e) => e.currentTarget.style.color = "#9ab1c2",
        children: "← Back to Filmmaker Genius"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1100, margin: "0 auto", padding: "48px 48px 80px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 56 }, children: [
        /* @__PURE__ */ jsx("h1", { style: { fontSize: "2.4em", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }, children: "Choose Your Plan" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "1.05em", color: "#888", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }, children: "Unlock powerful filmmaking tools with our flexible pricing options" })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "pr-plan-grid",
          style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 56 },
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "pr-card",
                style: {
                  background: "#0d0d1a",
                  border: "1px solid #1e1e35",
                  borderRadius: 12,
                  padding: 36,
                  position: "relative"
                },
                children: [
                  /* @__PURE__ */ jsx("div", { style: { fontSize: "1.15em", fontWeight: 700, marginBottom: 8 }, children: "Basic Plan" }),
                  /* @__PURE__ */ jsxs("div", { style: { fontSize: "2.6em", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 4 }, children: [
                    "$19.99",
                    /* @__PURE__ */ jsx("span", { style: { fontSize: "0.4em", fontWeight: 500, color: "#666" }, children: "/month" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { style: { fontSize: "0.85em", color: "#00d4aa", fontWeight: 600, marginBottom: 28 }, children: "50 credits per month" }),
                  /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: 12 }, children: basicFeatures.map((f) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.9em", color: "#bbb" }, children: [
                    /* @__PURE__ */ jsx(Check, {}),
                    " ",
                    /* @__PURE__ */ jsx("span", { children: f })
                  ] }, f)) }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/membership",
                      className: "pr-btn-basic",
                      style: {
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: 14,
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: "0.9em",
                        background: "#1a1a2e",
                        color: "#fff",
                        border: "1px solid #2e2e50",
                        textDecoration: "none",
                        boxSizing: "border-box",
                        transition: "background 0.15s"
                      },
                      children: "Subscribe to Basic Plan"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "pr-card",
                style: {
                  background: "#0d0d1a",
                  border: "1px solid #00d4aa",
                  borderRadius: 12,
                  padding: 36,
                  position: "relative",
                  boxShadow: "0 0 0 1px rgba(0,212,170,0.13), 0 0 32px rgba(0,212,170,0.07)"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        top: -13,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#00d4aa",
                        color: "#000",
                        fontSize: "0.72em",
                        fontWeight: 800,
                        padding: "4px 16px",
                        borderRadius: 20,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      },
                      children: "Most Popular"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { style: { fontSize: "1.15em", fontWeight: 700, marginBottom: 8 }, children: "Pro Plan" }),
                  /* @__PURE__ */ jsxs("div", { style: { fontSize: "2.6em", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 4 }, children: [
                    "$24.99",
                    /* @__PURE__ */ jsx("span", { style: { fontSize: "0.4em", fontWeight: 500, color: "#666" }, children: "/month" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { style: { fontSize: "0.85em", color: "#00d4aa", fontWeight: 600, marginBottom: 28 }, children: "100 credits per month" }),
                  /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: 12 }, children: proFeatures.map((f) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.9em", color: "#bbb" }, children: [
                    /* @__PURE__ */ jsx(Check, {}),
                    " ",
                    /* @__PURE__ */ jsx("span", { children: f })
                  ] }, f)) }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/membership",
                      className: "pr-btn-pro",
                      style: {
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: 14,
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: "0.9em",
                        background: "#00d4aa",
                        color: "#000",
                        textDecoration: "none",
                        boxSizing: "border-box",
                        transition: "background 0.15s"
                      },
                      children: "Subscribe to Pro Plan"
                    }
                  )
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            background: "#0d0d1a",
            border: "1px solid #1e1e35",
            borderRadius: 12,
            padding: 36,
            marginBottom: 32
          },
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "pr-credits-header",
              style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" },
              children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.25em", fontWeight: 700, marginBottom: 6 }, children: "Need More Credits?" }),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.875em", color: "#666" }, children: "Purchase additional credits anytime. Credits never expire!" })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      defaultValue: "",
                      style: {
                        background: "#0a0a12",
                        border: "1px solid #2a2a3a",
                        color: "#fff",
                        padding: "10px 16px",
                        borderRadius: 6,
                        fontFamily: "inherit",
                        fontSize: "0.9em"
                      },
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Choose credit amount" }),
                        /* @__PURE__ */ jsx("option", { children: "25 Credits" }),
                        /* @__PURE__ */ jsx("option", { children: "50 Credits" }),
                        /* @__PURE__ */ jsx("option", { children: "100 Credits" }),
                        /* @__PURE__ */ jsx("option", { children: "250 Credits" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/membership",
                      className: "pr-btn-purchase",
                      style: {
                        display: "inline-flex",
                        alignItems: "center",
                        background: "#1a1a2e",
                        color: "#fff",
                        border: "1px solid #2e2e50",
                        padding: "10px 20px",
                        borderRadius: 6,
                        fontWeight: 600,
                        fontFamily: "inherit",
                        fontSize: "0.9em",
                        textDecoration: "none",
                        transition: "background 0.15s"
                      },
                      children: "Purchase Credits"
                    }
                  )
                ] })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 12, padding: 36 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { fontSize: "1.25em", fontWeight: 700 }, children: "How Credits Work" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "0.85em", color: "#555", marginBottom: 28 }, children: "Understanding our credit system" }),
        /* @__PURE__ */ jsxs("div", { className: "pr-credits-grid", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  textTransform: "uppercase",
                  fontSize: "0.8em",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#555",
                  marginBottom: 16
                },
                children: "Credit Costs"
              }
            ),
            /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }, children: creditCosts.map((c) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.875em", color: "#aaa" }, children: [
              /* @__PURE__ */ jsx(Bullet, {}),
              " ",
              /* @__PURE__ */ jsx("span", { children: c })
            ] }, c)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  textTransform: "uppercase",
                  fontSize: "0.8em",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#555",
                  marginBottom: 16
                },
                children: "Benefits"
              }
            ),
            /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }, children: benefits.map((b) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.875em", color: "#aaa" }, children: [
              /* @__PURE__ */ jsx(Bullet, {}),
              " ",
              /* @__PURE__ */ jsx("span", { children: b })
            ] }, b)) })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const TEAL$3 = "#00d4aa";
const SECTIONS$1 = [
  {
    h: "The short version",
    body: `We do not sell your content. We do not license it. We do not share it with other users, advertisers, or data brokers. We do not use your scripts, footage, or project files to train AI models. When you delete something, it's gone. Your card number never touches our servers. You can leave whenever you want and take your work with you.

Everything below is the detail behind those promises.`
  },
  {
    h: "What we collect",
    body: `Account information — your name, email address, and password (stored encrypted; we cannot read it).
Content you upload — scripts, documents, images, footage, and anything else you bring to the platform to work on.
Usage information — which tools you used and how many credits you spent, so we can bill you correctly and keep the service running.
Payment information — handled entirely by Stripe. We never see or store your card number.
Technical information — basic log data such as IP address and browser type, used for security and to diagnose problems.`
  },
  {
    h: "What we do with your content",
    body: `We use it to do exactly what you asked us to do, and nothing else.

When you run an AI tool — a script analysis, a scene breakdown, a table read — the relevant text is sent to our AI processing partner to generate your result. That is the only time your content leaves our systems. It is used solely to produce your output. It is not stored by them for any other purpose, and it is not used to train their models.

We do not read your scripts for fun. We do not have a team browsing your footage. Your work is not a product we sell.`
  },
  {
    h: "What we will never do",
    body: `We will never sell your content or your personal data. Not to advertisers, not to data brokers, not to anyone, at any price.
We will never license your work to a third party.
We will never use your scripts, footage, or projects to train an AI model — ours or anyone else's.
We will never show your private work to another user.
We will never claim ownership of anything you create. It's yours. It was always yours.`
  },
  {
    h: "Deletion — and we mean it",
    body: `When you delete a file, it is removed from our systems. Permanently. We do not keep a quiet backup "just in case."

If you close your account, your content goes with it. You can request full deletion at any time by contacting us, and we will confirm when it's done.

The only exception is information we are legally required to retain — for example, basic billing records that tax law requires us to keep. That does not include your creative work.`
  },
  {
    h: "Payments",
    body: `Payments are processed by Stripe, one of the most trusted payment processors in the world — the same infrastructure behind Amazon, Google, and Shopify.

Your card number never touches our servers. We never see it, never store it, and could not retrieve it if we tried. Stripe is PCI-DSS Level 1 certified, the highest level of payment security that exists.`
  },
  {
    h: "Cookies",
    body: `We use the minimum necessary. Cookies keep you logged in and remember basic preferences. We do not run advertising trackers and we do not sell your browsing behaviour to anyone.`
  },
  {
    h: "Your rights",
    body: `You have the right to see what data we hold about you, to correct it, to export it, and to have it deleted. You do not need a legal reason. Ask, and we'll do it.

Depending on where you live, you may have additional rights under laws such as the GDPR or the CCPA. We extend these rights to every user, everywhere, regardless of whether the law requires it. It's simpler, and it's the right thing to do.`
  },
  {
    h: "Children",
    body: `Filmmaker Genius is not intended for children under 13, and we do not knowingly collect information from them.`
  },
  {
    h: "Changes to this policy",
    body: `If we change this policy in a way that matters, we will tell you — clearly, and before it takes effect. We will not bury a material change in a silent update.`
  }
];
function Privacy() {
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Privacy Policy — Filmmaker Genius",
        description: "How Filmmaker Genius protects your scripts, footage, and personal data. We never sell your content, never train AI on your work, and delete it permanently when you say so.",
        canonical: "https://filmmakergenius.com/privacy"
      }
    ),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 760, margin: "0 auto", padding: "72px 24px 96px" }, children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: TEAL$3,
            marginBottom: 14
          },
          children: "Legal"
        }
      ),
      /* @__PURE__ */ jsx(
        "h1",
        {
          style: {
            fontFamily: "'Fraunces', serif",
            fontSize: "2.4em",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: 0
          },
          children: "Privacy Policy"
        }
      ),
      /* @__PURE__ */ jsx(
        "p",
        {
          style: {
            fontSize: "0.875em",
            color: "rgba(255,255,255,0.35)",
            marginTop: 12,
            marginBottom: 40
          },
          children: "Last updated: July 2026"
        }
      ),
      /* @__PURE__ */ jsx(
        "p",
        {
          style: {
            fontSize: "1em",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.75,
            marginBottom: 40
          },
          children: "This is your work. Your scripts, your footage, your story. We built Filmmaker Genius to help you make films — not to mine you for data. This page explains, in plain English, exactly what we collect, what we do with it, and what we will never do. If anything here is unclear, ask us. We'd rather over-explain than have you wondering."
        }
      ),
      SECTIONS$1.map(({ h, body }) => /* @__PURE__ */ jsxs("section", { style: { marginBottom: 40 }, children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            style: {
              fontFamily: "'Fraunces', serif",
              fontSize: "1.5em",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: "0 0 16px"
            },
            children: h
          }
        ),
        body.split(/\n\n+/).map((p, i) => /* @__PURE__ */ jsx(
          "p",
          {
            style: {
              fontSize: "1em",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              margin: "0 0 14px",
              whiteSpace: "pre-line"
            },
            children: p
          },
          i
        ))
      ] }, h)),
      /* @__PURE__ */ jsxs("section", { style: { marginBottom: 40 }, children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            style: {
              fontFamily: "'Fraunces', serif",
              fontSize: "1.5em",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: "0 0 16px"
            },
            children: "Contact"
          }
        ),
        /* @__PURE__ */ jsxs(
          "p",
          {
            style: {
              fontSize: "1em",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              margin: 0
            },
            children: [
              "Questions about your privacy, your data, or anything on this page?",
              " ",
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: "/contact",
                  style: { color: TEAL$3, textDecoration: "none", fontWeight: 600 },
                  children: "Contact us"
                }
              ),
              " ",
              "— a real person will answer."
            ]
          }
        )
      ] })
    ] })
  ] });
}
const TEAL$2 = "#00d4aa";
const SECTIONS = [
  {
    h: "You own your work",
    body: `Let's start with the most important thing, because most platforms bury it.

Everything you create, upload, or generate on Filmmaker Genius belongs to you. Your scripts. Your footage. Your storyboards. Your breakdowns. All of it. We claim no ownership, no copyright, no license to exploit it, and no share of anything it earns.

We need permission to store your files and run them through the tools you asked us to run them through — that's the only 'license' we take, it exists purely to make the product work, and it ends the moment you delete the file.`
  },
  {
    h: "Your account",
    body: `You need an account to use the tools. Keep your password to yourself, tell us the truth about who you are, and don't share your login with people who haven't paid.

You must be at least 13 years old to use Filmmaker Genius. If you're under 18, get a parent or guardian's permission first.`
  },
  {
    h: "Plans, credits, and billing",
    body: `Filmmaker Genius runs on credits. Your plan comes with a monthly allowance — 50 credits on Basic, 100 on Pro — which resets each month. Different tools cost different amounts, and the current costs are listed on the Pricing page.

Unused monthly credits do not roll over. Credits you purchase outright never expire and stack on top of your monthly allowance.

Subscriptions renew automatically each month until you cancel. We'll charge the card you gave Stripe. If a payment fails, we'll tell you before anything is cut off.`
  },
  {
    h: "Cancelling — no games",
    body: `You can cancel anytime, for any reason, with no notice period and no cancellation fee. One click in your account settings. There is no retention call, no 'are you sure' maze, no form to fax.

When you cancel, you keep full access until the end of the billing period you've already paid for. You will not be charged again. Credits you purchased outright remain yours.

We do not refund partial months. If you cancel on day 3, you keep the rest of the month you paid for — we don't take it away, and we don't refund it either. That's the trade, and it's the same in both directions.`
  },
  {
    h: "What the tools are — and what they aren't",
    body: `Our AI tools are assistants, not authorities. They produce drafts, suggestions, and first passes. They will sometimes be wrong.

Nothing generated on this platform is legal advice, financial advice, or a substitute for a qualified professional. Our Academy courses are educational, written by working filmmakers, and are not a guarantee of any outcome. A contract template is not a lawyer. A funding strategy is not a financial advisor. Use your judgement, and hire real professionals when the stakes are real.`
  },
  {
    h: "Things you can't do",
    body: `Don't upload content you don't have the rights to.
Don't use the platform to break the law, harass anyone, or infringe someone's copyright.
Don't resell, scrape, or redistribute our Academy content or tools as your own.
Don't try to break, overload, or reverse-engineer the service.
Don't share one account across a team that should be paying for several.

If you do these things, we may suspend or close your account. We'll tell you why.`
  },
  {
    h: "Uptime, and honesty about it",
    body: `We work hard to keep Filmmaker Genius running, but we're not going to promise you 100% uptime, because nobody can honestly promise that. Things break. Servers go down. When they do, we'll fix them and we'll tell you what happened.

The service is provided 'as is.' We're not liable for lost profits, missed deadlines, or a film that didn't get made. Back up your own work — that's true on every platform, including this one.`
  },
  {
    h: "Changes to these terms",
    body: `If we change these terms in a way that materially affects you, we'll tell you clearly and give you notice before it takes effect. We won't quietly rewrite the deal and hope you don't notice.

If you don't like the new terms, cancel. No hard feelings.`
  },
  {
    h: "Ending the relationship",
    body: `You can leave anytime and take your work with you. We can close an account that's breaking these terms, but we'll explain why and give you a chance to get your files out — unless the law prevents us.`
  }
];
function Terms() {
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Terms of Service — Filmmaker Genius",
        description: "The rules of using Filmmaker Genius, in plain English. You own your work. Cancel anytime. No tricks, no traps, no hidden clauses.",
        canonical: "https://filmmakergenius.com/terms"
      }
    ),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 760, margin: "0 auto", padding: "72px 24px 96px" }, children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: TEAL$2,
            marginBottom: 14
          },
          children: "Legal"
        }
      ),
      /* @__PURE__ */ jsx(
        "h1",
        {
          style: {
            fontFamily: "'Fraunces', serif",
            fontSize: "2.4em",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: 0
          },
          children: "Terms of Service"
        }
      ),
      /* @__PURE__ */ jsx(
        "p",
        {
          style: {
            fontSize: "0.875em",
            color: "rgba(255,255,255,0.35)",
            marginTop: 12,
            marginBottom: 40
          },
          children: "Last updated: July 2026"
        }
      ),
      /* @__PURE__ */ jsx(
        "p",
        {
          style: {
            fontSize: "1em",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.75,
            marginBottom: 40
          },
          children: "Most terms of service are written to protect the company from the customer. We'd rather write one that a filmmaker can actually read. Here's the deal between us, in plain English. No dense clauses buried on page nine. If you disagree with something here, tell us — we'd rather hear it than hide it."
        }
      ),
      SECTIONS.map(({ h, body }) => /* @__PURE__ */ jsxs("section", { style: { marginBottom: 40 }, children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            style: {
              fontFamily: "'Fraunces', serif",
              fontSize: "1.5em",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: "0 0 16px"
            },
            children: h
          }
        ),
        body.split(/\n\n+/).map((p, i) => /* @__PURE__ */ jsx(
          "p",
          {
            style: {
              fontSize: "1em",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              margin: "0 0 14px",
              whiteSpace: "pre-line"
            },
            children: p
          },
          i
        ))
      ] }, h)),
      /* @__PURE__ */ jsxs("section", { style: { marginBottom: 40 }, children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            style: {
              fontFamily: "'Fraunces', serif",
              fontSize: "1.5em",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: "0 0 16px"
            },
            children: "Contact"
          }
        ),
        /* @__PURE__ */ jsxs(
          "p",
          {
            style: {
              fontSize: "1em",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              margin: 0
            },
            children: [
              "Something here doesn't sit right? Something unclear?",
              " ",
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: "/contact",
                  style: { color: TEAL$2, textDecoration: "none", fontWeight: 600 },
                  children: "Contact us"
                }
              ),
              " ",
              "— a real person will answer."
            ]
          }
        )
      ] })
    ] })
  ] });
}
const THEMES$1 = {
  teal: { grad: "linear-gradient(135deg, #071820 0%, #0a2a30 100%)", accent: "#00d4aa" },
  gold: { grad: "linear-gradient(135deg, #1a1200 0%, #2d2000 100%)", accent: "#fbbf24" },
  violet: { grad: "linear-gradient(135deg, #120a25 0%, #1e1040 100%)", accent: "#a78bfa" },
  rose: { grad: "linear-gradient(135deg, #1a0808 0%, #2d1212 100%)", accent: "#fda4af" },
  emerald: { grad: "linear-gradient(135deg, #071a10 0%, #0a2d1a 100%)", accent: "#6ee7b7" },
  red: { grad: "linear-gradient(135deg, #2a0709 0%, #4a0d12 100%)", accent: "#ff4954" }
};
const OVERLAY$1 = "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)";
const GROUPS$1 = [
  {
    key: "Script & Story",
    label: "Script & Story",
    rows: [{ cols: 3, tools: [
      { title: "Scene Analysis", to: "/scene-analysis", theme: "teal" },
      { title: "Storyboard Generator", to: "/storyboarding", theme: "teal" },
      { title: "Table Read", to: "/table-read", theme: "teal" }
    ] }]
  },
  {
    key: "Funding & Pitch",
    label: "Funding & Pitch",
    rows: [{ cols: 2, tools: [
      { title: "Funding Strategy", to: "/funding-strategy", theme: "gold" },
      { title: "Pitch Deck Maker", to: "/pitch-deck", theme: "gold" }
    ] }]
  },
  {
    key: "Production Office",
    label: "Production Office",
    rows: [
      { cols: 3, tools: [
        { title: "Calendar", to: "/calendar", theme: "violet" },
        { title: "Call Sheet Generator", to: "/call-sheet", theme: "violet" },
        { title: "Project Intake Form", to: "/submit", theme: "violet" }
      ] },
      { cols: 2, tools: [
        { title: "Contract Assistant", to: "/contract-assistant", theme: "violet" },
        { title: "Document Library", to: "/library", theme: "violet" }
      ] }
    ]
  },
  {
    key: "Cast & Crew",
    label: "Cast & Crew",
    rows: [{ cols: 2, tools: [
      { title: "Auditions", to: "/upload-auditions", theme: "rose" },
      { title: "Crew Hire", to: "/crew-hire", theme: "rose" }
    ] }]
  },
  {
    key: "Distribution",
    label: "Distribution",
    rows: [{ cols: 2, tools: [
      { title: "Distribution Readiness Assessment", to: "/distribution-readiness", theme: "emerald" },
      { title: "Recut", to: "/recut", theme: "red", badge: "New · AI", special: true }
    ] }]
  }
];
const TABS$1 = ["All Tools", "Script & Story", "Production Office", "Cast & Crew", "Distribution", "Funding & Pitch"];
function ToolCard({ tool }) {
  const [hover, setHover] = useState(false);
  const t = THEMES$1[tool.theme];
  const isRed = tool.special;
  const borderColor = hover ? t.accent : isRed ? "rgba(239,68,68,0.55)" : "rgba(255,255,255,0.08)";
  const boxShadow = isRed ? hover ? "0 0 0 1px rgba(255,73,84,0.5), 0 12px 44px rgba(225,29,42,0.6)" : void 0 : void 0;
  const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: OVERLAY$1, pointerEvents: "none" } }),
    tool.badge && /* @__PURE__ */ jsx("span", { style: {
      position: "absolute",
      top: 18,
      left: 20,
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      padding: "4px 10px",
      borderRadius: 9999,
      color: "#fff",
      background: "#e11d2a",
      boxShadow: "0 0 20px rgba(225,29,42,0.7)"
    }, children: tool.badge }),
    /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      bottom: 22,
      left: 24,
      fontFamily: "'Inter Tight', sans-serif",
      fontSize: 20,
      fontWeight: 700,
      color: "#fff",
      textShadow: "0 2px 20px rgba(0,0,0,0.9)"
    }, children: tool.title }),
    /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      bottom: 20,
      right: 22,
      fontSize: 18,
      color: isRed ? "#ff4954" : t.accent,
      opacity: hover ? 1 : 0,
      transition: "opacity 0.2s"
    }, children: "→" })
  ] });
  const style = {
    display: "block",
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    minHeight: 200,
    border: `1px solid ${borderColor}`,
    background: t.grad,
    cursor: "pointer",
    transform: hover ? "translateY(-4px)" : "translateY(0)",
    transition: "transform 0.25s, border-color 0.25s, box-shadow 0.4s",
    boxShadow,
    textDecoration: "none",
    ...isRed ? { animation: "recutPulse 3s ease-in-out infinite" } : {}
  };
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  };
  if (tool.to === "#") {
    return /* @__PURE__ */ jsx("a", { href: "#", style, ...handlers, children: inner });
  }
  if (/^https?:\/\//.test(tool.to)) {
    return /* @__PURE__ */ jsx("a", { href: tool.to, target: "_blank", rel: "noopener noreferrer", style, ...handlers, children: inner });
  }
  return /* @__PURE__ */ jsx(Link, { to: tool.to, style, ...handlers, children: inner });
}
function Toolbox() {
  const [active, setActive] = useState("All Tools");
  const visibleGroups = active === "All Tools" ? GROUPS$1 : GROUPS$1.filter((g) => g.key === active);
  const showLabels = active === "All Tools";
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Toolbox — Every Indie Film Tool in One Place | Filmmaker Genius",
        description: "The Filmmaker Genius Toolbox: script analysis, storyboards, pitch decks, call sheets, casting, breakdowns, and distribution tools — grouped by production phase.",
        canonical: "https://filmmakergenius.com/toolbox"
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes recutPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(239,68,68,0.55), 0 0 24px rgba(225,29,42,0.25); }
          50% { box-shadow: 0 0 0 1px rgba(239,68,68,0.75), 0 0 44px rgba(225,29,42,0.55); }
        }
        .tb-h1 { font-size: 52px; }
        @media (min-width: 768px) { .tb-h1 { font-size: 68px; } }
        .tb-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .tb-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 900px) { .tb-grid-3 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) {
          .tb-grid-3, .tb-grid-2 { grid-template-columns: 1fr; }
        }
        .tb-tab:hover { border-color: rgba(0,212,170,0.4) !important; color: #fff !important; }
      ` }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 24px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "72px 0 48px" }, children: [
        /* @__PURE__ */ jsx("h1", { className: "tb-h1", style: {
          fontFamily: "'Fraunces', serif",
          fontWeight: 700,
          lineHeight: 1.05,
          margin: 0
        }, children: "Filmmaker Tools" }),
        /* @__PURE__ */ jsx("p", { style: {
          marginTop: 16,
          fontSize: 17,
          color: "rgba(255,255,255,0.55)"
        }, children: "AI-powered tools for every stage of your production" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40, justifyContent: "center" }, children: TABS$1.map((tab) => {
        const isActive = tab === active;
        return /* @__PURE__ */ jsx(
          "button",
          {
            className: isActive ? "" : "tb-tab",
            onClick: () => setActive(tab),
            style: {
              background: isActive ? "rgba(0,212,170,0.12)" : "transparent",
              border: `1px solid ${isActive ? "rgba(0,212,170,0.5)" : "rgba(255,255,255,0.18)"}`,
              color: isActive ? "#00d4aa" : "rgba(255,255,255,0.6)",
              padding: "8px 20px",
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s"
            },
            children: tab
          },
          tab
        );
      }) }),
      /* @__PURE__ */ jsx("div", { style: { paddingBottom: 80 }, children: visibleGroups.map((g) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: 48 }, children: [
        showLabels && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }, children: [
          /* @__PURE__ */ jsx("span", { style: {
            fontFamily: "'Fraunces', serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            whiteSpace: "nowrap"
          }, children: g.label }),
          /* @__PURE__ */ jsx("span", { style: { flex: 1, height: 1, background: "rgba(255,255,255,0.07)" } })
        ] }),
        g.rows.map((row, i) => /* @__PURE__ */ jsx("div", { className: row.cols === 3 ? "tb-grid-3" : "tb-grid-2", style: { marginTop: i > 0 ? 16 : 0 }, children: row.tools.map((t) => /* @__PURE__ */ jsx(ToolCard, { tool: t }, t.title)) }, i))
      ] }, g.key)) })
    ] })
  ] });
}
function ToolTopBar() {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        width: "100%",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "transparent"
      },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "container mx-auto px-4",
          style: {
            height: 48,
            display: "flex",
            alignItems: "center"
          },
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/toolbox",
              style: {
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                transition: "color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 6
              },
              onMouseEnter: (e) => e.currentTarget.style.color = "#00d4aa",
              onMouseLeave: (e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)",
              children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: 13 }, children: "←" }),
                "Back to Toolbox"
              ]
            }
          )
        }
      )
    }
  );
}
const version$1 = 1;
const asset_id$1 = "2bd2ea98-aa51-4963-8169-cf64cf447f96";
const project_id$1 = "2327b42e-2823-4633-a594-07a097a36c30";
const url$1 = "/__l5e/assets-v1/2bd2ea98-aa51-4963-8169-cf64cf447f96/recut-horizontal.webp";
const r2_key$1 = "a/v1/2327b42e-2823-4633-a594-07a097a36c30/2bd2ea98-aa51-4963-8169-cf64cf447f96/recut-horizontal.webp";
const original_filename$1 = "recut-horizontal.webp";
const size$1 = 47260;
const content_type$1 = "image/webp";
const created_at$1 = "2026-07-15T17:36:02Z";
const horizontalAsset = {
  version: version$1,
  asset_id: asset_id$1,
  project_id: project_id$1,
  url: url$1,
  r2_key: r2_key$1,
  original_filename: original_filename$1,
  size: size$1,
  content_type: content_type$1,
  created_at: created_at$1
};
const version = 1;
const asset_id = "fd84e522-365b-4d25-938a-888eadd32121";
const project_id = "2327b42e-2823-4633-a594-07a097a36c30";
const url = "/__l5e/assets-v1/fd84e522-365b-4d25-938a-888eadd32121/recut-vertical.webp";
const r2_key = "a/v1/2327b42e-2823-4633-a594-07a097a36c30/fd84e522-365b-4d25-938a-888eadd32121/recut-vertical.webp";
const original_filename = "recut-vertical.webp";
const size = 51078;
const content_type = "image/webp";
const created_at = "2026-07-15T17:36:04Z";
const verticalAsset = {
  version,
  asset_id,
  project_id,
  url,
  r2_key,
  original_filename,
  size,
  content_type,
  created_at
};
const TEAL$1 = "#00d4aa";
function FilmFrame() {
  Array.from({ length: 10 });
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "relative rounded-lg overflow-hidden",
        style: {
          width: 240,
          height: 135,
          border: "1px solid rgba(0,212,170,0.35)",
          boxShadow: "0 0 40px -20px rgba(0,212,170,0.5)"
        },
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: horizontalAsset.url,
            alt: "Feature film frame",
            className: "absolute inset-0 w-full h-full",
            style: { objectFit: "cover" }
          }
        )
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-neutral-400", children: "Your feature · 16:9" })
  ] });
}
function PhoneFrame() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative overflow-hidden",
        style: {
          width: 90,
          height: 180,
          borderRadius: 22,
          border: "1.5px solid rgba(0,212,170,0.5)",
          boxShadow: "0 0 40px -15px rgba(0,212,170,0.6)"
        },
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: verticalAsset.url,
              alt: "Vertical short frame",
              className: "absolute inset-0 w-full h-full",
              style: { objectFit: "cover" }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute left-1/2 -translate-x-1/2 top-1.5 rounded-full bg-black z-10",
              style: { width: 32, height: 6 }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-neutral-400", children: "6 vertical shorts · 9:16" })
  ] });
}
function Arrow() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 px-2", children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "text-[10px] font-semibold uppercase tracking-[0.2em]",
        style: { color: TEAL$1 },
        children: "AI Recut"
      }
    ),
    /* @__PURE__ */ jsx("svg", { width: "64", height: "20", viewBox: "0 0 64 20", fill: "none", children: /* @__PURE__ */ jsx(
      "path",
      {
        d: "M2 10 H56 M50 4 L58 10 L50 16",
        stroke: TEAL$1,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ) })
  ] });
}
function StepCard({ n, title, desc }) {
  return /* @__PURE__ */ jsxs("div", { className: "text-center px-2", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "mx-auto mb-4 flex items-center justify-center rounded-full font-semibold",
        style: {
          width: 44,
          height: 44,
          background: "rgba(0,212,170,0.12)",
          border: `1px solid ${TEAL$1}`,
          color: TEAL$1,
          fontFamily: "'Fraunces', serif"
        },
        children: n
      }
    ),
    /* @__PURE__ */ jsx(
      "h3",
      {
        className: "text-lg font-semibold text-white mb-2",
        style: { fontFamily: "'Fraunces', serif" },
        children: title
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-400 leading-relaxed", children: desc })
  ] });
}
function Recut() {
  const handleBrowse = () => {
    toast$1("Recut is coming soon — the AI upload flow will land here.");
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", style: { backgroundColor: "#0a0a12" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Recut — Turn Your Film Into Vertical Shorts | Filmmaker Genius",
        description: "Recut gives your movie a second life as vertical shorts. Upload your feature or short, let AI reframe and cut it into native 9:16 episodics, then publish to a brand-new audience.",
        canonical: "https://filmmakergenius.com/recut",
        type: "website"
      }
    ),
    /* @__PURE__ */ jsx(ToolTopBar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto px-6 py-14", style: { maxWidth: 900, fontFamily: "'Inter Tight', sans-serif" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "inline-block text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full",
            style: { background: TEAL$1, color: "#0a0a12" },
            children: "New · AI"
          }
        ),
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: "mt-5 text-white",
            style: {
              fontFamily: "'Fraunces', serif",
              fontSize: 40,
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: "-0.02em"
            },
            children: "Recut"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-neutral-400", style: { fontSize: 18 }, children: "Give your movie a second life as vertical shorts." })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "mt-12 rounded-2xl p-8",
          style: {
            background: "#14181c",
            border: "1px solid rgba(255,255,255,0.06)"
          },
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4", children: [
            /* @__PURE__ */ jsx(FilmFrame, {}),
            /* @__PURE__ */ jsx(Arrow, {}),
            /* @__PURE__ */ jsx(PhoneFrame, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-14 grid grid-cols-1 md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsx(
          StepCard,
          {
            n: 1,
            title: "Upload your film",
            desc: "Add a feature or a short you already made — the one that never quite found its audience."
          }
        ),
        /* @__PURE__ */ jsx(
          StepCard,
          {
            n: 2,
            title: "AI re-edits it",
            desc: "Recut turns it into native vertical episodics — reframed, captioned, and cut into bite-size pieces."
          }
        ),
        /* @__PURE__ */ jsx(
          StepCard,
          {
            n: 3,
            title: "You approve & publish",
            desc: "Review the cuts, tweak what you want, and release them to a brand-new vertical audience."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-14 flex flex-col items-center", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "w-full rounded-2xl px-6 py-12 text-center",
            style: {
              maxWidth: 560,
              border: `2px dashed ${TEAL$1}`,
              background: "linear-gradient(180deg, rgba(0,212,170,0.06) 0%, rgba(0,212,170,0.02) 100%)"
            },
            children: [
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "text-white font-semibold",
                  style: { fontSize: 18, fontFamily: "'Fraunces', serif" },
                  children: "Drop your film here to start"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-neutral-400", children: "MP4 or MOV · your feature or short · we handle the encoding" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleBrowse,
                  className: "mt-6 inline-flex items-center rounded-md px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90",
                  style: { background: TEAL$1, color: "#0a0a12" },
                  children: "Browse files"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-neutral-400 max-w-xl", children: [
          "Free to try. Upload, run the AI, and preview your vertical shorts with no account. To download or post the finished shorts,",
          " ",
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/membership",
              className: "underline underline-offset-4",
              style: { color: TEAL$1 },
              children: "upgrade your Filmmaker Genius membership"
            }
          ),
          "."
        ] })
      ] })
    ] })
  ] });
}
const Card$1 = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className), ...props }));
Card$1.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("h3", { ref, className: cn("text-2xl font-semibold leading-none tracking-tight", className), ...props })
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("p", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Label, { ref, className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className), ...props }));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check$1, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Separator, { ref, className: cn("-mx-1 my-1 h-px bg-muted", className), ...props }));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
  SeparatorPrimitive.Root,
  {
    ref,
    decorative,
    orientation,
    className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
    ...props
  }
));
Separator.displayName = SeparatorPrimitive.Root.displayName;
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t)
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
const createEmptyRole = () => ({
  id: crypto.randomUUID(),
  role_title: "",
  department: "",
  num_positions: 1,
  role_paid_or_unpaid: "Paid",
  role_rate: "",
  role_start_date: "",
  role_end_date: "",
  requirements: "",
  gear_required: "",
  union_required: false
});
const initialFormData = {
  project_title: "",
  project_type: "",
  production_company: "",
  director_name: "",
  producer_name: "",
  logline: "",
  union_status: "",
  paid_or_unpaid: "",
  day_rate_range: "",
  benefits: [],
  primary_location_city: "",
  primary_location_state_region: "",
  primary_location_country: "USA",
  is_remote_possible: false,
  shoot_dates: "",
  call_deadline: "",
  crew_roles: [createEmptyRole()],
  application_instructions: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  website_or_social_link: "",
  publish_on_public_board: true,
  allow_contact_via_platform: true
};
const projectTypes = [
  "Feature Film",
  "Short Film",
  "Vertical Series",
  "Web Series",
  "Commercial",
  "Music Video",
  "Documentary",
  "Other"
];
const unionStatuses = [
  "Non-Union",
  "SAG-AFTRA",
  "DGA",
  "IATSE",
  "Mixed / Other"
];
const compensationTypes = ["Paid", "Low-Pay", "Deferred", "Volunteer"];
const benefitOptions = [
  "Copy",
  "Credit",
  "IMDb Credit",
  "Meals",
  "Lodging",
  "Travel Stipend"
];
const departments = [
  "Camera",
  "Grip & Electric",
  "Sound",
  "Production",
  "Assistant Director",
  "Art / Production Design",
  "Wardrobe",
  "Hair & Makeup",
  "Post-Production",
  "Other"
];
function CrewHire() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: toast2 } = useToast();
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleBenefitToggle = (benefit) => {
    const currentBenefits = formData.benefits;
    const newBenefits = currentBenefits.includes(benefit) ? currentBenefits.filter((b) => b !== benefit) : [...currentBenefits, benefit];
    updateFormData("benefits", newBenefits);
  };
  const addCrewRole = () => {
    if (formData.crew_roles.length >= 50) {
      toast2({
        title: "Maximum roles reached",
        description: "You can add up to 50 crew roles per call.",
        variant: "destructive"
      });
      return;
    }
    updateFormData("crew_roles", [...formData.crew_roles, createEmptyRole()]);
  };
  const removeCrewRole = (id) => {
    if (formData.crew_roles.length <= 1) {
      toast2({
        title: "Cannot remove",
        description: "At least one crew role is required.",
        variant: "destructive"
      });
      return;
    }
    updateFormData("crew_roles", formData.crew_roles.filter((role) => role.id !== id));
  };
  const updateCrewRole = (id, field, value) => {
    updateFormData("crew_roles", formData.crew_roles.map(
      (role) => role.id === id ? { ...role, [field]: value } : role
    ));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project_title.trim()) {
      toast2({ title: "Project title is required", variant: "destructive" });
      return;
    }
    if (!formData.director_name.trim()) {
      toast2({ title: "Director name is required", variant: "destructive" });
      return;
    }
    if (!formData.paid_or_unpaid) {
      toast2({ title: "Compensation type is required", variant: "destructive" });
      return;
    }
    if (!formData.contact_name.trim() || !formData.contact_email.trim()) {
      toast2({ title: "Contact name and email are required", variant: "destructive" });
      return;
    }
    if (!formData.application_instructions.trim()) {
      toast2({ title: "Application instructions are required", variant: "destructive" });
      return;
    }
    const hasValidRole = formData.crew_roles.some((role) => role.role_title.trim());
    if (!hasValidRole) {
      toast2({ title: "At least one crew role with a title is required", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast2({
        title: "Crew Call Posted!",
        description: "Your crew call has been submitted successfully."
      });
      setIsSubmitting(false);
      setFormData(initialFormData);
    }, 1e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Film Crew Jobs — Hire Crew & Find Work | Filmmaker Genius",
        description: "Post film crew jobs or find paid work on indie productions. Connect with camera, sound, grip, and production crew on Filmmaker Genius.",
        canonical: "https://filmmakergenius.com/crew-hire",
        type: "website"
      }
    ),
    /* @__PURE__ */ jsx(ToolTopBar, {}),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 py-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-10 w-10 text-primary" }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Crew Hire Tool" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Post a crew call to find talented crew members for your production" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs(Card$1, { className: "mb-6", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5" }),
              "Project Information"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Tell us about your production" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "project_title", children: "Project Title *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "project_title",
                    value: formData.project_title,
                    onChange: (e) => updateFormData("project_title", e.target.value),
                    placeholder: "Enter project title",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Project Type *" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: formData.project_type,
                    onValueChange: (value) => updateFormData("project_type", value),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select type" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: projectTypes.map((type) => /* @__PURE__ */ jsx(SelectItem, { value: type, children: type }, type)) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "production_company", children: "Production Company" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "production_company",
                  value: formData.production_company,
                  onChange: (e) => updateFormData("production_company", e.target.value),
                  placeholder: "Enter production company name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "director_name", children: "Director Name *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "director_name",
                    value: formData.director_name,
                    onChange: (e) => updateFormData("director_name", e.target.value),
                    placeholder: "Enter director name",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "producer_name", children: "Producer / Line Producer" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "producer_name",
                    value: formData.producer_name,
                    onChange: (e) => updateFormData("producer_name", e.target.value),
                    placeholder: "Enter producer name"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "logline", children: "Logline / Project Summary" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "logline",
                  value: formData.logline,
                  onChange: (e) => updateFormData("logline", e.target.value),
                  placeholder: "Brief description of your project...",
                  className: "min-h-[80px] resize-none"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card$1, { className: "mb-6", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5" }),
              "Union & Compensation"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Payment and union details" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Union Status" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: formData.union_status,
                    onValueChange: (value) => updateFormData("union_status", value),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select union status" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: unionStatuses.map((status) => /* @__PURE__ */ jsx(SelectItem, { value: status, children: status }, status)) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Compensation Type *" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: formData.paid_or_unpaid,
                    onValueChange: (value) => updateFormData("paid_or_unpaid", value),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select compensation" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: compensationTypes.map((type) => /* @__PURE__ */ jsx(SelectItem, { value: type, children: type }, type)) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "day_rate_range", children: "Day Rate / Pay Range (overall)" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "day_rate_range",
                  value: formData.day_rate_range,
                  onChange: (e) => updateFormData("day_rate_range", e.target.value),
                  placeholder: "$250–$350/12, scale, etc."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "mb-3 block", children: "Additional Benefits" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: benefitOptions.map((benefit) => /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: formData.benefits.includes(benefit) ? "default" : "outline",
                  className: "cursor-pointer",
                  onClick: () => handleBenefitToggle(benefit),
                  children: benefit
                },
                benefit
              )) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card$1, { className: "mb-6", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5" }),
              "Location & Schedule"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Where and when you'll be shooting" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "primary_location_city", children: "City *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "primary_location_city",
                    value: formData.primary_location_city,
                    onChange: (e) => updateFormData("primary_location_city", e.target.value),
                    placeholder: "City",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "primary_location_state_region", children: "State / Region *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "primary_location_state_region",
                    value: formData.primary_location_state_region,
                    onChange: (e) => updateFormData("primary_location_state_region", e.target.value),
                    placeholder: "State or region",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "primary_location_country", children: "Country *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "primary_location_country",
                    value: formData.primary_location_country,
                    onChange: (e) => updateFormData("primary_location_country", e.target.value),
                    placeholder: "Country",
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "is_remote_possible", children: "Remote / Hybrid Work Possible?" }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  id: "is_remote_possible",
                  checked: formData.is_remote_possible,
                  onCheckedChange: (checked) => updateFormData("is_remote_possible", checked)
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Separator, {}),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "shoot_dates", children: "Shoot Dates *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "shoot_dates",
                    value: formData.shoot_dates,
                    onChange: (e) => updateFormData("shoot_dates", e.target.value),
                    placeholder: "e.g. October 10–14, 2026",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "call_deadline", children: "Application Deadline" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "call_deadline",
                    type: "date",
                    value: formData.call_deadline,
                    onChange: (e) => updateFormData("call_deadline", e.target.value)
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card$1, { className: "mb-6", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Briefcase, { className: "h-5 w-5" }),
              "Crew Roles Needed"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Add the positions you're hiring for (1-50 roles)" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            formData.crew_roles.map((role, index) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4 space-y-4 bg-muted/30", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-sm", children: [
                  "Role #",
                  index + 1
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => removeCrewRole(role.id),
                    className: "text-destructive hover:text-destructive",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "Role Title *" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      value: role.role_title,
                      onChange: (e) => updateCrewRole(role.id, "role_title", e.target.value),
                      placeholder: "e.g. 1st AD, Gaffer, Sound Mixer"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "Department" }),
                  /* @__PURE__ */ jsxs(
                    Select,
                    {
                      value: role.department,
                      onValueChange: (value) => updateCrewRole(role.id, "department", value),
                      children: [
                        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select department" }) }),
                        /* @__PURE__ */ jsx(SelectContent, { children: departments.map((dept) => /* @__PURE__ */ jsx(SelectItem, { value: dept, children: dept }, dept)) })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "Number of Positions *" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "number",
                      min: "1",
                      value: role.num_positions,
                      onChange: (e) => updateCrewRole(role.id, "num_positions", parseInt(e.target.value) || 1)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "Compensation *" }),
                  /* @__PURE__ */ jsxs(
                    Select,
                    {
                      value: role.role_paid_or_unpaid,
                      onValueChange: (value) => updateCrewRole(role.id, "role_paid_or_unpaid", value),
                      children: [
                        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select" }) }),
                        /* @__PURE__ */ jsx(SelectContent, { children: compensationTypes.map((type) => /* @__PURE__ */ jsx(SelectItem, { value: type, children: type }, type)) })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "Rate / Pay" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      value: role.role_rate,
                      onChange: (e) => updateCrewRole(role.id, "role_rate", e.target.value),
                      placeholder: "$300/day, $500 flat, etc."
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "Start Date" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "date",
                      value: role.role_start_date,
                      onChange: (e) => updateCrewRole(role.id, "role_start_date", e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "End Date" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "date",
                      value: role.role_end_date,
                      onChange: (e) => updateCrewRole(role.id, "role_end_date", e.target.value)
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Role Requirements" }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    value: role.requirements,
                    onChange: (e) => updateCrewRole(role.id, "requirements", e.target.value),
                    placeholder: "Experience, software, gear, availability, etc.",
                    className: "min-h-[60px] resize-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Gear Required" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: role.gear_required,
                    onChange: (e) => updateCrewRole(role.id, "gear_required", e.target.value),
                    placeholder: "Camera package, sound kit, G&E gear, etc."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: `union_${role.id}`, children: "Union Crew Required for this Role?" }),
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    id: `union_${role.id}`,
                    checked: role.union_required,
                    onCheckedChange: (checked) => updateCrewRole(role.id, "union_required", checked)
                  }
                )
              ] })
            ] }, role.id)),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: addCrewRole,
                className: "w-full",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
                  "Add Another Role"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card$1, { className: "mb-6", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Send, { className: "h-5 w-5" }),
              "Application & Contact"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "How crew members should apply" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "application_instructions", children: "How to Apply *" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "application_instructions",
                  value: formData.application_instructions,
                  onChange: (e) => updateFormData("application_instructions", e.target.value),
                  placeholder: "Email resume + reel to..., include position in subject line, etc.",
                  className: "min-h-[100px] resize-none",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Separator, {}),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "contact_name", children: "Contact Name *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "contact_name",
                    value: formData.contact_name,
                    onChange: (e) => updateFormData("contact_name", e.target.value),
                    placeholder: "Your name",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "contact_email", children: "Contact Email *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "contact_email",
                    type: "email",
                    value: formData.contact_email,
                    onChange: (e) => updateFormData("contact_email", e.target.value),
                    placeholder: "your@email.com",
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "contact_phone", children: "Contact Phone" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "contact_phone",
                    value: formData.contact_phone,
                    onChange: (e) => updateFormData("contact_phone", e.target.value),
                    placeholder: "Your phone number"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "website_or_social_link", children: "Website or Social Link" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "website_or_social_link",
                    value: formData.website_or_social_link,
                    onChange: (e) => updateFormData("website_or_social_link", e.target.value),
                    placeholder: "Production site, IG handle, etc."
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card$1, { className: "mb-6", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Publishing Options" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Control visibility and contact preferences" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "publish_on_public_board", children: "Publish on Public Board" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Make this crew call visible to all users" })
              ] }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  id: "publish_on_public_board",
                  checked: formData.publish_on_public_board,
                  onCheckedChange: (checked) => updateFormData("publish_on_public_board", checked)
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Separator, {}),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "allow_contact_via_platform", children: "Allow Contact via Platform" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Let crew members message you through Filmmaker AI" })
              ] }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  id: "allow_contact_via_platform",
                  checked: formData.allow_contact_via_platform,
                  onCheckedChange: (checked) => updateFormData("allow_contact_via_platform", checked)
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { type: "submit", size: "lg", disabled: isSubmitting, children: [
          isSubmitting ? "Posting..." : "Post Crew Call",
          /* @__PURE__ */ jsx(Send, { className: "ml-2 h-4 w-4" })
        ] }) })
      ] })
    ] })
  ] });
}
const Membership = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { credits, subscription, loading, fetchSubscription, fetchCredits } = useCredits();
  const [selectedCreditPack, setSelectedCreditPack] = useState("");
  const [subscribingPlan, setSubscribingPlan] = useState(null);
  const [purchasingCredits, setPurchasingCredits] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const creditsPurchased = searchParams.get("credits_purchased");
    if (success === "true") {
      if (creditsPurchased) {
        toast$1.success(`Successfully purchased ${creditsPurchased} credits!`);
      } else {
        toast$1.success("Subscription activated successfully!");
      }
      fetchSubscription();
      fetchCredits();
      navigate("/membership", { replace: true });
    } else if (canceled === "true") {
      toast$1.info("Payment was canceled");
      navigate("/membership", { replace: true });
    }
  }, [searchParams, navigate, fetchSubscription, fetchCredits]);
  const creditPacks = [
    { amount: 10, price: 5, pricePerCredit: 0.5 },
    { amount: 20, price: 9, pricePerCredit: 0.45 },
    { amount: 30, price: 12, pricePerCredit: 0.4 },
    { amount: 40, price: 14, pricePerCredit: 0.35 }
  ];
  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 19.99,
      credits: 50,
      icon: Sparkles,
      features: [
        "50 monthly credits",
        "AI Script Analysis",
        "Storyboard Generation",
        "Scene Breakdown",
        "Basic Support",
        "Export to PDF"
      ],
      popular: false
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: 24.99,
      credits: 100,
      icon: Crown,
      features: [
        "100 monthly credits",
        "Everything in Basic",
        "Priority Support",
        "Advanced Analytics",
        "Early Access to Features",
        "Custom Branding"
      ],
      popular: true
    }
  ];
  const handleSubscribe = async (planId) => {
    if (!user) {
      toast$1.error("Please sign in to subscribe");
      navigate("/auth");
      return;
    }
    setSubscribingPlan(planId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planType: planId }
      });
      if (error) {
        console.error("Checkout error:", error);
        toast$1.error("Failed to start checkout. Please try again.");
        return;
      }
      if (data == null ? void 0 : data.url) {
        window.open(data.url, "_blank");
      } else {
        toast$1.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast$1.error("An error occurred. Please try again.");
    } finally {
      setSubscribingPlan(null);
    }
  };
  const handlePurchaseCredits = async () => {
    if (!user) {
      toast$1.error("Please sign in to purchase credits");
      navigate("/auth");
      return;
    }
    if (!selectedCreditPack) {
      toast$1.error("Please select a credit pack");
      return;
    }
    setPurchasingCredits(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-credit-purchase", {
        body: { creditAmount: selectedCreditPack }
      });
      if (error) {
        console.error("Credit purchase error:", error);
        toast$1.error("Failed to start checkout. Please try again.");
        return;
      }
      if (data == null ? void 0 : data.url) {
        window.open(data.url, "_blank");
      } else {
        toast$1.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating credit purchase:", error);
      toast$1.error("An error occurred. Please try again.");
    } finally {
      setPurchasingCredits(false);
    }
  };
  const handleManageSubscription = async () => {
    if (!user) {
      toast$1.error("Please sign in first");
      navigate("/auth");
      return;
    }
    setOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) {
        console.error("Portal error:", error);
        toast$1.error("Failed to open subscription management. Please try again.");
        return;
      }
      if (data == null ? void 0 : data.url) {
        window.open(data.url, "_blank");
      } else {
        toast$1.error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Error opening portal:", error);
      toast$1.error("An error occurred. Please try again.");
    } finally {
      setOpeningPortal(false);
    }
  };
  const selectedPack = creditPacks.find((pack) => pack.amount.toString() === selectedCreditPack);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-background via-background to-primary/5", children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Filmmaker Genius Membership — Plans & Credits",
        description: "Choose a Filmmaker Genius membership: monthly plans and credit packs that unlock AI script analysis, storyboards, scene breakdowns, and PDF exports.",
        canonical: "https://filmmakergenius.com/membership",
        type: "website"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 pt-4", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
        children: "← Back to Filmmaker Genius"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        user && !loading && ((credits == null ? void 0 : credits.available_credits) || 0) === 0 && !subscription ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent", children: "Welcome to Filmmaker Genius!" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-muted-foreground max-w-2xl mx-auto", children: "Choose a plan to get started and unlock powerful filmmaking tools" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent", children: "Choose Your Plan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-muted-foreground max-w-2xl mx-auto", children: "Unlock powerful filmmaking tools with our flexible pricing options" })
        ] }),
        user && !loading && /* @__PURE__ */ jsxs("div", { className: "mt-6 inline-flex items-center gap-3 bg-accent/50 px-6 py-3 rounded-full", children: [
          /* @__PURE__ */ jsx(Zap, { className: "h-5 w-5 text-gold" }),
          /* @__PURE__ */ jsxs("span", { className: "text-lg font-semibold", children: [
            (credits == null ? void 0 : credits.available_credits) || 0,
            " Credits Available"
          ] })
        ] })
      ] }),
      user && subscription && subscription.status === "active" && /* @__PURE__ */ jsxs(Card$1, { className: "mb-8 border-gold/50 bg-gradient-to-r from-gold/10 to-gold-light/10", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Crown, { className: "h-5 w-5 text-gold" }),
            "Current Plan: ",
            subscription.plan_type === "basic" ? "Basic" : "Pro"
          ] }),
          /* @__PURE__ */ jsxs(CardDescription, { children: [
            "Status: ",
            subscription.status,
            " | Renews: ",
            subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : "N/A"
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: handleManageSubscription,
            disabled: openingPortal,
            children: openingPortal ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Opening..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
              "Manage Subscription"
            ] })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16", children: subscriptionPlans.map((plan) => {
        const Icon = plan.icon;
        const isCurrentPlan = (subscription == null ? void 0 : subscription.plan_type) === plan.id && (subscription == null ? void 0 : subscription.status) === "active";
        const isSubscribing = subscribingPlan === plan.id;
        return /* @__PURE__ */ jsxs(
          Card$1,
          {
            className: `relative overflow-hidden transition-all hover:shadow-lg ${plan.popular ? "border-gold shadow-glow" : ""} ${isCurrentPlan ? "ring-2 ring-gold" : ""}`,
            children: [
              plan.popular && /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 bg-gradient-to-r from-gold to-gold-light text-gold-foreground px-4 py-1 text-sm font-semibold rounded-bl-lg", children: "Most Popular" }),
              isCurrentPlan && /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-br-lg", children: "Your Plan" }),
              /* @__PURE__ */ jsxs(CardHeader, { className: "text-center pb-8", children: [
                /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: `p-4 rounded-full ${plan.popular ? "bg-gradient-to-r from-gold to-gold-light" : "bg-primary/10"}`, children: /* @__PURE__ */ jsx(Icon, { className: `h-8 w-8 ${plan.popular ? "text-gold-foreground" : "text-primary"}` }) }) }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-3xl", children: plan.name }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-5xl font-bold", children: [
                    "$",
                    plan.price
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "/month" })
                ] }),
                /* @__PURE__ */ jsxs(CardDescription, { className: "mt-2 text-lg", children: [
                  plan.credits,
                  " credits per month"
                ] })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: plan.features.map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(Check$1, { className: "h-5 w-5 text-gold mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: feature })
              ] }, index)) }) }),
              /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx(
                Button,
                {
                  className: "w-full",
                  variant: plan.popular ? "default" : "outline",
                  size: "lg",
                  onClick: () => handleSubscribe(plan.id),
                  disabled: isCurrentPlan || isSubscribing,
                  children: isSubscribing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                    "Processing..."
                  ] }) : isCurrentPlan ? "Current Plan" : `Subscribe to ${plan.name}`
                }
              ) })
            ]
          },
          plan.id
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxs(Card$1, { className: "border-2 border-dashed border-primary/30", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(CreditCard, { className: "h-6 w-6 text-primary" }) }) }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Need More Credits?" }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-base", children: "Purchase additional credits anytime. Credits never expire!" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium mb-2 block", children: "Select Credit Pack" }),
            /* @__PURE__ */ jsxs(Select, { value: selectedCreditPack, onValueChange: setSelectedCreditPack, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose credit amount" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: creditPacks.map((pack) => /* @__PURE__ */ jsxs(SelectItem, { value: pack.amount.toString(), children: [
                pack.amount,
                " Credits - $",
                pack.price.toFixed(2),
                " ($",
                pack.pricePerCredit.toFixed(2),
                "/credit)"
              ] }, pack.amount)) })
            ] })
          ] }),
          selectedPack && /* @__PURE__ */ jsxs("div", { className: "bg-accent/50 p-4 rounded-lg space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Credits" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: selectedPack.amount })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Price per credit" }),
              /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                "$",
                selectedPack.pricePerCredit.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "border-t border-border pt-2 mt-2", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Total" }),
              /* @__PURE__ */ jsxs("span", { className: "text-2xl font-bold text-gold", children: [
                "$",
                selectedPack.price.toFixed(2)
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx(
          Button,
          {
            className: "w-full",
            size: "lg",
            onClick: handlePurchaseCredits,
            disabled: purchasingCredits,
            children: purchasingCredits ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Processing..."
            ] }) : "Purchase Credits"
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-16 max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs(Card$1, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "How Credits Work" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Understanding our credit system" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-3 flex items-center gap-2", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Credit Costs" }) }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                "• Script Analysis: ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "5 credits" })
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                "• Scene Analysis: ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "3 credits" })
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                "• Storyboard Frame: ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "10 credits" })
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                "• Document Upload/OCR: ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "2 credits" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-3 flex items-center gap-2", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Benefits" }) }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx("li", { children: "• Credits never expire" }),
              /* @__PURE__ */ jsx("li", { children: "• Use across all tools" }),
              /* @__PURE__ */ jsx("li", { children: "• Monthly subscription credits reset" }),
              /* @__PURE__ */ jsx("li", { children: "• Purchased credits stack with subscription" })
            ] })
          ] })
        ] }) })
      ] }) })
    ] })
  ] });
};
const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
}) : "";
const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("blog_posts").select("id, title, slug, excerpt, cover_image, author_name, published_at").eq("published", true).order("published_at", { ascending: false });
      if (!error && data) setPosts(data);
      setLoading(false);
    })();
  }, []);
  const featured = posts[0];
  const rest = posts.slice(1);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Filmmaker Genius Blog — Indie Filmmaking Tips, Guides & Industry News" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Practical guides, playbooks, and industry news for independent filmmakers — from development and production to funding and distribution."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://filmmakergenius.com/blog" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          property: "og:title",
          content: "Filmmaker Genius Blog — Indie Filmmaking Tips, Guides & Industry News"
        }
      ),
      /* @__PURE__ */ jsx(
        "meta",
        {
          property: "og:description",
          content: "Practical guides, playbooks, and industry news for independent filmmakers — from development and production to funding and distribution."
        }
      ),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://filmmakergenius.com/blog" })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "min-h-screen text-white",
        style: {
          backgroundColor: "#0a0a12",
          fontFamily: "'Inter Tight', ui-sans-serif, system-ui, sans-serif"
        },
        children: [
          /* @__PURE__ */ jsxs("header", { className: "relative overflow-hidden border-b border-white/10", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": true,
                className: "pointer-events-none absolute inset-0",
                style: {
                  background: "radial-gradient(60% 60% at 50% 30%, rgba(0,212,170,0.18) 0%, rgba(0,212,170,0.06) 40%, transparent 70%)"
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative container mx-auto px-4 py-20 md:py-28 text-center max-w-4xl", children: [
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "text-xs md:text-sm font-semibold uppercase mb-5",
                  style: { color: "#00d4aa", letterSpacing: "0.28em" },
                  children: "The Filmmaker Genius Blog"
                }
              ),
              /* @__PURE__ */ jsx(
                "h1",
                {
                  className: "mb-6 leading-[1.05]",
                  style: {
                    fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                    fontSize: "clamp(44px, 8vw, 64px)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em"
                  },
                  children: "The Slate"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed", children: "Guides, playbooks, and stories for filmmakers running the whole production in one place." })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 pt-10 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: "px-5 py-2 rounded-full text-sm font-medium border",
              style: {
                backgroundColor: "rgba(0,212,170,0.12)",
                borderColor: "#00d4aa",
                color: "#00d4aa"
              },
              children: "All Posts"
            }
          ) }) }),
          /* @__PURE__ */ jsx("main", { className: "container mx-auto px-4 py-14 max-w-6xl", children: loading ? /* @__PURE__ */ jsx("p", { className: "text-center text-white/60", children: "Loading…" }) : posts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-24", children: [
            /* @__PURE__ */ jsx(
              "h2",
              {
                className: "text-3xl mb-3",
                style: { fontFamily: "'Fraunces', ui-serif, Georgia, serif" },
                children: "New articles are on the way."
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-white/60", children: "Check back soon for guides, playbooks, and stories from the field." })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            featured && /* @__PURE__ */ jsx(
              Link,
              {
                to: `/blog/${featured.slug}`,
                className: "group block mb-16 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] hover:border-[#00d4aa] transition-all",
                children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2", children: [
                  featured.cover_image ? /* @__PURE__ */ jsx("div", { className: "aspect-[16/10] md:aspect-auto md:h-full overflow-hidden bg-black", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: featured.cover_image,
                      alt: featured.title,
                      loading: "lazy",
                      decoding: "async",
                      className: "w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    }
                  ) }) : /* @__PURE__ */ jsx("div", { className: "aspect-[16/10] md:aspect-auto md:h-full bg-gradient-to-br from-[#0f1a1a] to-black" }),
                  /* @__PURE__ */ jsxs("div", { className: "p-8 md:p-12 flex flex-col justify-center", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "text-xs font-semibold uppercase mb-4",
                        style: { color: "#00d4aa", letterSpacing: "0.22em" },
                        children: "Featured"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "h2",
                      {
                        className: "mb-4 leading-tight",
                        style: {
                          fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                          fontSize: "clamp(28px, 3.5vw, 40px)",
                          fontWeight: 500,
                          letterSpacing: "-0.01em"
                        },
                        children: featured.title
                      }
                    ),
                    featured.excerpt && /* @__PURE__ */ jsx("p", { className: "text-white/70 mb-6 leading-relaxed line-clamp-3", children: featured.excerpt }),
                    /* @__PURE__ */ jsxs("div", { className: "text-sm text-white/50 mb-6", children: [
                      featured.author_name,
                      featured.author_name && featured.published_at && " · ",
                      formatDate(featured.published_at)
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "span",
                      {
                        className: "text-sm font-semibold inline-flex items-center gap-2",
                        style: { color: "#00d4aa" },
                        children: [
                          "Read ",
                          /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "→" })
                        ]
                      }
                    )
                  ] })
                ] })
              }
            ),
            rest.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3", children: rest.map((post) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/blog/${post.slug}`,
                className: "group flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:-translate-y-1 hover:border-[#00d4aa] transition-all duration-300",
                children: [
                  post.cover_image ? /* @__PURE__ */ jsx("div", { className: "aspect-video overflow-hidden bg-black", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: post.cover_image,
                      alt: post.title,
                      loading: "lazy",
                      decoding: "async",
                      className: "w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    }
                  ) }) : /* @__PURE__ */ jsx("div", { className: "aspect-video bg-gradient-to-br from-[#0f1a1a] to-black" }),
                  /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-1", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "text-[11px] font-semibold uppercase mb-3",
                        style: { color: "#00d4aa", letterSpacing: "0.22em" },
                        children: "Article"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "h3",
                      {
                        className: "mb-3 leading-snug",
                        style: {
                          fontFamily: "'Fraunces', ui-serif, Georgia, serif",
                          fontSize: "22px",
                          fontWeight: 500,
                          letterSpacing: "-0.01em"
                        },
                        children: post.title
                      }
                    ),
                    post.excerpt && /* @__PURE__ */ jsx("p", { className: "text-white/65 text-sm leading-relaxed line-clamp-3 mb-5", children: post.excerpt }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-auto text-xs text-white/50", children: [
                      post.author_name,
                      post.author_name && post.published_at && " · ",
                      formatDate(post.published_at)
                    ] })
                  ] })
                ]
              },
              post.id
            )) })
          ] }) })
        ]
      }
    )
  ] });
};
const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      setPost(data ?? null);
      setLoading(false);
    })();
  }, [slug]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-24 text-center text-muted-foreground", children: "Loading…" });
  }
  if (!post) {
    return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-24 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "Post not found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-8", children: "This post may have been unpublished or moved." }),
      /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/blog", children: "Back to the blog" }) })
    ] });
  }
  const canonical = `https://filmmakergenius.com/blog/${post.slug}`;
  const description = post.excerpt ?? post.title;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at,
    author: { "@type": "Organization", name: post.author_name ?? "FilmmakerGenius" },
    image: post.cover_image ?? void 0,
    mainEntityOfPage: canonical,
    description
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: `${post.title} — FilmmakerGenius` }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonical }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "article" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: `${post.title} — FilmmakerGenius` }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: canonical }),
      post.cover_image && /* @__PURE__ */ jsx("meta", { property: "og:image", content: post.cover_image }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(jsonLd) })
    ] }),
    /* @__PURE__ */ jsx("article", { className: "min-h-screen bg-background text-foreground", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-16 max-w-3xl", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/blog",
          className: "text-sm text-[#00d4aa] hover:underline mb-6 inline-block",
          children: "← All posts"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4 leading-tight", children: post.title }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground mb-8", children: [
        post.author_name,
        post.published_at && /* @__PURE__ */ jsxs(Fragment, { children: [
          " · ",
          new Date(post.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        ] })
      ] }),
      post.cover_image && /* @__PURE__ */ jsx(
        "img",
        {
          src: post.cover_image,
          alt: post.title,
          className: "w-full rounded-xl mb-10"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "prose prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-p:text-foreground/90 prose-p:leading-relaxed prose-li:text-foreground/90 prose-a:text-[#00d4aa] prose-strong:text-foreground", children: /* @__PURE__ */ jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], children: post.body }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16 p-8 rounded-xl border border-[#00d4aa]/30 bg-[#00d4aa]/5 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-3", children: "Ready to run your production in one place?" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: "Upload your script and get storyboards, table reads, crew, contracts, and casting — all connected." }),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            size: "lg",
            className: "bg-[#00d4aa] hover:bg-[#00d4aa]/90 text-black font-semibold",
            children: /* @__PURE__ */ jsx(Link, { to: "/membership", children: "Start your production free" })
          }
        )
      ] })
    ] }) })
  ] });
};
const THEMES = {
  edu: {
    grad: "linear-gradient(135deg, #120a25 0%, #1e1040 100%)",
    accent: "#a78bfa",
    badgeBg: "rgba(139,92,246,0.12)",
    badgeBorder: "rgba(139,92,246,0.25)"
  },
  money: {
    grad: "linear-gradient(135deg, #1a1200 0%, #2d2000 100%)",
    accent: "#fbbf24",
    badgeBg: "rgba(251,191,36,0.12)",
    badgeBorder: "rgba(251,191,36,0.25)"
  },
  greenlight: {
    grad: "linear-gradient(135deg, #06200f 0%, #0a3318 100%)",
    accent: "#00e054",
    badgeBg: "rgba(0,224,84,0.14)",
    badgeBorder: "rgba(0,224,84,0.3)"
  },
  roberts: {
    grad: "linear-gradient(135deg, #200707 0%, #3a0d0d 100%)",
    accent: "#f87171",
    badgeBg: "rgba(239,68,68,0.14)",
    badgeBorder: "rgba(239,68,68,0.3)"
  }
};
const OVERLAY = "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)";
const GROUPS = [
  {
    key: "education",
    label: "Education",
    tabs: ["All", "Education"],
    cols: 1,
    tiles: [{
      title: "Education Modules",
      to: "/academy/education",
      theme: "edu",
      badge: "Modules",
      sub: "62 courses · Every stage of production",
      featured: true
    }]
  },
  {
    key: "monetization",
    label: "Monetization",
    tabs: ["All", "Monetization"],
    cols: 3,
    tiles: [
      { title: "Aggregators", to: "/academy/aggregators", theme: "money", badge: "Distribution" },
      { title: "Distributors", to: "/academy/distributors", theme: "money", badge: "Distribution" },
      { title: "Video On Demand", to: "/academy/vod", theme: "money", badge: "Distribution" }
    ]
  },
  {
    key: "greenlight",
    label: "Distribution Engine",
    tabs: ["All"],
    cols: 1,
    tiles: [{
      title: "Green Light Engine",
      to: "/green-light-engine",
      theme: "greenlight",
      badge: "Distribution",
      sub: "See exactly where your film can go — and how to get there",
      featured: true
    }]
  },
  {
    key: "roberts",
    label: "Roberts' Filmmaking",
    tabs: ["All", "Roberts' Filmmaking"],
    cols: 1,
    tiles: [{
      title: "Filmmaking by Will Roberts",
      to: "/academy/roberts-filmmaking",
      theme: "roberts",
      badge: "Free Ebook",
      sub: "17 chapters · Idea to distribution",
      featured: true
    }]
  }
];
const TABS = ["All", "Roberts' Filmmaking", "Monetization", "Education"];
function TileCard({ tile }) {
  const [hover, setHover] = useState(false);
  const t = THEMES[tile.theme];
  const featured = !!tile.featured;
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: tile.to,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "block",
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        minHeight: featured ? 260 : 200,
        border: `1px solid ${hover ? t.accent : "rgba(255,255,255,0.08)"}`,
        background: t.grad,
        cursor: "pointer",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.25s, border-color 0.25s",
        textDecoration: "none"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: OVERLAY, pointerEvents: "none" } }),
        tile.badge && /* @__PURE__ */ jsx("span", { style: {
          position: "absolute",
          top: 18,
          left: 20,
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          padding: "4px 10px",
          borderRadius: 9999,
          color: t.accent,
          background: t.badgeBg,
          border: `1px solid ${t.badgeBorder}`
        }, children: tile.badge }),
        tile.sub && /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          left: featured ? 32 : 24,
          bottom: featured ? 68 : 48,
          fontSize: featured ? 14 : 13,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "'Inter Tight', sans-serif"
        }, children: tile.sub }),
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          left: featured ? 32 : 24,
          bottom: featured ? 32 : 22,
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: featured ? 28 : 20,
          fontWeight: 700,
          color: "#fff",
          textShadow: "0 2px 20px rgba(0,0,0,0.9)"
        }, children: tile.title }),
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          bottom: 20,
          right: 22,
          fontSize: 18,
          color: t.accent,
          opacity: hover ? 1 : 0,
          transition: "opacity 0.2s"
        }, children: "→" })
      ]
    }
  );
}
function Academy() {
  const [active, setActive] = useState("All");
  const visibleGroups = GROUPS.filter((g) => g.tabs.includes(active));
  const showLabels = active === "All";
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', sans-serif" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Academy — 62 Free Courses for Indie Filmmakers | Filmmaker Genius",
        description: "Filmmaker Genius Academy: 62 free courses covering screenwriting, directing, producing, cinematography, editing, sound, distribution, and monetization.",
        canonical: "https://filmmakergenius.com/academy",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
            { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" }
          ]
        }
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .ac-h1 { font-size: 52px; }
        @media (min-width: 768px) { .ac-h1 { font-size: 68px; } }
        .ac-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ac-grid-1 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (max-width: 900px) { .ac-grid-3 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .ac-grid-3 { grid-template-columns: 1fr; } }
        .ac-tab:hover { border-color: rgba(0,212,170,0.4) !important; color: #fff !important; }
      ` }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 24px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "72px 0 48px" }, children: [
        /* @__PURE__ */ jsx("h1", { className: "ac-h1", style: {
          fontFamily: "'Fraunces', serif",
          fontWeight: 700,
          lineHeight: 1.05,
          margin: 0
        }, children: "Academy" }),
        /* @__PURE__ */ jsx("p", { style: {
          marginTop: 16,
          fontSize: 17,
          color: "rgba(255,255,255,0.55)"
        }, children: "Ebooks, distribution guides, and education modules for independent filmmakers" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40, justifyContent: "center" }, children: TABS.map((tab) => {
        const isActive = tab === active;
        return /* @__PURE__ */ jsx(
          "button",
          {
            className: isActive ? "" : "ac-tab",
            onClick: () => setActive(tab),
            style: {
              background: isActive ? "rgba(0,212,170,0.12)" : "transparent",
              border: `1px solid ${isActive ? "rgba(0,212,170,0.5)" : "rgba(255,255,255,0.18)"}`,
              color: isActive ? "#00d4aa" : "rgba(255,255,255,0.6)",
              padding: "8px 20px",
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s"
            },
            children: tab
          },
          tab
        );
      }) }),
      /* @__PURE__ */ jsx("div", { style: { paddingBottom: 80 }, children: visibleGroups.map((g) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: 48 }, children: [
        showLabels && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }, children: [
          /* @__PURE__ */ jsx("span", { style: {
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            whiteSpace: "nowrap"
          }, children: g.label }),
          /* @__PURE__ */ jsx("span", { style: { flex: 1, height: 1, background: "rgba(255,255,255,0.07)" } })
        ] }),
        /* @__PURE__ */ jsx("div", { className: g.cols === 3 ? "ac-grid-3" : "ac-grid-1", children: g.tiles.map((t) => /* @__PURE__ */ jsx(TileCard, { tile: t }, t.title)) })
      ] }, g.key)) })
    ] })
  ] });
}
const categories = [
  { key: "dev", label: "Development & Writing", color: "#00d4aa", gradient: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)" },
  { key: "preprod", label: "Pre-Production", color: "#f59e0b", gradient: "linear-gradient(135deg,#1a1000 0%,#2d1e00 100%)" },
  { key: "prod", label: "Production", color: "#a855f7", gradient: "linear-gradient(135deg,#120a25 0%,#1e1040 100%)" },
  { key: "post", label: "Post-Production", color: "#fb7185", gradient: "linear-gradient(135deg,#1a0808 0%,#2d1010 100%)" },
  { key: "dist", label: "Distribution", color: "#34d399", gradient: "linear-gradient(135deg,#071a10 0%,#0a2d1a 100%)" },
  { key: "fund", label: "Funding", color: "#fbbf24", gradient: "linear-gradient(135deg,#1a1200 0%,#2d2000 100%)" },
  { key: "biz", label: "Business of Film", color: "#60a5fa", gradient: "linear-gradient(135deg,#060f1a 0%,#0a1a2d 100%)" },
  { key: "ai", label: "AI & Technology", color: "#818cf8", gradient: "linear-gradient(135deg,#0a0818 0%,#140e2d 100%)" }
];
const slugify = (s) => s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
const raw = [
  ["dev", "Screenplay Writing 101", "Table Read", "how-to-write-a-screenplay"],
  ["dev", "Story Structure & the Three-Act Format", "Scene Analysis", "screenplay-act-structure"],
  ["dev", "Writing the Short Film", null, "how-to-write-a-short-film-script"],
  ["dev", "Writing the Logline & Pitch Document", "Pitch Deck Maker", "how-to-write-a-logline"],
  ["dev", "Adapting Source Material for the Screen", null, "adapting-source-material"],
  ["dev", "Writing for Documentary", null, "documentary-script-writing"],
  ["dev", "The Rewrite: Developing Through Drafts", "Scene Analysis", "how-to-rewrite-a-screenplay"],
  ["preprod", "Script Breakdown Fundamentals", "Scene Analysis", "film-script-breakdown"],
  ["preprod", "Storyboarding for Indie Features", "Storyboard Generator", "how-to-storyboard-a-film"],
  ["preprod", "Budgeting & Scheduling Essentials", "Calendar", "film-budgeting-and-scheduling"],
  ["preprod", "Location Scouting & Management", "Project Intake Form", "film-location-scouting"],
  ["preprod", "Casting & Working with Actors", "Auditions", "casting-for-indie-films"],
  ["preprod", "Hiring Your Department Heads", "Crew Hire", "hiring-department-heads"],
  ["preprod", "Production Design on a Budget", null, "production-design-on-a-budget"],
  ["preprod", "Wardrobe & Costume on a Budget", "Document Library", "costume-design-for-film"],
  ["preprod", "Building a Shot List from Your Script", "Call Sheet Generator", "shot-list-filmmaking"],
  ["preprod", "Working with SAG-AFTRA on Low-Budget Films", "Contract Assistant", "sag-aftra-for-filmmakers"],
  ["preprod", "Permits & Releases: The Full Picture", "Document Library", "film-permits-and-releases"],
  ["preprod", "Insurance & Legal Basics for Filmmakers", "Contract Assistant", "film-production-insurance"],
  ["preprod", "Producing the Short Film", "Project Intake Form", "how-to-produce-a-short-film"],
  ["prod", "On-Set Protocols & Safety", "Call Sheet Generator", "film-set-safety"],
  ["prod", "Directing Actors on Indie Budgets", "Auditions", "directing-actors"],
  ["prod", "Camera & Lighting Basics", null, "camera-and-lighting-basics"],
  ["prod", "Sound Recording for Film", null, "production-sound-recording"],
  ["prod", "The Producer's Job: Producing 101", "Project Intake Form", "what-does-a-film-producer-do"],
  ["prod", "Working with Child Actors", "Auditions", "working-with-child-actors"],
  ["prod", "Working with Non-Actors", "Auditions", "directing-non-actors"],
  ["prod", "iPhone & Mirrorless Camera Filmmaking", "Storyboard Generator", "smartphone-filmmaking"],
  ["prod", "Drone Cinematography for Indie Films", null, "drone-cinematography"],
  ["prod", "Stunt & Action Coordination Basics", "Call Sheet Generator", "how-to-film-action-scenes"],
  ["prod", "Producing a Documentary", "Project Intake Form", "how-to-produce-a-documentary"],
  ["post", "Editing Workflow for Indies", null, "film-editing-workflow"],
  ["post", "Sound Design on a Budget", null, "sound-design-for-film"],
  ["post", "Color Grading Fundamentals", null, "color-grading-for-film"],
  ["post", "Music Licensing for Indie Films", "Document Library", "music-licensing-for-films"],
  ["post", "Working with a Composer", null, "working-with-a-film-composer"],
  ["post", "Visual Effects on a Budget", null, "vfx-on-a-budget"],
  ["post", "Creating Your Film Trailer", null, "how-to-make-a-film-trailer"],
  ["post", "DCP Creation & Delivery", "Document Library", "how-to-make-a-dcp"],
  ["dist", "Festival Strategy & Submissions", "Film Festivals", "film-festival-strategy"],
  ["dist", "Building Your EPK", "Document Library", "how-to-build-an-epk"],
  ["dist", "DIY Film Distribution", "Distribution Readiness", "diy-film-distribution"],
  ["dist", "Social Media Marketing for Your Film", null, "social-media-marketing-for-films"],
  ["dist", "Building a Film Website & Press Strategy", null, "how-to-make-a-film-website"],
  ["dist", "Pitching to Netflix, Amazon & Streaming Platforms", "Pitch Deck Maker", "how-to-pitch-to-streamers"],
  ["dist", "SVOD vs AVOD vs TVOD: Choosing Your Platform", "Distribution Readiness", "streaming-revenue-models"],
  ["dist", "International Sales & Foreign Distribution", "Distribution Readiness", "international-film-sales"],
  ["dist", "Film Markets: AFM, Cannes & Berlin", "Calendar", "film-markets-explained"],
  ["dist", "Understanding Distribution Contracts & Deal Terms", "Contract Assistant", "film-distribution-contracts"],
  ["fund", "Crowdfunding Campaigns That Work", "Funding Strategy", "film-crowdfunding"],
  ["fund", "Grants & Sponsorships", "Funding Strategy", "grants-for-filmmakers"],
  ["fund", "Pitching to Investors", "Pitch Deck Maker", "how-to-find-investors-for-a-film"],
  ["biz", "Starting Your Production Company", "Project Intake Form", "how-to-start-a-production-company"],
  ["biz", "The Film Business Plan", "Funding Strategy", "film-business-plan"],
  ["biz", "Film Accounting & Tax Basics", null, "film-production-accounting"],
  ["biz", "Copyright & IP Protection for Filmmakers", "Contract Assistant", "copyright-for-filmmakers"],
  ["biz", "Brand Partnerships & Product Placement", null, "brand-partnerships-for-films"],
  ["biz", "Building a Career in Independent Film", "Crew Hire", "indie-filmmaking-career"],
  ["ai", "AI Tools for Filmmakers", "Scene Analysis", "ai-tools-for-filmmakers"],
  ["ai", "Using AI for Script Development", "Scene Analysis", "ai-script-writing"],
  ["ai", "AI in Post-Production Workflows", null, "ai-in-post-production"],
  ["ai", "Virtual Production & LED Volumes", null, "virtual-production"]
];
const courses = raw.map(([category, title, pairsWith, slugOverride]) => ({
  slug: slugOverride ?? slugify(title),
  title,
  category,
  pairsWith
}));
function EducationModules() {
  const [active, setActive] = useState("all");
  const visibleCategories = useMemo(
    () => active === "all" ? categories : categories.filter((c) => c.key === active),
    [active]
  );
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Education Modules — Filmmaker Genius Academy",
        description: "Browse 60+ free education modules for indie filmmakers: screenwriting, directing, producing, cinematography, editing, sound, distribution, and marketing.",
        canonical: "https://filmmakergenius.com/academy/education"
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .em-tile { transition: transform .2s ease, border-color .2s ease; }
        .em-tile:hover { transform: translateY(-3px); }
        .em-arrow { opacity: 0; transition: opacity .2s ease; }
        .em-tile:hover .em-arrow { opacity: 1; }
        .em-crumb-link:hover { color: #00d4aa !important; }
        .em-pill:hover { border-color: rgba(0,212,170,0.4) !important; color: #fff !important; }
        .em-h1 { font-family: 'Fraunces', Georgia, serif; font-size: 52px; margin: 0; line-height: 1.05; }
        @media (min-width: 768px) { .em-h1 { font-size: 64px; } }
        .em-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 900px) { .em-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .em-grid { grid-template-columns: 1fr; } }
      ` }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "20px 24px 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }, children: [
      /* @__PURE__ */ jsx(Link, { to: "/academy", className: "em-crumb-link", style: { color: "rgba(255,255,255,0.35)", textDecoration: "none" }, children: "Academy" }),
      /* @__PURE__ */ jsx("span", { style: { margin: "0 8px" }, children: "›" }),
      /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.6)" }, children: "Education Modules" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "40px 24px 48px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("h1", { className: "em-h1", children: "Education Modules" }),
      /* @__PURE__ */ jsx("p", { style: { marginTop: 16, fontSize: 17, color: "rgba(255,255,255,0.55)" }, children: "Expert-led courses for every stage of your filmmaking journey" }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            display: "inline-block",
            marginTop: 12,
            background: "rgba(0,212,170,0.1)",
            border: "1px solid rgba(0,212,170,0.25)",
            color: "#00d4aa",
            fontSize: 13,
            fontWeight: 600,
            padding: "4px 14px",
            borderRadius: 999
          },
          children: [
            courses.length,
            " Courses"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 24px 80px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }, children: [{ key: "all", label: "All" }, ...categories.map((c) => ({ key: c.key, label: c.label }))].map((t) => {
        const isActive = active === t.key;
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActive(t.key),
            className: "em-pill",
            style: {
              background: isActive ? "rgba(0,212,170,0.12)" : "transparent",
              border: `1px solid ${isActive ? "rgba(0,212,170,0.5)" : "rgba(255,255,255,0.18)"}`,
              color: isActive ? "#00d4aa" : "rgba(255,255,255,0.6)",
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all .2s ease"
            },
            children: t.label
          },
          t.key
        );
      }) }),
      visibleCategories.map((cat) => {
        const list = courses.filter((c) => c.category === cat.key);
        if (list.length === 0) return null;
        return /* @__PURE__ */ jsxs("section", { style: { marginBottom: 48 }, children: [
          active === "all" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }, children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                style: {
                  textTransform: "uppercase",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.3)",
                  whiteSpace: "nowrap"
                },
                children: cat.label
              }
            ),
            /* @__PURE__ */ jsx("span", { style: { flex: 1, height: 1, background: "rgba(255,255,255,0.07)" } })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "em-grid", children: list.map((course) => /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/academy/${course.slug}`,
              className: "em-tile",
              style: {
                position: "relative",
                display: "block",
                minHeight: 150,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                overflow: "hidden",
                background: cat.gradient,
                textDecoration: "none"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.borderColor = cat.color;
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              },
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)"
                    }
                  }
                ),
                course.pairsWith && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      top: 14,
                      left: 16,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      borderRadius: 999,
                      color: cat.color,
                      background: `${cat.color}1f`,
                      border: `1px solid ${cat.color}40`,
                      zIndex: 2
                    },
                    children: [
                      "Pairs with: ",
                      course.pairsWith
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      bottom: 18,
                      left: 20,
                      right: 40,
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                      textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                      zIndex: 2
                    },
                    children: course.title
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "em-arrow",
                    style: {
                      position: "absolute",
                      bottom: 16,
                      right: 18,
                      color: cat.color,
                      fontSize: 18,
                      fontWeight: 700,
                      zIndex: 2
                    },
                    children: "→"
                  }
                )
              ]
            },
            course.slug
          )) })
        ] }, cat.key);
      })
    ] })
  ] });
}
const TEAL = "#00d4aa";
const BG = "#0a0a12";
const SURFACE = "#12121f";
const SURFACE2 = "#16162a";
const BORDER = "#1e1e35";
const CHAPTERS = [
  { n: 1, stage: "Development", title: "The Idea", desc: "How to develop a film idea worth making — loglines, the 5 elements of film, and the reality filter that turns a concept into a movie you can finish.", to: "/academy/roberts-filmmaking/ch1" },
  { n: 2, stage: "Development", title: "Development", desc: "Turn your idea into a script: treatment, outline, beat sheet, three-act and Save the Cat structure, screenwriting software, and the rewrite.", to: "/academy/roberts-filmmaking/ch2" },
  { n: 3, stage: "Producing", title: "Producing Your Own Film", desc: "What a producer really does — starting a production company, the business plan, raising money, and protecting your film with contracts and insurance.", to: "/academy/roberts-filmmaking/ch3" },
  { n: 4, stage: "Producing", title: "Budgeting", desc: "Build a real film budget: the top sheet, above- and below-the-line, every category, a sample breakdown, and why contingency saves your movie.", to: "/academy/roberts-filmmaking/ch4" },
  { n: 5, stage: "Pre-Production", title: "Assembling Your Crew", desc: "How to hire a film crew: the key roles, where to find people, chemistry over credits, and fair deals when the money is short.", to: "/academy/roberts-filmmaking/ch5" },
  { n: 6, stage: "Pre-Production", title: "Pre-Production", desc: "The script breakdown, shooting schedule, shot lists, storyboards, location scouting, and call sheets — where the movie is really won.", to: "/academy/roberts-filmmaking/ch6" },
  { n: 7, stage: "Production", title: "Directing", desc: "The director's real job: vision, preparation, the language of camera shots, getting coverage, and leading the set with calm authority.", to: "/academy/roberts-filmmaking/ch7" },
  { n: 8, stage: "Production", title: "Working With Actors", desc: "From an actor who's lived it: casting, auditions, rehearsal, and directing performances with actions and intentions instead of adjectives.", to: "/academy/roberts-filmmaking/ch8" },
  { n: 9, stage: "Production", title: "Cinematography & Visual Language", desc: "Make your film look like more than it cost — light, lenses, composition, camera shots and angles, and motion with meaning.", to: "/academy/roberts-filmmaking/ch9" },
  { n: 10, stage: "Production", title: "Production", desc: "Surviving the shoot: the rhythm of a day, making your day, solving problems fast, protecting sound and continuity, and keeping the set human.", to: "/academy/roberts-filmmaking/ch10" },
  { n: 11, stage: "Post-Production", title: "Post-Production", desc: "Where the film is really made: editing, color grading, sound design and the mix, music licensing, titles, and final delivery.", to: "/academy/roberts-filmmaking/ch11" },
  { n: 12, stage: "Distribution", title: "Film Festivals", desc: "A smart festival strategy: the tiers, FilmFreeway, submission fees, premiere status, and how to get into film festivals without going broke.", to: "/academy/roberts-filmmaking/ch12" },
  { n: 13, stage: "Distribution", title: "Aggregators & Distributors", desc: "The two doors to streaming — what aggregators and distributors cost, how recoupment works, and how to keep control of your film.", to: "/academy/roberts-filmmaking/ch13" },
  { n: 14, stage: "Distribution", title: "VOD & Streaming", desc: "SVOD, TVOD, AVOD, FAST and DIY explained, the global platform landscape, and a release windowing strategy that actually pays.", to: "/academy/roberts-filmmaking/ch14" },
  { n: 15, stage: "Marketing", title: "Marketing Your Film", desc: "How to market an indie film: building an audience early, your marketing plan, killer key art and trailer, press, and grassroots reach.", to: "/academy/roberts-filmmaking/ch15" },
  { n: 16, stage: "The Business", title: "Building a Career", desc: "From one film to a body of work: relationships, reputation, grants and funding, your next project, and finding your voice.", to: "/academy/roberts-filmmaking/ch16" },
  { n: 17, stage: "The Business", title: "The Long Game", desc: "How to sustain a filmmaking life: resilience through rejection, protecting your finances and creativity, and defining success on your terms.", to: "/academy/roberts-filmmaking/ch17" }
];
const STATS = [
  { num: "17", label: "Free Chapters" },
  { num: "35+", label: "Years of Experience" },
  { num: "60+", label: "Film & TV Credits" },
  { num: "Idea→Screen", label: "Every Stage Covered" }
];
function ChapterCard({ ch }) {
  return /* @__PURE__ */ jsxs(Link, { to: ch.to, className: "rf-card", style: {
    background: SURFACE,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    textDecoration: "none",
    color: "inherit",
    position: "relative",
    transition: "all 0.2s"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, opacity: 0.8 }, children: ch.stage }),
    /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }, children: [
      "Chapter ",
      ch.n
    ] }),
    /* @__PURE__ */ jsx("h3", { style: { fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, margin: 0, color: "#fff" }, children: ch.title }),
    /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }, children: ch.desc }),
    /* @__PURE__ */ jsx("span", { className: "rf-arrow", style: { position: "absolute", bottom: 16, right: 20, color: "rgba(255,255,255,0.25)", transition: "color 0.2s" }, children: "→" })
  ] });
}
function RobertsFilmmaking() {
  return /* @__PURE__ */ jsxs("div", { style: { background: BG, color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', sans-serif" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Filmmaking by Will Roberts: The Complete Indie Filmmaker's Guide",
        description: "A free 17-chapter guide to making an independent film — from idea and script through crew, production, editing, distribution, and release. By Will Roberts.",
        canonical: "https://filmmakergenius.com/academy/roberts-filmmaking",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
            { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
            { "@type": "ListItem", position: 3, name: "The Roberts Filmmaking Method", item: "https://filmmakergenius.com/academy/roberts-filmmaking" }
          ]
        }
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .rf-card:hover { border-color: rgba(0,212,170,0.4) !important; background: ${SURFACE2} !important; transform: translateY(-2px); }
        .rf-card:hover .rf-arrow { color: ${TEAL} !important; }
        .rf-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px) { .rf-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 980px) { .rf-grid { grid-template-columns: repeat(3, 1fr); } }
      ` }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "20px 24px 0", fontSize: 13, color: "rgba(255,255,255,0.3)" }, children: [
      /* @__PURE__ */ jsx(Link, { to: "/academy", style: { color: "inherit", textDecoration: "none" }, children: "Academy" }),
      /* @__PURE__ */ jsx("span", { children: " › " }),
      /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.55)" }, children: "Filmmaking by Will Roberts" })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { position: "relative", overflow: "hidden", padding: "56px 0 48px", borderBottom: `1px solid ${BORDER}`, textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 700,
        height: 480,
        filter: "blur(90px)",
        opacity: 0.16,
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, ${TEAL} 0%, transparent 70%)`
      } }),
      /* @__PURE__ */ jsxs("div", { style: { position: "relative", maxWidth: 1120, margin: "0 auto", padding: "0 24px" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }, children: "Filmmaker Genius Academy" }),
        /* @__PURE__ */ jsxs("h1", { style: { fontFamily: "'Fraunces', serif", fontSize: "clamp(40px,7vw,64px)", lineHeight: 1.04, margin: 0, maxWidth: 760, marginLeft: "auto", marginRight: "auto", fontWeight: 700 }, children: [
          "Filmmaking by ",
          /* @__PURE__ */ jsx("span", { style: { color: TEAL }, children: "Will Roberts" })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 22, fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }, children: "The complete indie filmmaker's guide — 17 free chapters that take you from the first idea all the way to getting your film distributed and seen." }),
        /* @__PURE__ */ jsxs("div", { style: { marginTop: 26, display: "inline-flex", gap: 10, alignItems: "center" }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: `2px solid ${TEAL}`,
            background: "rgba(0,212,170,0.12)",
            color: TEAL,
            fontSize: 13,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }, children: "WR" }),
          /* @__PURE__ */ jsxs("div", { style: { textAlign: "left" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.45)" }, children: "Written by" }),
            /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, color: "rgba(255,255,255,0.8)" }, children: "Will Roberts · SAG Award Winner" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { maxWidth: 800, margin: "0 auto", padding: "48px 24px 0" }, children: [
      /* @__PURE__ */ jsx("blockquote", { style: {
        fontFamily: "'Fraunces', serif",
        fontStyle: "italic",
        fontSize: 21,
        color: "rgba(255,255,255,0.78)",
        lineHeight: 1.6,
        borderLeft: `3px solid ${TEAL}`,
        paddingLeft: 24,
        margin: 0
      }, children: `"I've spent thirty-five years and sixty-plus credits learning how this is really done. This is everything I'd tell you if we sat down together — from the spark of an idea to the day strangers finally watch your film."` }),
      /* @__PURE__ */ jsx("p", { style: { marginTop: 20, fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }, children: "This free guide walks through every stage of making an independent film: development, producing, budgeting, crew, pre-production, directing, working with actors, cinematography, the shoot, post-production, festivals, distribution, streaming, marketing, and building a lasting career. Practical, specific, no fluff. Read it in order, or jump to the chapter you need right now." })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { maxWidth: 1120, margin: "0 auto", padding: "56px 24px 80px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL, marginBottom: 8 }, children: "The Complete Guide" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "'Fraunces', serif", fontSize: 28, margin: "0 0 36px", fontWeight: 700 }, children: "All 17 Chapters" }),
      /* @__PURE__ */ jsx("div", { className: "rf-grid", children: CHAPTERS.map((ch) => /* @__PURE__ */ jsx(ChapterCard, { ch }, ch.n)) })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { background: SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "32px 24px" }, children: /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 56, justifyContent: "center" }, children: STATS.map((s) => /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 700, color: TEAL }, children: s.num }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }, children: s.label })
    ] }, s.label)) }) }),
    /* @__PURE__ */ jsx("section", { style: { background: SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "64px 24px" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 760, margin: "0 auto", display: "flex", gap: 48, flexWrap: "wrap", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        width: 150,
        height: 208,
        borderRadius: 12,
        overflow: "hidden",
        background: "linear-gradient(to bottom, #0b0d10 0%, #05070a 100%)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 12px 18px",
        textAlign: "center",
        border: `1px solid ${BORDER}`
      }, children: [
        /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 3, background: TEAL } }),
        /* @__PURE__ */ jsxs("div", { style: { fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.15 }, children: [
          "The Indie Filmmaker's ",
          /* @__PURE__ */ jsx("span", { style: { color: TEAL }, children: "Complete Guide" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { width: 32, height: 1, background: TEAL, margin: "10px auto" } }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)" }, children: "By Will Roberts" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 240 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL, marginBottom: 12 }, children: "Free Download" }),
        /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "'Fraunces', serif", fontSize: 28, margin: "0 0 16px", fontWeight: 700 }, children: [
          "Take the whole guide with you — ",
          /* @__PURE__ */ jsx("span", { style: { color: TEAL }, children: "free PDF" })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 28px" }, children: "All 17 chapters in a single PDF — every stage of making an independent film, from the first idea to distribution, distilled and ready to reference. No sign-up." }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }, children: [
          /* @__PURE__ */ jsx("a", { href: "#", style: {
            height: 50,
            padding: "0 28px",
            borderRadius: 9999,
            background: TEAL,
            color: "#000",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none"
          }, children: "↓ Download Free PDF" }),
          /* @__PURE__ */ jsx(Link, { to: "/academy/roberts-filmmaking/ch1", style: { fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }, children: "Or read it online →" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "64px 24px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "'Fraunces', serif", fontSize: 30, margin: 0, fontWeight: 700 }, children: [
        "Stop reading about it. ",
        /* @__PURE__ */ jsx("span", { style: { color: TEAL }, children: "Start making it." })
      ] }),
      /* @__PURE__ */ jsx("p", { style: { marginTop: 12, fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }, children: "Filmmaker Genius takes your film from script to screen — storyboarding, casting, scheduling, contracts, and distribution strategy in one platform." }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/pricing", style: {
          height: 50,
          padding: "0 28px",
          borderRadius: 9999,
          background: TEAL,
          color: "#000",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none"
        }, children: "Start Free" }),
        /* @__PURE__ */ jsx(Link, { to: "/toolbox", style: {
          height: 50,
          padding: "0 28px",
          borderRadius: 9999,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none"
        }, children: "Explore the Toolbox" })
      ] })
    ] })
  ] });
}
const robertsChapters = {
  ch1: {
    seoTitle: "How to Develop a Film Idea: The Indie Filmmaker's First Step | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/how-to-develop-a-film-idea",
    category: "Development",
    number: 1,
    title: "The Idea",
    intro: `Everybody has ideas. Almost nobody has the <em>right</em> idea — the one worth two years of your life and every dollar you can scrape together. This chapter is about how to develop a film idea, test it, and know the difference.`,
    cta: {
      titleLead: "Have your idea? ",
      titleAccent: "Now build the film.",
      text: "Filmmaker Genius turns your script into a storyboard, table read, casting call, and production plan — all in one place."
    },
    prev: { dir: "← Back to", label: "All Chapters", to: "/academy/roberts-filmmaking" },
    next: { dir: "Next →", label: "Chapter 2: Development", to: "/academy/roberts-filmmaking/ch2" },
    bodyHtml: `<p class="dropcap">Let me tell you the most expensive mistake I see new filmmakers make. It happens before a single frame is shot, before a crew is hired, before a dollar is spent. They fall in love with the wrong idea — and then they spend two years of their life proving it.</p>
<p>I've been doing this for thirty-five years. Sixty-plus credits. I've watched brilliant, hardworking people pour their savings into a movie nobody asked for, and I've watched first-timers with almost no money make something the whole world wanted to see. The difference, nine times out of ten, wasn't talent. It wasn't gear. It was the idea they started with.</p>
<p>So before we talk about scripts, budgets, cameras, or distribution, we have to talk about the thing it actually starts with. If you want to learn how to make a movie, you start here — with the idea. Get this part right and everything downstream gets easier. Get it wrong and no amount of craft can save you.</p>
<h2>An idea is not a movie</h2>
<p>Here's the first thing to burn into your brain: <strong>an idea and a movie are two different animals.</strong> "A film about grief." "Something with time travel." "A gritty crime story set in my hometown." Those aren't movies — they're moods. You could hand that same sentence to a hundred filmmakers and get a hundred different films, which means it isn't really yours yet.</p>
<p>A <em>movie</em> idea has a specific person, who wants a specific thing, and a specific reason they might not get it. The moment you add those three things, the fog clears. "A film about grief" becomes "a widowed father has thirty days to teach his estranged teenage daughter to drive before she leaves for college, or he loses her for good." Now I can see it — who's in it, what the scenes are, and why I'd keep watching.</p>
<p class="pull">If you can't tell me who wants what and why they might not get it, you don't have a movie. You have a vibe — and vibes don't sell tickets.</p>
<p>This is the engine of every one of the five elements of film — story, character, conflict, theme, and structure. They all hang off that one specific person chasing that one specific thing. Nail the want and the obstacle, and the other four start falling into place on their own.</p>
<h2>Where real film ideas actually come from</h2>
<p>People always ask me where to <em>find</em> ideas, like there's a store. There isn't. The honest answer is that your best idea is almost certainly something you're already obsessed with and haven't noticed yet. It's the argument you keep having. The story from your family nobody else knows. The injustice that spikes your blood pressure. The "what if" that won't leave you alone at 2 a.m.</p>
<p>I tell every filmmaker I mentor the same thing: <strong>write the movie only you can make.</strong> Hollywood is drowning in competent imitations of last year's hit. What it's starving for is the specific, strange, true thing that lives in your head and nobody else's. That's your unfair advantage. You'll never out-spend the studios — but you can absolutely out-<em>specific</em> them. Good storytelling for filmmakers isn't about inventing something no one's ever seen; it's about telling something true in a way only you can.</p>
<div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Keep an idea file. A note on your phone, a cheap notebook, whatever you'll actually use. Every time something snags your attention — a headline, an overheard fight, a face on the subway — write it down in one line. Don't judge it, don't develop it, just catch it. In six months you'll have fifty entries, and three of them will be the start of something real. Ideas are cheap and constant; the discipline of <em>catching</em> them is what's rare.</p></div>
<h2>The indie reality filter</h2>
<p>Now I have to be the adult in the room, because this is what separates a working indie filmmaker from a dreamer with a hard drive full of unfinished projects. Before you commit, run your idea through what I call the reality filter: <strong>can I actually make this with the resources I can realistically get?</strong> Not the resources you wish you had — the ones you can get. A car chase through three countries, two hundred extras, and a CGI dragon is a great idea for somebody with forty million dollars. If you've got fifteen grand and your friends, that idea will crush you.</p>
<p>The filmmakers who break through pick ideas that turn their limitations into the style. One location becomes a pressure cooker. A tiny cast becomes intense and intimate. No money for spectacle becomes a reason to lean on performance and tension — which is cheaper and often better anyway. So weigh the practical questions early: How many locations? How big is the cast? Day or night? Any of the four budget-killers — kids, animals, water, or stunts? You don't have to avoid them all. You just have to <em>choose</em> them on purpose. The idea you can finish beats the idea you can only dream about, every single time.</p>
<h2>The questions to answer before page one</h2>
<p>Once you've got an idea that excites you <em>and</em> survives the reality filter, don't run straight to the script. The story development process starts with interrogation, not typing. Sit with your idea and answer these story development questions honestly:</p>
<h3>1. Whose story is this?</h3>
<p>One protagonist — not an ensemble you're hiding behind because you can't choose. Whose chest does the audience sit inside?</p>
<h3>2. What do they want, and what do they need?</h3>
<p>The want is the plot — get the money, win the girl, escape the town. The need is the theme — to forgive himself, to grow up. The gap between want and need is where a real character arc in film lives.</p>
<h3>3. What's standing in the way?</h3>
<p>No obstacle, no movie. The bigger and more personal the obstacle, the stronger the engine.</p>
<h3>4. Why now?</h3>
<p>Why does this story have to happen today and not next year? This ticking clock is what most amateur ideas are missing. Give your story a reason it can't wait.</p>
<h3>5. Why will an audience care?</h3>
<p>Be brutal. "Because it happened to me" isn't enough. It has to connect to something universal — fear, love, regret, hope. Personal is the doorway; universal is the room.</p>
<p>Answer those five cleanly and you don't just have an idea anymore — you have the skeleton of a film story structure, and you're ready to test whether it holds up.</p>
<h2>The logline: your idea's lie detector</h2>
<p>The single best tool for pressure-testing an idea is the logline — one or two sentences that capture your whole movie. Good logline writing is painful precisely because it's honest: if you can't make your movie sound compelling in one sentence, the problem usually isn't the sentence, it's the movie. The structure that almost never fails: <strong>when [the inciting incident], a [flawed protagonist] must [pursue a specific goal] or else [the stakes], before [the ticking clock].</strong></p>
<div class="example"><div class="lbl">Logline examples that work</div><p><span class="film">Jaws</span> — When a great white shark terrorizes a beach town on the eve of its busiest weekend, a water-fearing police chief must hunt the creature himself before it kills again.</p><p><span class="film">Whiplash</span> — A young jazz drummer will do anything to earn the approval of an abusive instructor whose methods push him to the edge of his sanity.</p><p>Notice what they share: one clear protagonist, a specific goal, a real obstacle, and stakes you feel immediately.</p></div>
<p>Write your logline <em>before</em> you write your script — five versions of it. Read them to someone who owes you nothing and watch their face. If their eyes light up, you've got something. If you get a polite "huh, interesting," go back to the idea. Better to find the weakness now, in one sentence, than two years and twenty thousand dollars later. The closer your idea gets to a hook a stranger can repeat to a friend, the easier everything that comes after — financing, marketing, distribution — will be.</p>
<h2>From idea to the next step</h2>
<p>Once your logline holds up, the bridge to a full screenplay is usually the treatment — a short prose version of your whole story, told in present tense, that walks through what happens beginning to end. Writing a film treatment forces the question that kills weak ideas: <em>does this story have a middle?</em> Plenty of concepts have a great setup and a satisfying ending and nothing in between. We go deep on treatments, outlines, and structure in the next chapter — but know that's the natural next move once the idea is locked. And keep one eye on the future: the same clarity that makes a strong logline is exactly what you'll need when you build a pitch deck or learn how to pitch a movie idea in a room full of people deciding whether to fund you.</p>
<p class="pull">You will live with this idea for years. Choose one you can't stop thinking about — and one you can actually afford to finish.</p>
<p>That's the whole game at this stage. Not the biggest idea, not the most expensive — the right idea: specific enough to be yours, simple enough to say in a sentence, small enough to actually make. Get that, and you've already done what most people who say they want to make movies never do. You've started for real.</p>
<section class="action"><h2>Your move before Chapter 2</h2><ul class="checklist"><li>Start your idea file today — capture ten one-line ideas this week, no judging.</li><li>Pick the one you can't stop thinking about and answer all five development questions in writing.</li><li>Write five versions of your logline using the formula: when ___, a ___ must ___ or else ___.</li><li>Read your best logline aloud to one honest person and watch their face, not their words.</li><li>Run the idea through the reality filter: locations, cast size, and budget-killers.</li></ul></section>`
  },
  ch2: {
    seoTitle: "How to Write a Screenplay: Film Development Step by Step | Filmmaking by Will Roberts | Filmmaker Genius",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/film-development-process",
    category: "Development",
    number: 2,
    title: "Development",
    intro: `An idea becomes a movie on the page first. Development is the unglamorous, decisive stretch where you turn a one-line concept into a script someone could actually shoot — and where most filmmakers quietly give up.`,
    cta: {
      titleLead: "Script in progress? ",
      titleAccent: "Develop it faster.",
      text: "Filmmaker Genius analyzes your script, runs an AI table read, and turns it into a storyboard — so you can hear your draft before you shoot it."
    },
    prev: { dir: "← Previous", label: "Chapter 1: The Idea", to: "/academy/roberts-filmmaking/ch1" },
    next: { dir: "Next →", label: "Chapter 3: Producing Your Own Film", to: "/academy/roberts-filmmaking/ch3" },
    bodyHtml: `<p class="dropcap">In Chapter 1 you found an idea worth your time and tested it with a logline. Now comes the part nobody posts about. There's no red carpet for development, no gear to unbox — just you, a blank page, and the slow work of figuring out what actually happens in your movie. This is where films are really made or lost, long before the camera shows up. Learning how to write a screenplay is really learning how to develop one; the typing is the easy part.</p>

  <h2>Development is a staircase, not a leap</h2>
  <p>The biggest mistake new filmmakers make is treating the script as the first step. It's near the <em>end</em> of development. Before it come cheaper, faster stages where mistakes cost you an afternoon instead of three months. A smart script development process moves down a staircase, and each step is a checkpoint: <strong>logline → treatment → outline → beat sheet → first draft → rewrite.</strong> Develop in the cheap stages so you fail cheap.</p>

  <h2>The treatment: your story in prose</h2>
  <p>The first real expansion of your idea is the treatment — your whole movie told as a short prose story, present tense, no dialogue, beginning to end. Most run three to ten pages. Learning how to write a film treatment is one of the highest-leverage skills in indie filmmaking, because it forces the question that kills weak ideas: <em>does this story have a middle?</em> Plenty of concepts have a killer opening and a satisfying ending and a great big nothing in the center. The treatment drags that emptiness into the light while it's still cheap to fix.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Write your treatment for a reader who is not you. Don't write "and then things get tense." Show me <em>what</em> happens that makes it tense. If you can't fill the middle with real, specific events, that's not writer's block — that's your story telling you it isn't built yet. Listen to it now, in prose, not from an audience walking out.</p></div>

  <h2>Structure: the frameworks that actually help</h2>
  <p>Once the treatment holds, think about shape. Story structure isn't a cage — it's the load-bearing wall that keeps your second act from collapsing. Strong film story structure makes a movie feel like it's <em>going somewhere</em>.</p>
  <h3>The three-act structure</h3>
  <p>The foundation. The classic three act structure screenplay divides into Setup (Act 1, ~25%), Confrontation (Act 2, ~50%), and Resolution (Act 3, ~25%), with major turning points at the act breaks. When people talk about screenplay act structure, this is the backbone. Learn it cold before you "break the rules."</p>
  <h3>Save the Cat (the 15-beat sheet)</h3>
  <p>Blake Snyder's beat sheet broke the three acts into fifteen specific beats — opening image, catalyst, midpoint, all is lost, finale — each landing near a target page. Whether or not you love it, the Save the Cat beat sheet screenplay method is the most common shared language on indie sets, and a great diagnostic for a sagging second act.</p>
  <h3>The Hero's Journey</h3>
  <p>Campbell's mythic structure — call to adventure, crossing the threshold, the ordeal, the return. Overkill for some films, perfect for anything built around transformation. Know it's in the toolbox. Pick <em>one</em> framework for your first feature and use it as a checklist, not a straitjacket — so your character arc tracks against your plot.</p>

  <h2>The outline and beat sheet: your blueprint</h2>
  <p>Expand the treatment into a scene-by-scene outline — every scene on an index card or a single line: what happens, who's in it, what changes. Now you can see the whole movie on a wall before you write a word of dialogue. This is where you rearrange, cut, and combine; moving a card is free, rewriting a finished scene is not.</p>

  <p class="pull">Amateurs write to find out what happens. Professionals find out what happens, then write. The outline is where you stop guessing.</p>

  <h2>The tools: screenwriting software</h2>
  <p>Now open your writing software. Standard screenplay formatting is non-negotiable — a script that isn't in industry format tells everyone you're new before they read a line — and the right tool handles it automatically. Prices shift, so confirm current numbers, but the tiers are stable:</p>
  <table class="tbl"><thead><tr><th>Tool</th><th>Cost</th><th>Best for</th></tr></thead><tbody>
    <tr><td>Final Draft</td><td>One-time, premium</td><td>The long-time industry standard most pros expect to receive.</td></tr>
    <tr><td>WriterDuet</td><td>Free + paid</td><td>Real-time collaboration and cloud writing. Great for co-writers.</td></tr>
    <tr><td>Arc Studio</td><td>Free + low-cost</td><td>Modern, clean, with built-in outlining and beat boards.</td></tr>
    <tr><td>Fade In</td><td>Affordable one-time</td><td>A serious, low-cost alternative that exports cleanly.</td></tr>
    <tr><td>Celtx</td><td>Subscription</td><td>All-in-one with scheduling and budgeting layered on.</td></tr>
    <tr><td>WriterSolo / Highland</td><td>Free / low-cost</td><td>Stripped-down, distraction-free writing.</td></tr>
  </tbody></table>
  <p>Don't agonize. The best screenwriting software is the one that gets out of your way and lets you finish. A free tool you actually use beats a premium one you bought to feel like a writer.</p>

  <h2>The first draft, then the rewrite</h2>
  <p>With your outline as a map, write the first draft fast and ugly. Its only job is to get the whole story out of your head where you can fix it — don't edit while you draft. Then comes the real writing: the rewrite. Cut the scenes that don't earn their place, sharpen dialogue, plant and pay off setups, make every scene do two jobs at once. Most great scripts go through many drafts; plan for it. Before you call it done, get outside eyes — trusted readers, a writers' group, or professional screenplay coverage — and take the notes without defending. The page has to work without you in the room.</p>

  <section class="action">
    <h2>Your move before Chapter 3</h2>
    <ul class="checklist">
      <li>Write your treatment this week — 3 to 10 pages, prose, present tense. Confirm your story has a real middle.</li>
      <li>Choose one structure framework and map your story against it.</li>
      <li>Build a scene-by-scene outline before writing any dialogue.</li>
      <li>Pick your screenwriting software and stop shopping. Finishing is everything.</li>
      <li>Draft fast and ugly, then schedule your rewrite and line up two honest readers.</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Scene Analysis</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="https://filmmakergenius.com/scene-analysis" target="_blank" class="tool-cta-btn">Open Scene Analysis →</a>
  </div>
</div>`
  },
  ch3: {
    seoTitle: "How to Produce Your Own Film: Production Company, Financing & Contracts | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/how-to-produce-your-own-film",
    category: "Producing",
    number: 3,
    title: "Producing Your Own Film",
    intro: `The director makes the movie good. The producer makes the movie <em>happen</em>. On most indie films that's the same person — you — and nobody tells you how hard that second job really is.`,
    cta: {
      titleLead: "Producing solo? ",
      titleAccent: "Get organized.",
      text: "Filmmaker Genius keeps your schedules, contracts, releases, and production details in one dashboard — no chaos, no confusion."
    },
    prev: { dir: "← Previous", label: "Chapter 2: Development", to: "/academy/roberts-filmmaking/ch2" },
    next: { dir: "Next →", label: "Chapter 4: Budgeting", to: "/academy/roberts-filmmaking/ch4" },
    bodyHtml: `<p class="dropcap">Here's a sentence that will save you pain: a great script with no producer is a hobby. I've watched gorgeous screenplays sit in drawers for a decade because the writer waited for someone else to show up and make it real. On an indie film, that someone is you. You are the producer until you can afford to hire one — so you'd better understand the job, because it's the one that decides whether your movie gets finished.</p>

  <p>So what does a film producer actually do? In plain English: the producer is the person responsible for the film existing. They find the money, set up the business, hire the key people, solve every problem nobody else can solve, and protect the project from the hundred things that try to kill it. The director is responsible for what's on screen. The producer is responsible for there being a screen at all.</p>

  <h2>The producer is a problem-solving machine</h2>
  <p>If I had to define producing in one phrase, it's <strong>professional problem-solving under pressure.</strong> Your lead drops out four days before the shoot. The location cancels. The money you were promised doesn't come through. A good producer doesn't panic — they expect it. The job isn't avoiding problems; it's being the person who calmly fixes them while everyone looks at you. You don't need a film-school degree to produce. You need to be relentless, organized, trustworthy, and impossible to discourage.</p>

  <h2>Know the roles before you wear all the hats</h2>
  <p>"Producer" is a family of jobs. On a big film these are different people; on yours, they may all be you.</p>
  <h3>Executive Producer</h3><p>Usually the money — the people who financed the film or brought the financing.</p>
  <h3>Producer</h3><p>The captain of the ship — oversees the project from development through delivery: money, team, schedule, deals.</p>
  <h3>Line Producer</h3><p>The budget and logistics specialist who turns the script into a cost and a schedule, then manages the money day by day. If you can pay one person well, this hire often pays for itself.</p>
  <h3>Production Manager / Coordinator</h3><p>The engine room — permits, paperwork, vendors, the thousand logistics that keep a shoot legal and moving.</p>

  <h2>Set up the business like a business</h2>
  <p>This is the step amateurs skip. <strong>Your movie is a business, so build one.</strong> Before you take a dollar from an investor, learn how to start a production company the right way — because mixing your film's money with your personal account is how filmmakers end up in real legal and tax trouble. The standard move is to form a separate entity, usually an LLC. It keeps the production's money and liabilities separate from your personal life, and gives investors a clean, professional structure to invest <em>into</em>. Laws vary by state, so spend a little on a film finance lawyer or accountant — the cheapest insurance you'll ever buy.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Open a separate bank account for the film the day you form the company, and never pay for a personal thing out of it or a film thing out of your own pocket. Every dollar in, every dollar out, through that one account. When tax time comes, when an investor asks for an accounting, when you apply for your next film's funding, that clean paper trail makes you look like exactly what you want to be: someone who can be trusted with other people's money.</p></div>

  <h2>The business plan and the money</h2>
  <p>Investors don't fund movies — they fund businesses that happen to make movies. A serious film production company business plan translates your vision into the language money speaks: who the audience is, comparable films and what they earned, how much you need, how you'll spend it, and how an investor might see a return. You don't need to be a finance expert; a clear template walks you through it.</p>
  <p>As for where the money comes from, most indie films stitch several sources together. <strong>Equity investors</strong> put in money for a share of profits — and learning how to find investors for a film usually starts closer to home than you'd think, with successful people in your own network. <strong>Crowdfunding</strong> raises money from your audience while building one. <strong>Grants</strong> give money you don't pay back. <strong>Tax incentives and rebates</strong> return a percentage of local spend. And <strong>in-kind support</strong> — donated locations, gear, favors — stretches every dollar. We go deep on the budget itself in the next chapter.</p>

  <h2>Protect the movie: rights, contracts, insurance</h2>
  <p>A distributor or streamer will not touch your film if you can't prove you own it. That proof is <em>chain of title</em> — the paper trail showing you have the rights to the script, the music, the footage, everything. Get every contributor to sign, in writing, before they work: writers, actors, composers, crew. A handshake is not a contract. You'll also need <strong>production insurance</strong> (general liability at minimum — most locations and rental houses require it) and <strong>release forms</strong> for every recognizable face and private location. None of it is glamorous; all of it is the difference between a film you can legally distribute and an expensive home movie you can't.</p>

  <p class="pull">Talent gets the movie made beautifully. Producing gets the movie made at all. Respect the second job as much as the first.</p>

  <section class="action">
    <h2>Your move before Chapter 4</h2>
    <ul class="checklist">
      <li>Decide who's producing. If it's you, accept the job fully — it's as important as directing.</li>
      <li>Research how to form an LLC in your state and open a dedicated film bank account before any money moves.</li>
      <li>Draft a one-page business plan: audience, comps, budget top-line, financing.</li>
      <li>List ten people in your network who could invest, fund, or open a door.</li>
      <li>Make a rights-and-insurance checklist so chain of title and coverage are clean before day one.</li>
    </ul>
  </section>`
  },
  ch4: {
    seoTitle: "Film Budgeting for Indie Filmmakers: How to Build a Movie Budget | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/how-to-budget-a-film",
    category: "Producing",
    number: 4,
    title: "Budgeting",
    intro: `A budget isn't a wish list and it isn't a guess. It's the most honest document in your production — the one that decides, line by line, whether your movie actually gets finished.`,
    cta: {
      titleLead: "Build your budget ",
      titleAccent: "with confidence.",
      text: "Filmmaker Genius helps you break down your script and plan your budget and schedule from the same data — no spreadsheets stitched together by hand."
    },
    prev: { dir: "← Previous", label: "Chapter 3: Producing Your Own Film", to: "/academy/roberts-filmmaking/ch3" },
    next: { dir: "Next →", label: "Chapter 5: Assembling Your Crew", to: "/academy/roberts-filmmaking/ch5" },
    bodyHtml: `<p class="dropcap">Let me tell you when a movie really dies. Not on set, not in the edit — in week three of a forty-day shoot, when the producer realizes the money will run out before the story does. I've seen it happen to talented people, and it's almost always avoidable. The budget is where you prevent it. Get it right and you give yourself the one thing every indie film needs more than talent: the ability to finish.</p>

  <p>A film budget is simply a detailed plan for every dollar your movie will cost, organized so you can track it, defend it to investors, and adjust it when reality hits — and reality always hits. Knowing how to build a real film budget breakdown is what separates filmmakers who finish from filmmakers who fold.</p>

  <h2>The top sheet: your budget at a glance</h2>
  <p>Every professional budget starts with a <em>top sheet</em> — a single page summarizing every category and totaling to your grand total, with the detailed pages beneath it. It splits into two worlds you must understand: <strong>above-the-line</strong> (the creative leadership and rights — story, producer, director, principal cast) and <strong>below-the-line</strong> (everything it takes to actually make the movie — crew, gear, locations, food, post). On an indie film, below-the-line is where most of the money goes.</p>

  <h2>The categories: where the money goes</h2>
  <table class="tbl"><thead><tr><th>Category</th><th>What it covers</th></tr></thead><tbody>
    <tr><td>Story &amp; Rights</td><td>Script, option fees, underlying material</td></tr>
    <tr><td>Producers &amp; Director</td><td>Fees (often deferred on micro-budgets), always line-itemed</td></tr>
    <tr><td>Cast</td><td>Principals, day players, background, stunts</td></tr>
    <tr><td>Production Crew</td><td>Camera, sound, grip &amp; electric, art, hair/makeup, wardrobe, AD team</td></tr>
    <tr><td>Equipment</td><td>Camera package, lenses, lighting, grip, sound — buy or rent</td></tr>
    <tr><td>Locations</td><td>Fees, permits, parking, security, cleanup, insurance</td></tr>
    <tr><td>Art &amp; Wardrobe</td><td>Sets, props, set dressing, costumes, makeup</td></tr>
    <tr><td>Production Costs</td><td>Catering &amp; craft services, transport, expendables, office</td></tr>
    <tr><td>Post-Production</td><td>Editing, color, sound mix, music, VFX, titles, deliverables</td></tr>
    <tr><td>Insurance &amp; Legal</td><td>Production insurance, the LLC, contracts, E&amp;O for delivery</td></tr>
    <tr><td>Marketing &amp; Festival</td><td>Submission fees, poster, trailer, press kit, screeners</td></tr>
    <tr><td>Contingency</td><td>The cushion for when reality hits — non-negotiable</td></tr>
  </tbody></table>

  <h2>What does an indie film actually cost?</h2>
  <p>Anywhere from the change in your pocket to millions. The rough tiers help you stay realistic:</p>
  <table class="tbl"><thead><tr><th>Tier</th><th>Typical range</th><th>What it looks like</th></tr></thead><tbody>
    <tr><td>No-budget / micro</td><td>$0–$50,000</td><td>Favors, owned gear, tiny cast, few locations. The classic first feature.</td></tr>
    <tr><td>Low-budget</td><td>$50K–$500K</td><td>Some paid crew and cast, rented gear, real insurance, a short shoot.</td></tr>
    <tr><td>Mid-budget indie</td><td>$500K–$5M</td><td>Recognizable cast, full crew, union considerations, longer schedule.</td></tr>
    <tr><td>Studio-level indie</td><td>$5M+</td><td>Stars, full guild compliance, a different world.</td></tr>
  </tbody></table>
  <p>Most people reading this are in the first two tiers — exactly where great careers start. The job isn't the biggest budget; it's building a film that lives comfortably inside the budget you can actually raise.</p>

  <div class="example">
    <div class="lbl">Sample micro-budget short (~$10,000) — illustrative</div>
    <p><span>Camera &amp; lenses (rental, 3 days)</span><span>$1,200</span></p>
    <p><span>Lighting &amp; grip package (3 days)</span><span>$900</span></p>
    <p><span>Sound gear + mixer day rate</span><span>$1,200</span></p>
    <p><span>Key crew (small team, low/deferred)</span><span>$2,500</span></p>
    <p><span>Cast (day players + background)</span><span>$1,000</span></p>
    <p><span>Locations &amp; permits</span><span>$800</span></p>
    <p><span>Catering &amp; craft (3 days)</span><span>$900</span></p>
    <p><span>Production insurance (short-term)</span><span>$600</span></p>
    <p><span>Post (edit, color, sound mix)</span><span>$900</span></p>
    <p><span>Contingency (~10%)</span><span>$1,000</span></p>
  </div>

  <h2>Contingency: the line that saves your movie</h2>
  <p>If you remember one thing: <strong>always build in a contingency.</strong> Set aside roughly ten percent for the disasters you can't predict — and you can't predict them, but you can be certain they're coming. A day gets rained out. Gear breaks. You need an extra half-day. The filmmakers who finish are the ones who planned for the unplanned.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>In thirty-five years I have never been on a production that didn't hit a surprise that cost money. Not once. The contingency isn't pessimism; it's professionalism. When the surprise comes and you calmly reach into the cushion you built, you look like a genius. When it comes and you have nothing, you look like someone who's never done this. Build the ten percent. Defend it. Don't spend it until you truly have to.</p></div>

  <h2>Tools and stretching the dollar</h2>
  <p>You don't need expensive software for your first budget — a well-structured spreadsheet or a free film budget template carries you a long way; as budgets grow, dedicated tools like Movie Magic Budgeting earn their place. To stretch every dollar: write to your resources (fewer locations, smaller cast, daytime exteriors), cash in favors honestly and in writing, chase tax incentives and rebates, feed your crew well (never cut catering), and protect your post-production money — a film that's shot but can't afford to be finished is the most expensive failure there is.</p>

  <p class="pull">A budget is a story about priorities. Spend where it shows on screen. Save where it doesn't. And never, ever skip the contingency.</p>

  <section class="action">
    <h2>Your move before Chapter 5</h2>
    <ul class="checklist">
      <li>Build a budget template with every category from the table above.</li>
      <li>Draft a top sheet splitting above-the-line and below-the-line.</li>
      <li>Get three real local quotes for your biggest line: the camera and lighting package.</li>
      <li>Add a 10% contingency line and commit to protecting it.</li>
      <li>Pressure-test the total against what you can realistically raise — and rewrite the movie to fit if it doesn't.</li>
    </ul>
  </section>`
  },
  ch5: {
    seoTitle: "How to Hire a Film Crew: Building Your Indie Film Team | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/how-to-hire-a-film-crew",
    category: "Pre-Production",
    number: 5,
    title: "Assembling Your Crew",
    intro: `Movies aren't made by directors. They're made by teams the director assembled. The crew you build <em>is</em> the film you get — so this decision matters as much as casting your lead.`,
    cta: {
      titleLead: "Build your dream team ",
      titleAccent: "in one place.",
      text: "Filmmaker Genius lets you audition, cast, and hire crew, and manage every detail from one dashboard."
    },
    prev: { dir: "← Previous", label: "Chapter 4: Budgeting", to: "/academy/roberts-filmmaking/ch4" },
    next: { dir: "Next →", label: "Chapter 6: Pre-Production", to: "/academy/roberts-filmmaking/ch6" },
    bodyHtml: `<p class="dropcap">I've made films with big crews and films with five people in a van, and here's what I learned: a small crew of the right people beats a large crew of the wrong ones every time. The myth of the solo-genius filmmaker is exactly that — a myth. Behind every director you admire is a team of specialists who made the vision possible. Learning how to hire a film crew, and how to choose <em>who</em>, is one of the most important skills you'll ever develop.</p>

  <p>The mindset shift: you're not looking for warm bodies to fill jobs. You're recruiting collaborators who will elevate your movie beyond what you could do alone. The right director of photography won't just operate a camera — they'll make your film look like more money than you spent. The right first assistant director will get you through your day so you actually finish.</p>

  <h2>The key positions — and who to hire first</h2>
  <h3>Director of Photography (DP)</h3>
  <p>Your most important hire after your leads. The DP owns the look — camera, lighting, composition. A great DP is a creative partner, not a technician. If you can pay one person well, many indie directors make it the DP.</p>
  <h3>First Assistant Director (1st AD)</h3>
  <p>The person who runs the set so you can direct — builds and protects the schedule, keeps the day moving, manages the chaos. A strong 1st AD is the difference between making your day and going home with half your scenes.</p>
  <h3>Sound Mixer</h3>
  <p>The most underrated hire in indie film. Audiences forgive imperfect images; they will not forgive bad sound. Never let your friend "just hold the boom" — fixing bad audio in post is expensive, often impossible, and the fastest way to look amateur.</p>
  <h3>Production Designer, Gaffer &amp; Key Grip, Hair/Makeup/Wardrobe</h3>
  <p>The designer owns the world on screen; the gaffer leads lighting and the key grip handles rigging; hair, makeup, and wardrobe keep your actors consistent across days. On a micro-budget some of these merge — but someone has to own each one.</p>

  <h2>Chemistry beats credits</h2>
  <p>The most important advice in this chapter, and the one new filmmakers ignore most: <strong>hire for chemistry and attitude over résumé.</strong> A dazzling credit list with a bad attitude will poison your set. A slightly less experienced person who's hungry, kind, and reliable will run through walls for you — and your set becomes a place people want to come back to.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>The "no jerks" rule has saved more of my productions than any piece of gear. I don't care how brilliant someone is — if they make the set tense, they cost you more than they're worth, because everyone around them gets worse. A film set is a pressure cooker for twelve hours a day. Hire people who make the pressure bearable. Talent you can find. Good humans who are also good at their jobs? Hold onto them for your whole career.</p></div>

  <h2>Where to find crew — and how to deal fairly</h2>
  <p>On your first films, closer than you think: film schools and recent grads, local film communities and Facebook groups, industry job boards, and above all referrals — the best crew comes from someone good vouching for someone good. Hiring locally also saves travel and housing and gives you people who know the area.</p>
  <p>On money: on low and micro-budget films you often can't pay full rates, and there are honest ways to handle it — clear deferral agreements, fair flat day rates, points for key collaborators, and always great food, real credit, and a copy of the finished film for their reel. What you can't do is be vague. Put every arrangement in writing before the shoot. People will work for less when they're respected and the terms are clear; they'll resent you forever if they feel tricked. And once they're hired, you set the tone — good film set etiquette (start on time, communicate clearly, feed people, treat the most junior person with respect) builds the reputation that hires your next crew for you.</p>

  <p class="pull">You're not just hiring a crew for this film. You're building the team that could carry your whole career — if you treat them like it.</p>

  <section class="action">
    <h2>Your move before Chapter 6</h2>
    <ul class="checklist">
      <li>List the key roles your specific film actually needs — be honest about who can double up.</li>
      <li>Make finding a great DP and a strong 1st AD your top two hiring priorities.</li>
      <li>Reach out to three local film communities, schools, or crew groups this week.</li>
      <li>Draft clear, written deal terms (rate, deferral, credit, meals) before you offer anyone a job.</li>
      <li>Commit to the "no jerks" rule and the kind of set you want to run.</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Crew Hire</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="../FilmmakerGenius_CrewHire.html" class="tool-cta-btn">Open Crew Hire →</a>
  </div>
</div>`
  },
  ch6: {
    seoTitle: "Film Pre-Production: Script Breakdown, Scheduling, Shot Lists & Call Sheets | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/film-pre-production",
    category: "Pre-Production",
    number: 6,
    title: "Pre-Production",
    intro: `Every problem you solve before the camera rolls costs you an afternoon. Every problem you solve on set costs you a small fortune. Pre-production is where the movie is really won.`,
    cta: {
      titleLead: "Plan your shoot ",
      titleAccent: "without the chaos.",
      text: "Filmmaker Genius breaks down your script and builds shot lists, storyboards, and schedules from the same data — so nothing falls through the cracks."
    },
    prev: { dir: "← Previous", label: "Chapter 5: Assembling Your Crew", to: "/academy/roberts-filmmaking/ch5" },
    next: { dir: "Next →", label: "Chapter 7: Directing", to: "/academy/roberts-filmmaking/ch7" },
    bodyHtml: `<p class="dropcap">There's a saying on every professional set: the film is made three times — once in pre-production, once on set, and once in the edit. The middle one gets the glory, but the first one decides whether the other two go smoothly or fall apart. I've never regretted time spent in pre-production. I've deeply regretted time I <em>didn't</em> spend there — usually at 2 a.m. on a shoot day, paying a whole crew's overtime to solve a problem I could've solved at my kitchen table.</p>

  <h2>It starts with the script breakdown</h2>
  <p>Everything flows from one document: the script breakdown. You go through your screenplay scene by scene and tag every element it requires — cast, extras, props, wardrobe, makeup, vehicles, effects, locations, sound needs. Every gun, every cup of coffee, every dog, every rainstorm. When you're done you don't have a script anymore; you have a complete inventory of everything your movie needs to exist. It's the foundation for the schedule, the budget refinements, the shopping lists, and every day's call sheet.</p>

  <h2>Building the schedule</h2>
  <p>Here's what beginners miss: <strong>you don't shoot in script order.</strong> You shoot in the order that's most efficient — grouping scenes by location (shoot everything at the diner in one day, even if those scenes are scattered through the movie), by actor availability, and by time of day. Company moves — packing up and relocating — devour shooting days, so a smart schedule minimizes them. And be realistic about how much you can shoot in a day. New filmmakers wildly overestimate, schedule fifteen pages, and crash. Plan fewer pages than your optimism wants.</p>

  <h2>Visualizing the film: shot lists and storyboards</h2>
  <p>Before you arrive on set, you should know what the movie looks like. A <strong>shot list</strong> is a scene-by-scene list of every shot you intend to capture — angle, size, movement, notes. It's your director's battle plan, so you execute instead of deciding on the day. For complex sequences — action, effects, tricky geography — a <strong>storyboard</strong> (simple sketches, stick figures are fine) solves the visual puzzle on paper, where mistakes are free, instead of on set, where they cost the day.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Walk your locations with your DP before the shoot, shot list in hand, and rehearse the day in your head standing in the real space. Where does the camera go? Where's the sun at 4 p.m.? Where do you plug in? Where does everyone eat? I've caught a dozen would-be disasters this way — the outlet that didn't exist, the train that roared by every twenty minutes, the "big" room that was actually tiny. An hour of scouting saves a day of scrambling.</p></div>

  <h2>Locations and the call sheet</h2>
  <p>Film location scouting confirms the places in your head actually work in reality: power, bathrooms, parking for trucks, sound control, permits, and room for the crew to work. Lock locations in writing with a signed agreement and confirm permits and insurance early. Then all this planning gets distilled, day by day, into the most important piece of paper on any set: the call sheet. It tells everyone what's happening that day — who's needed and when, where to go, the scenes, the weather, sunrise/sunset, the nearest hospital, and the hour-by-hour schedule. It goes out the night before, every night. When everyone arrives knowing exactly what the day holds, the set runs like a machine.</p>

  <div class="example">
    <div class="lbl">The pre-production checklist, in order</div>
    <p><strong>1.</strong> Complete the script breakdown — tag every element in every scene.</p>
    <p><strong>2.</strong> Build the shooting schedule — group by location, not script order.</p>
    <p><strong>3.</strong> Create shot lists for every scene; storyboard the hard ones.</p>
    <p><strong>4.</strong> Scout and lock locations in writing; confirm permits and insurance.</p>
    <p><strong>5.</strong> Finalize cast and crew deals; confirm gear and transport.</p>
    <p><strong>6.</strong> Prep daily call sheets and send the first one the night before day one.</p>
  </div>

  <p class="pull">Amateurs hope it works out on the day. Professionals make sure it does, the week before.</p>

  <section class="action">
    <h2>Your move before Chapter 7</h2>
    <ul class="checklist">
      <li>Do a full script breakdown, scene by scene, tagging every element.</li>
      <li>Build a realistic schedule grouped by location — and cut your daily page count to something achievable.</li>
      <li>Create a shot list for your most important scene and storyboard your most complex one.</li>
      <li>Scout your top locations in person with your DP and lock them in writing.</li>
      <li>Build a call-sheet template now so day-one prep is fill-in-the-blanks, not a fire drill.</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Calendar</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="https://filmmakergenius.com/calendar" target="_blank" class="tool-cta-btn">Open Calendar →</a>
  </div>
</div>`
  },
  ch7: {
    seoTitle: "Film Directing for Beginners: The Director's Job, Vision & Working on Set | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/how-to-direct-a-film",
    category: "Production",
    number: 7,
    title: "Directing",
    intro: `Directing isn't yelling "action" and looking through a monitor. It's holding a clear vision in your head and making a thousand small decisions that keep everyone moving toward it.`,
    cta: {
      titleLead: "Direct with a plan ",
      titleAccent: "in hand.",
      text: "Filmmaker Genius turns your script into shot lists and storyboards so you walk onto set knowing every setup."
    },
    prev: { dir: "← Previous", label: "Chapter 6: Pre-Production", to: "/academy/roberts-filmmaking/ch6" },
    next: { dir: "Next →", label: "Chapter 8: Working With Actors", to: "/academy/roberts-filmmaking/ch8" },
    bodyHtml: `<p class="dropcap">People think the director is the person in the chair with the megaphone. After thirty-five years on sets, here's what the job actually is: the director is the one person who knows what the finished film is supposed to feel like, and whose entire job is to protect that feeling through the chaos of production. Everyone else is a specialist in their piece. You're the one holding the whole thing in your head. Good film directing isn't about being the loudest voice or the most technical person in the room — it's about vision and communication.</p>

  <h2>The vision comes first</h2>
  <p>Before you can direct anyone, you have to know what your film is about — not just the plot, but the feeling, the tone, the why. How should the audience feel walking out? What does it look and sound like? A director without a clear vision makes a muddy film, because every department looks to you for "what are we going for?" — and if you don't know, nobody does. This vision is the standard you measure every choice against: the lens the DP proposes, the reading the actor offers, the color the designer suggests. You don't need every answer, but you need the standard every answer gets measured against.</p>

  <h2>Preparation is the secret of confident directing</h2>
  <p>The confident, decisive directors you admire aren't improvising — they're prepared. They did the work in pre-production, they know their shot list cold, they've thought through each scene's purpose. So when something goes sideways on set, they have the mental room to adapt. The director who shows up without a plan spends the whole day reacting, and the crew feels it. Preparation doesn't kill spontaneity — it's what <em>buys</em> you spontaneity.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Know what each scene is <em>for</em> before you shoot it — not just what happens, but what it does for the story. Ask: if I cut this scene, what does the audience lose? If you can't answer, you'll shoot it flat and feel it die in the edit. When you know a scene's job, you know where to put the camera, how to pace it, and what performance you need. The story question always comes before the camera question. Always.</p></div>

  <h2>Speaking the camera's language</h2>
  <p>You don't have to be a cinematographer, but you must understand the basic camera shots in filmmaking, because shots are the words you tell your story with. A wide shot establishes a world and makes a character small in it; a close-up forces intimacy and shows us what someone feels; a low angle makes a character powerful, a high angle makes them vulnerable; a slow push-in pulls us toward a realization. Every one is a storytelling choice. You and your DP make these together (next chapter goes deep on the craft), but the director must know enough of the language to say what the story needs — and your shot list is where it lives.</p>

  <h2>Coverage: protect yourself in the edit</h2>
  <p>One of the most important technical concepts in directing is coverage — shooting a scene from enough angles that you can actually cut it together later: a wide master, then mediums, then close-ups of each actor, plus inserts. Getting coverage means options in the edit — to control pace, cut around a flubbed line, find the scene's rhythm. New directors fall in love with one beautiful shot and forget to cover the scene, then discover they can't cut to anything. Get your coverage first; chase the gorgeous shot after.</p>

  <h2>Leading the set</h2>
  <p>On the day, directing becomes leadership. A set looks to its director for tone and confidence. If you're calm, focused, and decisive, the set runs well; if you're panicked, that anxiety spreads through every department. Work through your 1st AD so you can focus on performance and the shot. When you don't know something, ask the specialist — that's using your team, not weakness. And keep one eye on the clock always: a director who chases perfection on shot one and loses the last three scenes of the day has failed the film. Directing is getting the best version of each scene the time and money allow — and knowing when to move on.</p>

  <p class="pull">A director's job is to know what the film should be — and to make a thousand decisions a day, calmly, that get everyone there.</p>

  <section class="action">
    <h2>Your move before Chapter 8</h2>
    <ul class="checklist">
      <li>Write a one-paragraph vision statement: your film's feeling, tone, and what it's really about.</li>
      <li>For every scene, write one line: what is this scene <em>for</em> in the story?</li>
      <li>Mark your shot list with the size and angle for each setup.</li>
      <li>Plan your coverage for your most important scene: master, mediums, close-ups, inserts.</li>
      <li>Decide how you'll lead — calm, prepared, decisive — and commit to moving on when a shot is good enough.</li>
    </ul>
  </section>`
  },
  ch8: {
    seoTitle: "Directing Actors: Casting, Rehearsal & Getting Great Performances | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/working-with-actors",
    category: "Production",
    number: 8,
    title: "Working With Actors",
    intro: `I've spent my career on the actor's side of the camera. So let me let you in on what we actually need from a director — because great performances aren't pulled out of actors. They're set free.`,
    cta: {
      titleLead: "Cast your film ",
      titleAccent: "the smart way.",
      text: "Filmmaker Genius lets you post casting notices and audition, cast, and manage talent from one dashboard — powered by a live actor network."
    },
    prev: { dir: "← Previous", label: "Chapter 7: Directing", to: "/academy/roberts-filmmaking/ch7" },
    next: { dir: "Next →", label: "Chapter 9: Cinematography & Visual Language", to: "/academy/roberts-filmmaking/ch9" },
    bodyHtml: `<p class="dropcap">I'm going to write this one a little differently, because this is the part of filmmaking I know from the inside. I've stood on the actor's mark for thirty-five years, under directors who made me brilliant and directors who made me wooden — and the difference had almost nothing to do with talent and everything to do with how they treated the people in front of the lens. Your actors are the face of your film. Audiences don't watch your shot list; they watch human beings. The good news for indie filmmakers is that working with actors costs nothing but knowledge and care.</p>

  <h2>Casting is 90% of directing</h2>
  <p>There's an old saying that casting is ninety percent of directing, and it's true. The single biggest thing you can do for your performances is cast the right people in the first place. A brilliantly cast actor who simply <em>is</em> the character gives you gold with minimal direction; a miscast actor fights the role no matter how hard you both work. When you're casting for indie films, look for more than talent — the right essence, the ability to take direction, and someone you can stand to work with for long, hard days. Indie film casting is as much about temperament and reliability as the read.</p>
  <h3>Running a good audition</h3>
  <p>Make the room safe — nervous actors give bad auditions and you'll never see what they can do. Be warm, let them do their prepared read, then give them an adjustment and let them go again. That second take tells you whether they can change, which is everything. When you have a shortlist, do a chemistry read with your leads together; two great actors with no chemistry will still sink a love story.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Watch how an actor takes your adjustment in the room, not just how good their first read is. I've booked roles with a shaky first take because I changed completely on the second — and I've watched flawless first reads lose the part because the actor couldn't budge when redirected. On set you'll be giving notes all day. Cast the person who can <em>move</em>. A directable seven beats an undirectable nine every time.</p></div>

  <h2>Rehearsal: do the work before the clock is running</h2>
  <p>Whenever you can, rehearse before you're on set burning daylight. Rehearsal is where you and your actors discover the scene together — relationships, subtext, rhythm — so on the day you're capturing something you've already found instead of searching in front of forty waiting crew. Even one rehearsal, even a phone call about a character's history, pays off. But don't over-rehearse to the point the performance goes stale; build a foundation, then leave room for the alive thing to happen when the camera rolls.</p>

  <h2>The language of directing actors</h2>
  <p>Here's where so many directors go wrong. When directing actors on set, <strong>give them actions and intentions, not adjectives and line-readings.</strong> Don't say "be sadder" or "say it angrier" — telling an actor the result just makes them play the emotion from the outside, and the camera sees through it. Instead, give them something to <em>do</em>. Actors work in verbs: to plead, to threaten, to seduce, to protect. "Try to make her stay without admitting you need her" is a direction an actor can play. "Be more vulnerable" is not. And never give a line-reading — saying the line the way you want it said. It's the fastest way to insult an actor and get a hollow imitation. If they're missing it, adjust the <em>circumstance</em> — what the character wants, what just happened — and the reading fixes itself.</p>

  <div class="example">
    <div class="lbl">Bad direction vs. good direction</div>
    <p><strong>Instead of:</strong> "Be angrier." &nbsp;→&nbsp; <strong>Try:</strong> "You just found out he lied to you for years. Make him admit it."</p>
    <p><strong>Instead of:</strong> "Say it sadder." &nbsp;→&nbsp; <strong>Try:</strong> "You're trying not to cry in front of your kid. Hold it together for her."</p>
    <p><strong>Instead of:</strong> "More energy!" &nbsp;→&nbsp; <strong>Try:</strong> "You have ten seconds to convince them before they walk out."</p>
  </div>

  <h2>On set: create safety and trust</h2>
  <p>An actor's best work requires vulnerability, and vulnerability requires safety. Create a space where actors feel protected enough to take risks and even to fail. Praise specifically so they know what to keep ("that look before the line — that was the whole scene"), correct gently and privately, and never embarrass an actor in front of the crew. For difficult emotional or intimate scenes, close the set and handle the day with extra care and clear boundaries. Give your actors your full attention after each take — nothing kills a performance faster than a director mumbling "good, moving on" at the monitor. The care you show your cast comes back to you on screen, every time.</p>

  <p class="pull">You don't pull a performance out of an actor. You build the conditions where they can give you their best — and then you get out of the way.</p>

  <section class="action">
    <h2>Your move before Chapter 9</h2>
    <ul class="checklist">
      <li>In every audition, give one adjustment and cast the actors who can change on the second take.</li>
      <li>Do a chemistry read with your leads before locking the cast.</li>
      <li>Schedule at least one rehearsal before you're on the clock on set.</li>
      <li>Rewrite three of your trickiest scene notes as actions and intentions, not adjectives.</li>
      <li>Commit to never giving a line-reading, and to correcting actors privately.</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Auditions</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="https://filmmakergenius.com/upload-auditions" target="_blank" class="tool-cta-btn">Open Auditions →</a>
  </div>
</div>`
  },
  ch9: {
    seoTitle: "Cinematography & Visual Language: Camera, Lenses, Lighting & Composition | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/camera-shots-in-filmmaking",
    category: "Production",
    number: 9,
    title: "Cinematography & Visual Language",
    intro: `The camera doesn't just record your story — it tells it. Light, lens, frame, and movement are a language, and learning to speak it is how a small movie looks like a big one.`,
    cta: {
      titleLead: "See your shots ",
      titleAccent: "before you shoot.",
      text: "Filmmaker Genius storyboards your scenes with the touch of a button, so you and your DP plan the look before the day."
    },
    prev: { dir: "← Previous", label: "Chapter 8: Working With Actors", to: "/academy/roberts-filmmaking/ch8" },
    next: { dir: "Next →", label: "Chapter 10: Production", to: "/academy/roberts-filmmaking/ch10" },
    bodyHtml: `<p class="dropcap">Here's something that will save you thousands of dollars: audiences don't respond to expensive cameras. They respond to good <em>images</em>. I've seen breathtaking films shot on modest gear and ugly films shot on the most expensive cameras money can rent. The difference is cinematography — using light, composition, and movement to tell the story visually. Master the principles and you can make fifteen thousand dollars look like a million.</p>

  <h2>Light is everything</h2>
  <p>If you remember one thing: <strong>cinematography is the art of light.</strong> The camera is just a box that records light, so whoever controls the light controls the image — which is the best news in indie filmmaking, because good lighting for indie film is far more about skill than money. The foundation is three-point lighting: a <em>key</em> (your main source, shaping the face), a <em>fill</em> (softening the key's shadows), and a <em>back light</em> (separating subject from background). Kill the fill and let shadows go deep for drama; soften and balance everything for warmth. The way you light a face tells the audience how to feel about that person before they say a word.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Learn to see natural light before you spend a dime on fixtures. The hour after sunrise and before sunset — golden hour — gives you gorgeous, soft, directional light for free; shoot your most beautiful exteriors then. And shape daylight with the cheapest tools in the business: a bounce board to fill shadows, a black flag to cut light, a sheer curtain to soften a window. Some of the best footage I've ever been in cost nothing but knowing when and where to point the actor's face.</p></div>

  <h2>The frame: composition tells the story</h2>
  <p>Where you put things in the frame is a storytelling choice. The rule of thirds — dividing the frame into a three-by-three grid and placing key elements on those lines — creates balanced, dynamic images almost automatically. Beyond that, think about what the frame is <em>saying</em>: negative space makes a character feel alone; a tight, cluttered frame feels claustrophobic; a foreground element adds depth and hides a thin budget. Compose for feeling, not just for "nice."</p>

  <h2>Shots and angles: the visual vocabulary</h2>
  <p>The camera shots in filmmaking are your sentences and the camera angles are your tone of voice. Shot <strong>sizes</strong> control intimacy — the wide establishes and isolates, the medium is your conversational workhorse, the close-up forces us into emotion. Shot <strong>angles</strong> control power — eye-level feels honest, a low angle makes a subject dominant, a high angle makes them vulnerable, a dutch tilt creates unease. None of these are arbitrary; choose the size and angle that match what the moment means.</p>

  <h2>Lenses and movement</h2>
  <p>Lens choice shapes your image as much as light. A wide lens exaggerates space (and distorts faces up close); a longer lens compresses space and gives you that creamy, shallow-focus background that reads instantly as "cinematic." A few good prime lenses do more for your look than a camera upgrade — spend on glass before the body. And camera movement adds emotion only when it's motivated: a slow push-in intensifies a realization, handheld creates immediacy, a locked-off frame can feel tense or formal. If you can't say why the camera is moving, lock it down.</p>

  <div class="example">
    <div class="lbl">Make cheap look expensive</div>
    <p><strong>Control your light</strong> — one good source shaped well beats five used badly.</p>
    <p><strong>Shoot golden hour</strong> exteriors for free production value.</p>
    <p><strong>Use longer lenses</strong> and shallow depth of field to hide a thin background.</p>
    <p><strong>Add foreground</strong> elements for instant depth.</p>
    <p><strong>Keep the camera still</strong> unless movement serves the story — stable footage always reads as professional.</p>
  </div>

  <p class="pull">You're not buying a look with money. You're building it with light, lens, and frame — and those are mostly free.</p>

  <section class="action">
    <h2>Your move before Chapter 10</h2>
    <ul class="checklist">
      <li>Practice three-point lighting until you can shape a face on demand.</li>
      <li>Shoot a test scene at golden hour and study the production value the light alone gives you.</li>
      <li>Reframe one scene three ways and feel how composition changes its meaning.</li>
      <li>Assign a deliberate shot size and angle to every setup on your shot list.</li>
      <li>Justify every camera move — or lock the camera down.</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Storyboard Generator</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="https://filmmakergenius.com/storyboarding" target="_blank" class="tool-cta-btn">Open Storyboard Generator →</a>
  </div>
</div>`
  },
  ch10: {
    seoTitle: "Film Production: Running the Shoot, Set Protocol & Making Your Day | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/film-production-process",
    category: "Production",
    number: 10,
    title: "Production",
    intro: `This is the shoot — where months of planning collide with reality, the clock never stops, and the films that get finished are the ones run by people who stay calm and make their day.`,
    cta: {
      titleLead: "Run your shoot ",
      titleAccent: "like a pro.",
      text: "Filmmaker Genius keeps your schedule, call sheets, and production details in one place so every day runs on plan."
    },
    prev: { dir: "← Previous", label: "Chapter 9: Cinematography & Visual Language", to: "/academy/roberts-filmmaking/ch9" },
    next: { dir: "Next →", label: "Chapter 11: Post-Production", to: "/academy/roberts-filmmaking/ch11" },
    bodyHtml: `<p class="dropcap">Everything until now has been preparation for the days the camera actually rolls. Production is the most exciting, exhausting, and expensive phase — every hour costs real money, and there are a hundred ways for a day to go sideways. But here's the comforting truth: if you did your pre-production well, the shoot is mostly about execution and adaptation, not invention. You're not figuring out the movie anymore — you're capturing the one you already planned.</p>

  <h2>The rhythm of a shoot day</h2>
  <p>A film set has a rhythm. Crew arrives at call time and sets up — camera, lights, sound. Actors go through hair, makeup, and wardrobe. You and your DP block the first scene; the crew lights it while actors rehearse; you shoot from your planned angles to get coverage; when you've got it, you call "moving on" and the machine resets. Repeat all day. Knowing the basic on set terms and this flow lets you move through it efficiently. The enemy is always time — every new setup eats minutes that add up fast.</p>

  <h2>"Making your day"</h2>
  <p>The single most important goal in production is <strong>making your day</strong> — getting all the scenes you scheduled actually shot before you run out of time, daylight, or crew hours. Fall behind and the lost scenes pile onto tomorrow, which then can't be finished either, and the whole production collapses like dominoes. This means making decisions and moving on, knowing which shots are essential and which are nice-to-haves you can drop. A film of "good enough" shots that exist beats a film of perfect shots that were never completed.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Always know your must-haves versus nice-to-haves for every scene, before you shoot it. When you're behind — and you will be — you cut the nice-to-haves without agonizing, because you decided in advance. I've watched directors blow an afternoon on a fancy crane shot they loved and then have no time for the close-up that actually carried the scene. Get the shot the story needs first. Discipline on the day is what gets you to the finish line.</p></div>

  <h2>Problem-solving is the job</h2>
  <p>No shoot goes perfectly. The weather turns, a location falls through, gear breaks, an actor's late. The great filmmakers aren't the ones who avoid problems — they're the ones who solve them without panicking and without poisoning the set's morale. When something goes wrong, your crew watches <em>you</em>: stay calm, find the workaround, keep the energy up. Often the solution is creative — rain ruins your exterior, so the scene plays better inside by a rain-streaked window. Train yourself to ask "what can this become?" instead of "why is this happening to me?"</p>

  <h2>Sound and continuity: the silent film-killers</h2>
  <p>Two things consistently sink indie films, both invisible until too late. The first is <strong>sound</strong> — call for quiet, kill the buzzing fridge, get the boom in close, and record clean room tone at every location. Bad sound makes a film feel amateur faster than anything, and most of it can't be fixed later. The second is <strong>continuity</strong> — keeping props, wardrobe, hair, and action consistent shot to shot and day to day, since you're shooting out of order. The coffee cup full in the wide and empty in the close-up yanks the audience out of the story. Assign someone to watch for it and take reference photos.</p>

  <h2>Keep the set human</h2>
  <p>A set runs on its people, and people have limits. Feed your crew well and on time — hunger destroys morale and productivity. Build in breaks. Keep good film set etiquette: clear communication, respect up and down the call sheet, an even temper from the top. A set where people feel respected produces better work and solves problems faster than one running on fear and exhaustion.</p>

  <p class="pull">The shoot rewards the calm and the prepared. Make your day, protect your sound, keep your people human — and the movie gets made.</p>

  <section class="action">
    <h2>Your move before Chapter 11</h2>
    <ul class="checklist">
      <li>For each scene, define must-have shots versus nice-to-haves before the day begins.</li>
      <li>Empower your 1st AD to track the schedule and tell you the truth about time.</li>
      <li>Make protecting sound a set-wide priority — quiet, close boom, room tone every time.</li>
      <li>Assign continuity duty and take reference photos at every setup.</li>
      <li>Plan meals and breaks into the schedule — a fed, rested crew makes your day.</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Call Sheet Generator</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="https://filmmakergenius.com/call-sheet" target="_blank" class="tool-cta-btn">Open Call Sheet Generator →</a>
  </div>
</div>`
  },
  ch11: {
    seoTitle: "Film Post-Production: Editing, Color, Sound, Music & Delivery | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/film-post-production",
    category: "Post-Production",
    number: 11,
    title: "Post-Production",
    intro: `You don't have a film yet — you have footage. The edit, the sound, the color, and the music are where all that raw material finally becomes a movie.`,
    cta: {
      titleLead: "Finish strong. ",
      titleAccent: "Then get it seen.",
      text: "Filmmaker Genius helps you organize your post workflow and plan your release from one platform."
    },
    prev: { dir: "← Previous", label: "Chapter 10: Production", to: "/academy/roberts-filmmaking/ch10" },
    next: { dir: "Next →", label: "Chapter 12: Film Festivals", to: "/academy/roberts-filmmaking/ch12" },
    bodyHtml: `<p class="dropcap">There's a reason editors are sometimes called the final rewrite. You can shoot a mediocre script and save it in the edit, and you can shoot a brilliant one and ruin it in the edit. Post-production is the third and final time your film gets made, and for many movies it's the most decisive. The good news for indie filmmakers is that post is where you have the most control and the least time pressure — just you, the footage, and the patience to find the film hiding inside it.</p>

  <h2>Editing: finding the film in the footage</h2>
  <p>It all starts with the edit. Editing isn't just assembling shots in order — it's storytelling at its most surgical. The editor decides the pace, the rhythm, the emphasis, what we see and for how long, and crucially what we <em>don't</em> see. The workflow moves in stages: the <em>assembly</em> (all selected takes in order), the <em>rough cut</em> (a watchable version), rounds toward the <em>fine cut</em>, and finally <em>picture lock</em> — the point where no more picture edits are made, which unlocks the sound and color work that depends on it. Along the way you apply basic film editing techniques: cut on action so edits feel invisible, use reaction shots to build emotion, and trim relentlessly, because almost every first cut is too long.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Cut the scenes you love but don't need. It's the hardest thing in post and the most important. Every filmmaker shoots a beautiful moment that, in the finished film, slows everything down — and our instinct is to protect it because of what it cost to get. Kill it anyway. A tight ninety-minute film that never sags beats a flabby two-hour film with three gorgeous scenes the audience had to sit through boredom to reach. "Kill your darlings" exists because it's true.</p></div>

  <h2>Sound design and the mix</h2>
  <p>Here's the principle that shocks new filmmakers: sound is half your movie, maybe more. Audiences tolerate imperfect images far longer than bad audio. Once picture is locked, sound post begins: <em>dialogue editing</em> cleans up performances and replaces unusable lines (ADR), <em>sound design</em> builds the world with effects, and the <em>mix</em> balances dialogue, effects, and music into one cohesive soundtrack. Invest here — a professional sound mix is one of the highest-impact dollars in your entire post budget. Skimp and even beautiful images will feel cheap.</p>

  <h2>Color grading</h2>
  <p>Color grading is where your film gets its final visual polish and emotional tone, in two passes: <em>color correction</em> (making everything consistent so shots cut together seamlessly) and the <em>grade</em> (crafting a deliberate look — the cool steel of a thriller, the warm gold of a memory). Good color grading for an indie film unifies footage shot across many days and conditions into one consistent world, and tells the audience how to feel. It's remarkable how much more "expensive" a properly graded film looks.</p>

  <h2>Music, VFX, titles, and delivery</h2>
  <p>Music is one of your most powerful emotional tools — and one of your biggest legal traps. You can commission an original score (ideal — tailored and owned), or license tracks, but you cannot simply use a popular song you like; proper music licensing for films requires clearing rights, which for well-known songs is expensive. For most budgets, that means royalty-free or production-music libraries with clear licenses, or up-and-coming composers — and get every right in writing, because unlicensed music will get your film pulled and can sink a distribution deal. Most indie films also need a little invisible VFX (removing a modern sign, cleaning a stray boom), plus titles and credits done with care. Finally comes <em>delivery</em> — exporting a high-quality master, festival-spec files (DCP for many cinemas), and the files platforms require, with E&amp;O insurance and clean rights paperwork when a distributor needs them.</p>

  <div class="example">
    <div class="lbl">The post-production order of operations</div>
    <p><strong>1.</strong> Edit — assembly → rough cut → fine cut → picture lock.</p>
    <p><strong>2.</strong> Sound — dialogue edit, sound design, then the final mix.</p>
    <p><strong>3.</strong> Color — correction first, then the creative grade.</p>
    <p><strong>4.</strong> Music — score or licensed tracks, all rights in writing.</p>
    <p><strong>5.</strong> Finishing — VFX, titles, credits.</p>
    <p><strong>6.</strong> Delivery — masters, festival files, and clean paperwork.</p>
  </div>

  <p class="pull">Footage is potential. The edit, the mix, the grade, and the score are where potential becomes a film people will actually feel.</p>

  <section class="action">
    <h2>Your move before Chapter 12</h2>
    <ul class="checklist">
      <li>Edit in stages — assembly, rough, fine, lock — and resist polishing before the whole shape works.</li>
      <li>Be ruthless: cut every scene you love but don't need.</li>
      <li>Budget for a professional sound mix — it's the highest-impact dollar in post.</li>
      <li>Plan your music early and secure every license in writing before you lock it in.</li>
      <li>Organize your delivery elements and rights paperwork as you finish, not after.</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Recut</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="../FilmmakerGenius_Recut.html" class="tool-cta-btn">Open Recut →</a>
  </div>
</div>`
  },
  ch12: {
    seoTitle: "Film Festivals for Indie Filmmakers: Strategy, Tiers & Submissions | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/how-to-submit-to-film-festivals",
    category: "Distribution",
    number: 12,
    title: "Film Festivals",
    intro: `Festivals are where indie films find their first audiences, their press, their buyers, and sometimes their whole future. But the circuit eats money — so you go in with a strategy, not a credit card.`,
    cta: {
      titleLead: "Connect with festivals ",
      titleAccent: "directly.",
      text: "Filmmaker Genius connects you with trusted festivals and helps you build the press kit and strategy to get selected."
    },
    prev: { dir: "← Previous", label: "Chapter 11: Post-Production", to: "/academy/roberts-filmmaking/ch11" },
    next: { dir: "Next →", label: "Chapter 13: Aggregators & Distributors", to: "/academy/roberts-filmmaking/ch13" },
    bodyHtml: `<p class="dropcap">You've made a film. Now comes a question that surprises a lot of first-timers: how does anyone actually see it? For most indie films, the answer starts with the festival circuit — where your movie meets its first real audience, where programmers and distributors discover new work, and where careers genuinely get launched. But here's the trap I've watched sink filmmaker after filmmaker: festival submissions cost money, and without a strategy you can pour thousands of dollars into fees and have nothing to show for it.</p>

  <h2>What festivals actually do for you</h2>
  <p>A good festival run delivers an <em>audience</em> (real people watching on a big screen), <em>credibility</em> (official selections and award laurels that signal quality downstream), <em>industry access</em> (programmers, sales agents, and distributors who attend to find films like yours), and <em>press and connections</em> that follow you into your next project. For shorts especially, festivals are the primary way the film gets seen at all.</p>

  <h2>Know the tiers before you submit</h2>
  <h3>Top tier — the career-makers</h3>
  <p>The festivals that can change your life overnight: <strong>Sundance, Cannes, Venice, the Berlinale, Toronto (TIFF), SXSW, Telluride, and Tribeca.</strong> Insanely competitive — thousands of submissions for a handful of slots, and many favor films that haven't premiered elsewhere. Submit a genuinely strong film, but never build your whole plan around getting in.</p>
  <h3>Middle tier — respected and far more winnable</h3>
  <p>Where most indie films build a real run, and where you should aim most of your strategy. Think <strong>Slamdance, Fantastic Fest, AFI Fest, BFI London, Raindance, Austin Film Festival, Hot Docs</strong> (documentaries), and <strong>Outfest</strong> (LGBTQ+ work), plus strong regional festivals. Many are <em>Academy-qualifying</em> for shorts — a win can make your film Oscar-eligible.</p>
  <h3>Lower tier — local, niche, and emerging</h3>
  <p>Local, student, genre-niche, and online festivals where selection is easier and a first-timer can collect early laurels and build momentum. Don't dismiss it — a real audience is a real audience, and a couple of early wins give you the confidence to aim higher.</p>

  <h2>Build a smart submission strategy</h2>
  <p>Most filmmakers submit through <strong>FilmFreeway</strong>, which lets you reach thousands of festivals from one profile — a fantastic tool, and a fantastic way to spend your whole budget if you're not disciplined. <strong>Submit early:</strong> for a short, an early-bird fee often runs $25–$40 while the late deadline climbs to $60–$95 or more, so submitting early can dramatically cut costs. <strong>Be realistic:</strong> throw a couple of long shots at the top tier, but spend most of your budget in the middle and lower tiers where your film fits. <strong>Mind your premiere status:</strong> many big festivals require a premiere, so don't burn yours on a small festival if you're aiming for Sundance or Tribeca. <strong>Chase waivers</strong> on the platform, and <strong>read every festival's rules</strong> — submitting to one you're not eligible for is money set on fire.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Make a spreadsheet before you submit to a single festival — each one with its deadline, fee at each tier, premiere requirements, and an honest guess at your odds. Set a total budget, say $300–$500 for your first run, and submit only within it, prioritizing early deadlines and great fits. I've watched filmmakers spend a couple thousand dollars blasting every festival in sight and get into nothing, while a disciplined friend spent a fraction, targeted twenty smart fits, got into six, and won two. Strategy beats spray-and-pray every time.</p></div>

  <h2>Give your submission its best shot — and work the run</h2>
  <p>Submit the most polished version you can; a rough cut wastes your fee. Where allowed, include a strong cover letter and a professional film festival press kit (EPK): synopsis, key stills, poster, bio, and credits. If you get in, show up — festivals are as much about the hallways and parties as the screening. Promote your screening to fill the room, support other filmmakers, follow up with everyone you meet, and display your laurels proudly. A run worked well doesn't just get your film seen; it builds the relationships that fund and launch your next one.</p>

  <p class="pull">Don't submit everywhere. Submit smart — early, realistic, and where your film actually fits. The circuit rewards strategy, not spending.</p>

  <section class="action">
    <h2>Your move before Chapter 13</h2>
    <ul class="checklist">
      <li>Build a festival submission spreadsheet: deadlines, fees by tier, premiere rules, and honest odds.</li>
      <li>Set a total festival budget and commit to submitting only within it.</li>
      <li>Target mostly strong-fit middle- and lower-tier festivals; add only a couple of top-tier long shots.</li>
      <li>Submit at early-bird deadlines and hunt for FilmFreeway waivers and discounts.</li>
      <li>Build a professional press kit (EPK) with synopsis, stills, poster, bio, and credits.</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Distribution Readiness</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="https://filmmakergenius.com/distribution-readiness" target="_blank" class="tool-cta-btn">Open Distribution Readiness →</a>
  </div>
</div>`
  },
  ch13: {
    seoTitle: "Film Aggregators vs Distributors: How to Get Your Indie Film on Streaming | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/film-aggregators",
    category: "Distribution",
    number: 13,
    title: "Aggregators & Distributors",
    intro: `There are exactly two doors between your finished film and the platforms where audiences watch. Walk through the wrong one and you can lose control of your movie for fifteen years. Here's how to choose.`,
    cta: {
      titleLead: "Know your distribution path ",
      titleAccent: "before you finish.",
      text: "Filmmaker Genius analyzes your film and identifies which distribution pathways it qualifies for — then builds the strategy to pursue them."
    },
    prev: { dir: "← Previous", label: "Chapter 12: Film Festivals", to: "/academy/roberts-filmmaking/ch12" },
    next: { dir: "Next →", label: "Chapter 14: VOD & Streaming", to: "/academy/roberts-filmmaking/ch14" },
    bodyHtml: `<p class="dropcap">For every independent filmmaker the dream is the same: your film on the platforms where millions already watch — Amazon Prime, Apple TV, Tubi, The Roku Channel, and beyond. But the path is rarely clear, and that confusion is where filmmakers get hurt. Here's the most important thing to understand: you cannot, as an unknown filmmaker, simply upload your movie to Netflix or iTunes yourself. To get on those platforms you go through one of two kinds of partners — an aggregator or a distributor — and the difference is the difference between renting a service and handing over your keys.</p>

  <h2>The fundamental choice</h2>
  <p>An <strong>aggregator</strong> is a service provider — the technical middleman who gets your film onto storefronts like iTunes, Amazon, and Google TV, handling encoding, metadata, artwork, contracts, and delivery. Crucially, <strong>an aggregator does not take ownership or rights to your film.</strong> You keep full control and can usually end the relationship at will. A <strong>distributor</strong> is a rights-holder and sales agent: when they acquire your film, they control its commercial exploitation for a defined term and territory (say, North America for 7–15 years), do the selling and marketing, and pay you an agreed share. You give up control; you gain their power and relationships.</p>

  <table class="tbl"><thead><tr><th></th><th>Aggregator</th><th>Distributor</th></tr></thead><tbody>
    <tr><td>Owns rights?</td><td>No — you keep them</td><td>Yes — for the term</td></tr>
    <tr><td>Term</td><td>Usually cancel anytime</td><td>Often 7–15 years</td></tr>
    <tr><td>Marketing</td><td>Technical only</td><td>Real campaigns, buyer relationships</td></tr>
    <tr><td>Cost</td><td>Up-front fee or ~15–20% rev share</td><td>20–35%+ commission, after expenses</td></tr>
    <tr><td>Best for</td><td>Smaller indies, limited budget</td><td>Films with commercial potential</td></tr>
  </tbody></table>

  <h2>How aggregators charge</h2>
  <p>Two models. The <strong>up-front fee model</strong>: you pay per platform — commonly $1,000–$2,500 for the first placement — and keep 100% of revenue after the platform's cut (Bitmax, for example, runs about $2,198 for the first platform plus ~$200 per additional). The <strong>revenue-share model</strong>: no up-front cost, but the aggregator takes a percentage of gross — Filmhub, the best-known, takes 20% across 100+ outlets; others like Indie Rights, Giant Pictures, and Kinonation run roughly 20–30%. One honest caveat: aggregators are not marketers. Their job ends at clean delivery and metadata; building awareness and driving sales stays entirely with you. That's the trade-off for keeping control — you also keep the work.</p>

  <h2>How distributors get paid — and why recoupment matters</h2>
  <p>A distributor deal is a waterfall, and the order is everything. <strong>First, expenses:</strong> almost all distributors recoup their out-of-pocket costs (delivery, DCPs, QC, captions, key art, trailer, marketing) before paying you — these "recoupable expenses" vary widely. <strong>Second, the commission:</strong> commonly 20–35%, with some prestige distributors near 40%. <strong>Third, your share:</strong> what's left, usually paid quarterly or semi-annually. This is why the expense clauses matter as much as the headline percentage. Occasionally a distributor offers a <em>minimum guarantee</em> (MG) — an up-front advance against future earnings — but that's rare today unless your film has strong market signals (festival buzz, a recognizable cast, a hot niche).</p>

  <h2>Rights, territory, and term — read before you sign</h2>
  <p>Three clauses deserve your full attention. <strong>Rights:</strong> a distributor may want all rights (theatrical, VOD, TV, airlines, educational, DVD) or only some; savvy filmmakers carve out rights they can exploit themselves (like educational screenings). <strong>Territory:</strong> the world, or one region? You can sell different territories to different partners. <strong>Term:</strong> 7–15 years is a long time to lock your film into one company — the longer the term, the more certain you need to be they'll actively sell it the whole time, not just take it and forget it.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Never sign a distribution agreement without an entertainment lawyer who reads these for a living. The contract is written by their lawyers to protect them, and a single clause about recoupable expenses or "all media now known or hereafter devised, in perpetuity, throughout the universe" can cost you everything your film ever earns. A few hundred dollars on a lawyer up front is the cheapest insurance against signing away a movie that took years of your life. If a distributor pressures you to sign fast without legal review, that itself is your answer.</p></div>

  <h2>So which should you choose?</h2>
  <p>Match the partner to the film. Aggregators are especially valuable for smaller indie filmmakers with limited budgets, no major cast, and few connections. Distributors are highly selective but bring marketing muscle and direct buyer relationships you can't access alone. The honest reality for most unknown filmmakers: <strong>the aggregator route is the realistic path to TVOD platforms like iTunes and Amazon</strong>, while getting onto SVOD (Netflix, Hulu), AVOD (Tubi, Freevee), and FAST (Pluto, Samsung TV Plus) almost always requires a distributor, because those services prefer curated catalogs and bulk packages. There's no shame in either path — many smart filmmakers self-distribute via an aggregator while pitching distributors for the doors only a distributor can open.</p>

  <div class="example">
    <div class="lbl">Know the players</div>
    <p><strong>Aggregators:</strong> Filmhub, Bitmax, Quiver Digital, Indie Rights, Premiere Digital, Giant Pictures, Kinonation, Under the Milky Way.</p>
    <p><strong>Indie-friendly distributors:</strong> Gravitas Ventures, Cineverse, Vision Films, Freestyle Digital Media, Breaking Glass Pictures, Dark Star Pictures, Terror Films, FilmRise, Kino Lorber, Gunpowder &amp; Sky — many specialize by genre, so target the ones who release films like yours. Always research current terms and talk to filmmakers who've worked with them before signing.</p>
  </div>

  <p class="pull">An aggregator is a tool you hire. A distributor is a partner you marry for years. Choose with your eyes open — and never sign without a lawyer.</p>

  <section class="action">
    <h2>Your move before Chapter 14</h2>
    <ul class="checklist">
      <li>Decide honestly whether your film is an aggregator project or has distributor-level potential.</li>
      <li>If aggregating, compare an up-front-fee service against a revenue-share one for your situation.</li>
      <li>Make a target list of genre-appropriate distributors who release films like yours.</li>
      <li>Budget for an entertainment lawyer to review any distribution agreement before you sign.</li>
      <li>Decide which rights (educational, direct-to-fan, territory) you want to carve out and keep.</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Distribution Readiness</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="https://filmmakergenius.com/distribution-readiness" target="_blank" class="tool-cta-btn">Open Distribution Readiness →</a>
  </div>
</div>`
  },
  ch14: {
    seoTitle: "VOD & Streaming Explained: SVOD, TVOD, AVOD, FAST & DIY for Indie Films | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/vod-distribution",
    category: "Distribution",
    number: 14,
    title: "VOD & Streaming",
    intro: `Netflix, Tubi, Apple TV, Pluto, Amazon — they all sound like one thing, but they make money in completely different ways. Understanding the difference is how you decide where your film belongs and how it earns.`,
    cta: {
      titleLead: "Find the right platform ",
      titleAccent: "for your film.",
      text: "Filmmaker Genius identifies which distribution pathways your film qualifies for and builds the plan to reach the right audiences."
    },
    prev: { dir: "← Previous", label: "Chapter 13: Aggregators & Distributors", to: "/academy/roberts-filmmaking/ch13" },
    next: { dir: "Next →", label: "Chapter 15: Marketing Your Film", to: "/academy/roberts-filmmaking/ch15" },
    bodyHtml: `<p class="dropcap">In the last chapter you learned <em>how</em> your film reaches platforms — through an aggregator or a distributor. Now let's talk about the platforms themselves, because "getting on streaming" isn't one goal. The streaming world is a set of very different business models, and the right home for your film depends on what you want: money, reach, prestige, or all three in sequence. Smart VOD distribution for an indie film starts with knowing the alphabet.</p>

  <h2>What VOD actually is</h2>
  <p>VOD — Video on Demand — simply means viewers watch what they want, when they want. Everything else is about <em>how the platform makes money</em>, which breaks into five models: SVOD, TVOD, AVOD, FAST, and Hybrid.</p>
  <table class="tbl"><thead><tr><th>Model</th><th>How viewers pay</th><th>Examples</th></tr></thead><tbody>
    <tr><td>SVOD</td><td>Monthly subscription, all-you-can-watch</td><td>Netflix, Disney+, Max, Apple TV+, Hulu</td></tr>
    <tr><td>TVOD</td><td>Pay per title — rent or buy</td><td>Apple TV/iTunes, Amazon, Google TV, Vudu</td></tr>
    <tr><td>AVOD</td><td>Free, paid for by ads</td><td>YouTube, Tubi, Pluto TV, Roku Channel, Freevee</td></tr>
    <tr><td>FAST</td><td>Free ad-supported "live" channels</td><td>Pluto, Samsung TV Plus, Roku, Xumo, LG Channels</td></tr>
    <tr><td>Hybrid</td><td>A mix of the above</td><td>Amazon Prime Video, Hulu, Peacock, YouTube</td></tr>
  </tbody></table>

  <h2>The five models, and what each means for your film</h2>
  <p><strong>SVOD</strong> — the Netflix model. A placement usually means a license fee, but it's the hardest door: highly selective, almost never takes films directly from unknowns, and you need a distributor. Beyond the giants, don't overlook niche SVODs (Shudder for horror, Criterion Channel for arthouse). <strong>TVOD</strong> (rent or buy) is the most accessible door for indies, because aggregators can place you directly; you earn per transaction and keep more control. <strong>AVOD</strong> (free, ad-supported — Tubi, Pluto, Roku, Freevee) is about reach: massive audiences who'll never pay a subscription, usually accessed through a distributor. <strong>FAST</strong> (free linear channels) is almost exclusively a distributor's game, packaged in bulk. And <strong>Hybrid</strong> platforms blend models — Amazon Prime Video is SVOD + TVOD + AVOD at once.</p>

  <h2>The global platform landscape</h2>
  <p>Beyond the giants, there's a whole world of niche and international platforms — and the right small platform can out-perform a giant for the right film. There are arthouse hubs (MUBI, Criterion Channel), LGBTQ+ platforms (Revry, Dekkoo, OUTtv), Black cinema platforms (KweliTV, ALLBLK), documentary services (CuriosityStream, MagellanTV), horror and cult channels (Shudder, Screambox), short-film homes (Omeleto, Short of the Week), and international and regional platforms across Europe, Asia, and beyond. Matching your film to a community that already wants it is often worth more than chasing the biggest logo.</p>

  <h2>The release window: sequence is strategy</h2>
  <p>Here's a concept that separates a thoughtful release from a flat one: <strong>windowing</strong> — releasing across these models in a deliberate sequence. A common indie pattern moves from highest-value to widest-reach: festivals for prestige, then perhaps a limited or virtual-cinema window, then TVOD (rent/buy) to capture your most eager fans at a premium, then SVOD/AVOD for broad reach and the long tail. You don't have to do every window — but think about the <em>order</em>, because once your film is free on AVOD, very few people will pay to rent it.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Don't dump your film free on every platform the day it's done just because you're excited to be seen. I've watched filmmakers torch their entire earning potential in week one by going straight to AVOD. Give the people who love you most a chance to pay first — the rental, the purchase, the special screening — while the film is new and the buzz is hot. Then widen out to free reach later. Patience in the release is worth real money. Excitement is not a distribution strategy.</p></div>

  <h2>Don't forget the door you fully control: direct-to-fan</h2>
  <p>One category you control entirely is direct-to-fan. Platforms like Vimeo On Demand let you sell or rent straight to your audience, and a newer wave of creator-first platforms let independent filmmakers stream their work and earn directly from fans while keeping ownership. <strong>Hook Cinema (HookCinema.com)</strong> is one of these DIY options — a streaming platform built for independent film where filmmakers keep their rights, own their audience relationship instead of being buried by an algorithm, and can earn directly through a DIY monetization model. It's worth knowing as one of several direct-to-fan paths, alongside the major and niche platforms above. The audience you build yourself is the one no platform can take from you.</p>

  <p class="pull">"Getting on streaming" isn't one goal. It's five business models — and the smart filmmaker picks the windows, in the right order, that fit their film and their audience.</p>

  <section class="action">
    <h2>Your move before Chapter 15</h2>
    <ul class="checklist">
      <li>Identify which VOD models genuinely fit your film and audience — don't chase all five.</li>
      <li>Sketch a windowing plan: the order you'll release across TVOD, SVOD, and AVOD.</li>
      <li>Map your access route for each target platform — aggregator, distributor, or direct-to-fan.</li>
      <li>Set up at least one direct-to-fan option you fully control.</li>
      <li>Define what success means for your film in revenue and reach — not just "getting on Netflix."</li>
    </ul>
  </section>
<div class="tool-cta-card">
  <div class="tool-cta-box">
    <div class="tool-cta-info">
      <div class="tool-cta-label">Practice with this tool</div>
      <div class="tool-cta-name">Distribution Readiness</div>
      <div class="tool-cta-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.</div>
    </div>
    <a href="https://filmmakergenius.com/distribution-readiness" target="_blank" class="tool-cta-btn">Open Distribution Readiness →</a>
  </div>
</div>`
  },
  ch15: {
    seoTitle: "How to Market an Indie Film: Audience-Building, Posters, Trailers & a Marketing Plan | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/how-to-market-your-movie",
    category: "Marketing",
    number: 15,
    title: "Marketing Your Film",
    intro: `A film nobody knows about is a film nobody watches. The best movie in the world fails if it stays a secret — and on an indie film, making sure it doesn't is your job.`,
    cta: {
      titleLead: "Market your film ",
      titleAccent: "like a studio.",
      text: "Filmmaker Genius helps you build your key art, audience, and release plan — Hollywood-level tools at indie prices."
    },
    prev: { dir: "← Previous", label: "Chapter 14: VOD & Streaming", to: "/academy/roberts-filmmaking/ch14" },
    next: { dir: "Next →", label: "Chapter 16: Building a Career", to: "/academy/roberts-filmmaking/ch16" },
    bodyHtml: `<p class="dropcap">Here's the hard truth I wish someone had told me early: finishing your film is halftime, not the final whistle. More good independent films are made every year than anyone could ever watch, and the difference between the ones that find an audience and the ones that vanish is almost never quality. It's marketing. The filmmaker who understands how to market an indie film gives their work a fighting chance; the one who assumes "if it's good, they will come" watches years of work disappear.</p>

  <h2>Start before you finish</h2>
  <p>The biggest marketing mistake is starting too late. The filmmakers who succeed begin building an audience during production, sometimes during development — sharing behind-the-scenes content, documenting the journey, gathering a following that feels invested before the film exists. You are building two things at once: a film and an audience for it. Post from set. Share the struggles and the wins. An audience that followed your journey shows up on release day, tells their friends, and leaves the reviews that help strangers take a chance on you.</p>

  <h2>Build a real marketing plan</h2>
  <p>Treat your release like the campaign it is. A simple film marketing plan answers a few questions: who is your specific audience (not "everyone" — the actual people who want this exact film), where do they spend their attention, what's your core hook, what's your timeline, and what can you realistically spend in money and time. The most important shift is from broad to specific. Reaching ten thousand people who are exactly your audience beats reaching a million who'll never care. Niche isn't a limitation — it's your targeting system.</p>

  <h2>Your core marketing assets</h2>
  <h3>The poster (key art)</h3>
  <p>Often the first and only impression a scrolling viewer gets — it has to communicate genre, tone, and intrigue at a glance. Invest in good movie poster design; if you're producing print or platform art, use the standard one-sheet size (27" × 40") so your key art fits cinema and festival specs.</p>
  <h3>The trailer</h3>
  <p>Your most powerful marketing tool — a 60-to-120-second promise of the experience. Cut it to hook fast, establish tone, and leave them wanting more without giving away the ending. A great trailer travels on its own and sells your film to programmers, platforms, and audiences alike.</p>
  <h3>The press kit (EPK)</h3>
  <p>An electronic press kit — synopsis, key stills, poster, bios, credits, and contact — makes it effortless for press and platforms to feature you. Have it ready before you need it.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Your poster and your trailer are worth real money — spend on them even when you're broke everywhere else. I've seen filmmakers pour two years and their savings into a film and then slap together a poster in an afternoon and a trailer that gives away the whole plot. It's heartbreaking, because those two assets are what 95% of potential viewers will ever see of your movie. They <em>are</em> the movie, to a stranger scrolling past. Make them undeniable.</p></div>

  <h2>Press, social, grassroots — and don't stop at release</h2>
  <p>Build a simple social presence and post consistently — clips, stills, the story behind scenes, milestones. Pursue press: film blogs, podcasts, local media (your hometown angle is real news), and outlets that cover exactly your kind of film. Lean on your festival selections and reviews as social proof, and activate your community — cast, crew, and early fans all have networks, so give them easy things to share. And remember: releasing your film isn't the finish line of marketing — it's the start of the part that actually drives views. Keep promoting through your release windows, push people to where your film lives, and encourage ratings and reviews, which directly affect how platforms surface your film. A film with steady, ongoing promotion keeps finding new viewers for years; one whose marketing stopped on release day disappears within weeks.</p>

  <p class="pull">You're not just making a film. You're making sure it gets found. The best movie in the world means nothing if it stays a secret.</p>

  <section class="action">
    <h2>Your move before Chapter 16</h2>
    <ul class="checklist">
      <li>Start building your audience now — post from production and gather followers early.</li>
      <li>Write a one-page marketing plan: specific audience, channels, message, timeline, budget.</li>
      <li>Invest in professional key art at the standard one-sheet size and a tightly cut trailer.</li>
      <li>Assemble your EPK so press and platforms can feature you instantly.</li>
      <li>Line up press targets and give your cast, crew, and fans easy assets to share at launch.</li>
    </ul>
  </section>`
  },
  ch16: {
    seoTitle: "Building a Filmmaking Career: From One Film to a Body of Work | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/how-to-build-a-filmmaking-career",
    category: "The Business",
    number: 16,
    title: "Building a Career",
    intro: `One film makes you someone who made a film. A <em>career</em> is built on what you do next, who you build it with, and whether you have the staying power to keep going when most people quit.`,
    cta: {
      titleLead: "Build a career, ",
      titleAccent: "not just a film.",
      text: "Filmmaker Genius grows with you — from your first short to your next feature, with the tools and network to keep you working."
    },
    prev: { dir: "← Previous", label: "Chapter 15: Marketing Your Film", to: "/academy/roberts-filmmaking/ch15" },
    next: { dir: "Next →", label: "Chapter 17: The Long Game", to: "/academy/roberts-filmmaking/ch17" },
    bodyHtml: `<p class="dropcap">I've watched a lot of talented people make one good film and then disappear. And I've watched less obviously gifted people build long, working careers. The difference is rarely raw talent. It's that the career-builders understood something the one-and-done crowd didn't: a filmmaking career isn't a single lottery ticket, it's a body of work built one project, one relationship, and one reputation at a time.</p>

  <h2>Your first film is a calling card, not a destination</h2>
  <p>Whatever happens with your first film — festival glory or quiet release — its most valuable function is to prove you can do it. That credibility opens the next door: it helps you raise money, attract better collaborators, and be taken seriously. So finish it, release it, learn everything you can, and then immediately start thinking about the next one. The biggest momentum-killer in indie film is spending three years on one project and then nothing. Working filmmakers always have a next thing.</p>

  <h2>Relationships are the real career</h2>
  <p>Here's the secret nobody puts on a poster: <strong>this industry runs on relationships.</strong> The crew who made your first film, the actors who trusted you, the festival programmers you met, the other filmmakers in your community — these are the foundation of your entire career. The people one rung ahead of and behind you today are the people you'll be making films with in ten years. So invest in them genuinely: show up to other filmmakers' screenings, help without keeping score, be the collaborator people recommend. Your reputation travels faster than your films do, and it's the most valuable asset you'll ever build.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Be the person people want in the room. Talent gets you the first job; being reliable, kind, and easy to work with gets you the next twenty. I've hired people who were merely good over people who were brilliant, simply because the good ones were a pleasure and the brilliant ones were a nightmare. Over a career, that math compounds enormously. Your reputation is built in the small moments — how you treat a PA, whether you do what you said you'd do, how you behave when things go wrong. Guard it like it's everything, because it is.</p></div>

  <h2>Funding the next one</h2>
  <p>Each film should make the next one easier to fund. Now you have proof — a finished film, maybe festival selections, definitely experience — and investors take a second-time filmmaker far more seriously than a first-timer with only a dream. Beyond equity and crowdfunding, a track record unlocks grants: there's real money in grants for filmmakers from foundations, arts councils, and film offices, plus film grants specifically for shorts, documentaries, and underrepresented voices. They're competitive and take effort, but they're non-dilutive money that also adds prestige. Build a habit of tracking deadlines and applying consistently — over a career, grant money adds up.</p>

  <h2>Define your voice — and keep getting better</h2>
  <p>As you build a body of work, patterns emerge — the themes you return to, the tone you do better than anyone, the stories only you tell. That's your voice, and your brand. The filmmakers who break through are usually known <em>for something</em>. Lean into what excites you and what audiences respond to. And treat the whole thing as the long apprenticeship it is: every film teaches you things no book can, so keep studying films you admire, keep working with people better than you, and keep pushing into slightly harder challenges each time. A career is just a long string of films, each a little better than the last, made with people you trust more each time.</p>

  <p class="pull">Talent gets you the first job. Reliability, relationships, and relentlessness get you the career.</p>

  <section class="action">
    <h2>Your move before Chapter 17</h2>
    <ul class="checklist">
      <li>Before your current film is even released, start developing your next project.</li>
      <li>List the collaborators you want to keep — and actually stay in touch with them.</li>
      <li>Start a grants tracker and commit to applying for funding consistently, not once.</li>
      <li>Name the themes and tones that keep showing up in your work — that's your emerging voice.</li>
      <li>Protect your reputation in every small interaction; it's your most valuable career asset.</li>
    </ul>
  </section>`
  },
  ch17: {
    seoTitle: "The Long Game: Sustaining a Filmmaking Life Without Burning Out | Filmmaking by Will Roberts",
    canonical: "https://filmmakergenius.com/academy/how-to-make-a-movie/sustaining-a-filmmaking-career",
    category: "The Business",
    number: 17,
    title: "The Long Game",
    intro: `Most people who start don't last — not because they lacked talent, but because they ran out of money, momentum, or hope. Staying in the game for decades is its own skill, and it's the one this final chapter is about.`,
    cta: {
      titleLead: "You've got the map. ",
      titleAccent: "Now make the film.",
      text: "Filmmaker Genius takes you from script to screen — and stays with you for the long game, film after film."
    },
    prev: { dir: "← Previous", label: "Chapter 16: Building a Career", to: "/academy/roberts-filmmaking/ch16" },
    next: { dir: "Finish →", label: "Back to All Chapters", to: "/academy/roberts-filmmaking" },
    bodyHtml: `<p class="dropcap">I want to close this guide with the most important thing I know, because it's the thing that determines whether any of the rest matters: <strong>filmmaking is a marathon, not a sprint.</strong> The careers I admire weren't built on one explosive year. They were built on showing up, over and over, through good films and bad, for decades. The talent in this industry is everywhere. What's rare is the staying power.</p>

  <h2>Make peace with rejection</h2>
  <p>If you take one thing from this chapter, take this: in filmmaking, rejection isn't a sign you're failing — it's a sign you're working. Every filmmaker you admire has a mountain of festival rejections, passed-over scripts, and investors who said no. The difference between them and the people who quit isn't that they got rejected less; it's that they kept going anyway. Rejection is the tax you pay to stay in the game. Expect it, don't take it personally, learn what you can, and keep moving.</p>

  <div class="callout"><div class="lbl"><span class="dot"></span>Will's Take</div><p>Separate your worth from your work's reception. This is survival, not just mindset. Early on, every rejection felt like a verdict on me as a person, and it nearly broke me more than once. What saved my career was learning to treat a "no" as information, not judgment — a festival that wasn't the right fit, a film that didn't find its market, a script that needed another pass. The work isn't you. When you stop letting each rejection wound your identity, you free up the energy to just keep making things — and the person still making things in year twenty wins.</p></div>

  <h2>Protect your finances — and your sanity</h2>
  <p>Let's be practical, because broke and burned-out filmmakers don't make films. Most independent filmmakers, even good ones, don't earn a full living from their films for a long time — sometimes ever. There's no shame in this; it's the norm. The filmmakers who last build a sustainable life around the work: a day job or freelance income that pays the bills (editing, commercial work, teaching), low fixed expenses that don't require a hit to survive, and a clear-eyed relationship with money. Guard your wellbeing the same way — the hustle-till-you-collapse culture is a fast track to burnout, and a burned-out filmmaker makes nothing. Build rest into your life, and keep relationships and interests outside of film; they're the well your art draws from.</p>

  <h2>Keep the creative fire lit — and define success yourself</h2>
  <p>Over a long career the threat isn't only financial; it's creative exhaustion. Staying inspired is part of the job: keep watching films that move you, read, travel, pay attention to the world, take breaks between projects, and reconnect with <em>why</em> you started. And here's a freedom most filmmakers discover too late: you get to decide what success means for you. Measure yourself only against Oscars and box-office and you'll feel like a failure no matter what you accomplish. But if success means making films you're proud of, building a community you love, telling stories that reach the people they're meant for, and sustaining a creative life over decades — those are goals you can actually reach and keep reaching.</p>

  <p class="pull">The talent is everywhere. The staying power is rare. Be the filmmaker who's still making films when everyone else has quit.</p>

  <div class="closing">
    <h3>A final word</h3>
    <p>That's the whole journey — from a single idea worth your life to a finished film in front of the world, and a creative life built to last. You now hold the complete map: how to find the idea, develop it, produce it, budget it, crew it, prep it, direct it, shoot it, cut it, festival it, distribute it, stream it, market it, and sustain it. But a map is not a journey. Knowledge is only potential until you act on it. The filmmakers who matter aren't the ones who read the most — they're the ones who <em>made the thing</em>. So go make your film. The world doesn't need you to be perfect or fully funded or completely ready. It needs you to begin. There is nothing like the moment a film that lived only in your head finally lives on a screen in front of strangers who feel what you felt. Go earn that moment. You can do this. Now go. <em>— Will Roberts</em></p>
  </div>

  <section class="action">
    <h2>Your move now</h2>
    <ul class="checklist">
      <li>Reframe rejection as the cost of working, not a verdict on your worth — and keep submitting anyway.</li>
      <li>Build a sustainable financial base so no single film's outcome can end your career.</li>
      <li>Protect rest and a life outside film — they're the fuel, not the enemy, of your work.</li>
      <li>Schedule creative renewal and reconnect with why you started.</li>
      <li>Write down your own definition of success — then close the guide and start your film.</li>
    </ul>
  </section>`
  }
};
const RobertsChapter = () => {
  const { chapterId } = useParams();
  const location = useLocation();
  const canonical = `https://filmmakergenius.com${location.pathname.replace(/\/$/, "")}`;
  const chapter = chapterId ? robertsChapters[chapterId] : void 0;
  if (!chapter) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          background: "#0a0a12",
          color: "#fff",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          fontFamily: "'Inter Tight', sans-serif"
        },
        children: [
          /* @__PURE__ */ jsx("p", { style: { fontSize: 20, color: "rgba(255,255,255,0.7)", marginBottom: 20 }, children: "This chapter is coming soon." }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/academy/roberts-filmmaking",
              style: { color: "#00d4aa", textDecoration: "none", fontWeight: 700 },
              children: "← Back to all chapters"
            }
          )
        ]
      }
    );
  }
  const { seoTitle, category, number, title, intro, bodyHtml, cta, prev, next } = chapter;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        background: "#0a0a12",
        color: "#fff",
        fontFamily: "'Inter Tight', sans-serif"
      },
      children: [
        /* @__PURE__ */ jsx(
          Seo,
          {
            title: seoTitle,
            description: intro.replace(/<[^>]+>/g, "").slice(0, 160),
            canonical
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
        .rc-body p { font-size: 16.5px; color: rgba(255,255,255,0.78); margin-bottom: 20px; line-height: 1.85; }
        .rc-body h2 { font-family: 'Fraunces', serif; font-size: 26px; margin: 46px 0 14px; color: #fff; }
        .rc-body h3 { font-family: 'Inter Tight', sans-serif; font-size: 17px; font-weight: 700; margin: 28px 0 8px; color: #fff; }
        .rc-body strong { color: #fff; font-weight: 700; }
        .rc-body em { font-style: italic; }
        .rc-body p.dropcap::first-letter { font-family: 'Fraunces', serif; float: left; font-size: 62px; line-height: 0.8; font-weight: 600; color: #00d4aa; padding: 6px 10px 0 0; }
        .rc-body p.pull { border-left: 3px solid #00d4aa; padding: 8px 0 8px 24px; margin: 34px 0; font-family: 'Fraunces', serif; font-size: 21px; font-style: italic; color: rgba(255,255,255,0.85); line-height: 1.5; }
        .rc-body .callout { background: #12121f; border: 1px solid #1e1e35; border-radius: 12px; padding: 24px 26px; margin: 32px 0; }
        .rc-body .callout .lbl { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #00d4aa; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
        .rc-body .callout .lbl .dot { width: 7px; height: 7px; border-radius: 50%; background: #00d4aa; display: inline-block; }
        .rc-body .callout p { color: rgba(255,255,255,0.72); font-size: 16px; margin: 0; }
        .rc-body .example { background: #10101c; border: 1px solid #1e1e35; border-radius: 12px; padding: 20px 24px; margin: 30px 0; }
        .rc-body .example .lbl { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #0099ff; margin-bottom: 12px; }
        .rc-body .example p { font-size: 15.5px; color: rgba(255,255,255,0.72); margin-bottom: 10px; }
        .rc-body .example .film { font-family: 'Fraunces', serif; font-style: italic; color: #fff; }
        .rc-body .action { border-top: 2px solid #1e1e35; margin-top: 48px; padding-top: 24px; }
        .rc-body .action h2 { margin-top: 0; font-size: 22px; margin-bottom: 14px; }
        .rc-body ul.checklist { list-style: none; padding: 0; margin: 0; }
        .rc-body ul.checklist li { position: relative; padding: 11px 0 11px 34px; border-bottom: 1px solid #1e1e35; font-size: 15.5px; color: rgba(255,255,255,0.75); }
        .rc-body ul.checklist li::before { content: ''; position: absolute; left: 0; top: 14px; width: 18px; height: 18px; border: 2px solid #00d4aa; border-radius: 5px; }
        .rc-cta-btn-teal:hover { background: #00f0c0 !important; }
        .rc-cta-btn-outline:hover { background: rgba(255,255,255,0.08) !important; }

        /* Data tables */
        .rc-body table.tbl { width: 100%; border-collapse: collapse; margin: 26px 0; font-size: 14.5px; }
        .rc-body table.tbl th { text-align: left; background: #10101c; border-bottom: 2px solid #1e1e35; padding: 10px 12px; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .rc-body table.tbl td { padding: 11px 12px; border-bottom: 1px solid #1e1e35; vertical-align: top; color: rgba(255,255,255,0.75); }
        .rc-body table.tbl td:first-child { font-weight: 700; color: #fff; }

        /* "Practice with this tool" card (appended inside the body) */
        .rc-body .tool-cta-card { margin: 40px 0 8px; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .rc-body .tool-cta-box { background: linear-gradient(135deg,#071820 0%,#0a2a30 100%); border: 1px solid rgba(0,212,170,0.25); border-radius: 14px; padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .rc-body .tool-cta-info { display: flex; flex-direction: column; gap: 4px; }
        .rc-body .tool-cta-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(0,212,170,0.65); }
        .rc-body .tool-cta-name { font-family: 'Fraunces', serif; font-size: 22px; color: #fff; }
        .rc-body .tool-cta-desc { font-size: 13px; color: rgba(255,255,255,0.5); max-width: 420px; margin: 0; }
        .rc-body a.tool-cta-btn { display: inline-flex; align-items: center; gap: 8px; background: #00d4aa; color: #000; font-size: 13px; font-weight: 700; padding: 12px 22px; border-radius: 9999px; text-decoration: none; white-space: nowrap; transition: background 0.2s, transform 0.1s; }
        .rc-body a.tool-cta-btn:hover { background: #00f0c0; transform: translateY(-1px); }

        /* Closing box (final chapter) */
        .rc-body .closing { margin-top: 40px; padding: 28px; border: 1px solid #1e1e35; border-radius: 14px; background: #12121f; }
        .rc-body .closing h3 { margin-top: 0; color: #00d4aa; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Inter Tight', sans-serif; font-weight: 700; margin-bottom: 12px; }
        .rc-body .closing p { color: rgba(255,255,255,0.78); font-size: 16.5px; line-height: 1.85; }
      ` }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: 1120,
              margin: "0 auto",
              padding: "20px 24px 0",
              fontSize: 13,
              color: "rgba(255,255,255,0.3)"
            },
            children: [
              /* @__PURE__ */ jsx(Link, { to: "/academy", style: { color: "rgba(255,255,255,0.3)", textDecoration: "none" }, children: "Academy" }),
              " › ",
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: "/academy/roberts-filmmaking",
                  style: { color: "rgba(255,255,255,0.3)", textDecoration: "none" },
                  children: "Filmmaking by Will Roberts"
                }
              ),
              " › ",
              /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.55)" }, children: title })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("header", { style: { maxWidth: 760, margin: "0 auto", padding: "48px 24px 36px" }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                display: "inline-flex",
                background: "rgba(0,212,170,0.1)",
                border: "1px solid rgba(0,212,170,0.25)",
                color: "#00d4aa",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: 9999,
                marginBottom: 18
              },
              children: category
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 12
              },
              children: [
                "Chapter ",
                number
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "h1",
            {
              style: {
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(36px, 6vw, 52px)",
                lineHeight: 1.06,
                marginBottom: 18,
                color: "#fff"
              },
              children: title
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              style: {
                fontSize: 18,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.65,
                borderTop: "1px solid #1e1e35",
                paddingTop: 20,
                margin: 0
              },
              dangerouslySetInnerHTML: { __html: intro }
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: { maxWidth: 760, margin: "0 auto", padding: "0 24px 40px" }, children: /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              aspectRatio: "16 / 9",
              background: "linear-gradient(135deg,#071820,#0a2a30)",
              border: "1px solid rgba(0,212,170,0.2)",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(0,212,170,0.12)",
                    border: "1px solid rgba(0,212,170,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#00d4aa",
                    fontSize: 22,
                    paddingLeft: 5
                  },
                  children: "▶"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    background: "rgba(0,212,170,0.1)",
                    border: "1px solid rgba(0,212,170,0.3)",
                    color: "#00d4aa",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "5px 14px",
                    borderRadius: 9999
                  },
                  children: "Video Lesson — Coming Soon"
                }
              ),
              /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.4)" }, children: "Taught by Will Roberts · Watch this space" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(
          "article",
          {
            className: "rc-body",
            style: { maxWidth: 760, margin: "0 auto", padding: "0 24px 56px" },
            dangerouslySetInnerHTML: { __html: bodyHtml }
          }
        ),
        /* @__PURE__ */ jsxs(
          "nav",
          {
            style: {
              maxWidth: 760,
              margin: "0 auto",
              borderTop: "1px solid #1e1e35",
              borderBottom: "1px solid #1e1e35",
              padding: 24,
              display: "flex",
              justifyContent: "space-between",
              gap: 16
            },
            children: [
              /* @__PURE__ */ jsxs(Link, { to: prev.to, style: { textDecoration: "none", textAlign: "left" }, children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      marginBottom: 4
                    },
                    children: prev.dir
                  }
                ),
                /* @__PURE__ */ jsx("div", { style: { fontSize: 14, color: "rgba(255,255,255,0.55)" }, children: prev.label })
              ] }),
              /* @__PURE__ */ jsxs(Link, { to: next.to, style: { textDecoration: "none", textAlign: "right" }, children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      marginBottom: 4
                    },
                    children: next.dir
                  }
                ),
                /* @__PURE__ */ jsx("div", { style: { fontSize: 14, color: "rgba(255,255,255,0.55)" }, children: next.label })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "section",
          {
            style: {
              background: "#12121f",
              borderTop: "1px solid #1e1e35",
              padding: "56px 24px",
              textAlign: "center"
            },
            children: [
              /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "'Fraunces', serif", fontSize: 28, margin: 0, color: "#fff" }, children: [
                cta.titleLead,
                /* @__PURE__ */ jsx("span", { style: { color: "#00d4aa" }, children: cta.titleAccent })
              ] }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  style: {
                    marginTop: 12,
                    fontSize: 15,
                    color: "rgba(255,255,255,0.5)",
                    maxWidth: 500,
                    marginLeft: "auto",
                    marginRight: "auto"
                  },
                  children: cta.text
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    marginTop: 24,
                    flexWrap: "wrap"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        to: "/pricing",
                        className: "rc-cta-btn-teal",
                        style: {
                          height: 48,
                          padding: "0 26px",
                          borderRadius: 9999,
                          fontWeight: 700,
                          background: "#00d4aa",
                          color: "#000",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          transition: "background 0.15s"
                        },
                        children: "Start Free"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        to: "/academy/roberts-filmmaking",
                        className: "rc-cta-btn-outline",
                        style: {
                          height: 48,
                          padding: "0 26px",
                          borderRadius: 9999,
                          fontWeight: 700,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#fff",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          transition: "background 0.15s"
                        },
                        children: "Browse All Chapters"
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
const monetizationHubs = {
  aggregators: {
    accent: "#34d399",
    accentRgb: "52,211,153",
    keyBg: "#071a10",
    keyBg2: "#0a2d1a",
    canonical: "https://filmmakergenius.com/academy/film-aggregator-list",
    title: "Aggregators",
    sub: "Technical delivery partners who place your film on major VOD platforms — without acquiring your rights or locking you into long-term contracts.",
    stats: [
      { hi: "10", text: "companies" },
      { hi: "3", text: "categories" },
      { text: "You retain full rights" },
      { text: "No acquisition required" }
    ],
    whatIsHeading: "What is an Aggregator?",
    whatIsBody: "An aggregator is a company that handles the technical and administrative work of getting your film onto major VOD platforms — encoding, metadata, contracts, and delivery. Unlike distributors, they don't acquire rights or ownership of your film. You stay in control and can usually end the relationship at will. The trade-off: marketing and audience-building remain entirely on you.",
    keyFactsHeading: "Key Facts",
    keyFacts: [
      "No rights acquisition — you own your film",
      "Fee-based ($1,000–$2,500) or revenue share (15–20%)",
      "Access to iTunes, Amazon, Google TV, Tubi & more",
      "No marketing support — promotion is your responsibility",
      "Best for indie filmmakers with limited budgets & no industry connections"
    ],
    sectionLabel: "Browse by model",
    tiles: [
      {
        num: "01",
        cat: "Business Model",
        title: "Fee-Based",
        desc: "Pay a flat upfront fee per platform and keep 100% of your revenue after the platform's cut. Higher risk up front — but no ongoing revenue split. Best for filmmakers with a marketing plan in place.",
        count: "4 companies",
        tags: ["Bitmax", "Quiver Digital", "Premiere Digital", "Under the Milky Way"],
        to: "/academy/aggregators/fee-based"
      },
      {
        num: "02",
        cat: "Business Model",
        title: "Revenue Share",
        desc: "No upfront cost to get on platforms. The aggregator takes 15–20% of your film's earnings instead. Lower barrier to entry — ideal for filmmakers without a large initial budget.",
        count: "3 companies",
        tags: ["Filmhub", "Kinonation", "Altavod"],
        to: "/academy/aggregators/revenue-share"
      },
      {
        num: "03",
        cat: "Business Model",
        title: "Hybrid Model",
        desc: "Companies that function as both aggregators and distributors depending on the deal. They may act as a simple delivery partner for some windows and take rights for others. Understand the deal before you sign.",
        count: "3 companies",
        tags: ["Indie Rights", "Giant Pictures", "Echelon Studios"],
        to: "/academy/aggregators/hybrid"
      }
    ]
  },
  distributors: {
    accent: "#60a5fa",
    accentRgb: "96,165,250",
    keyBg: "#060f1a",
    keyBg2: "#0a1a2d",
    canonical: "https://filmmakergenius.com/academy/film-distributor-list",
    title: "Distributors",
    sub: "Rights-acquiring partners who license and place your film across platforms, taking a commission in exchange for marketing support, platform relationships, and broader reach.",
    stats: [
      { hi: "26+", text: "companies" },
      { hi: "6", text: "categories" },
      { text: "20–40% commission" },
      { text: "7–15 year terms typical" }
    ],
    whatIsHeading: "What is a Distributor?",
    whatIsBody: "Distributors acquire rights to your film for a defined term and territory, then commercially exploit it across platforms, broadcasters, international markets, airlines, and physical media. Unlike aggregators, they control how and where your film is sold. In return, they bring real marketing power — press, platform relationships, and strategic release timing. Most distributors recoup their expenses first, then take 20–40% before paying you.",
    keyFactsHeading: "Key Facts",
    keyFacts: [
      "They acquire rights — you give up some control",
      "Commission: 20–40% after recouping expenses",
      "Terms: typically 7–15 years per territory",
      "Can access Netflix, Hulu, AVOD & FAST — aggregators cannot",
      "Minimum guarantees (MGs) rare but possible for strong films"
    ],
    sectionLabel: "Browse by specialty",
    tiles: [
      {
        num: "01",
        cat: "Specialty",
        title: "Full-Service & Wide Release",
        desc: "High-volume distributors with wide platform reach, strong digital and broadcast relationships, and experience moving commercial indie films across all major VOD windows.",
        count: "5 companies",
        tags: ["Gravitas Ventures", "Cineverse", "FilmRise", "Level 33", "TriCoast"],
        to: "/academy/distributors/full-service"
      },
      {
        num: "02",
        cat: "Specialty",
        title: "Arthouse & Prestige",
        desc: "Curated distributors focused on festival-caliber, critically driven, and internationally recognized cinema. Offer awards positioning, theatrical campaigns, and academic/institutional markets.",
        count: "7 companies",
        tags: ["Kino Lorber", "Cinema Guild", "Cohen Media", "First Run Features", "Blue Fox", "Canyon Cinema", "GoDigital / Amplify"],
        to: "/academy/distributors/arthouse"
      },
      {
        num: "03",
        cat: "Specialty",
        title: "Genre Specialists",
        desc: "Distributors with deep roots in horror, cult, sci-fi, and genre-driven films. Bring pre-built fan communities, genre-specific PR, and placement on niche AVOD/SVOD channels.",
        count: "5 companies",
        tags: ["Shout! / Scream Factory", "Terror Films", "Gunpowder & Sky", "Dark Star Pictures", "Passion River"],
        to: "/academy/distributors/genre"
      },
      {
        num: "04",
        cat: "Specialty",
        title: "Documentary",
        desc: "Distributors specializing in nonfiction storytelling, with broadcaster relationships (BBC, PBS, Al Jazeera), festival pipelines, and educational/institutional licensing channels.",
        count: "4 companies",
        tags: ["Journeyman Pictures", "IndiePix", "Watermelon Pictures", "Freestyle Digital"],
        to: "/academy/distributors/documentary"
      },
      {
        num: "05",
        cat: "Specialty",
        title: "International & Sales Agent",
        desc: "Distributors and sales agents who specialize in cross-border licensing, international TV deals, and market representation at Cannes, AFM, and Berlin.",
        count: "4 companies",
        tags: ["House of Film", "Mongrel Media", "TriCoast Worldwide", "Vision Films"],
        to: "/academy/distributors/international"
      },
      {
        num: "06",
        cat: "Specialty",
        title: "Digital-First",
        desc: "Revenue-share distributors focused primarily on VOD — minimal theatrical or physical media. Wide digital footprint with lower barriers to entry for emerging indie filmmakers.",
        count: "5 companies",
        tags: ["BayView Entertainment", "Breaking Glass", "Echelon Studios", "New Video / Cinedigm", "Freestyle Digital"],
        to: "/academy/distributors/digital-first"
      }
    ]
  },
  vod: {
    accent: "#a855f7",
    accentRgb: "168,85,247",
    keyBg: "#0f0a1a",
    keyBg2: "#1a0f2d",
    canonical: "https://filmmakergenius.com/academy/vod-platforms",
    title: "VOD Platforms",
    sub: "The consumer-facing streaming services where audiences find and watch your film. Most require an aggregator or distributor to access — but some accept indie submissions directly.",
    stats: [
      { hi: "80+", text: "platforms" },
      { hi: "8", text: "categories" },
      { text: "SVOD · TVOD · AVOD · FAST" },
      { text: "Global reach" }
    ],
    whatIsHeading: "How VOD Platforms Work",
    whatIsBody: "VOD (Video on Demand) platforms are where audiences actually watch your film. There are four main models: SVOD (subscription), TVOD (pay-per-title), AVOD (free with ads), and FAST (free scheduled channels). Most major platforms — Netflix, Hulu, Tubi — won't accept films directly from unknown indie filmmakers. You access them through aggregators (technical delivery) or distributors (rights-based deals). Some niche platforms do accept direct submissions.",
    keyFactsHeading: "VOD Models at a Glance",
    keyFacts: [
      "<strong>SVOD</strong> — Monthly subscription (Netflix, Hulu, Shudder)",
      "<strong>TVOD</strong> — Pay per rental or purchase (iTunes, Google TV)",
      "<strong>AVOD</strong> — Free with ads (Tubi, Pluto TV, Roku)",
      "<strong>FAST</strong> — Free scheduled channels (Samsung TV+, LG Channels)",
      "<strong>Hybrid</strong> — Multiple models on one platform (Amazon Prime, YouTube)"
    ],
    sectionLabel: "Browse by category",
    tiles: [
      {
        num: "01",
        cat: "Category",
        title: "Major Platforms",
        desc: "The mainstream high-volume streamers where the largest audiences live. Most require aggregators or distributors to access.",
        count: "22 platforms",
        tags: ["Netflix", "Amazon Prime", "Hulu", "Tubi", "Roku", "Pluto TV"],
        to: "/academy/vod/major-platforms"
      },
      {
        num: "02",
        cat: "Category",
        title: "Arthouse & Prestige",
        desc: "Curated platforms for festival-caliber and critically recognized cinema. Highly selective — distributor relationships are usually required.",
        count: "15 platforms",
        tags: ["Criterion Channel", "MUBI", "BFI Player", "Sundance Now", "Fandor"],
        to: "/academy/vod/arthouse"
      },
      {
        num: "03",
        cat: "Category",
        title: "Genre",
        desc: "Horror, cult, sci-fi, martial arts, and genre-defining platforms with dedicated fan communities and niche programming teams.",
        count: "8 platforms",
        tags: ["Shudder", "Screambox", "Arrow Player", "Full Moon", "Hi-YAH!"],
        to: "/academy/vod/genre"
      },
      {
        num: "04",
        cat: "Category",
        title: "Documentary",
        desc: "Platforms dedicated to nonfiction storytelling — from global SVOD services to niche doc hubs with festival-grade curation standards.",
        count: "9 platforms",
        tags: ["CuriosityStream", "MagellanTV", "Docurama", "GuideDoc", "Tënk"],
        to: "/academy/vod/documentary"
      },
      {
        num: "05",
        cat: "Category",
        title: "LGBTQ+",
        desc: "Streaming platforms dedicated to queer stories — from global FAST networks to niche SVODs focused on gay, lesbian, bisexual, trans, and nonbinary narratives.",
        count: "11 platforms",
        tags: ["Revry", "OUTtv", "Dekkoo", "GagaOOLala", "TelloFilms"],
        to: "/academy/vod/lgbtq"
      },
      {
        num: "06",
        cat: "Category",
        title: "Black Cinema",
        desc: "Platforms spotlighting Black indie films, African diaspora stories, and Black-owned cultural content — from grassroots SVOD to premium AMC Networks programming.",
        count: "6 platforms",
        tags: ["KweliTV", "ALLBLK", "Maverick Black Cinema", "AfroLandTV"],
        to: "/academy/vod/black-cinema"
      },
      {
        num: "07",
        cat: "Category",
        title: "International",
        desc: "Region-specific and diaspora platforms serving global audiences — from Ukrainian cinema to Cambodian OTT, Bengali SVOD, and Southeast Asian streaming.",
        count: "10 platforms",
        tags: ["FilmDoo", "AsianCrush", "Hoichoi", "Klassiki", "Takflix"],
        to: "/academy/vod/international"
      },
      {
        num: "08",
        cat: "Category",
        title: "Shorts",
        desc: "Platforms dedicated to short films — from global YouTube channels with millions of subscribers to curated indie hubs that connect shorts to festivals, distributors, and industry scouts.",
        count: "8 platforms",
        tags: ["Short of the Week", "Omeleto", "ShortVerse", "Nowness", "Film Shortage"],
        to: "/academy/vod/shorts"
      }
    ]
  }
};
function MonetizationHub({ hubKey }) {
  const hub = monetizationHubs[hubKey];
  const location = useLocation();
  const canonical = `https://filmmakergenius.com${location.pathname.replace(/\/$/, "")}`;
  if (!hub) return null;
  const { accent, accentRgb, keyBg, keyBg2, title, sub, stats, whatIsHeading, whatIsBody, keyFactsHeading, keyFacts, sectionLabel, tiles: tiles2 } = hub;
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${title} — Filmmaker Genius Academy`,
        description: sub,
        canonical
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .mh-crumb-link:hover { color: ${accent} !important; }
        .mh-tile { transition: border-color .18s ease, transform .18s ease; }
        .mh-tile:hover { border-color: rgba(${accentRgb},0.5) !important; transform: translateY(-3px); }
        .mh-tile:hover .mh-arrow { opacity: 1 !important; }
        @media (max-width: 860px) {
          .mh-intro-grid { grid-template-columns: 1fr !important; }
          .mh-sub-grid { grid-template-columns: 1fr !important; }
          .mh-h1 { font-size: 40px !important; }
        }
      ` }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "20px 20px 0", fontSize: 13, color: "rgba(255,255,255,0.3)" }, children: [
      /* @__PURE__ */ jsx(Link, { to: "/academy", className: "mh-crumb-link", style: { color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color .15s" }, children: "Academy" }),
      /* @__PURE__ */ jsx("span", { children: " › " }),
      /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.55)" }, children: title })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { maxWidth: 1120, margin: "0 auto", padding: "48px 20px", borderBottom: "1px solid #1e1e35", marginBottom: 48 }, children: [
      /* @__PURE__ */ jsx("div", { style: { display: "inline-flex", background: `rgba(${accentRgb},0.1)`, border: `1px solid rgba(${accentRgb},0.25)`, color: accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999, marginBottom: 20 }, children: "Monetization" }),
      /* @__PURE__ */ jsx("h1", { className: "mh-h1", style: { fontFamily: "'Fraunces', serif", fontSize: 56, lineHeight: 1.02, marginBottom: 16, color: "#fff" }, children: title }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 680, marginBottom: 28 }, children: sub }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }, children: stats.map((s, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.4)" }, children: [
          s.hi && /* @__PURE__ */ jsxs("span", { style: { color: accent, fontWeight: 600 }, children: [
            s.hi,
            " "
          ] }),
          s.text
        ] }),
        i < stats.length - 1 && /* @__PURE__ */ jsx("span", { style: { width: 3, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.2)" } })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 20px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "mh-intro-grid", style: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, marginBottom: 48 }, children: [
        /* @__PURE__ */ jsxs("div", { style: { background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 16, padding: 32 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }, children: whatIsHeading }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }, children: whatIsBody })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { background: `linear-gradient(135deg, ${keyBg} 0%, ${keyBg2} 100%)`, border: `1px solid rgba(${accentRgb},0.2)`, borderRadius: 16, padding: 28 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }, children: keyFactsHeading }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: keyFacts.map((f, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 10 }, children: [
            /* @__PURE__ */ jsx("span", { style: { width: 5, height: 5, borderRadius: 999, background: accent, marginTop: 7, flexShrink: 0 } }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }, dangerouslySetInnerHTML: { __html: f } })
          ] }, i)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: 20 }, children: sectionLabel }),
      /* @__PURE__ */ jsx("div", { className: "mh-sub-grid", style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 96 }, children: tiles2.map((t, i) => /* @__PURE__ */ jsxs(Link, { to: t.to, className: "mh-tile", style: { display: "flex", flexDirection: "column", background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28, minHeight: 280, position: "relative", overflow: "hidden", textDecoration: "none", color: "#fff" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontFamily: "'Fraunces', serif", fontSize: 52, fontWeight: 700, color: `rgba(${accentRgb},0.12)`, lineHeight: 1, marginBottom: 16 }, children: t.num }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: `rgba(${accentRgb},0.5)`, marginBottom: 8 }, children: t.cat }),
        /* @__PURE__ */ jsx("div", { style: { fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 12 }, children: t.title }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, flex: 1, marginBottom: 20 }, children: t.desc }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: `rgba(${accentRgb},0.5)`, marginBottom: 10 }, children: t.count }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: t.tags.map((tag, j) => /* @__PURE__ */ jsx("span", { style: { fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: 999 }, children: tag }, j)) }),
        /* @__PURE__ */ jsx("span", { className: "mh-arrow", style: { position: "absolute", bottom: 22, right: 24, fontSize: 18, color: accent, opacity: 0, transition: "opacity .18s ease" }, children: "→" })
      ] }, i)) })
    ] })
  ] });
}
const AGG = { accent: "#34d399", accentRgb: "52,211,153" };
const DIST = { accent: "#60a5fa", accentRgb: "96,165,250" };
const VOD = { accent: "#a855f7", accentRgb: "168,85,247" };
const monetizationSub = {
  "aggregators/fee-based": {
    ...AGG,
    canonical: "https://filmmakergenius.com/academy/fee-based-film-aggregators",
    groupTitle: "Aggregators",
    groupPath: "/academy/aggregators",
    catPill: "Aggregators · Fee-Based",
    breadcrumbLabel: "Fee-Based",
    title: "Fee-Based Aggregators",
    intro: "Pay a flat fee per platform — and keep 100% of your revenue after the store's cut. No ongoing percentage taken from your earnings. Best for filmmakers who have a marketing plan and are confident in their film's commercial potential.",
    stats: [
      { hi: "4", text: "companies" },
      { text: "$1,500 – $2,500 per platform" },
      { text: "You keep 100% of revenue" },
      { text: "No rights acquired" }
    ],
    variant: "company",
    gridCols: 2,
    statLayout: "grid",
    itemsLabel: "Companies in this category",
    cards: [
      {
        name: "Bitmax",
        type: "Fee-Based Aggregator",
        stats: [
          { label: "Upfront Fee", value: "~$2,198 first platform" },
          { label: "Revenue Split", value: "0% — you keep all" }
        ],
        bestFor: "Best for: Filmmakers with a marketing budget",
        desc: "Bitmax works on a fee-for-service model. You pay roughly $2,198 for the first platform plus ~$200 for each additional platform. Once your film is live, you keep 100% of the revenue after the platform's cut. You pay upfront whether or not your film earns back the investment — so this model rewards filmmakers who can drive their own audience.",
        tagsLabel: "Platforms served",
        tags: ["iTunes / Apple TV", "Amazon", "Google TV", "Vudu", "Tubi", "Pluto TV", "Crackle", "YouTube Movies"],
        cta: "Learn More →"
      },
      {
        name: "Quiver Digital",
        type: "Fee-Based Aggregator",
        stats: [
          { label: "Upfront Fee", value: "~$1,500–$2,000" },
          { label: "Revenue Split", value: "0% — you keep all" }
        ],
        bestFor: "Best for: Filmmakers with platform delivery experience",
        desc: "Quiver charges a flat fee per platform delivery — no revenue splits. You keep 100% of what you earn after the store's cut. Their support is limited to packaging and clean metadata delivery; no PR or marketing is included. Best suited for filmmakers who already have a promotional strategy and just need professional-grade access to premium stores.",
        tagsLabel: "Platforms served",
        tags: ["Apple TV / iTunes", "Amazon Prime", "Google TV", "Vudu", "YouTube Movies", "Cable VOD"],
        cta: "Learn More →"
      },
      {
        name: "Premiere Digital",
        type: "Fee-Based Aggregator · Studio-Grade",
        stats: [
          { label: "Model", value: "Fee-for-service" },
          { label: "Revenue Split", value: "0% — you keep all" }
        ],
        bestFor: "Best for: Films coming through distributors or larger rights holders",
        desc: "Premiere Digital is a major media services company that handles technical delivery at studio grade — QC, encoding, subtitling, metadata, and delivery. They don't acquire rights or take revenue shares. They're rarely a direct option for indie filmmakers, but if a distributor is using them, your film gets professional pipeline delivery to virtually every major platform worldwide.",
        tagsLabel: "Platforms served",
        tags: ["Apple TV", "Amazon", "Google TV", "Hulu", "Vudu", "Peacock", "Netflix", "Tubi", "Roku", "Pluto TV", "Crackle"],
        cta: "Learn More →"
      },
      {
        name: "Under the Milky Way",
        type: "Fee + Revenue Share Aggregator",
        stats: [
          { label: "Model", value: "Fee + rev share" },
          { label: "Focus", value: "Apple TV preferred partner" }
        ],
        bestFor: "Best for: Indie films & docs targeting Apple TV and international markets",
        desc: "Under the Milky Way is a global film aggregator with offices across the U.S. and Europe, founded in 2010. They combine a fee-for-service model (encoding, QC, placement) with a revenue share on sales. Their strongest asset is a preferred partner status with Apple TV/iTunes. They also cover Amazon, Google TV, and regional/global VOD platforms with localized versions for international markets.",
        tagsLabel: "Platforms served",
        tags: ["Apple TV / iTunes", "Amazon", "Google TV", "Regional VOD (global)"],
        cta: "Learn More →"
      }
    ]
  },
  "aggregators/revenue-share": {
    ...AGG,
    canonical: "https://filmmakergenius.com/academy/revenue-share-film-aggregators",
    groupTitle: "Aggregators",
    groupPath: "/academy/aggregators",
    catPill: "Aggregators · Revenue Share",
    breadcrumbLabel: "Revenue Share",
    title: "Revenue Share Aggregators",
    intro: "No upfront cost to get on platforms. The aggregator takes 15–20% of your earnings instead. Lowest barrier to entry — ideal for filmmakers without a large initial budget who want wide platform access without writing a check first.",
    stats: [
      { hi: "3", text: "companies" },
      { text: "$0 upfront" },
      { text: "15–20% commission on earnings" },
      { text: "You retain all rights" }
    ],
    variant: "company",
    gridCols: 3,
    statLayout: "column",
    itemsLabel: "Companies in this category",
    cards: [
      {
        name: "Filmhub",
        type: "Revenue Share Aggregator",
        stats: [
          { label: "Upfront Fee", value: "$0" },
          { label: "Commission", value: "20% of gross revenue" }
        ],
        bestFor: "Best for: Filmmakers with no upfront budget",
        desc: "Filmhub's pure revenue-share model means zero upfront fees. They take 20% of all revenues your film generates — you keep 80%. They pitch films to 100+ partner platforms worldwide including Amazon Prime, Tubi, Plex, Apple TV, and many niche/global streamers. Success relies heavily on the filmmaker's own marketing — Filmhub provides access, not audience demand.",
        tagsLabel: "Platforms served (100+)",
        tags: ["Amazon Prime", "Tubi", "Plex", "Apple TV", "Fawesome", "DistroTV", "Xumo", "Samsung TV+", "LG Channels", "Vizio WatchFree+", "Local Now", "Roku"],
        cta: "Learn More →"
      },
      {
        name: "Kinonation",
        type: "Revenue Share Aggregator",
        stats: [
          { label: "Upfront Fee", value: "$0" },
          { label: "Commission", value: "~20% of gross revenue" }
        ],
        bestFor: "Best for: Set-it-and-forget-it wide distribution",
        desc: "Los Angeles–based aggregator with a simple, low-barrier approach to global VOD. No upfront fees — they handle encoding, QC, metadata, and delivery, taking ~20% of gross revenue. They don't acquire rights or market films. They pitch to Amazon, Apple TV, Google TV, Vudu, Tubi, Hulu, and international outlets including Netflix. Success depends entirely on the filmmaker's marketing.",
        tagsLabel: "Platforms served",
        tags: ["Amazon Prime", "Apple TV", "Google TV", "Vudu", "Tubi", "Hulu", "Pluto TV", "Roku"],
        cta: "Learn More →"
      },
      {
        name: "Altavod",
        type: "Revenue Share Aggregator",
        stats: [
          { label: "Upfront Fee", value: "$0" },
          { label: "Commission", value: "Varies by deal" }
        ],
        bestFor: "Best for: Filmmakers seeking flexible aggregator terms",
        desc: "Altavod operates as a VOD aggregator and distribution services company, providing access to major TVOD and AVOD platforms with flexible deal structures. They handle encoding, metadata, and delivery without upfront fees, taking a percentage of earnings instead. Their platform access includes major TVOD storefronts and select AVOD outlets. Marketing remains the filmmaker's responsibility.",
        tagsLabel: "Platforms served",
        tags: ["Apple TV / iTunes", "Amazon", "Google TV", "Tubi", "Vudu"],
        cta: "Learn More →"
      }
    ]
  },
  "aggregators/hybrid": {
    ...AGG,
    canonical: "https://filmmakergenius.com/academy/hybrid-film-aggregators",
    groupTitle: "Aggregators",
    groupPath: "/academy/aggregators",
    catPill: "Aggregators · Hybrid Model",
    breadcrumbLabel: "Hybrid Model",
    title: "Hybrid Model",
    intro: "Companies that function as both aggregators and distributors depending on the deal. They may act as a simple technical delivery partner for some windows — and take rights for others. Read every contract carefully.",
    stats: [
      { hi: "3", text: "companies" },
      { text: "Revenue share: 20–30%" },
      { text: "Deal structure varies" },
      { text: "Rights may be involved" }
    ],
    warning: "<strong>Important:</strong> Hybrid companies can offer aggregator-style delivery (no rights) or distributor-style deals (with rights acquisition) depending on your agreement. Always clarify which model applies to your deal before signing. The terms can vary significantly from one filmmaker to the next.",
    variant: "company",
    gridCols: 3,
    statLayout: "column",
    itemsLabel: "Companies in this category",
    cards: [
      {
        name: "Indie Rights",
        type: "Digital Distributor & Aggregator Hybrid",
        badge: "Hybrid",
        stats: [
          { label: "Revenue Share", value: "20–30% of gross" },
          { label: "Upfront Fee", value: "None standard" }
        ],
        bestFor: "Best for: Filmmakers wanting broad reach without upfront costs",
        desc: "Indie Rights is explicitly described as a digital distributor and aggregator hybrid. They work on revenue share (20–30%) instead of upfront fees, placing films on Amazon, Apple TV, Google TV, Tubi, and international streamers. They provide limited promotional support including a 200k+ subscriber YouTube channel and attendance at AFM and Cannes. Filmmakers remain primarily responsible for marketing.",
        tagsLabel: "Platforms served",
        tags: ["Amazon Prime", "Apple TV", "Google TV", "YouTube Movies", "Tubi", "Plex", "Roku"],
        cta: "Learn More →"
      },
      {
        name: "Giant Pictures",
        type: "Digital Distributor / Aggregator Hybrid",
        badge: "Hybrid",
        stats: [
          { label: "Revenue Share", value: "~30% of gross" },
          { label: "Upfront Fee", value: "None" }
        ],
        bestFor: "Best for: Indie features, docs, and films targeting Kanopy/academic markets",
        desc: "Giant Pictures is a New York–based digital distributor known for transparency and filmmaker-friendly terms. No upfront fees — they cover encoding, delivery, and placement, taking ~30% of gross revenues. They provide partial marketing help, clear reporting, and unique access to Kanopy's library and academic market. They bridge the aggregator/distributor line, providing more service than a pure aggregator without full rights acquisition in all cases.",
        tagsLabel: "Platforms served",
        tags: ["Apple TV", "Amazon Prime", "Google TV", "Vudu", "Tubi", "Peacock", "Roku", "Kanopy", "International VOD"],
        cta: "Learn More →"
      },
      {
        name: "Echelon Studios",
        type: "Distributor / Aggregator Hybrid",
        badge: "Hybrid",
        stats: [
          { label: "Revenue Split", value: "70/30 or 60/40 to filmmaker" },
          { label: "Rights", value: "Global or regional" }
        ],
        bestFor: "Best for: Emerging and microbudget filmmakers seeking wide availability",
        desc: "Echelon Studios is an independent distributor/aggregator with a large catalog. They handle global or regional rights across digital, TV, DVD, and airline markets with a favorable revenue split (70/30 or 60/40 to filmmakers after fees). With a very large catalog, films receive minimal individualized marketing — filmmakers must drive their own promotion and audience-building. A wide-reach option without prestige barriers.",
        tagsLabel: "Platforms served",
        tags: ["Amazon", "Apple TV", "Google Play", "Vudu", "Tubi", "Cable VOD", "International TV", "Airlines"],
        cta: "Learn More →"
      }
    ]
  },
  "distributors/full-service": {
    ...DIST,
    canonical: "https://filmmakergenius.com/academy/full-service-film-distributors",
    groupTitle: "Distributors",
    groupPath: "/academy/distributors",
    catPill: "Distributors · Full-Service",
    breadcrumbLabel: "Full-Service & Wide Release",
    title: "Full-Service & Wide Release",
    intro: "High-volume distributors with wide platform footprints, strong VOD and broadcaster relationships, and experience moving commercial indie films across all major windows including SVOD, TVOD, AVOD, and FAST.",
    stats: [
      { hi: "5", text: "companies" },
      { text: "20–35% commission" },
      { text: "Rights acquisition typical" },
      { text: "Widest platform access" }
    ],
    variant: "company",
    gridCols: 3,
    statLayout: "column",
    itemsLabel: "Companies in this category",
    cards: [
      {
        name: "Gravitas Ventures",
        type: "Full-Service Digital Distributor",
        stats: [
          { label: "Commission", value: "~25–30%" },
          { label: "Platform reach", value: "150+ platforms" }
        ],
        bestFor: "Best for: Commercial indie features ready for wide digital release",
        desc: "One of the most prominent indie digital distributors in the U.S. Gravitas handles encoding, QC, metadata, and delivery to 150+ platforms including Netflix, Hulu, Amazon, Tubi, iTunes, and cable VOD. They accept dramatic films, documentaries, and genre content. Filmmakers give up North American digital rights for the term; limited marketing provided — filmmakers drive the audience push.",
        tagsLabel: "Key platforms",
        tags: ["Netflix", "Hulu", "Amazon", "iTunes", "Tubi", "Peacock", "Pluto TV", "Cable VOD"]
      },
      {
        name: "Cineverse",
        type: "Full-Service Distributor & FAST Network Operator",
        stats: [
          { label: "Commission", value: "Varies by deal" },
          { label: "Specialty", value: "FAST + AVOD + genre channels" }
        ],
        bestFor: "Best for: Genre films with built-in fan communities",
        desc: "Formerly Cinedigm, Cineverse is both a digital distributor and a FAST channel operator — they operate their own genre channels including Screambox, CONtv, and Dove Channel. This gives them unusual leverage: they can place your film on major platforms and on their own owned-and-operated FAST channels. Strong in horror, faith, anime, and family content.",
        tagsLabel: "Key platforms",
        tags: ["Amazon", "Tubi", "Roku", "Screambox (own)", "Peacock", "Pluto TV", "Samsung TV+"]
      },
      {
        name: "FilmRise",
        type: "Full-Service Digital Distributor & AVOD Network",
        stats: [
          { label: "Revenue Model", value: "Revenue share on ad earnings" },
          { label: "Note", value: "Does not work with aggregators" }
        ],
        bestFor: "Best for: Content-rich libraries and catalog films",
        desc: "FilmRise is a distributor that operates as its own AVOD network, distributing content primarily through ad-supported streaming. They acquire non-exclusive digital rights, focusing on catalog depth. Unlike most major SVOD and AVOD platforms, FilmRise does NOT work with aggregators — films come through direct acquisition deals only. Strong Tubi and free streaming partner.",
        tagsLabel: "Key platforms",
        tags: ["FilmRise (own)", "Tubi", "Amazon Prime", "YouTube", "Pluto TV", "Peacock"]
      },
      {
        name: "Level 33 Entertainment",
        type: "Full-Service Distributor",
        stats: [
          { label: "Commission", value: "~20–25%" },
          { label: "Focus", value: "Drama, thriller, action, docs" }
        ],
        bestFor: "Best for: Films with professional production quality and a defined niche",
        desc: "Level 33 is a boutique full-service distributor handling digital and limited theatrical releases. They focus on dramas, thrillers, action, and documentary content, with solid relationships across major VOD platforms. They offer more hands-on support than a pure aggregator, with some marketing assistance and more personalized attention than the high-volume distributors.",
        tagsLabel: "Key platforms",
        tags: ["iTunes", "Amazon", "Google TV", "Vudu", "Hulu", "Tubi", "Peacock"]
      },
      {
        name: "TriCoast Entertainment",
        type: "Full-Service Distributor & International Sales",
        stats: [
          { label: "Commission", value: "Varies by deal" },
          { label: "Specialty", value: "Global reach + international" }
        ],
        bestFor: "Best for: Films targeting international markets alongside domestic VOD",
        desc: "TriCoast offers both domestic digital distribution and international sales representation. They can handle U.S. VOD, international rights, TV licensing, and airline distribution under one roof — useful for filmmakers who want a single company managing multiple windows. Accepts drama, documentary, action, thriller, horror, and faith-based content.",
        tagsLabel: "Key markets",
        tags: ["Amazon", "iTunes", "Google TV", "Cable VOD", "International TV", "Airlines"]
      }
    ]
  },
  "distributors/arthouse": {
    ...DIST,
    canonical: "https://filmmakergenius.com/academy/arthouse-film-distributors",
    groupTitle: "Distributors",
    groupPath: "/academy/distributors",
    catPill: "Distributors · Arthouse & Prestige",
    breadcrumbLabel: "Arthouse & Prestige",
    title: "Arthouse & Prestige",
    intro: "Curated distributors focused on festival-caliber, critically driven, and internationally recognized cinema. Offer awards positioning, limited theatrical campaigns, and access to academic and institutional markets that commercial distributors don't serve.",
    stats: [
      { hi: "7", text: "companies" },
      { text: "Highly selective — strong film required" },
      { text: "Theatrical + VOD + educational" }
    ],
    variant: "company",
    gridCols: 3,
    statLayout: "column",
    itemsLabel: "Companies in this category",
    cards: [
      {
        name: "Kino Lorber",
        type: "Arthouse Theatrical & Home Video Distributor",
        stats: [
          { label: "Specialty", value: "Arthouse, foreign, documentary" },
          { label: "Known for", value: "Physical media + Criterion-grade care" }
        ],
        bestFor: "Best for: Acclaimed films with festival pedigree",
        desc: "One of the most respected arthouse distributors in the U.S. Kino Lorber handles theatrical releases, home video, digital, and educational distribution. Highly selective — they focus on films with critical credibility and festival recognition. Their back catalog includes major international and art cinema titles. Filmmakers working with Kino get access to their educational arm and long-tail library placement.",
        tagsLabel: "Channels",
        tags: ["Theatrical (U.S.)", "MUBI", "Criterion Channel", "Fandor", "Educational/Library", "Physical media"]
      },
      {
        name: "Cinema Guild",
        type: "Arthouse & Foreign Film Distributor",
        stats: [
          { label: "Specialty", value: "World cinema & arthouse" },
          { label: "Founded", value: "1968 — deep track record" }
        ],
        bestFor: "Best for: Foreign language films and acclaimed U.S. independents",
        desc: "Cinema Guild has over 50 years of experience in arthouse and world cinema distribution. They handle theatrical releases, home video (Blu-ray/DVD), and digital rights. Their catalog is critically acclaimed — they work with filmmakers whose work aligns with the Criterion Collection aesthetic. Limited theatrical campaigns with genuine press attention and awards positioning.",
        tagsLabel: "Channels",
        tags: ["Theatrical", "MUBI", "Fandor", "Criterion Channel", "Physical media"]
      },
      {
        name: "Cohen Media Group",
        type: "Prestige Theatrical & Digital Distributor",
        stats: [
          { label: "Specialty", value: "Prestige foreign & restored classics" },
          { label: "Known for", value: "French cinema & classic restorations" }
        ],
        bestFor: "Best for: French cinema, world classics, prestige foreign acquisitions",
        desc: "Cohen Media Group focuses on prestige foreign films and classic restorations. They have a particularly strong relationship with French cinema, managing French rights for a substantial number of key titles. Theatrical, digital, home video, and streaming rights are all handled under their umbrella. A boutique operation known for quality over volume.",
        tagsLabel: "Channels",
        tags: ["Theatrical", "Cohen Media Channel", "MUBI", "Criterion Channel", "Physical media"]
      },
      {
        name: "First Run Features",
        type: "Arthouse & Documentary Distributor",
        stats: [
          { label: "Specialty", value: "Arthouse, docs, LGBTQ+, indie" },
          { label: "Note", value: "One of oldest U.S. indie distributors" }
        ],
        bestFor: "Best for: Documentaries, arthouse narratives, LGBTQ+ content",
        desc: "Founded in 1979, First Run Features is one of the longest-standing independent distributors in the U.S. They handle theatrical, home video, and digital distribution with a focus on documentaries, arthouse narratives, and LGBTQ+ content. Personalized service, honest reporting, and a filmmaker-friendly reputation. Their catalog spans decades of important independent cinema.",
        tagsLabel: "Channels",
        tags: ["Theatrical", "Kanopy", "Educational", "Amazon", "iTunes", "Physical media"]
      },
      {
        name: "Blue Fox Entertainment",
        type: "Prestige Indie Distributor & International Sales",
        stats: [
          { label: "Specialty", value: "Prestige indie & international sales" },
          { label: "Model", value: "Domestic + international rights" }
        ],
        bestFor: "Best for: Award-driven films seeking international co-representation",
        desc: "Blue Fox Entertainment handles both U.S. theatrical/digital distribution and international sales for quality independent films. A boutique operation that takes on projects with strong critical positioning, festival performance, or notable cast. They coordinate domestic and international strategy, making them valuable for films targeting both U.S. and global markets with prestige positioning.",
        tagsLabel: "Channels",
        tags: ["Theatrical", "iTunes", "Amazon", "International markets"]
      },
      {
        name: "GoDigital / Amplify",
        type: "Digital Distributor & Arthouse VOD Specialist",
        stats: [
          { label: "Specialty", value: "Festival & arthouse digital release" },
          { label: "Reach", value: "100+ digital platforms" }
        ],
        bestFor: "Best for: Festival-proven films making the digital-first transition",
        desc: "GoDigital (working under the Amplify brand) specializes in bringing festival and critically driven films to digital platforms with a focused, data-driven release strategy. They pitch to premium arthouse VOD outlets alongside major digital storefronts. More digital-focused than theatrical, but with credibility in the arthouse/prestige space. Useful for films that need wide VOD reach without traditional theatrical overhead.",
        tagsLabel: "Channels",
        tags: ["MUBI", "Fandor", "iTunes", "Amazon", "Google TV", "Sundance Now"]
      },
      {
        name: "Canyon Cinema",
        type: "Experimental & Avant-Garde Film Cooperative",
        stats: [
          { label: "Specialty", value: "Experimental, short, avant-garde" },
          { label: "Model", value: "Cooperative / filmmaker-owned" }
        ],
        bestFor: "Best for: Experimental films, short works, media art, and film studies audiences",
        desc: "Canyon Cinema is a San Francisco–based filmmaker cooperative and the premier distributor of experimental, avant-garde, and artist-made films in the U.S. They maintain a rental and educational catalog, place films with universities and museums, and serve the film studies and media art communities. Not a commercial distributor — but essential for filmmakers working in expanded cinema, essay film, or structural filmmaking.",
        tagsLabel: "Channels",
        tags: ["University rental", "Museum screenings", "Educational licensing", "Film studies programs"]
      }
    ]
  },
  "distributors/genre": {
    ...DIST,
    canonical: "https://filmmakergenius.com/academy/genre-film-distributors",
    groupTitle: "Distributors",
    groupPath: "/academy/distributors",
    catPill: "Distributors · Genre",
    breadcrumbLabel: "Genre Specialists",
    title: "Genre Specialists",
    intro: "Distributors with deep roots in horror, cult, sci-fi, and genre-driven films. Bring pre-built fan communities, genre-specific PR, and placement on niche AVOD and SVOD channels with dedicated genre audiences.",
    stats: [
      { hi: "5", text: "companies" },
      { text: "Horror · Cult · Sci-Fi · Action · Thriller" },
      { text: "Pre-existing genre audiences" }
    ],
    variant: "company",
    gridCols: 3,
    statLayout: "column",
    itemsLabel: "Companies in this category",
    cards: [
      {
        name: "Shout! Factory / Scream Factory",
        type: "Genre Distributor · Home Video & Digital",
        stats: [
          { label: "Specialty", value: "Horror, cult, sci-fi, classic TV" },
          { label: "Known for", value: "Premium physical media + Scream Factory label" }
        ],
        bestFor: "Best for: Horror and cult films with collector audience potential",
        desc: "Shout! Factory and its Scream Factory imprint are among the most respected genre distributors in the U.S. Known for premium Blu-ray/4K releases with special features, they also handle digital distribution. Their fan base actively seeks out their releases. Best for filmmakers whose work has cult or collector potential — the genre fandom they serve is passionate and willing to spend on quality releases.",
        tagsLabel: "Channels",
        tags: ["Shudder", "Screambox", "Amazon", "iTunes", "Physical media (4K/Blu-ray)"]
      },
      {
        name: "Terror Films",
        type: "Horror-Only Digital Distributor",
        stats: [
          { label: "Focus", value: "Horror only" },
          { label: "Model", value: "Revenue share, non-exclusive" }
        ],
        bestFor: "Best for: Horror films of any budget level seeking wide digital reach",
        desc: "Terror Films is one of the most approachable digital distributors for horror filmmakers. They specialize exclusively in horror content and have relationships with horror-specific AVOD and SVOD platforms. Their revenue-share model (non-exclusive) is lower risk for filmmakers. They're known for being accessible to micro-budget horror — quality bar is lower than Shout! but reach is substantial in the genre space.",
        tagsLabel: "Channels",
        tags: ["Shudder", "Tubi", "Amazon Prime", "Screambox", "Plex", "Night Flight+"]
      },
      {
        name: "Gunpowder & Sky",
        type: "Genre Content Studio & Distributor",
        stats: [
          { label: "Specialty", value: "Sci-fi, horror, action, thriller" },
          { label: "Known for", value: "ALTER (horror) & sci-fi short content" }
        ],
        bestFor: "Best for: Genre shorts and features with digital-first potential",
        desc: "Gunpowder & Sky is a studio, digital network, and distributor focused on genre content. They operate ALTER (one of the largest horror YouTube channels) and other genre digital networks, giving them unique ability to promote distributed films to genre audiences directly. They acquire and distribute shorts, features, and series, with particular strength in horror and sci-fi.",
        tagsLabel: "Channels",
        tags: ["ALTER (own channel)", "YouTube genre channels", "Amazon", "Tubi", "Shudder"]
      },
      {
        name: "Dark Star Pictures",
        type: "Boutique Genre Distributor",
        stats: [
          { label: "Focus", value: "Horror, thriller, crime, sci-fi" },
          { label: "Model", value: "Boutique — selective acquisitions" }
        ],
        bestFor: "Best for: Quality genre films seeking thoughtful boutique representation",
        desc: "Dark Star Pictures is a boutique genre distributor with a reputation for selective, filmmaker-friendly deals. They don't chase volume — they look for quality genre films they can champion. Distribution covers theatrical (limited), VOD, and home video. If you're making genre films that stand out, Dark Star offers more personal attention and marketing support than the larger genre distributors.",
        tagsLabel: "Channels",
        tags: ["Theatrical (limited)", "Amazon", "iTunes", "Shudder", "Tubi"]
      },
      {
        name: "Passion River",
        type: "Genre & Niche Documentary Distributor",
        stats: [
          { label: "Specialty", value: "Genre, docs, international, educational" },
          { label: "Model", value: "Revenue share + educational licensing" }
        ],
        bestFor: "Best for: Films that straddle genre and documentary with educational potential",
        desc: "Passion River distributes across genre, documentary, international, and educational markets. They have strong relationships with educational/institutional licensing channels (Kanopy, university libraries) alongside standard digital VOD platforms. A good option for films that have dual commercial and educational appeal, or for documentaries with genre-adjacent subject matter.",
        tagsLabel: "Channels",
        tags: ["Amazon", "iTunes", "Kanopy", "Google TV", "Educational licensing"]
      }
    ]
  },
  "distributors/documentary": {
    ...DIST,
    canonical: "https://filmmakergenius.com/academy/documentary-film-distributors",
    groupTitle: "Distributors",
    groupPath: "/academy/distributors",
    catPill: "Distributors · Documentary",
    breadcrumbLabel: "Documentary",
    title: "Documentary",
    intro: "Distributors specializing in nonfiction storytelling — with broadcaster relationships at BBC, PBS, Al Jazeera, and NHK, plus festival pipelines, educational licensing, and nonfiction SVOD/AVOD placement.",
    stats: [
      { hi: "4", text: "companies" },
      { text: "TV broadcast + digital + educational" },
      { text: "Nonfiction specialists" }
    ],
    variant: "company",
    gridCols: 2,
    statLayout: "grid",
    itemsLabel: "Companies in this category",
    cards: [
      {
        name: "Journeyman Pictures",
        type: "International Documentary Distributor",
        stats: [
          { label: "Specialty", value: "International TV & digital docs" },
          { label: "Reach", value: "150+ countries" }
        ],
        bestFor: "Best for: Docs with international relevance and journalism-driven stories",
        desc: "Journeyman Pictures is a UK-based international documentary distributor and broadcaster. They license documentary content to broadcasters in 150+ countries and run a substantial YouTube channel with 700k+ subscribers that streams their catalog. Great for current affairs, social issue, and journalism-driven docs that have international story relevance. Filmmaker-friendly, with transparent reporting and global broadcaster access including BBC, NHK, and Al Jazeera.",
        tagsLabel: "Channels",
        tags: ["YouTube (700k+)", "BBC", "NHK", "Al Jazeera", "150+ international broadcasters", "Journeyman.tv"]
      },
      {
        name: "IndiePix Films",
        type: "Independent Documentary & World Cinema Distributor",
        stats: [
          { label: "Focus", value: "Docs, world cinema, social issue" },
          { label: "Model", value: "Revenue share + educational" }
        ],
        bestFor: "Best for: Social issue docs and world cinema seeking U.S. digital reach",
        desc: "IndiePix distributes independent documentaries and world cinema to U.S. digital audiences. They work primarily on a revenue-share model and maintain an educational licensing arm with relationships to university and public library networks. Their catalog is accessible through their own platform (IndiePix Unlimited) and through major VOD storefronts. Known for being approachable and filmmaker-friendly.",
        tagsLabel: "Channels",
        tags: ["IndiePix Unlimited (own)", "Amazon", "iTunes", "Google TV", "Kanopy", "Educational"]
      },
      {
        name: "Watermelon Pictures",
        type: "Documentary Digital Distributor",
        stats: [
          { label: "Focus", value: "Documentaries & indie content" },
          { label: "Model", value: "Revenue share" }
        ],
        bestFor: "Best for: Docs and socially engaged films looking for wide VOD reach",
        desc: "Watermelon Pictures is a documentary and independent film digital distributor with relationships across major VOD platforms. Their revenue-share model and approachable intake process make them accessible to filmmakers without traditional industry connections. Particularly active in the documentary and socially engaged storytelling space, with a good track record of placing films on CuriosityStream and major AVOD platforms.",
        tagsLabel: "Channels",
        tags: ["CuriosityStream", "Amazon", "Tubi", "Plex", "Google TV", "iTunes"]
      },
      {
        name: "Freestyle Digital Media",
        type: "Digital-First Documentary & Indie Distributor",
        stats: [
          { label: "Focus", value: "Docs, drama, thriller, indie" },
          { label: "Model", value: "Revenue share" }
        ],
        bestFor: "Best for: Docs and genre films seeking fast, broad digital release",
        desc: "Freestyle Digital Media is a VOD-first distributor handling both documentaries and narrative features. They focus on speed and breadth — quick digital releases across all major platforms without the overhead of theatrical campaigns. Known for transparency, filmmaker-friendly terms, and solid U.S. digital reach. Useful when a film needs to be available quickly and widely rather than building slow prestige momentum.",
        tagsLabel: "Channels",
        tags: ["Amazon", "iTunes", "Google TV", "Vudu", "Tubi", "Roku", "Hulu"]
      }
    ]
  },
  "distributors/international": {
    ...DIST,
    canonical: "https://filmmakergenius.com/academy/international-film-distributors",
    groupTitle: "Distributors",
    groupPath: "/academy/distributors",
    catPill: "Distributors · International",
    breadcrumbLabel: "International & Sales Agents",
    title: "International & Sales Agents",
    intro: "Specialists in cross-border licensing and international market representation. They sell your film to broadcasters, distributors, and platforms in foreign territories — at Cannes, AFM, Berlin, and beyond.",
    stats: [
      { hi: "4", text: "companies" },
      { text: "Territory-by-territory licensing" },
      { text: "Cannes · AFM · Berlin representation" }
    ],
    variant: "company",
    gridCols: 2,
    statLayout: "grid",
    itemsLabel: "Companies in this category",
    cards: [
      {
        name: "House of Film",
        type: "International Sales Agent",
        stats: [
          { label: "Specialty", value: "International sales & co-production" },
          { label: "Attends", value: "Cannes, AFM, Berlin, EFM" }
        ],
        bestFor: "Best for: Films ready for international licensing with market potential",
        desc: "House of Film is an international sales agent representing films at the world's major film markets. They negotiate territory-by-territory deals with broadcasters, distributors, and streaming platforms in Europe, Asia, Latin America, and beyond. Typically works on a commission basis (15–25%) on sales they make, plus some upfront fees for market representation.",
        tagsLabel: "Markets served",
        tags: ["European broadcasters", "Asian streamers", "Latin America", "Middle East & North Africa", "International VOD"]
      },
      {
        name: "Mongrel Media",
        type: "Canadian Distributor & International Sales",
        stats: [
          { label: "Territory", value: "Canada (primary) + international" },
          { label: "Focus", value: "Arthouse, world cinema, docs" }
        ],
        bestFor: "Best for: Films seeking Canadian distribution & international prestige markets",
        desc: "Toronto-based Mongrel Media is Canada's leading independent film distributor, specializing in arthouse, world cinema, and documentaries. They distribute theatrically in Canada and have international connections for sales into key English-language and European markets. If your film has festival credentials and arthouse positioning, Mongrel is the natural Canadian distribution partner.",
        tagsLabel: "Markets served",
        tags: ["Canadian theatrical", "Canadian VOD", "Crave", "CBC Gem", "International co-sales"]
      },
      {
        name: "TriCoast Worldwide",
        type: "International Distribution & TV Sales",
        stats: [
          { label: "Specialty", value: "International TV & digital rights" },
          { label: "Reach", value: "50+ countries" }
        ],
        bestFor: "Best for: Films targeting both U.S. and international TV/VOD markets",
        desc: "TriCoast Worldwide is the international arm of TriCoast Entertainment, handling global TV sales, international VOD licensing, and cross-border deals. They sell into 50+ countries, with established relationships in European pay-TV, Asian broadcasters, and Middle Eastern platforms. Particularly strong in action, thriller, drama, and documentary content with a commercial hook for international buyers.",
        tagsLabel: "Markets served",
        tags: ["European pay-TV", "Asian broadcasters", "International VOD", "Airlines", "50+ countries"]
      },
      {
        name: "Vision Films",
        type: "International Distributor & Domestic VOD",
        stats: [
          { label: "Focus", value: "Drama, doc, faith, action" },
          { label: "Model", value: "Global rights, domestic + international" }
        ],
        bestFor: "Best for: Filmmakers wanting one company to cover domestic and international",
        desc: "Vision Films handles both domestic U.S. digital distribution and international licensing under one roof. They cover drama, documentary, action, thriller, and faith-based content across VOD, TV, and physical media worldwide. Their dual domestic + international model makes them convenient for filmmakers who don't want to negotiate with separate companies for different territories.",
        tagsLabel: "Markets served",
        tags: ["Amazon", "iTunes", "Google TV", "International broadcasters", "Physical media (global)", "Airlines"]
      }
    ]
  },
  "distributors/digital-first": {
    ...DIST,
    canonical: "https://filmmakergenius.com/academy/digital-first-film-distributors",
    groupTitle: "Distributors",
    groupPath: "/academy/distributors",
    catPill: "Distributors · Digital-First",
    breadcrumbLabel: "Digital-First",
    title: "Digital-First",
    intro: "VOD-primary distributors focused on broad digital reach without theatrical overhead. Revenue-share models, lower barriers to entry, and wide digital footprints — making them among the most accessible options for emerging indie filmmakers.",
    stats: [
      { hi: "5", text: "companies" },
      { text: "Revenue share models" },
      { text: "Lower barrier to entry" },
      { text: "Wide VOD footprint" }
    ],
    variant: "company",
    gridCols: 3,
    statLayout: "column",
    itemsLabel: "Companies in this category",
    cards: [
      {
        name: "BayView Entertainment",
        type: "Digital Distributor · Broad Niche Content",
        stats: [
          { label: "Specialty", value: "Instructional, doc, lifestyle, faith" },
          { label: "Model", value: "Revenue share" }
        ],
        bestFor: "Best for: Instructional, how-to, doc, and lifestyle content",
        desc: "BayView Entertainment is one of the longest-running digital-first distributors in the U.S., specializing in instructional, documentary, lifestyle, health, and faith-based content. They handle encoding, metadata, and delivery to major VOD platforms, operating primarily on a revenue-share basis. While not prestige, their catalog reach and niche content expertise make them ideal for factual and instructional content.",
        tagsLabel: "Channels",
        tags: ["Amazon", "iTunes", "Google TV", "Tubi", "Roku", "Physical media"]
      },
      {
        name: "Breaking Glass Pictures",
        type: "LGBTQ+ & Indie Digital Distributor",
        stats: [
          { label: "Specialty", value: "LGBTQ+, drama, doc, horror" },
          { label: "Model", value: "Revenue share" }
        ],
        bestFor: "Best for: LGBTQ+ films, socially conscious dramas, and accessible indie content",
        desc: "Breaking Glass Pictures is a Philadelphia-based digital-first distributor with a strong niche in LGBTQ+ cinema alongside indie drama, documentary, and horror. Revenue-share model with no upfront fees. Known for being open to emerging filmmakers without major credits. They access all major VOD platforms and a wide network of LGBTQ+-specific platforms including Revry and OUTtv.",
        tagsLabel: "Channels",
        tags: ["Amazon", "iTunes", "Revry", "OUTtv", "Tubi", "Google TV"]
      },
      {
        name: "Echelon Studios",
        type: "Digital-First Distributor (also in Hybrid/Aggregator)",
        stats: [
          { label: "Revenue Split", value: "70/30 or 60/40 to filmmaker" },
          { label: "Rights", value: "Global or regional" }
        ],
        bestFor: "Best for: Microbudget films seeking maximum availability with minimal friction",
        desc: "Echelon Studios manages global or regional digital rights across VOD, TV, DVD, and airlines, with favorable filmmaker splits (70/30 or 60/40). Their large catalog means films receive minimal individualized marketing, so filmmakers must drive their own audience. Accessible entry point for emerging filmmakers who prioritize reach over prestige, with good platform breadth.",
        tagsLabel: "Channels",
        tags: ["Amazon", "Apple TV", "Google TV", "Vudu", "Tubi", "Cable VOD", "Airlines"]
      },
      {
        name: "New Video / Cinedigm",
        type: "Digital Distribution Network",
        stats: [
          { label: "Focus", value: "Broad digital + niche channel ops" },
          { label: "Scale", value: "Hundreds of titles in catalog" }
        ],
        bestFor: "Best for: Films seeking broad U.S. digital reach with FAST channel access",
        desc: "New Video (now part of Cinedigm's distribution network) offers broad digital distribution across major U.S. platforms. Their catalog includes a wide range of independent content. The Cinedigm parent company also operates FAST channels, giving distributed titles additional placement opportunities beyond the standard TVOD/AVOD storefronts. Better for volume and availability than personalized filmmaker service.",
        tagsLabel: "Channels",
        tags: ["Amazon", "Tubi", "Roku", "Peacock", "Samsung TV+", "Pluto TV"]
      },
      {
        name: "Freestyle Digital Media",
        type: "Fast-Track Digital Distributor",
        stats: [
          { label: "Focus", value: "Drama, thriller, doc, action" },
          { label: "Speed", value: "Fast release turnaround" }
        ],
        bestFor: "Best for: Films that need to be in market quickly with wide availability",
        desc: "Freestyle Digital Media prioritizes speed and breadth — they get films onto every major VOD platform quickly without the slow ramp of a theatrical campaign. They accept drama, thriller, documentary, and action content with a relatively low bar for production quality. Known for transparency, filmmaker-friendly terms, and honest reporting. A reliable workhorse for digital-first releases.",
        tagsLabel: "Channels",
        tags: ["Amazon", "iTunes", "Google TV", "Vudu", "Tubi", "Hulu", "Roku"]
      }
    ]
  },
  "vod/major-platforms": {
    ...VOD,
    canonical: "https://filmmakergenius.com/academy/major-vod-platforms",
    groupTitle: "VOD Platforms",
    groupPath: "/academy/vod",
    catPill: "VOD · Major Platforms",
    breadcrumbLabel: "Major Platforms",
    title: "Major Platforms",
    intro: "The mainstream high-volume streamers where the largest audiences live. Most require an aggregator or distributor — but getting on even one can transform your film's reach overnight.",
    stats: [
      { hi: "22", text: "platforms" },
      { text: "SVOD · TVOD · AVOD · FAST" },
      { text: "Aggregator or distributor access required" }
    ],
    variant: "platform",
    gridCols: 3,
    itemsLabel: "Platforms in this category",
    cards: [
      { name: "Netflix", type: "SVOD — Subscription Streaming", model: "Direct acquisition only", desc: "The world's largest SVOD platform. Netflix does not work with aggregators — they license content directly and only from established distributors or through direct pitch (highly competitive). Most indie films access Netflix only via a major distribution deal that includes Netflix licensing rights.", tagsLabel: "Access via", tags: ["Direct distributor deal only", "Netflix pitch process"] },
      { name: "Amazon Prime Video", type: "SVOD / TVOD — Hybrid", model: "Aggregator or distributor", desc: "One of the widest-reach platforms accessible to indie filmmakers via aggregators. Available through Filmhub, Kinonation, most fee-based aggregators, and all major distributors. Films appear on Prime Video and/or in the Amazon TVOD storefront.", tagsLabel: "Access via", tags: ["Filmhub", "Kinonation", "Bitmax", "Quiver Digital", "Most distributors"] },
      { name: "Apple TV / iTunes", type: "TVOD / SVOD — Pay-per-title + Apple TV+", model: "Aggregator or distributor", desc: "Premium TVOD storefront with significant buyer value per transaction. Access requires an Apple-approved aggregator or distributor. Under the Milky Way has preferred partner status. Also accessible via Bitmax, Quiver Digital, and most major distributors.", tagsLabel: "Access via", tags: ["Under the Milky Way", "Bitmax", "Quiver Digital", "Kinonation", "Gravitas"] },
      { name: "Hulu", type: "SVOD / AVOD — Subscription + Ad-Supported", model: "Distributor required", desc: "Hulu doesn't accept films directly from aggregators — films generally require a distribution deal to be placed on Hulu. The platform leans toward licensed content from established producers. Accessible through Kinonation (pitched, not guaranteed) and most full-service distributors.", tagsLabel: "Access via", tags: ["Gravitas Ventures", "FilmRise", "Kinonation (pitched)", "Major distributors"] },
      { name: "Tubi", type: "AVOD — Free with Ads", model: "Aggregator or distributor", desc: "One of the most accessible major AVOD platforms. Tubi accepts films via most aggregators including Filmhub, Bitmax, and Kinonation, and is serviced by virtually all distributors. Revenue is paid per-stream ad earnings. Wide library — competition for placement is high but entry is not exclusive.", tagsLabel: "Access via", tags: ["Filmhub", "Bitmax", "Kinonation", "Most distributors"] },
      { name: "Roku Channel", type: "AVOD / FAST — Free with Ads + FAST", model: "Aggregator or distributor", desc: "Roku's owned AVOD/FAST channel with 80M+ device users. Accessible via Filmhub, Bitmax, and most distributors. One of the highest-reach AVOD platforms for indie content in the U.S., with ad revenue shared per stream. Placement is pitched — not all submitted films are accepted.", tagsLabel: "Access via", tags: ["Filmhub", "Bitmax", "Most distributors"] },
      { name: "Pluto TV", type: "AVOD / FAST — Free with Ads + Channels", model: "Aggregator or distributor", desc: "Paramount-owned free streaming platform with scheduled FAST channels and on-demand AVOD. Very large U.S. audience. Accessible via most aggregators and distributors. Content goes into Pluto's channel rotation — placement in the right channel matters for discoverability.", tagsLabel: "Access via", tags: ["Bitmax", "Most distributors", "Cineverse"] },
      { name: "Google TV / Google Play", type: "TVOD — Pay-per-rental/purchase", model: "Aggregator or distributor", desc: "Google's TVOD storefront with strong Android/Chromecast device penetration. Available via most aggregators including Bitmax, Quiver, Kinonation, and Filmhub. Revenue is earned per rental or purchase. One of the top three TVOD stores alongside iTunes and Amazon.", tagsLabel: "Access via", tags: ["Bitmax", "Quiver Digital", "Kinonation", "Filmhub", "Most distributors"] },
      { name: "Peacock", type: "SVOD / AVOD — NBCUniversal", model: "Distributor preferred", desc: "NBCUniversal's streaming platform combining subscription and free ad-supported tiers. Accessible through select distributors and some aggregators (Filmhub pitches here). Not all submissions are accepted — content must meet quality and commercial thresholds. Strong reach among NBCUniversal's existing subscriber base.", tagsLabel: "Access via", tags: ["Filmhub (pitched)", "Gravitas", "Giant Pictures", "Full-service distributors"] },
      { name: "Plex", type: "AVOD / FAST — Free streaming", model: "Aggregator or distributor", desc: "Plex is a free AVOD/FAST platform with a large library and a dedicated user base of tech-savvy streamers. Accessible via Filmhub and Indie Rights. Growing FAST channel network. Revenue is ad-supported and shared per stream. Known for accepting a wide range of indie content.", tagsLabel: "Access via", tags: ["Filmhub", "Indie Rights", "Giant Pictures"] },
      { name: "Samsung TV Plus", type: "FAST — Free Scheduled Channels", model: "Aggregator or distributor", desc: "Samsung's FAST platform pre-installed on 100M+ Samsung TVs. Content is delivered as FAST channels rather than on-demand titles. Filmhub has direct access to Samsung TV Plus for its catalog. Content gets scheduled channel placement — rotation-based exposure rather than algorithmic discovery.", tagsLabel: "Access via", tags: ["Filmhub", "Cineverse", "Full-service distributors"] },
      { name: "Vudu", type: "TVOD / AVOD — Walmart-owned", model: "Aggregator or distributor", desc: "Walmart-owned TVOD and AVOD platform with strong penetration in the U.S. Midwest and rural markets. Accessible via Bitmax, Quiver, and most distributors. TVOD rental/purchase revenue plus an AVOD library tier. Somewhat underrated reach for filmmakers targeting mainstream American audiences.", tagsLabel: "Access via", tags: ["Bitmax", "Quiver Digital", "Kinonation", "Most distributors"] }
    ]
  },
  "vod/arthouse": {
    ...VOD,
    canonical: "https://filmmakergenius.com/academy/arthouse-vod-platforms",
    groupTitle: "VOD Platforms",
    groupPath: "/academy/vod",
    catPill: "VOD · Arthouse & Prestige",
    breadcrumbLabel: "Arthouse & Prestige",
    title: "Arthouse & Prestige",
    intro: "Curated streaming platforms for festival-caliber and critically recognized cinema. Highly selective — distributor relationships are typically required. Getting on these platforms signals credibility.",
    stats: [
      { hi: "15", text: "platforms" },
      { text: "Curator-selected" },
      { text: "Festival pedigree typically required" }
    ],
    variant: "platform",
    gridCols: 3,
    itemsLabel: "Platforms in this category",
    cards: [
      { name: "MUBI", type: "SVOD — Curated Global Cinema", model: "Distributor or direct pitch", desc: "One of the most prestigious arthouse streaming services in the world. MUBI curates a rotating library of 30 films at a time, each available for 30 days. Selection is by invitation or through distribution partners. Strong Kino Lorber and arthouse distributor relationships. Highly selective — but being on MUBI is a major credibility marker.", tagsLabel: "Access via", tags: ["Kino Lorber", "Cinema Guild", "GoDigital / Amplify", "Direct pitch (competitive)"] },
      { name: "Criterion Channel", type: "SVOD — Classic & World Cinema", model: "Invitation / distributor required", desc: "The streaming arm of the Criterion Collection — the most prestigious name in film curation. Criterion Channel focuses on classic, world, and arthouse cinema. Getting placed here requires either a Criterion release deal or distribution through their key partners. An invitation to this platform is rare and significant for any indie filmmaker.", tagsLabel: "Access via", tags: ["Kino Lorber", "Cohen Media Group", "Direct Criterion relationship"] },
      { name: "Fandor", type: "SVOD — Independent & World Cinema", model: "Distributor or direct submission", desc: "Fandor is a subscription service dedicated to independent, international, and documentary cinema. Unlike MUBI or Criterion Channel, Fandor accepts a broader range of indie submissions — making it more accessible to filmmakers without major festival credentials. Strong for world cinema, personal filmmaking, and documentary-adjacent narratives.", tagsLabel: "Access via", tags: ["Kino Lorber", "GoDigital", "Direct submission (open)"] },
      { name: "Sundance Now", type: "SVOD — Independent Cinema", model: "AMC Networks / distributor", desc: "Sundance Now (an AMC Networks property) streams independent films including Sundance selections and arthouse titles. Premium subscription service with a curated audience of indie film enthusiasts. Access requires either an AMC Networks deal or distribution through their licensed content partners. Strong brand association with the Sundance Film Festival ethos.", tagsLabel: "Access via", tags: ["AMC Networks deal", "GoDigital / Amplify", "Key arthouse distributors"] },
      { name: "BFI Player", type: "SVOD / TVOD — British Film Institute", model: "Distributor (UK-focused)", desc: "The British Film Institute's streaming platform, offering classic British cinema, world cinema, and festival selections. Primarily UK-facing but accessible globally. Access for international indie filmmakers typically comes through UK or international distributors with BFI relationships. Strong with documentary, arthouse, and significant world cinema titles.", tagsLabel: "Access via", tags: ["UK distributors", "International arthouse distributors", "BFI direct pitch"] },
      { name: "Kanopy", type: "Free via Library / University", model: "Distributor or direct", desc: "Kanopy is a free streaming platform available through public libraries and universities. Content is licensed and funded through library subscriptions. Particularly strong for documentaries, educational content, and arthouse films. Giant Pictures and First Run Features have established Kanopy pipelines. Great for reaching academic audiences and long-tail content discovery.", tagsLabel: "Access via", tags: ["Giant Pictures", "First Run Features", "Passion River", "Direct submission"] }
    ]
  },
  "vod/genre": {
    ...VOD,
    canonical: "https://filmmakergenius.com/academy/genre-vod-platforms",
    groupTitle: "VOD Platforms",
    groupPath: "/academy/vod",
    catPill: "VOD · Genre",
    breadcrumbLabel: "Genre",
    title: "Genre Platforms",
    intro: "Horror, cult, sci-fi, martial arts, and genre-defining streaming platforms with dedicated fan communities and specialized programming teams who actively seek content that fits their lane.",
    stats: [
      { hi: "8", text: "platforms" },
      { text: "Horror · Cult · Sci-Fi · Martial Arts" },
      { text: "Some accept direct submissions" }
    ],
    variant: "platform",
    gridCols: 4,
    itemsLabel: "Platforms in this category",
    cards: [
      { name: "Shudder", type: "SVOD — Horror, Thriller, Supernatural", model: "AMC Networks / distributor", desc: "AMC Networks' dedicated horror and thriller streaming service. The most prestigious genre-specific platform for horror filmmakers. Shudder acquires both original content and licensed films. Access requires distribution deals with Shudder's content partners or a direct Shudder acquisition. Terror Films, Shout! Factory, and Cineverse are key access paths.", tagsLabel: "Access via", tags: ["Terror Films", "Shout! / Scream Factory", "Cineverse", "Direct pitch"] },
      { name: "Screambox", type: "SVOD — Horror", model: "Cineverse / distributor", desc: "Cineverse-operated horror SVOD with a growing catalog. Easier to access than Shudder for indie horror filmmakers — Cineverse operates Screambox and places content on it through their distribution arm. Also reachable via Terror Films. Lower bar than Shudder, broader catalog.", tagsLabel: "Access via", tags: ["Cineverse", "Terror Films"] },
      { name: "Arrow Player", type: "SVOD — Cult & Classic Genre", model: "Arrow Video direct", desc: "Arrow Video's streaming platform for cult cinema, exploitation, and genre classics. UK-based but available in the U.S. Focuses on premium physical media releases with streaming library extension. Arrow's acquisitions team focuses on cult, martial arts, spaghetti westerns, and extreme genre cinema with restoration quality.", tagsLabel: "Access via", tags: ["Arrow Video direct deal"] },
      { name: "Screambox", type: "SVOD — Indie Horror", model: "Cineverse", desc: "Dedicated indie horror SVOD platform operated by Cineverse with a focus on micro-budget and emerging horror filmmakers. Lower threshold than Shudder — actively seeking original genre content. Cineverse manages content submission and placement.", tagsLabel: "Access via", tags: ["Cineverse", "Terror Films"] },
      { name: "Full Moon Features", type: "SVOD — B-Movie & Cult Horror", model: "Direct (own platform)", desc: "Charles Band's Full Moon Features is a filmmaker-run SVOD platform focused on B-movies, cult horror, and exploitation cinema. Owned content only — Full Moon acquires films or commissions them in-house. A unique distribution option if your film fits the Full Moon aesthetic (low-budget, genre-forward, cult audience).", tagsLabel: "Access via", tags: ["Full Moon direct acquisition"] },
      { name: "Hi-YAH!", type: "SVOD — Martial Arts & Action", model: "Direct submission", desc: "Dedicated streaming platform for martial arts, action, and Asian action cinema. Accepts direct submissions from filmmakers whose content fits the genre. An accessible niche platform for filmmakers working in the martial arts, kung fu, or action thriller space — the global audience for this genre is substantial.", tagsLabel: "Access via", tags: ["Direct submission", "Genre distributors"] },
      { name: "Night Flight Plus", type: "SVOD — Cult, Underground, Psychedelic", model: "Direct submission", desc: "Night Flight Plus streams cult, underground, psychedelic, and avant-garde content. Originally a cult MTV-era program, now a streaming platform accepting submissions from experimental and genre filmmakers. Niche audience but highly passionate. Accepts direct filmmaker submissions for cult-appropriate content.", tagsLabel: "Access via", tags: ["Direct submission", "Terror Films"] },
      { name: "Midnight Pulp", type: "SVOD — Asian & Genre Cinema", model: "Direct or distributor", desc: "Streaming platform specializing in Asian cinema with a particular focus on genre content: horror, action, martial arts, anime, and thriller. Accessible to filmmakers through direct submission or via distributors with Asian genre content relationships. A solid niche platform for films crossing genre and international appeal.", tagsLabel: "Access via", tags: ["Direct submission", "Asian cinema distributors"] }
    ]
  },
  "vod/documentary": {
    ...VOD,
    canonical: "https://filmmakergenius.com/academy/documentary-vod-platforms",
    groupTitle: "VOD Platforms",
    groupPath: "/academy/vod",
    catPill: "VOD · Documentary",
    breadcrumbLabel: "Documentary",
    title: "Documentary Platforms",
    intro: "Streaming platforms dedicated to nonfiction storytelling — from global SVOD services with millions of subscribers to niche documentary hubs with festival-grade curation and academic licensing pipelines.",
    stats: [
      { hi: "9", text: "platforms" },
      { text: "Nonfiction specialists" },
      { text: "Some accept direct submissions" }
    ],
    variant: "platform",
    gridCols: 3,
    itemsLabel: "Platforms in this category",
    cards: [
      { name: "CuriosityStream", type: "SVOD — Factual & Documentary", model: "Direct pitch or distributor", desc: "One of the largest dedicated documentary streaming platforms globally. CuriosityStream focuses on science, history, nature, technology, and society. They commission original content and license finished films. Quality bar is high — content must be informative and well-produced. Access via Watermelon Pictures and direct pitch to CuriosityStream's acquisitions team.", tagsLabel: "Access via", tags: ["Watermelon Pictures", "Direct pitch", "Doc distributors"] },
      { name: "MagellanTV", type: "SVOD — Science & History Docs", model: "Direct submission", desc: "MagellanTV is a documentary-only SVOD focused on science, space, history, and technology. They accept direct filmmaker submissions and are known for being more accessible than CuriosityStream for independent documentary makers. Good global reach and a growing subscriber base of science and history enthusiasts.", tagsLabel: "Access via", tags: ["Direct submission", "Documentary distributors"] },
      { name: "Docurama", type: "AVOD / SVOD — Documentary", model: "Cineverse / distributor", desc: "Docurama is a documentary-specific AVOD/SVOD channel operated through Cineverse. Covers a wide range of documentary subject matter from social issue to nature to music docs. Films access Docurama through Cineverse's distribution pipeline or through affiliated documentary distributors. A solid niche home for indie docs.", tagsLabel: "Access via", tags: ["Cineverse", "IndiePix Films", "Documentary distributors"] },
      { name: "GuideDoc", type: "SVOD — International Docs", model: "Direct submission", desc: "GuideDoc is an international documentary streaming platform that directly accepts submissions from independent filmmakers. Strong in environmental, social justice, and international subject matter. Payments are per-stream based on their revenue model. One of the most filmmaker-accessible doc platforms — low barrier, global audience, direct relationship.", tagsLabel: "Access via", tags: ["Direct submission (open)"] },
      { name: "Tënk", type: "SVOD — Auteur Docs (France-based)", model: "Direct submission or distributor", desc: "Tënk is a French-based curated documentary platform with high editorial standards. Focused on auteur documentary filmmaking — films that push the form as much as the content. Available internationally, with a growing English-language selection. Selective but filmmaker-friendly with transparent rights terms and a passionate audience of documentary enthusiasts.", tagsLabel: "Access via", tags: ["Direct submission", "French/European distributors"] },
      { name: "Waterbear", type: "AVOD — Nature & Environment Docs", model: "Direct submission (free)", desc: "Waterbear is a free streaming platform dedicated to nature, wildlife, and environmental documentary content. Unique business model — for every hour watched, the platform donates to environmental causes. Filmmakers can submit directly, making it highly accessible for docs with environmental themes. Global reach with a mission-driven audience.", tagsLabel: "Access via", tags: ["Direct submission (free to submit)"] },
      { name: "True Real", type: "FAST — Real Crime & True Story Docs", model: "Distributor", desc: "True Real is a FAST channel dedicated to true crime, real events, and investigative documentary content. Growing audience in the highly popular true crime genre. Access is primarily through distributors with true crime documentary content. A good FAST placement for crime and investigative docs looking to ride one of the most-watched genres on streaming.", tagsLabel: "Access via", tags: ["Documentary distributors", "Cineverse"] },
      { name: "DOCU (Vimeo On Demand)", type: "TVOD / SVOD — Global Doc Distribution", model: "Direct — Vimeo on Demand", desc: "Vimeo's on-demand platform allows documentary filmmakers to sell or rent their films directly to global audiences with no intermediary. Filmmakers keep 90% of revenue. Not a curated platform — discoverability is low without independent promotion — but it's the most flexible and filmmaker-friendly direct TVOD option available with zero rights acquisition.", tagsLabel: "Access via", tags: ["Direct filmmaker upload", "No intermediary required"] }
    ]
  },
  "vod/lgbtq": {
    ...VOD,
    canonical: "https://filmmakergenius.com/academy/lgbtq-vod-platforms",
    groupTitle: "VOD Platforms",
    groupPath: "/academy/vod",
    catPill: "VOD · LGBTQ+",
    breadcrumbLabel: "LGBTQ+",
    title: "LGBTQ+ Platforms",
    intro: "Streaming platforms dedicated to queer stories — from global FAST networks to niche SVODs focused on gay, lesbian, bisexual, trans, and nonbinary narratives. Many accept direct filmmaker submissions.",
    stats: [
      { hi: "11", text: "platforms" },
      { text: "Many accept direct submissions" },
      { text: "Global LGBTQ+ audiences" }
    ],
    variant: "platform",
    gridCols: 3,
    itemsLabel: "Platforms in this category",
    cards: [
      { name: "Revry", type: "AVOD / FAST — LGBTQ+ Global Network", model: "Direct submission", desc: "Revry is the world's first global LGBTQ+ streaming network, operating as both AVOD and FAST channels. Actively accepts indie LGBTQ+ films and content directly from filmmakers. Broad reach across connected TVs, mobile, and web. Revenue is ad-supported and shared per stream. Breaking Glass Pictures is also a key access path.", tagsLabel: "Access via", tags: ["Direct submission", "Breaking Glass Pictures", "Filmhub"] },
      { name: "OUTtv", type: "SVOD — LGBTQ+ TV & Film", model: "Direct or distributor", desc: "Canada's original LGBTQ+ specialty channel, now available globally as an SVOD. OUTtv carries a broad range of LGBTQ+ film and TV content — drama, documentary, reality, and indie features. Accessible through Breaking Glass Pictures and direct filmmaker submissions. International distribution with growing streaming subscriber base.", tagsLabel: "Access via", tags: ["Breaking Glass Pictures", "Direct submission"] },
      { name: "Dekkoo", type: "SVOD — Gay Male Cinema", model: "Direct submission", desc: "Dekkoo is a subscription streaming service focused specifically on gay and bisexual male content — feature films, shorts, and series. They actively accept submissions from indie gay filmmakers. Good platform for features and shorts with gay male narratives. Paid subscription model means a committed audience base rather than casual browsers.", tagsLabel: "Access via", tags: ["Direct submission (open)"] },
      { name: "GagaOOLala", type: "SVOD — Asian LGBTQ+ Content", model: "Direct submission", desc: "Taiwan-based LGBTQ+ streaming platform focused on Asian LGBTQ+ stories and international queer content. One of the largest LGBTQ+ platforms in Asia with subscribers across 11+ countries. Particularly strong for LGBTQ+ films from or about East and Southeast Asia. Accepts international submissions — great for crossing into Asian streaming markets.", tagsLabel: "Access via", tags: ["Direct submission", "LGBTQ+ distributors"] },
      { name: "TelloFilms", type: "SVOD — Lesbian & Women's Stories", model: "Direct submission", desc: "TelloFilms is an SVOD platform dedicated to lesbian and women-focused storytelling — an underserved space in the broader LGBTQ+ streaming landscape. They produce their own original content and license indie films. Direct submissions from filmmakers with relevant content are welcomed. Loyal, paying subscriber base of lesbian and queer women viewers.", tagsLabel: "Access via", tags: ["Direct submission"] },
      { name: "Frameline+", type: "SVOD — LGBTQ+ Cinema & Archive", model: "Festival-connected", desc: "Frameline is the San Francisco International LGBTQ+ Film Festival's streaming platform. Frameline+ offers access to the festival's curated archive and new acquisitions. Strong connection to the world's oldest LGBTQ+ film festival — appearing in the Frameline festival or on Frameline+ carries significant cultural weight in the LGBTQ+ film community.", tagsLabel: "Access via", tags: ["Frameline Film Festival selection", "Direct acquisition"] }
    ]
  },
  "vod/black-cinema": {
    ...VOD,
    canonical: "https://filmmakergenius.com/academy/black-cinema-vod-platforms",
    groupTitle: "VOD Platforms",
    groupPath: "/academy/vod",
    catPill: "VOD · Black Cinema",
    breadcrumbLabel: "Black Cinema",
    title: "Black Cinema Platforms",
    intro: "Platforms spotlighting Black indie films, African diaspora stories, and Black-owned cultural content — from grassroots community SVODs to premium AMC Networks programming and global African cinema hubs.",
    stats: [
      { hi: "6", text: "platforms" },
      { text: "Some accept direct submissions" },
      { text: "U.S. + African diaspora audiences" }
    ],
    variant: "platform",
    gridCols: 3,
    itemsLabel: "Platforms in this category",
    cards: [
      { name: "KweliTV", type: "SVOD — Black & African Diaspora Cinema", model: "Direct submission", desc: "KweliTV is the leading streaming platform for Black and African diaspora cinema globally. They focus on Black-centered films, documentaries, and TV series from across the world. They actively accept submissions from indie filmmakers. Known for their filmmaker-first approach, transparent revenue sharing, and genuine community building around Black cinema. A critical platform for any Black filmmaker's distribution strategy.", tagsLabel: "Access via", tags: ["Direct submission (open)"] },
      { name: "ALLBLK", type: "SVOD — Black Film & TV", model: "AMC Networks / distributor", desc: "ALLBLK is AMC Networks' SVOD dedicated to Black film and TV content. Part of the AMC Networks family alongside Shudder and Sundance Now. Higher quality threshold than grassroots platforms — content typically comes through AMC's acquisition process or through established distributors. Strong reach with paying subscribers specifically seeking Black film and TV content.", tagsLabel: "Access via", tags: ["AMC Networks acquisition", "Full-service distributors"] },
      { name: "Maverick Black Cinema", type: "AVOD / SVOD — Black Film Platform", model: "Direct submission", desc: "Maverick Black Cinema is a streaming platform dedicated to Black cinema with a community-focused approach. They accept direct submissions from indie Black filmmakers and feature content that celebrates Black stories and culture. AVOD and subscription tiers serve both free and paying audiences. A strong community anchor for Black indie filmmakers seeking dedicated audience reach.", tagsLabel: "Access via", tags: ["Direct submission"] },
      { name: "AfroLandTV", type: "SVOD — African & Diaspora Storytelling", model: "Direct submission", desc: "AfroLandTV focuses on African stories and the Black diaspora experience. They stream films, documentaries, and series from African filmmakers and African-American storytellers. Direct submissions welcomed — particularly for films that center African cultural narratives, social issues, and historical stories from the continent and diaspora. Growing global subscriber base.", tagsLabel: "Access via", tags: ["Direct submission"] },
      { name: "Urban Movie Channel", type: "AVOD — Urban & Black Entertainment", model: "Distributor or direct", desc: "Urban Movie Channel (UMC) streams urban and Black entertainment content across a wide range including drama, comedy, romance, and thriller. Available as AVOD and through Amazon Prime Video Channels. Their broad content definition and accessible submission process make them one of the easier Black film platforms to access for indie filmmakers.", tagsLabel: "Access via", tags: ["Direct submission", "Amazon Channels"] },
      { name: "Black Cinema House", type: "Curated Platform — Experimental & Documentary", model: "Curatorial / direct", desc: "Black Cinema House focuses on experimental, documentary, and independent films by Black filmmakers — particularly work that pushes form and challenges conventions. Associated with Chicago's Rebuild Foundation and Theaster Gates' cultural programming. More of a curated archive and screening platform than a commercial streamer, but a prestigious acknowledgment for Black avant-garde filmmakers.", tagsLabel: "Access via", tags: ["Curatorial selection", "Program application"] }
    ]
  },
  "vod/international": {
    ...VOD,
    canonical: "https://filmmakergenius.com/academy/international-vod-platforms",
    groupTitle: "VOD Platforms",
    groupPath: "/academy/vod",
    catPill: "VOD · International",
    breadcrumbLabel: "International",
    title: "International Platforms",
    intro: "Region-specific and diaspora platforms serving global audiences — from Ukrainian cinema to Cambodian OTT, Bengali SVOD, Southeast Asian streaming, and world cinema discovery platforms. Many accept direct submissions.",
    stats: [
      { hi: "10", text: "platforms" },
      { text: "Many accept direct submissions" },
      { text: "Global reach · Diaspora audiences" }
    ],
    variant: "platform",
    gridCols: 3,
    itemsLabel: "Platforms in this category",
    cards: [
      { name: "FilmDoo", type: "SVOD / TVOD — World Cinema Discovery", model: "Direct submission", desc: "FilmDoo is a UK-based world cinema discovery platform that curates international films and connects them with global audiences. Active in Southeast Asia with significant subscriber bases in Singapore, Malaysia, and Indonesia. They accept direct filmmaker submissions and are known for being accessible to filmmakers from underrepresented regions and countries.", tagsLabel: "Access via", tags: ["Direct submission (open)", "International distributors"] },
      { name: "AsianCrush", type: "AVOD / SVOD — Asian Cinema", model: "Direct or distributor", desc: "AsianCrush is a streaming platform dedicated to Korean, Japanese, Chinese, and broader Asian cinema and TV. Free with ads and subscription tiers. Particularly strong for Korean drama, Japanese horror, and East Asian genre content. Accessible to filmmakers through direct submissions or via Asian content distributors. Growing U.S. diaspora audience.", tagsLabel: "Access via", tags: ["Direct submission", "Midnight Pulp (sister platform)", "Asian distributors"] },
      { name: "Hoichoi", type: "SVOD — Bengali Cinema & OTT", model: "Direct or South Asian distributors", desc: "Hoichoi is the leading Bengali language OTT platform, focused on Bangladeshi and West Bengali cinema, series, and content. Global reach targeting the Bengali diaspora in the U.S., UK, Middle East, and Southeast Asia. For filmmakers working in Bengali language or creating content with Bengali cultural relevance, Hoichoi is a significant platform.", tagsLabel: "Access via", tags: ["Direct submission", "South Asian distributors"] },
      { name: "Klassiki", type: "SVOD — Russian, Eastern European & Soviet Cinema", model: "Direct or distributor", desc: "Klassiki is a streaming platform dedicated to Russian, Eastern European, and Soviet cinema. Focuses on classics alongside contemporary Eastern European arthouse and independent films. UK-based with global reach. A specialized platform for filmmakers working in the Eastern European film tradition or making films about that region.", tagsLabel: "Access via", tags: ["Direct submission", "Eastern European distributors"] },
      { name: "Takflix", type: "SVOD — Ukrainian Cinema", model: "Direct submission", desc: "Takflix is Ukraine's leading independent streaming platform, dedicated to Ukrainian cinema and content about Ukraine. Gained international prominence following Russia's invasion of Ukraine. For filmmakers making content about Ukraine, Ukrainian identity, or Eastern European conflict stories, Takflix offers direct access to Ukrainian and global diaspora audiences.", tagsLabel: "Access via", tags: ["Direct submission (open)"] },
      { name: "Mubi Go / MUBI (International)", type: "SVOD — World Cinema (Global)", model: "Distributor or direct pitch", desc: "MUBI operates globally across 190+ countries, making it the most internationally accessible arthouse streaming platform. A placement on MUBI in any territory reaches film enthusiasts worldwide. International distributors with MUBI relationships include Kino Lorber, Cinema Guild, and Cohen Media. Direct pitches to MUBI are highly competitive but possible.", tagsLabel: "Access via", tags: ["Arthouse distributors", "Direct pitch (competitive)"] }
    ]
  },
  "vod/shorts": {
    ...VOD,
    canonical: "https://filmmakergenius.com/academy/short-film-vod-platforms",
    groupTitle: "VOD Platforms",
    groupPath: "/academy/vod",
    catPill: "VOD · Shorts",
    breadcrumbLabel: "Shorts",
    title: "Short Film Platforms",
    intro: "Platforms dedicated to short films — from global YouTube channels with millions of subscribers to curated hubs that connect shorts to festivals, distributors, and industry scouts. Most accept direct submissions.",
    stats: [
      { hi: "8", text: "platforms" },
      { text: "Most accept direct submissions" },
      { text: "Industry visibility + audience reach" }
    ],
    variant: "platform",
    gridCols: 3,
    itemsLabel: "Platforms in this category",
    cards: [
      { name: "Short of the Week", type: "Curated — Best Short Film Discovery", model: "Direct submission", desc: "Short of the Week is the premier curated short film discovery platform, publishing a selection of the best indie short films weekly. Highly selective — but being featured on Short of the Week is an industry recognition that opens doors to festivals, distributors, and platform acquisitions. Accept submissions; curated editorial team makes selections. Essential for shorts filmmakers seeking credibility.", tagsLabel: "Access via", tags: ["Direct submission", "Editorial selection"] },
      { name: "Omeleto", type: "YouTube AVOD — Short Film Channel", model: "Direct submission", desc: "Omeleto is one of the most-subscribed short film channels on YouTube with 10M+ subscribers. They curate and publish indie short films across genres. Being featured on Omeleto can bring millions of views. Revenue is YouTube ad-based — filmmakers receive a share of ad revenue from their film's views. Accept direct submissions; selective but very impactful for discoverability.", tagsLabel: "Access via", tags: ["Direct submission (omeleto.com)"] },
      { name: "ShortVerse", type: "SVOD / AVOD — Short Film Platform", model: "Direct submission", desc: "ShortVerse is a dedicated streaming platform for short films with both free and subscription tiers. They accept submissions from filmmakers across genres and pay revenue shares based on views. Growing platform with an engaged audience of short film fans and industry professionals. More discovery-friendly than YouTube due to niche focus on short film as a format.", tagsLabel: "Access via", tags: ["Direct submission (open)"] },
      { name: "Nowness", type: "Curated — Arts, Fashion & Short Film", model: "Editorial selection", desc: "Nowness is a curated platform at the intersection of art, fashion, and cinema — focusing on visually stunning short films with editorial prestige. Associated with luxury fashion and arts media. Being featured on Nowness signals aesthetic credibility and connects films to a high-end cultural audience. Editorial selection only — they source content from festivals, agencies, and direct pitches.", tagsLabel: "Access via", tags: ["Editorial selection", "Festival cross-programming"] },
      { name: "Film Shortage", type: "Curated — Short Film Community", model: "Direct submission", desc: "Film Shortage is a curated short film community and platform connecting indie shorts filmmakers with audiences and industry professionals. They feature a daily curated short alongside director interviews and behind-the-scenes content. Strong industry readership — producers, distributors, and festival programmers read Film Shortage regularly. Good for filmmakers seeking industry visibility alongside audience reach.", tagsLabel: "Access via", tags: ["Direct submission", "Editorial selection"] },
      { name: "Vimeo Staff Picks", type: "AVOD / Curator — Short & Indie Film", model: "Direct upload + editorial selection", desc: "Vimeo Staff Picks is the curator's selection on Vimeo — the world's most respected filmmaker video hosting community. Getting a Staff Pick brings immediate visibility to millions of creative industry professionals. Vimeo allows direct filmmaker uploads, but Staff Pick selection is editorial. Essential platform for establishing cinematic credibility and reaching other filmmakers and industry insiders.", tagsLabel: "Access via", tags: ["Direct upload (free)", "Staff Pick selection (editorial)"] },
      { name: "ALTER (Gunpowder & Sky)", type: "YouTube AVOD — Horror & Dark Genre Shorts", model: "Direct submission", desc: "ALTER is one of the largest horror and dark genre short film YouTube channels with 6M+ subscribers. Operated by Gunpowder & Sky, they curate and publish horror, sci-fi, and thriller shorts. High-impact distribution for genre shorts — millions of views are achievable. Revenue from YouTube ad-sharing. Direct submissions to ALTER's curatorial team accepted.", tagsLabel: "Access via", tags: ["Direct submission (Gunpowder & Sky)"] },
      { name: "DUST", type: "YouTube AVOD — Sci-Fi Shorts & Series", model: "Direct submission", desc: "DUST is the leading sci-fi short film YouTube channel and streaming platform with 5M+ YouTube subscribers. Operated by Gunpowder & Sky alongside ALTER. Exclusively science fiction — narrative, conceptual, and speculative sci-fi shorts and series. Filmmakers can submit sci-fi shorts directly. Massive sci-fi fan audience with active community engagement on each release.", tagsLabel: "Access via", tags: ["Direct submission (Gunpowder & Sky)", "DUST.tv"] }
    ]
  }
};
const groupHub = {
  aggregators: { title: "Aggregators", path: "/academy/aggregators" },
  distributors: { title: "Distributors", path: "/academy/distributors" },
  vod: { title: "VOD Platforms", path: "/academy/vod" }
};
function Card({ card, variant, statLayout }) {
  return /* @__PURE__ */ jsxs("div", { className: variant === "platform" ? "msub-card platform" : "msub-card", children: [
    card.badge && /* @__PURE__ */ jsx("div", { className: "msub-badge", children: card.badge }),
    /* @__PURE__ */ jsx("h2", { className: "msub-name", children: card.name }),
    /* @__PURE__ */ jsx("div", { className: "msub-type", children: card.type }),
    card.model && /* @__PURE__ */ jsx("div", { className: "msub-model", children: card.model }),
    card.stats && card.stats.length > 0 && /* @__PURE__ */ jsx("div", { className: statLayout === "grid" ? "msub-statrow grid" : "msub-statrow", children: card.stats.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "msub-stat", children: [
      /* @__PURE__ */ jsx("div", { className: "msub-stat-label", children: s.label }),
      /* @__PURE__ */ jsx("div", { className: "msub-stat-value", children: s.value })
    ] }, i)) }),
    card.bestFor && /* @__PURE__ */ jsx("div", { className: "msub-bestfor", children: card.bestFor }),
    /* @__PURE__ */ jsx("p", { className: "msub-desc", children: card.desc }),
    card.tags && card.tags.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      card.tagsLabel && /* @__PURE__ */ jsx("div", { className: "msub-taglabel", children: card.tagsLabel }),
      /* @__PURE__ */ jsx("div", { className: "msub-tags", children: card.tags.map((t, i) => /* @__PURE__ */ jsx("span", { className: "msub-tag", children: t }, i)) })
    ] })
  ] });
}
function MonetizationSubPage({ group }) {
  const { slug } = useParams();
  const location = useLocation();
  const canonical = `https://filmmakergenius.com${location.pathname.replace(/\/$/, "")}`;
  const hub = groupHub[group];
  const entry = slug ? monetizationSub[`${group}/${slug}`] : void 0;
  if (!entry) {
    return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px" }, children: [
      /* @__PURE__ */ jsx(Seo, { title: `Coming Soon — ${hub.title} | Filmmaker Genius`, description: `This ${hub.title} profile list is coming soon on Filmmaker Genius Academy.`, canonical: `https://filmmakergenius.com${hub.path}` }),
      /* @__PURE__ */ jsx("h1", { style: { fontFamily: "'Fraunces', serif", fontSize: 44, marginBottom: 16 }, children: "Coming soon" }),
      /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,0.5)", marginBottom: 28 }, children: "This profile list isn't published yet." }),
      /* @__PURE__ */ jsxs(Link, { to: hub.path, style: { color: "#00d4aa", fontWeight: 600, textDecoration: "none" }, children: [
        "← Back to ",
        hub.title
      ] })
    ] });
  }
  const ac = entry.accent;
  const ar = entry.accentRgb;
  return /* @__PURE__ */ jsxs("div", { className: "msub-root", style: { ["--ac"]: ac, ["--ar"]: ar, background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${entry.title} — ${entry.groupTitle} | Filmmaker Genius Academy`,
        description: `${entry.groupTitle} for indie film: ${entry.title.toLowerCase()}. ${entry.intro}`.slice(0, 300),
        canonical
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .msub-root h1, .msub-root h2 { font-family: 'Fraunces', serif; letter-spacing: -0.02em; font-weight: 700; margin: 0; }
        .msub-crumb a { color: rgba(255,255,255,0.3); transition: color .2s; text-decoration: none; }
        .msub-crumb a:hover { color: var(--ac); }
        .msub-grid { display: grid; gap: 20px; margin-bottom: 96px; }
        .msub-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px; position: relative; overflow: hidden; transition: border-color .25s, transform .25s; display: flex; flex-direction: column; height: 100%; }
        .msub-card:hover { border-color: rgba(var(--ar),0.4); transform: translateY(-2px); }
        .msub-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--ac), transparent); }
        .msub-card.platform .msub-name { font-size: 20px; }
        .msub-card.platform .msub-desc { font-size: 12px; color: rgba(255,255,255,0.45); }
        .msub-badge { display: inline-flex; align-items: center; gap: 5px; align-self: flex-start; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.25); color: rgba(251,191,36,0.85); font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; margin-bottom: 12px; }
        .msub-name { font-size: 24px; margin-bottom: 5px; }
        .msub-type { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(var(--ar),0.6); margin-bottom: 16px; }
        .msub-model { display: inline-flex; align-self: flex-start; align-items: center; background: rgba(var(--ar),0.08); border: 1px solid rgba(var(--ar),0.2); color: rgba(var(--ar),0.8); font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; margin-bottom: 14px; }
        .msub-statrow { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .msub-statrow.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .msub-stat { background: rgba(var(--ar),0.06); border: 1px solid rgba(var(--ar),0.15); border-radius: 10px; padding: 10px 14px; }
        .msub-stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(var(--ar),0.5); margin-bottom: 3px; }
        .msub-stat-value { font-size: 13px; font-weight: 700; color: #fff; }
        .msub-bestfor { display: inline-flex; align-self: flex-start; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px; }
        .msub-desc { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.65; margin-bottom: 16px; flex: 1; }
        .msub-taglabel { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,0.3); margin-bottom: 8px; }
        .msub-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
        .msub-tag { font-size: 11px; color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 9999px; }
        .msub-grid[data-cols="2"] { grid-template-columns: repeat(2,1fr); }
        .msub-grid[data-cols="3"] { grid-template-columns: repeat(3,1fr); }
        .msub-grid[data-cols="4"] { grid-template-columns: repeat(4,1fr); }
        @media (max-width: 1000px) { .msub-grid[data-cols="4"] { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 860px) { .msub-grid[data-cols="3"] { grid-template-columns: 1fr; } }
        @media (max-width: 720px) { .msub-grid[data-cols="2"] { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .msub-grid { grid-template-columns: 1fr !important; } .msub-h1 { font-size: 36px !important; } }
      ` }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 24px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "msub-crumb", style: { padding: "20px 0 0", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.3)" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/academy", children: "Academy" }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.55)" }, children: "›" }),
        /* @__PURE__ */ jsx(Link, { to: entry.groupPath, children: entry.groupTitle }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.55)" }, children: "›" }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.55)" }, children: entry.breadcrumbLabel })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { padding: "48px 0", borderBottom: "1px solid #1e1e35", marginBottom: entry.warning ? 32 : 48 }, children: [
        /* @__PURE__ */ jsx("div", { style: { display: "inline-flex", alignItems: "center", background: `rgba(${ar},0.1)`, border: `1px solid rgba(${ar},0.25)`, color: ac, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 9999, marginBottom: 20 }, children: entry.catPill }),
        /* @__PURE__ */ jsx("h1", { className: "msub-h1", style: { fontFamily: "'Fraunces', serif", fontSize: 48, lineHeight: 1.05, marginBottom: 16 }, children: entry.title }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 660, marginBottom: 24 }, children: entry.intro }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }, children: entry.stats.map((s, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, color: "rgba(255,255,255,0.4)" }, children: [
            s.hi && /* @__PURE__ */ jsxs("span", { style: { color: ac, fontWeight: 600 }, children: [
              s.hi,
              " "
            ] }),
            s.text
          ] }),
          i < entry.stats.length - 1 && /* @__PURE__ */ jsx("span", { style: { width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)" } })
        ] }, i)) })
      ] }),
      entry.warning && /* @__PURE__ */ jsxs("div", { style: { background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 12, padding: "16px 20px", marginBottom: 40, display: "flex", alignItems: "flex-start", gap: 12 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 18, flexShrink: 0, marginTop: 1 }, children: "⚠️" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }, dangerouslySetInnerHTML: { __html: entry.warning } })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: 24 }, children: entry.itemsLabel }),
      /* @__PURE__ */ jsx("div", { className: "msub-grid", "data-cols": entry.gridCols, children: entry.cards.map((card, i) => /* @__PURE__ */ jsx(Card, { card, variant: entry.variant, statLayout: entry.statLayout }, i)) })
    ] })
  ] });
}
const TIERS = [
  {
    to: "/green-light-engine/tier-1",
    tint: "rgba(64,188,244,0.16)",
    label: "Tier 1",
    title: "Major Streamers",
    desc: "The big leagues. Highest bar — top-tier specs and a distributor required.",
    examples: "Netflix · Amazon Prime · Hulu · Apple TV · Disney+ · Max · Peacock · Paramount+",
    examplesBold: true,
    linkColor: "#40bcf4"
  },
  {
    to: "/green-light-engine/tier-2",
    tint: "rgba(139,92,246,0.16)",
    label: "Tier 2",
    title: "Prestige & Arthouse",
    desc: "Festival-quality, curated homes. The credibility platforms for strong indie work.",
    examples: "MUBI · Criterion · Sundance Now · Shudder · IFC · BFI · Kanopy",
    linkColor: "#8b5cf6"
  },
  {
    to: "/green-light-engine/tier-3",
    tint: "rgba(0,224,84,0.16)",
    label: "Tier 3",
    title: "Open & Accessible",
    desc: "Lowest barrier — start here. Free / AVOD / DIY, many direct submissions.",
    examples: "Hook Cinema · Tubi · Roku · Pluto · Plex · Vimeo · FilmRise",
    linkColor: "#00e054"
  },
  {
    to: "/green-light-engine/niche",
    tint: "rgba(255,128,0,0.16)",
    label: "Niche & Identity",
    title: "Matched to Your Film",
    desc: "Platforms matched to your film's subject and audience.",
    examples: "Black cinema · LGBTQ+ · Horror · Documentary · Shorts",
    linkColor: "#ff8000"
  }
];
function GreenLightEngine() {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        background: "#14181c",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      },
      children: [
        /* @__PURE__ */ jsx(
          Seo,
          {
            title: "Green Light Engine — Where to Place Your Indie Film",
            description: "Match your indie film to the right streaming home: Tier 1 majors, curated platforms, low-barrier AVOD/FAST, and identity-driven niche services.",
            canonical: "https://filmmakergenius.com/green-light-engine",
            jsonLd: {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
                { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
                { "@type": "ListItem", position: 3, name: "Green Light Engine", item: "https://filmmakergenius.com/green-light-engine" }
              ]
            }
          }
        ),
        /* @__PURE__ */ jsxs(
          "nav",
          {
            style: {
              maxWidth: 1100,
              margin: "0 auto",
              padding: "18px 22px 0",
              fontSize: 13,
              color: "#678"
            },
            children: [
              /* @__PURE__ */ jsx(Link, { to: "/academy", style: { color: "#9ab1c2", textDecoration: "none" }, children: "Academy" }),
              /* @__PURE__ */ jsx("span", { style: { color: "#456" }, children: " › " }),
              /* @__PURE__ */ jsx("span", { children: "Green Light Engine" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "main",
          {
            style: {
              maxWidth: 1100,
              margin: "0 auto",
              padding: "40px 22px 60px",
              textAlign: "center"
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#00e054"
                  },
                  children: "Green Light Engine"
                }
              ),
              /* @__PURE__ */ jsx("h1", { style: { fontSize: 34, margin: "12px 0 10px" }, children: "Where can your film go?" }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  style: {
                    color: "#9ab1c2",
                    fontSize: 16,
                    maxWidth: 620,
                    margin: "0 auto 40px",
                    lineHeight: 1.6
                  },
                  children: "Pick a tier to see the platforms your film could reach — then we walk you through exactly how to get there."
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "gle-grid-square",
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 300px)",
                    gridAutoRows: "1fr",
                    justifyContent: "center",
                    alignItems: "stretch",
                    gap: 18,
                    textAlign: "left"
                  },
                  children: TIERS.map((t) => /* @__PURE__ */ jsxs(
                    Link,
                    {
                      to: t.to,
                      className: "gle-tile",
                      style: {
                        background: "#1c2228",
                        border: "1px solid #2c3440",
                        borderRadius: 14,
                        padding: "20px 18px",
                        display: "block",
                        textDecoration: "none",
                        color: "inherit",
                        transition: "border-color 0.15s ease"
                      },
                      children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              width: 46,
                              height: 46,
                              borderRadius: 11,
                              background: t.tint,
                              marginBottom: 12
                            }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              fontSize: 11,
                              fontWeight: 800,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#678",
                              marginBottom: 4
                            },
                            children: t.label
                          }
                        ),
                        /* @__PURE__ */ jsx("h2", { style: { fontSize: 16, margin: 0, marginBottom: 6 }, children: t.title }),
                        /* @__PURE__ */ jsx(
                          "p",
                          {
                            style: {
                              color: "#9ab1c2",
                              fontSize: 12.5,
                              lineHeight: 1.55,
                              margin: 0,
                              marginBottom: 10
                            },
                            children: t.desc
                          }
                        ),
                        /* @__PURE__ */ jsxs(
                          "p",
                          {
                            style: {
                              color: "#678",
                              fontSize: 12,
                              lineHeight: 1.5,
                              margin: 0,
                              marginBottom: 12
                            },
                            children: [
                              "Examples:",
                              " ",
                              /* @__PURE__ */ jsx("span", { style: { color: "#9ab1c2", fontWeight: t.examplesBold ? 700 : 400 }, children: t.examples })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              fontSize: 13,
                              fontWeight: 800,
                              color: t.linkColor
                            },
                            children: "See options →"
                          }
                        )
                      ]
                    },
                    t.to
                  ))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
        .gle-tile:hover { border-color: #678 !important; }
        @media (max-width: 620px) { .gle-grid-square { grid-template-columns: 1fr !important; justify-content: stretch !important; } }
      ` })
      ]
    }
  );
}
const ORANGE = "#ff8000";
const tiles = [
  { title: "Black Cinema", desc: "Platforms built for Black film and the African diaspora.", examples: "KweliTV · ALLBLK · Brown Sugar · AfroLandTV · Maverick Black Cinema…", to: "/green-light-engine/niche/black-cinema" },
  { title: "LGBTQ+", desc: "Queer-focused streaming homes for LGBTQ+ stories.", examples: "Revry · Dekkoo · OUTtv · GagaOOLala · Here TV · Lesflicks…", to: "/green-light-engine/niche/lgbtq" },
  { title: "Horror & Cult", desc: "Genre, horror, and cult specialists with built-in fanbases.", examples: "Shudder · Screambox · Midnight Pulp · Arrow Player · Full Moon…", to: "/green-light-engine/niche/horror-cult" },
  { title: "Documentary", desc: "Platforms dedicated to nonfiction and factual film.", examples: "CuriosityStream · MagellanTV · DocuBay · Documentary+ · Docsville…", to: "/green-light-engine/niche/documentary" },
  { title: "International", desc: "Regional and world-cinema platforms by country and culture.", examples: "FilmDoo · Takflix · Shasha · AsianCrush · Hoichoi · Klassiki…", to: "/green-light-engine/niche/international" },
  { title: "Shorts & Experimental", desc: "Homes for short films and experimental / art work.", examples: "Short of the Week · Omeleto · Film Shortage · Nowness · ShortVerse…", to: "/green-light-engine/niche/shorts-experimental" }
];
function GleNiche() {
  return /* @__PURE__ */ jsxs("div", { style: { background: "#14181c", color: "#fff", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Niche & Identity Streaming Platforms — Green Light Engine",
        description: "Find the right identity- and genre-driven streaming home for your indie film: Black cinema, LGBTQ+, horror, documentary, international, and shorts platforms.",
        canonical: "https://filmmakergenius.com/green-light-engine/niche",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
            { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
            { "@type": "ListItem", position: 3, name: "Green Light Engine", item: "https://filmmakergenius.com/green-light-engine" },
            { "@type": "ListItem", position: 4, name: "Niche & Identity", item: "https://filmmakergenius.com/green-light-engine/niche" }
          ]
        }
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .gle-back:hover { border-color: ${ORANGE} !important; color: ${ORANGE} !important; }
        .niche-tile { transition: border-color .15s ease; }
        .niche-tile:hover { border-color: #678 !important; }
        @media (max-width: 760px) { .niche-grid { grid-template-columns: 1fr !important; } }
      ` }),
    /* @__PURE__ */ jsxs("main", { style: { maxWidth: 1100, margin: "0 auto", padding: "40px 22px 60px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/green-light-engine", className: "gle-back", style: { background: "#20272e", border: "1px solid #2c3440", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 9, padding: "10px 16px", textDecoration: "none" }, children: "← Back to Green Light Engine" }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "#678" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/green-light-engine", style: { color: "#9ab1c2", textDecoration: "none" }, children: "Green Light Engine" }),
          /* @__PURE__ */ jsx("span", { style: { color: "#456" }, children: " › " }),
          /* @__PURE__ */ jsx("span", { children: "Niche & Identity" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 34 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE }, children: "Niche & Identity" }),
        /* @__PURE__ */ jsx("h1", { style: { fontSize: 30, margin: "8px 0 10px" }, children: "Matched to your film" }),
        /* @__PURE__ */ jsx("p", { style: { color: "#9ab1c2", fontSize: 15, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }, children: "Some platforms are matched by your film's subject and audience — not just its specs. Pick the category that fits your film, then we'll show you the platforms inside it." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "niche-grid", style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, textAlign: "left" }, children: tiles.map((t) => /* @__PURE__ */ jsxs(Link, { to: t.to, className: "niche-tile", style: { background: "#1c2228", border: "1px solid #2c3440", borderRadius: 14, padding: "26px 24px", display: "block", textDecoration: "none", color: "#fff" }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 48, height: 48, borderRadius: 12, marginBottom: 16, background: "rgba(255,128,0,0.16)" } }),
        /* @__PURE__ */ jsx("h2", { style: { fontSize: 19, marginBottom: 9 }, children: t.title }),
        /* @__PURE__ */ jsx("p", { style: { color: "#9ab1c2", fontSize: 13.5, lineHeight: 1.6, marginBottom: 14 }, children: t.desc }),
        /* @__PURE__ */ jsx("div", { style: { color: "#678", fontSize: 12.5, lineHeight: 1.5, marginBottom: 16 }, children: t.examples }),
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, fontSize: 13.5, color: ORANGE }, children: "See platforms →" })
      ] }, t.to)) })
    ] })
  ] });
}
const gleNiche = {
  "black-cinema": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/black-cinema",
    title: "Black Cinema",
    sub: "Platforms built for Black film and the African diaspora. Pick one to see exactly how to get your film in — green tags mean direct submissions are accepted.",
    platforms: [
      { logoText: "K", logoBg: "#e0233a", pill: "Direct submissions", name: "KweliTV", desc: "SVOD for Black indie films, docs, web series & kids. Curated review for cultural fit." },
      { logoText: "A", logoBg: "#111", logoBorder: "#555", name: "ALLBLK", desc: "Premium SVOD (AMC Networks) — films, series, stage plays. Via distributor or agent." },
      { logoText: "BS", logoBg: "#7a3b12", name: "Brown Sugar", desc: '"Netflix of Blaxploitation" — classic Black cinema (Bounce/Scripps). Licensed via rights holders.' },
      { logoText: "Af", logoBg: "#0f8a4f", name: "AfroLandTV", desc: "SVOD/AVOD for African & diaspora stories. Via distributor, festival, or curator outreach." },
      { logoText: "Mv", logoBg: "#d4233a", pill: "Direct submissions", name: "Maverick Black Cinema", desc: "FAST/AVOD Black indie features (Tubi/Peacock/Roku). Direct w/ release form; 70–120 min." },
      { logoText: "B&S", logoBg: "#222", logoBorder: "#555", name: "Black&Sexy TV", desc: "Content studio distributing via BET+, Starz, Amazon. Via partnership/co-production." }
    ]
  },
  "lgbtq": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/lgbtq",
    title: "LGBTQ+",
    sub: "Queer-focused streaming homes for LGBTQ+ stories. Pick one to see exactly how to get in — green tags mean direct submissions are accepted.",
    platforms: [
      { logoText: "Rv", logoBg: "#ff2d78", pill: "Direct submissions", name: "Revry", desc: "FAST/AVOD — LGBTQ+ films, series, music, podcasts. 130+ countries. Submit via online form." },
      { logoText: "Dk", logoBg: "#1f6feb", pill: "Direct submissions", name: "Dekkoo", desc: "SVOD for gay male stories — films, shorts, series. Direct via contests/acquisitions." },
      { logoText: "Go", logoBg: "#7b2ff7", pill: "Direct submissions", name: "GagaOOLala", desc: "Asia's first LGBTQ+ SVOD, global reach. Direct via GOL Studios (EN/ZH subs)." },
      { logoText: "Ou", logoBg: "#e0233a", pill: "Direct submissions", name: "OUTtv", desc: "Curated LGBTQ+ SVOD (Canada) + FAST. Direct — queer-led docs & series." },
      { logoText: "Lf", logoBg: "#d63384", pill: "Direct submissions", name: "Lesflicks", desc: "Global SVOD/TVOD for lesbian/WLW stories. Direct via website; standard deliverables." },
      { logoText: "Tf", logoBg: "#b5179e", pill: "Direct submissions", name: "TelloFilms", desc: "SVOD for queer women — web series & indie films. Direct via email/site." },
      { logoText: "Hr", logoBg: "#222", logoBorder: "#555", name: "Here TV", desc: "Longest-running LGBTQ+ premium (SVOD/TVOD). Usually via distributor; direct pitches possible." },
      { logoText: "Pc", logoBg: "#5a2ed6", name: "PeccadilloPOD", desc: "UK LGBTQ+ & world-cinema SVOD. No public form — via Peccadillo distribution." },
      { logoText: "WW", logoBg: "#ff7a00", logoColor: "#0b0f12", name: "WOW Presents Plus", desc: "World of Wonder (Drag Race). No open portal — WOW productions / distributor ties." },
      { logoText: "Gb", logoBg: "#2a9d8f", logoColor: "#0b0f12", name: "GayBingeTV", desc: "LGBTQ+ films, shorts & series SVOD. Via distributor or direct contact." },
      { logoText: "Fl", logoBg: "#444", logoBorder: "#666", name: "Fearless", desc: "LGBTQ+/diverse films, web series, shorts. Curated partnerships / outreach." }
    ]
  },
  "horror-cult": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/horror-cult",
    title: "Horror & Cult",
    sub: "Genre, horror, and cult specialists with built-in fanbases. Pick one to see how to get in — green tags mean direct submissions are accepted.",
    platforms: [
      { logoText: "Sh", logoBg: "#8b0000", pill: "Direct submissions", name: "Shudder", desc: "AMC's horror SVOD. Pitch the acquisitions team directly; also scouts festivals and co-produces." },
      { logoText: "Sc", logoBg: "#b30000", name: "Screambox", desc: "Cineverse horror (slashers, docs, originals). Via Terror Films, Midnight Releasing, or Cineverse." },
      { logoText: "Mp", logoBg: "#6a0d0d", name: "Midnight Pulp", desc: "Cult & horror (Cineverse) SVOD/AVOD/FAST. Via distributors (Arrow, Severin) or Cineverse." },
      { logoText: "Ar", logoBg: "#111", logoBorder: "#c0392b", name: "Arrow Player", desc: "Boutique Arrow Films — cult, horror, exploitation. Via Arrow acquisitions / sales agents." },
      { logoText: "Kc", logoBg: "#7a1f1f", name: "Kino Cult", desc: "Free AVOD from Kino Lorber — cult/horror/underground. Secure Kino Lorber distribution first." },
      { logoText: "Fm", logoBg: "#4b0082", pill: "Direct submissions", name: "Full Moon Features", desc: "Charles Band's B-movie/cult SVOD/AVOD. Grassroots-friendly — accepts direct submissions." },
      { logoText: "Nf", logoBg: "#1a1a2e", logoBorder: "#555", name: "Night Flight Plus", desc: "Cult, underground & counterculture SVOD/AVOD. Direct outreach aligned with the brand." }
    ]
  },
  "documentary": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/documentary",
    title: "Documentary",
    sub: "Platforms dedicated to nonfiction and factual film. These are largely curated — most reach the platform through a distributor, sales agent, or festival pipeline. Pick one to see the path.",
    platforms: [
      { logoText: "Cs", logoBg: "#1aa3ff", name: "CuriosityStream", desc: "SVOD — science, history, nature, tech. Via distributor or production partner (no direct)." },
      { logoText: "Mg", logoBg: "#0f5fa6", name: "MagellanTV", desc: "SVOD docs — history, science, true crime, nature. Via distributor/agent." },
      { logoText: "Db", logoBg: "#e0233a", name: "DocuBay", desc: "Global SVOD docs (India-based). Fully curated — licensed via distributors." },
      { logoText: "D+", logoBg: "#111", logoBorder: "#555", name: "Documentary+", desc: "Free AVOD (XTR / Village Roadshow). Curated via distributors & festivals." },
      { logoText: "Dv", logoBg: "#2a7f62", name: "Docsville", desc: "Socially engaged docs (ex-BBC Storyville). Via distributors, agents, festivals; curator pitch." },
      { logoText: "Gd", logoBg: "#5a2ed6", name: "GuideDoc", desc: "Curated festival-quality docs (Barcelona). Needs representation; also acts as a distributor." },
      { logoText: "Dc", logoBg: "#c0392b", name: "Docurama", desc: "Cineverse FAST/AVOD docs (Roku, Tubi, Prime…). Via Cineverse / partner aggregators." },
      { logoText: "Ae", logoBg: "#222", logoBorder: "#666", name: "Aeon Video", desc: "Short docs & essays on ideas, culture, science. Editorially selected; indie pitch possible." }
    ]
  },
  "international": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/international",
    title: "International",
    sub: "Regional and world-cinema platforms, matched by country and culture. Pick one to see the path in — green tags mean direct submissions are accepted.",
    platforms: [
      { logoText: "Fd", logoBg: "#2a7de1", pill: "Direct", name: "FilmDoo", desc: "International & indie/world cinema (TVOD). Direct submissions, no aggregator. (Not in US.)" },
      { logoText: "Tk", logoBg: "#0057b7", name: "Takflix", desc: "Ukrainian cinema (TVOD), 50% to filmmakers. Best fit: Ukrainian or culturally tied work." },
      { logoText: "Om", logoBg: "#d52b1e", name: "Ondamedia", desc: "Chilean cultural cinema, free (Ministry of Culture). Chilean / culturally aligned works." },
      { logoText: "Tn", logoBg: "#111", logoBorder: "#555", name: "Tënk", desc: "Auteur documentaries (SVOD/coop). No open call — inquire directly; festival-level work." },
      { logoText: "Fq", logoBg: "#5a2ed6", name: "Filmatique", desc: "Arthouse/experimental SVOD (Kino Lorber). Via distributors, festivals, curated programs." },
      { logoText: "Ss", logoBg: "#138d75", logoColor: "#0b0f12", pill: "Direct", name: "Shasha", desc: "SWANA cinema SVOD. Accepts direct indie submissions; subtitles + festival-ready assets." },
      { logoText: "Ac", logoBg: "#e84393", name: "AsianCrush", desc: "Asian film/TV (Cineverse). Via aggregators or distributors (DMR) — no direct." },
      { logoText: "Hc", logoBg: "#c0392b", name: "Hoichoi", desc: "Bengali SVOD (SVF). No open call — pitch via business channels with a deck." },
      { logoText: "An", logoBg: "#8e44ad", name: "Angkor DC", desc: "Cambodia's national OTT (TVOD). Direct outreach / partnerships; standard deliverables." },
      { logoText: "Kl", logoBg: "#b23b6e", name: "Klassiki", desc: "Russia, Caucasus & Central Asia cinema. No open form — approach directly; pro masters." }
    ]
  },
  "shorts-experimental": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/shorts-experimental",
    title: "Shorts & Experimental",
    sub: "Homes for short films and experimental / art work. Great news — most of these accept films directly. Green tags mean direct submissions are open.",
    platforms: [
      { logoText: "SW", logoBg: "#111", logoBorder: "#777", pill: "Direct submissions", name: "Short of the Week", desc: "Curated standout indie shorts, watched by fans + industry scouts. Direct, no fee — exposure-only." },
      { logoText: "FS", logoBg: "#e0233a", pill: "Direct submissions", name: "Film Shortage", desc: "Curated discovery for the best indie shorts. Direct submissions, no fees — visibility & credibility." },
      { logoText: "Om", logoBg: "#ff0000", pill: "Direct submissions", name: "Omeleto", desc: "Huge YouTube short-film channel (millions of subs). Direct submissions — exposure (ad-rev kept by Omeleto)." },
      { logoText: "Nw", logoBg: "#000", logoBorder: "#555", pill: "Direct submissions", name: "Nowness", desc: "High-prestige art/fashion/experimental shorts. Direct but highly selective — cultural prestige." },
      { logoText: "Na", logoBg: "#222", logoBorder: "#555", pill: "Direct submissions", name: "Nowness Asia", desc: "Regional Nowness — art & experimental shorts across Asia. Direct, very selective." },
      { logoText: "Bo", logoBg: "#1aa3ff", pill: "Direct submissions", name: "Booooooom TV", desc: "Shorts, music videos, animation & experimental (Booooooom art community). Direct via portal." },
      { logoText: "Sv", logoBg: "#6a4cf0", pill: "Direct submissions", name: "ShortVerse", desc: "Short-film hub focused on discoverability & audience connection. Direct submissions." }
    ]
  }
};
function GleNichePage() {
  const { slug } = useParams();
  const location = useLocation();
  const canonical = `https://filmmakergenius.com${location.pathname.replace(/\/$/, "")}`;
  const data = slug ? gleNiche[slug] : void 0;
  if (!data) {
    return /* @__PURE__ */ jsxs("div", { style: { background: "#14181c", minHeight: "60vh", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif", padding: "80px 20px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("h1", { style: { fontSize: 28, marginBottom: 14 }, children: "Coming soon" }),
      /* @__PURE__ */ jsx("p", { style: { color: "#9ab1c2", marginBottom: 22 }, children: "This niche detail is on the way." }),
      /* @__PURE__ */ jsx(Link, { to: "/green-light-engine/niche", style: { background: "#20272e", border: "1px solid #2c3440", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 9, padding: "10px 16px", textDecoration: "none" }, children: "← Back to Niche" })
    ] });
  }
  const accent = "#ff8000";
  const { title, sub, platforms } = data;
  return /* @__PURE__ */ jsxs("div", { style: { background: "#14181c", color: "#fff", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${title} — Niche Streaming Platforms | Filmmaker Genius`,
        description: sub,
        canonical,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
            { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
            { "@type": "ListItem", position: 3, name: "Green Light Engine", item: "https://filmmakergenius.com/green-light-engine" },
            { "@type": "ListItem", position: 4, name: "Niche & Identity", item: "https://filmmakergenius.com/green-light-engine/niche" },
            { "@type": "ListItem", position: 5, name: title, item: canonical }
          ]
        }
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .gle-back:hover { border-color: ${accent} !important; color: ${accent} !important; }
        .gle-card { transition: border-color .15s ease, transform .15s ease; }
        .gle-card:hover { border-color: #678 !important; }
        @media (max-width: 900px) { .gle-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px) { .gle-grid { grid-template-columns: 1fr !important; } .gle-card-desc { min-height: 0 !important; } }
      ` }),
    /* @__PURE__ */ jsxs("main", { style: { maxWidth: 1100, margin: "0 auto", padding: "40px 22px 60px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/green-light-engine/niche", className: "gle-back", style: { background: "#20272e", border: "1px solid #2c3440", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 9, padding: "10px 16px", textDecoration: "none" }, children: "← Back to Niche" }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "#678" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/green-light-engine", style: { color: "#9ab1c2", textDecoration: "none" }, children: "Green Light Engine" }),
          /* @__PURE__ */ jsx("span", { style: { color: "#456" }, children: " › " }),
          /* @__PURE__ */ jsx(Link, { to: "/green-light-engine/niche", style: { color: "#9ab1c2", textDecoration: "none" }, children: "Niche & Identity" }),
          /* @__PURE__ */ jsx("span", { style: { color: "#456" }, children: " › " }),
          /* @__PURE__ */ jsx("span", { children: title })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 34 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: accent }, children: "Niche & Identity" }),
        /* @__PURE__ */ jsx("h1", { style: { fontSize: 30, margin: "8px 0 10px" }, children: title }),
        /* @__PURE__ */ jsx("p", { style: { color: "#9ab1c2", fontSize: 15, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }, children: sub })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "gle-grid", style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }, children: platforms.map((p, i) => /* @__PURE__ */ jsxs("a", { href: "#", className: "gle-card", style: { background: "#1c2228", border: "1px solid #2c3440", borderRadius: 14, padding: "20px 18px", display: "block", textDecoration: "none", color: "#fff" }, children: [
        p.pill && /* @__PURE__ */ jsx("div", { style: { display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(0,224,84,0.16)", color: "#00e054", padding: "3px 8px", borderRadius: 6, marginBottom: 8 }, children: p.pill }),
        /* @__PURE__ */ jsx("div", { style: { width: 46, height: 46, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, marginBottom: 14, background: p.logoBg, color: p.logoColor || "#fff", border: p.logoBorder ? `1px solid ${p.logoBorder}` : void 0 }, children: p.logoText }),
        /* @__PURE__ */ jsx("h2", { style: { fontSize: 16, marginBottom: 7 }, children: p.name }),
        /* @__PURE__ */ jsx("p", { className: "gle-card-desc", style: { color: "#9ab1c2", fontSize: 12.5, lineHeight: 1.55, marginBottom: 14, minHeight: 54 }, children: p.desc }),
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, fontSize: 13, color: accent }, children: "Start →" })
      ] }, i)) })
    ] })
  ] });
}
const gleTiers = {
  "tier-1": {
    accent: "#40bcf4",
    canonical: "https://filmmakergenius.com/greenlight-engine/major-streamers",
    label: "Tier 1",
    title: "Major Streamers",
    sub: "The biggest global platforms. Highest technical bar and a distributor required — pick one to see exactly what it takes.",
    platforms: [
      { logoText: "N", logoBg: "#e50914", name: "Netflix", desc: "Direct licensing only. Top specs — 4K, IMF, Dolby Atmos, approved cameras. Needs a distributor." },
      { logoText: "a", logoBg: "#00a8e1", name: "Amazon Prime Video", desc: "SVOD + rent/buy. Reachable via aggregator or distributor. Huge global reach." },
      { logoText: "h", logoBg: "#1ce783", logoColor: "#0b0f12", name: "Hulu", desc: "SVOD / AVOD (US). Indie access through a distributor." },
      { logoText: "", logoBg: "#333", logoBorder: "#555", name: "Apple TV / iTunes", desc: "Rent/buy (TVOD). Reached via aggregators like Bitmax or Quiver." },
      { logoText: "D", logoBg: "#113ccf", name: "Disney+", desc: "Studio-owned. Effectively closed to indies — included for completeness." },
      { logoText: "M", logoBg: "#7b2ff7", name: "Max", desc: "SVOD (Warner/HBO). Indie access through a distributor." },
      { logoText: "P", logoBg: "#000", logoBorder: "#555", name: "Peacock", desc: "SVOD / AVOD (NBCUniversal). Via a distributor." },
      { logoText: "P+", logoBg: "#0064ff", name: "Paramount+", desc: "SVOD. Via a distributor; FAST ties to Pluto TV." }
    ]
  },
  "tier-2": {
    accent: "#8b5cf6",
    canonical: "https://filmmakergenius.com/greenlight-engine/prestige-arthouse",
    label: "Tier 2",
    title: "Prestige & Arthouse",
    sub: "Curated, festival-quality homes. Most need a festival pedigree or a distributor — the credibility platforms. Pick one to see what it takes.",
    platforms: [
      { logoText: "M", logoBg: "#000", logoBorder: "#555", name: "MUBI", desc: "Curated arthouse/festival. Via festival, distributor, or sales agent." },
      { logoText: "C", logoBg: "#111", logoBorder: "#777", name: "Criterion Channel", desc: "Ultra-prestige classics & arthouse. Distributor only — nearly impossible direct." },
      { logoText: "S", logoBg: "#e0b13a", logoColor: "#0b0f12", name: "Sundance Now", desc: "Festival winners, docs, acclaimed indies. Via distributor." },
      { logoText: "B", logoBg: "#d4233a", name: "BFI Player", desc: "UK arthouse. Acquired via distributors and festivals." },
      { logoText: "Cz", logoBg: "#222", logoBorder: "#555", name: "Curzon Home Cinema", desc: "UK curated arthouse/festival. Distributor required." },
      { logoText: "Mg", logoBg: "#3a6df0", name: "Magnolia Selects", desc: "Curated indie/arthouse. Via distributor." },
      { logoText: "FM", logoBg: "#7b2ff7", name: "Film Movement Plus", desc: "World, indie & arthouse cinema. Via distributor." },
      { logoText: "O", logoBg: "#1aa3ff", name: "Ovid.tv", desc: "Arthouse & documentary (US/Canada). Partner distributors." },
      { logoText: "U", logoBg: "#e85d2a", name: "UniversCiné", desc: "European indie & arthouse. Distributor required." },
      { logoText: "LC", logoBg: "#444", logoBorder: "#666", name: "LaCinetek", desc: "Classics curated by filmmakers. Via distributor." },
      { logoText: "K", logoBg: "#b23b6e", name: "Klassiki", desc: "Russia / Caucasus / Central Asia cinema. Direct inquiry; pro masters." },
      { logoText: "Le", logoBg: "#2a2a2a", logoBorder: "#555", name: "Le Cinéma Club", desc: "Free, one curated film weekly. Curated / invite only." },
      { logoText: "IFC", logoBg: "#c0392b", name: "IFC Films Unlimited", desc: "IFC / Sundance Selects / IFC Midnight catalog. Via IFC acquisition." },
      { logoText: "F", logoBg: "#0f8a6a", name: "Fandor", desc: "Indie & arthouse (Cineverse). Selective pitch." },
      { logoText: "Kn", logoBg: "#6a4cf0", name: "Kanopy", desc: "Library / university (educational). Via distributor (e.g. Giant Pictures)." },
      { logoText: "Sh", logoBg: "#8b0000", name: "Shudder", desc: "Prestige horror/genre. Accepts direct pitches + scouts festivals." }
    ]
  },
  "tier-3": {
    accent: "#00e054",
    canonical: "https://filmmakergenius.com/greenlight-engine/open-accessible",
    label: "Tier 3",
    title: "Open & Accessible",
    sub: "The lowest barrier — where most films realistically start. Free / AVOD / FAST and DIY, reachable directly or through a low-cost aggregator. Many accept direct submissions.",
    platforms: [
      { logoText: "H", logoBg: "#00e054", logoColor: "#0b0f12", name: "Hook Cinema", desc: "Upload direct, retain full rights, 50/50 ad split, crowdfund — start here in minutes.", pill: "Partner platform" },
      { logoText: "T", logoBg: "#7d2ae8", name: "Tubi", desc: "Free AVOD/FAST, huge reach. Via aggregator (Filmhub) or distributor." },
      { logoText: "R", logoBg: "#662d91", name: "The Roku Channel", desc: "AVOD/FAST. Via Filmhub or a distributor." },
      { logoText: "Pl", logoBg: "#0b1f3a", logoBorder: "#2a4a7a", name: "Pluto TV", desc: "FAST/AVOD channels. Via aggregator or distributor." },
      { logoText: "Px", logoBg: "#e5a00d", logoColor: "#0b0f12", name: "Plex", desc: "AVOD/FAST. Via a distributor (Indie Rights, Giant Pictures)." },
      { logoText: "Cr", logoBg: "#ff6a00", name: "Crackle", desc: "Free AVOD. Via aggregator (Bitmax, Premiere Digital)." },
      { logoText: "Po", logoBg: "#d4233a", name: "Popcornflix", desc: "AVOD (Screen Media). Via aggregator/partner." },
      { logoText: "Fa", logoBg: "#00b3a4", logoColor: "#0b0f12", name: "Fawesome", desc: "Free AVOD/FAST. Via Filmhub." },
      { logoText: "Sm", logoBg: "#1428a0", name: "Samsung TV Plus", desc: "FAST, built into Samsung TVs. Via Filmhub." },
      { logoText: "LG", logoBg: "#a50034", name: "LG Channels", desc: "FAST, built into LG TVs. Via Filmhub." },
      { logoText: "Vz", logoBg: "#111", logoBorder: "#555", name: "Vizio WatchFree+", desc: "FAST on Vizio TVs. Via Filmhub." },
      { logoText: "Ln", logoBg: "#2f6fed", name: "Local Now", desc: "AVOD/FAST. Via Filmhub." },
      { logoText: "Ds", logoBg: "#0aa14f", name: "DistroTV", desc: "Free AVOD/FAST. Via Filmhub." },
      { logoText: "St", logoBg: "#e23b2e", name: "STIRR", desc: "Free live + on-demand. Via aggregator." },
      { logoText: "Xu", logoBg: "#5a2ed6", name: "Xumo Play", desc: "AVOD/FAST (Comcast). Via Filmhub." },
      { logoText: "Vu", logoBg: "#3b5bdb", name: "Vudu / Fandango at Home", desc: "Rent/buy (TVOD) + AVOD. Via aggregator (Bitmax, Quiver)." },
      { logoText: "Fr", logoBg: "#d12d2d", name: "FilmRise", desc: "AVOD/FAST. Acquires content directly." },
      { logoText: "Vo", logoBg: "#17d4fe", logoColor: "#0b0f12", name: "Vimeo On Demand", desc: "DIY direct-to-fan rent/buy — upload it yourself, keep most revenue." },
      { logoText: "Ip", logoBg: "#6a4cf0", name: "IndiePix Unlimited", desc: "Indie SVOD. Accepts direct submissions." },
      { logoText: "eo", logoBg: "#0f8a6a", name: "eoFlix", desc: "Indie streaming + community. Upload direct." },
      { logoText: "Rg", logoBg: "#2a9d8f", name: "Reelgood", desc: "Discovery/listing — self-list to boost findability." }
    ]
  }
};
function GleTier() {
  const { tier } = useParams();
  const location = useLocation();
  const canonical = `https://filmmakergenius.com${location.pathname.replace(/\/$/, "")}`;
  const data = tier ? gleTiers[tier] : void 0;
  if (!data) {
    return /* @__PURE__ */ jsxs("div", { style: { background: "#14181c", minHeight: "60vh", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif", padding: "80px 20px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("h1", { style: { fontSize: 28, marginBottom: 14 }, children: "Coming soon" }),
      /* @__PURE__ */ jsx("p", { style: { color: "#9ab1c2", marginBottom: 22 }, children: "This tier detail is on the way." }),
      /* @__PURE__ */ jsx(Link, { to: "/green-light-engine", style: { background: "#20272e", border: "1px solid #2c3440", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 9, padding: "10px 16px", textDecoration: "none" }, children: "← Back to Green Light Engine" })
    ] });
  }
  const { accent, label, title, sub, platforms } = data;
  return /* @__PURE__ */ jsxs("div", { style: { background: "#14181c", color: "#fff", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${title} — Green Light Engine | Filmmaker Genius`,
        description: sub,
        canonical,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
            { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
            { "@type": "ListItem", position: 3, name: "Green Light Engine", item: "https://filmmakergenius.com/green-light-engine" },
            { "@type": "ListItem", position: 4, name: title, item: canonical }
          ]
        }
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .gle-back:hover { border-color: ${accent} !important; color: ${accent} !important; }
        .gle-card { transition: border-color .15s ease, transform .15s ease; }
        .gle-card:hover { border-color: #678 !important; }
        @media (max-width: 900px) { .gle-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px) { .gle-grid { grid-template-columns: 1fr !important; } .gle-card-desc { min-height: 0 !important; } }
      ` }),
    /* @__PURE__ */ jsxs("main", { style: { maxWidth: 1100, margin: "0 auto", padding: "40px 22px 60px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/green-light-engine", className: "gle-back", style: { background: "#20272e", border: "1px solid #2c3440", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 9, padding: "10px 16px", textDecoration: "none" }, children: "← Back to Green Light Engine" }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "#678" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/green-light-engine", style: { color: "#9ab1c2", textDecoration: "none" }, children: "Green Light Engine" }),
          /* @__PURE__ */ jsx("span", { style: { color: "#456" }, children: " › " }),
          /* @__PURE__ */ jsx("span", { children: title })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 34 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: accent }, children: label }),
        /* @__PURE__ */ jsx("h1", { style: { fontSize: 30, margin: "8px 0 10px" }, children: title }),
        /* @__PURE__ */ jsx("p", { style: { color: "#9ab1c2", fontSize: 15, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }, children: sub })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "gle-grid", style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }, children: platforms.map((p, i) => /* @__PURE__ */ jsxs("a", { href: "#", className: "gle-card", style: { background: "#1c2228", border: "1px solid #2c3440", borderRadius: 14, padding: "20px 18px", display: "block", textDecoration: "none", color: "#fff" }, children: [
        p.pill && /* @__PURE__ */ jsx("div", { style: { display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(0,224,84,0.16)", color: "#00e054", padding: "3px 8px", borderRadius: 6, marginBottom: 8 }, children: p.pill }),
        /* @__PURE__ */ jsx("div", { style: { width: 46, height: 46, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, marginBottom: 14, background: p.logoBg, color: p.logoColor || "#fff", border: p.logoBorder ? `1px solid ${p.logoBorder}` : void 0 }, children: p.logoText }),
        /* @__PURE__ */ jsx("h2", { style: { fontSize: 16, marginBottom: 7 }, children: p.name }),
        /* @__PURE__ */ jsx("p", { className: "gle-card-desc", style: { color: "#9ab1c2", fontSize: 12.5, lineHeight: 1.55, marginBottom: 14, minHeight: 54 }, children: p.desc }),
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, fontSize: 13, color: accent }, children: "Start →" })
      ] }, i)) })
    ] })
  ] });
}
const loaders = {
  "adapting-source-material": () => import("./assets/adaptingSource-DONoNWoz.js").then((m) => m.adaptingSource),
  "ai-in-post-production": () => import("./assets/aiPost-Bn-yxKBi.js").then((m) => m.aiPost),
  "ai-script-writing": () => import("./assets/aiScript-C6vBJjSc.js").then((m) => m.aiScript),
  "ai-tools-for-filmmakers": () => import("./assets/aiTools-DK9HJBT8.js").then((m) => m.aiTools),
  "brand-partnerships-for-films": () => import("./assets/brandPartnerships-BFVqnXkp.js").then((m) => m.brandPartnerships),
  "camera-and-lighting-basics": () => import("./assets/cameraLighting-8Pe1lSIV.js").then((m) => m.cameraLighting),
  "casting-for-indie-films": () => import("./assets/casting-BogBX7fi.js").then((m) => m.casting),
  "color-grading-for-film": () => import("./assets/colorGrading-J-67lgqT.js").then((m) => m.colorGrading),
  "copyright-for-filmmakers": () => import("./assets/copyrightIP-BMIjpagH.js").then((m) => m.copyrightIP),
  "costume-design-for-film": () => import("./assets/wardrobe-Ct2OBWFP.js").then((m) => m.wardrobe),
  "directing-actors": () => import("./assets/directingActors-Daq4hzY_.js").then((m) => m.directingActors),
  "directing-non-actors": () => import("./assets/nonActors-B2ALCJgK.js").then((m) => m.nonActors),
  "diy-film-distribution": () => import("./assets/diyDistribution-BjIrIxG8.js").then((m) => m.diyDistribution),
  "documentary-script-writing": () => import("./assets/docWriting-Db8Z3C24.js").then((m) => m.docWriting),
  "drone-cinematography": () => import("./assets/droneCinematography-Xln5sHdg.js").then((m) => m.droneCinematography),
  "film-budgeting-and-scheduling": () => import("./assets/budgetingScheduling-J9vv53wU.js").then((m) => m.budgetingScheduling),
  "film-business-plan": () => import("./assets/businessPlan-BNZagvLl.js").then((m) => m.businessPlan),
  "film-crowdfunding": () => import("./assets/crowdfunding-lEvrbxfN.js").then((m) => m.crowdfunding),
  "film-distribution-contracts": () => import("./assets/distributionContracts-DfYnZCxq.js").then((m) => m.distributionContracts),
  "film-editing-workflow": () => import("./assets/editingWorkflow-B-BIKg1z.js").then((m) => m.editingWorkflow),
  "film-festival-strategy": () => import("./assets/festivalStrategy-DErjwGCz.js").then((m) => m.festivalStrategy),
  "film-location-scouting": () => import("./assets/locationScouting-SH5ZV2Cz.js").then((m) => m.locationScouting),
  "film-markets-explained": () => import("./assets/filmMarkets-CGjDlyZi.js").then((m) => m.filmMarkets),
  "film-permits-and-releases": () => import("./assets/permitsReleases-BjQG0n3I.js").then((m) => m.permitsReleases),
  "film-production-accounting": () => import("./assets/filmAccounting-CoIuv7gq.js").then((m) => m.filmAccounting),
  "film-production-insurance": () => import("./assets/insuranceLegal-co5mCbQI.js").then((m) => m.insuranceLegal),
  "film-script-breakdown": () => import("./assets/scriptBreakdown-C0gI8X4Q.js").then((m) => m.scriptBreakdown),
  "film-set-safety": () => import("./assets/onSetSafety-CkBH_9CU.js").then((m) => m.onSetSafety),
  "grants-for-filmmakers": () => import("./assets/grants-D9wFh5pG.js").then((m) => m.grants),
  "hiring-department-heads": () => import("./assets/departmentHeads-Cvt1Cy72.js").then((m) => m.departmentHeads),
  "how-to-build-an-epk": () => import("./assets/epk-BlN6g7Xw.js").then((m) => m.epk),
  "how-to-film-action-scenes": () => import("./assets/stuntCoordination-CHe0v-qz.js").then((m) => m.stuntCoordination),
  "how-to-find-investors-for-a-film": () => import("./assets/pitchingInvestors-BrGJcg8u.js").then((m) => m.pitchingInvestors),
  "how-to-make-a-dcp": () => import("./assets/dcpDelivery-Dd5ERP_2.js").then((m) => m.dcpDelivery),
  "how-to-make-a-film-trailer": () => import("./assets/filmTrailer-DmXNeHka.js").then((m) => m.filmTrailer),
  "how-to-make-a-film-website": () => import("./assets/filmWebsite-BWjyBwjB.js").then((m) => m.filmWebsite),
  "how-to-pitch-to-streamers": () => import("./assets/pitchingStreamers-BR2zDWua.js").then((m) => m.pitchingStreamers),
  "how-to-produce-a-documentary": () => import("./assets/producingDoc-Z3JkqE5K.js").then((m) => m.producingDoc),
  "how-to-produce-a-short-film": () => import("./assets/producingShort-9K_CEfdT.js").then((m) => m.producingShort),
  "how-to-rewrite-a-screenplay": () => import("./assets/rewrite-7GlXNKxl.js").then((m) => m.rewrite),
  "how-to-start-a-production-company": () => import("./assets/productionCompany-DvSAc5s0.js").then((m) => m.productionCompany),
  "how-to-storyboard-a-film": () => import("./assets/storyboarding-DEjToNVL.js").then((m) => m.storyboarding),
  "how-to-write-a-logline": () => import("./assets/loglinePitch-DDJXV_J7.js").then((m) => m.loglinePitch),
  "how-to-write-a-screenplay": () => import("./assets/screenplay101-CiWjX8-b.js").then((m) => m.screenplay101),
  "how-to-write-a-short-film-script": () => import("./assets/shortFilm-iWSWEj1p.js").then((m) => m.shortFilm),
  "indie-filmmaking-career": () => import("./assets/indieCareer-k0_uiU4N.js").then((m) => m.indieCareer),
  "international-film-sales": () => import("./assets/internationalSales-LAwvA6R_.js").then((m) => m.internationalSales),
  "music-licensing-for-films": () => import("./assets/musicLicensing-CE0CgVtC.js").then((m) => m.musicLicensing),
  "production-design-on-a-budget": () => import("./assets/productionDesign-fwTWJQA6.js").then((m) => m.productionDesign),
  "production-sound-recording": () => import("./assets/soundRecording-DqKJuZy3.js").then((m) => m.soundRecording),
  "sag-aftra-for-filmmakers": () => import("./assets/sagAftra-Ctp_iP0J.js").then((m) => m.sagAftra),
  "screenplay-act-structure": () => import("./assets/storyStructure-ByjjmEz-.js").then((m) => m.storyStructure),
  "shot-list-filmmaking": () => import("./assets/shotList-Cio3Xjh0.js").then((m) => m.shotList),
  "smartphone-filmmaking": () => import("./assets/iphoneFilmmaking-8I3cb27-.js").then((m) => m.iphoneFilmmaking),
  "social-media-marketing-for-films": () => import("./assets/socialMarketing-DxZal5PH.js").then((m) => m.socialMarketing),
  "sound-design-for-film": () => import("./assets/soundDesign-sh3Yhcm8.js").then((m) => m.soundDesign),
  "streaming-revenue-models": () => import("./assets/vodModels--EhOxfnG.js").then((m) => m.vodModels),
  "vfx-on-a-budget": () => import("./assets/vfx-Cfmgoy4H.js").then((m) => m.vfx),
  "virtual-production": () => import("./assets/virtualProduction-DfBGigL9.js").then((m) => m.virtualProduction),
  "what-does-a-film-producer-do": () => import("./assets/producing101-BGoJ65zR.js").then((m) => m.producing101),
  "working-with-a-film-composer": () => import("./assets/composer-vecuDW8J.js").then((m) => m.composer),
  "working-with-child-actors": () => import("./assets/childActors-BEpaSmb6.js").then((m) => m.childActors)
};
const cache = {};
function getCourse(slug) {
  return cache[slug];
}
async function loadCourse(slug) {
  if (cache[slug]) return cache[slug];
  const load = loaders[slug];
  if (!load) return void 0;
  const c = await load();
  cache[slug] = c;
  return c;
}
const courseSlugs = Object.keys(loaders);
const MOSAIC_STYLES = [
  { gridColumn: "1", gridRow: "1 / span 2", background: "linear-gradient(160deg,#071c20 0%,#0b2d35 100%)" },
  { gridColumn: "2", gridRow: "1", background: "linear-gradient(135deg,#050510 0%,#0a1030 100%)" },
  { gridColumn: "3", gridRow: "1", background: "linear-gradient(135deg,#080816 0%,#001a14 100%)" },
  { gridColumn: "4", gridRow: "1 / span 2", background: "linear-gradient(200deg,#0a0818 0%,#141035 100%)" },
  { gridColumn: "2", gridRow: "2", background: "linear-gradient(135deg,#040e18 0%,#0d2030 100%)" },
  { gridColumn: "3", gridRow: "2", background: "linear-gradient(135deg,#060a10 0%,#00180e 100%)" }
];
function CoursePage() {
  const { courseSlug = "" } = useParams();
  const [course, setCourse] = useState(() => getCourse(courseSlug));
  useEffect(() => {
    const cached = getCourse(courseSlug);
    if (cached) {
      if (cached !== course) setCourse(cached);
      return;
    }
    let cancelled = false;
    loadCourse(courseSlug).then((c) => {
      if (!cancelled) setCourse(c);
    });
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);
  const [activeModule, setActiveModule] = useState("all");
  const visibleModules = useMemo(() => {
    if (!course) return [];
    return activeModule === "all" ? course.modules : course.modules.filter((m) => m.key === activeModule);
  }, [course, activeModule]);
  if (!course) {
    return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh", padding: "80px 24px", textAlign: "center", fontFamily: "'Inter Tight', system-ui, sans-serif" }, children: [
      /* @__PURE__ */ jsx("h1", { style: { fontFamily: "'Fraunces', serif", fontSize: 40, marginBottom: 12 }, children: "Course coming soon" }),
      /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,.55)" }, children: "We're still putting this one together. Check back soon." }),
      /* @__PURE__ */ jsx(Link, { to: "/academy/education", style: { color: "#00d4aa", marginTop: 24, display: "inline-block" }, children: "← Back to Education Modules" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: course.seoTitle,
        description: course.seoDesc,
        canonical: `https://filmmakergenius.com/academy/${course.slug}`,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.seoDesc,
            url: `https://filmmakergenius.com/academy/${course.slug}`,
            provider: {
              "@type": "Organization",
              name: "Filmmaker Genius",
              sameAs: "https://filmmakergenius.com"
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "online",
              courseWorkload: course.readTime
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
              { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
              { "@type": "ListItem", position: 3, name: course.title, item: `https://filmmakergenius.com/academy/${course.slug}` }
            ]
          }
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .cp-a:hover { color:#00d4aa !important; }
        .cp-tile:hover { border-color: rgba(0,212,170,.45) !important; transform: translateY(-3px); }
        .cp-tile:hover .cp-roman { color: rgba(0,212,170,.4) !important; }
        .cp-tile:hover .cp-arrow { opacity: 1 !important; }
        .cp-tile { transition: transform .2s ease, border-color .2s ease; }
        .cp-h1 { font-family: 'Fraunces', Georgia, serif; font-size: 52px; line-height: 1.02; margin: 0; }
        .cp-hero { display: grid; grid-template-columns: 1fr 480px; gap: 40px; align-items: center; }
        @media (max-width: 900px) { .cp-hero { grid-template-columns: 1fr; } .cp-mosaic { max-width: 100%; } }
        .cp-info { display: grid; grid-template-columns: 1fr 340px; gap: 32px; margin-bottom: 56px; }
        @media (max-width: 900px) { .cp-info { grid-template-columns: 1fr; } }
        .cp-learn-list { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; }
        @media (max-width: 600px) { .cp-learn-list { grid-template-columns: 1fr; } }
        .cp-chapter-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 860px) { .cp-chapter-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .cp-chapter-grid { grid-template-columns: 1fr; } }
      ` }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "20px 24px 0", fontSize: 13, color: "rgba(255,255,255,.35)" }, children: [
      /* @__PURE__ */ jsx(Link, { to: "/academy", className: "cp-a", style: { color: "rgba(255,255,255,.35)", textDecoration: "none" }, children: "Academy" }),
      /* @__PURE__ */ jsx("span", { style: { margin: "0 8px" }, children: "›" }),
      /* @__PURE__ */ jsx(Link, { to: "/academy/education", className: "cp-a", style: { color: "rgba(255,255,255,.35)", textDecoration: "none" }, children: "Education Modules" }),
      /* @__PURE__ */ jsx("span", { style: { margin: "0 8px" }, children: "›" }),
      /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,.6)" }, children: course.title })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "40px 24px 48px" }, children: /* @__PURE__ */ jsxs("div", { className: "cp-hero", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { style: { display: "inline-block", background: "rgba(0,212,170,.1)", border: "1px solid rgba(0,212,170,.25)", color: "#00d4aa", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999, marginBottom: 20 }, children: course.categoryLabel }),
        /* @__PURE__ */ jsx("h1", { className: "cp-h1", children: course.title }),
        /* @__PURE__ */ jsx("p", { style: { marginTop: 18, fontSize: 17, color: "rgba(255,255,255,.55)", lineHeight: 1.55, maxWidth: 560 }, children: course.subtitle }),
        /* @__PURE__ */ jsxs("div", { style: { marginTop: 22, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,.5)" }, children: [
          /* @__PURE__ */ jsx("span", { children: course.level }),
          /* @__PURE__ */ jsx("span", { style: { width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.3)" } }),
          /* @__PURE__ */ jsx("span", { children: course.chapterCount }),
          /* @__PURE__ */ jsx("span", { style: { width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.3)" } }),
          /* @__PURE__ */ jsx("span", { children: course.readTime }),
          course.pairsWithName && course.pairsWithUrl && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { style: { width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.3)" } }),
            /* @__PURE__ */ jsxs("a", { href: course.pairsWithUrl, target: "_blank", rel: "noreferrer", style: { background: "rgba(0,212,170,.1)", border: "1px solid rgba(0,212,170,.25)", color: "#00d4aa", padding: "4px 12px", borderRadius: 999, textDecoration: "none", fontWeight: 600 }, children: [
              "Pairs with: ",
              course.pairsWithName
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "cp-mosaic",
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "140px 100px",
            gap: 5,
            borderRadius: 16,
            overflow: "hidden",
            maxWidth: 480
          },
          children: course.mosaic.map((text, i) => /* @__PURE__ */ jsxs("div", { style: { position: "relative", ...MOSAIC_STYLES[i] }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  bottom: 10,
                  left: 12,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,.18)",
                  lineHeight: 1.4
                },
                dangerouslySetInnerHTML: { __html: text }
              }
            ),
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: i === 0 ? "rgba(0,212,170,.2)" : "rgba(0,212,170,.08)" } })
          ] }, i))
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { style: { maxWidth: 860, margin: "0 auto 56px", padding: "0 24px" }, children: /* @__PURE__ */ jsx("div", { style: { position: "relative", width: "100%", paddingTop: "56.25%", background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)", border: "1px solid rgba(0,212,170,.2)", borderRadius: 16, overflow: "hidden" }, children: /* @__PURE__ */ jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }, children: [
      /* @__PURE__ */ jsx("div", { style: { width: 64, height: 64, borderRadius: "50%", background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "#00d4aa", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }),
      /* @__PURE__ */ jsx("span", { style: { background: "rgba(0,212,170,.12)", border: "1px solid rgba(0,212,170,.3)", color: "#00d4aa", padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }, children: "Course Video — Coming Soon" }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "rgba(255,255,255,.4)" }, children: "Taught by a working filmmaker · Watch this space" })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 24px" }, children: /* @__PURE__ */ jsxs("div", { className: "cp-info", children: [
      /* @__PURE__ */ jsxs("div", { style: { background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 16, padding: 32 }, children: [
        /* @__PURE__ */ jsx("h2", { style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.3)", margin: "0 0 20px" }, children: "What you'll learn" }),
        /* @__PURE__ */ jsx("div", { className: "cp-learn-list", children: course.learn.map((item, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, alignItems: "flex-start" }, children: [
          /* @__PURE__ */ jsx("span", { style: { flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00d4aa", fontSize: 11, fontWeight: 700, marginTop: 2 }, children: "✓" }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 14, color: "rgba(255,255,255,.78)", lineHeight: 1.55 }, children: item })
        ] }, i)) })
      ] }),
      course.pairsWithName && course.pairsWithUrl && /* @__PURE__ */ jsxs("div", { style: { background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)", border: "1px solid rgba(0,212,170,.2)", borderRadius: 16, padding: 28 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#00d4aa", marginBottom: 8 }, children: "Pairs with this tool" }),
        /* @__PURE__ */ jsx("div", { style: { fontFamily: "'Fraunces', serif", fontSize: 26, marginBottom: 12 }, children: course.pairsWithName }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "rgba(255,255,255,.7)", lineHeight: 1.6, margin: "0 0 18px" }, children: course.pairsWithDesc }),
        /* @__PURE__ */ jsxs("a", { href: course.pairsWithUrl, target: "_blank", rel: "noreferrer", style: { display: "inline-block", background: "#00d4aa", color: "#031418", padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: 13, textDecoration: "none" }, children: [
          "Open ",
          course.pairsWithName,
          " →"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1120, margin: "0 auto", padding: "0 24px 80px" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.3)", margin: "0 0 18px" }, children: "Course chapters" }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }, children: [{ key: "all", label: `All Chapters (${course.chapters.length})` }, ...course.modules.map((m) => ({ key: m.key, label: `${m.label} (${course.chapters.filter((c) => c.moduleKey === m.key).length})` }))].map((t) => {
        const isActive = activeModule === t.key;
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveModule(t.key),
            style: {
              background: isActive ? "rgba(0,212,170,.12)" : "transparent",
              border: `1px solid ${isActive ? "rgba(0,212,170,.5)" : "rgba(255,255,255,.18)"}`,
              color: isActive ? "#00d4aa" : "rgba(255,255,255,.6)",
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit"
            },
            children: t.label
          },
          t.key
        );
      }) }),
      visibleModules.map((mod) => {
        const list = course.chapters.filter((c) => c.moduleKey === mod.key);
        if (list.length === 0) return null;
        return /* @__PURE__ */ jsxs("section", { style: { marginBottom: 40 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }, children: [
            /* @__PURE__ */ jsx("span", { style: { textTransform: "uppercase", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: "rgba(255,255,255,.28)", whiteSpace: "nowrap" }, children: mod.label }),
            /* @__PURE__ */ jsx("span", { style: { flex: 1, height: 1, background: "rgba(255,255,255,.07)" } })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "cp-chapter-grid", children: list.map((ch) => /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/academy/${course.slug}/${ch.slug}`,
              className: "cp-tile",
              style: {
                position: "relative",
                display: "block",
                minHeight: 168,
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 14,
                background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)",
                padding: "18px 20px",
                textDecoration: "none",
                color: "#fff"
              },
              children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" }, children: [
                  /* @__PURE__ */ jsx("span", { className: "cp-roman", style: { fontFamily: "'Fraunces', serif", fontSize: 36, lineHeight: 1, color: "rgba(0,212,170,.2)", transition: "color .2s" }, children: ch.roman }),
                  /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,.25)" }, children: ch.time })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { position: "absolute", left: 20, right: 20, bottom: 18 }, children: [
                  /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,.35)", lineHeight: 1.4, marginBottom: 6 }, children: ch.desc }),
                  /* @__PURE__ */ jsx("div", { style: { fontSize: 15, fontWeight: 700, color: "#fff" }, children: ch.title })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "cp-arrow", style: { position: "absolute", bottom: 16, right: 18, color: "#00d4aa", fontSize: 16, fontWeight: 700, opacity: 0, transition: "opacity .2s" }, children: "→" })
              ]
            },
            ch.slug
          )) })
        ] }, mod.key);
      })
    ] })
  ] });
}
const ARTICLE_CSS = `
.fg-article p { font-size:17px; line-height:1.72; color:rgba(255,255,255,.82); margin-bottom:22px; }
.fg-article h2 { font-family:Fraunces,serif; font-size:28px; line-height:1.15; margin:44px 0 16px; color:#fff; }
.fg-article h3 { font-family:'Inter Tight',sans-serif; font-size:20px; font-weight:700; margin:30px 0 10px; color:#fff; }
.fg-article strong { color:#fff; font-weight:700; }
.fg-article em { color:rgba(255,255,255,.92); }
.fg-article .pullquote { font-family:Fraunces,serif; font-size:25px; line-height:1.35; color:#fff; border-left:3px solid #00d4aa; padding:6px 0 6px 26px; margin:36px 0; font-weight:600; }
.fg-article .callout { background:linear-gradient(135deg,#071820 0%,#0a2a30 100%); border:1px solid rgba(0,212,170,.2); border-radius:14px; padding:24px 26px; margin:34px 0; }
.fg-article .callout-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#00d4aa; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
.fg-article .callout p { font-size:15px; line-height:1.65; color:rgba(255,255,255,.75); margin:0; }
.fg-article .spec-list { list-style:none; margin:8px 0 22px; padding:0; }
.fg-article .spec-list li { position:relative; padding:10px 0 10px 30px; border-bottom:1px solid #16161f; font-size:16px; color:rgba(255,255,255,.8); line-height:1.55; }
.fg-article .spec-list li:last-child { border-bottom:none; }
.fg-article .spec-list li::before { content:''; position:absolute; left:4px; top:17px; width:8px; height:8px; border-radius:2px; background:#00d4aa; }
.fg-article .spec-list li b { color:#fff; }
.fg-article a.inline { color:#00d4aa; border-bottom:1px solid rgba(0,212,170,.4); }
.fg-article .beat-list { list-style: none; margin: 8px 0 22px; padding: 0; counter-reset: beat; }
.fg-article .beat-list li { position: relative; padding: 11px 0 11px 44px; border-bottom: 1px solid #16161f; font-size: 15.5px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .beat-list li:last-child { border-bottom: none; }
.fg-article .beat-list li::before { counter-increment: beat; content: counter(beat); position: absolute; left: 0; top: 10px; width: 26px; height: 26px; border-radius: 7px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); color: #00d4aa; font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.fg-article .beat-list li b { color: #fff; }
.fg-article .beat-list li .pg { color: rgba(0,212,170,.7); font-weight: 700; font-size: 13px; }
.cc-nav-card:hover { border-color: rgba(0,212,170,.45) !important; transform: translateY(-2px); }
.cc-nav-card { transition: transform .2s, border-color .2s; }
.cc-a:hover { color:#00d4aa !important; }

.fg-article .formula-box { background: #0d0d1a; border: 1px dashed rgba(0,212,170,.4); border-radius: 14px; padding: 24px 26px; margin: 30px 0; font-family: 'Inter Tight', sans-serif; font-size: 17px; line-height: 1.7; color: rgba(255,255,255,.85); }
.fg-article .formula-box em { color: #00d4aa; font-style: normal; font-weight: 700; }
.fg-article .ex-card { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 14px; padding: 22px 24px; margin: 18px 0; }
.fg-article .ex-card .ex-log { font-family: Fraunces, serif; font-size: 18px; line-height: 1.45; color: #fff; font-weight: 600; margin-bottom: 10px; }
.fg-article .ex-card .ex-why { font-size: 14.5px; line-height: 1.6; color: rgba(255,255,255,.62); }
.fg-article .ex-card .ex-why b { color: #00d4aa; font-weight: 700; }
.fg-article .mistake { border-bottom: 1px solid #16161f; padding: 18px 0; }
.fg-article .mistake:last-child { border-bottom: none; }
.fg-article .mistake .m-name { font-family: 'Inter Tight', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.fg-article .mistake .m-name .x { color: #ff6b6b; margin-right: 8px; font-weight: 800; }
.fg-article .mistake p { font-size: 15px; line-height: 1.6; color: rgba(255,255,255,.62); margin: 0; }
.fg-article .mistake p .fix { color: #00d4aa; font-weight: 700; }
.fg-article .letter-box { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 14px; padding: 26px 28px; margin: 30px 0; font-size: 15px; line-height: 1.7; color: rgba(255,255,255,.78); }
.fg-article .letter-box .lb-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(0,212,170,.7); margin-bottom: 14px; }
.fg-article .letter-box p { font-size: 15px; margin-bottom: 14px; color: rgba(255,255,255,.78); }
.fg-article .letter-box p:last-child { margin-bottom: 0; }
.fg-article .letter-box .lb-sub { color: #fff; font-weight: 600; }
.fg-article .adapt-ex { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 30px 0 26px; }
@media(max-width:640px){ .fg-article .adapt-ex { grid-template-columns: 1fr; } }
.fg-article .adapt-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px 22px; background: #0d0d1a; }
.fg-article .adapt-col.after { border-color: rgba(0,212,170,.3); background: linear-gradient(135deg, #071820 0%, #0a2a30 100%); }
.fg-article .adapt-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 12px; color: rgba(255,255,255,.4); }
.fg-article .adapt-col.after .adapt-tag { color: #00d4aa; }
.fg-article .adapt-prose { font-family: Fraunces, serif; font-size: 15px; line-height: 1.6; color: rgba(255,255,255,.78); font-style: italic; margin: 0; }
.fg-article .adapt-script { font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.55; color: rgba(255,255,255,.82); white-space: pre-wrap; margin: 0; }
.fg-article .anatomy { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 30px 0 26px; }
.fg-article .anatomy-row { display: flex; gap: 16px; padding: 16px 20px; border-bottom: 1px solid #16161f; }
.fg-article .anatomy-row:last-child { border-bottom: none; }
.fg-article .anatomy-num { font-family: Fraunces, serif; font-size: 18px; font-weight: 700; color: rgba(0,212,170,.5); flex-shrink: 0; width: 28px; }
.fg-article .anatomy-txt { font-size: 15px; line-height: 1.55; color: rgba(255,255,255,.78); }
.fg-article .anatomy-txt b { color: #fff; font-weight: 700; display: block; margin-bottom: 2px; font-family: 'Inter Tight', sans-serif; }
.fg-article .qa-box { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 14px; padding: 22px 24px; margin: 28px 0; }
.fg-article .qa-row { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid #16161f; }
.fg-article .qa-row:last-child { border-bottom: none; }
.fg-article .qa-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; padding: 3px 9px; border-radius: 9999px; height: fit-content; flex-shrink: 0; width: 62px; text-align: center; }
.fg-article .qa-tag.no { color: #ff8497; background: rgba(255,80,110,.1); border: 1px solid rgba(255,80,110,.25); }
.fg-article .qa-tag.yes { color: #00d4aa; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.28); }
.fg-article .qa-txt { font-size: 15px; line-height: 1.5; color: rgba(255,255,255,.82); font-style: italic; }
.fg-article .diag-box { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 14px; padding: 22px 24px; margin: 28px 0; }
.fg-article .diag-row { display: flex; gap: 16px; padding: 13px 0; border-bottom: 1px solid #16161f; align-items: flex-start; }
.fg-article .diag-row:last-child { border-bottom: none; }
.fg-article .diag-sym { flex: 1; font-size: 14.5px; color: rgba(255,255,255,.62); font-style: italic; line-height: 1.5; }
.fg-article .diag-arrow { color: rgba(0,212,170,.5); font-size: 16px; flex-shrink: 0; padding-top: 1px; }
.fg-article .diag-cause { flex: 1; font-size: 14.5px; color: #fff; line-height: 1.5; }
.fg-article .diag-head { display: flex; gap: 16px; padding-bottom: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.3); }
.fg-article .diag-head span { flex: 1; }
.fg-article .diag-head span:first-child { padding-left: 0; }
.fg-article .eighths-wrap { display: flex; gap: 24px; align-items: center; margin: 30px 0 26px; flex-wrap: wrap; }
.fg-article .page-strip { width: 132px; flex-shrink: 0; border: 1px solid #2a2a3a; border-radius: 6px; overflow: hidden; background: #0d0d1a; }
.fg-article .page-strip .eighth { height: 26px; border-bottom: 1px dashed rgba(255,255,255,.1); display: flex; align-items: center; padding-left: 10px; font-family: 'Courier New', monospace; font-size: 10px; color: rgba(255,255,255,.35); }
.fg-article .page-strip .eighth:last-child { border-bottom: none; }
.fg-article .page-strip .eighth.filled { background: rgba(0,212,170,.14); color: rgba(0,212,170,.85); }
.fg-article .eighths-note { flex: 1; min-width: 220px; }
.fg-article .eighths-note p { font-size: 15px; color: rgba(255,255,255,.72); line-height: 1.6; margin-bottom: 12px; }
.fg-article .eighths-note p:last-child { margin-bottom: 0; }
.fg-article .eighths-note b { color: #fff; }
.fg-article .legend { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 30px 0 26px; }
.fg-article .legend-row { display: flex; align-items: center; gap: 14px; padding: 12px 18px; border-bottom: 1px solid #16161f; }
.fg-article .legend-row:last-child { border-bottom: none; }
.fg-article .swatch { width: 22px; height: 22px; border-radius: 5px; flex-shrink: 0; border: 1px solid rgba(255,255,255,.18); }
.fg-article .legend-el { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; width: 150px; flex-shrink: 0; }
.fg-article .legend-desc { font-size: 14px; color: rgba(255,255,255,.6); line-height: 1.45; }
.fg-article .script-sample { background: #f5f3ec; color: #1a1a1a; border-radius: 12px; padding: 24px 26px; margin: 28px 0; font-family: 'Courier New', monospace; font-size: 13.5px; line-height: 1.7; }
.fg-article .script-sample .sl { font-weight: 700; margin-bottom: 8px; }
.fg-article .script-sample mark { padding: 0 2px; border-radius: 2px; font-weight: 700; }
.fg-article .m-cast { background: #ffb3b5; }
.fg-article .m-prop { background: #d7bdf5; }
.fg-article .m-ward { background: #a9e4c4; }
.fg-article .m-veh { background: #ffc0dd; }
.fg-article .m-bg { background: #ffe89a; }
.fg-article .sample-legend { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 16px; font-size: 11px; color: #555; }
.fg-article .sample-legend span { display: inline-flex; align-items: center; gap: 5px; }
.fg-article .sample-legend i { width: 11px; height: 11px; border-radius: 2px; display: inline-block; }
.fg-article .bd-sheet { background: #f5f3ec; color: #1a1a1a; border-radius: 12px; overflow: hidden; margin: 28px 0; font-family: 'Inter Tight', sans-serif; border: 1px solid #d8d4c6; }
.fg-article .bd-title { background: #1a1a1a; color: #fff; padding: 10px 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; display: flex; justify-content: space-between; }
.fg-article .bd-hdr { display: grid; grid-template-columns: repeat(4,1fr); border-bottom: 2px solid #1a1a1a; }
.fg-article .bd-hdr .cell { padding: 8px 12px; border-right: 1px solid #ccc7b6; font-size: 12px; }
.fg-article .bd-hdr .cell:last-child { border-right: none; }
.fg-article .bd-hdr .lab { font-size: 9px; text-transform: uppercase; letter-spacing: .06em; color: #888; display: block; margin-bottom: 2px; }
.fg-article .bd-hdr .val { font-weight: 700; }
.fg-article .bd-grid { display: grid; grid-template-columns: 1fr 1fr; }
@media(max-width:560px){ .fg-article .bd-grid { grid-template-columns: 1fr; } }
.fg-article .bd-box { border-right: 1px solid #ccc7b6; border-bottom: 1px solid #ccc7b6; padding: 10px 12px; min-height: 56px; }
.fg-article .bd-box .bl { font-size: 9px; text-transform: uppercase; letter-spacing: .06em; font-weight: 700; margin-bottom: 5px; }
.fg-article .bd-box .bv { font-size: 12.5px; color: #333; line-height: 1.5; }
.fg-article .bl-cast { color: #c0392b; }
.fg-article .bl-prop { color: #7b4fb5; }
.fg-article .bl-ward { color: #1f8a52; }
.fg-article .bl-veh { color: #c72c7f; }
.fg-article .bl-bg { color: #b8860b; }
.fg-article .bl-mk { color: #8a6d3b; }
.fg-article .stripboard { display: flex; gap: 3px; margin: 30px 0 8px; overflow-x: auto; padding-bottom: 6px; }
.fg-article .strip { width: 42px; flex-shrink: 0; border-radius: 4px; padding: 8px 0; min-height: 190px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; font-family: 'Courier New', monospace; }
.fg-article .strip .s-num { font-size: 12px; font-weight: 700; }
.fg-article .strip .s-body { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 10px; line-height: 1.3; letter-spacing: .04em; }
.fg-article .strip .s-len { font-size: 10px; }
.fg-article .strip.day { background: #f5efab; color: #4a3f00; }
.fg-article .strip.night { background: #2e3a55; color: #cfe0ff; }
.fg-article .strip.board-div { background: #1a1a1a; color: #fff; width: 30px; }
.fg-article .strip.board-div .s-body { color: #ffd24a; font-weight: 700; }
.fg-article .strip-legend { display: flex; gap: 18px; font-size: 12px; color: rgba(255,255,255,.5); margin-bottom: 26px; }
.fg-article .strip-legend span { display: inline-flex; align-items: center; gap: 6px; }
.fg-article .strip-legend i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
.fg-article .dood { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .dood table { width: 100%; border-collapse: collapse; font-family: 'Courier New', monospace; font-size: 12.5px; }
.fg-article .dood th { background: #0d0d1a; color: rgba(255,255,255,.5); font-weight: 700; padding: 9px 8px; text-align: center; border-bottom: 1px solid #1e1e35; text-transform: uppercase; font-size: 10px; letter-spacing: .05em; }
.fg-article .dood th.lft, .fg-article .dood td.lft { text-align: left; padding-left: 14px; }
.fg-article .dood td { padding: 9px 8px; text-align: center; border-bottom: 1px solid #16161f; color: rgba(255,255,255,.7); }
.fg-article .dood tr:last-child td { border-bottom: none; }
.fg-article .dood .sw { color: #00d4aa; font-weight: 700; }
.fg-article .dood .wk { color: rgba(255,255,255,.85); }
.fg-article .dood .fn { color: #ec6a6a; font-weight: 700; }
.fg-article .dood .hd { color: rgba(255,255,255,.25); }
.fg-article .sb-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin: 30px 0 26px; }
@media(max-width:560px){ .fg-article .sb-row { grid-template-columns: 1fr 1fr; } }
.fg-article .sb-panel { border: 1px solid #2a2a3a; border-radius: 8px; overflow: hidden; background: #0d0d1a; }
.fg-article .sb-frame { aspect-ratio: 16/9; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; display: flex; align-items: center; justify-content: center; }
.fg-article .sb-frame svg { width: 78%; height: 78%; }
.fg-article .sb-frame .stroke { stroke: rgba(0,212,170,.55); stroke-width: 2; fill: none; }
.fg-article .sb-frame .soft { stroke: rgba(255,255,255,.18); stroke-width: 1.5; fill: none; }
.fg-article .sb-cap { padding: 8px 10px; font-size: 11px; color: rgba(255,255,255,.5); border-top: 1px solid #1e1e35; display: flex; justify-content: space-between; font-family: 'Inter Tight', sans-serif; }
.fg-article .sb-cap b { color: rgba(0,212,170,.8); font-weight: 700; }
.fg-article .script-sample .shotmark { color: #0a8f74; font-weight: 700; }
.fg-article .shots-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin: 30px 0 26px; }
@media(max-width:640px){ .fg-article .shots-grid { grid-template-columns: 1fr 1fr; } }
.fg-article .shot-cell { border: 1px solid #2a2a3a; border-radius: 8px; overflow: hidden; background: #0d0d1a; }
.fg-article .shot-fr { aspect-ratio: 4/3; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; overflow: hidden; }
.fg-article .shot-fr svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .shot-fr .fig { stroke: rgba(0,212,170,.6); stroke-width: 2.5; fill: none; }
.fg-article .shot-lab { padding: 7px 10px; border-top: 1px solid #1e1e35; }
.fg-article .shot-lab b { display: block; font-size: 12px; color: #fff; font-weight: 700; }
.fg-article .shot-lab span { font-size: 10px; color: rgba(255,255,255,.45); }
.fg-article .draw-panel { border: 1px solid #2a2a3a; border-radius: 12px; overflow: hidden; margin: 30px 0 26px; max-width: 420px; }
.fg-article .draw-frame { aspect-ratio: 16/9; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; }
.fg-article .draw-frame svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .draw-frame .fig { stroke: rgba(0,212,170,.65); stroke-width: 2; fill: none; }
.fg-article .draw-frame .box { stroke: rgba(255,255,255,.3); stroke-width: 1.5; fill: none; }
.fg-article .draw-frame .arrow { stroke: #ffd24a; stroke-width: 2; fill: none; }
.fg-article .draw-cap { padding: 9px 12px; border-top: 1px solid #1e1e35; font-size: 12px; color: rgba(255,255,255,.55); font-family: 'Inter Tight', sans-serif; display: flex; justify-content: space-between; }
.fg-article .draw-cap b { color: rgba(0,212,170,.8); }
.fg-article .thirds { border: 1px solid #2a2a3a; border-radius: 12px; overflow: hidden; margin: 30px 0 26px; max-width: 460px; }
.fg-article .thirds-frame { aspect-ratio: 16/9; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; }
.fg-article .thirds-frame svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .thirds-frame .grid { stroke: rgba(255,255,255,.22); stroke-width: 1; }
.fg-article .thirds-frame .node { fill: rgba(0,212,170,.7); }
.fg-article .thirds-frame .fig { stroke: rgba(0,212,170,.7); stroke-width: 2.5; fill: none; }
.fg-article .thirds-cap { padding: 9px 12px; border-top: 1px solid #1e1e35; font-size: 12px; color: rgba(255,255,255,.55); }
.fg-article .thirds-cap b { color: rgba(0,212,170,.8); }
.fg-article .arrow-legend { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 30px 0 26px; }
@media(max-width:560px){ .fg-article .arrow-legend { grid-template-columns: 1fr 1fr; } }
.fg-article .arrow-cell { border: 1px solid #2a2a3a; border-radius: 10px; overflow: hidden; background: #0d0d1a; }
.fg-article .arrow-fr { aspect-ratio: 16/10; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; }
.fg-article .arrow-fr svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .arrow-fr .cam { stroke: #ffd24a; stroke-width: 2.5; fill: none; }
.fg-article .arrow-fr .subj { stroke: rgba(0,212,170,.75); stroke-width: 2.5; fill: none; }
.fg-article .arrow-fr .fig { stroke: rgba(255,255,255,.3); stroke-width: 2; fill: none; }
.fg-article .arrow-lab { padding: 7px 10px; border-top: 1px solid #1e1e35; }
.fg-article .arrow-lab b { display: block; font-size: 12px; color: #fff; font-weight: 700; }
.fg-article .arrow-lab span { font-size: 10px; color: rgba(255,255,255,.45); }
.fg-article .diag180 { border: 1px solid #2a2a3a; border-radius: 12px; overflow: hidden; margin: 30px 0 26px; max-width: 460px; }
.fg-article .diag180-fr { aspect-ratio: 16/10; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; }
.fg-article .diag180-fr svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .diag180-fr .line { stroke: #ec6a6a; stroke-width: 1.5; stroke-dasharray: 4 3; }
.fg-article .diag180-fr .actor { fill: rgba(0,212,170,.75); }
.fg-article .diag180-fr .cam { fill: #ffd24a; }
.fg-article .diag180-fr .ok { stroke: rgba(0,212,170,.5); stroke-width: 1.5; fill: none; }
.fg-article .diag180-fr .no { stroke: #ec6a6a; stroke-width: 1.5; fill: none; }
.fg-article .diag180-cap { padding: 9px 12px; border-top: 1px solid #1e1e35; font-size: 12px; color: rgba(255,255,255,.55); }
.fg-article .diag180-cap b { color: rgba(0,212,170,.8); }
.fg-article .shotlist { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .shotlist table { width: 100%; border-collapse: collapse; font-size: 13px; }
.fg-article .shotlist th { background: #0d0d1a; color: rgba(255,255,255,.5); font-weight: 700; padding: 9px 10px; text-align: left; border-bottom: 1px solid #1e1e35; text-transform: uppercase; font-size: 10px; letter-spacing: .05em; }
.fg-article .shotlist td { padding: 9px 10px; border-bottom: 1px solid #16161f; color: rgba(255,255,255,.75); vertical-align: top; }
.fg-article .shotlist tr:last-child td { border-bottom: none; }
.fg-article .shotlist td.n { color: #00d4aa; font-weight: 700; font-family: 'Courier New', monospace; }
.fg-article .shotlist td.sz { font-family: 'Courier New', monospace; color: rgba(255,255,255,.9); }
.fg-article .atlbtl { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 30px 0 26px; }
.fg-article .atl-half, .fg-article .btl-half { padding: 18px 22px; }
.fg-article .atl-half { background: rgba(168,85,247,.08); }
.fg-article .btl-half { background: rgba(0,212,170,.06); }
.fg-article .abtl-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 10px; }
.fg-article .atl-half .abtl-tag { color: #c084fc; }
.fg-article .btl-half .abtl-tag { color: #00d4aa; }
.fg-article .abtl-items { display: flex; flex-wrap: wrap; gap: 8px; }
.fg-article .abtl-items span { font-size: 13px; padding: 5px 11px; border-radius: 9999px; border: 1px solid rgba(255,255,255,.14); color: rgba(255,255,255,.8); }
.fg-article .the-line { text-align: center; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: .1em; color: #ffd24a; background: #0d0d1a; padding: 6px 0; border-top: 1px dashed rgba(255,210,74,.5); border-bottom: 1px dashed rgba(255,210,74,.5); }
.fg-article .bstruct { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 12px; padding: 20px 24px; margin: 28px 0; font-family: 'Courier New', monospace; font-size: 13.5px; line-height: 1.9; }
.fg-article .bstruct .acct { color: #c084fc; font-weight: 700; }
.fg-article .bstruct .cat { color: #00d4aa; }
.fg-article .bstruct .li { color: rgba(255,255,255,.7); }
.fg-article .bstruct .ind1 { padding-left: 22px; }
.fg-article .bstruct .ind2 { padding-left: 46px; }
.fg-article .bstruct .amt { float: right; color: rgba(255,255,255,.5); }
.fg-article .topsheet { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; font-size: 14px; }
.fg-article .topsheet .ts-title { background: #0d0d1a; padding: 14px 20px; font-family: Fraunces, serif; font-size: 16px; color: #fff; border-bottom: 1px solid #1e1e35; }
.fg-article .ts-row { display: grid; grid-template-columns: 54px 1fr auto; gap: 12px; padding: 9px 20px; border-bottom: 1px solid #16161f; align-items: center; }
.fg-article .ts-row .num { font-family: 'Courier New', monospace; color: rgba(255,255,255,.4); font-size: 13px; }
.fg-article .ts-row .name { color: rgba(255,255,255,.82); }
.fg-article .ts-row .amt { font-family: 'Courier New', monospace; color: rgba(255,255,255,.65); float: none; }
.fg-article .ts-row.sub { background: rgba(168,85,247,.05); }
.fg-article .ts-row.sub .name { color: #c084fc; font-weight: 600; }
.fg-article .ts-row.total { background: rgba(0,212,170,.07); border-bottom: none; }
.fg-article .ts-row.total .name { color: #00d4aa; font-weight: 700; }
.fg-article .ts-row.total .amt { color: #00d4aa; font-weight: 700; }
.fg-article .fringe { margin: 28px 0; border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; }
.fg-article .fringe-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 20px; border-bottom: 1px solid #16161f; font-size: 15px; }
.fg-article .fringe-row:last-child { border-bottom: none; }
.fg-article .fringe-row .lbl { color: rgba(255,255,255,.82); }
.fg-article .fringe-row .val { font-family: 'Courier New', monospace; color: rgba(255,255,255,.6); }
.fg-article .fringe-row.base { background: rgba(0,212,170,.06); }
.fg-article .fringe-row.base .lbl { color: #00d4aa; font-weight: 600; }
.fg-article .fringe-row.add .lbl { padding-left: 14px; color: rgba(255,255,255,.7); }
.fg-article .fringe-row.add .lbl::before { content: '+ '; color: #c084fc; }
.fg-article .fringe-row.total { background: rgba(168,85,247,.09); }
.fg-article .fringe-row.total .lbl { color: #c084fc; font-weight: 700; }
.fg-article .fringe-row.total .val { color: #c084fc; font-weight: 700; }
.fg-article .deptgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .deptgrid { grid-template-columns: 1fr; } }
.fg-article .dept { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .dept h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .dept p { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; line-height: 1.5; }
.fg-article .contbar { margin: 30px 0 10px; }
.fg-article .contbar-track { display: flex; height: 54px; border-radius: 10px; overflow: hidden; border: 1px solid #1e1e35; }
.fg-article .contbar-main { flex: 0 0 90%; background: rgba(0,212,170,.14); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: #00d4aa; }
.fg-article .contbar-cont { flex: 0 0 10%; background: rgba(168,85,247,.22); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #c084fc; text-align: center; }
.fg-article .contbar-cap { font-size: 12.5px; color: rgba(255,255,255,.4); margin-top: 8px; text-align: center; }
.fg-article .strips { margin: 28px 0; border-radius: 10px; overflow: hidden; border: 1px solid #1e1e35; }
.fg-article .strips .strip { display: grid; grid-template-columns: 34px 1fr auto; gap: 10px; align-items: center; padding: 9px 14px; font-size: 13px; border-bottom: 1px solid rgba(0,0,0,.3); width: auto; min-height: 0; flex-direction: row; border-radius: 0; font-family: inherit; }
.fg-article .strips .strip .sc { font-family: 'Courier New', monospace; font-weight: 700; }
.fg-article .strips .strip .desc { font-weight: 500; }
.fg-article .strips .strip .tag { font-size: 11px; opacity: .85; }
.fg-article .strips .strip.loc-a { background: rgba(0,212,170,.16); color: #0a0a12; }
.fg-article .strips .strip.loc-b { background: rgba(168,85,247,.20); color: #0a0a12; }
.fg-article .strips .strip.loc-c { background: rgba(255,210,74,.20); color: #0a0a12; }
.fg-article .strips .strip.brk { background: #0d0d1a; color: #00d4aa; grid-template-columns: 1fr; text-align: center; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: .1em; }
.fg-article .daycost { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .daycost-head { background: rgba(168,85,247,.10); padding: 13px 20px; font-family: Fraunces, serif; font-size: 16px; color: #c084fc; border-bottom: 1px solid #1e1e35; }
.fg-article .daycost-row { display: flex; justify-content: space-between; padding: 10px 20px; border-bottom: 1px solid #16161f; font-size: 14px; }
.fg-article .daycost-row .l { color: rgba(255,255,255,.75); }
.fg-article .daycost-row .r { font-family: 'Courier New', monospace; color: rgba(255,255,255,.6); }
.fg-article .daycost-row.tot { background: rgba(0,212,170,.08); border-bottom: none; }
.fg-article .daycost-row.tot .l { color: #00d4aa; font-weight: 700; }
.fg-article .daycost-row.tot .r { color: #00d4aa; font-weight: 700; }
.fg-article .costrep { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; font-size: 13px; }
.fg-article .costrep .cr-head, .fg-article .costrep .cr-row { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 8px; padding: 10px 16px; align-items: center; }
.fg-article .costrep .cr-head { background: #0d0d1a; border-bottom: 1px solid #1e1e35; font-family: 'Inter Tight', sans-serif; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: rgba(255,255,255,.45); }
.fg-article .costrep .cr-row { border-bottom: 1px solid #16161f; }
.fg-article .costrep .cr-row:last-child { border-bottom: none; }
.fg-article .costrep .cr-row .nm { color: rgba(255,255,255,.8); }
.fg-article .costrep .cr-row .n { font-family: 'Courier New', monospace; color: rgba(255,255,255,.6); text-align: right; }
.fg-article .costrep .cr-row .var-good { font-family: 'Courier New', monospace; color: #00d4aa; text-align: right; font-weight: 700; }
.fg-article .costrep .cr-row .var-bad { font-family: 'Courier New', monospace; color: #ff6b6b; text-align: right; font-weight: 700; }
.fg-article .costrep .cr-row.tot { background: rgba(0,212,170,.06); }
.fg-article .costrep .cr-row.tot .nm { color: #fff; font-weight: 700; }
.fg-article .mistakes { list-style: none; margin: 10px 0 22px; padding: 0; }
.fg-article .mistakes li { position: relative; padding: 12px 0 12px 38px; border-bottom: 1px solid #16161f; font-size: 16px; color: rgba(255,255,255,.8); line-height: 1.55; }
.fg-article .mistakes li:last-child { border-bottom: none; }
.fg-article .mistakes li b { color: #fff; }
.fg-article .mistakes li::before { content: '✕'; position: absolute; left: 6px; top: 12px; width: 20px; height: 20px; border-radius: 50%; background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.4); color: #ff6b6b; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.fg-article .roles { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .roles { grid-template-columns: 1fr; } }
.fg-article .role { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px 22px; background: #0d0d1a; }
.fg-article .role h4 { font-family: Fraunces, serif; font-size: 19px; color: #fff; margin-bottom: 4px; }
.fg-article .role .when { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; margin-bottom: 12px; }
.fg-article .role ul { list-style: none; padding: 0; }
.fg-article .role li { position: relative; padding: 6px 0 6px 18px; font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.5; }
.fg-article .role li::before { content: ''; position: absolute; left: 2px; top: 13px; width: 6px; height: 6px; border-radius: 2px; background: rgba(0,212,170,.6); }
.fg-article .breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; align-items: stretch; }
@media(max-width:600px){ .fg-article .breakdown { grid-template-columns: 1fr; } }
.fg-article .bd-col { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; }
.fg-article .bd-col-head { padding: 10px 16px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; border-bottom: 1px solid #1e1e35; }
.fg-article .bd-script .bd-col-head { background: rgba(255,255,255,.04); color: rgba(255,255,255,.5); }
.fg-article .bd-list .bd-col-head { background: rgba(0,212,170,.08); color: #00d4aa; }
.fg-article .bd-script .row { padding: 8px 16px; font-family: 'Courier New', monospace; font-size: 12px; color: rgba(255,255,255,.65); border-bottom: 1px solid #16161f; }
.fg-article .bd-script .row:last-child { border-bottom: none; }
.fg-article .bd-list .row { padding: 9px 16px; font-size: 13px; color: rgba(255,255,255,.8); border-bottom: 1px solid #16161f; display: flex; justify-content: space-between; gap: 8px; }
.fg-article .bd-list .row:last-child { border-bottom: none; }
.fg-article .bd-list .row b { color: #fff; }
.fg-article .bd-list .row .cnt { color: #00d4aa; font-family: 'Courier New', monospace; font-size: 12px; white-space: nowrap; }
.fg-article .srcgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .srcgrid { grid-template-columns: 1fr; } }
.fg-article .src { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .src h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .src p { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; line-height: 1.5; }
.fg-article .checklist { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .cl-cat { border-bottom: 1px solid #1e1e35; }
.fg-article .cl-cat:last-child { border-bottom: none; }
.fg-article .cl-cat-head { display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: rgba(0,212,170,.05); font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; }
.fg-article .cl-cat-head .n { width: 22px; height: 22px; border-radius: 6px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 11px; }
.fg-article .cl-items { padding: 10px 18px 14px 50px; }
.fg-article .cl-items span { display: inline-block; font-size: 13px; color: rgba(255,255,255,.7); background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); padding: 4px 11px; border-radius: 9999px; margin: 4px 6px 0 0; }
.fg-article .reportcard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .rc-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; }
.fg-article .rc-head .t { font-family: Fraunces, serif; font-size: 18px; color: #fff; }
.fg-article .rc-head .s { font-size: 12px; color: #00d4aa; font-family: 'Courier New', monospace; }
.fg-article .rc-photos { display: grid; grid-template-columns: repeat(4,1fr); gap: 4px; padding: 4px; }
@media(max-width:600px){ .fg-article .rc-photos { grid-template-columns: repeat(2,1fr); } }
.fg-article .rc-ph { aspect-ratio: 4/3; border-radius: 4px; display: flex; align-items: flex-end; padding: 6px; font-size: 9px; color: rgba(255,255,255,.5); font-family: 'Inter Tight', sans-serif; text-transform: uppercase; letter-spacing: .04em; }
.fg-article .rc-ph.a { background: linear-gradient(150deg,#0b2d35,#071c20); }
.fg-article .rc-ph.b { background: linear-gradient(150deg,#0a1030,#050510); }
.fg-article .rc-ph.c { background: linear-gradient(150deg,#00180e,#080816); }
.fg-article .rc-ph.d { background: linear-gradient(150deg,#141035,#0a0818); }
.fg-article .rc-meta { padding: 12px 20px 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; font-size: 13px; }
@media(max-width:600px){ .fg-article .rc-meta { grid-template-columns: 1fr; } }
.fg-article .rc-meta div { color: rgba(255,255,255,.7); }
.fg-article .rc-meta div b { color: #fff; }
.fg-article .logimap { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; margin: 28px 0; background: #0d0d1a; }
.fg-article .logimap-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.4); margin-bottom: 14px; }
.fg-article .logimap-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
@media(max-width:600px){ .fg-article .logimap-grid { grid-template-columns: 1fr 1fr; } }
.fg-article .zone { border-radius: 10px; padding: 14px 12px; text-align: center; border: 1px solid rgba(255,255,255,.08); }
.fg-article .zone .zi { width: 30px; height: 30px; margin: 0 auto 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.fg-article .zone .zi svg { width: 16px; height: 16px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .zone .zt { font-size: 12px; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; margin-bottom: 2px; }
.fg-article .zone .zd { font-size: 11px; color: rgba(255,255,255,.5); line-height: 1.4; }
.fg-article .zone.set { background: rgba(0,212,170,.08); border-color: rgba(0,212,170,.25); }
.fg-article .zone.set .zi { background: rgba(0,212,170,.16); }
.fg-article .zone.support { background: rgba(168,85,247,.06); border-color: rgba(168,85,247,.2); }
.fg-article .zone.support .zi { background: rgba(168,85,247,.14); }
.fg-article .zone.support .zi svg { stroke: #c084fc; }
.fg-article .pvp { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .pvp { grid-template-columns: 1fr; } }
.fg-article .pvp-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .pvp-col h4 { font-family: Fraunces, serif; font-size: 18px; color: #fff; margin-bottom: 4px; }
.fg-article .pvp-col .who { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #00d4aa; margin-bottom: 12px; }
.fg-article .pvp-col ul { list-style: none; padding: 0; }
.fg-article .pvp-col li { position: relative; padding: 6px 0 6px 18px; font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.5; }
.fg-article .pvp-col li::before { content: ''; position: absolute; left: 2px; top: 13px; width: 6px; height: 6px; border-radius: 2px; background: rgba(0,212,170,.6); }
.fg-article .agdoc { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .agdoc-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; font-family: Fraunces, serif; font-size: 17px; color: #fff; display: flex; align-items: center; gap: 10px; }
.fg-article .agdoc-head svg { width: 18px; height: 18px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .agrow { display: grid; grid-template-columns: 26px 1fr; gap: 12px; padding: 11px 20px; border-bottom: 1px solid #16161f; align-items: start; }
.fg-article .agrow:last-child { border-bottom: none; }
.fg-article .agrow .n { font-family: 'Courier New', monospace; font-size: 12px; color: #00d4aa; padding-top: 2px; }
.fg-article .agrow .c b { color: #fff; font-size: 14px; }
.fg-article .agrow .c p { font-size: 13px; color: rgba(255,255,255,.6); margin: 2px 0 0; line-height: 1.45; }
.fg-article .coststack { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .cs-head { background: rgba(168,85,247,.10); padding: 12px 18px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #c084fc; border-bottom: 1px solid #1e1e35; }
.fg-article .cs-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 18px; border-bottom: 1px solid #16161f; font-size: 14px; }
.fg-article .cs-row .l { color: rgba(255,255,255,.78); }
.fg-article .cs-row .r { font-family: 'Courier New', monospace; color: rgba(255,255,255,.55); font-size: 13px; }
.fg-article .cs-row.base { background: rgba(0,212,170,.06); }
.fg-article .cs-row.base .l { color: #00d4aa; font-weight: 600; }
.fg-article .cs-row.tot { background: rgba(168,85,247,.09); border-bottom: none; }
.fg-article .cs-row.tot .l { color: #c084fc; font-weight: 700; }
.fg-article .cs-row.tot .r { color: #c084fc; font-weight: 700; }
.fg-article .timeline { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .tl-row { display: grid; grid-template-columns: 92px 1fr; gap: 0; border-bottom: 1px solid #16161f; }
.fg-article .tl-row:last-child { border-bottom: none; }
.fg-article .tl-time { background: rgba(0,212,170,.06); padding: 12px 14px; font-family: 'Courier New', monospace; font-size: 12px; color: #00d4aa; font-weight: 700; display: flex; align-items: center; }
.fg-article .tl-what { padding: 12px 16px; font-size: 14px; color: rgba(255,255,255,.78); line-height: 1.5; }
.fg-article .tl-what b { color: #fff; }
.fg-article .wrapout { list-style: none; margin: 10px 0 22px; padding: 0; }
.fg-article .wrapout li { position: relative; padding: 11px 0 11px 34px; border-bottom: 1px solid #16161f; font-size: 15px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .wrapout li:last-child { border-bottom: none; }
.fg-article .wrapout li b { color: #fff; }
.fg-article .wrapout li::before { content: '✓'; position: absolute; left: 4px; top: 11px; width: 20px; height: 20px; border-radius: 6px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.35); color: #00d4aa; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

.fg-article .funnel { display: flex; flex-direction: column; gap: 6px; margin: 28px 0; }
.fg-article .fstep { border: 1px solid #1e1e35; border-radius: 10px; padding: 12px 18px; background: #0d0d1a; display: flex; align-items: center; gap: 14px; }
.fg-article .fstep .fn { width: 24px; height: 24px; border-radius: 6px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #00d4aa; font-family: 'Inter Tight', sans-serif; flex-shrink: 0; }
.fg-article .fstep .fx { font-size: 14px; color: rgba(255,255,255,.8); }
.fg-article .fstep .fx b { color: #fff; }
.fg-article .fstep.s2 { margin: 0 4%; }
.fg-article .fstep.s3 { margin: 0 8%; }
.fg-article .fstep.s4 { margin: 0 12%; border-color: rgba(0,212,170,.35); }
.fg-article .resp { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .resp { grid-template-columns: 1fr; } }
.fg-article .rcard { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .rcard h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .rcard p { font-size: 13px; color: rgba(255,255,255,.62); margin: 0; line-height: 1.5; }
.fg-article .bdcard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .bdcard-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; }
.fg-article .bdcard-head .nm { font-family: Fraunces, serif; font-size: 19px; color: #fff; }
.fg-article .bdcard-head .role { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.25); padding: 3px 10px; border-radius: 9999px; }
.fg-article .bdrow { display: grid; grid-template-columns: 130px 1fr; gap: 12px; padding: 10px 20px; border-bottom: 1px solid #16161f; font-size: 14px; align-items: baseline; }
.fg-article .bdrow:last-child { border-bottom: none; }
.fg-article .bdrow .k { color: rgba(255,255,255,.45); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
.fg-article .bdrow .v { color: rgba(255,255,255,.8); line-height: 1.55; }
@media(max-width:600px){ .fg-article .bdrow { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .callmock { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .callmock-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; font-family: Fraunces, serif; font-size: 17px; color: #fff; }
.fg-article .cmrow { padding: 10px 20px; border-bottom: 1px solid #16161f; font-size: 14px; display: grid; grid-template-columns: 120px 1fr; gap: 12px; align-items: baseline; }
.fg-article .cmrow:last-child { border-bottom: none; }
.fg-article .cmrow .k { color: rgba(255,255,255,.45); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
.fg-article .cmrow .v { color: rgba(255,255,255,.8); line-height: 1.5; }
@media(max-width:600px){ .fg-article .cmrow { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .redflags { list-style: none; margin: 10px 0 22px; padding: 0; }
.fg-article .redflags li { position: relative; padding: 11px 0 11px 34px; border-bottom: 1px solid #16161f; font-size: 15px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .redflags li:last-child { border-bottom: none; }
.fg-article .redflags li b { color: #fff; }
.fg-article .redflags li::before { content: '!'; position: absolute; left: 5px; top: 11px; width: 20px; height: 20px; border-radius: 50%; background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.4); color: #ff6b6b; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.fg-article .flow { display: flex; flex-direction: column; gap: 0; margin: 28px 0; }
.fg-article .fnode { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 30px 1fr; gap: 14px; align-items: center; }
.fg-article .fnode .fn { width: 26px; height: 26px; border-radius: 7px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #00d4aa; font-family: 'Inter Tight', sans-serif; }
.fg-article .fnode .ft { font-size: 14px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .fnode .ft b { color: #fff; }
.fg-article .farrow { width: 2px; height: 14px; background: rgba(0,212,170,.3); margin: 0 auto; }
.fg-article .pairing { display: flex; align-items: center; justify-content: center; gap: 0; margin: 30px 0; flex-wrap: wrap; }
.fg-article .pcard { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 22px; background: #0d0d1a; text-align: center; min-width: 150px; }
.fg-article .pcard .pav { width: 44px; height: 44px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-family: 'Inter Tight', sans-serif; font-weight: 800; font-size: 15px; }
.fg-article .pcard.a .pav { background: linear-gradient(135deg,#00d4aa,#0099ff); color: #000; }
.fg-article .pcard.b .pav { background: linear-gradient(135deg,#a855f7,#6d28d9); color: #fff; }
.fg-article .pcard .pn { font-size: 14px; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; }
.fg-article .pcard .pr { font-size: 12px; color: rgba(255,255,255,.5); margin-top: 2px; }
.fg-article .pspark { display: flex; flex-direction: column; align-items: center; padding: 0 20px; }
.fg-article .pspark svg { width: 30px; height: 30px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .pspark span { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; margin-top: 4px; }
@media(max-width:600px){ .fg-article .pspark { padding: 12px 0; } }
.fg-article .scard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .scard-head { background: #0d0d1a; padding: 12px 20px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.45); border-bottom: 1px solid #1e1e35; }
.fg-article .scrow { display: grid; grid-template-columns: 160px 1fr; gap: 14px; padding: 12px 20px; border-bottom: 1px solid #16161f; align-items: baseline; }
.fg-article .scrow:last-child { border-bottom: none; }
.fg-article .scrow .k { font-size: 14px; font-weight: 700; color: #00d4aa; }
.fg-article .scrow .v { font-size: 13.5px; color: rgba(255,255,255,.66); line-height: 1.5; }
@media(max-width:600px){ .fg-article .scrow { grid-template-columns: 1fr; gap: 3px; } }
.fg-article .disclaimer { background: rgba(255,210,74,.06); border: 1px solid rgba(255,210,74,.25); border-radius: 12px; padding: 16px 20px; margin: 30px 0; font-size: 13.5px; color: rgba(255,255,255,.6); line-height: 1.6; }
.fg-article .disclaimer b { color: #ffd24a; font-weight: 700; }
.fg-article .offer { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .offer-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; font-family: Fraunces, serif; font-size: 17px; color: #fff; display: flex; align-items: center; gap: 10px; }
.fg-article .offer-head svg { width: 18px; height: 18px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .ofrow { display: grid; grid-template-columns: 26px 1fr; gap: 12px; padding: 11px 20px; border-bottom: 1px solid #16161f; align-items: start; }
.fg-article .ofrow:last-child { border-bottom: none; }
.fg-article .ofrow .n { font-family: 'Courier New', monospace; font-size: 12px; color: #00d4aa; padding-top: 2px; }
.fg-article .ofrow .c b { color: #fff; font-size: 14px; }
.fg-article .ofrow .c p { font-size: 13px; color: rgba(255,255,255,.6); margin: 2px 0 0; line-height: 1.45; }
.fg-article .reqcard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .reqcard-head { background: #0d0d1a; padding: 13px 20px; border-bottom: 1px solid #1e1e35; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; }
.fg-article .reqrow { display: grid; grid-template-columns: 150px 1fr; gap: 12px; padding: 10px 20px; border-bottom: 1px solid #16161f; font-size: 14px; align-items: baseline; }
.fg-article .reqrow:last-child { border-bottom: none; }
.fg-article .reqrow .k { color: rgba(255,255,255,.5); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
.fg-article .reqrow .v { color: rgba(255,255,255,.8); line-height: 1.5; }
@media(max-width:600px){ .fg-article .reqrow { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .proscons { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .proscons { grid-template-columns: 1fr; } }
.fg-article .pc-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .pc-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; }
.fg-article .pc-pro h4 { color: #00d4aa; }
.fg-article .pc-con h4 { color: #ff9d5c; }
.fg-article .pc-col ul { list-style: none; padding: 0; }
.fg-article .pc-col li { position: relative; padding: 7px 0 7px 20px; font-size: 14px; color: rgba(255,255,255,.74); line-height: 1.5; border-bottom: 1px solid #14141d; }
.fg-article .pc-col li:last-child { border-bottom: none; }
.fg-article .pc-pro li::before { content: '+'; position: absolute; left: 3px; top: 6px; color: #00d4aa; font-weight: 700; }
.fg-article .pc-con li::before { content: '–'; position: absolute; left: 4px; top: 6px; color: #ff9d5c; font-weight: 700; }
.fg-article .tiers { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .tiers { grid-template-columns: 1fr; } }
.fg-article .tier { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .tier h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .tier p { font-size: 13px; color: rgba(255,255,255,.62); margin: 0; line-height: 1.5; }
.fg-article .roles:has(.rrow) { display: block; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; grid-template-columns: none; gap: 0; }
.fg-article .roles .rrow { display: grid; grid-template-columns: 210px 1fr; gap: 14px; padding: 12px 18px; border-bottom: 1px solid #16161f; align-items: baseline; }
.fg-article .roles .rrow:last-child { border-bottom: none; }
.fg-article .roles .rrow .r { font-size: 14px; font-weight: 700; color: #00d4aa; }
.fg-article .roles .rrow .r span { display: block; font-size: 11px; font-weight: 500; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }
.fg-article .roles .rrow .d { font-size: 13.5px; color: rgba(255,255,255,.68); line-height: 1.5; }
@media(max-width:600px){ .fg-article .roles .rrow { grid-template-columns: 1fr; gap: 3px; } }
.fg-article .roles .grp-label { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.4); background: #0d0d1a; padding: 9px 18px; border-bottom: 1px solid #1e1e35; display: block; }
.fg-article .hier { display: flex; flex-direction: column; gap: 8px; margin: 28px 0; }
.fg-article .htier { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; }
.fg-article .htier .hl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; margin-bottom: 6px; }
.fg-article .htier .hp { font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.5; }
.fg-article .htier .hp b { color: #fff; }
.fg-article .htier.t1 { border-color: rgba(168,85,247,.35); background: rgba(168,85,247,.06); }
.fg-article .htier.t1 .hl { color: #c084fc; }
.fg-article .htier.t2 { border-color: rgba(0,212,170,.35); }
.fg-article .htier.t3 { margin: 0 5%; }
.fg-article .lookfor { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .lookfor { grid-template-columns: 1fr; } }
.fg-article .lf-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .lf-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; }
.fg-article .lf-good h4 { color: #00d4aa; }
.fg-article .lf-bad h4 { color: #ff9d5c; }
.fg-article .lf-col ul { list-style: none; padding: 0; }
.fg-article .lf-col li { position: relative; padding: 7px 0 7px 20px; font-size: 14px; color: rgba(255,255,255,.74); line-height: 1.5; border-bottom: 1px solid #14141d; }
.fg-article .lf-col li:last-child { border-bottom: none; }
.fg-article .lf-good li::before { content: '✓'; position: absolute; left: 2px; top: 7px; color: #00d4aa; font-weight: 700; font-size: 12px; }
.fg-article .lf-bad li::before { content: '!'; position: absolute; left: 5px; top: 7px; color: #ff9d5c; font-weight: 700; }
.fg-article .qcard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .qcat { border-bottom: 1px solid #1e1e35; }
.fg-article .qcat:last-child { border-bottom: none; }
.fg-article .qcat-head { padding: 11px 18px; background: rgba(0,212,170,.05); font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #00d4aa; }
.fg-article .qcat ul { list-style: none; padding: 8px 18px 12px; }
.fg-article .qcat li { position: relative; padding: 6px 0 6px 18px; font-size: 14px; color: rgba(255,255,255,.74); line-height: 1.5; }
.fg-article .qcat li::before { content: '“'; position: absolute; left: 2px; top: 5px; color: rgba(0,212,170,.6); font-weight: 700; font-family: Georgia, serif; }
.fg-article .flags { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .flags { grid-template-columns: 1fr; } }
.fg-article .fl-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .fl-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; }
.fg-article .fl-green h4 { color: #00d4aa; }
.fg-article .fl-red h4 { color: #ff9d5c; }
.fg-article .fl-col ul { list-style: none; padding: 0; }
.fg-article .fl-col li { position: relative; padding: 7px 0 7px 20px; font-size: 14px; color: rgba(255,255,255,.74); line-height: 1.5; border-bottom: 1px solid #14141d; }
.fg-article .fl-col li:last-child { border-bottom: none; }
.fg-article .fl-green li::before { content: '✓'; position: absolute; left: 2px; top: 7px; color: #00d4aa; font-weight: 700; font-size: 12px; }
.fg-article .fl-red li::before { content: '!'; position: absolute; left: 5px; top: 7px; color: #ff9d5c; font-weight: 700; }
.fg-article .qlist { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .qlist-head { background: #0d0d1a; padding: 12px 20px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.45); border-bottom: 1px solid #1e1e35; }
.fg-article .qi { padding: 11px 20px 11px 44px; border-bottom: 1px solid #16161f; font-size: 14.5px; color: rgba(255,255,255,.8); line-height: 1.5; position: relative; }
.fg-article .qi:last-child { border-bottom: none; }
.fg-article .qi::before { content: '“'; position: absolute; left: 20px; top: 12px; color: rgba(0,212,170,.7); font-weight: 700; font-family: Georgia, serif; font-size: 18px; }
.fg-article .qi b { color: #fff; }
.fg-article .deal { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .deal-head { background: rgba(0,212,170,.06); padding: 12px 18px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; border-bottom: 1px solid #1e1e35; }
.fg-article .deal-row { display: grid; grid-template-columns: 150px 1fr; gap: 14px; padding: 11px 18px; border-bottom: 1px solid #16161f; align-items: baseline; }
.fg-article .deal-row:last-child { border-bottom: none; }
.fg-article .deal-row .k { font-size: 14px; font-weight: 700; color: #fff; }
.fg-article .deal-row .v { font-size: 13.5px; color: rgba(255,255,255,.66); line-height: 1.5; }
@media(max-width:600px){ .fg-article .deal-row { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .memo { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .memo-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; font-family: Fraunces, serif; font-size: 17px; color: #fff; display: flex; align-items: center; gap: 10px; }
.fg-article .memo-head svg { width: 18px; height: 18px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .mrow { display: grid; grid-template-columns: 26px 1fr; gap: 12px; padding: 11px 20px; border-bottom: 1px solid #16161f; align-items: start; }
.fg-article .mrow:last-child { border-bottom: none; }
.fg-article .mrow .n { font-family: 'Courier New', monospace; font-size: 12px; color: #00d4aa; padding-top: 2px; }
.fg-article .mrow .c b { color: #fff; font-size: 14px; }
.fg-article .mrow .c p { font-size: 13px; color: rgba(255,255,255,.6); margin: 2px 0 0; line-height: 1.45; }
.fg-article .team { margin: 28px 0; }
.fg-article .team-head { border: 1px solid rgba(168,85,247,.35); background: rgba(168,85,247,.06); border-radius: 12px; padding: 12px 18px; text-align: center; max-width: 240px; margin: 0 auto 4px; }
.fg-article .team-head .l { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #c084fc; }
.fg-article .team-head .n { font-size: 15px; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; }
.fg-article .team-stem { width: 2px; height: 16px; background: rgba(0,212,170,.3); margin: 0 auto; }
.fg-article .team-crew { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
@media(max-width:600px){ .fg-article .team-crew { grid-template-columns: 1fr; } }
.fg-article .team-crew div { border: 1px solid #1e1e35; border-radius: 10px; padding: 10px 12px; background: #0d0d1a; text-align: center; font-size: 13px; color: rgba(255,255,255,.75); }
.fg-article .team-crew div b { color: #fff; display: block; font-size: 13px; }
.fg-article .team-cap { text-align: center; font-size: 12.5px; color: rgba(255,255,255,.4); margin-top: 10px; }
.fg-article .chain { display: flex; flex-direction: column; gap: 0; margin: 28px 0; align-items: center; }
.fg-article .cnode { border: 1px solid #1e1e35; border-radius: 12px; padding: 12px 20px; background: #0d0d1a; text-align: center; min-width: 260px; }
.fg-article .cnode .cl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #00d4aa; }
.fg-article .cnode .cd { font-size: 13px; color: rgba(255,255,255,.7); margin-top: 2px; }
.fg-article .cnode .cd b { color: #fff; }
.fg-article .cnode.top { border-color: rgba(168,85,247,.35); background: rgba(168,85,247,.06); }
.fg-article .cnode.top .cl { color: #c084fc; }
.fg-article .carrow { width: 2px; height: 16px; background: rgba(0,212,170,.3); }
.fg-article .covers { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .covers { grid-template-columns: 1fr; } }
.fg-article .cov { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .cov h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .cov p { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; line-height: 1.5; }
.fg-article .dlist { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .dlist-head { background: #0d0d1a; padding: 12px 20px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; border-bottom: 1px solid #1e1e35; }
.fg-article .dl-scene { padding: 10px 20px; border-bottom: 1px solid #16161f; }
.fg-article .dl-scene:last-child { border-bottom: none; }
.fg-article .dl-scene .sc { font-family: 'Courier New', monospace; font-size: 12px; color: rgba(255,255,255,.5); margin-bottom: 6px; }
.fg-article .dl-scene .tags { display: flex; flex-wrap: wrap; gap: 6px; }
.fg-article .dl-scene .tags span { font-size: 12px; padding: 3px 10px; border-radius: 9999px; border: 1px solid rgba(255,255,255,.12); color: rgba(255,255,255,.78); }
.fg-article .dl-scene .tags span.hero { color: #00d4aa; border-color: rgba(0,212,170,.35); background: rgba(0,212,170,.08); }
.fg-article .moodboard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .mb-head { background: #0d0d1a; padding: 12px 18px; font-family: Fraunces, serif; font-size: 16px; color: #fff; border-bottom: 1px solid #1e1e35; }
.fg-article .mb-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: 70px; gap: 5px; padding: 5px; }
@media(max-width:600px){ .fg-article .mb-grid { grid-template-columns: repeat(3,1fr); } }
.fg-article .mb-grid div { border-radius: 5px; display: flex; align-items: flex-end; padding: 6px; font-size: 9px; color: rgba(255,255,255,.6); font-family: 'Inter Tight', sans-serif; text-transform: uppercase; letter-spacing: .03em; line-height: 1.2; }
.fg-article .mb1 { background: linear-gradient(150deg,#3a2a1a,#1a1208); grid-column: span 2; grid-row: span 2; }
.fg-article .mb2 { background: linear-gradient(150deg,#4a3520,#2a1e12); }
.fg-article .mb3 { background: linear-gradient(150deg,#2a1810,#160b06); }
.fg-article .mb4 { background: linear-gradient(150deg,#5a4028,#31220f); grid-row: span 2; }
.fg-article .mb5 { background: linear-gradient(150deg,#3a2818,#20140a); }
.fg-article .mb6 { background: linear-gradient(150deg,#2e1f12,#170e07); }
.fg-article .mb-sw { display: flex; gap: 4px; padding: 8px 18px 12px; }
.fg-article .mb-sw span { flex: 1; height: 22px; border-radius: 5px; }
.fg-article .layers { display: flex; flex-direction: column; gap: 8px; margin: 28px 0; }
.fg-article .layer { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 30px 1fr; gap: 14px; align-items: center; }
.fg-article .layer .ln { width: 26px; height: 26px; border-radius: 7px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #00d4aa; font-family: 'Inter Tight', sans-serif; }
.fg-article .layer .lt { font-size: 14px; color: rgba(255,255,255,.78); line-height: 1.5; }
.fg-article .layer .lt b { color: #fff; }
.fg-article .layer.l1 { border-color: rgba(0,212,170,.3); }
.fg-article .layer.l2 { margin: 0 3%; }
.fg-article .layer.l3 { margin: 0 6%; }
.fg-article .layer.l4 { margin: 0 9%; }
.fg-article .ptypes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .ptypes { grid-template-columns: 1fr; } }
.fg-article .pt { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .pt h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .pt p { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; line-height: 1.5; }
.fg-article .pt.hero { border-color: rgba(0,212,170,.35); background: rgba(0,212,170,.06); }
.fg-article .cmean { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .cmean { grid-template-columns: 1fr; } }
.fg-article .cm { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 16px; background: #0d0d1a; display: flex; align-items: center; gap: 14px; }
.fg-article .cm .sw { width: 40px; height: 40px; border-radius: 9px; flex-shrink: 0; border: 1px solid rgba(255,255,255,.12); }
.fg-article .cm .ct { font-size: 13px; color: rgba(255,255,255,.68); line-height: 1.45; }
.fg-article .cm .ct b { color: #fff; display: block; font-size: 14px; margin-bottom: 1px; }
.fg-article .pstrip { display: flex; height: 56px; border-radius: 12px; overflow: hidden; margin: 20px 0 8px; border: 1px solid #1e1e35; }
.fg-article .pstrip span { flex: 1; }
.fg-article .pcap { text-align: center; font-size: 12.5px; color: rgba(255,255,255,.4); margin-bottom: 22px; }
.fg-article .vs { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .vs { grid-template-columns: 1fr; } }
.fg-article .vs-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .vs-col h4 { font-family: Fraunces, serif; font-size: 18px; color: #fff; margin-bottom: 12px; }
.fg-article .vs-col .lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin: 10px 0 6px; }
.fg-article .vs-col .pro { color: #00d4aa; }
.fg-article .vs-col .con { color: #ff9d5c; }
.fg-article .vs-col ul { list-style: none; padding: 0; }
.fg-article .vs-col li { position: relative; padding: 5px 0 5px 18px; font-size: 13.5px; color: rgba(255,255,255,.72); line-height: 1.45; }
.fg-article .vs-col .pros li::before { content: '+'; position: absolute; left: 3px; top: 5px; color: #00d4aa; font-weight: 700; }
.fg-article .vs-col .cons li::before { content: '–'; position: absolute; left: 4px; top: 5px; color: #ff9d5c; font-weight: 700; }
.fg-article .ladder { display: flex; flex-direction: column; gap: 8px; margin: 28px 0; }
.fg-article .lrung { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 90px 1fr; gap: 14px; align-items: center; }
.fg-article .lrung .lt { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: #00d4aa; }
.fg-article .lrung .ld { font-size: 13.5px; color: rgba(255,255,255,.68); line-height: 1.5; }
.fg-article .lrung .ld b { color: #fff; }
.fg-article .lrung.r1 { border-color: rgba(0,212,170,.35); }
@media(max-width:600px){ .fg-article .lrung { grid-template-columns: 1fr; gap: 3px; } }
.fg-article .alloc { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .alloc-head { background: rgba(0,212,170,.06); padding: 12px 18px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; border-bottom: 1px solid #1e1e35; }
.fg-article .alloc-row { display: flex; align-items: center; gap: 12px; padding: 10px 18px; border-bottom: 1px solid #16161f; }
.fg-article .alloc-row:last-child { border-bottom: none; }
.fg-article .alloc-row .name { flex: 0 0 130px; font-size: 13px; color: rgba(255,255,255,.78); }
.fg-article .alloc-row .bar { flex: 1; height: 20px; border-radius: 5px; background: rgba(255,255,255,.05); overflow: hidden; }
.fg-article .alloc-row .bar span { display: block; height: 100%; background: linear-gradient(90deg,#00d4aa,#0099ff); }
.fg-article .alloc-row .pct { flex: 0 0 44px; text-align: right; font-family: 'Courier New', monospace; font-size: 12px; color: rgba(255,255,255,.55); }
.fg-article .alloc-row.save .bar span { background: linear-gradient(90deg,#3a5a4a,#2a4a5a); }
.fg-article .phases { display: flex; flex-direction: column; gap: 0; margin: 28px 0; }
.fg-article .phase { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 96px 1fr; gap: 14px; align-items: center; }
.fg-article .phase .pl { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: #00d4aa; }
.fg-article .phase .pd { font-size: 13.5px; color: rgba(255,255,255,.68); line-height: 1.5; }
.fg-article .phase .pd b { color: #fff; }
.fg-article .parrow { width: 2px; height: 14px; background: rgba(0,212,170,.3); margin: 0 auto; }
@media(max-width:600px){ .fg-article .phase { grid-template-columns: 1fr; gap: 3px; } }
.fg-article .cd-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin: 30px 0 8px; }
@media(max-width:600px){ .fg-article .cd-grid { grid-template-columns: 1fr; } }
.fg-article .cd-cell { background: linear-gradient(135deg,#0b0b16 0%,#0d1524 100%); border: 1px solid #1e1e35; border-radius: 14px; padding: 20px 20px 18px; }
.fg-article .cd-ic { width: 38px; height: 38px; border-radius: 10px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.fg-article .cd-ic svg { width: 19px; height: 19px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .cd-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.fg-article .cd-cell p { font-size: 13.5px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .cdept { margin: 30px 0 8px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; }
.fg-article .cdept-row { display: grid; grid-template-columns: 200px 1fr; gap: 0; border-bottom: 1px solid #16161f; }
.fg-article .cdept-row:last-child { border-bottom: none; }
.fg-article .cdept-row.head { background: rgba(0,212,170,.06); }
.fg-article .cdept-role { padding: 14px 18px; font-family: 'Inter Tight', sans-serif; font-weight: 700; font-size: 14px; color: #fff; border-right: 1px solid #16161f; display: flex; align-items: center; gap: 8px; }
.fg-article .cdept-row.head .cdept-role, .fg-article .cdept-row.head .cdept-desc { font-size: 11px; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); font-weight: 700; }
.fg-article .cdept-desc { padding: 14px 18px; font-size: 14px; color: rgba(255,255,255,.65); line-height: 1.5; }
@media(max-width:600px){ .fg-article .cdept-row { grid-template-columns: 1fr; } .fg-article .cdept-role { border-right: none; border-bottom: 1px solid #16161f; } }
.fg-article .plot { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow-x: auto; }
.fg-article .plot-title { padding: 12px 16px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; }
.fg-article table.plot-tbl { border-collapse: collapse; width: 100%; min-width: 520px; }
.fg-article table.plot-tbl th, .fg-article table.plot-tbl td { border-bottom: 1px solid #16161f; border-right: 1px solid #16161f; padding: 11px 12px; font-size: 13px; text-align: center; }
.fg-article table.plot-tbl th { font-family: 'Inter Tight', sans-serif; font-weight: 700; color: rgba(255,255,255,.55); font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
.fg-article table.plot-tbl td:first-child, .fg-article table.plot-tbl th:first-child { text-align: left; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; white-space: nowrap; }
.fg-article table.plot-tbl tr:last-child td { border-bottom: none; }
.fg-article table.plot-tbl th:last-child, .fg-article table.plot-tbl td:last-child { border-right: none; }
.fg-article .chg { display: inline-block; min-width: 26px; padding: 2px 6px; border-radius: 6px; font-weight: 700; font-size: 12px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); color: #00d4aa; }
.fg-article .chg.b { background: rgba(168,85,247,.14); border-color: rgba(168,85,247,.35); color: #c084fc; }
.fg-article .chg.c { background: rgba(255,180,80,.12); border-color: rgba(255,180,80,.3); color: #ffb450; }
.fg-article .plot-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 10px 2px 22px; line-height: 1.5; }
.fg-article .board { margin: 30px 0 6px; background: #0b0b16; border: 1px solid #1e1e35; border-radius: 16px; padding: 18px; }
.fg-article .board-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 6px; }
.fg-article .board-name { font-family: Fraunces, serif; font-size: 18px; color: #fff; }
.fg-article .board-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(0,212,170,.7); }
.fg-article .board-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 74px; gap: 8px; }
@media(max-width:600px){ .fg-article .board-grid { grid-template-columns: repeat(3,1fr); } }
.fg-article .board-sw { border-radius: 8px; position: relative; overflow: hidden; display: flex; align-items: flex-end; padding: 7px 8px; }
.fg-article .board-sw span { font-family: 'Courier New', monospace; font-size: 9px; color: rgba(255,255,255,.55); }
.fg-article .sw-a { background: linear-gradient(135deg,#3a2a1c,#5a4530); grid-column: span 2; grid-row: span 2; }
.fg-article .sw-b { background: linear-gradient(135deg,#22303a,#33505e); }
.fg-article .sw-c { background: linear-gradient(135deg,#4a3020,#6b4a2e); }
.fg-article .sw-d { background: linear-gradient(135deg,#2a2622,#443f38); }
.fg-article .sw-e { background: linear-gradient(135deg,#1c2a2a,#2e4444); }
.fg-article .sw-f { background: repeating-linear-gradient(45deg,#3a3228,#3a3228 4px,#4a4030 4px,#4a4030 8px); }
.fg-article .palette-strip { display: flex; gap: 0; margin-top: 12px; border-radius: 8px; overflow: hidden; height: 30px; }
.fg-article .palette-strip div { flex: 1; }
.fg-article .board-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 10px 2px 22px; line-height: 1.5; }
.fg-article .srcladder { margin: 30px 0 6px; display: flex; flex-direction: column; gap: 8px; }
.fg-article .rung { display: flex; align-items: center; gap: 16px; border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 18px; background: linear-gradient(90deg, rgba(0,212,170,.05), transparent); }
.fg-article .rung-n { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); color: #00d4aa; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .rung-body { flex: 1; }
.fg-article .rung-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .rung-body p { font-size: 13.5px; color: rgba(255,255,255,.58); line-height: 1.5; margin: 0; }
.fg-article .rung-cost { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; padding: 4px 10px; border-radius: 9999px; flex-shrink: 0; white-space: nowrap; }
.fg-article .c-free { color: #00d4aa; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); }
.fg-article .c-low { color: #7fd4c4; background: rgba(0,212,170,.07); border: 1px solid rgba(0,212,170,.18); }
.fg-article .c-mid { color: #ffb450; background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.28); }
.fg-article .c-high { color: #ff8a8a; background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.3); }
.fg-article .srcladder-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
@media(max-width:600px){ .fg-article .rung { flex-wrap: wrap; } }
.fg-article .arc { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 24px 22px 18px; background: #0b0b16; }
.fg-article .arc-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 20px; }
.fg-article .arc-track { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; position: relative; }
@media(max-width:600px){ .fg-article .arc-track { grid-template-columns: 1fr 1fr; gap: 14px; } }
.fg-article .arc-step { text-align: center; }
.fg-article .arc-fig { height: 84px; border-radius: 10px; margin-bottom: 10px; position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; }
.fg-article .arc-1 { background: linear-gradient(160deg,#2a3540,#3a4a58); }
.fg-article .arc-2 { background: linear-gradient(160deg,#2e3238,#464b44); }
.fg-article .arc-3 { background: linear-gradient(160deg,#3a2e26,#5a4432); }
.fg-article .arc-4 { background: linear-gradient(160deg,#3a1e1e,#5a2828); }
.fg-article .arc-dot { width: 12px; height: 12px; border-radius: 50%; background: #00d4aa; border: 2px solid #0b0b16; }
.fg-article .arc-step h5 { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .arc-step p { font-size: 11.5px; color: rgba(255,255,255,.55); line-height: 1.4; margin: 0; }
.fg-article .arc-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .cmeta { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .cmeta { grid-template-columns: repeat(2,1fr); } }
.fg-article .cmcard { border-radius: 12px; overflow: hidden; border: 1px solid #1e1e35; }
.fg-article .cm-chip { height: 56px; }
.fg-article .cm-txt { padding: 10px 12px; background: #0b0b16; }
.fg-article .cm-txt h5 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.fg-article .cm-txt p { font-size: 11.5px; color: rgba(255,255,255,.55); line-height: 1.4; margin: 0; }
.fg-article .pvb { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 26px 0 6px; }
@media(max-width:600px){ .fg-article .pvb { grid-template-columns: 1fr; } }
.fg-article .pvb-cell { border-radius: 14px; overflow: hidden; border: 1px solid #1e1e35; }
.fg-article .pvb-scene { height: 140px; position: relative; display: flex; align-items: center; justify-content: center; }
.fg-article .pvb-fig { width: 46px; height: 78px; border-radius: 40% 40% 8px 8px; }
.fg-article .pvb-label { padding: 10px 14px; background: #0b0b16; font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.45; }
.fg-article .pvb-label b { color: #fff; }
.fg-article .demo-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .cont { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; overflow: hidden; background: #0b0b16; }
.fg-article .cont-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; flex-wrap: wrap; gap: 6px; }
.fg-article .cont-head h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; }
.fg-article .cont-head span { font-size: 11px; font-weight: 700; color: rgba(0,212,170,.75); text-transform: uppercase; letter-spacing: .06em; }
.fg-article .cont-body { display: grid; grid-template-columns: 260px 1fr; gap: 0; }
@media(max-width:600px){ .fg-article .cont-body { grid-template-columns: 1fr; } }
.fg-article .cont-photos { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 16px; border-right: 1px solid #16161f; }
@media(max-width:600px){ .fg-article .cont-photos { border-right: none; border-bottom: 1px solid #16161f; } }
.fg-article .cont-shot { aspect-ratio: 3/4; border-radius: 8px; background: linear-gradient(160deg,#2a3038,#3c4650); position: relative; display: flex; align-items: flex-end; }
.fg-article .cont-shot span { font-family: 'Courier New', monospace; font-size: 9px; color: rgba(255,255,255,.5); padding: 5px 6px; }
.fg-article .cont-notes { padding: 16px 18px; }
.fg-article .cont-notes .cn { display: flex; gap: 8px; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #16161f; color: rgba(255,255,255,.72); }
.fg-article .cont-notes .cn:last-child { border-bottom: none; }
.fg-article .cont-notes .cn b { color: #00d4aa; font-weight: 700; min-width: 74px; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; padding-top: 2px; }
.fg-article .cont-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .fit { margin: 30px 0 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media(max-width:600px){ .fg-article .fit { grid-template-columns: 1fr; } }
.fg-article .fit-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0b0b16; }
.fg-article .fit-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(0,212,170,.75); margin-bottom: 14px; }
.fg-article .fit-item { display: flex; gap: 10px; align-items: flex-start; padding: 7px 0; font-size: 14px; color: rgba(255,255,255,.78); line-height: 1.45; }
.fg-article .fit-box { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid rgba(0,212,170,.5); flex-shrink: 0; margin-top: 2px; position: relative; }
.fg-article .fit-box::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #00d4aa; }
.fg-article .fit-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .budg { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 22px 22px 18px; background: #0b0b16; }
.fg-article .budg-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 18px; }
.fg-article .brow { display: grid; grid-template-columns: 130px 1fr 44px; gap: 12px; align-items: center; margin-bottom: 12px; }
.fg-article .brow:last-of-type { margin-bottom: 0; }
.fg-article .brow-label { font-size: 13px; color: rgba(255,255,255,.78); font-weight: 600; }
.fg-article .brow-track { height: 22px; background: #16161f; border-radius: 6px; overflow: hidden; }
.fg-article .brow-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, #00d4aa, #0099ff); }
.fg-article .brow-pct { font-size: 12px; color: rgba(0,212,170,.85); font-weight: 700; text-align: right; }
.fg-article .brow.dim .brow-fill { background: linear-gradient(90deg,#2e6a60,#2a4a66); }
.fg-article .budg-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
@media(max-width:600px){ .fg-article .brow { grid-template-columns: 92px 1fr 40px; } }
.fg-article .dayphases { margin: 30px 0 6px; }
.fg-article .dayphase { display: grid; grid-template-columns: 44px 1fr; gap: 16px; position: relative; padding-bottom: 18px; }
.fg-article .dayphase:not(:last-child)::before { content: ''; position: absolute; left: 21px; top: 40px; bottom: 0; width: 2px; background: linear-gradient(#00d4aa, rgba(0,212,170,.15)); }
.fg-article .phase-n { width: 44px; height: 44px; border-radius: 12px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; z-index: 1; }
.fg-article .phase-n svg { width: 21px; height: 21px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .phase-body { padding-top: 2px; }
.fg-article .phase-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .phase-body .ph-time { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: rgba(0,212,170,.7); margin-bottom: 6px; }
.fg-article .phase-body p { font-size: 14px; color: rgba(255,255,255,.62); line-height: 1.55; margin: 0; }

.fg-article .slanatomy { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .slanatomy-title { padding: 12px 16px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; }
.fg-article .slanatomy-scroll { overflow-x: auto; }
.fg-article table.slrows { border-collapse: collapse; width: 100%; min-width: 560px; }
.fg-article table.slrows th, .fg-article table.slrows td { border-bottom: 1px solid #16161f; border-right: 1px solid #16161f; padding: 10px 12px; font-size: 13px; text-align: left; }
.fg-article table.slrows th { font-family: 'Inter Tight', sans-serif; font-weight: 700; color: rgba(255,255,255,.5); font-size: 10.5px; text-transform: uppercase; letter-spacing: .05em; background: rgba(255,255,255,.02); }
.fg-article table.slrows td { color: rgba(255,255,255,.72); }
.fg-article table.slrows tr:last-child td { border-bottom: none; }
.fg-article table.slrows th:last-child, .fg-article table.slrows td:last-child { border-right: none; }
.fg-article table.slrows td.num { color: #00d4aa; font-weight: 700; }
.fg-article .slsz { display: inline-block; padding: 1px 7px; border-radius: 5px; font-weight: 700; font-size: 11px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.28); color: #00d4aa; }
.fg-article .slanatomy-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 10px 2px 22px; line-height: 1.5; }
.fg-article .compare3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 30px 0 6px; }
@media(max-width:680px){ .fg-article .compare3 { grid-template-columns: 1fr; } }
.fg-article .ctool { border: 1px solid #1e1e35; border-radius: 14px; background: #0b0b16; overflow: hidden; }
.fg-article .ctool-vis { height: 96px; border-bottom: 1px solid #16161f; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg,#071820,#0a2230); }
.fg-article .ctool-vis svg { width: 100%; height: 100%; }
.fg-article .ctool-body { padding: 15px 16px; }
.fg-article .ctool-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .ctool-body .cform { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 8px; }
.fg-article .ctool-body p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .compare3-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .sizes { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:680px){ .fg-article .sizes { grid-template-columns: repeat(2,1fr); } }
@media(max-width:420px){ .fg-article .sizes { grid-template-columns: 1fr; } }
.fg-article .szf { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; background: #0b0b16; }
.fg-article .szf-frame { aspect-ratio: 16/10; background: linear-gradient(160deg,#0d2028,#0a1826); position: relative; overflow: hidden; border-bottom: 1px solid #16161f; }
.fg-article .szf-frame svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .szf-cap { padding: 9px 12px; }
.fg-article .szf-cap h5 { font-family: 'Inter Tight', sans-serif; font-size: 12.5px; font-weight: 700; color: #fff; }
.fg-article .szf-cap span { font-size: 10px; font-weight: 700; color: rgba(0,212,170,.7); text-transform: uppercase; letter-spacing: .05em; }
.fg-article .szf-cap p { font-size: 11px; color: rgba(255,255,255,.55); line-height: 1.4; margin-top: 3px; }
.fg-article .sizes-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .angles { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .angles { grid-template-columns: 1fr; } }
.fg-article .ang { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; background: #0b0b16; }
.fg-article .ang-vis { height: 96px; background: linear-gradient(160deg,#0d2028,#0a1826); border-bottom: 1px solid #16161f; position: relative; }
.fg-article .ang-vis svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .ang-cap { padding: 11px 14px; }
.fg-article .ang-cap h5 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .ang-cap p { font-size: 12px; color: rgba(255,255,255,.6); line-height: 1.45; margin: 0; }
.fg-article .angles-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .move-list { list-style: none; margin: 8px 0 22px; padding: 0; }
.fg-article .move-list li { display: grid; grid-template-columns: 92px 1fr; gap: 14px; padding: 11px 0; border-bottom: 1px solid #16161f; font-size: 15px; color: rgba(255,255,255,.78); line-height: 1.5; }
.fg-article .move-list li:last-child { border-bottom: none; }
.fg-article .move-list .mv { font-family: 'Inter Tight', sans-serif; font-weight: 700; color: #00d4aa; font-size: 13px; }
@media(max-width:600px){ .fg-article .move-list li { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .covset { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 20px; background: #0b0b16; }
.fg-article .covset-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 16px; }
.fg-article .covset-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
@media(max-width:600px){ .fg-article .covset-grid { grid-template-columns: 1fr 1fr; } }
.fg-article .covset-shot { border: 1px solid #1e1e35; border-radius: 10px; overflow: hidden; background: #0d1524; }
.fg-article .covset-fr { aspect-ratio: 16/10; position: relative; background: linear-gradient(160deg,#0d2028,#0a1826); }
.fg-article .covset-fr svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .covset-lbl { padding: 7px 10px; }
.fg-article .covset-lbl b { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; color: #00d4aa; }
.fg-article .covset-lbl span { display: block; font-size: 11px; color: rgba(255,255,255,.6); line-height: 1.35; margin-top: 1px; }
.fg-article .covset-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .fsl { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .fsl-head { padding: 12px 16px; background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }
.fg-article .fsl-head b { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #fff; }
.fg-article .fsl-head span { font-size: 11px; color: rgba(0,212,170,.7); font-weight: 700; }
.fg-article .fsl-scroll { overflow-x: auto; }
.fg-article table.fsl-t { border-collapse: collapse; width: 100%; min-width: 640px; }
.fg-article table.fsl-t th, .fg-article table.fsl-t td { border-bottom: 1px solid #16161f; border-right: 1px solid #16161f; padding: 8px 11px; font-size: 12.5px; text-align: left; }
.fg-article table.fsl-t th { font-family: 'Inter Tight', sans-serif; font-weight: 700; color: rgba(255,255,255,.5); font-size: 10px; text-transform: uppercase; letter-spacing: .05em; background: rgba(255,255,255,.02); }
.fg-article table.fsl-t td { color: rgba(255,255,255,.72); }
.fg-article table.fsl-t tr:last-child td { border-bottom: none; }
.fg-article table.fsl-t th:last-child, .fg-article table.fsl-t td:last-child { border-right: none; }
.fg-article table.fsl-t td.n { color: #00d4aa; font-weight: 700; }
.fg-article .szc { display: inline-block; padding: 1px 6px; border-radius: 4px; font-weight: 700; font-size: 10.5px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.28); color: #00d4aa; }
.fg-article .pri { display: inline-block; width: 9px; height: 9px; border-radius: 50%; }
.fg-article .pri.a { background: #00d4aa; }
.fg-article .pri.b { background: #ffb450; }
.fg-article .fsl-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .plan { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 20px; background: #0b0b16; }
.fg-article .plan-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 14px; }
.fg-article .plan-wrap { border: 1px solid #1e1e35; border-radius: 10px; overflow: hidden; background: #0d1524; }
.fg-article .plan-legend { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 14px; font-size: 12px; color: rgba(255,255,255,.6); }
.fg-article .plan-legend span { display: inline-flex; align-items: center; gap: 6px; }
.fg-article .lg-dot { width: 12px; height: 12px; border-radius: 50%; }
.fg-article .lg-cam { width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 11px solid rgba(255,220,120,.85); }
.fg-article .plan-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .oneeighty { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 20px; background: #0b0b16; }
.fg-article .oe-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 14px; }
.fg-article .oe-wrap { border: 1px solid #1e1e35; border-radius: 10px; overflow: hidden; background: #0d1524; }
.fg-article .oe-legend { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 14px; font-size: 12px; color: rgba(255,255,255,.6); }
.fg-article .oe-legend span { display: inline-flex; align-items: center; gap: 6px; }
.fg-article .oe-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .pritiers { margin: 30px 0 6px; display: flex; flex-direction: column; gap: 10px; }
.fg-article .pritier { display: flex; align-items: flex-start; gap: 14px; border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0b0b16; }
.fg-article .pritier-badge { flex-shrink: 0; width: 46px; height: 46px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: Fraunces, serif; font-weight: 700; font-size: 20px; }
.fg-article .pt-a { background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.4); color: #00d4aa; }
.fg-article .pt-b { background: rgba(255,180,80,.12); border: 1px solid rgba(255,180,80,.35); color: #ffb450; }
.fg-article .pt-c { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.18); color: rgba(255,255,255,.6); }
.fg-article .pritier-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .pritier-body p { font-size: 13.5px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .pritiers-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .regroup { display: grid; grid-template-columns: 1fr 40px 1fr; gap: 8px; align-items: center; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .regroup { grid-template-columns: 1fr; } .fg-article .rg-arrow { transform: rotate(90deg); margin: 4px auto; } }
.fg-article .rg-col { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; background: #0b0b16; }
.fg-article .rg-head { padding: 9px 12px; font-family: 'Inter Tight', sans-serif; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid #16161f; }
.fg-article .rg-head.story { color: rgba(255,255,255,.5); background: rgba(255,255,255,.02); }
.fg-article .rg-head.shoot { color: rgba(0,212,170,.8); background: rgba(0,212,170,.06); }
.fg-article .rg-row { display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 12.5px; color: rgba(255,255,255,.72); border-bottom: 1px solid #16161f; }
.fg-article .rg-row:last-child { border-bottom: none; }
.fg-article .rg-n { font-weight: 700; color: #00d4aa; min-width: 30px; }
.fg-article .rg-grp { background: rgba(0,212,170,.05); }
.fg-article .rg-glabel { padding: 6px 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.65); background: rgba(0,212,170,.08); border-bottom: 1px solid #16161f; }
.fg-article .rg-arrow { display: flex; align-items: center; justify-content: center; color: rgba(0,212,170,.6); }
.fg-article .regroup-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .track { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .track-head { padding: 12px 16px; background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }
.fg-article .track-head b { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #fff; }
.fg-article .track-head span { font-size: 11px; color: rgba(0,212,170,.7); font-weight: 700; }
.fg-article .track-row { display: grid; grid-template-columns: 30px 22px 1fr auto; gap: 10px; align-items: center; padding: 9px 16px; border-bottom: 1px solid #16161f; font-size: 13px; }
.fg-article .track-row:last-child { border-bottom: none; }
.fg-article .track-row .tn { font-weight: 700; color: #00d4aa; }
.fg-article .track-row .td { color: rgba(255,255,255,.72); }
.fg-article .track-row.done .td { color: rgba(255,255,255,.35); text-decoration: line-through; }
.fg-article .track-row .tpri { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; }
.fg-article .tp-a { color: #00d4aa; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); }
.fg-article .tp-b { color: #ffb450; background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.3); }
.fg-article .tbox { width: 17px; height: 17px; border-radius: 5px; border: 1.5px solid rgba(0,212,170,.5); position: relative; }
.fg-article .tbox.on { background: rgba(0,212,170,.18); }
.fg-article .tbox.on::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #00d4aa; }
.fg-article .track-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .sigdeal { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .sigdeal { grid-template-columns: 1fr; } }
.fg-article .sigdeal-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .sigdeal-col h4 { font-family: Fraunces, serif; font-size: 18px; color: #fff; margin-bottom: 4px; }
.fg-article .sigdeal-col .sigdeal-lbl { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #00d4aa; margin-bottom: 12px; }
.fg-article .sigdeal-col ul { list-style: none; padding: 0; }
.fg-article .sigdeal-col li { position: relative; padding: 6px 0 6px 18px; font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.5; }
.fg-article .sigdeal-col li::before { content: ''; position: absolute; left: 2px; top: 13px; width: 6px; height: 6px; border-radius: 2px; background: rgba(0,212,170,.6); }
.fg-article .lbtiers { margin: 28px 0; display: flex; flex-direction: column; gap: 8px; }
.fg-article .lbtier { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; display: grid; grid-template-columns: 30px 1fr; gap: 14px; align-items: center; background: #0d0d1a; position: relative; }
.fg-article .lbtier .lbt-step { width: 26px; height: 26px; border-radius: 7px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #00d4aa; font-family: 'Inter Tight', sans-serif; }
.fg-article .lbtier .lbt-name { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; }
.fg-article .lbtier .lbt-desc { font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.45; margin-top: 2px; }
.fg-article .lbtier.lbt-1 { border-color: rgba(0,212,170,.35); }
.fg-article .lbtier.lbt-2 { border-color: rgba(0,212,170,.28); }
.fg-article .lbtier.lbt-3 { border-color: rgba(0,212,170,.22); }
.fg-article .lbtier.lbt-4 { border-color: rgba(0,212,170,.16); }
.fg-article .lbtier.lbt-5 { border-color: rgba(0,212,170,.12); }
.fg-article .sigsteps { margin: 28px 0; display: flex; flex-direction: column; gap: 10px; }
.fg-article .sigstep { display: grid; grid-template-columns: 34px 1fr; gap: 14px; align-items: start; border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 18px; background: #0d0d1a; }
.fg-article .sigstep .sigstep-n { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-family: Fraunces, serif; font-size: 15px; font-weight: 700; color: #00d4aa; }
.fg-article .sigstep .sigstep-t { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .sigstep .sigstep-d { font-size: 13.5px; color: rgba(255,255,255,.62); line-height: 1.5; }
.fg-article .rateanat { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .ra-head { background: rgba(0,212,170,.06); padding: 12px 18px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; border-bottom: 1px solid #1e1e35; }
.fg-article .ra-row { display: grid; grid-template-columns: 150px 1fr; gap: 14px; padding: 11px 18px; border-bottom: 1px solid #16161f; align-items: baseline; }
.fg-article .ra-row:last-child { border-bottom: none; }
.fg-article .ra-row .ra-k { font-size: 14px; font-weight: 700; color: #fff; }
.fg-article .ra-row .ra-v { font-size: 13.5px; color: rgba(255,255,255,.65); line-height: 1.5; }
@media(max-width:600px){ .fg-article .ra-row { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .wagestack { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .wagestack-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 20px; border-bottom: 1px solid #16161f; font-size: 15px; }
.fg-article .wagestack-row:last-child { border-bottom: none; }
.fg-article .wagestack-row .ws-lbl { color: rgba(255,255,255,.82); }
.fg-article .wagestack-row .ws-note { font-size: 12px; color: rgba(255,255,255,.4); }
.fg-article .wagestack-row.ws-base { background: rgba(0,212,170,.06); }
.fg-article .wagestack-row.ws-base .ws-lbl { color: #00d4aa; font-weight: 600; }
.fg-article .wagestack-row.ws-add .ws-lbl { padding-left: 14px; color: rgba(255,255,255,.72); }
.fg-article .wagestack-row.ws-add .ws-lbl::before { content: '+ '; color: #c084fc; font-weight: 700; }
.fg-article .wagestack-row.ws-total { background: rgba(168,85,247,.09); }
.fg-article .wagestack-row.ws-total .ws-lbl { color: #c084fc; font-weight: 700; }
.fg-article .wagestack-row.ws-total .ws-note { color: #c084fc; }
.fg-article .docs { display: flex; flex-direction: column; gap: 10px; margin: 28px 0; }
.fg-article .doc { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 18px; background: #0d0d1a; display: grid; grid-template-columns: 34px 1fr; gap: 14px; align-items: start; }
.fg-article .doc .di { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; }
.fg-article .doc .di svg { width: 15px; height: 15px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .doc .dt { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .doc .dd { font-size: 13.5px; color: rgba(255,255,255,.62); line-height: 1.5; }
.fg-article .doc .dd b { color: rgba(255,255,255,.85); }
.fg-article .setrules { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .setrules { grid-template-columns: 1fr; } }
.fg-article .setrule { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .setrule h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
.fg-article .setrule h4 svg { width: 15px; height: 15px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .setrule p { font-size: 13px; color: rgba(255,255,255,.62); margin: 0; line-height: 1.5; }
.fg-article .life { display: flex; flex-direction: column; gap: 0; margin: 28px 0; }
.fg-article .lnode { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: center; }
.fg-article .lnode .lt { font-size: 14px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .lnode .lt b { color: #fff; }
.fg-article .lnode .ltag { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; white-space: nowrap; }
.fg-article .lnode .ltag.lt-none { color: rgba(255,255,255,.5); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); }
.fg-article .lnode .ltag.lt-maybe { color: #ffd24a; background: rgba(255,210,74,.1); border: 1px solid rgba(255,210,74,.3); }
.fg-article .larrow { width: 2px; height: 14px; background: rgba(0,212,170,.3); margin: 0 auto; }
.fg-article .legal-note { background: rgba(255,180,80,.06); border: 1px solid rgba(255,180,80,.28); border-radius: 12px; padding: 16px 20px; margin: 30px 0; display: flex; gap: 12px; align-items: flex-start; }
.fg-article .legal-note svg { width: 18px; height: 18px; stroke: #ffb450; fill: none; stroke-width: 2; flex-shrink: 0; margin-top: 2px; }
.fg-article .legal-note p { font-size: 13.5px; line-height: 1.6; color: rgba(255,210,140,.9); margin: 0; }
.fg-article .legal-note b { color: #ffce88; }
.fg-article .three { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 30px 0 8px; }
@media(max-width:600px){ .fg-article .three { grid-template-columns: 1fr; } }
.fg-article .tcard { background: linear-gradient(135deg,#0b0b16 0%,#0d1524 100%); border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; }
.fg-article .tcard-ic { width: 40px; height: 40px; border-radius: 10px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.fg-article .tcard-ic svg { width: 20px; height: 20px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .tcard h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .tcard .who { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 8px; }
.fg-article .tcard p { font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .three-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .needp { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .needp { grid-template-columns: 1fr; } }
.fg-article .np-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0b0b16; }
.fg-article .np-col.yes { border-color: rgba(255,180,80,.3); }
.fg-article .np-col.no { border-color: rgba(0,212,170,.3); }
.fg-article .np-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.fg-article .np-col.yes h4 { color: #ffb450; }
.fg-article .np-col.no h4 { color: #00d4aa; }
.fg-article .np-col h4 .badge { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; }
.fg-article .np-col.yes .badge { background: rgba(255,180,80,.14); border: 1px solid rgba(255,180,80,.4); color: #ffb450; }
.fg-article .np-col.no .badge { background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.4); color: #00d4aa; }
.fg-article .np-item { font-size: 13.5px; color: rgba(255,255,255,.72); line-height: 1.45; padding: 7px 0; border-bottom: 1px solid #16161f; }
.fg-article .np-item:last-child { border-bottom: none; }
.fg-article .needp-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .steps { margin: 30px 0 6px; }
.fg-article .step { display: grid; grid-template-columns: 44px 1fr; gap: 16px; position: relative; padding-bottom: 18px; }
.fg-article .step:not(:last-child)::before { content: ''; position: absolute; left: 21px; top: 40px; bottom: 0; width: 2px; background: linear-gradient(#00d4aa, rgba(0,212,170,.15)); }
.fg-article .step-n { width: 44px; height: 44px; border-radius: 12px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; z-index: 1; font-family: Fraunces, serif; font-weight: 700; color: #00d4aa; font-size: 18px; }
.fg-article .step-body { padding-top: 4px; }
.fg-article .step-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .step-body p { font-size: 14px; color: rgba(255,255,255,.62); line-height: 1.55; margin: 0; }
.fg-article .locagree { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .locagree-head { padding: 14px 18px; background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; display: flex; align-items: center; gap: 10px; }
.fg-article .locagree-head svg { width: 17px; height: 17px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .locagree-head b { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #fff; }
.fg-article .locagree-row { display: flex; gap: 12px; padding: 11px 18px; border-bottom: 1px solid #16161f; font-size: 14px; color: rgba(255,255,255,.75); line-height: 1.5; }
.fg-article .locagree-row:last-child { border-bottom: none; }
.fg-article .locagree-row b { color: #fff; font-weight: 700; }
.fg-article .locagree-chk { width: 18px; height: 18px; border-radius: 5px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.35); flex-shrink: 0; position: relative; margin-top: 1px; }
.fg-article .locagree-chk::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #00d4aa; }
.fg-article .locagree-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .relform { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0c1018; }
.fg-article .relform-head { padding: 16px 20px; border-bottom: 1px solid #16161f; background: rgba(0,212,170,.05); }
.fg-article .relform-head h4 { font-family: Fraunces, serif; font-size: 17px; color: #fff; }
.fg-article .relform-head span { font-size: 11px; color: rgba(0,212,170,.7); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.fg-article .relform-body { padding: 18px 20px; }
.fg-article .relform-clause { display: flex; gap: 10px; padding: 8px 0; font-size: 13.5px; color: rgba(255,255,255,.7); line-height: 1.5; border-bottom: 1px dashed #191922; }
.fg-article .relform-clause:last-of-type { border-bottom: none; }
.fg-article .relform-clause b { color: #00d4aa; font-weight: 700; }
.fg-article .relform-sign { display: flex; gap: 20px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #16161f; }
.fg-article .relform-sign div { flex: 1; }
.fg-article .relform-sign .relform-line { height: 1px; background: rgba(255,255,255,.25); margin-bottom: 5px; }
.fg-article .relform-sign span { font-size: 10.5px; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .05em; }
.fg-article .relform-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .spectrum { margin: 30px 0 6px; display: flex; flex-direction: column; gap: 8px; }
.fg-article .sp-row { display: grid; grid-template-columns: 150px 1fr; gap: 14px; align-items: center; border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 16px; background: #0b0b16; }
@media(max-width:600px){ .fg-article .sp-row { grid-template-columns: 1fr; gap: 6px; } }
.fg-article .sp-who { display: flex; align-items: center; gap: 9px; }
.fg-article .sp-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.fg-article .sp-who b { font-family: 'Inter Tight', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff; }
.fg-article .sp-need { font-size: 13px; color: rgba(255,255,255,.65); line-height: 1.45; }
.fg-article .sp-need .sp-tag { display: inline-block; font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; margin-right: 6px; }
.fg-article .sp-need .t-full { color: #ff8a8a; background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.3); }
.fg-article .sp-need .t-app { color: #ffb450; background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.3); }
.fg-article .sp-need .t-sign { color: #7fd4c4; background: rgba(0,212,170,.08); border: 1px solid rgba(0,212,170,.25); }
.fg-article .sp-need .t-ok { color: #00d4aa; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); }
.fg-article .spectrum-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .loc { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .loc { grid-template-columns: 1fr; } }
.fg-article .loc-cell { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 16px; background: #0b0b16; }
.fg-article .loc-cell .loc-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; padding: 3px 9px; border-radius: 9999px; margin-bottom: 9px; }
.fg-article .loc-cell .loc-tag.yes { color: #ff8a8a; background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.3); }
.fg-article .loc-cell .loc-tag.caut { color: #ffb450; background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.3); }
.fg-article .loc-cell .loc-tag.no { color: #00d4aa; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); }
.fg-article .loc-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .loc-cell p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .loc-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .obj { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .obj { grid-template-columns: 1fr; } }
.fg-article .obj-cell { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 16px; background: #0b0b16; display: flex; gap: 13px; align-items: flex-start; }
.fg-article .obj-ic { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .obj-ic svg { width: 18px; height: 18px; stroke-width: 2; fill: none; }
.fg-article .obj-ic.yes { background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.3); }
.fg-article .obj-ic.yes svg { stroke: #ff8a8a; }
.fg-article .obj-ic.no { background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); }
.fg-article .obj-ic.no svg { stroke: #00d4aa; }
.fg-article .obj-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .obj-cell p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.45; margin: 0; }
.fg-article .obj-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .rights { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .rights { grid-template-columns: 1fr; } }
.fg-article .rt { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; background: linear-gradient(135deg,#0b0b16 0%,#0d1524 100%); }
.fg-article .rt-ic { width: 42px; height: 42px; border-radius: 10px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.fg-article .rt-ic svg { width: 21px; height: 21px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .rt h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .rt .own { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 8px; }
.fg-article .rt p { font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .rights-note { background: rgba(255,107,107,.06); border: 1px solid rgba(255,107,107,.25); border-radius: 12px; padding: 14px 18px; margin: 14px 0 6px; font-size: 14px; color: rgba(255,180,180,.9); line-height: 1.55; }
.fg-article .rights-note b { color: #ffcaca; }
.fg-article .rights-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .tmzones { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:680px){ .fg-article .tmzones { grid-template-columns: 1fr; } }
.fg-article .tmzone { border: 1px solid #1e1e35; border-radius: 14px; padding: 16px 18px; background: #0b0b16; }
.fg-article .tmzone.ok { border-color: rgba(0,212,170,.3); }
.fg-article .tmzone.caut { border-color: rgba(255,180,80,.3); }
.fg-article .tmzone.no { border-color: rgba(255,107,107,.3); }
.fg-article .tmzone h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 7px; }
.fg-article .tmzone.ok h4 { color: #00d4aa; }
.fg-article .tmzone.caut h4 { color: #ffb450; }
.fg-article .tmzone.no h4 { color: #ff8a8a; }
.fg-article .tmzone h4 .b { width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.fg-article .tmzone.ok .b { background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.4); }
.fg-article .tmzone.caut .b { background: rgba(255,180,80,.14); border: 1px solid rgba(255,180,80,.4); }
.fg-article .tmzone.no .b { background: rgba(255,107,107,.14); border: 1px solid rgba(255,107,107,.4); }
.fg-article .tmzone-item { font-size: 12.5px; color: rgba(255,255,255,.72); line-height: 1.45; padding: 6px 0; border-bottom: 1px solid #16161f; }
.fg-article .tmzone-item:last-child { border-bottom: none; }
.fg-article .tmzones-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .dstack { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 22px; background: #0b0b16; }
.fg-article .dstack-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 16px; }
.fg-article .dlayer { display: flex; align-items: center; gap: 14px; border: 1px solid #1e1e35; border-radius: 10px; padding: 13px 16px; margin-bottom: 8px; background: linear-gradient(90deg, rgba(0,212,170,.05), transparent); }
.fg-article .dlayer:last-child { margin-bottom: 0; }
.fg-article .dlayer-ic { width: 34px; height: 34px; border-radius: 8px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .dlayer-ic svg { width: 17px; height: 17px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .dlayer-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.fg-article .dlayer-body p { font-size: 12.5px; color: rgba(255,255,255,.58); line-height: 1.45; margin: 0; }
.fg-article .dstack-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .pillars { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 30px 0 8px; }
@media(max-width:600px){ .fg-article .pillars { grid-template-columns: 1fr; } }
.fg-article .pillar { background: linear-gradient(135deg,#0b0b16 0%,#0d1524 100%); border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; }
.fg-article .pillar-ic { width: 40px; height: 40px; border-radius: 10px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.fg-article .pillar-ic svg { width: 20px; height: 20px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .pillar h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .pillar .prot { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 8px; }
.fg-article .pillar p { font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .pillars-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .coi { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0c1018; }
.fg-article .coi-head { padding: 15px 20px; border-bottom: 1px solid #16161f; background: rgba(0,212,170,.05); display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }
.fg-article .coi-head h4 { font-family: Fraunces, serif; font-size: 17px; color: #fff; }
.fg-article .coi-head span { font-size: 11px; color: rgba(0,212,170,.7); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.fg-article .coi-body { padding: 16px 20px; }
.fg-article .coi-line { display: grid; grid-template-columns: 150px 1fr; gap: 12px; padding: 8px 0; border-bottom: 1px dashed #191922; font-size: 13.5px; }
.fg-article .coi-line:last-child { border-bottom: none; }
.fg-article .coi-line .k { color: rgba(0,212,170,.75); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; padding-top: 2px; }
.fg-article .coi-line .v { color: rgba(255,255,255,.78); line-height: 1.45; }
.fg-article .coi-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
@media(max-width:600px){ .fg-article .coi-line { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .pkg { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .pkg { grid-template-columns: 1fr; } }
.fg-article .pkg-cell { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 16px; background: #0b0b16; display: flex; gap: 12px; align-items: flex-start; }
.fg-article .pkg-cell.core { border-color: rgba(0,212,170,.3); background: linear-gradient(135deg,#0b0b16,#0a1a1a); }
.fg-article .pkg-ic { width: 34px; height: 34px; border-radius: 8px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.28); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .pkg-ic svg { width: 17px; height: 17px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .pkg-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .pkg-cell p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.45; margin: 0; }
.fg-article .pkg-cell .tag { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.75); }
.fg-article .pkg-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .gear { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .gear { grid-template-columns: 1fr; } }
.fg-article .gcol { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0b0b16; }
.fg-article .gcol h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.fg-article .gcol h4 svg { width: 18px; height: 18px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .gitem { font-size: 13.5px; color: rgba(255,255,255,.72); line-height: 1.45; padding: 7px 0; border-bottom: 1px solid #16161f; }
.fg-article .gitem:last-child { border-bottom: none; }
.fg-article .gitem b { color: #fff; }
.fg-article .gear-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .split { grid-template-columns: 1fr; } }
.fg-article .scol { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; background: linear-gradient(135deg,#0b0b16,#0d1524); }
.fg-article .scol .who { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: rgba(0,212,170,.7); margin-bottom: 6px; }
.fg-article .scol h4 { font-family: Fraunces, serif; font-size: 20px; color: #fff; margin-bottom: 8px; }
.fg-article .scol p { font-size: 13.5px; color: rgba(255,255,255,.62); line-height: 1.55; margin: 0; }
.fg-article .scol .scol-covers { font-size: 12px; color: rgba(0,212,170,.8); font-weight: 700; margin-top: 10px; }
.fg-article .split-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .eo { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .eo { grid-template-columns: 1fr; } }
.fg-article .eo-cell { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 16px; background: #0b0b16; }
.fg-article .eo-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .eo-cell p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.45; margin: 0; }
.fg-article .eo-cell .cross { color: #ff8a8a; font-weight: 700; margin-right: 5px; }
.fg-article .earn { background: rgba(0,212,170,.05); border: 1px solid rgba(0,212,170,.25); border-radius: 14px; padding: 18px 20px; margin: 22px 0 6px; }
.fg-article .earn h4 { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(0,212,170,.8); margin-bottom: 10px; }
.fg-article .earn-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; font-size: 13.5px; color: rgba(255,255,255,.78); }
.fg-article .earn-row svg { width: 15px; height: 15px; stroke: #00d4aa; fill: none; stroke-width: 2.5; flex-shrink: 0; }
.fg-article .eo-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .shield { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .shield { grid-template-columns: 1fr; } }
.fg-article .shcol { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; background: #0b0b16; }
.fg-article .shcol.bad { border-color: rgba(255,107,107,.3); }
.fg-article .shcol.good { border-color: rgba(0,212,170,.3); }
.fg-article .shcol h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.fg-article .shcol.bad h4 { color: #ff8a8a; }
.fg-article .shcol.good h4 { color: #00d4aa; }
.fg-article .shflow { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.fg-article .shflow-box { width: 100%; text-align: center; padding: 9px 10px; border-radius: 8px; font-size: 12.5px; font-weight: 600; }
.fg-article .fb-claim { background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.3); color: #ffce88; }
.fg-article .fb-you-bad { background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.35); color: #ff9a9a; }
.fg-article .fb-llc { background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); color: #7fe9d3; }
.fg-article .fb-you-good { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.14); color: rgba(255,255,255,.55); }
.fg-article .shflow-arrow { color: rgba(255,255,255,.3); font-size: 14px; }
.fg-article .shflow-arrow.blocked { color: #00d4aa; font-weight: 700; }
.fg-article .shield-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .contracts { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .ct-row { display: grid; grid-template-columns: 190px 1fr; gap: 0; border-bottom: 1px solid #16161f; }
.fg-article .ct-row:last-child { border-bottom: none; }
.fg-article .ct-row.head { background: rgba(0,212,170,.06); }
.fg-article .ct-name { padding: 13px 16px; font-family: 'Inter Tight', sans-serif; font-weight: 700; font-size: 13.5px; color: #fff; border-right: 1px solid #16161f; }
.fg-article .ct-row.head .ct-name, .fg-article .ct-row.head .ct-desc { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: rgba(0,212,170,.75); font-weight: 700; }
.fg-article .ct-desc { padding: 13px 16px; font-size: 13.5px; color: rgba(255,255,255,.66); line-height: 1.5; }
@media(max-width:600px){ .fg-article .ct-row { grid-template-columns: 1fr; } .fg-article .ct-name { border-right: none; border-bottom: 1px solid #16161f; } }
.fg-article .contracts-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .ec { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .ec { grid-template-columns: 1fr; } }
.fg-article .eccol { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0b0b16; }
.fg-article .eccol h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .eccol .sub { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 12px; }
.fg-article .ec-item { font-size: 13px; color: rgba(255,255,255,.72); line-height: 1.45; padding: 6px 0; border-bottom: 1px solid #16161f; }
.fg-article .ec-item:last-child { border-bottom: none; }
.fg-article .ec-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .claimlayers { margin: 30px 0 6px; }
.fg-article .claimlyr { display: flex; align-items: center; gap: 14px; border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; margin-bottom: 8px; background: linear-gradient(90deg, rgba(0,212,170,.05), transparent); }
.fg-article .claimlyr:last-child { margin-bottom: 0; }
.fg-article .claimlyr.last { background: linear-gradient(90deg, rgba(255,107,107,.06), transparent); border-color: rgba(255,107,107,.25); }
.fg-article .claimlyr-n { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); color: #00d4aa; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .claimlyr.last .claimlyr-n { background: rgba(255,107,107,.12); border-color: rgba(255,107,107,.35); color: #ff8a8a; }
.fg-article .claimlyr-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.fg-article .claimlyr-body p { font-size: 12.5px; color: rgba(255,255,255,.58); line-height: 1.45; margin: 0; }
.fg-article .claimlayers-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .esc { margin: 30px 0 6px; display: flex; flex-direction: column; gap: 8px; }
.fg-article .esc-step { display: flex; align-items: center; gap: 14px; border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; }
.fg-article .esc-step.s1 { background: linear-gradient(90deg, rgba(0,212,170,.08), transparent); border-color: rgba(0,212,170,.3); }
.fg-article .esc-step.s2 { background: linear-gradient(90deg, rgba(0,212,170,.05), transparent); }
.fg-article .esc-step.s3 { background: linear-gradient(90deg, rgba(255,180,80,.05), transparent); }
.fg-article .esc-step.s4 { background: linear-gradient(90deg, rgba(255,107,107,.05), transparent); border-color: rgba(255,107,107,.25); }
.fg-article .esc-n { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.fg-article .esc-step.s1 .esc-n { background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.4); color: #00d4aa; }
.fg-article .esc-step.s2 .esc-n { background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); color: #7fe9d3; }
.fg-article .esc-step.s3 .esc-n { background: rgba(255,180,80,.12); border: 1px solid rgba(255,180,80,.35); color: #ffb450; }
.fg-article .esc-step.s4 .esc-n { background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.35); color: #ff8a8a; }
.fg-article .esc-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.fg-article .esc-body p { font-size: 12.5px; color: rgba(255,255,255,.58); line-height: 1.45; margin: 0; }
.fg-article .esc-cost { margin-left: auto; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(255,255,255,.4); white-space: nowrap; flex-shrink: 0; }
.fg-article .esc-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
@media(max-width:600px){ .fg-article .esc-cost { display: none; } }
.fg-article code { font-family: 'Courier New', monospace; font-size: 0.92em; background: rgba(0,212,170,.08); border: 1px solid rgba(0,212,170,.2); color: #7fe9d3; padding: 1px 6px; border-radius: 5px; }
`;
function CourseChapter() {
  const { courseSlug = "", chapterSlug = "" } = useParams();
  const [course, setCourse] = useState(() => getCourse(courseSlug));
  useEffect(() => {
    const cached = getCourse(courseSlug);
    if (cached) {
      if (cached !== course) setCourse(cached);
      return;
    }
    let cancelled = false;
    loadCourse(courseSlug).then((c) => {
      if (!cancelled) setCourse(c);
    });
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);
  const chapter = course == null ? void 0 : course.chapters.find((c) => c.slug === chapterSlug);
  if (!course) {
    return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh", padding: "80px 24px", textAlign: "center", fontFamily: "'Inter Tight', sans-serif" }, children: [
      /* @__PURE__ */ jsx("h1", { style: { fontFamily: "'Fraunces', serif", fontSize: 40 }, children: "Course coming soon" }),
      /* @__PURE__ */ jsx(Link, { to: "/academy/education", style: { color: "#00d4aa" }, children: "← Back to Education Modules" })
    ] });
  }
  if (!chapter) {
    return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh", padding: "80px 24px", textAlign: "center", fontFamily: "'Inter Tight', sans-serif" }, children: [
      /* @__PURE__ */ jsx("h1", { style: { fontFamily: "'Fraunces', serif", fontSize: 40, marginBottom: 12 }, children: "Chapter coming soon" }),
      /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,.55)", marginBottom: 20 }, children: "This chapter isn't written yet." }),
      /* @__PURE__ */ jsxs(Link, { to: `/academy/${course.slug}`, style: { color: "#00d4aa" }, children: [
        "← Back to ",
        course.title
      ] })
    ] });
  }
  const idx = course.chapters.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? course.chapters[idx - 1] : null;
  const next = idx < course.chapters.length - 1 ? course.chapters[idx + 1] : null;
  const currentModule = course.modules.find((m) => m.key === chapter.moduleKey);
  const seoTitle = chapter.seoTitle || `${chapter.title} | ${course.title} | Filmmaker Genius`;
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: seoTitle,
        description: chapter.seoDesc || `${chapter.title} — a chapter from the ${course.title} course on Filmmaker Genius Academy.`,
        canonical: `https://filmmakergenius.com/academy/${course.slug}/${chapter.slug}`,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: chapter.title,
            description: chapter.seoDesc || `${chapter.title} — a chapter from ${course.title}.`,
            author: { "@type": "Person", name: "Will Roberts" },
            publisher: {
              "@type": "Organization",
              name: "Filmmaker Genius",
              logo: { "@type": "ImageObject", url: "https://filmmakergenius.com/og-image.jpg" }
            },
            url: `https://filmmakergenius.com/academy/${course.slug}/${chapter.slug}`,
            isPartOf: {
              "@type": "Course",
              name: course.title,
              url: `https://filmmakergenius.com/academy/${course.slug}`
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
              { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
              { "@type": "ListItem", position: 3, name: course.title, item: `https://filmmakergenius.com/academy/${course.slug}` },
              { "@type": "ListItem", position: 4, name: chapter.title, item: `https://filmmakergenius.com/academy/${course.slug}/${chapter.slug}` }
            ]
          }
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { children: ARTICLE_CSS }),
    /* @__PURE__ */ jsxs("div", { className: "wrap", style: { maxWidth: 820, margin: "0 auto", padding: "0 24px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { padding: "20px 0 0", fontSize: 13, color: "rgba(255,255,255,.35)" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/academy", className: "cc-a", style: { color: "rgba(255,255,255,.35)", textDecoration: "none" }, children: "Academy" }),
        /* @__PURE__ */ jsx("span", { style: { margin: "0 8px" }, children: "›" }),
        /* @__PURE__ */ jsx(Link, { to: "/academy/education", className: "cc-a", style: { color: "rgba(255,255,255,.35)", textDecoration: "none" }, children: "Education Modules" }),
        /* @__PURE__ */ jsx("span", { style: { margin: "0 8px" }, children: "›" }),
        /* @__PURE__ */ jsx(Link, { to: `/academy/${course.slug}`, className: "cc-a", style: { color: "rgba(255,255,255,.35)", textDecoration: "none" }, children: course.title }),
        /* @__PURE__ */ jsx("span", { style: { margin: "0 8px" }, children: "›" }),
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,.6)" }, children: chapter.title })
      ] }),
      /* @__PURE__ */ jsxs("header", { style: { padding: "30px 0 8px", borderBottom: "1px solid #1e1e35", marginBottom: 40 }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 18 }, children: [
          currentModule && /* @__PURE__ */ jsx("span", { style: { background: "rgba(0,212,170,.1)", border: "1px solid rgba(0,212,170,.25)", color: "#00d4aa", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999 }, children: currentModule.label }),
          /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, color: "rgba(255,255,255,.4)" }, children: [
            "Chapter ",
            chapter.num,
            " · ",
            chapter.time,
            " read"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 14 }, children: [
          course.title,
          " · ",
          /* @__PURE__ */ jsx("b", { style: { color: "rgba(0,212,170,.75)", fontWeight: 700 }, children: chapter.kicker })
        ] }),
        /* @__PURE__ */ jsx("h1", { style: { fontFamily: "'Fraunces', serif", fontSize: 46, lineHeight: 1.08, margin: "0 0 16px" }, children: chapter.title }),
        chapter.dek && /* @__PURE__ */ jsx("p", { style: { fontSize: 18, color: "rgba(255,255,255,.6)", lineHeight: 1.55, margin: 0 }, dangerouslySetInnerHTML: { __html: chapter.dek } })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#00d4aa 0%,#0a7a63 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#031418" }, children: "WR" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, color: "#fff", fontSize: 14 }, children: "Will Roberts" }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,.5)" }, children: "Working filmmaker · Written from the set" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { position: "relative", width: "100%", paddingTop: "56.25%", background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)", border: "1px solid rgba(0,212,170,.2)", borderRadius: 16, overflow: "hidden", marginBottom: 38 }, children: /* @__PURE__ */ jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 64, height: 64, borderRadius: "50%", background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "#00d4aa", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { style: { background: "rgba(0,212,170,.12)", border: "1px solid rgba(0,212,170,.3)", color: "#00d4aa", padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }, children: "Video Lesson — Coming Soon" })
      ] }) }),
      chapter.body ? /* @__PURE__ */ jsx("div", { className: "fg-article", dangerouslySetInnerHTML: { __html: chapter.body } }) : /* @__PURE__ */ jsx("div", { className: "fg-article", children: /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,.55)" }, children: "This chapter is being written. Check back soon — Will's on set. In the meantime, the chapters already published in this course are a great place to start." }) }),
      course.pairsWithName && course.pairsWithUrl && /* @__PURE__ */ jsxs("div", { className: "tool-cta", style: { background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)", border: "1px solid rgba(0,212,170,.25)", borderRadius: 16, padding: 30, margin: "40px 0", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 54, height: 54, borderRadius: 12, background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "#00d4aa", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 220 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#00d4aa", marginBottom: 6 }, children: "Pairs with this chapter" }),
          /* @__PURE__ */ jsx("div", { style: { fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 8 }, children: course.pairsWithName }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "rgba(255,255,255,.7)", lineHeight: 1.55, margin: 0 }, children: course.pairsWithDesc })
        ] }),
        /* @__PURE__ */ jsxs("a", { href: course.pairsWithUrl, target: "_blank", rel: "noreferrer", style: { background: "#00d4aa", color: "#031418", padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }, children: [
          "Open ",
          course.pairsWithName,
          " →"
        ] })
      ] }),
      chapter.takeaways.length > 0 && /* @__PURE__ */ jsxs("div", { style: { background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 16, padding: "28px 30px", margin: "44px 0" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.3)", margin: "0 0 18px" }, children: "Key takeaways" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: chapter.takeaways.map((t, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, alignItems: "flex-start" }, children: [
          /* @__PURE__ */ jsx("span", { style: { flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00d4aa", fontSize: 11, fontWeight: 700, marginTop: 1 }, children: "✓" }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 15, color: "rgba(255,255,255,.78)", lineHeight: 1.55 }, children: t })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "48px 0 24px" }, className: "cc-nav-grid", children: [
        /* @__PURE__ */ jsx("style", { children: `@media (max-width:600px){.cc-nav-grid{grid-template-columns:1fr !important;}}` }),
        prev ? /* @__PURE__ */ jsxs(Link, { to: `/academy/${course.slug}/${prev.slug}`, className: "cc-nav-card", style: { display: "block", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "20px 22px", minHeight: 92, textDecoration: "none", color: "#fff" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,.4)", marginBottom: 6 }, children: "← Previous" }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: prev.title })
        ] }) : /* @__PURE__ */ jsxs("div", { style: { border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "20px 22px", minHeight: 92, opacity: 0.35, pointerEvents: "none" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,.4)", marginBottom: 6 }, children: "← Previous" }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: "You're at the beginning" })
        ] }),
        next ? /* @__PURE__ */ jsxs(Link, { to: `/academy/${course.slug}/${next.slug}`, className: "cc-nav-card", style: { display: "block", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "20px 22px", minHeight: 92, textDecoration: "none", color: "#fff", textAlign: "right" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "#00d4aa", marginBottom: 6, fontWeight: 600 }, children: "Next Chapter →" }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: next.title })
        ] }) : /* @__PURE__ */ jsxs("div", { style: { border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "20px 22px", minHeight: 92, opacity: 0.35, pointerEvents: "none", textAlign: "right" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "#00d4aa", marginBottom: 6, fontWeight: 600 }, children: "Next Chapter →" }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 15, fontWeight: 600 }, children: "You've finished the course" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { marginBottom: 60 }, children: /* @__PURE__ */ jsxs(Link, { to: `/academy/${course.slug}`, className: "cc-a", style: { fontSize: 14, color: "rgba(255,255,255,.5)", textDecoration: "none" }, children: [
        "← Back to ",
        course.title
      ] }) })
    ] })
  ] });
}
const NotFound = () => {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-4 text-6xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-xl text-muted-foreground", children: "Oops! Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mb-8 text-muted-foreground", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(Button, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Home, { className: "h-4 w-4" }),
      "Return to Home"
    ] }) })
  ] }) });
};
const AppRoutes = () => /* @__PURE__ */ jsx(GlobalLayout, { children: /* @__PURE__ */ jsxs(Routes, { children: [
  /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(HomeMarketing, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsx(Contact, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/faq", element: /* @__PURE__ */ jsx(FAQ, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/pricing", element: /* @__PURE__ */ jsx(Pricing, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/privacy", element: /* @__PURE__ */ jsx(Privacy, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/terms", element: /* @__PURE__ */ jsx(Terms, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/toolbox", element: /* @__PURE__ */ jsx(Toolbox, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/recut", element: /* @__PURE__ */ jsx(Recut, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/crew-hire", element: /* @__PURE__ */ jsx(CrewHire, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/membership", element: /* @__PURE__ */ jsx(Membership, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/blog", element: /* @__PURE__ */ jsx(Blog, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/blog/:slug", element: /* @__PURE__ */ jsx(BlogPost, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy", element: /* @__PURE__ */ jsx(Academy, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/education", element: /* @__PURE__ */ jsx(EducationModules, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/education-modules", element: /* @__PURE__ */ jsx(EducationModules, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/roberts-filmmaking", element: /* @__PURE__ */ jsx(RobertsFilmmaking, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/roberts-filmmaking/:chapterId", element: /* @__PURE__ */ jsx(RobertsChapter, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/aggregators", element: /* @__PURE__ */ jsx(MonetizationHub, { hubKey: "aggregators" }) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/distributors", element: /* @__PURE__ */ jsx(MonetizationHub, { hubKey: "distributors" }) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/vod", element: /* @__PURE__ */ jsx(MonetizationHub, { hubKey: "vod" }) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/aggregators/:slug", element: /* @__PURE__ */ jsx(MonetizationSubPage, { group: "aggregators" }) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/distributors/:slug", element: /* @__PURE__ */ jsx(MonetizationSubPage, { group: "distributors" }) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/vod/:slug", element: /* @__PURE__ */ jsx(MonetizationSubPage, { group: "vod" }) }),
  /* @__PURE__ */ jsx(Route, { path: "/green-light-engine", element: /* @__PURE__ */ jsx(GreenLightEngine, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/green-light-engine/niche", element: /* @__PURE__ */ jsx(GleNiche, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/green-light-engine/niche/:slug", element: /* @__PURE__ */ jsx(GleNichePage, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/green-light-engine/:tier", element: /* @__PURE__ */ jsx(GleTier, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/:courseSlug", element: /* @__PURE__ */ jsx(CoursePage, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/academy/:courseSlug/:chapterSlug", element: /* @__PURE__ */ jsx(CourseChapter, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
] }) });
async function preloadForUrl(url2) {
  const m = url2.match(/^\/academy\/([^/]+)(?:\/[^/]+)?\/?$/);
  if (!m) return;
  const slug = m[1];
  if (courseSlugs.includes(slug)) {
    await loadCourse(slug);
  }
}
async function render(url2) {
  await preloadForUrl(url2);
  const helmetContext = {};
  const queryClient = new QueryClient();
  const html = renderToString(
    /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url2, children: /* @__PURE__ */ jsx(AppRoutes, {}) }) }) }) }) })
  );
  return { html, helmet: helmetContext.helmet };
}
export {
  render
};
