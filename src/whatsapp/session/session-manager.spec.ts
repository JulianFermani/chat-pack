import { SessionManager } from './session-manager';
import { UserSession } from './user-session.interface';

describe('SessionManager', () => {
  let manager: SessionManager;

  beforeEach(() => {
    manager = new SessionManager();
  });

  it('stores and retrieves a session', () => {
    const session = {
      commandName: 'sumarDosNumeros',
      steps: ['first-step'],
      data: {},
    };

    manager.set('user-1', session);

    expect(manager.get('user-1')).toBe(session);
    expect(manager.has('user-1')).toBe(true);
  });

  it('updates lastActivity when setting a session', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1713870000000);
    const session: UserSession = {
      commandName: 'hola',
      steps: ['step-1'],
      data: {},
    };

    manager.set('user-1', session);

    expect(session.lastActivity).toBe(1713870000000);
    nowSpy.mockRestore();
  });

  it('deletes inactive sessions and returns removed user ids', () => {
    const activeSession = {
      commandName: 'active',
      steps: ['step-1'],
      data: {},
    };
    const inactiveSession = {
      commandName: 'inactive',
      steps: ['step-1'],
      data: {},
    };

    manager.set('active-user', activeSession);
    manager.set('inactive-user', inactiveSession);

    const active = manager.get('active-user');
    const inactive = manager.get('inactive-user');

    if (!active || !inactive) {
      throw new Error('Expected both sessions to exist before cleanup');
    }

    active.lastActivity = 5000;
    inactive.lastActivity = 1000;

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(7000);
    const removed = manager.cleanInactiveSessions(3000);

    expect(removed).toEqual(['inactive-user']);
    expect(manager.has('inactive-user')).toBe(false);
    expect(manager.has('active-user')).toBe(true);

    nowSpy.mockRestore();
  });
});
