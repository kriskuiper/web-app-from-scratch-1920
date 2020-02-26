import { wrap } from 'https://unpkg.com/comlink@alpha/dist/esm/comlink.mjs';

class Route {
	constructor(pathname, component) {
		this.pathname = pathname;
		this.component = component;
	}

	render() {
		return this.component.render()
	}
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var redom = createCommonjsModule(function (module, exports) {
(function (global, factory) {
   factory(exports) ;
}(commonjsGlobal, (function (exports) {
  function parseQuery (query) {
    var chunks = query.split(/([#.])/);
    var tagName = '';
    var id = '';
    var classNames = [];

    for (var i = 0; i < chunks.length; i++) {
      var chunk = chunks[i];
      if (chunk === '#') {
        id = chunks[++i];
      } else if (chunk === '.') {
        classNames.push(chunks[++i]);
      } else if (chunk.length) {
        tagName = chunk;
      }
    }

    return {
      tag: tagName || 'div',
      id: id,
      className: classNames.join(' ')
    };
  }

  function createElement (query, ns) {
    var ref = parseQuery(query);
    var tag = ref.tag;
    var id = ref.id;
    var className = ref.className;
    var element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);

    if (id) {
      element.id = id;
    }

    if (className) {
      if (ns) {
        element.setAttribute('class', className);
      } else {
        element.className = className;
      }
    }

    return element;
  }

  function unmount (parent, child) {
    var parentEl = getEl(parent);
    var childEl = getEl(child);

    if (child === childEl && childEl.__redom_view) {
      // try to look up the view if not provided
      child = childEl.__redom_view;
    }

    if (childEl.parentNode) {
      doUnmount(child, childEl, parentEl);

      parentEl.removeChild(childEl);
    }

    return child;
  }

  function doUnmount (child, childEl, parentEl) {
    var hooks = childEl.__redom_lifecycle;

    if (hooksAreEmpty(hooks)) {
      childEl.__redom_lifecycle = {};
      return;
    }

    var traverse = parentEl;

    if (childEl.__redom_mounted) {
      trigger(childEl, 'onunmount');
    }

    while (traverse) {
      var parentHooks = traverse.__redom_lifecycle || {};

      for (var hook in hooks) {
        if (parentHooks[hook]) {
          parentHooks[hook] -= hooks[hook];
        }
      }

      if (hooksAreEmpty(parentHooks)) {
        traverse.__redom_lifecycle = null;
      }

      traverse = traverse.parentNode;
    }
  }

  function hooksAreEmpty (hooks) {
    if (hooks == null) {
      return true;
    }
    for (var key in hooks) {
      if (hooks[key]) {
        return false;
      }
    }
    return true;
  }

  /* global Node, ShadowRoot */

  var hookNames = ['onmount', 'onremount', 'onunmount'];
  var shadowRootAvailable = typeof window !== 'undefined' && 'ShadowRoot' in window;

  function mount (parent, child, before, replace) {
    var parentEl = getEl(parent);
    var childEl = getEl(child);

    if (child === childEl && childEl.__redom_view) {
      // try to look up the view if not provided
      child = childEl.__redom_view;
    }

    if (child !== childEl) {
      childEl.__redom_view = child;
    }

    var wasMounted = childEl.__redom_mounted;
    var oldParent = childEl.parentNode;

    if (wasMounted && (oldParent !== parentEl)) {
      doUnmount(child, childEl, oldParent);
    }

    if (before != null) {
      if (replace) {
        parentEl.replaceChild(childEl, getEl(before));
      } else {
        parentEl.insertBefore(childEl, getEl(before));
      }
    } else {
      parentEl.appendChild(childEl);
    }

    doMount(child, childEl, parentEl, oldParent);

    return child;
  }

  function trigger (el, eventName) {
    if (eventName === 'onmount' || eventName === 'onremount') {
      el.__redom_mounted = true;
    } else if (eventName === 'onunmount') {
      el.__redom_mounted = false;
    }

    var hooks = el.__redom_lifecycle;

    if (!hooks) {
      return;
    }

    var view = el.__redom_view;
    var hookCount = 0;

    view && view[eventName] && view[eventName]();

    for (var hook in hooks) {
      if (hook) {
        hookCount++;
      }
    }

    if (hookCount) {
      var traverse = el.firstChild;

      while (traverse) {
        var next = traverse.nextSibling;

        trigger(traverse, eventName);

        traverse = next;
      }
    }
  }

  function doMount (child, childEl, parentEl, oldParent) {
    var hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});
    var remount = (parentEl === oldParent);
    var hooksFound = false;

    for (var i = 0, list = hookNames; i < list.length; i += 1) {
      var hookName = list[i];

      if (!remount) { // if already mounted, skip this phase
        if (child !== childEl) { // only Views can have lifecycle events
          if (hookName in child) {
            hooks[hookName] = (hooks[hookName] || 0) + 1;
          }
        }
      }
      if (hooks[hookName]) {
        hooksFound = true;
      }
    }

    if (!hooksFound) {
      childEl.__redom_lifecycle = {};
      return;
    }

    var traverse = parentEl;
    var triggered = false;

    if (remount || (traverse && traverse.__redom_mounted)) {
      trigger(childEl, remount ? 'onremount' : 'onmount');
      triggered = true;
    }

    while (traverse) {
      var parent = traverse.parentNode;
      var parentHooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

      for (var hook in hooks) {
        parentHooks[hook] = (parentHooks[hook] || 0) + hooks[hook];
      }

      if (triggered) {
        break;
      } else {
        if (traverse.nodeType === Node.DOCUMENT_NODE ||
          (shadowRootAvailable && (traverse instanceof ShadowRoot)) ||
          (parent && parent.__redom_mounted)
        ) {
          trigger(traverse, remount ? 'onremount' : 'onmount');
          triggered = true;
        }
        traverse = parent;
      }
    }
  }

  function setStyle (view, arg1, arg2) {
    var el = getEl(view);

    if (typeof arg1 === 'object') {
      for (var key in arg1) {
        setStyleValue(el, key, arg1[key]);
      }
    } else {
      setStyleValue(el, arg1, arg2);
    }
  }

  function setStyleValue (el, key, value) {
    if (value == null) {
      el.style[key] = '';
    } else {
      el.style[key] = value;
    }
  }

  /* global SVGElement */

  var xlinkns = 'http://www.w3.org/1999/xlink';

  function setAttr (view, arg1, arg2) {
    setAttrInternal(view, arg1, arg2);
  }

  function setAttrInternal (view, arg1, arg2, initial) {
    var el = getEl(view);

    var isObj = typeof arg1 === 'object';

    if (isObj) {
      for (var key in arg1) {
        setAttrInternal(el, key, arg1[key], initial);
      }
    } else {
      var isSVG = el instanceof SVGElement;
      var isFunc = typeof arg2 === 'function';

      if (arg1 === 'style' && typeof arg2 === 'object') {
        setStyle(el, arg2);
      } else if (isSVG && isFunc) {
        el[arg1] = arg2;
      } else if (arg1 === 'dataset') {
        setData(el, arg2);
      } else if (!isSVG && (arg1 in el || isFunc) && (arg1 !== 'list')) {
        el[arg1] = arg2;
      } else {
        if (isSVG && (arg1 === 'xlink')) {
          setXlink(el, arg2);
          return;
        }
        if (initial && arg1 === 'class') {
          arg2 = el.className + ' ' + arg2;
        }
        if (arg2 == null) {
          el.removeAttribute(arg1);
        } else {
          el.setAttribute(arg1, arg2);
        }
      }
    }
  }

  function setXlink (el, arg1, arg2) {
    if (typeof arg1 === 'object') {
      for (var key in arg1) {
        setXlink(el, key, arg1[key]);
      }
    } else {
      if (arg2 != null) {
        el.setAttributeNS(xlinkns, arg1, arg2);
      } else {
        el.removeAttributeNS(xlinkns, arg1, arg2);
      }
    }
  }

  function setData (el, arg1, arg2) {
    if (typeof arg1 === 'object') {
      for (var key in arg1) {
        setData(el, key, arg1[key]);
      }
    } else {
      if (arg2 != null) {
        el.dataset[arg1] = arg2;
      } else {
        delete el.dataset[arg1];
      }
    }
  }

  function text (str) {
    return document.createTextNode((str != null) ? str : '');
  }

  function parseArgumentsInternal (element, args, initial) {
    for (var i = 0, list = args; i < list.length; i += 1) {
      var arg = list[i];

      if (arg !== 0 && !arg) {
        continue;
      }

      var type = typeof arg;

      if (type === 'function') {
        arg(element);
      } else if (type === 'string' || type === 'number') {
        element.appendChild(text(arg));
      } else if (isNode(getEl(arg))) {
        mount(element, arg);
      } else if (arg.length) {
        parseArgumentsInternal(element, arg, initial);
      } else if (type === 'object') {
        setAttrInternal(element, arg, null, initial);
      }
    }
  }

  function ensureEl (parent) {
    return typeof parent === 'string' ? html(parent) : getEl(parent);
  }

  function getEl (parent) {
    return (parent.nodeType && parent) || (!parent.el && parent) || getEl(parent.el);
  }

  function isNode (arg) {
    return arg && arg.nodeType;
  }

  var htmlCache = {};

  function html (query) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var element;

    var type = typeof query;

    if (type === 'string') {
      element = memoizeHTML(query).cloneNode(false);
    } else if (isNode(query)) {
      element = query.cloneNode(false);
    } else if (type === 'function') {
      var Query = query;
      element = new (Function.prototype.bind.apply( Query, [ null ].concat( args) ));
    } else {
      throw new Error('At least one argument required');
    }

    parseArgumentsInternal(getEl(element), args, true);

    return element;
  }

  var el = html;
  var h = html;

  html.extend = function extendHtml (query) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var clone = memoizeHTML(query);

    return html.bind.apply(html, [ this, clone ].concat( args ));
  };

  function memoizeHTML (query) {
    return htmlCache[query] || (htmlCache[query] = createElement(query));
  }

  function setChildren (parent) {
    var children = [], len = arguments.length - 1;
    while ( len-- > 0 ) children[ len ] = arguments[ len + 1 ];

    var parentEl = getEl(parent);
    var current = traverse(parent, children, parentEl.firstChild);

    while (current) {
      var next = current.nextSibling;

      unmount(parent, current);

      current = next;
    }
  }

  function traverse (parent, children, _current) {
    var current = _current;

    var childEls = new Array(children.length);

    for (var i = 0; i < children.length; i++) {
      childEls[i] = children[i] && getEl(children[i]);
    }

    for (var i$1 = 0; i$1 < children.length; i$1++) {
      var child = children[i$1];

      if (!child) {
        continue;
      }

      var childEl = childEls[i$1];

      if (childEl === current) {
        current = current.nextSibling;
        continue;
      }

      if (isNode(childEl)) {
        var next = current && current.nextSibling;
        var exists = child.__redom_index != null;
        var replace = exists && next === childEls[i$1 + 1];

        mount(parent, child, current, replace);

        if (replace) {
          current = next;
        }

        continue;
      }

      if (child.length != null) {
        current = traverse(parent, child, current);
      }
    }

    return current;
  }

  function listPool (View, key, initData) {
    return new ListPool(View, key, initData);
  }

  var ListPool = function ListPool (View, key, initData) {
    this.View = View;
    this.initData = initData;
    this.oldLookup = {};
    this.lookup = {};
    this.oldViews = [];
    this.views = [];

    if (key != null) {
      this.key = typeof key === 'function' ? key : propKey(key);
    }
  };

  ListPool.prototype.update = function update (data, context) {
    var ref = this;
      var View = ref.View;
      var key = ref.key;
      var initData = ref.initData;
    var keySet = key != null;

    var oldLookup = this.lookup;
    var newLookup = {};

    var newViews = new Array(data.length);
    var oldViews = this.views;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var view = (void 0);

      if (keySet) {
        var id = key(item);

        view = oldLookup[id] || new View(initData, item, i, data);
        newLookup[id] = view;
        view.__redom_id = id;
      } else {
        view = oldViews[i] || new View(initData, item, i, data);
      }
      view.update && view.update(item, i, data, context);

      var el = getEl(view.el);

      el.__redom_view = view;
      newViews[i] = view;
    }

    this.oldViews = oldViews;
    this.views = newViews;

    this.oldLookup = oldLookup;
    this.lookup = newLookup;
  };

  function propKey (key) {
    return function (item) {
      return item[key];
    };
  }

  function list (parent, View, key, initData) {
    return new List(parent, View, key, initData);
  }

  var List = function List (parent, View, key, initData) {
    this.__redom_list = true;
    this.View = View;
    this.initData = initData;
    this.views = [];
    this.pool = new ListPool(View, key, initData);
    this.el = ensureEl(parent);
    this.keySet = key != null;
  };

  List.prototype.update = function update (data, context) {
      if ( data === void 0 ) data = [];

    var ref = this;
      var keySet = ref.keySet;
    var oldViews = this.views;

    this.pool.update(data, context);

    var ref$1 = this.pool;
      var views = ref$1.views;
      var lookup = ref$1.lookup;

    if (keySet) {
      for (var i = 0; i < oldViews.length; i++) {
        var oldView = oldViews[i];
        var id = oldView.__redom_id;

        if (lookup[id] == null) {
          oldView.__redom_index = null;
          unmount(this, oldView);
        }
      }
    }

    for (var i$1 = 0; i$1 < views.length; i$1++) {
      var view = views[i$1];

      view.__redom_index = i$1;
    }

    setChildren(this, views);

    if (keySet) {
      this.lookup = lookup;
    }
    this.views = views;
  };

  List.extend = function extendList (parent, View, key, initData) {
    return List.bind(List, parent, View, key, initData);
  };

  list.extend = List.extend;

  /* global Node */

  function place (View, initData) {
    return new Place(View, initData);
  }

  var Place = function Place (View, initData) {
    this.el = text('');
    this.visible = false;
    this.view = null;
    this._placeholder = this.el;

    if (View instanceof Node) {
      this._el = View;
    } else if (View.el instanceof Node) {
      this._el = View;
      this.view = View;
    } else {
      this._View = View;
    }

    this._initData = initData;
  };

  Place.prototype.update = function update (visible, data) {
    var placeholder = this._placeholder;
    var parentNode = this.el.parentNode;

    if (visible) {
      if (!this.visible) {
        if (this._el) {
          mount(parentNode, this._el, placeholder);
          unmount(parentNode, placeholder);

          this.el = getEl(this._el);
          this.visible = visible;
        } else {
          var View = this._View;
          var view = new View(this._initData);

          this.el = getEl(view);
          this.view = view;

          mount(parentNode, view, placeholder);
          unmount(parentNode, placeholder);
        }
      }
      this.view && this.view.update && this.view.update(data);
    } else {
      if (this.visible) {
        if (this._el) {
          mount(parentNode, placeholder, this._el);
          unmount(parentNode, this._el);

          this.el = placeholder;
          this.visible = visible;

          return;
        }
        mount(parentNode, placeholder, this.view);
        unmount(parentNode, this.view);

        this.el = placeholder;
        this.view = null;
      }
    }
    this.visible = visible;
  };

  /* global Node */

  function router (parent, Views, initData) {
    return new Router(parent, Views, initData);
  }

  var Router = function Router (parent, Views, initData) {
    this.el = ensureEl(parent);
    this.Views = Views;
    this.initData = initData;
  };

  Router.prototype.update = function update (route, data) {
    if (route !== this.route) {
      var Views = this.Views;
      var View = Views[route];

      this.route = route;

      if (View && (View instanceof Node || View.el instanceof Node)) {
        this.view = View;
      } else {
        this.view = View && new View(this.initData, data);
      }

      setChildren(this.el, [this.view]);
    }
    this.view && this.view.update && this.view.update(data, route);
  };

  var ns = 'http://www.w3.org/2000/svg';

  var svgCache = {};

  function svg (query) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var element;

    var type = typeof query;

    if (type === 'string') {
      element = memoizeSVG(query).cloneNode(false);
    } else if (isNode(query)) {
      element = query.cloneNode(false);
    } else if (type === 'function') {
      var Query = query;
      element = new (Function.prototype.bind.apply( Query, [ null ].concat( args) ));
    } else {
      throw new Error('At least one argument required');
    }

    parseArgumentsInternal(getEl(element), args, true);

    return element;
  }

  var s = svg;

  svg.extend = function extendSvg (query) {
    var clone = memoizeSVG(query);

    return svg.bind(this, clone);
  };

  svg.ns = ns;

  function memoizeSVG (query) {
    return svgCache[query] || (svgCache[query] = createElement(query, ns));
  }

  exports.List = List;
  exports.ListPool = ListPool;
  exports.Place = Place;
  exports.Router = Router;
  exports.el = el;
  exports.h = h;
  exports.html = html;
  exports.list = list;
  exports.listPool = listPool;
  exports.mount = mount;
  exports.place = place;
  exports.router = router;
  exports.s = s;
  exports.setAttr = setAttr;
  exports.setChildren = setChildren;
  exports.setData = setData;
  exports.setStyle = setStyle;
  exports.setXlink = setXlink;
  exports.svg = svg;
  exports.text = text;
  exports.unmount = unmount;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
});

var redom$1 = unwrapExports(redom);

class EventDispatcher {
	constructor() {
		this.events = {};
	}

