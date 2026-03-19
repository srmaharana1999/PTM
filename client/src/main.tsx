import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* Toast notifications — lives outside the router so it's always available */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "rgba(15, 15, 15, 0.9)",
                color: "#ededed",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                fontSize: "13px",
              },
            }}
          />
          <App />
        </BrowserRouter>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
