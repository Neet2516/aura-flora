export interface QueuedInquiry {
  id: string;
  name: string;
  email: string;
  organization: string;
  service: string;
  brief: string;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
}

const INQUIRY_QUEUE_KEY = 'aura_flora_offline_inquiries_v1';

export class OfflineSyncService {
  private static listeners: ((isOnline: boolean) => void)[] = [];

  static isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  static subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  static notify(isOnline: boolean): void {
    this.listeners.forEach((listener) => {
      try {
        listener(isOnline);
      } catch (err) {
        console.error('Error in connectivity listener', err);
      }
    });
  }

  static getQueuedInquiries(): QueuedInquiry[] {
    try {
      const data = localStorage.getItem(INQUIRY_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static queueInquiry(inquiry: Omit<QueuedInquiry, 'id' | 'timestamp' | 'status'>): QueuedInquiry {
    const queue = this.getQueuedInquiries();
    const item: QueuedInquiry = {
      ...inquiry,
      id: 'inq_' + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      status: 'pending',
    };
    queue.push(item);
    try {
      localStorage.setItem(INQUIRY_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to queue offline inquiry', e);
    }
    return item;
  }

  static async syncQueuedInquiries(): Promise<number> {
    const queue = this.getQueuedInquiries();
    const pending = queue.filter((item) => item.status === 'pending');
    if (pending.length === 0) return 0;

    // Simulate reliable dispatch
    const updated = queue.map((item) => ({ ...item, status: 'synced' as const }));
    try {
      localStorage.setItem(INQUIRY_QUEUE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update synced queue', e);
    }
    return pending.length;
  }

  static clearSyncedInquiries(): void {
    try {
      const queue = this.getQueuedInquiries().filter((item) => item.status === 'pending');
      localStorage.setItem(INQUIRY_QUEUE_KEY, JSON.stringify(queue));
    } catch {
      // ignore
    }
  }
}
