import { UserSession } from './user-session.interface';

export class SessionManager {
  private sessions: Map<string, UserSession<any>> = new Map();

  get(userId: string): UserSession<any> | undefined {
    return this.sessions.get(userId);
  }

  set(userId: string, session: UserSession<any>): void {
    this.sessions.set(userId, session);
  }

  delete(userId: string): void {
    this.sessions.delete(userId);
  }

  has(userId: string): boolean {
    return this.sessions.has(userId);
  }

  clear(): void {
    this.sessions.clear();
  }

  getAll(): UserSession<any>[] {
    return Array.from(this.sessions.values());
  }
}
