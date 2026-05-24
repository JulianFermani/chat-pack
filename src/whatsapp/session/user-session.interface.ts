export interface UserSession<T = unknown> {
  commandName: string;
  steps: string[];
  backSteps?: Record<string, string>;
  data: T;
  back?: boolean;
  lastActivity?: number;
}
