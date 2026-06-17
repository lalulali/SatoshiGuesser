const MAX_LINES = 50;

export class Log {
  constructor(textarea) {
    this.el = textarea;
    this.lines = [];
    this._lastAppend = 0;
    this._minInterval = 100; // Minimum ms between DOM updates
  }

  append(line, skipThrottle = false) {
    const now = Date.now();
    
    // Throttle DOM updates unless explicitly skipped
    if (!skipThrottle && now - this._lastAppend < this._minInterval) {
      // Just store the line, don't update DOM yet
      this._queueLine(line);
      return;
    }
    
    // Flush any queued lines
    this._flushQueue();
    
    const ts = new Date().toLocaleTimeString('en-GB', { hour12: false });
    this.lines.push(`[${ts}] ${line}`);
    if (this.lines.length > MAX_LINES) {
      this.lines.splice(0, this.lines.length - MAX_LINES);
    }
    this.el.value = this.lines.join('\n');
    this.el.scrollTop = this.el.scrollHeight;
    this._lastAppend = now;
  }

  _queueLine(line) {
    const ts = new Date().toLocaleTimeString('en-GB', { hour12: false });
    this.lines.push(`[${ts}] ${line}`);
    if (this.lines.length > MAX_LINES) {
      this.lines.splice(0, this.lines.length - MAX_LINES);
    }
  }

  _flushQueue() {
    this.el.value = this.lines.join('\n');
    this.el.scrollTop = this.el.scrollHeight;
  }

  // Force flush any pending updates
  flush() {
    this._flushQueue();
    this._lastAppend = Date.now();
  }

  // Clear all lines
  clear() {
    this.lines = [];
    this.el.value = '';
  }
}
