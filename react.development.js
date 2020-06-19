/** @license React v16.8.6
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';



if (process.env.NODE_ENV !== "production") {
  (function() {
'use strict';

var _assign = require('object-assign');
var checkPropTypes = require('prop-types/checkPropTypes');

// TODO: this is special because it gets imported during build.

var ReactVersion = '16.8.6';

//  使用Symbol来标记类似react的属性，如果没有原生的Symbol或腻子语法，使用一个数字来标记
// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;

//  Symbol.for 以字符串为key,创建symbol,如果以前有，使用以前的，否则新建一个
//  这些都是react内部的api,不清楚的可以官网去查
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;

var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
//  懒加载标记
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

//  定义symbol,如果不支持的话会用兜底方案

//  返回symbol的迭代器
var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
//  属性的key
//  要成为可迭代对象，一个对象必须实现@@iterator方法，这意味着对象 必须有一个键为@@iterator属性，可通过常量Symbol.iterator访问该属性
//  https://www.cnblogs.com/pengsn/p/12892954.html
var FAUX_ITERATOR_SYMBOL = '@@iterator';

//  返回迭代器的函数
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }
  //  获取传入参数的iterator或者@@iterator
  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}

//  使用invariant来判断入参的不变性
//  使用类似sprintf的格式来处理入参，相关信息会被移除，但是函数本身在生产环境会被保留
/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

 // 验证格式
var validateFormat = function () {};

{
  //  没有格式的话抛错
  validateFormat = function (format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error = void 0;
    if (format === undefined) {
      //  抛出非格式化的错误
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      //  replace方法会对每一个匹配项返回回调函数的返回值
      //  生成错误提示
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      //  报错的名字是不变性的破坏
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

//  依靠对invariant的实现，我们可以保持格式和参数在web的构建中
// Relying on the `invariant()` implementation lets us
// preserve the format and params in the www builds.

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

 // 低优先级的告警
var lowPriorityWarning = function () {};

//  这个括号为了封闭上下文，保持干净的命名空间
//  大括号里面可以避免被覆盖？
{
  var printWarning = function (format) {
    //  复制入参数组
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    //  拼凑信息
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    //  如果有console的实现使用它
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    //  啥也没做
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      //  方便使用调用栈查询
      //  调试react用的
      throw new Error(message);
    } catch (x) {}
  };


  lowPriorityWarning = function (condition, format) {
    //  没有格式信息，抛错
    if (format === undefined) {
      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      //  首先复制数组
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }
      //  传入格式和参数
      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning$1 = lowPriorityWarning;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

 // 无调用栈的警告
var warningWithoutStack = function () {};

{
  warningWithoutStack = function (condition, format) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (format === undefined) {
      //  没有格式直接报错
      throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (args.length > 8) {
      // Check before the condition to catch violations early.
      throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
    }
    //  如果true直接忽略
    if (condition) {
      return;
    }
    if (typeof console !== 'undefined') {
      //  将所有入参转换成字符串
      var argsWithFormat = args.map(function (item) {
        return '' + item;
      });
      //  添加warning头
      argsWithFormat.unshift('Warning: ' + format);

      // We intentionally don't use spread (or .apply) directly because it
      // breaks IE9: https://github.com/facebook/react/issues/13610
      //  不直接调用call,因为在ie9下会报错
      //  手动抛出warning
      //  console方法会自动替换%s, 使用添加的后续参数
      Function.prototype.apply.call(console.error, console, argsWithFormat);
    }
    try {
      //  这里是给react调试的地方，正常情况下是不会有作用的
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });

      //  手动抛出错误
      throw new Error(message);
    } catch (x) {}
  };
}

//  warning函数的副本
var warningWithoutStack$1 = warningWithoutStack;

//  未挂载组件的警告状态的是否更新
//  一个map,key是组件内部方法的名字
var didWarnStateUpdateForUnmountedComponent = {};

//  no-op的警告 no-operate
function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    //  获取组件的名字
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    //  告警的key
    var warningKey = componentName + '.' + callerName;
    //  是否更新过
    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }
    //  调用抛出错误的方法，同时登记，避免二次触发
    warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}

/**
 * This is the abstract API for an update queue.
 */
