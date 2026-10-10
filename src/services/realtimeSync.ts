/**
 * FAIRWAY Nashik - Realtime Cross-Device Synchronization Service
 * 
 * Enables true multi-device sync across:
 * 1. Physical mobile phones on Netlify/Cloud via open real-time PubSub (ntfy.sh SSE)
 * 2. Cross-tab & multi-window sync via BroadcastChannel
 * 3. Local state persistence via StorageEvent
 * 
 * Supported multi-device workflow:
 * - Device 1: Driver (Ramesh Shinde Kaka)
 * - Device 2: Passenger 1 (Pooja Sharma)
 * - Device 3: Passenger 2 (Snehal Patil)
 * - Device 4: Passenger 3 (Neha Kulkarni / Rahul Deshmukh)
 */

export interface RealtimeMessage {
  type:
    | 'PASSENGER_SEARCH_STARTED'
    | 'PASSENGER_SEARCH_CANCELLED'
    | 'STRANGER_MATCH_FOUND'
    | 'PASSENGER_MARKED_READY'
    | 'DRIVER_ASSIGNED_TRIP'
    | 'DRIVER_LOCATION_UPDATE'
    | 'DRIVER_ACCEPTED_RIDE'
    | 'DRIVER_REJECTED_RIDE'
    | 'TRIP_STAGE_CHANGED'
    | 'TRIP_PIN_VERIFIED'
    | 'TRIP_COMPLETED'
    | 'PAYMENT_REMINDER_SENT';
  senderRole: 'DRIVER' | 'PASSENGER' | 'SYSTEM';
  senderId: string;
  senderName: string;
  payload: any;
  timestamp: number;
}

type MessageHandler = (msg: RealtimeMessage) => void;

class RealtimeSyncManager {
  private broadcastChannel: BroadcastChannel | null = null;
  private sseConnection: EventSource | null = null;
  private handlers = new Set<MessageHandler>();
  private readonly roomName = 'fairway_nashik_mesh_v1';
  private readonly publishUrl = 'https://ntfy.sh/fairway_nashik_mesh_v1';
  private readonly sseUrl = 'https://ntfy.sh/fairway_nashik_mesh_v1/sse';
  private lastSentHash = '';
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    // 1. Cross-tab BroadcastChannel
    try {
      if ('BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('fairway_cross_tab_mesh');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type) {
            this.notifyHandlers(event.data);
          }
        };
      }
    } catch (e) {
      console.warn('[FAIRWAY Sync] BroadcastChannel not available:', e);
    }

    // 2. Storage event listener (fallback for older browsers/tabs)
    try {
      window.addEventListener('storage', (e) => {
        if (e.key === 'fairway_cross_tab_event' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.notifyHandlers(data);
          } catch (_) {}
        }
      });
    } catch (_) {}

    // 3. Cloud SSE Connection for physical mobile devices over internet
    this.connectCloudSSE();
  }

  private connectCloudSSE() {
    if (typeof window === 'undefined') return;

    try {
      if (this.sseConnection) {
        this.sseConnection.close();
      }

      this.sseConnection = new EventSource(this.sseUrl);

      this.sseConnection.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          // ntfy wraps message in message field
          let messageData = raw;
          if (raw.message) {
            try {
              messageData = JSON.parse(raw.message);
            } catch {
              return;
            }
          }

          if (messageData && messageData.type && messageData.timestamp) {
            const hash = `${messageData.type}_${messageData.timestamp}_${messageData.senderId}`;
            if (hash === this.lastSentHash) {
              return; // Ignore echoes of our own sent message
            }
            this.notifyHandlers(messageData);
          }
        } catch (_) {}
      };

      this.sseConnection.onerror = () => {
        // Reconnect after brief backoff
        setTimeout(() => {
          if (this.sseConnection?.readyState === EventSource.CLOSED) {
            this.connectCloudSSE();
          }
        }, 5000);
      };
    } catch (e) {
      console.warn('[FAIRWAY Sync] Cloud SSE initialization failed (offline mode active):', e);
    }
  }

  public subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  private notifyHandlers(msg: RealtimeMessage) {
    this.handlers.forEach((h) => {
      try {
        h(msg);
      } catch (err) {
        console.error('[FAIRWAY Sync] Handler error:', err);
      }
    });
  }

  public broadcast(msg: Omit<RealtimeMessage, 'timestamp'>) {
    const fullMessage: RealtimeMessage = {
      ...msg,
      timestamp: Date.now(),
    };

    const hash = `${fullMessage.type}_${fullMessage.timestamp}_${fullMessage.senderId}`;
    this.lastSentHash = hash;

    // 1. Broadcast locally across tabs
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(fullMessage);
      } catch (_) {}
    }

    // 2. LocalStorage event
    try {
      localStorage.setItem('fairway_cross_tab_event', JSON.stringify(fullMessage));
    } catch (_) {}

    // 3. Post to Cloud SSE PubSub for external mobile devices
    try {
      fetch(this.publishUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Title': `FAIRWAY: ${fullMessage.type}`,
        },
        body: JSON.stringify(fullMessage),
      }).catch(() => {
        // Ignore network errors in offline/airgapped environments
      });
    } catch (_) {}
  }
}

export const realtimeSync = new RealtimeSyncManager();
