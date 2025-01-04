import type { Platform } from '../constants/platform';
import { IncomingMessage, ServerResponse } from 'http';

export interface CommonArguments {
  /** Target application platform. */
  platform: string;
  /** Whether to clean any persistent cache. */
  resetCache?: boolean;
  /** Whether to log additional debug messages. */
  verbose?: boolean;
}

export interface BundleArguments extends CommonArguments {
  assetsDest?: string;
  entryFile: string;
  json?: string;
  minify?: boolean;
  dev: 'true' | 'false';
  bundleOutput: string;
  // bundleEncoding?: string;
  sourcemapOutput?: string;
  // sourcemapSourcesRoot?: string;
  // sourcemapUseAbsolutePath: boolean;
  stats?: string;
}

export interface StartArguments extends CommonArguments {
  cert?: string;
  host?: string;
  https?: boolean;
  key?: string;
  port?: number;
  interactive?: boolean;
  silent?: boolean;
  verbose?: boolean;
  json?: boolean;
  reversePort?: boolean;
  logFile?: string;
  experimentalDebugger?: boolean;
}

export interface CliOptions {
  config: {
    root: string;
    reactNativePath: string;
    webpackConfigPath: string;
  };
  command: 'bundle' | 'start';
  arguments:
    | {
        bundle: BundleArguments;
      }
    | {
        start: StartArguments;
      };
}

export interface BundleQuery {
  platform: Platform;
  dev: 'true' | 'false';
  minify: 'true' | 'false';
  // not used
  lazy: 'true' | 'false';
  app: string;
  modulesOnly: 'true' | 'false';
  runModule: 'true' | 'false';
  excludeSource: 'true' | 'false';
  sourcePaths: 'url-server' | 'absolute';
}

export type ParsedRequestListener<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse<
    InstanceType<Request>
  > = typeof ServerResponse,
> = (
  req: InstanceType<Request> & {
    path: string;
    query: { [key: string]: string };
  },
  res: InstanceType<Response> & { req: InstanceType<Request> }
) => void;