//  更新no-op队列的抽象api，no-operate的队列
var ReactNoopUpdateQueue = {
  //  检查这个复合组件是否挂载
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  //  入参是组件实例
  isMounted: function (publicInstance) {
    return false;
  },

  //  强制刷新，前提是不能在dom 变更的过程中更新

  //  你可能会想在某些无法使用setState更新状态的情况下强制刷新状态，
  //  forceUpdate无法触发shouldComponentUpdate，但是会触发componentWillUpdate和componentDidUpdate
  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  //  队列空调用的警告
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  //  更新所有的状态，始终使用这个或者setState来改变状态，应该把this.state当作不可变的
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  //  设置状态的子集，这个提供merge策略，不支持深度复制，下一阶段：暴露pendingState或者在合并阶段不实用
  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

//  定义空对象
var emptyObject = {};
//  冻起来
{
  Object.freeze(emptyObject);
}

/**
 * Base class helpers for the updating state of a component.
 */
//  更新组件状态的基类,组件的基类
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  //  如果组件使用字符串的refs,我们将会指定一个不同的对象
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  //  初始化默认的更新器，真实的更新器将会在渲染器内注入
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

//  定义原型属性
Component.prototype.isReactComponent = {};

//  设置状态的子集，始终使用this去改变状态，需要把this.sate当成正常状态下不可变的
//  并不保证this.state会马上更新，先设置再取值可能返回的是老值
//  并不保证setState的调用是同步的，因为多个调用最终会被合并，你可以提供一个可选的回调，在setStates事实上完成之后调用
//  当一个函数传递给setState时，它将在未来的某个时间点被调用，并且使用最新的参数（state,props,context等）这心值可能跟this.xxx不一样
//  因为你的函数是在receiveProps之后，shouldComponentUpdate之前调用的，在这个新阶段，props和context并没有赋值给this
/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function (partialState, callback) {
  //  void 0 === undefined 省字节，同时防止undefined被注入
  //  partialState需要是对象，函数或者null
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
  //  进入队列状态更新
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

//  强制刷新，该方法只能在非DOM转化态的时候调用
//  在一些深层状态改变但是setState没有被调用的时候使用，该方法不会调用shouldComponentUpdate，但componentWillUpdate和componentDidUpdate会被调用

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

//  废弃的api,这些api只会在经典的类组件上存在，我们将会遗弃它们。我们并不会直接移除他们，而是定义getter,并抛错
/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  //  定义遗弃api的告警函数
  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
        return undefined;
      }
    });
  };
  //  依次注入getter
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

//  假组件，原型是真组件的原型
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 */
//  一个方便的组件，默认浅相等校验，其实是构造函数
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  //  如果有字符串类型的ref,我们将在稍后指派一个不同的对象
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

//  纯粹的组件原型
var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
//  定义纯粹组件原型的构造函数
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
//  原型上再次注入Component的原型
_assign(pureComponentPrototype, Component.prototype);
//  标志位，判断是纯粹组件
pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
//  一个不可变的对象，一个不可变的值

// 被封闭对象仍旧全等该对象本身
// 可以通过Object.isSealed来判断当前对象是否被封闭
// 不能为被封闭对象添加任何未知属性, 也不能为其已知属性添加访问者
// 可以修改已知的属性

//  https://www.jianshu.com/p/96220f921272
function createRef() {
  //  只有current一个属性
  var refObject = {
    current: null
  };
  {
    Object.seal(refObject);
  }
  return refObject;
}

/**
 * Keeps track of the current dispatcher.
 */
//  跟踪当前的分发者
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
//  跟踪react当前的所有者，指的是所有正在构造的组件的父组件
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

//  正则，匹配任意内容加正反斜杆
//  括号内的内容是分组 https://www.jianshu.com/p/f09508c14e65
//  match如果是全局匹配，返回的是所有的匹配项，如果不是返回的是匹配字符串，位置，原始输入，如果有分组，第二项是匹配的分组
var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
//  描述组件的引用位置
var describeComponentFrame = function (name, source, ownerName) {
  var sourceInfo = '';
  if (source) {
    var path = source.fileName;
    //  解析出文件名
    var fileName = path.replace(BEFORE_SLASH_RE, '');
    {
      // In DEV, include code for a common special case:
      // prefer "folder/index.js" instead of just "index.js".
      //  在开发环境下，如果文件名为index 输出带上一级路径的文件名
      if (/^index\./.test(fileName)) {
        //  解析出反斜杠前的文件名
        var match = path.match(BEFORE_SLASH_RE);
        if (match) {
          var pathBeforeSlash = match[1];
          if (pathBeforeSlash) {
            //  获得文件名前的文件夹的名字
            var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
            fileName = folderName + '/' + fileName;
          }
        }
      }
    }
    //  获取最近的文件夹名和文件名，拼上代码行数
    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
  } else if (ownerName) {
    sourceInfo = ' (created by ' + ownerName + ')';
  }

  return '\n    in ' + (name || 'Unknown') + sourceInfo;
};

var Resolved = 1;

//  使已经resolved的懒组价更加优雅
function refineResolvedLazyComponent(lazyComponent) {
  //  如果已经resolved,返回结果
  return lazyComponent._status === Resolved ? lazyComponent._result : null;
}

//  获取包裹的名字
function getWrappedName(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || '';
  //  优先是outerType的displayName,否则是wrapperName和functionName的组合
  return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
}

