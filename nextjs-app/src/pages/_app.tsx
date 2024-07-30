import { ErrorFallback } from "@/components/ErrorFallBack/ErrorFallBack";
import { errorLoggerApi } from "@/services/ErrorLoggerApi";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ErrorBoundary } from "react-error-boundary";

export default function App({ Component, pageProps }: AppProps) {
  const logError = (error: Error, info: any) => {
    // Do something with the error, e.g. log to an external API
    console.log("logError", error, info);
    errorLoggerApi(error, JSON.stringify(info));
  };
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
