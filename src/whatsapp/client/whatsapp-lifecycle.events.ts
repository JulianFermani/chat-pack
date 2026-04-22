export const WHATSAPP_LIFECYCLE_EVENTS = {
  authenticated: 'whatsapp.lifecycle.authenticated',
  authFailure: 'whatsapp.lifecycle.auth_failure',
  changeState: 'whatsapp.lifecycle.change_state',
  disconnected: 'whatsapp.lifecycle.disconnected',
  ready: 'whatsapp.lifecycle.ready',
} as const;

export interface WhatsappAuthenticatedEvent {
  clientId: string;
}

export interface WhatsappAuthFailureEvent {
  clientId: string;
  message: string;
}

export interface WhatsappChangeStateEvent {
  clientId: string;
  state: string;
}

export interface WhatsappDisconnectedEvent {
  clientId: string;
  reason: string;
}

export interface WhatsappReadyEvent {
  clientId: string;
}