//  获取组件名
function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    //  如果是根，文字节点或不存在的类型，返回null
    return null;
  }
  {
    //  如果type的tag是数字
    if (typeof type.tag === 'number') {
      warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }
  //  如果是构造函数，看他的静态属性displayName或者name
  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }
  //  如果是字符串直接返回
  if (typeof type === 'string') {
    return type;
  }
  switch (type) {
    //  如果是react当前的节点,这些都是当初symbol定义的
    case REACT_CONCURRENT_MODE_TYPE:
      return 'ConcurrentMode';
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';
    //  如果是入口
    case REACT_PORTAL_TYPE:
      return 'Portal';
    //  如果是分析器
    case REACT_PROFILER_TYPE:
      return 'Profiler';
    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';
    case REACT_SUSPENSE_TYPE:
      return 'Suspense';
  }
  //  如果type是对象
  if (typeof type === 'object') {
    //  按照$$typeof来判断
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        return 'Context.Consumer';
      case REACT_PROVIDER_TYPE:
        return 'Context.Provider';
      //  如果是前向ref
      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');
      //  如果是memo类型，递归调用自己
      case REACT_MEMO_TYPE:
        return getComponentName(type.type);
      //  如果是lazy类型
      case REACT_LAZY_TYPE:
        {
          var thenable = type;
          //  细化解析惰性组件
          var resolvedThenable = refineResolvedLazyComponent(thenable);
          if (resolvedThenable) {
            return getComponentName(resolvedThenable);
          }
        }
    }
  }
  //  最后返回null
  return null;
}

//  react正在debug的frame
var ReactDebugCurrentFrame = {};

//  当前正在验证的元素
var currentlyValidatingElement = null;

//  设置当前正在验证的元素
function setCurrentlyValidatingElement(element) {
  {
    currentlyValidatingElement = element;
  }
}

{
  //  堆栈的实现是通过当前的renderer注入的
  // Stack implementation injected by the current renderer.
  ReactDebugCurrentFrame.getCurrentStack = null;

  //  增加枚举的方法
  //  本质上是返回调用堆栈的附录
  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = '';

    // Add an extra top frame while an element is being validated
    //  增加一个额外的顶层框架，如果当前有元素正在被验证
    if (currentlyValidatingElement) {
      //  获取元素的名字
      var name = getComponentName(currentlyValidatingElement.type);
      //  获取元素所有者
      var owner = currentlyValidatingElement._owner;
      //  获取源的目录位置
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
    }

    // Delegate to the injected renderer-specific implementation
    //  转交给renderer中的特殊实现来获取堆栈
    //  如果getCurrentStack被复写，追加该方法提供的信息
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

//  react分享的内部构件
var ReactSharedInternals = {
  //  当前的分发者
  ReactCurrentDispatcher: ReactCurrentDispatcher,
  //  当前的所有者
  ReactCurrentOwner: ReactCurrentOwner,
  //  Object.assign避免在UMD下被打包两次
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign: _assign
};

{
  _assign(ReactSharedInternals, {
    //  在生产环境不应该有
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    //  react树形钩子
    ReactComponentTreeHook: {}
  });
}

//  类似于不变性的警告，只有在条件不满足的时候才打印
/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

 // 首先赋值warningWithoutStack$1
var warning = warningWithoutStack$1;

//  本质上是带调用栈的warning方法
{
  //  第二个条件是格式化
  warning = function (condition, format) {
    if (condition) {
      return;
    }
    //  获取当前的调用序列
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();
    // eslint-disable-next-line react-internal/warning-and-invariant-args

    //  拼装后面的参数
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    //  复用原来的warning方法，前面的内容照旧，后面的内容拼上调用序列的信息
    warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
  };
}

var warning$1 = warning;

//  定义hasOwnProperty方法
var hasOwnProperty = Object.prototype.hasOwnProperty;

//  属性保留字
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

//  特殊的属性key展示告警
// void 0 就是undefined
var specialPropKeyWarningShown = void 0;
var specialPropRefWarningShown = void 0;

//  排除ref是warning的情况，判断是否存在ref
function hasValidRef(config) {
  {
    //  如果config有ref自有属性属性
    if (hasOwnProperty.call(config, 'ref')) {
      //  获取get方法
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      //  如果这个getter是warning的，返回false
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  //  否则根据是否undefined来判断
  return config.ref !== undefined;
}

//  是否具有可用属性
//  逻辑跟ref的很相似
function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

//  定义key属性的warning Getter
function defineKeyPropWarningGetter(props, displayName) {
  //  关于访问key的告警
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      //  key不能作为参数获取，被react内部征用了
      warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  //  这个函数定义为react warngin
  warnAboutAccessingKey.isReactWarning = true;
  //  给入参的key属性定义getter，避免外界访问
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

//  这部分内容跟key的非常类似
//  定义ref的获取方法
function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

//  定义一个创建react 元素的工厂函数，这跟class模式的组建不一样，请不要使用new来调用，所有instanceof来检查是失效的，不要使用要用Symbol.for('react.element')，而要用$$typeof来检查，
//  来判断是否是react组件

//  sele是一个暂时的变量，是用来判断当React.createElement被调用的时候this和owner是否一致，以便我们告警。我们打算摆脱owner这个概念并且
//  使用箭头函数，只要这个二者一致，组件就没有变化
//  source是一个注释对象（被转译器或者其他文件名，行数，等信息所添加）
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */

 // react元素工厂函数，或者叫原型
 // 返回的其实是element对象
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    //  通过这个标签来识别react的元素
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    //  属于这个元素的内建属性
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    //  记录创建这个组件的组件
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    //  这个验证标志是可变的，我们把这个放在外部支持存储，以便我们能够冻结整个对象，
    //  这个可以被若映射替代，一旦在开发环境下实现了

    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // 为了更加方便地进行测试，我们设置了一个不可隐藏的验证标志位，以便测试框架忽略它
    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    //  给_store设置validated属性false
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
    //  self和source都是开发环境才存在的

    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    });
    //  两个再不同地方创建的元素从测试的角度来看是相等的，我们在列举的时候忽略他们

    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });
    //  如果Object有freeze的实现，我们冻结元素和它的属性
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