	subscribe(eventName, callback) {
		/*
			Explicitly set the this context because we use our EventDispatcher
			inside the store which has another this context
		*/
		const self = this;

		/*
			If no event is yet present then set it to an empty array so we don't
			have to do any further typechecking and can just push the callback
		*/
		if (!self.events[eventName]) {
			self.events[eventName] = [];
		}

		self.events[eventName].push(callback);
	}

	dispatch(eventName, payload = {}) {
		const self = this;

		if (!self.events[eventName]) {
			throw new ReferenceError(`Event with name: ${eventName} is not present in store. Are you sure you've subscribed something to that event?`)
		}

		/*
			Fire off a callback for every subscriber that's subscribed
			to the eventName
		*/
		self.events[eventName].map(callback => callback(payload));
	}
}

class Store {
	constructor({ initialState, mutations, actions }) {
		/*
			Explicitly set the this context to the store since we're using our
			dispatcher which has another this context.
		*/
		const self = this;

		self.mutations = mutations || {};
		self.actions = actions || {};
		self.events = new EventDispatcher;

		self.state = new Proxy(initialState || {}, {
			set(state, key, newValue) {
				// Just set the value as you would do with an object
				state[key] = newValue;

				// Let all subscribed components know that state has changed
				self.events.dispatch('stateChange', self.state);

				return true
			}
		});
	}

