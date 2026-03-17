export interface UserSession<T = unknown> {
  commandName: string;
  steps: string[];
  data: T;
  back?: boolean;
  lastActivity?: number;
}