//  返回并创建指定类型的reactElement
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
function createElement(type, config, children) {
  //  属性名 void 0就是undefined
  var propName = void 0;

  // Reserved names are extracted

  //  被保护的名字被屏蔽
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  //  根据confi的内容来初始化
  if (config != null) {
    //  如果有可用的ref,将其赋值给ref变量
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    //  如果有可用的key,将其赋值给key
    if (hasValidKey(config)) {
      key = '' + config.key;
    }
    //  再给self赋值
    self = config.__self === undefined ? null : config.__self;
    //  给source赋值
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
       // 如果不是保留字的话就复制属性 
       if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  //  子元素会有不止一个，这些将会通过一个属性对象向下传递

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  //  复制子元素
  //  给props属性添加children属性
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    {
      //  冻结子元素列表
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  //  解析默认属性，如果type上存在默认属性
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    //  如果没有属性值，采用type类型默认属性上的默认值
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  {
    if (key || ref) {
      //  这里的type估计是个构造函数对象
      //  如果type是个构造函数
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
      if (key) {
        //  避免保护参数被错误取到，提供警告
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  //  返回创建的元素
  //  type是直接透传的，key,ref等等都是从config里面解析出来的，props是由config上的参数，type上的参数（如果有的话），children等组合而成
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

//  返回一个可以创建指定类型的react元素的函数
/**
 * Return a function that produces ReactElements of a given type.
 * See https://reactjs.org/docs/react-api.html#createfactory
 */

//  克隆并且替换key
function cloneAndReplaceKey(oldElement, newKey) {
  //  其实就是替换调key,其他不变
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
}

//  克隆并返回一个新的react元素，目标元素将作为起始点
/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */
function cloneElement(element, config, children) {
  //  如果element是null或者undefined，抛出不可用的错误
  !!(element === null || element === undefined) ? invariant(false, 'React.cloneElement(...): The argument must be a React element, but you passed %s.', element) : void 0;
  //  属性名
  var propName = void 0;

  // Original props are copied
  //  复制原始属性
  var props = _assign({}, element.props);

  // Reserved names are extracted
  //  受保护的属性被单独提取出来
  var key = element.key;
  var ref = element.ref;
  //  self受保护是因为owner受保护
  // Self is preserved since the owner is preserved.
  var self = element._self;
  //  source受保护是因为克隆一个元素并不是一个转译操作，原始的源对真实的父元素来说可能是一个更好的标志
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  //  owner将会被保护，除非ref被复写
  var owner = element._owner;

  if (config != null) {
    //  如果存在config,那么其中的值将会覆盖刚才定义的变量
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      //  静默封装从父元素存底来的ref
      ref = config.ref;
      //  修改owner
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    //  剩下的属性将会复现现存的属性
    var defaultProps = void 0;
    if (element.type && element.type.defaultProps) {
      //  element.type上的默认属性赋值给defaultProps
      defaultProps = element.type.defaultProps;
    }
    //  属性复制
    for (propName in config) {
      //  如果该属性是config自有的并且不是react的保留属性
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        //  如果config中没有值并且默认属性的值存在就从默认属性中赋值
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          //  否则复制config中的值
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  //  复制子元素，逻辑类似先前
  //  children挂在props上，透传
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}

//  判断一个对象是否是react元素
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */
//  首先是对象，其次不是null，再次$$typeoff为REACT_ELEMENT_TYPE
function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

//  提取并且包裹key，使他可以用为reactid
/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
//  替换key
function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });
  //  开头贴个$,=和冒号分别变成=0和=2
  return '$' + escapedString;
}

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

 // 关于映射的警告
 // 控制这种报错只出现一次
var didWarnAboutMaps = false;

//  匹配一个或多个/符号 给所有的/符号加一个/
var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  //  $&表示之前匹配中的串
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}
//  

//  维护一个池子  这玩意儿感觉是共用的，每次调用的时候把函数往下传，或者返回一个空的
var POOL_SIZE = 10;
var traverseContextPool = [];
//  获得合并的传递的上下文
//  mapResult其实是处理过后的子元素的数组
function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  //  如果有上下文，返回最后一个
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    //  将相应的值改成传入的值
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    //  否则根据入参返回一个新的
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

//  释放一个上下文，小于上限的话就往池子里push
function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  //  小于上限的话就往里推
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */

 // 这个是个递归函数，来统计子节点数目，也会执行回调
 // 遍历所有子节点的接口实现
 // traverseContext这个上线文本质上就是一个存储处理结果的对象
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  //  获取children的类型
  var type = typeof children;
  //  如果类型为undifined或者布尔，children为null
  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  //  如果type为undefined、boolean、string、number、REACT_ELEMENT_TYPE、REACT_PORTAL_TYPE时，表示已经调用到底层元素，要调用回调
  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }

  if (invokeCallback) {
    //  使用上级传下来的上下文跑一下回调，同时计数，第三个参数，累加当前的组件名
    //  针对mapIntoWithKeyPrefixInternal，这个callback其实是mapSingleChildIntoContext
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.

    //  如果这是唯一的子元素，把这个名字当做包裹在数组里面的处理，是的子元素增加的时候保持名字不变
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    //  返回计数1
    return 1;
  }

  var child = void 0;
  //  往下传递的名字
  var nextName = void 0;
  //  当前子树下子元素的节点个数
  var subtreeCount = 0; // Count of children found in the current subtree.
  //  下一个名字的前缀，如果当前的名字是空串，设置为.,否则是当前的名字+分隔符：
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  //  数组的话继续递归
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      //  拼出下一个名字
      nextName = nextNamePrefix + getComponentKey(child, i);
      //  递归调用，获得当前子树下挂载的节点数
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    //  如果是迭代器的话也继续递归
    //  获取children的迭代器
    var iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      {
        // Warn about using Maps as children
        //  如果使用map当做子元素，报错
        if (iteratorFn === children.entries) {
          //  控制这个报错只出现一次
          !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
          didWarnAboutMaps = true;
        }
      }

      //  获取迭代器的第一次结果
      var iterator = iteratorFn.call(children);
      var step = void 0;
      var ii = 0;
      //  while循环不停跑，迭代器不停跑
      while (!(step = iterator.next()).done) {
        //  获取下一个子元素
        child = step.value;
        //  获取下一层的名字
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        //  继续跑递归
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    //  如果是不是REACT_ELEMENT_TYPE，REACT_PORTAL_TYPE类型的对象，就报错
    } else if (type === 'object') {
      var addendum = '';
      {
        //  如果想要渲染子元素的集合，需要使用数组，末尾追加调用堆栈
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
      }
      //  children强制转string
      var childrenString = '' + children;
      //  抛错
      invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}

//  遍历被指定为props.children的子元素，但是也可以通过属性指定
//  traverseAllChildren(this.props.children, ...) traverseAllChildren(this.props.leftPanelChildren, ...)
//  traverseContext是一个可选的参数，将在整个遍历过程中被传递，它可以用来存储状态或者回调函数能够用到的东西
/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */

 // 遍历所有子元素 返回所有子元素的计数
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }
  //  第二个参数是当前的名字， 第三个参数是‘mapSingleChildIntoContext’里面有当前处理过的子元素的结果数组result,和回调函数
  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

//  生成用来标识一个集合中的元素的key
/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  //  在这里要做一些校验，因为我们调用的时候是处于黑箱中，我们想要确保不会屏蔽调未来ES标准的api

  //  如果component是对象，其不为null并且存在key,则返回
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    //  生成转义后的key，$开头
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  //  否则使用集合中的index来生成key
  return index.toString(36);
}

//  对单个子元素进行处理
//  读取bookKeeping中的数据来调用函数
function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

//  遍历被指定为props.children的子元素,提供的forEachFunc将会被每个叶子节点调用
/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  //  获取当前要遍历的上下文
  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  //  返回的计数貌似没有用到
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  //  释放用到的上下文
  releaseTraverseContext(traverseContext);
}