	dispatch(actionKey, payload) {
		const self = this;

		const isValidAction = self.actions[actionKey] &&
			typeof self.actions[actionKey] === 'function';

		if (isValidAction) {
			return self.actions[actionKey](self, payload)
		}

		throw new Error(`Action ${actionKey} does not exist.`)
	}

	commit(mutationKey, payload) {
		const self = this;

		const isValidMutation = self.mutations[mutationKey] &&
			typeof self.mutations[mutationKey] === 'function';

		if (isValidMutation) {
			const updatedState = self.mutations[mutationKey](self.state, payload);

			self.state = Object.assign(self.state, updatedState);

			return self.state
		}

		throw new Error(`Mutation ${mutationKey} does not exist.`)
	}
}

const setData = (state, payload) => {
	state.launches = payload.launches;

	return state
};

const setLaunch = (state, payload) => {
	state.launch = payload.launch;

	return state
};

var mutations = /*#__PURE__*/Object.freeze({
	__proto__: null,
	setData: setData,
	setLaunch: setLaunch
});

const SET_DATA = 'setData';
const SET_LAUNCH = 'setLaunch';

const setData$1 = (context, payload) => {
	context.commit(SET_DATA, payload);
};

const setLaunch$1 = (context, payload) => {
	context.commit(SET_LAUNCH, payload);
};

var actions = /*#__PURE__*/Object.freeze({
	__proto__: null,
	setData: setData$1,
	setLaunch: setLaunch$1
});

const initialState = {
	items: []
};

var store = new Store({
	initialState,
	mutations,
	actions
});

const toObject = (queryString) => {
	const queries = queryString.replace('?', '');
	const splittedQueries = queries.split('&');

	if (queries && splittedQueries) {
		return splittedQueries.reduce((queryObject, splittedQuery) => {
			const keyValuePair = splittedQuery.split('=');

			// Set the key (before the =) equal to the value (after the =)
			queryObject[keyValuePair[0]] = keyValuePair[1];

			return queryObject
		}, {})
	}

	return {}
};

const stripHash = (hashRoute) => {
	return hashRoute.replace('#/', '')
};

const getQueries = (route) => {
	const queryIndex = route.indexOf('?');

	if (queryIndex !== -1) {
		return route.slice(queryIndex, route.length)
	}

	return ''
};

const getParams = (route) => {
	// Capture a group from / to ? of a query
	const paramsToQueryRegex = new RegExp(/\/(.*)\?/);

	// Capture a group from / to the end of input
	const paramsToEndRegex = new RegExp(/\/(.*)$/);

	const matchesToQuery = route.match(paramsToQueryRegex);
	const matchesToEnd = route.match(paramsToEndRegex);

	if (matchesToQuery) {
		return matchesToQuery[1]
	}

	else if (matchesToEnd) {
		return matchesToEnd[1]
	}

	else {
		return ''
	}
};

const getPathname = (route) => {
	const splittedRouteName = route.split('/');

	return `/${splittedRouteName[0]}`
};

var parseRoute = (hashRoute) => {
	const withoutHash = stripHash(hashRoute);
	const queries = getQueries(withoutHash);
	const params = getParams(withoutHash);
	const pathname = getPathname(withoutHash);

	return {
		pathname,
		params,
		queries: toObject(queries)
	}
};

class Component {
	constructor(props) {
		this.props = props;

		if (!this.render) {
			throw new Error('Component needs a render function')
		}

		if (props && props.element) {
			this.element = redom$1.el(props.element);
		}

		if (props && props.store instanceof Store) {
			props.store.events.subscribe('stateChange', newState => this.update(newState));
		}
	}
}

class Page extends Component {
	constructor(props) {
		super({
			route: parseRoute(window.location.hash),
			store,
			...props
		});

		this.route = props.route || '';

		this.props.store.events.subscribe('routeChange', (payload) => {
			this.route = payload.route;
		});
	}

