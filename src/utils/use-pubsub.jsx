import { createContext, useContext, useRef } from "react";

const createPubSub = (ref) => {
  const unsubscribe = (eventName, fn) => {
    if (!ref.current[eventName]) return;
    ref.current[eventName] = ref.current[eventName].filter(($) => $ !== fn);
  };

  const subscribe = (eventName, fn) => {
    if (!ref.current[eventName]) {
      ref.current[eventName] = [fn];
    } else {
      ref.current[eventName].push(fn);
    }

    return () => unsubscribe(eventName, fn);
  };

  const publish = (eventName, payload = null) => {
    if (!ref.current[eventName]) return;
    ref.current[eventName].forEach((fn) => fn(payload));
  };

  return {
    subscribe,
    unsubscribe,
    publish
  };
};

const PubSubContext = createContext();

/**
 * HOC Version
 *
 * ```js
 * withPubSub(App)
 * ```
 *
 * @param {*} Component
 * @returns
 */
export const withPubSub = (Component) => () => {
  console.log("@withPubSub::render");
  const context = useRef({});

  return (
    <PubSubContext.Provider value={createPubSub(context)}>
      <Component />
    </PubSubContext.Provider>
  );
};

/**
 * Provider Component Version
 *
 * ```jsx
 * <PubSubProvider>
 *   <App />
 * </PubSubProvider>
 *
 * @param {} props
 * @returns
 */
export const PubSubProvider = (props) => {
  console.log("@PubSubProvider::render");
  const context = useRef({});

  return <PubSubContext.Provider {...props} value={createPubSub(context)} />;
};

export const usePubSub = () => useContext(PubSubContext);