//  把单个子元素映射到上下文中 这也是个递归 bookkeeping其实就是个上下文的实例
//  其实就是给上下文对象的result中插入处理后的子元素
function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;

  //  获取处理过后的子元素，绑定上下文调用func,计数加1
  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    //  如果是子元素的数组，使用key和固定前缀映射
    //  这里本质上还是递归，mapIntoWithKeyPrefixInternal里面会调用mapSingleChildIntoContext
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
      return c;
    });
  } else if (mappedChild != null) {
    //  如果是单元素
    if (isValidElement(mappedChild)) {
      //  获取映射过后的元素，其实是使用的克隆方法
      mappedChild = cloneAndReplaceKey(mappedChild,
      //如果新key和老key不一样，则二者都保留，因为traverseAllChildren这个方法通常把对象视为子元素
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      //  如果映射后的子元素有key,且原来元素的key不与之相同，则给mapped.key添加一个/,再拼接子元素的key
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    //  处理后的子元素推到result里面
    result.push(mappedChild);
  }
}

//  对所有子元素进行遍历，使用一个特定的prefix
function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  //  给所有/加一个/号
  if (prefix != null) {
    //  把所有前缀都增加一个/,同时在尾巴上加一个/
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  //  加载当前的一个context 返回的context的result参数就是送进去的array
  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  //  第二个参数是个函数，把处理后的元素推到traverseContext的result里面
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}

//  映射所有被标识为props.children的元素
//  每个叶子元素都会被mapFunction所调用
/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
//  从头开始遍历，前缀是初始的空字符串
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  //  result貌似都到context里面去了，通过回调调用，没有显示使用
  var result = [];
  //  第三个null,对应空字符串的前缀， result埋到context里面去了,context是最后调用函数时候的上下文
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

//  计算被标识为props.children的节点的数目
/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */

 // 统计子元素数目
function countChildren(children) {
  //  遍历函数，callback啥也没干，上下文是null
  return traverseAllChildren(children, function () {
    return null;
  }, null);
}

//  拍平子元素对象，返回一个有合适key的子元素组成的数组
/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */
//  获得扁平化的子元素数组
function toArray(children) {
  var result = [];
  //  最后的回调是原封不动丢回来
  mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
    return child;
  });
  return result;
}