	// TODO: fix this in a nicer way
	update() {}
}

class RouterLink extends Component {
	constructor(props) {
		super({
			element: 'a',
			to: `#${props.to}`,
			text: props.text
		});
	}

	render() {
		redom$1.setAttr(
			this.element,
			{
				href: this.props.to,
				'data-router-link': '',
				textContent: this.props.text
			}
		);

		return this.element
	}
}

class Error$1 extends Page {
	constructor(errorMessage) {
		super({
			element: 'main'
		});

		this.errorMessage = errorMessage;
	}

	render() {
		redom$1.mount(
			this.element,
			redom$1.el('h1', { textContent: this.errorMessage })
		);

		redom$1.mount(
			this.element,
			new RouterLink({ to: '/home', text: 'Back to homepage' }).render()
		);

		return this.element
	}
}

const replaceStateIsAvailable = typeof window !== 'undefined' &&
	window.history &&
	window.history.replaceState;

var replaceState = (uri) => {
	if (replaceStateIsAvailable) {
		return window.history.replaceState({ page: uri }, null, uri)
	}

	throw new Error('Replace state is not available, please update your browser.')
};

class Router {
	constructor(...routes) {
		this.hasRouteListener = false;
		this.currentRoute = parseRoute(window.location.hash);
		this.routes = routes;

		// Initialize router Element
		this.routerElement = redom$1.el('div');
		redom$1.setAttr(this.routerElement, {
			'data-router-view': true
		});

		/*
			If there's no hash present, then replace / with #/home
		*/

		if (this.currentRoute.pathname === '/') {
			this.replace('#/home');
		}

		this.replace(window.location.hash);

		/*
			Update the routerView when an `onpopstate` event fires (usually
			happens when the user clicks browser buttons).
		*/
		window.onhashchange = () => {
			this.replace(window.location.hash);
		};
	}

