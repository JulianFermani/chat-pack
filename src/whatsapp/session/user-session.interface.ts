export interface UserSession<T = unknown> {
  commandName: string;
  step: number;
  data: T;
  back?: boolean;
}
