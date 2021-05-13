/**
 * An array-based queue for flash messages
 * @module InfoMessagesQueue
 */


/** @constructor Accepts an optional array of messages to initialize with */
export class InfoMessagesQueue {
  constructor(array) {
    if (array && array.length > 50) throw new Error('InfoMessageQueues cannot contain more than 49 messages')
    this.q = array || [];
  }

  /**
   * Enqueues up to 5 items (this queue class is limited to 50)
   * @param {string} msg The message (or messages) to enqueue
   * @returns the updated queue instance
   */
  add = (...msgs) => {
    msgs.forEach(msg => {
      if (this.q.length === 50) this.q.shift();
      this.q.push(msg);
    });
    return this;
  }

  /** Returns a clone of the queue */
  copy = () => new InfoMessagesQueue([...this.q]);

  /** Returns the queue as an array */
  toArray = () => this.q;
}