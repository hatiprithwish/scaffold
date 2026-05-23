import Constants from "@/config/Constants";
import {
  type ContextLocalStorage,
  configure,
  defaultConsoleFormatter,
  dispose,
  getConsoleSink,
  getLogger,
  withContext,
} from "@logtape/logtape";
import {
  DEFAULT_REDACT_FIELDS,
  EMAIL_ADDRESS_PATTERN,
  redactByField,
  redactByPattern,
} from "@logtape/redaction";
import { type LogAction, LogCategory } from "@scaffold/schemas";

// Workers exposes AsyncLocalStorage via nodejs_compat — satisfies ContextLocalStorage<T>
declare const AsyncLocalStorage: new <T>() => ContextLocalStorage<T>;

export async function configureLogger(): Promise<void> {
  const consoleSink = redactByField(
    getConsoleSink({
      formatter: redactByPattern(defaultConsoleFormatter, [
        EMAIL_ADDRESS_PATTERN,
      ]),
    }),
    [...Constants.APP_REDACT_FIELDS, ...DEFAULT_REDACT_FIELDS],
  );

  await configure({
    sinks: { console: consoleSink },
    contextLocalStorage: new AsyncLocalStorage<Record<string, unknown>>(),
    loggers: [
      {
        // DEV_NOTE: category for internal logtape/library metadata logs.
        category: ["logtape", "meta"],
        sinks: ["console"],
        lowestLevel: "warning",
      },
      // DEV_NOTE: category for application logs.
      {
        category: [Constants.APP_NAME],
        sinks: ["console"],
        lowestLevel: "info",
      },
    ],
  });
}

// DEV_NOTE: Expose dispose function to flush logs before worker termination.
export { dispose as disposeLogger };

// DEV_NOTE: Helper function to run a block of code within a request context (e.g. for correlating logs with a request ID).
export function withRequestContext<T>(
  requestId: string,
  fn: () => Promise<T>,
): Promise<T> {
  return withContext({ requestId }, fn);
}

export default class AppLogger {
  private static get(category: LogCategory) {
    return getLogger([Constants.APP_NAME, category]);
  }

  static info(params: {
    category: LogCategory;
    action: LogAction;
    message: string;
    metadata?: any;
  }): void {
    AppLogger.get(params.category).info(params.message, {
      action: params.action,
      ...params.metadata,
    });
  }

  static warn(params: {
    category: LogCategory;
    action: LogAction;
    message: string;
    metadata?: any;
  }): void {
    AppLogger.get(params.category).warn(params.message, {
      action: params.action,
      ...params.metadata,
    });
  }

  static error(params: {
    category: LogCategory;
    action: LogAction;
    message: string;
    error?: any;
    metadata?: any;
  }): void {
    AppLogger.get(params.category).error(params.message, {
      action: params.action,
      error: params.error,
      ...params.metadata,
    });
  }
}