//  返回集合的第一个元素并且验证该集合是否只有一个元素
//  当前的实现是假设子元素外层是没有包裹的，但这个函数的目的是抽象出子元素的实际结构
/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
  return children;
}

//  context的构造函数
function createContext(defaultValue, calculateChangedBits) {
  //  如果calculateChangedBits是undefined，设置为null
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    {
      //  可选的第二个参数是函数，如果不是的函数或者null的话报错
      !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
    }
  }

  var context = {
    //  定义类型
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    //  为了支持多个并行的渲染器，我们把他们分为一级渲染器和二级渲染器，我们只允许同时
    //  存在两个渲染器：react native是一级渲染器，fabric是二级渲染器，或者react DOM(一级渲染器)和react art（二级渲染器）
    //  二级渲染器会在一个分开的域存储他们的上下文
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    //  以前为了追踪这个上下文有多少个并行的渲染器，有这个变量（就像并行的服务器渲染）
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    //  这两个变量是循环引用的
    Provider: null,
    Consumer: null
  };

  context.Provider = {
    //  定义类型
    $$typeof: REACT_PROVIDER_TYPE,
    //  搞了个循环引用，指向自己
    _context: context
  };

  //  已经警告使用了嵌套的上下文消费者
  var hasWarnedAboutUsingNestedContextConsumers = false;
  //  已经警告了使用消费者和提供者
  var hasWarnedAboutUsingConsumerProvider = false;

  {
    //  一个分开的对象，但是代理到原来的上下文对象为了向下兼容。它有不同的$$typeof，所以我们能够针对上下文做消费者时的错误使用告警
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      //  设置类型
      $$typeof: REACT_CONTEXT_TYPE,
      //  循环引用上下文
      _context: context,
      _calculateChangedBits: context._calculateChangedBits
    };
    //  Flow抱怨没有设置值，因为这是在内部的
    // $FlowFixMe: Flow complains about not setting a value, which is intentional here
    Object.defineProperties(Consumer, {
      //  给consumer设置getter和setter
      Provider: {
        get: function () {
          //  不能调用Consumer.Provider，否则将报警告，该错误只会报一次
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;
            //  启用带调用栈的warning
            warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }
          //  返回Provider
          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      //  获取当前值
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          //  不建议嵌套两层consumer，否则抛warning
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;
            warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }
          return context.Consumer;
        }
      }
    });
    //  Flow抱怨丢失了属性因为他没有理解defineProperty
    // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
    context.Consumer = Consumer;
  }
  //  设置默认渲染器
  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

//  lazy的构造函数
function lazy(ctor) {
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor,
    //  react使用这些值去储存结果
    // React uses these fields to store the result.
    _status: -1,
    _result: null
  };

  {
    //  在生产环境下，这些都会设置再对象上
    // In production, this would just set it on the object.
    var defaultProps = void 0;
    var propTypes = void 0;
    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get: function () {
          return defaultProps;
        },
        set: function (newDefaultProps) {
          //  react不支持给lazy加载的组件修改默认属性,要么在定义的时候修改，要么在外面包上一层
          warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
          defaultProps = newDefaultProps;
          //  和生产环境的行为更接近
          //  设置可枚举类型
          // Match production behavior more closely:
          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true
          });
        }
      },
      propTypes: {
        configurable: true,
        get: function () {
          return propTypes;
        },
        set: function (newPropTypes) {
          //  react不支持给懒加载组件设置属性类型
          warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
          propTypes = newPropTypes;
          // Match production behavior more closely:
          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true
          });
        }
      }
    });
  }

  return lazyType;
}

//  前向ref
function forwardRef(render) {
  {
    //  感觉就是一堆校验
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      //  如果render不为null且其类型为REACT_MEMO_TYPE，抛错
      warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      //  如果不是函数，抛错
      warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      !(
        //  0参数的时候不报错，因为这可能是因为参数是对象
      // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
      //  如果参数数组长度不为0或2，抛错：forwardRef只接受2个参数，属性值和ref,'你忘记传ref'或'多出来的参数都会被省略'
      render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
    }

    //  如果不满足之前的条件且render不为空
    if (render != null) {
      //  如果render上存在defaultProps或者propTypes，抛错：forwardRef的渲染函数不支持propTypes或者defaultProps，你实际上传入了一个react组件是吗
      !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
    }
  }

  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };
}

