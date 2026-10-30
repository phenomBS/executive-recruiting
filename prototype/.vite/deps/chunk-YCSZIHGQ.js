import {
  useLayoutEffect2
} from "./chunk-CEBDPWAO.js";
import {
  require_react
} from "./chunk-YXC6O5U4.js";
import {
  __toESM
} from "./chunk-DP4XHQAG.js";

// node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var React = __toESM(require_react(), 1);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var useReactInsertionEffect = React[" useInsertionEffect ".trim().toString()];
function useCallbackRef(callback) {
  const callbackRef = React.useRef(callback);
  if (typeof useReactInsertionEffect === "function") {
    useReactInsertionEffect(() => {
      callbackRef.current = callback;
    });
  } else {
    useLayoutEffect2(() => {
      callbackRef.current = callback;
    });
  }
  return React.useMemo(() => ((...args) => {
    var _a;
    return (_a = callbackRef.current) == null ? void 0 : _a.call(callbackRef, ...args);
  }), []);
}
__name(useCallbackRef, "useCallbackRef");

export {
  useCallbackRef
};
//# sourceMappingURL=chunk-YCSZIHGQ.js.map
