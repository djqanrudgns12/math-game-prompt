/* Local verification reference. Independent of math, rendering and hardware. */
class InputKernel {
  constructor(now = () => performance.now()) {
    this.now = now; this.round = 0; this.phase = 'ready';
    this.pointers = new Map(); this.players = []; this.finished = 0;
  }
  start(count, seconds) {
    if (!Number.isInteger(count) || count < 1 || count > 6 ||
        !(seconds === null || Number.isFinite(seconds) && seconds > 0)) throw Error('settings');
    this.round++; this.pointers.clear(); this.phase = 'playing';
    this.players = Array.from({length: count}, () => ({revision: 0, locked: false, score: 0}));
    this.deadline = seconds === null ? Infinity : this.now() + seconds * 1000;
  }
  tick() {
    if (this.phase === 'playing' && this.now() >= this.deadline) {
      this.phase = 'result'; this.pointers.clear(); this.finished++;
    }
    return this.phase === 'playing';
  }
  down(id, owner, from) {
    if (!this.tick() || !Number.isInteger(owner) || !this.players[owner] ||
        this.players[owner].locked || this.pointers.has(id) ||
        [...this.pointers.values()].some(p => p.owner === owner)) return false;
    this.pointers.set(id, {owner, from, round: this.round, revision: this.players[owner].revision});
    return true;
  }
  cancel(id) { this.pointers.delete(id); }
  up(id, targetOwner, to) {
    const p = this.pointers.get(id); this.cancel(id);
    if (!p || !this.tick() || p.round !== this.round || p.owner !== targetOwner ||
        !this.players[p.owner] || p.revision !== this.players[p.owner].revision ||
        this.players[p.owner].locked || to == null) return null;
    return {...p, to};
  }
  commit(action, correct) {
    if (!action || !this.tick() || action.round !== this.round) return false;
    const p = this.players[action.owner];
    if (!p || p.locked || p.revision !== action.revision) return false;
    p.locked = true; if (correct) p.score++;
    for (const [id, active] of this.pointers) if (active.owner === action.owner) this.cancel(id);
    return true;
  }
  next(owner, expectedRound = this.round, expectedRevision = this.players[owner]?.revision) {
    const p = this.players[owner];
    if (!this.tick() || expectedRound !== this.round || !p || expectedRevision !== p.revision) return false;
    p.revision++; p.locked = false;
    for (const [id, active] of this.pointers) if (active.owner === owner) this.cancel(id);
    return true;
  }
  pause() {
    if (!this.tick()) return;
    this.remaining = this.deadline - this.now(); this.phase = 'paused'; this.pointers.clear();
  }
  resume() {
    if (this.phase !== 'paused') return;
    this.deadline = this.now() + this.remaining; this.phase = 'playing';
  }
}
if (typeof module !== 'undefined') module.exports = InputKernel;