//  判断是否是元素的可用类型
function isValidElementType(type) {
  //  字符串，函数，react片段
  return typeof type === 'string' || typeof type === 'function' ||
  //  这里的类型可能是symbol或者是数字，如果使用了降级的写法
  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  //  后面的这些type要调一次$$typeof
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
}

//  纯函数版本的pureComponent,第一个参数是个函数
function memo(type, compare) {
  {
    //  如果不是react类型
    if (!isValidElementType(type)) {
      //  memo的第一个参数必须是组件
      warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }
  return {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };
}

//  返回当前的dispatcher
function resolveDispatcher() {
  var dispatcher = ReactCurrentDispatcher.current;
  //  如果dispatcher是null,报错
  //  不可用的钩子调用，hooks只能在函数类型的组件内调用，翻身这个报错可能有以下几个原因：
  //  1react和渲染器（react dom）的版本不匹配，2你没有遵循react的使用规则，3你的app内可能有多个react实例
  !(dispatcher !== null) ? invariant(false, 'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.') : void 0;
  return dispatcher;
}

//  貌似都是hooks相关api
function useContext(Context, unstable_observedBits) {
  //  获得当前的dispatcher
  var dispatcher = resolveDispatcher();
  {
    //  如果有第二个参数抛警告
    //  useContext的第二个参数是为未来保留的
    !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0;

    // TODO: add a more generic warning for invalid values.
    if (Context._context !== undefined) {
      var realContext = Context._context;
      //  不要删除重复数据，因为这个将会合理地触发bug，没有人会在现存的代码中这样用
      // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.
      if (realContext.Consumer === Context) {
        //  useContext(Context.Consumer)这种写法会抛错
        warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
      } else if (realContext.Provider === Context) {
        //  useContext(Context.Provider)这种写法会抛错
        warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }
  }
  //  通过dispatcher调用useContext
  return dispatcher.useContext(Context, unstable_observedBits);
}

//  一堆react hooks API的定义
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}

function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}

function useEffect(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, inputs);
}

function useLayoutEffect(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, inputs);
}

function useCallback(callback, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, inputs);
}

function useMemo(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, inputs);
}

function useImperativeHandle(ref, create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, inputs);
}

function useDebugValue(value, formatterFn) {
  {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}

//  ReactElementValidator提供一个元素工厂函数的包装器，他可以校验传递给元素的属性。
//  这只会在开发环境中被调用，在支持严格模式的语言中将会被替换
/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

 // 属性名拼错提醒
var propTypesMisspellWarningShown = void 0;

{
  propTypesMisspellWarningShown = false;
}

// 一堆报错方法
//  获取错误的信息
function getDeclarationErrorAddendum() {
  //  如果存在ReactCurrentOwner
  if (ReactCurrentOwner.current) {
    var name = getComponentName(ReactCurrentOwner.current.type);
    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }
  return '';
}

//  获取源码的错误信息
function getSourceInfoErrorAddendum(elementProps) {
  //  确定元素及其source存在
  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
    var source = elementProps.__source;
    //  删掉前面的路径
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    //  读取行数，拼接信息
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

//  如果动态子元素数组上没有设置明确的key或者key本身无效就告警。这将方便我们跟踪子元素的更新
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */

 // 一个报错信息的映射map
var ownerHasKeyUseWarning = {};

//  获取当前组件的错误信息
function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    //  如果父元素类型是字符串，直接返回，否则读取displayname或者那么
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      //  提醒检查父组件
      info = '\n\nCheck the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

//  如果一个组件没有被指定明确的key则告警。这里的元素是个数组，这个数组可能增加或者减少或者重排
//  所有没有被验证的元素都需要被指定一个key,错误状态将会被缓存，使得警告只会发生一次
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
//  验证是否存在key
function validateExplicitKey(element, parentType) {
  //  如果元素上不存在_store，或者元素已经被校验过，或者元素的key存在，直接返回
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  //  标记元素
  element._store.validated = true;

  //  获取错误信息
  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  //  标记一下，避免重复抛错
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  //  通常情况下当前的元素时肇事者，但是如果它接受了子元素作为属性，那么它将成为一个需要制定key的元素的创建者
  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    //  返回创建这个元素的父元素的信息
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
  }

  //  设置当前正在校验的元素，以便追踪堆栈
  setCurrentlyValidatingElement(element);
  {
    //  抛出带调用堆栈信息的错
    //  list中的每个子元素都需要有一个不同的key属性
    warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
  }
  //  将当前元素置为null
  setCurrentlyValidatingElement(null);
}

//  确保每个元素都被透传到一个静态位置（指的是每个元素都有被指定一个key），或者在一个存在可用key的对象字面量中

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
//  验证子元素的key
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  //  针对迭代器，数组和单个的情况来确认键
  if (Array.isArray(node)) {
    //  分别验证数组的每个元素
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // 入过是单个react节点，直接标志位通过
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    //  获取迭代器函数
    var iteratorFn = getIteratorFn(node);
    if (typeof iteratorFn === 'function') {
      //  入口迭代器过去提供隐式的key,现在我们将为他们输出警告
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step = void 0;
        //  while循环不停跑迭代器，并验证key
        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

//  给定一个函数，验证它的参数是否遵循属性类型的定义
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */

 // 验证类型
function validatePropTypes(element) {
  var type = element.type;
  //  入过元素类型不存在或者是字符串，直接返回
  if (type === null || type === undefined || typeof type === 'string') {
    return;
  }
  var name = getComponentName(type);
  var propTypes = void 0;
  //  如果type是工厂函数，读取其propTypes
  if (typeof type === 'function') {
    propTypes = type.propTypes;

    //  如果是forward_ref或者memo类型
  } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
  // Note: Memo only checks outer props here.
  // Inner props are checked in the reconciler.
  //  Memo只校验外层属性，内部的属性交给协调器处理
  type.$$typeof === REACT_MEMO_TYPE)) {
    propTypes = type.propTypes;
  } else {
    //  以上二者都不是，直接返回
    return;
  }
  if (propTypes) {
    setCurrentlyValidatingElement(element);
    checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
    setCurrentlyValidatingElement(null);
  } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
    propTypesMisspellWarningShown = true;
    warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
  }
  if (typeof type.getDefaultProps === 'function') {
    !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */

 // 检查块的参数，只支持key和children
function validateFragmentProps(fragment) {
  setCurrentlyValidatingElement(fragment);

  var keys = Object.keys(fragment.props);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key !== 'children' && key !== 'key') {
      warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
      break;
    }
  }

  if (fragment.ref !== null) {
    warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
  }

  setCurrentlyValidatingElement(null);
}