	/**
	 * @description - Replaces the current hash
	 * @param {string} uri - The uri to replace the hash with
	 * @param {string} queryParams - queryParams to add to the hash
	 * @example - Router.replace('#home', '?my-query=awesome')
	 */
	replace(uri) {
		this.currentRoute = parseRoute(uri);

		replaceState(uri);

		store.events.dispatch('routeChange', {
			route: parseRoute(uri)
		});

		this.updateView();
	}

	updateView() {
		let routeSuccess = false;

		this.routes.forEach(route => {
			if (route.pathname === this.currentRoute.pathname) {
				// Replace existing page with new page
				if (this.routerElement.firstElementChild) {
					redom$1.unmount(
						this.routerElement,
						this.routerElement.firstElementChild
					);
				}

				redom$1.mount(
					this.routerElement,
					route.component.render()
				);

				routeSuccess = true;
			}
		});

		if (!routeSuccess) {
			if (this.routerElement.firstElementChild) {
				redom$1.unmount(
					this.routerElement,
					this.routerElement.firstElementChild
				);
			}

			redom$1.mount(
				this.routerElement,
				new Error$1('Oops, this page does not exist 😭').render()
			);
		}
	}
}

const LAUNCHES_NAME = 'latest_launches';
const PAGE_SIZE = 24;

var useApi = async () => {
	if (window.Worker) {
		const apiWorker = wrap(new Worker('js/workers/api-worker.js'));
		const Api = await new apiWorker;

		return Api
	}

	throw new Error('Worker is not present, you can not use workers')
};

const storage = window.localStorage;

var useLocalStorage = {
	get(name) {
		return new Promise((resolve, reject) => {
			const item = storage.getItem(name);

			if (!item) {
				reject('No item found in localStorage');
			}

			else {
				resolve(JSON.parse(item));
			}
		})
	},
	set(name, value) {
		return new Promise(resolve => {
			storage.setItem(name, JSON.stringify(value));

			resolve();
		})
	},
	remove(name) {
		return new Promise((resolve, reject) => {
			const item = storage.getItem(name);

			if (!item) {
				reject('That item does not exist in localStorage');
			}

			else {
				storage.removeItem(name);

				resolve();
			}
		})
	}
};

var useData = async ({ flightNumber, page }) => {
	const localStorage = useLocalStorage;
	const api = await useApi();


	/**
	 * When fetching all data, we want to first see
	 * if we can reach the API, since that's the source
	 * of truth.
	 */
	if (page) {
		return api.getLaunches(page)
			.catch(() => {
				return localStorage.get(LAUNCHES_NAME)
			})
	}

	/**
	 * However, when fetching a single result, we first
	 * can look in localStorage since that's set when a
	 * user has visited the launch page once.
	 */
	return localStorage.get(flightNumber)
		.catch(() => {
			return api.getSpecificLaunch(flightNumber)
		})
};

/**
 * @description Removes all childnodes inside of a parent node
 * @param {HTMLElement} $parent Parent node to remove all childs from
 */

var clearChildren = ($parent) => {
	while ($parent.firstChild) {
		$parent.removeChild($parent.firstChild);
	}
};

var dayjs_min = createCommonjsModule(function (module, exports) {
!function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="millisecond",n="second",e="minute",r="hour",i="day",s="week",u="month",o="quarter",a="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var r=String(t);return !r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return (n<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),r=t.clone().add(e,u),i=n-r<0,s=t.clone().add(e+(i?-1:1),u);return Number(-(e+(n-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:a,w:s,d:i,h:r,m:e,s:n,ms:t,Q:o}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,n,e){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),n&&(m[t]=n,r=t);else{var i=t.name;m[i]=t,r=i;}return e||(l=r),r},g=function(t,n,e){if(y(t))return t.clone();var r=n?"string"==typeof n?{format:n,pl:e}:n:{};return r.date=t,new v(r)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u,$offset:n.$offset})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(h);if(r)return e?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(n)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",a)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var h=this,f=!!D.u(o)||o,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(i)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case a:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[a]=c+"FullYear",h[r]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(o-this.$W):o;if(f===u||f===a){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,o){var h,f=this;t=Number(t);var c=D.p(o),d=function(n){var e=g(f);return D.w(e.date(e.date()+Math.round(n*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===a)return this.set(a,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[r]=36e5,h[n]=1e3,h)[c]||1,l=this.$d.getTime()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return "Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,o=this.$M,a=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(n,e))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:D.s(o+1,2,"0"),MMM:c(i.monthsShort,o,h,3),MMMM:h[o]||h(this,e),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,a,2),ddd:c(i.weekdaysShort,this.$W,a,3),dddd:a[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return e.replace(f,function(t,n){return n||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[a]=y/12,c[u]=y,c[o]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone(),r=M(t,n,!0);return r&&(e.$L=r),e},d.clone=function(){return D.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,n){return t(n,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
});

const prefix = num => {
	return num < 10 ? `0${num}` : num
};

/**
 * @description Formats a date to a string: DD-MM-YYYY
 * @param {Date} date A Javascript date
 */

var formatDate = date => {
	const parsedDate = new Date(date);
	const day = prefix(parsedDate.getDay());
	const month = prefix(parsedDate.getDay());
	const year = parsedDate.getFullYear();

	return `${day}-${month}-${year}`
};

const getIcon = successState => {
	const baseUrl = '/assets/icons/';
	const iconName = successState ? 'check.svg' : 'warning.svg';

	return `${baseUrl}${iconName}`
};

const launchPrefix = launchDate => {
	return dayjs_min(launchDate).isBefore(dayjs_min())
		? 'Launched:'
		: 'Will launch:'
};

class LaunchItem extends Component {
	constructor(props) {
		super({
			element: 'article.launch-item',
			...props
		});

		const notFoundImage = 'https://via.placeholder.com/300.webp/333/fff?text=image not found :(';

		this.name = props.mission_name;
		this.launchSite = props.launch_site.site_name_long;
		this.isSuccess = props.launch_success;
		this.rocketName = props.rocket.rocket_name;
		this.launchDate = props.launch_date_utc;
		this.imageSrcSet = [
			`${props.links.mission_patch_small} 400w`,
			`${props.links.mission_patch} 800w`
		].join(', ');
		this.fallbackImage = props.links.mission_patch || notFoundImage;
		this.imageSizes = [
			'(min-width: 800px) 33vw',
			'(min-width: 400px) 50vw',
			'100vw'
		].join(', ');
		this.flightNumber = props.flight_number;

		this.image = redom$1.el('img.launch-item__image.fixed-ratio-content', {
			src: this.fallbackImage,
			alt: `${this.name} mission logo`
		});
	}

	addSizesToImageIfExists() {
		const hasMissionPatch = Boolean(this.props.links.mission_patch);

		if (hasMissionPatch) {
			this.image.setAttribute('srcSet', this.imageSrcSet);
			this.image.setAttribute('sizes', this.imageSizes);
		}
	}

	render() {
		this.element =
			redom$1.el('article.launch-item',
				redom$1.el('header.launch-item__header',
					redom$1.el('img.launch-item__icon', { src: getIcon(this.isSuccess) }),
					redom$1.el('div',
						redom$1.el('h3', { textContent: this.name }),
						redom$1.el('p', { textContent: `${launchPrefix(this.launchDate)} ${formatDate(this.launchDate)}` })
					)
				),
				redom$1.el('picture.fixed-ratio.fixed-ratio-1by1',
					this.image
				),
				redom$1.el('div.launch-item__details',
					redom$1.el('ul.unstyled-list',
						redom$1.el('li', { textContent: `Rocket: ${this.rocketName}` }),
						redom$1.el('li', { textContent: `Launch site: ${this.launchSite}` })
					)
				)
			);

			this.addSizesToImageIfExists();

			redom$1.mount(
				this.element,
				new RouterLink({ to: `/detail/${this.flightNumber}`, text: 'See details' }).render()
			);

		return this.element
	}
}

class LaunchList extends Component {
	constructor(props) {
		super({
			element: 'div.launch-list',
			store,
			...props
		});
	}

	render() {
		redom$1.mount(
			this.element,
				redom$1.el('h2', {
					textContent: 'Loading launches...'
				}));

		return this.element
	}

	update(state) {
		clearChildren(this.element);

		state.launches.forEach(launch => {
			redom$1.mount(
				this.element,
					new LaunchItem(launch).render()
			);
		});
	}
}

class Home extends Page {
	constructor() {
		super({
			element: 'main.page',
			store
		});

		this.pageNumber = 1;
		this.isLoading = false;

		this.nextPageButton = redom$1.el('button.next-page-button', {
			textContent: 'Load more'
		});

		this.nextPageButton.onclick = async () => {
			await this.loadNextPage();
		};
	}

	async loadNextPage() {
		try {
			this.pageNumber = this.pageNumber + 1;

			this.nextPageButton.textContent = 'Loading...';
			this.nextPageButton.setAttribute('disabled', 'disabled');

			const launches = await useData({ page: this.pageNumber });
			const newLaunches = [...store.state.launches, ...launches];

			store.dispatch('setData', { launches: newLaunches });

			if (launches.length < PAGE_SIZE) {
				redom$1.unmount(
					this.element,
					this.nextPageButton
				);
			}
		}

		catch(error) {
			console.log(error);
		}

		finally {
			this.nextPageButton.textContent = 'Load more';
			this.nextPageButton.removeAttribute('disabled');
		}
	}

	render() {
		useData({ page: this.pageNumber })
			.then(launches => {
				store.dispatch('setData', { launches });
			})
			.catch(console.error);

		if (!this.element.firstElementChild) {
			redom$1.mount(
				this.element,
				redom$1.el('h1', { textContent: 'Homepage' })
			);

			redom$1.mount(
				this.element,
				new LaunchList().render()
			);

			redom$1.mount(
				this.element,
				this.nextPageButton
			);
		}

		return this.element
	}
}

var Home$1 = new Home;

class Details extends Component {
	constructor(props) {
		super({
			element: 'div',
			store,
			...props
		});
	}

	render() {
		redom$1.mount(
			this.element,
			redom$1.el('h3', {
				textContent: 'Loading launch data...'
			})
		);

		return this.element
	}

	update(state) {
		clearChildren(this.element);

		const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/';

		redom$1.mount(
			this.element,
			redom$1.el('article.detail-page',
				redom$1.el('header.detail-page__header',
					redom$1.el('h2.detail-page__title', { textContent: state.launch.mission_name }),
					redom$1.el('p.detail-page__rocket', { textContent: `Rocket: ${state.launch.rocket.rocket_name}` })
				),

				redom$1.el('h3.detail-page__title', { textContent: 'Description:' }),
				redom$1.el('p', { textContent: state.launch.details }),

				redom$1.el('h3.detail-page__title', { textContent: 'Video:' }),
				redom$1.el('div.detail-page__video',
					redom$1.el('div.fixed-ratio.fixed-ratio-1by1',
						redom$1.el('iframe.fixed-ratio-content', {
							src: `${YOUTUBE_EMBED_URL}${state.launch.links.youtube_id}`,
							width: '100%',
							allowfullscreen: ''
						})
					),
				)
			)
		);
	}
}

class Detail extends Page {
	constructor() {
		super({
			element: 'main.page'
		});
	}

	render() {
		if (this.route.params) {
			useData({ flightNumber: this.route.params })
				.then(launch => {
					store.dispatch('setLaunch', { launch });
					useLocalStorage.set(this.route.params, launch);
				})
				.catch(console.error);
		}

		if (!this.element.firstChild) {
			redom$1.mount(
				this.element,
				redom$1.el('h1', { textContent: 'Detail page' })
			);

			redom$1.mount(
				this.element,
				new Details().render()
			);
		}

		return this.element
	}
}

var Detail$1 = new Detail;

class App {
	constructor({ target }) {
		this.router = new Router(
			new Route('/home', Home$1),
			new Route('/detail', Detail$1)
		);
		this.target = document.querySelector(target);
	}

	async init() {
		this.target.appendChild(this.router.routerElement);
	}
}

new App({
	target: '#app'
}).init();
