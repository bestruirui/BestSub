package router

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
)

// Method represents HTTP methods
type Method string

const (
	GET     Method = "GET"
	POST    Method = "POST"
	PUT     Method = "PUT"
	DELETE  Method = "DELETE"
	HEAD    Method = "HEAD"
	OPTIONS Method = "OPTIONS"
	PATCH   Method = "PATCH"
	ANY     Method = "ANY"
)

// GroupRouter represents a group of routes with shared path prefix and middlewares
type GroupRouter struct {
	Path        string
	Routes      []*Route
	Middlewares []gin.HandlerFunc
}

// NewGroupRouter creates a new GroupRouter with the given path and automatically registers it.
func NewGroupRouter(path string) *GroupRouter {
	router := &GroupRouter{
		Path:   path,
		Routes: make([]*Route, 0),
	}
	registeredRouters = append(registeredRouters, router)
	return router
}

// Use adds middlewares to the group.
func (g *GroupRouter) Use(middlewares ...gin.HandlerFunc) *GroupRouter {
	g.Middlewares = append(g.Middlewares, middlewares...)
	return g
}

// AddRoute adds a route to the group.
func (g *GroupRouter) AddRoute(route *Route) *GroupRouter {
	g.Routes = append(g.Routes, route)
	return g
}

// Route defines a single endpoint with its handlers and middlewares.
type Route struct {
	Path        string
	Method      Method
	Handlers    []gin.HandlerFunc
	Middlewares []gin.HandlerFunc
}

// NewRoute creates a new Route instance with the given path and method.
func NewRoute(path string, method Method) *Route {
	return &Route{
		Path:     path,
		Method:   method,
		Handlers: make([]gin.HandlerFunc, 0),
	}
}

// Handle adds handler functions to the route.
func (r *Route) Handle(handlers ...gin.HandlerFunc) *Route {
	r.Handlers = append(r.Handlers, handlers...)
	return r
}

// Use adds middlewares to the route.
func (r *Route) Use(middlewares ...gin.HandlerFunc) *Route {
	r.Middlewares = append(r.Middlewares, middlewares...)
	return r
}

// Validate checks if the route is valid
func (r *Route) Validate() error {
	if len(r.Handlers) == 0 {
		return fmt.Errorf("route must have at least one handler")
	}
	return nil
}

// Global registry for route groups
var registeredRouters []*GroupRouter

// GetRouterCount returns the total count of registered routes
func GetRouterCount() int {
	count := 0
	for _, router := range registeredRouters {
		count += len(router.Routes)
	}
	return count
}

// RegisterAll registers all globally registered route groups to the Gin engine
func RegisterAll(engine *gin.Engine) error {
	for _, router := range registeredRouters {
		// Validate all routes in the group first
		for _, route := range router.Routes {
			if err := route.Validate(); err != nil {
				return fmt.Errorf("invalid route in group %s: %w", router.Path, err)
			}
		}

		// Create the route group
		group := engine.Group(router.Path, router.Middlewares...)

		// Register all routes in the group
		for _, route := range router.Routes {
			handlers := make([]gin.HandlerFunc, 0, len(route.Middlewares)+len(route.Handlers))
			handlers = append(handlers, route.Middlewares...)
			handlers = append(handlers, route.Handlers...)

			registerRoute(group, route.Method, route.Path, handlers)
		}
	}

	return nil
}

// registerRoute registers a single route to a Gin route group.
func registerRoute(group *gin.RouterGroup, method Method, path string, handlers []gin.HandlerFunc) {
	if len(handlers) == 0 {
		return
	}

	if path != "" {
		if !strings.HasPrefix(path, "/") {
			path = "/" + path
		}
	}

	switch method {
	case GET:
		group.GET(path, handlers...)
	case POST:
		group.POST(path, handlers...)
	case PUT:
		group.PUT(path, handlers...)
	case DELETE:
		group.DELETE(path, handlers...)
	case HEAD:
		group.HEAD(path, handlers...)
	case OPTIONS:
		group.OPTIONS(path, handlers...)
	case PATCH:
		group.PATCH(path, handlers...)
	case ANY:
		group.Any(path, handlers...)
	default:
		group.GET(path, handlers...)
	}
}