//  创建一个元素，并且进行类型验证
function createElementWithValidation(type, props, children) {
  //  这个是一个返回的bool值
  var validType = isValidElementType(type);

  // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.

  //  如果没有type的话启动报错
  if (!validType) {
    var info = '';
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendum(props);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString = void 0;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
  }

  //  构建元素
  var element = createElement.apply(this, arguments);

  // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.
  if (element == null) {
    return element;
  }

  // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)
  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}

//  返回元素
function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;
  // Legacy hook: remove it
  {
    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}

//  克隆元素并检查children的属性
function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);
  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }
  validatePropTypes(newElement);
  return newElement;
}

// Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


// In some cases, StrictMode should also double-render lifecycles.
// This can be confusing for tests though,
// And it can be bad for performance in production.
// This feature flag can be used to control the behavior:


// To preserve the "Pause on caught exceptions" behavior of the debugger, we
// replay the begin phase of a failed component inside invokeGuardedCallback.


// Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:


// Gather advanced timing metrics for Profiler subtrees.


// Trace which interactions trigger each commit.


// Only used in www builds.
 // TODO: true? Here it might just be false.

// Only used in www builds.


// Only used in www builds.


// React Fire: prevent the value and checked attributes from syncing
// with their related DOM properties


// These APIs will no longer be "unstable" in the upcoming 16.7 release,
// Control this behavior with a flag to support 16.6 minor releases in the meanwhile.
var enableStableConcurrentModeAPIs = false;

//  各种会用到的api封装到一个对象里
var React = {
  Children: {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  },

  createRef: createRef,
  Component: Component,
  PureComponent: PureComponent,

  createContext: createContext,
  forwardRef: forwardRef,
  lazy: lazy,
  memo: memo,

  useCallback: useCallback,
  useContext: useContext,
  useEffect: useEffect,
  useImperativeHandle: useImperativeHandle,
  useDebugValue: useDebugValue,
  useLayoutEffect: useLayoutEffect,
  useMemo: useMemo,
  useReducer: useReducer,
  useRef: useRef,
  useState: useState,

  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,

  createElement: createElementWithValidation,
  cloneElement: cloneElementWithValidation,
  createFactory: createFactoryWithValidation,
  isValidElement: isValidElement,

  version: ReactVersion,

  unstable_ConcurrentMode: REACT_CONCURRENT_MODE_TYPE,
  unstable_Profiler: REACT_PROFILER_TYPE,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
};

// Note: some APIs are added with feature flags.
// Make sure that stable builds for open source
// don't modify the React object to avoid deopts.
// Also let's not expose their names in stable builds.

if (enableStableConcurrentModeAPIs) {
  React.ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
  React.Profiler = REACT_PROFILER_TYPE;
  React.unstable_ConcurrentMode = undefined;
  React.unstable_Profiler = undefined;
}



var React$2 = Object.freeze({
	default: React
});

var React$3 = ( React$2 && React ) || React$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var react = React$3.default || React$3;

module.exports = react;
  })();
}
