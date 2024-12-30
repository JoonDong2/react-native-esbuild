'use strict';
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);
var __publicField = (obj, key, value) =>
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);
var __accessCheck = (obj, member, msg) =>
  member.has(obj) || __typeError('Cannot ' + msg);
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, 'read from private field'),
  getter ? getter.call(obj) : member.get(obj)
);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, 'write to private field'),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
);
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'), method
);

// lib/node_modules/minipass/dist/commonjs/index.js
var require_lib_node_modules_minipass_dist_commonjs_index_js = __commonJS({
  'lib/node_modules/minipass/dist/commonjs/index.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.Minipass =
      exports2.isWritable =
      exports2.isReadable =
      exports2.isStream =
        void 0;
    var proc =
      typeof process === 'object' && process
        ? process
        : {
            stdout: null,
            stderr: null,
          };
    var node_events_1 = require('events');
    var node_stream_1 = __importDefault(require('stream'));
    var node_string_decoder_1 = require('string_decoder');
    var isStream = (s) =>
      !!s &&
      typeof s === 'object' &&
      (s instanceof Minipass ||
        s instanceof node_stream_1.default ||
        (0, exports2.isReadable)(s) ||
        (0, exports2.isWritable)(s));
    exports2.isStream = isStream;
    var isReadable = (s) =>
      !!s &&
      typeof s === 'object' &&
      s instanceof node_events_1.EventEmitter &&
      typeof s.pipe === 'function' && // node core Writable streams have a pipe() method, but it throws
      s.pipe !== node_stream_1.default.Writable.prototype.pipe;
    exports2.isReadable = isReadable;
    var isWritable = (s) =>
      !!s &&
      typeof s === 'object' &&
      s instanceof node_events_1.EventEmitter &&
      typeof s.write === 'function' &&
      typeof s.end === 'function';
    exports2.isWritable = isWritable;
    var EOF = Symbol('EOF');
    var MAYBE_EMIT_END = Symbol('maybeEmitEnd');
    var EMITTED_END = Symbol('emittedEnd');
    var EMITTING_END = Symbol('emittingEnd');
    var EMITTED_ERROR = Symbol('emittedError');
    var CLOSED = Symbol('closed');
    var READ = Symbol('read');
    var FLUSH = Symbol('flush');
    var FLUSHCHUNK = Symbol('flushChunk');
    var ENCODING = Symbol('encoding');
    var DECODER = Symbol('decoder');
    var FLOWING = Symbol('flowing');
    var PAUSED = Symbol('paused');
    var RESUME = Symbol('resume');
    var BUFFER = Symbol('buffer');
    var PIPES = Symbol('pipes');
    var BUFFERLENGTH = Symbol('bufferLength');
    var BUFFERPUSH = Symbol('bufferPush');
    var BUFFERSHIFT = Symbol('bufferShift');
    var OBJECTMODE = Symbol('objectMode');
    var DESTROYED = Symbol('destroyed');
    var ERROR = Symbol('error');
    var EMITDATA = Symbol('emitData');
    var EMITEND = Symbol('emitEnd');
    var EMITEND2 = Symbol('emitEnd2');
    var ASYNC = Symbol('async');
    var ABORT = Symbol('abort');
    var ABORTED = Symbol('aborted');
    var SIGNAL = Symbol('signal');
    var DATALISTENERS = Symbol('dataListeners');
    var DISCARDED = Symbol('discarded');
    var defer = (fn) => Promise.resolve().then(fn);
    var nodefer = (fn) => fn();
    var isEndish = (ev) =>
      ev === 'end' || ev === 'finish' || ev === 'prefinish';
    var isArrayBufferLike = (b) =>
      b instanceof ArrayBuffer ||
      (!!b &&
        typeof b === 'object' &&
        b.constructor &&
        b.constructor.name === 'ArrayBuffer' &&
        b.byteLength >= 0);
    var isArrayBufferView = (b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);
    var Pipe = class {
      constructor(src, dest, opts) {
        __publicField(this, 'src');
        __publicField(this, 'dest');
        __publicField(this, 'opts');
        __publicField(this, 'ondrain');
        this.src = src;
        this.dest = dest;
        this.opts = opts;
        this.ondrain = () => src[RESUME]();
        this.dest.on('drain', this.ondrain);
      }
      unpipe() {
        this.dest.removeListener('drain', this.ondrain);
      }
      // only here for the prototype
      /* c8 ignore start */
      proxyErrors(_er) {}
      /* c8 ignore stop */
      end() {
        this.unpipe();
        if (this.opts.end) this.dest.end();
      }
    };
    var PipeProxyErrors = class extends Pipe {
      unpipe() {
        this.src.removeListener('error', this.proxyErrors);
        super.unpipe();
      }
      constructor(src, dest, opts) {
        super(src, dest, opts);
        this.proxyErrors = (er) => dest.emit('error', er);
        src.on('error', this.proxyErrors);
      }
    };
    var isObjectModeOptions = (o) => !!o.objectMode;
    var isEncodingOptions = (o) =>
      !o.objectMode && !!o.encoding && o.encoding !== 'buffer';
    var _a2,
      _b,
      _c,
      _d,
      _e,
      _f,
      _g,
      _h,
      _i,
      _j,
      _k,
      _l,
      _m,
      _n,
      _o,
      _p,
      _q,
      _r,
      _s;
    var Minipass = class extends node_events_1.EventEmitter {
      /**
       * If `RType` is Buffer, then options do not need to be provided.
       * Otherwise, an options object must be provided to specify either
       * {@link Minipass.SharedOptions.objectMode} or
       * {@link Minipass.SharedOptions.encoding}, as appropriate.
       */
      constructor(...args) {
        const options = args[0] || {};
        super();
        __publicField(this, _s, false);
        __publicField(this, _r, false);
        __publicField(this, _q, []);
        __publicField(this, _p, []);
        __publicField(this, _o);
        __publicField(this, _n);
        __publicField(this, _m);
        __publicField(this, _l);
        __publicField(this, _k, false);
        __publicField(this, _j, false);
        __publicField(this, _i, false);
        __publicField(this, _h, false);
        __publicField(this, _g, null);
        __publicField(this, _f, 0);
        __publicField(this, _e, false);
        __publicField(this, _d);
        __publicField(this, _c, false);
        __publicField(this, _b, 0);
        __publicField(this, _a2, false);
        /**
         * true if the stream can be written
         */
        __publicField(this, 'writable', true);
        /**
         * true if the stream can be read
         */
        __publicField(this, 'readable', true);
        if (options.objectMode && typeof options.encoding === 'string') {
          throw new TypeError(
            'Encoding and objectMode may not be used together'
          );
        }
        if (isObjectModeOptions(options)) {
          this[OBJECTMODE] = true;
          this[ENCODING] = null;
        } else if (isEncodingOptions(options)) {
          this[ENCODING] = options.encoding;
          this[OBJECTMODE] = false;
        } else {
          this[OBJECTMODE] = false;
          this[ENCODING] = null;
        }
        this[ASYNC] = !!options.async;
        this[DECODER] = this[ENCODING]
          ? new node_string_decoder_1.StringDecoder(this[ENCODING])
          : null;
        if (options && options.debugExposeBuffer === true) {
          Object.defineProperty(this, 'buffer', { get: () => this[BUFFER] });
        }
        if (options && options.debugExposePipes === true) {
          Object.defineProperty(this, 'pipes', { get: () => this[PIPES] });
        }
        const { signal } = options;
        if (signal) {
          this[SIGNAL] = signal;
          if (signal.aborted) {
            this[ABORT]();
          } else {
            signal.addEventListener('abort', () => this[ABORT]());
          }
        }
      }
      /**
       * The amount of data stored in the buffer waiting to be read.
       *
       * For Buffer strings, this will be the total byte length.
       * For string encoding streams, this will be the string character length,
       * according to JavaScript's `string.length` logic.
       * For objectMode streams, this is a count of the items waiting to be
       * emitted.
       */
      get bufferLength() {
        return this[BUFFERLENGTH];
      }
      /**
       * The `BufferEncoding` currently in use, or `null`
       */
      get encoding() {
        return this[ENCODING];
      }
      /**
       * @deprecated - This is a read only property
       */
      set encoding(_enc) {
        throw new Error('Encoding must be set at instantiation time');
      }
      /**
       * @deprecated - Encoding may only be set at instantiation time
       */
      setEncoding(_enc) {
        throw new Error('Encoding must be set at instantiation time');
      }
      /**
       * True if this is an objectMode stream
       */
      get objectMode() {
        return this[OBJECTMODE];
      }
      /**
       * @deprecated - This is a read-only property
       */
      set objectMode(_om) {
        throw new Error('objectMode must be set at instantiation time');
      }
      /**
       * true if this is an async stream
       */
      get ['async']() {
        return this[ASYNC];
      }
      /**
       * Set to true to make this stream async.
       *
       * Once set, it cannot be unset, as this would potentially cause incorrect
       * behavior.  Ie, a sync stream can be made async, but an async stream
       * cannot be safely made sync.
       */
      set ['async'](a) {
        this[ASYNC] = this[ASYNC] || !!a;
      }
      // drop everything and get out of the flow completely
      [((_s = FLOWING),
      (_r = PAUSED),
      (_q = PIPES),
      (_p = BUFFER),
      (_o = OBJECTMODE),
      (_n = ENCODING),
      (_m = ASYNC),
      (_l = DECODER),
      (_k = EOF),
      (_j = EMITTED_END),
      (_i = EMITTING_END),
      (_h = CLOSED),
      (_g = EMITTED_ERROR),
      (_f = BUFFERLENGTH),
      (_e = DESTROYED),
      (_d = SIGNAL),
      (_c = ABORTED),
      (_b = DATALISTENERS),
      (_a2 = DISCARDED),
      ABORT)]() {
        var _a3, _b2;
        this[ABORTED] = true;
        this.emit('abort', (_a3 = this[SIGNAL]) == null ? void 0 : _a3.reason);
        this.destroy((_b2 = this[SIGNAL]) == null ? void 0 : _b2.reason);
      }
      /**
       * True if the stream has been aborted.
       */
      get aborted() {
        return this[ABORTED];
      }
      /**
       * No-op setter. Stream aborted status is set via the AbortSignal provided
       * in the constructor options.
       */
      set aborted(_) {}
      write(chunk, encoding, cb) {
        var _a3;
        if (this[ABORTED]) return false;
        if (this[EOF]) throw new Error('write after end');
        if (this[DESTROYED]) {
          this.emit(
            'error',
            Object.assign(
              new Error('Cannot call write after a stream was destroyed'),
              { code: 'ERR_STREAM_DESTROYED' }
            )
          );
          return true;
        }
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = 'utf8';
        }
        if (!encoding) encoding = 'utf8';
        const fn = this[ASYNC] ? defer : nodefer;
        if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
          if (isArrayBufferView(chunk)) {
            chunk = Buffer.from(
              chunk.buffer,
              chunk.byteOffset,
              chunk.byteLength
            );
          } else if (isArrayBufferLike(chunk)) {
            chunk = Buffer.from(chunk);
          } else if (typeof chunk !== 'string') {
            throw new Error(
              'Non-contiguous data written to non-objectMode stream'
            );
          }
        }
        if (this[OBJECTMODE]) {
          if (this[FLOWING] && this[BUFFERLENGTH] !== 0) this[FLUSH](true);
          if (this[FLOWING]) this.emit('data', chunk);
          else this[BUFFERPUSH](chunk);
          if (this[BUFFERLENGTH] !== 0) this.emit('readable');
          if (cb) fn(cb);
          return this[FLOWING];
        }
        if (!chunk.length) {
          if (this[BUFFERLENGTH] !== 0) this.emit('readable');
          if (cb) fn(cb);
          return this[FLOWING];
        }
        if (
          typeof chunk === 'string' && // unless it is a string already ready for us to use
          !(
            encoding === this[ENCODING] &&
            !((_a3 = this[DECODER]) == null ? void 0 : _a3.lastNeed)
          )
        ) {
          chunk = Buffer.from(chunk, encoding);
        }
        if (Buffer.isBuffer(chunk) && this[ENCODING]) {
          chunk = this[DECODER].write(chunk);
        }
        if (this[FLOWING] && this[BUFFERLENGTH] !== 0) this[FLUSH](true);
        if (this[FLOWING]) this.emit('data', chunk);
        else this[BUFFERPUSH](chunk);
        if (this[BUFFERLENGTH] !== 0) this.emit('readable');
        if (cb) fn(cb);
        return this[FLOWING];
      }
      /**
       * Low-level explicit read method.
       *
       * In objectMode, the argument is ignored, and one item is returned if
       * available.
       *
       * `n` is the number of bytes (or in the case of encoding streams,
       * characters) to consume. If `n` is not provided, then the entire buffer
       * is returned, or `null` is returned if no data is available.
       *
       * If `n` is greater that the amount of data in the internal buffer,
       * then `null` is returned.
       */
      read(n) {
        if (this[DESTROYED]) return null;
        this[DISCARDED] = false;
        if (
          this[BUFFERLENGTH] === 0 ||
          n === 0 ||
          (n && n > this[BUFFERLENGTH])
        ) {
          this[MAYBE_EMIT_END]();
          return null;
        }
        if (this[OBJECTMODE]) n = null;
        if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
          this[BUFFER] = [
            this[ENCODING]
              ? this[BUFFER].join('')
              : Buffer.concat(this[BUFFER], this[BUFFERLENGTH]),
          ];
        }
        const ret = this[READ](n || null, this[BUFFER][0]);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [READ](n, chunk) {
        if (this[OBJECTMODE]) this[BUFFERSHIFT]();
        else {
          const c = chunk;
          if (n === c.length || n === null) this[BUFFERSHIFT]();
          else if (typeof c === 'string') {
            this[BUFFER][0] = c.slice(n);
            chunk = c.slice(0, n);
            this[BUFFERLENGTH] -= n;
          } else {
            this[BUFFER][0] = c.subarray(n);
            chunk = c.subarray(0, n);
            this[BUFFERLENGTH] -= n;
          }
        }
        this.emit('data', chunk);
        if (!this[BUFFER].length && !this[EOF]) this.emit('drain');
        return chunk;
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === 'function') {
          cb = chunk;
          chunk = void 0;
        }
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = 'utf8';
        }
        if (chunk !== void 0) this.write(chunk, encoding);
        if (cb) this.once('end', cb);
        this[EOF] = true;
        this.writable = false;
        if (this[FLOWING] || !this[PAUSED]) this[MAYBE_EMIT_END]();
        return this;
      }
      // don't let the internal resume be overwritten
      [RESUME]() {
        if (this[DESTROYED]) return;
        if (!this[DATALISTENERS] && !this[PIPES].length) {
          this[DISCARDED] = true;
        }
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit('resume');
        if (this[BUFFER].length) this[FLUSH]();
        else if (this[EOF]) this[MAYBE_EMIT_END]();
        else this.emit('drain');
      }
      /**
       * Resume the stream if it is currently in a paused state
       *
       * If called when there are no pipe destinations or `data` event listeners,
       * this will place the stream in a "discarded" state, where all data will
       * be thrown away. The discarded state is removed if a pipe destination or
       * data handler is added, if pause() is called, or if any synchronous or
       * asynchronous iteration is started.
       */
      resume() {
        return this[RESUME]();
      }
      /**
       * Pause the stream
       */
      pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
        this[DISCARDED] = false;
      }
      /**
       * true if the stream has been forcibly destroyed
       */
      get destroyed() {
        return this[DESTROYED];
      }
      /**
       * true if the stream is currently in a flowing state, meaning that
       * any writes will be immediately emitted.
       */
      get flowing() {
        return this[FLOWING];
      }
      /**
       * true if the stream is currently in a paused state
       */
      get paused() {
        return this[PAUSED];
      }
      [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE]) this[BUFFERLENGTH] += 1;
        else this[BUFFERLENGTH] += chunk.length;
        this[BUFFER].push(chunk);
      }
      [BUFFERSHIFT]() {
        if (this[OBJECTMODE]) this[BUFFERLENGTH] -= 1;
        else this[BUFFERLENGTH] -= this[BUFFER][0].length;
        return this[BUFFER].shift();
      }
      [FLUSH](noDrain = false) {
        do {} while (
          this[FLUSHCHUNK](this[BUFFERSHIFT]()) &&
          this[BUFFER].length
        );
        if (!noDrain && !this[BUFFER].length && !this[EOF]) this.emit('drain');
      }
      [FLUSHCHUNK](chunk) {
        this.emit('data', chunk);
        return this[FLOWING];
      }
      /**
       * Pipe all data emitted by this stream into the destination provided.
       *
       * Triggers the flow of data.
       */
      pipe(dest, opts) {
        if (this[DESTROYED]) return dest;
        this[DISCARDED] = false;
        const ended = this[EMITTED_END];
        opts = opts || {};
        if (dest === proc.stdout || dest === proc.stderr) opts.end = false;
        else opts.end = opts.end !== false;
        opts.proxyErrors = !!opts.proxyErrors;
        if (ended) {
          if (opts.end) dest.end();
        } else {
          this[PIPES].push(
            !opts.proxyErrors
              ? new Pipe(this, dest, opts)
              : new PipeProxyErrors(this, dest, opts)
          );
          if (this[ASYNC]) defer(() => this[RESUME]());
          else this[RESUME]();
        }
        return dest;
      }
      /**
       * Fully unhook a piped destination stream.
       *
       * If the destination stream was the only consumer of this stream (ie,
       * there are no other piped destinations or `'data'` event listeners)
       * then the flow of data will stop until there is another consumer or
       * {@link Minipass#resume} is explicitly called.
       */
      unpipe(dest) {
        const p = this[PIPES].find((p2) => p2.dest === dest);
        if (p) {
          if (this[PIPES].length === 1) {
            if (this[FLOWING] && this[DATALISTENERS] === 0) {
              this[FLOWING] = false;
            }
            this[PIPES] = [];
          } else this[PIPES].splice(this[PIPES].indexOf(p), 1);
          p.unpipe();
        }
      }
      /**
       * Alias for {@link Minipass#on}
       */
      addListener(ev, handler) {
        return this.on(ev, handler);
      }
      /**
       * Mostly identical to `EventEmitter.on`, with the following
       * behavior differences to prevent data loss and unnecessary hangs:
       *
       * - Adding a 'data' event handler will trigger the flow of data
       *
       * - Adding a 'readable' event handler when there is data waiting to be read
       *   will cause 'readable' to be emitted immediately.
       *
       * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
       *   already passed will cause the event to be emitted immediately and all
       *   handlers removed.
       *
       * - Adding an 'error' event handler after an error has been emitted will
       *   cause the event to be re-emitted immediately with the error previously
       *   raised.
       */
      on(ev, handler) {
        const ret = super.on(ev, handler);
        if (ev === 'data') {
          this[DISCARDED] = false;
          this[DATALISTENERS]++;
          if (!this[PIPES].length && !this[FLOWING]) {
            this[RESUME]();
          }
        } else if (ev === 'readable' && this[BUFFERLENGTH] !== 0) {
          super.emit('readable');
        } else if (isEndish(ev) && this[EMITTED_END]) {
          super.emit(ev);
          this.removeAllListeners(ev);
        } else if (ev === 'error' && this[EMITTED_ERROR]) {
          const h = handler;
          if (this[ASYNC]) defer(() => h.call(this, this[EMITTED_ERROR]));
          else h.call(this, this[EMITTED_ERROR]);
        }
        return ret;
      }
      /**
       * Alias for {@link Minipass#off}
       */
      removeListener(ev, handler) {
        return this.off(ev, handler);
      }
      /**
       * Mostly identical to `EventEmitter.off`
       *
       * If a 'data' event handler is removed, and it was the last consumer
       * (ie, there are no pipe destinations or other 'data' event listeners),
       * then the flow of data will stop until there is another consumer or
       * {@link Minipass#resume} is explicitly called.
       */
      off(ev, handler) {
        const ret = super.off(ev, handler);
        if (ev === 'data') {
          this[DATALISTENERS] = this.listeners('data').length;
          if (
            this[DATALISTENERS] === 0 &&
            !this[DISCARDED] &&
            !this[PIPES].length
          ) {
            this[FLOWING] = false;
          }
        }
        return ret;
      }
      /**
       * Mostly identical to `EventEmitter.removeAllListeners`
       *
       * If all 'data' event handlers are removed, and they were the last consumer
       * (ie, there are no pipe destinations), then the flow of data will stop
       * until there is another consumer or {@link Minipass#resume} is explicitly
       * called.
       */
      removeAllListeners(ev) {
        const ret = super.removeAllListeners(ev);
        if (ev === 'data' || ev === void 0) {
          this[DATALISTENERS] = 0;
          if (!this[DISCARDED] && !this[PIPES].length) {
            this[FLOWING] = false;
          }
        }
        return ret;
      }
      /**
       * true if the 'end' event has been emitted
       */
      get emittedEnd() {
        return this[EMITTED_END];
      }
      [MAYBE_EMIT_END]() {
        if (
          !this[EMITTING_END] &&
          !this[EMITTED_END] &&
          !this[DESTROYED] &&
          this[BUFFER].length === 0 &&
          this[EOF]
        ) {
          this[EMITTING_END] = true;
          this.emit('end');
          this.emit('prefinish');
          this.emit('finish');
          if (this[CLOSED]) this.emit('close');
          this[EMITTING_END] = false;
        }
      }
      /**
       * Mostly identical to `EventEmitter.emit`, with the following
       * behavior differences to prevent data loss and unnecessary hangs:
       *
       * If the stream has been destroyed, and the event is something other
       * than 'close' or 'error', then `false` is returned and no handlers
       * are called.
       *
       * If the event is 'end', and has already been emitted, then the event
       * is ignored. If the stream is in a paused or non-flowing state, then
       * the event will be deferred until data flow resumes. If the stream is
       * async, then handlers will be called on the next tick rather than
       * immediately.
       *
       * If the event is 'close', and 'end' has not yet been emitted, then
       * the event will be deferred until after 'end' is emitted.
       *
       * If the event is 'error', and an AbortSignal was provided for the stream,
       * and there are no listeners, then the event is ignored, matching the
       * behavior of node core streams in the presense of an AbortSignal.
       *
       * If the event is 'finish' or 'prefinish', then all listeners will be
       * removed after emitting the event, to prevent double-firing.
       */
      emit(ev, ...args) {
        const data = args[0];
        if (
          ev !== 'error' &&
          ev !== 'close' &&
          ev !== DESTROYED &&
          this[DESTROYED]
        ) {
          return false;
        } else if (ev === 'data') {
          return !this[OBJECTMODE] && !data
            ? false
            : this[ASYNC]
              ? (defer(() => this[EMITDATA](data)), true)
              : this[EMITDATA](data);
        } else if (ev === 'end') {
          return this[EMITEND]();
        } else if (ev === 'close') {
          this[CLOSED] = true;
          if (!this[EMITTED_END] && !this[DESTROYED]) return false;
          const ret2 = super.emit('close');
          this.removeAllListeners('close');
          return ret2;
        } else if (ev === 'error') {
          this[EMITTED_ERROR] = data;
          super.emit(ERROR, data);
          const ret2 =
            !this[SIGNAL] || this.listeners('error').length
              ? super.emit('error', data)
              : false;
          this[MAYBE_EMIT_END]();
          return ret2;
        } else if (ev === 'resume') {
          const ret2 = super.emit('resume');
          this[MAYBE_EMIT_END]();
          return ret2;
        } else if (ev === 'finish' || ev === 'prefinish') {
          const ret2 = super.emit(ev);
          this.removeAllListeners(ev);
          return ret2;
        }
        const ret = super.emit(ev, ...args);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [EMITDATA](data) {
        for (const p of this[PIPES]) {
          if (p.dest.write(data) === false) this.pause();
        }
        const ret = this[DISCARDED] ? false : super.emit('data', data);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [EMITEND]() {
        if (this[EMITTED_END]) return false;
        this[EMITTED_END] = true;
        this.readable = false;
        return this[ASYNC]
          ? (defer(() => this[EMITEND2]()), true)
          : this[EMITEND2]();
      }
      [EMITEND2]() {
        if (this[DECODER]) {
          const data = this[DECODER].end();
          if (data) {
            for (const p of this[PIPES]) {
              p.dest.write(data);
            }
            if (!this[DISCARDED]) super.emit('data', data);
          }
        }
        for (const p of this[PIPES]) {
          p.end();
        }
        const ret = super.emit('end');
        this.removeAllListeners('end');
        return ret;
      }
      /**
       * Return a Promise that resolves to an array of all emitted data once
       * the stream ends.
       */
      async collect() {
        const buf = Object.assign([], {
          dataLength: 0,
        });
        if (!this[OBJECTMODE]) buf.dataLength = 0;
        const p = this.promise();
        this.on('data', (c) => {
          buf.push(c);
          if (!this[OBJECTMODE]) buf.dataLength += c.length;
        });
        await p;
        return buf;
      }
      /**
       * Return a Promise that resolves to the concatenation of all emitted data
       * once the stream ends.
       *
       * Not allowed on objectMode streams.
       */
      async concat() {
        if (this[OBJECTMODE]) {
          throw new Error('cannot concat in objectMode');
        }
        const buf = await this.collect();
        return this[ENCODING]
          ? buf.join('')
          : Buffer.concat(buf, buf.dataLength);
      }
      /**
       * Return a void Promise that resolves once the stream ends.
       */
      async promise() {
        return new Promise((resolve, reject) => {
          this.on(DESTROYED, () => reject(new Error('stream destroyed')));
          this.on('error', (er) => reject(er));
          this.on('end', () => resolve());
        });
      }
      /**
       * Asynchronous `for await of` iteration.
       *
       * This will continue emitting all chunks until the stream terminates.
       */
      [Symbol.asyncIterator]() {
        this[DISCARDED] = false;
        let stopped = false;
        const stop2 = async () => {
          this.pause();
          stopped = true;
          return { value: void 0, done: true };
        };
        const next = () => {
          if (stopped) return stop2();
          const res = this.read();
          if (res !== null) return Promise.resolve({ done: false, value: res });
          if (this[EOF]) return stop2();
          let resolve;
          let reject;
          const onerr = (er) => {
            this.off('data', ondata);
            this.off('end', onend);
            this.off(DESTROYED, ondestroy);
            stop2();
            reject(er);
          };
          const ondata = (value) => {
            this.off('error', onerr);
            this.off('end', onend);
            this.off(DESTROYED, ondestroy);
            this.pause();
            resolve({ value, done: !!this[EOF] });
          };
          const onend = () => {
            this.off('error', onerr);
            this.off('data', ondata);
            this.off(DESTROYED, ondestroy);
            stop2();
            resolve({ done: true, value: void 0 });
          };
          const ondestroy = () => onerr(new Error('stream destroyed'));
          return new Promise((res2, rej) => {
            reject = rej;
            resolve = res2;
            this.once(DESTROYED, ondestroy);
            this.once('error', onerr);
            this.once('end', onend);
            this.once('data', ondata);
          });
        };
        return {
          next,
          throw: stop2,
          return: stop2,
          [Symbol.asyncIterator]() {
            return this;
          },
        };
      }
      /**
       * Synchronous `for of` iteration.
       *
       * The iteration will terminate when the internal buffer runs out, even
       * if the stream has not yet terminated.
       */
      [Symbol.iterator]() {
        this[DISCARDED] = false;
        let stopped = false;
        const stop2 = () => {
          this.pause();
          this.off(ERROR, stop2);
          this.off(DESTROYED, stop2);
          this.off('end', stop2);
          stopped = true;
          return { done: true, value: void 0 };
        };
        const next = () => {
          if (stopped) return stop2();
          const value = this.read();
          return value === null ? stop2() : { done: false, value };
        };
        this.once('end', stop2);
        this.once(ERROR, stop2);
        this.once(DESTROYED, stop2);
        return {
          next,
          throw: stop2,
          return: stop2,
          [Symbol.iterator]() {
            return this;
          },
        };
      }
      /**
       * Destroy a stream, preventing it from being used for any further purpose.
       *
       * If the stream has a `close()` method, then it will be called on
       * destruction.
       *
       * After destruction, any attempt to write data, read data, or emit most
       * events will be ignored.
       *
       * If an error argument is provided, then it will be emitted in an
       * 'error' event.
       */
      destroy(er) {
        if (this[DESTROYED]) {
          if (er) this.emit('error', er);
          else this.emit(DESTROYED);
          return this;
        }
        this[DESTROYED] = true;
        this[DISCARDED] = true;
        this[BUFFER].length = 0;
        this[BUFFERLENGTH] = 0;
        const wc = this;
        if (typeof wc.close === 'function' && !this[CLOSED]) wc.close();
        if (er) this.emit('error', er);
        else this.emit(DESTROYED);
        return this;
      }
      /**
       * Alias for {@link isStream}
       *
       * Former export location, maintained for backwards compatibility.
       *
       * @deprecated
       */
      static get isStream() {
        return exports2.isStream;
      }
    };
    exports2.Minipass = Minipass;
  },
});

// lib/node_modules/@isaacs/fs-minipass/dist/commonjs/index.js
var require_lib_node_modules__isaacs_fs_minipass_dist_commonjs_index_js =
  __commonJS({
    'lib/node_modules/@isaacs/fs-minipass/dist/commonjs/index.js'(exports2) {
      'use strict';
      var __importDefault =
        (exports2 && exports2.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        };
      Object.defineProperty(exports2, '__esModule', { value: true });
      exports2.WriteStreamSync =
        exports2.WriteStream =
        exports2.ReadStreamSync =
        exports2.ReadStream =
          void 0;
      var events_1 = __importDefault(require('events'));
      var fs_1 = __importDefault(require('fs'));
      var minipass_1 =
        require_lib_node_modules_minipass_dist_commonjs_index_js();
      var writev = fs_1.default.writev;
      var _autoClose = Symbol('_autoClose');
      var _close = Symbol('_close');
      var _ended = Symbol('_ended');
      var _fd = Symbol('_fd');
      var _finished = Symbol('_finished');
      var _flags = Symbol('_flags');
      var _flush = Symbol('_flush');
      var _handleChunk = Symbol('_handleChunk');
      var _makeBuf = Symbol('_makeBuf');
      var _mode = Symbol('_mode');
      var _needDrain = Symbol('_needDrain');
      var _onerror = Symbol('_onerror');
      var _onopen = Symbol('_onopen');
      var _onread = Symbol('_onread');
      var _onwrite = Symbol('_onwrite');
      var _open = Symbol('_open');
      var _path = Symbol('_path');
      var _pos = Symbol('_pos');
      var _queue = Symbol('_queue');
      var _read = Symbol('_read');
      var _readSize = Symbol('_readSize');
      var _reading = Symbol('_reading');
      var _remain = Symbol('_remain');
      var _size = Symbol('_size');
      var _write = Symbol('_write');
      var _writing = Symbol('_writing');
      var _defaultFlag = Symbol('_defaultFlag');
      var _errored = Symbol('_errored');
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      var ReadStream = class extends minipass_1.Minipass {
        constructor(path3, opt) {
          opt = opt || {};
          super(opt);
          __publicField(this, _h, false);
          __publicField(this, _g);
          __publicField(this, _f);
          __publicField(this, _e);
          __publicField(this, _d, false);
          __publicField(this, _c);
          __publicField(this, _b);
          __publicField(this, _a2);
          this.readable = true;
          this.writable = false;
          if (typeof path3 !== 'string') {
            throw new TypeError('path must be a string');
          }
          this[_errored] = false;
          this[_fd] = typeof opt.fd === 'number' ? opt.fd : void 0;
          this[_path] = path3;
          this[_readSize] = opt.readSize || 16 * 1024 * 1024;
          this[_reading] = false;
          this[_size] = typeof opt.size === 'number' ? opt.size : Infinity;
          this[_remain] = this[_size];
          this[_autoClose] =
            typeof opt.autoClose === 'boolean' ? opt.autoClose : true;
          if (typeof this[_fd] === 'number') {
            this[_read]();
          } else {
            this[_open]();
          }
        }
        get fd() {
          return this[_fd];
        }
        get path() {
          return this[_path];
        }
        //@ts-ignore
        write() {
          throw new TypeError('this is a readable stream');
        }
        //@ts-ignore
        end() {
          throw new TypeError('this is a readable stream');
        }
        [((_h = _errored),
        (_g = _fd),
        (_f = _path),
        (_e = _readSize),
        (_d = _reading),
        (_c = _size),
        (_b = _remain),
        (_a2 = _autoClose),
        _open)]() {
          fs_1.default.open(this[_path], 'r', (er, fd) =>
            this[_onopen](er, fd)
          );
        }
        [_onopen](er, fd) {
          if (er) {
            this[_onerror](er);
          } else {
            this[_fd] = fd;
            this.emit('open', fd);
            this[_read]();
          }
        }
        [_makeBuf]() {
          return Buffer.allocUnsafe(Math.min(this[_readSize], this[_remain]));
        }
        [_read]() {
          if (!this[_reading]) {
            this[_reading] = true;
            const buf = this[_makeBuf]();
            if (buf.length === 0) {
              return process.nextTick(() => this[_onread](null, 0, buf));
            }
            fs_1.default.read(
              this[_fd],
              buf,
              0,
              buf.length,
              null,
              (er, br, b) => this[_onread](er, br, b)
            );
          }
        }
        [_onread](er, br, buf) {
          this[_reading] = false;
          if (er) {
            this[_onerror](er);
          } else if (this[_handleChunk](br, buf)) {
            this[_read]();
          }
        }
        [_close]() {
          if (this[_autoClose] && typeof this[_fd] === 'number') {
            const fd = this[_fd];
            this[_fd] = void 0;
            fs_1.default.close(fd, (er) =>
              er ? this.emit('error', er) : this.emit('close')
            );
          }
        }
        [_onerror](er) {
          this[_reading] = true;
          this[_close]();
          this.emit('error', er);
        }
        [_handleChunk](br, buf) {
          let ret = false;
          this[_remain] -= br;
          if (br > 0) {
            ret = super.write(br < buf.length ? buf.subarray(0, br) : buf);
          }
          if (br === 0 || this[_remain] <= 0) {
            ret = false;
            this[_close]();
            super.end();
          }
          return ret;
        }
        emit(ev, ...args) {
          switch (ev) {
            case 'prefinish':
            case 'finish':
              return false;
            case 'drain':
              if (typeof this[_fd] === 'number') {
                this[_read]();
              }
              return false;
            case 'error':
              if (this[_errored]) {
                return false;
              }
              this[_errored] = true;
              return super.emit(ev, ...args);
            default:
              return super.emit(ev, ...args);
          }
        }
      };
      exports2.ReadStream = ReadStream;
      var ReadStreamSync = class extends ReadStream {
        [_open]() {
          let threw = true;
          try {
            this[_onopen](null, fs_1.default.openSync(this[_path], 'r'));
            threw = false;
          } finally {
            if (threw) {
              this[_close]();
            }
          }
        }
        [_read]() {
          let threw = true;
          try {
            if (!this[_reading]) {
              this[_reading] = true;
              do {
                const buf = this[_makeBuf]();
                const br =
                  buf.length === 0
                    ? 0
                    : fs_1.default.readSync(
                        this[_fd],
                        buf,
                        0,
                        buf.length,
                        null
                      );
                if (!this[_handleChunk](br, buf)) {
                  break;
                }
              } while (true);
              this[_reading] = false;
            }
            threw = false;
          } finally {
            if (threw) {
              this[_close]();
            }
          }
        }
        [_close]() {
          if (this[_autoClose] && typeof this[_fd] === 'number') {
            const fd = this[_fd];
            this[_fd] = void 0;
            fs_1.default.closeSync(fd);
            this.emit('close');
          }
        }
      };
      exports2.ReadStreamSync = ReadStreamSync;
      var _a3, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i, _j, _k, _l, _m;
      var WriteStream = class extends events_1.default {
        constructor(path3, opt) {
          opt = opt || {};
          super(opt);
          __publicField(this, 'readable', false);
          __publicField(this, 'writable', true);
          __publicField(this, _m, false);
          __publicField(this, _l, false);
          __publicField(this, _k, false);
          __publicField(this, _j, []);
          __publicField(this, _i, false);
          __publicField(this, _h2);
          __publicField(this, _g2);
          __publicField(this, _f2);
          __publicField(this, _e2);
          __publicField(this, _d2);
          __publicField(this, _c2);
          __publicField(this, _b2, false);
          __publicField(this, _a3);
          this[_path] = path3;
          this[_fd] = typeof opt.fd === 'number' ? opt.fd : void 0;
          this[_mode] = opt.mode === void 0 ? 438 : opt.mode;
          this[_pos] = typeof opt.start === 'number' ? opt.start : void 0;
          this[_autoClose] =
            typeof opt.autoClose === 'boolean' ? opt.autoClose : true;
          const defaultFlag = this[_pos] !== void 0 ? 'r+' : 'w';
          this[_defaultFlag] = opt.flags === void 0;
          this[_flags] = opt.flags === void 0 ? defaultFlag : opt.flags;
          if (this[_fd] === void 0) {
            this[_open]();
          }
        }
        emit(ev, ...args) {
          if (ev === 'error') {
            if (this[_errored]) {
              return false;
            }
            this[_errored] = true;
          }
          return super.emit(ev, ...args);
        }
        get fd() {
          return this[_fd];
        }
        get path() {
          return this[_path];
        }
        [((_m = _errored),
        (_l = _writing),
        (_k = _ended),
        (_j = _queue),
        (_i = _needDrain),
        (_h2 = _path),
        (_g2 = _mode),
        (_f2 = _autoClose),
        (_e2 = _fd),
        (_d2 = _defaultFlag),
        (_c2 = _flags),
        (_b2 = _finished),
        (_a3 = _pos),
        _onerror)](er) {
          this[_close]();
          this[_writing] = true;
          this.emit('error', er);
        }
        [_open]() {
          fs_1.default.open(this[_path], this[_flags], this[_mode], (er, fd) =>
            this[_onopen](er, fd)
          );
        }
        [_onopen](er, fd) {
          if (
            this[_defaultFlag] &&
            this[_flags] === 'r+' &&
            er &&
            er.code === 'ENOENT'
          ) {
            this[_flags] = 'w';
            this[_open]();
          } else if (er) {
            this[_onerror](er);
          } else {
            this[_fd] = fd;
            this.emit('open', fd);
            if (!this[_writing]) {
              this[_flush]();
            }
          }
        }
        end(buf, enc) {
          if (buf) {
            this.write(buf, enc);
          }
          this[_ended] = true;
          if (
            !this[_writing] &&
            !this[_queue].length &&
            typeof this[_fd] === 'number'
          ) {
            this[_onwrite](null, 0);
          }
          return this;
        }
        write(buf, enc) {
          if (typeof buf === 'string') {
            buf = Buffer.from(buf, enc);
          }
          if (this[_ended]) {
            this.emit('error', new Error('write() after end()'));
            return false;
          }
          if (this[_fd] === void 0 || this[_writing] || this[_queue].length) {
            this[_queue].push(buf);
            this[_needDrain] = true;
            return false;
          }
          this[_writing] = true;
          this[_write](buf);
          return true;
        }
        [_write](buf) {
          fs_1.default.write(
            this[_fd],
            buf,
            0,
            buf.length,
            this[_pos],
            (er, bw) => this[_onwrite](er, bw)
          );
        }
        [_onwrite](er, bw) {
          if (er) {
            this[_onerror](er);
          } else {
            if (this[_pos] !== void 0 && typeof bw === 'number') {
              this[_pos] += bw;
            }
            if (this[_queue].length) {
              this[_flush]();
            } else {
              this[_writing] = false;
              if (this[_ended] && !this[_finished]) {
                this[_finished] = true;
                this[_close]();
                this.emit('finish');
              } else if (this[_needDrain]) {
                this[_needDrain] = false;
                this.emit('drain');
              }
            }
          }
        }
        [_flush]() {
          if (this[_queue].length === 0) {
            if (this[_ended]) {
              this[_onwrite](null, 0);
            }
          } else if (this[_queue].length === 1) {
            this[_write](this[_queue].pop());
          } else {
            const iovec = this[_queue];
            this[_queue] = [];
            writev(this[_fd], iovec, this[_pos], (er, bw) =>
              this[_onwrite](er, bw)
            );
          }
        }
        [_close]() {
          if (this[_autoClose] && typeof this[_fd] === 'number') {
            const fd = this[_fd];
            this[_fd] = void 0;
            fs_1.default.close(fd, (er) =>
              er ? this.emit('error', er) : this.emit('close')
            );
          }
        }
      };
      exports2.WriteStream = WriteStream;
      var WriteStreamSync = class extends WriteStream {
        [_open]() {
          let fd;
          if (this[_defaultFlag] && this[_flags] === 'r+') {
            try {
              fd = fs_1.default.openSync(
                this[_path],
                this[_flags],
                this[_mode]
              );
            } catch (er) {
              if ((er == null ? void 0 : er.code) === 'ENOENT') {
                this[_flags] = 'w';
                return this[_open]();
              } else {
                throw er;
              }
            }
          } else {
            fd = fs_1.default.openSync(this[_path], this[_flags], this[_mode]);
          }
          this[_onopen](null, fd);
        }
        [_close]() {
          if (this[_autoClose] && typeof this[_fd] === 'number') {
            const fd = this[_fd];
            this[_fd] = void 0;
            fs_1.default.closeSync(fd);
            this.emit('close');
          }
        }
        [_write](buf) {
          let threw = true;
          try {
            this[_onwrite](
              null,
              fs_1.default.writeSync(this[_fd], buf, 0, buf.length, this[_pos])
            );
            threw = false;
          } finally {
            if (threw) {
              try {
                this[_close]();
              } catch {}
            }
          }
        }
      };
      exports2.WriteStreamSync = WriteStreamSync;
    },
  });

// lib/node_modules/tar/dist/commonjs/options.js
var require_lib_node_modules_tar_dist_commonjs_options_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/options.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.dealias =
      exports2.isNoFile =
      exports2.isFile =
      exports2.isAsync =
      exports2.isSync =
      exports2.isAsyncNoFile =
      exports2.isSyncNoFile =
      exports2.isAsyncFile =
      exports2.isSyncFile =
        void 0;
    var argmap = /* @__PURE__ */ new Map([
      ['C', 'cwd'],
      ['f', 'file'],
      ['z', 'gzip'],
      ['P', 'preservePaths'],
      ['U', 'unlink'],
      ['strip-components', 'strip'],
      ['stripComponents', 'strip'],
      ['keep-newer', 'newer'],
      ['keepNewer', 'newer'],
      ['keep-newer-files', 'newer'],
      ['keepNewerFiles', 'newer'],
      ['k', 'keep'],
      ['keep-existing', 'keep'],
      ['keepExisting', 'keep'],
      ['m', 'noMtime'],
      ['no-mtime', 'noMtime'],
      ['p', 'preserveOwner'],
      ['L', 'follow'],
      ['h', 'follow'],
      ['onentry', 'onReadEntry'],
    ]);
    var isSyncFile = (o) => !!o.sync && !!o.file;
    exports2.isSyncFile = isSyncFile;
    var isAsyncFile = (o) => !o.sync && !!o.file;
    exports2.isAsyncFile = isAsyncFile;
    var isSyncNoFile = (o) => !!o.sync && !o.file;
    exports2.isSyncNoFile = isSyncNoFile;
    var isAsyncNoFile = (o) => !o.sync && !o.file;
    exports2.isAsyncNoFile = isAsyncNoFile;
    var isSync = (o) => !!o.sync;
    exports2.isSync = isSync;
    var isAsync = (o) => !o.sync;
    exports2.isAsync = isAsync;
    var isFile = (o) => !!o.file;
    exports2.isFile = isFile;
    var isNoFile = (o) => !o.file;
    exports2.isNoFile = isNoFile;
    var dealiasKey = (k) => {
      const d = argmap.get(k);
      if (d) return d;
      return k;
    };
    var dealias = (opt = {}) => {
      if (!opt) return {};
      const result = {};
      for (const [key, v] of Object.entries(opt)) {
        const k = dealiasKey(key);
        result[k] = v;
      }
      if (result.chmod === void 0 && result.noChmod === false) {
        result.chmod = true;
      }
      delete result.noChmod;
      return result;
    };
    exports2.dealias = dealias;
  },
});

// lib/node_modules/tar/dist/commonjs/make-command.js
var require_lib_node_modules_tar_dist_commonjs_make_command_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/make-command.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.makeCommand = void 0;
    var options_js_1 = require_lib_node_modules_tar_dist_commonjs_options_js();
    var makeCommand = (
      syncFile,
      asyncFile,
      syncNoFile,
      asyncNoFile,
      validate
    ) => {
      return Object.assign(
        (opt_ = [], entries, cb) => {
          if (Array.isArray(opt_)) {
            entries = opt_;
            opt_ = {};
          }
          if (typeof entries === 'function') {
            cb = entries;
            entries = void 0;
          }
          if (!entries) {
            entries = [];
          } else {
            entries = Array.from(entries);
          }
          const opt = (0, options_js_1.dealias)(opt_);
          validate == null ? void 0 : validate(opt, entries);
          if ((0, options_js_1.isSyncFile)(opt)) {
            if (typeof cb === 'function') {
              throw new TypeError(
                'callback not supported for sync tar functions'
              );
            }
            return syncFile(opt, entries);
          } else if ((0, options_js_1.isAsyncFile)(opt)) {
            const p = asyncFile(opt, entries);
            const c = cb ? cb : void 0;
            return c ? p.then(() => c(), c) : p;
          } else if ((0, options_js_1.isSyncNoFile)(opt)) {
            if (typeof cb === 'function') {
              throw new TypeError(
                'callback not supported for sync tar functions'
              );
            }
            return syncNoFile(opt, entries);
          } else if ((0, options_js_1.isAsyncNoFile)(opt)) {
            if (typeof cb === 'function') {
              throw new TypeError('callback only supported with file option');
            }
            return asyncNoFile(opt, entries);
          } else {
            throw new Error('impossible options??');
          }
        },
        {
          syncFile,
          asyncFile,
          syncNoFile,
          asyncNoFile,
          validate,
        }
      );
    };
    exports2.makeCommand = makeCommand;
  },
});

// lib/node_modules/minizlib/dist/commonjs/constants.js
var require_lib_node_modules_minizlib_dist_commonjs_constants_js = __commonJS({
  'lib/node_modules/minizlib/dist/commonjs/constants.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.constants = void 0;
    var zlib_1 = __importDefault(require('zlib'));
    var realZlibConstants = zlib_1.default.constants || { ZLIB_VERNUM: 4736 };
    exports2.constants = Object.freeze(
      Object.assign(
        /* @__PURE__ */ Object.create(null),
        {
          Z_NO_FLUSH: 0,
          Z_PARTIAL_FLUSH: 1,
          Z_SYNC_FLUSH: 2,
          Z_FULL_FLUSH: 3,
          Z_FINISH: 4,
          Z_BLOCK: 5,
          Z_OK: 0,
          Z_STREAM_END: 1,
          Z_NEED_DICT: 2,
          Z_ERRNO: -1,
          Z_STREAM_ERROR: -2,
          Z_DATA_ERROR: -3,
          Z_MEM_ERROR: -4,
          Z_BUF_ERROR: -5,
          Z_VERSION_ERROR: -6,
          Z_NO_COMPRESSION: 0,
          Z_BEST_SPEED: 1,
          Z_BEST_COMPRESSION: 9,
          Z_DEFAULT_COMPRESSION: -1,
          Z_FILTERED: 1,
          Z_HUFFMAN_ONLY: 2,
          Z_RLE: 3,
          Z_FIXED: 4,
          Z_DEFAULT_STRATEGY: 0,
          DEFLATE: 1,
          INFLATE: 2,
          GZIP: 3,
          GUNZIP: 4,
          DEFLATERAW: 5,
          INFLATERAW: 6,
          UNZIP: 7,
          BROTLI_DECODE: 8,
          BROTLI_ENCODE: 9,
          Z_MIN_WINDOWBITS: 8,
          Z_MAX_WINDOWBITS: 15,
          Z_DEFAULT_WINDOWBITS: 15,
          Z_MIN_CHUNK: 64,
          Z_MAX_CHUNK: Infinity,
          Z_DEFAULT_CHUNK: 16384,
          Z_MIN_MEMLEVEL: 1,
          Z_MAX_MEMLEVEL: 9,
          Z_DEFAULT_MEMLEVEL: 8,
          Z_MIN_LEVEL: -1,
          Z_MAX_LEVEL: 9,
          Z_DEFAULT_LEVEL: -1,
          BROTLI_OPERATION_PROCESS: 0,
          BROTLI_OPERATION_FLUSH: 1,
          BROTLI_OPERATION_FINISH: 2,
          BROTLI_OPERATION_EMIT_METADATA: 3,
          BROTLI_MODE_GENERIC: 0,
          BROTLI_MODE_TEXT: 1,
          BROTLI_MODE_FONT: 2,
          BROTLI_DEFAULT_MODE: 0,
          BROTLI_MIN_QUALITY: 0,
          BROTLI_MAX_QUALITY: 11,
          BROTLI_DEFAULT_QUALITY: 11,
          BROTLI_MIN_WINDOW_BITS: 10,
          BROTLI_MAX_WINDOW_BITS: 24,
          BROTLI_LARGE_MAX_WINDOW_BITS: 30,
          BROTLI_DEFAULT_WINDOW: 22,
          BROTLI_MIN_INPUT_BLOCK_BITS: 16,
          BROTLI_MAX_INPUT_BLOCK_BITS: 24,
          BROTLI_PARAM_MODE: 0,
          BROTLI_PARAM_QUALITY: 1,
          BROTLI_PARAM_LGWIN: 2,
          BROTLI_PARAM_LGBLOCK: 3,
          BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
          BROTLI_PARAM_SIZE_HINT: 5,
          BROTLI_PARAM_LARGE_WINDOW: 6,
          BROTLI_PARAM_NPOSTFIX: 7,
          BROTLI_PARAM_NDIRECT: 8,
          BROTLI_DECODER_RESULT_ERROR: 0,
          BROTLI_DECODER_RESULT_SUCCESS: 1,
          BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
          BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
          BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
          BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
          BROTLI_DECODER_NO_ERROR: 0,
          BROTLI_DECODER_SUCCESS: 1,
          BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
          BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
          BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
          BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
          BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
          BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
          BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
          BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
          BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
          BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
          BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
          BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
          BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
          BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
          BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
          BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
          BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
          BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
          BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
          BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
          BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
          BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
          BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
          BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
          BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
          BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
          BROTLI_DECODER_ERROR_UNREACHABLE: -31,
        },
        realZlibConstants
      )
    );
  },
});

// lib/node_modules/minizlib/dist/commonjs/index.js
var require_lib_node_modules_minizlib_dist_commonjs_index_js = __commonJS({
  'lib/node_modules/minizlib/dist/commonjs/index.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.BrotliDecompress =
      exports2.BrotliCompress =
      exports2.Brotli =
      exports2.Unzip =
      exports2.InflateRaw =
      exports2.DeflateRaw =
      exports2.Gunzip =
      exports2.Gzip =
      exports2.Inflate =
      exports2.Deflate =
      exports2.Zlib =
      exports2.ZlibError =
      exports2.constants =
        void 0;
    var assert_1 = __importDefault(require('assert'));
    var buffer_1 = require('buffer');
    var minipass_1 = require_lib_node_modules_minipass_dist_commonjs_index_js();
    var zlib_1 = __importDefault(require('zlib'));
    var constants_js_1 =
      require_lib_node_modules_minizlib_dist_commonjs_constants_js();
    var constants_js_2 =
      require_lib_node_modules_minizlib_dist_commonjs_constants_js();
    Object.defineProperty(exports2, 'constants', {
      enumerable: true,
      get: function () {
        return constants_js_2.constants;
      },
    });
    var OriginalBufferConcat = buffer_1.Buffer.concat;
    var _superWrite = Symbol('_superWrite');
    var ZlibError = class extends Error {
      constructor(err) {
        super('zlib: ' + err.message);
        __publicField(this, 'code');
        __publicField(this, 'errno');
        this.code = err.code;
        this.errno = err.errno;
        if (!this.code) this.code = 'ZLIB_ERROR';
        this.message = 'zlib: ' + err.message;
        Error.captureStackTrace(this, this.constructor);
      }
      get name() {
        return 'ZlibError';
      }
    };
    exports2.ZlibError = ZlibError;
    var _flushFlag = Symbol('flushFlag');
    var _sawError,
      _ended,
      _flushFlag2,
      _finishFlushFlag,
      _fullFlushFlag,
      _handle,
      _onError;
    var ZlibBase = class extends minipass_1.Minipass {
      /* c8 ignore stop */
      constructor(opts, mode) {
        var _a2, _b, _c, _d;
        if (!opts || typeof opts !== 'object')
          throw new TypeError('invalid options for ZlibBase constructor');
        super(opts);
        __privateAdd(this, _sawError, false);
        __privateAdd(this, _ended, false);
        __privateAdd(this, _flushFlag2);
        __privateAdd(this, _finishFlushFlag);
        __privateAdd(this, _fullFlushFlag);
        __privateAdd(this, _handle);
        __privateAdd(this, _onError);
        __privateSet(this, _flushFlag2, (_a2 = opts.flush) != null ? _a2 : 0);
        __privateSet(
          this,
          _finishFlushFlag,
          (_b = opts.finishFlush) != null ? _b : 0
        );
        __privateSet(
          this,
          _fullFlushFlag,
          (_c = opts.fullFlushFlag) != null ? _c : 0
        );
        try {
          __privateSet(this, _handle, new zlib_1.default[mode](opts));
        } catch (er) {
          throw new ZlibError(er);
        }
        __privateSet(this, _onError, (err) => {
          if (__privateGet(this, _sawError)) return;
          __privateSet(this, _sawError, true);
          this.close();
          this.emit('error', err);
        });
        (_d = __privateGet(this, _handle)) == null
          ? void 0
          : _d.on('error', (er) =>
              __privateGet(this, _onError).call(this, new ZlibError(er))
            );
        this.once('end', () => this.close);
      }
      get sawError() {
        return __privateGet(this, _sawError);
      }
      get handle() {
        return __privateGet(this, _handle);
      }
      /* c8 ignore start */
      get flushFlag() {
        return __privateGet(this, _flushFlag2);
      }
      close() {
        if (__privateGet(this, _handle)) {
          __privateGet(this, _handle).close();
          __privateSet(this, _handle, void 0);
          this.emit('close');
        }
      }
      reset() {
        var _a2, _b;
        if (!__privateGet(this, _sawError)) {
          (0, assert_1.default)(
            __privateGet(this, _handle),
            'zlib binding closed'
          );
          return (_b = (_a2 = __privateGet(this, _handle)).reset) == null
            ? void 0
            : _b.call(_a2);
        }
      }
      flush(flushFlag) {
        if (this.ended) return;
        if (typeof flushFlag !== 'number')
          flushFlag = __privateGet(this, _fullFlushFlag);
        this.write(
          Object.assign(buffer_1.Buffer.alloc(0), { [_flushFlag]: flushFlag })
        );
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === 'function') {
          cb = chunk;
          encoding = void 0;
          chunk = void 0;
        }
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = void 0;
        }
        if (chunk) {
          if (encoding) this.write(chunk, encoding);
          else this.write(chunk);
        }
        this.flush(__privateGet(this, _finishFlushFlag));
        __privateSet(this, _ended, true);
        return super.end(cb);
      }
      get ended() {
        return __privateGet(this, _ended);
      }
      // overridden in the gzip classes to do portable writes
      [_superWrite](data) {
        return super.write(data);
      }
      write(chunk, encoding, cb) {
        if (typeof encoding === 'function')
          (cb = encoding), (encoding = 'utf8');
        if (typeof chunk === 'string')
          chunk = buffer_1.Buffer.from(chunk, encoding);
        if (__privateGet(this, _sawError)) return;
        (0, assert_1.default)(
          __privateGet(this, _handle),
          'zlib binding closed'
        );
        const nativeHandle = __privateGet(this, _handle)._handle;
        const originalNativeClose = nativeHandle.close;
        nativeHandle.close = () => {};
        const originalClose = __privateGet(this, _handle).close;
        __privateGet(this, _handle).close = () => {};
        buffer_1.Buffer.concat = (args) => args;
        let result = void 0;
        try {
          const flushFlag =
            typeof chunk[_flushFlag] === 'number'
              ? chunk[_flushFlag]
              : __privateGet(this, _flushFlag2);
          result = __privateGet(this, _handle)._processChunk(chunk, flushFlag);
          buffer_1.Buffer.concat = OriginalBufferConcat;
        } catch (err) {
          buffer_1.Buffer.concat = OriginalBufferConcat;
          __privateGet(this, _onError).call(this, new ZlibError(err));
        } finally {
          if (__privateGet(this, _handle)) {
            __privateGet(this, _handle)._handle = nativeHandle;
            nativeHandle.close = originalNativeClose;
            __privateGet(this, _handle).close = originalClose;
            __privateGet(this, _handle).removeAllListeners('error');
          }
        }
        if (__privateGet(this, _handle))
          __privateGet(this, _handle).on('error', (er) =>
            __privateGet(this, _onError).call(this, new ZlibError(er))
          );
        let writeReturn;
        if (result) {
          if (Array.isArray(result) && result.length > 0) {
            const r = result[0];
            writeReturn = this[_superWrite](buffer_1.Buffer.from(r));
            for (let i = 1; i < result.length; i++) {
              writeReturn = this[_superWrite](result[i]);
            }
          } else {
            writeReturn = this[_superWrite](buffer_1.Buffer.from(result));
          }
        }
        if (cb) cb();
        return writeReturn;
      }
    };
    _sawError = new WeakMap();
    _ended = new WeakMap();
    _flushFlag2 = new WeakMap();
    _finishFlushFlag = new WeakMap();
    _fullFlushFlag = new WeakMap();
    _handle = new WeakMap();
    _onError = new WeakMap();
    var _level, _strategy;
    var Zlib = class extends ZlibBase {
      constructor(opts, mode) {
        opts = opts || {};
        opts.flush = opts.flush || constants_js_1.constants.Z_NO_FLUSH;
        opts.finishFlush =
          opts.finishFlush || constants_js_1.constants.Z_FINISH;
        opts.fullFlushFlag = constants_js_1.constants.Z_FULL_FLUSH;
        super(opts, mode);
        __privateAdd(this, _level);
        __privateAdd(this, _strategy);
        __privateSet(this, _level, opts.level);
        __privateSet(this, _strategy, opts.strategy);
      }
      params(level, strategy) {
        if (this.sawError) return;
        if (!this.handle)
          throw new Error('cannot switch params when binding is closed');
        if (!this.handle.params)
          throw new Error('not supported in this implementation');
        if (
          __privateGet(this, _level) !== level ||
          __privateGet(this, _strategy) !== strategy
        ) {
          this.flush(constants_js_1.constants.Z_SYNC_FLUSH);
          (0, assert_1.default)(this.handle, 'zlib binding closed');
          const origFlush = this.handle.flush;
          this.handle.flush = (flushFlag, cb) => {
            if (typeof flushFlag === 'function') {
              cb = flushFlag;
              flushFlag = this.flushFlag;
            }
            this.flush(flushFlag);
            cb == null ? void 0 : cb();
          };
          try {
            this.handle.params(level, strategy);
          } finally {
            this.handle.flush = origFlush;
          }
          if (this.handle) {
            __privateSet(this, _level, level);
            __privateSet(this, _strategy, strategy);
          }
        }
      }
    };
    _level = new WeakMap();
    _strategy = new WeakMap();
    exports2.Zlib = Zlib;
    var Deflate = class extends Zlib {
      constructor(opts) {
        super(opts, 'Deflate');
      }
    };
    exports2.Deflate = Deflate;
    var Inflate = class extends Zlib {
      constructor(opts) {
        super(opts, 'Inflate');
      }
    };
    exports2.Inflate = Inflate;
    var _portable;
    var Gzip = class extends Zlib {
      constructor(opts) {
        super(opts, 'Gzip');
        __privateAdd(this, _portable);
        __privateSet(this, _portable, opts && !!opts.portable);
      }
      [_superWrite](data) {
        if (!__privateGet(this, _portable)) return super[_superWrite](data);
        __privateSet(this, _portable, false);
        data[9] = 255;
        return super[_superWrite](data);
      }
    };
    _portable = new WeakMap();
    exports2.Gzip = Gzip;
    var Gunzip = class extends Zlib {
      constructor(opts) {
        super(opts, 'Gunzip');
      }
    };
    exports2.Gunzip = Gunzip;
    var DeflateRaw = class extends Zlib {
      constructor(opts) {
        super(opts, 'DeflateRaw');
      }
    };
    exports2.DeflateRaw = DeflateRaw;
    var InflateRaw = class extends Zlib {
      constructor(opts) {
        super(opts, 'InflateRaw');
      }
    };
    exports2.InflateRaw = InflateRaw;
    var Unzip = class extends Zlib {
      constructor(opts) {
        super(opts, 'Unzip');
      }
    };
    exports2.Unzip = Unzip;
    var Brotli = class extends ZlibBase {
      constructor(opts, mode) {
        opts = opts || {};
        opts.flush =
          opts.flush || constants_js_1.constants.BROTLI_OPERATION_PROCESS;
        opts.finishFlush =
          opts.finishFlush || constants_js_1.constants.BROTLI_OPERATION_FINISH;
        opts.fullFlushFlag = constants_js_1.constants.BROTLI_OPERATION_FLUSH;
        super(opts, mode);
      }
    };
    exports2.Brotli = Brotli;
    var BrotliCompress = class extends Brotli {
      constructor(opts) {
        super(opts, 'BrotliCompress');
      }
    };
    exports2.BrotliCompress = BrotliCompress;
    var BrotliDecompress = class extends Brotli {
      constructor(opts) {
        super(opts, 'BrotliDecompress');
      }
    };
    exports2.BrotliDecompress = BrotliDecompress;
  },
});

// lib/node_modules/yallist/dist/commonjs/index.js
var require_lib_node_modules_yallist_dist_commonjs_index_js = __commonJS({
  'lib/node_modules/yallist/dist/commonjs/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.Node = exports2.Yallist = void 0;
    var Yallist = class _Yallist {
      constructor(list = []) {
        __publicField(this, 'tail');
        __publicField(this, 'head');
        __publicField(this, 'length', 0);
        for (const item of list) {
          this.push(item);
        }
      }
      static create(list = []) {
        return new _Yallist(list);
      }
      *[Symbol.iterator]() {
        for (let walker = this.head; walker; walker = walker.next) {
          yield walker.value;
        }
      }
      removeNode(node) {
        if (node.list !== this) {
          throw new Error('removing node which does not belong to this list');
        }
        const next = node.next;
        const prev = node.prev;
        if (next) {
          next.prev = prev;
        }
        if (prev) {
          prev.next = next;
        }
        if (node === this.head) {
          this.head = next;
        }
        if (node === this.tail) {
          this.tail = prev;
        }
        this.length--;
        node.next = void 0;
        node.prev = void 0;
        node.list = void 0;
        return next;
      }
      unshiftNode(node) {
        if (node === this.head) {
          return;
        }
        if (node.list) {
          node.list.removeNode(node);
        }
        const head = this.head;
        node.list = this;
        node.next = head;
        if (head) {
          head.prev = node;
        }
        this.head = node;
        if (!this.tail) {
          this.tail = node;
        }
        this.length++;
      }
      pushNode(node) {
        if (node === this.tail) {
          return;
        }
        if (node.list) {
          node.list.removeNode(node);
        }
        const tail = this.tail;
        node.list = this;
        node.prev = tail;
        if (tail) {
          tail.next = node;
        }
        this.tail = node;
        if (!this.head) {
          this.head = node;
        }
        this.length++;
      }
      push(...args) {
        for (let i = 0, l = args.length; i < l; i++) {
          push(this, args[i]);
        }
        return this.length;
      }
      unshift(...args) {
        for (var i = 0, l = args.length; i < l; i++) {
          unshift(this, args[i]);
        }
        return this.length;
      }
      pop() {
        if (!this.tail) {
          return void 0;
        }
        const res = this.tail.value;
        const t = this.tail;
        this.tail = this.tail.prev;
        if (this.tail) {
          this.tail.next = void 0;
        } else {
          this.head = void 0;
        }
        t.list = void 0;
        this.length--;
        return res;
      }
      shift() {
        if (!this.head) {
          return void 0;
        }
        const res = this.head.value;
        const h = this.head;
        this.head = this.head.next;
        if (this.head) {
          this.head.prev = void 0;
        } else {
          this.tail = void 0;
        }
        h.list = void 0;
        this.length--;
        return res;
      }
      forEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this.head, i = 0; !!walker; i++) {
          fn.call(thisp, walker.value, i, this);
          walker = walker.next;
        }
      }
      forEachReverse(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this.tail, i = this.length - 1; !!walker; i--) {
          fn.call(thisp, walker.value, i, this);
          walker = walker.prev;
        }
      }
      get(n) {
        let i = 0;
        let walker = this.head;
        for (; !!walker && i < n; i++) {
          walker = walker.next;
        }
        if (i === n && !!walker) {
          return walker.value;
        }
      }
      getReverse(n) {
        let i = 0;
        let walker = this.tail;
        for (; !!walker && i < n; i++) {
          walker = walker.prev;
        }
        if (i === n && !!walker) {
          return walker.value;
        }
      }
      map(fn, thisp) {
        thisp = thisp || this;
        const res = new _Yallist();
        for (let walker = this.head; !!walker; ) {
          res.push(fn.call(thisp, walker.value, this));
          walker = walker.next;
        }
        return res;
      }
      mapReverse(fn, thisp) {
        thisp = thisp || this;
        var res = new _Yallist();
        for (let walker = this.tail; !!walker; ) {
          res.push(fn.call(thisp, walker.value, this));
          walker = walker.prev;
        }
        return res;
      }
      reduce(fn, initial) {
        let acc;
        let walker = this.head;
        if (arguments.length > 1) {
          acc = initial;
        } else if (this.head) {
          walker = this.head.next;
          acc = this.head.value;
        } else {
          throw new TypeError('Reduce of empty list with no initial value');
        }
        for (var i = 0; !!walker; i++) {
          acc = fn(acc, walker.value, i);
          walker = walker.next;
        }
        return acc;
      }
      reduceReverse(fn, initial) {
        let acc;
        let walker = this.tail;
        if (arguments.length > 1) {
          acc = initial;
        } else if (this.tail) {
          walker = this.tail.prev;
          acc = this.tail.value;
        } else {
          throw new TypeError('Reduce of empty list with no initial value');
        }
        for (let i = this.length - 1; !!walker; i--) {
          acc = fn(acc, walker.value, i);
          walker = walker.prev;
        }
        return acc;
      }
      toArray() {
        const arr = new Array(this.length);
        for (let i = 0, walker = this.head; !!walker; i++) {
          arr[i] = walker.value;
          walker = walker.next;
        }
        return arr;
      }
      toArrayReverse() {
        const arr = new Array(this.length);
        for (let i = 0, walker = this.tail; !!walker; i++) {
          arr[i] = walker.value;
          walker = walker.prev;
        }
        return arr;
      }
      slice(from = 0, to = this.length) {
        if (to < 0) {
          to += this.length;
        }
        if (from < 0) {
          from += this.length;
        }
        const ret = new _Yallist();
        if (to < from || to < 0) {
          return ret;
        }
        if (from < 0) {
          from = 0;
        }
        if (to > this.length) {
          to = this.length;
        }
        let walker = this.head;
        let i = 0;
        for (i = 0; !!walker && i < from; i++) {
          walker = walker.next;
        }
        for (; !!walker && i < to; i++, walker = walker.next) {
          ret.push(walker.value);
        }
        return ret;
      }
      sliceReverse(from = 0, to = this.length) {
        if (to < 0) {
          to += this.length;
        }
        if (from < 0) {
          from += this.length;
        }
        const ret = new _Yallist();
        if (to < from || to < 0) {
          return ret;
        }
        if (from < 0) {
          from = 0;
        }
        if (to > this.length) {
          to = this.length;
        }
        let i = this.length;
        let walker = this.tail;
        for (; !!walker && i > to; i--) {
          walker = walker.prev;
        }
        for (; !!walker && i > from; i--, walker = walker.prev) {
          ret.push(walker.value);
        }
        return ret;
      }
      splice(start, deleteCount = 0, ...nodes) {
        if (start > this.length) {
          start = this.length - 1;
        }
        if (start < 0) {
          start = this.length + start;
        }
        let walker = this.head;
        for (let i = 0; !!walker && i < start; i++) {
          walker = walker.next;
        }
        const ret = [];
        for (let i = 0; !!walker && i < deleteCount; i++) {
          ret.push(walker.value);
          walker = this.removeNode(walker);
        }
        if (!walker) {
          walker = this.tail;
        } else if (walker !== this.tail) {
          walker = walker.prev;
        }
        for (const v of nodes) {
          walker = insertAfter(this, walker, v);
        }
        return ret;
      }
      reverse() {
        const head = this.head;
        const tail = this.tail;
        for (let walker = head; !!walker; walker = walker.prev) {
          const p = walker.prev;
          walker.prev = walker.next;
          walker.next = p;
        }
        this.head = tail;
        this.tail = head;
        return this;
      }
    };
    exports2.Yallist = Yallist;
    function insertAfter(self, node, value) {
      const prev = node;
      const next = node ? node.next : self.head;
      const inserted = new Node(value, prev, next, self);
      if (inserted.next === void 0) {
        self.tail = inserted;
      }
      if (inserted.prev === void 0) {
        self.head = inserted;
      }
      self.length++;
      return inserted;
    }
    function push(self, item) {
      self.tail = new Node(item, self.tail, void 0, self);
      if (!self.head) {
        self.head = self.tail;
      }
      self.length++;
    }
    function unshift(self, item) {
      self.head = new Node(item, void 0, self.head, self);
      if (!self.tail) {
        self.tail = self.head;
      }
      self.length++;
    }
    var Node = class {
      constructor(value, prev, next, list) {
        __publicField(this, 'list');
        __publicField(this, 'next');
        __publicField(this, 'prev');
        __publicField(this, 'value');
        this.list = list;
        this.value = value;
        if (prev) {
          prev.next = this;
          this.prev = prev;
        } else {
          this.prev = void 0;
        }
        if (next) {
          next.prev = this;
          this.next = next;
        } else {
          this.next = void 0;
        }
      }
    };
    exports2.Node = Node;
  },
});

// lib/node_modules/tar/dist/commonjs/large-numbers.js
var require_lib_node_modules_tar_dist_commonjs_large_numbers_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/large-numbers.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.parse = exports2.encode = void 0;
    var encode = (num, buf) => {
      if (!Number.isSafeInteger(num)) {
        throw Error(
          'cannot encode number outside of javascript safe integer range'
        );
      } else if (num < 0) {
        encodeNegative(num, buf);
      } else {
        encodePositive(num, buf);
      }
      return buf;
    };
    exports2.encode = encode;
    var encodePositive = (num, buf) => {
      buf[0] = 128;
      for (var i = buf.length; i > 1; i--) {
        buf[i - 1] = num & 255;
        num = Math.floor(num / 256);
      }
    };
    var encodeNegative = (num, buf) => {
      buf[0] = 255;
      var flipped = false;
      num = num * -1;
      for (var i = buf.length; i > 1; i--) {
        var byte = num & 255;
        num = Math.floor(num / 256);
        if (flipped) {
          buf[i - 1] = onesComp(byte);
        } else if (byte === 0) {
          buf[i - 1] = 0;
        } else {
          flipped = true;
          buf[i - 1] = twosComp(byte);
        }
      }
    };
    var parse = (buf) => {
      const pre = buf[0];
      const value =
        pre === 128
          ? pos(buf.subarray(1, buf.length))
          : pre === 255
            ? twos(buf)
            : null;
      if (value === null) {
        throw Error('invalid base256 encoding');
      }
      if (!Number.isSafeInteger(value)) {
        throw Error('parsed number outside of javascript safe integer range');
      }
      return value;
    };
    exports2.parse = parse;
    var twos = (buf) => {
      var len = buf.length;
      var sum = 0;
      var flipped = false;
      for (var i = len - 1; i > -1; i--) {
        var byte = Number(buf[i]);
        var f;
        if (flipped) {
          f = onesComp(byte);
        } else if (byte === 0) {
          f = byte;
        } else {
          flipped = true;
          f = twosComp(byte);
        }
        if (f !== 0) {
          sum -= f * Math.pow(256, len - i - 1);
        }
      }
      return sum;
    };
    var pos = (buf) => {
      var len = buf.length;
      var sum = 0;
      for (var i = len - 1; i > -1; i--) {
        var byte = Number(buf[i]);
        if (byte !== 0) {
          sum += byte * Math.pow(256, len - i - 1);
        }
      }
      return sum;
    };
    var onesComp = (byte) => (255 ^ byte) & 255;
    var twosComp = (byte) => ((255 ^ byte) + 1) & 255;
  },
});

// lib/node_modules/tar/dist/commonjs/types.js
var require_lib_node_modules_tar_dist_commonjs_types_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/types.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.code = exports2.name = exports2.isName = exports2.isCode = void 0;
    var isCode = (c) => exports2.name.has(c);
    exports2.isCode = isCode;
    var isName = (c) => exports2.code.has(c);
    exports2.isName = isName;
    exports2.name = /* @__PURE__ */ new Map([
      ['0', 'File'],
      // same as File
      ['', 'OldFile'],
      ['1', 'Link'],
      ['2', 'SymbolicLink'],
      // Devices and FIFOs aren't fully supported
      // they are parsed, but skipped when unpacking
      ['3', 'CharacterDevice'],
      ['4', 'BlockDevice'],
      ['5', 'Directory'],
      ['6', 'FIFO'],
      // same as File
      ['7', 'ContiguousFile'],
      // pax headers
      ['g', 'GlobalExtendedHeader'],
      ['x', 'ExtendedHeader'],
      // vendor-specific stuff
      // skip
      ['A', 'SolarisACL'],
      // like 5, but with data, which should be skipped
      ['D', 'GNUDumpDir'],
      // metadata only, skip
      ['I', 'Inode'],
      // data = link path of next file
      ['K', 'NextFileHasLongLinkpath'],
      // data = path of next file
      ['L', 'NextFileHasLongPath'],
      // skip
      ['M', 'ContinuationFile'],
      // like L
      ['N', 'OldGnuLongPath'],
      // skip
      ['S', 'SparseFile'],
      // skip
      ['V', 'TapeVolumeHeader'],
      // like x
      ['X', 'OldExtendedHeader'],
    ]);
    exports2.code = new Map(
      Array.from(exports2.name).map((kv) => [kv[1], kv[0]])
    );
  },
});

// lib/node_modules/tar/dist/commonjs/header.js
var require_lib_node_modules_tar_dist_commonjs_header_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/header.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (
              !desc ||
              ('get' in desc
                ? !m.__esModule
                : desc.writable || desc.configurable)
            ) {
              desc = {
                enumerable: true,
                get: function () {
                  return m[k];
                },
              };
            }
            Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.Header = void 0;
    var node_path_1 = require('path');
    var large = __importStar(
      require_lib_node_modules_tar_dist_commonjs_large_numbers_js()
    );
    var types = __importStar(
      require_lib_node_modules_tar_dist_commonjs_types_js()
    );
    var _type, _Header_instances, slurp_fn;
    var Header = class {
      constructor(data, off = 0, ex, gex) {
        __privateAdd(this, _Header_instances);
        __publicField(this, 'cksumValid', false);
        __publicField(this, 'needPax', false);
        __publicField(this, 'nullBlock', false);
        __publicField(this, 'block');
        __publicField(this, 'path');
        __publicField(this, 'mode');
        __publicField(this, 'uid');
        __publicField(this, 'gid');
        __publicField(this, 'size');
        __publicField(this, 'cksum');
        __privateAdd(this, _type, 'Unsupported');
        __publicField(this, 'linkpath');
        __publicField(this, 'uname');
        __publicField(this, 'gname');
        __publicField(this, 'devmaj', 0);
        __publicField(this, 'devmin', 0);
        __publicField(this, 'atime');
        __publicField(this, 'ctime');
        __publicField(this, 'mtime');
        __publicField(this, 'charset');
        __publicField(this, 'comment');
        if (Buffer.isBuffer(data)) {
          this.decode(data, off || 0, ex, gex);
        } else if (data) {
          __privateMethod(this, _Header_instances, slurp_fn).call(this, data);
        }
      }
      decode(buf, off, ex, gex) {
        var _a2, _b;
        if (!off) {
          off = 0;
        }
        if (!buf || !(buf.length >= off + 512)) {
          throw new Error('need 512 bytes for header');
        }
        this.path = decString(buf, off, 100);
        this.mode = decNumber(buf, off + 100, 8);
        this.uid = decNumber(buf, off + 108, 8);
        this.gid = decNumber(buf, off + 116, 8);
        this.size = decNumber(buf, off + 124, 12);
        this.mtime = decDate(buf, off + 136, 12);
        this.cksum = decNumber(buf, off + 148, 12);
        if (gex)
          __privateMethod(this, _Header_instances, slurp_fn).call(
            this,
            gex,
            true
          );
        if (ex)
          __privateMethod(this, _Header_instances, slurp_fn).call(this, ex);
        const t = decString(buf, off + 156, 1);
        if (types.isCode(t)) {
          __privateSet(this, _type, t || '0');
        }
        if (__privateGet(this, _type) === '0' && this.path.slice(-1) === '/') {
          __privateSet(this, _type, '5');
        }
        if (__privateGet(this, _type) === '5') {
          this.size = 0;
        }
        this.linkpath = decString(buf, off + 157, 100);
        if (buf.subarray(off + 257, off + 265).toString() === 'ustar\x0000') {
          this.uname = decString(buf, off + 265, 32);
          this.gname = decString(buf, off + 297, 32);
          this.devmaj = (_a2 = decNumber(buf, off + 329, 8)) != null ? _a2 : 0;
          this.devmin = (_b = decNumber(buf, off + 337, 8)) != null ? _b : 0;
          if (buf[off + 475] !== 0) {
            const prefix = decString(buf, off + 345, 155);
            this.path = prefix + '/' + this.path;
          } else {
            const prefix = decString(buf, off + 345, 130);
            if (prefix) {
              this.path = prefix + '/' + this.path;
            }
            this.atime = decDate(buf, off + 476, 12);
            this.ctime = decDate(buf, off + 488, 12);
          }
        }
        let sum = 8 * 32;
        for (let i = off; i < off + 148; i++) {
          sum += buf[i];
        }
        for (let i = off + 156; i < off + 512; i++) {
          sum += buf[i];
        }
        this.cksumValid = sum === this.cksum;
        if (this.cksum === void 0 && sum === 8 * 32) {
          this.nullBlock = true;
        }
      }
      encode(buf, off = 0) {
        if (!buf) {
          buf = this.block = Buffer.alloc(512);
        }
        if (__privateGet(this, _type) === 'Unsupported') {
          __privateSet(this, _type, '0');
        }
        if (!(buf.length >= off + 512)) {
          throw new Error('need 512 bytes for header');
        }
        const prefixSize = this.ctime || this.atime ? 130 : 155;
        const split = splitPrefix(this.path || '', prefixSize);
        const path3 = split[0];
        const prefix = split[1];
        this.needPax = !!split[2];
        this.needPax = encString(buf, off, 100, path3) || this.needPax;
        this.needPax = encNumber(buf, off + 100, 8, this.mode) || this.needPax;
        this.needPax = encNumber(buf, off + 108, 8, this.uid) || this.needPax;
        this.needPax = encNumber(buf, off + 116, 8, this.gid) || this.needPax;
        this.needPax = encNumber(buf, off + 124, 12, this.size) || this.needPax;
        this.needPax = encDate(buf, off + 136, 12, this.mtime) || this.needPax;
        buf[off + 156] = __privateGet(this, _type).charCodeAt(0);
        this.needPax =
          encString(buf, off + 157, 100, this.linkpath) || this.needPax;
        buf.write('ustar\x0000', off + 257, 8);
        this.needPax =
          encString(buf, off + 265, 32, this.uname) || this.needPax;
        this.needPax =
          encString(buf, off + 297, 32, this.gname) || this.needPax;
        this.needPax =
          encNumber(buf, off + 329, 8, this.devmaj) || this.needPax;
        this.needPax =
          encNumber(buf, off + 337, 8, this.devmin) || this.needPax;
        this.needPax =
          encString(buf, off + 345, prefixSize, prefix) || this.needPax;
        if (buf[off + 475] !== 0) {
          this.needPax = encString(buf, off + 345, 155, prefix) || this.needPax;
        } else {
          this.needPax = encString(buf, off + 345, 130, prefix) || this.needPax;
          this.needPax =
            encDate(buf, off + 476, 12, this.atime) || this.needPax;
          this.needPax =
            encDate(buf, off + 488, 12, this.ctime) || this.needPax;
        }
        let sum = 8 * 32;
        for (let i = off; i < off + 148; i++) {
          sum += buf[i];
        }
        for (let i = off + 156; i < off + 512; i++) {
          sum += buf[i];
        }
        this.cksum = sum;
        encNumber(buf, off + 148, 8, this.cksum);
        this.cksumValid = true;
        return this.needPax;
      }
      get type() {
        return __privateGet(this, _type) === 'Unsupported'
          ? __privateGet(this, _type)
          : types.name.get(__privateGet(this, _type));
      }
      get typeKey() {
        return __privateGet(this, _type);
      }
      set type(type) {
        const c = String(types.code.get(type));
        if (types.isCode(c) || c === 'Unsupported') {
          __privateSet(this, _type, c);
        } else if (types.isCode(type)) {
          __privateSet(this, _type, type);
        } else {
          throw new TypeError('invalid entry type: ' + type);
        }
      }
    };
    _type = new WeakMap();
    _Header_instances = new WeakSet();
    slurp_fn = function (ex, gex = false) {
      Object.assign(
        this,
        Object.fromEntries(
          Object.entries(ex).filter(([k, v]) => {
            return !(
              v === null ||
              v === void 0 ||
              (k === 'path' && gex) ||
              (k === 'linkpath' && gex) ||
              k === 'global'
            );
          })
        )
      );
    };
    exports2.Header = Header;
    var splitPrefix = (p, prefixSize) => {
      const pathSize = 100;
      let pp = p;
      let prefix = '';
      let ret = void 0;
      const root = node_path_1.posix.parse(p).root || '.';
      if (Buffer.byteLength(pp) < pathSize) {
        ret = [pp, prefix, false];
      } else {
        prefix = node_path_1.posix.dirname(pp);
        pp = node_path_1.posix.basename(pp);
        do {
          if (
            Buffer.byteLength(pp) <= pathSize &&
            Buffer.byteLength(prefix) <= prefixSize
          ) {
            ret = [pp, prefix, false];
          } else if (
            Buffer.byteLength(pp) > pathSize &&
            Buffer.byteLength(prefix) <= prefixSize
          ) {
            ret = [pp.slice(0, pathSize - 1), prefix, true];
          } else {
            pp = node_path_1.posix.join(node_path_1.posix.basename(prefix), pp);
            prefix = node_path_1.posix.dirname(prefix);
          }
        } while (prefix !== root && ret === void 0);
        if (!ret) {
          ret = [p.slice(0, pathSize - 1), '', true];
        }
      }
      return ret;
    };
    var decString = (buf, off, size) =>
      buf
        .subarray(off, off + size)
        .toString('utf8')
        .replace(/\0.*/, '');
    var decDate = (buf, off, size) => numToDate(decNumber(buf, off, size));
    var numToDate = (num) => (num === void 0 ? void 0 : new Date(num * 1e3));
    var decNumber = (buf, off, size) =>
      Number(buf[off]) & 128
        ? large.parse(buf.subarray(off, off + size))
        : decSmallNumber(buf, off, size);
    var nanUndef = (value) => (isNaN(value) ? void 0 : value);
    var decSmallNumber = (buf, off, size) =>
      nanUndef(
        parseInt(
          buf
            .subarray(off, off + size)
            .toString('utf8')
            .replace(/\0.*$/, '')
            .trim(),
          8
        )
      );
    var MAXNUM = {
      12: 8589934591,
      8: 2097151,
    };
    var encNumber = (buf, off, size, num) =>
      num === void 0
        ? false
        : num > MAXNUM[size] || num < 0
          ? (large.encode(num, buf.subarray(off, off + size)), true)
          : (encSmallNumber(buf, off, size, num), false);
    var encSmallNumber = (buf, off, size, num) =>
      buf.write(octalString(num, size), off, size, 'ascii');
    var octalString = (num, size) =>
      padOctal(Math.floor(num).toString(8), size);
    var padOctal = (str, size) =>
      (str.length === size - 1
        ? str
        : new Array(size - str.length - 1).join('0') + str + ' ') + '\0';
    var encDate = (buf, off, size, date) =>
      date === void 0 ? false : encNumber(buf, off, size, date.getTime() / 1e3);
    var NULLS = new Array(156).join('\0');
    var encString = (buf, off, size, str) =>
      str === void 0
        ? false
        : (buf.write(str + NULLS, off, size, 'utf8'),
          str.length !== Buffer.byteLength(str) || str.length > size);
  },
});

// lib/node_modules/tar/dist/commonjs/pax.js
var require_lib_node_modules_tar_dist_commonjs_pax_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/pax.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.Pax = void 0;
    var node_path_1 = require('path');
    var header_js_1 = require_lib_node_modules_tar_dist_commonjs_header_js();
    var Pax = class _Pax {
      constructor(obj, global = false) {
        __publicField(this, 'atime');
        __publicField(this, 'mtime');
        __publicField(this, 'ctime');
        __publicField(this, 'charset');
        __publicField(this, 'comment');
        __publicField(this, 'gid');
        __publicField(this, 'uid');
        __publicField(this, 'gname');
        __publicField(this, 'uname');
        __publicField(this, 'linkpath');
        __publicField(this, 'dev');
        __publicField(this, 'ino');
        __publicField(this, 'nlink');
        __publicField(this, 'path');
        __publicField(this, 'size');
        __publicField(this, 'mode');
        __publicField(this, 'global');
        this.atime = obj.atime;
        this.charset = obj.charset;
        this.comment = obj.comment;
        this.ctime = obj.ctime;
        this.dev = obj.dev;
        this.gid = obj.gid;
        this.global = global;
        this.gname = obj.gname;
        this.ino = obj.ino;
        this.linkpath = obj.linkpath;
        this.mtime = obj.mtime;
        this.nlink = obj.nlink;
        this.path = obj.path;
        this.size = obj.size;
        this.uid = obj.uid;
        this.uname = obj.uname;
      }
      encode() {
        var _a2;
        const body = this.encodeBody();
        if (body === '') {
          return Buffer.allocUnsafe(0);
        }
        const bodyLen = Buffer.byteLength(body);
        const bufLen = 512 * Math.ceil(1 + bodyLen / 512);
        const buf = Buffer.allocUnsafe(bufLen);
        for (let i = 0; i < 512; i++) {
          buf[i] = 0;
        }
        new header_js_1.Header({
          // XXX split the path
          // then the path should be PaxHeader + basename, but less than 99,
          // prepend with the dirname
          /* c8 ignore start */
          path: (
            'PaxHeader/' +
            (0, node_path_1.basename)((_a2 = this.path) != null ? _a2 : '')
          ).slice(0, 99),
          /* c8 ignore stop */
          mode: this.mode || 420,
          uid: this.uid,
          gid: this.gid,
          size: bodyLen,
          mtime: this.mtime,
          type: this.global ? 'GlobalExtendedHeader' : 'ExtendedHeader',
          linkpath: '',
          uname: this.uname || '',
          gname: this.gname || '',
          devmaj: 0,
          devmin: 0,
          atime: this.atime,
          ctime: this.ctime,
        }).encode(buf);
        buf.write(body, 512, bodyLen, 'utf8');
        for (let i = bodyLen + 512; i < buf.length; i++) {
          buf[i] = 0;
        }
        return buf;
      }
      encodeBody() {
        return (
          this.encodeField('path') +
          this.encodeField('ctime') +
          this.encodeField('atime') +
          this.encodeField('dev') +
          this.encodeField('ino') +
          this.encodeField('nlink') +
          this.encodeField('charset') +
          this.encodeField('comment') +
          this.encodeField('gid') +
          this.encodeField('gname') +
          this.encodeField('linkpath') +
          this.encodeField('mtime') +
          this.encodeField('size') +
          this.encodeField('uid') +
          this.encodeField('uname')
        );
      }
      encodeField(field) {
        if (this[field] === void 0) {
          return '';
        }
        const r = this[field];
        const v = r instanceof Date ? r.getTime() / 1e3 : r;
        const s =
          ' ' +
          (field === 'dev' || field === 'ino' || field === 'nlink'
            ? 'SCHILY.'
            : '') +
          field +
          '=' +
          v +
          '\n';
        const byteLen = Buffer.byteLength(s);
        let digits = Math.floor(Math.log(byteLen) / Math.log(10)) + 1;
        if (byteLen + digits >= Math.pow(10, digits)) {
          digits += 1;
        }
        const len = digits + byteLen;
        return len + s;
      }
      static parse(str, ex, g = false) {
        return new _Pax(merge(parseKV(str), ex), g);
      }
    };
    exports2.Pax = Pax;
    var merge = (a, b) => (b ? Object.assign({}, b, a) : a);
    var parseKV = (str) =>
      str
        .replace(/\n$/, '')
        .split('\n')
        .reduce(parseKVLine, /* @__PURE__ */ Object.create(null));
    var parseKVLine = (set, line) => {
      const n = parseInt(line, 10);
      if (n !== Buffer.byteLength(line) + 1) {
        return set;
      }
      line = line.slice((n + ' ').length);
      const kv = line.split('=');
      const r = kv.shift();
      if (!r) {
        return set;
      }
      const k = r.replace(/^SCHILY\.(dev|ino|nlink)/, '$1');
      const v = kv.join('=');
      set[k] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(k)
        ? new Date(Number(v) * 1e3)
        : /^[0-9]+$/.test(v)
          ? +v
          : v;
      return set;
    };
  },
});

// lib/node_modules/tar/dist/commonjs/normalize-windows-path.js
var require_lib_node_modules_tar_dist_commonjs_normalize_windows_path_js =
  __commonJS({
    'lib/node_modules/tar/dist/commonjs/normalize-windows-path.js'(exports2) {
      'use strict';
      Object.defineProperty(exports2, '__esModule', { value: true });
      exports2.normalizeWindowsPath = void 0;
      var platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
      exports2.normalizeWindowsPath =
        platform !== 'win32' ? (p) => p : (p) => p && p.replace(/\\/g, '/');
    },
  });

// lib/node_modules/tar/dist/commonjs/read-entry.js
var require_lib_node_modules_tar_dist_commonjs_read_entry_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/read-entry.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.ReadEntry = void 0;
    var minipass_1 = require_lib_node_modules_minipass_dist_commonjs_index_js();
    var normalize_windows_path_js_1 =
      require_lib_node_modules_tar_dist_commonjs_normalize_windows_path_js();
    var _ReadEntry_instances, slurp_fn;
    var ReadEntry = class extends minipass_1.Minipass {
      constructor(header, ex, gex) {
        var _a2;
        super({});
        __privateAdd(this, _ReadEntry_instances);
        __publicField(this, 'extended');
        __publicField(this, 'globalExtended');
        __publicField(this, 'header');
        __publicField(this, 'startBlockSize');
        __publicField(this, 'blockRemain');
        __publicField(this, 'remain');
        __publicField(this, 'type');
        __publicField(this, 'meta', false);
        __publicField(this, 'ignore', false);
        __publicField(this, 'path');
        __publicField(this, 'mode');
        __publicField(this, 'uid');
        __publicField(this, 'gid');
        __publicField(this, 'uname');
        __publicField(this, 'gname');
        __publicField(this, 'size', 0);
        __publicField(this, 'mtime');
        __publicField(this, 'atime');
        __publicField(this, 'ctime');
        __publicField(this, 'linkpath');
        __publicField(this, 'dev');
        __publicField(this, 'ino');
        __publicField(this, 'nlink');
        __publicField(this, 'invalid', false);
        __publicField(this, 'absolute');
        __publicField(this, 'unsupported', false);
        this.pause();
        this.extended = ex;
        this.globalExtended = gex;
        this.header = header;
        this.remain = (_a2 = header.size) != null ? _a2 : 0;
        this.startBlockSize = 512 * Math.ceil(this.remain / 512);
        this.blockRemain = this.startBlockSize;
        this.type = header.type;
        switch (this.type) {
          case 'File':
          case 'OldFile':
          case 'Link':
          case 'SymbolicLink':
          case 'CharacterDevice':
          case 'BlockDevice':
          case 'Directory':
          case 'FIFO':
          case 'ContiguousFile':
          case 'GNUDumpDir':
            break;
          case 'NextFileHasLongLinkpath':
          case 'NextFileHasLongPath':
          case 'OldGnuLongPath':
          case 'GlobalExtendedHeader':
          case 'ExtendedHeader':
          case 'OldExtendedHeader':
            this.meta = true;
            break;
          // NOTE: gnutar and bsdtar treat unrecognized types as 'File'
          // it may be worth doing the same, but with a warning.
          default:
            this.ignore = true;
        }
        if (!header.path) {
          throw new Error('no path provided for tar.ReadEntry');
        }
        this.path = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          header.path
        );
        this.mode = header.mode;
        if (this.mode) {
          this.mode = this.mode & 4095;
        }
        this.uid = header.uid;
        this.gid = header.gid;
        this.uname = header.uname;
        this.gname = header.gname;
        this.size = this.remain;
        this.mtime = header.mtime;
        this.atime = header.atime;
        this.ctime = header.ctime;
        this.linkpath = header.linkpath
          ? (0, normalize_windows_path_js_1.normalizeWindowsPath)(
              header.linkpath
            )
          : void 0;
        this.uname = header.uname;
        this.gname = header.gname;
        if (ex) {
          __privateMethod(this, _ReadEntry_instances, slurp_fn).call(this, ex);
        }
        if (gex) {
          __privateMethod(this, _ReadEntry_instances, slurp_fn).call(
            this,
            gex,
            true
          );
        }
      }
      write(data) {
        const writeLen = data.length;
        if (writeLen > this.blockRemain) {
          throw new Error('writing more to entry than is appropriate');
        }
        const r = this.remain;
        const br = this.blockRemain;
        this.remain = Math.max(0, r - writeLen);
        this.blockRemain = Math.max(0, br - writeLen);
        if (this.ignore) {
          return true;
        }
        if (r >= writeLen) {
          return super.write(data);
        }
        return super.write(data.subarray(0, r));
      }
    };
    _ReadEntry_instances = new WeakSet();
    slurp_fn = function (ex, gex = false) {
      if (ex.path)
        ex.path = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          ex.path
        );
      if (ex.linkpath)
        ex.linkpath = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          ex.linkpath
        );
      Object.assign(
        this,
        Object.fromEntries(
          Object.entries(ex).filter(([k, v]) => {
            return !(v === null || v === void 0 || (k === 'path' && gex));
          })
        )
      );
    };
    exports2.ReadEntry = ReadEntry;
  },
});

// lib/node_modules/tar/dist/commonjs/warn-method.js
var require_lib_node_modules_tar_dist_commonjs_warn_method_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/warn-method.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.warnMethod = void 0;
    var warnMethod = (self, code, message, data = {}) => {
      if (self.file) {
        data.file = self.file;
      }
      if (self.cwd) {
        data.cwd = self.cwd;
      }
      data.code = (message instanceof Error && message.code) || code;
      data.tarCode = code;
      if (!self.strict && data.recoverable !== false) {
        if (message instanceof Error) {
          data = Object.assign(message, data);
          message = message.message;
        }
        self.emit('warn', code, message, data);
      } else if (message instanceof Error) {
        self.emit('error', Object.assign(message, data));
      } else {
        self.emit(
          'error',
          Object.assign(new Error(`${code}: ${message}`), data)
        );
      }
    };
    exports2.warnMethod = warnMethod;
  },
});

// lib/node_modules/tar/dist/commonjs/parse.js
var require_lib_node_modules_tar_dist_commonjs_parse_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/parse.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.Parser = void 0;
    var events_1 = require('events');
    var minizlib_1 = require_lib_node_modules_minizlib_dist_commonjs_index_js();
    var yallist_1 = require_lib_node_modules_yallist_dist_commonjs_index_js();
    var header_js_1 = require_lib_node_modules_tar_dist_commonjs_header_js();
    var pax_js_1 = require_lib_node_modules_tar_dist_commonjs_pax_js();
    var read_entry_js_1 =
      require_lib_node_modules_tar_dist_commonjs_read_entry_js();
    var warn_method_js_1 =
      require_lib_node_modules_tar_dist_commonjs_warn_method_js();
    var maxMetaEntrySize = 1024 * 1024;
    var gzipHeader = Buffer.from([31, 139]);
    var STATE = Symbol('state');
    var WRITEENTRY = Symbol('writeEntry');
    var READENTRY = Symbol('readEntry');
    var NEXTENTRY = Symbol('nextEntry');
    var PROCESSENTRY = Symbol('processEntry');
    var EX = Symbol('extendedHeader');
    var GEX = Symbol('globalExtendedHeader');
    var META = Symbol('meta');
    var EMITMETA = Symbol('emitMeta');
    var BUFFER = Symbol('buffer');
    var QUEUE = Symbol('queue');
    var ENDED = Symbol('ended');
    var EMITTEDEND = Symbol('emittedEnd');
    var EMIT = Symbol('emit');
    var UNZIP = Symbol('unzip');
    var CONSUMECHUNK = Symbol('consumeChunk');
    var CONSUMECHUNKSUB = Symbol('consumeChunkSub');
    var CONSUMEBODY = Symbol('consumeBody');
    var CONSUMEMETA = Symbol('consumeMeta');
    var CONSUMEHEADER = Symbol('consumeHeader');
    var CONSUMING = Symbol('consuming');
    var BUFFERCONCAT = Symbol('bufferConcat');
    var MAYBEEND = Symbol('maybeEnd');
    var WRITING = Symbol('writing');
    var ABORTED = Symbol('aborted');
    var DONE = Symbol('onDone');
    var SAW_VALID_ENTRY = Symbol('sawValidEntry');
    var SAW_NULL_BLOCK = Symbol('sawNullBlock');
    var SAW_EOF = Symbol('sawEOF');
    var CLOSESTREAM = Symbol('closeStream');
    var noop = () => true;
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
    var Parser = class extends events_1.EventEmitter {
      constructor(opt = {}) {
        super();
        __publicField(this, 'file');
        __publicField(this, 'strict');
        __publicField(this, 'maxMetaEntrySize');
        __publicField(this, 'filter');
        __publicField(this, 'brotli');
        __publicField(this, 'writable', true);
        __publicField(this, 'readable', false);
        __publicField(this, _q, new yallist_1.Yallist());
        __publicField(this, _p);
        __publicField(this, _o);
        __publicField(this, _n);
        __publicField(this, _m, 'begin');
        __publicField(this, _l, '');
        __publicField(this, _k);
        __publicField(this, _j);
        __publicField(this, _i, false);
        __publicField(this, _h);
        __publicField(this, _g, false);
        __publicField(this, _f);
        __publicField(this, _e, false);
        __publicField(this, _d, false);
        __publicField(this, _c, false);
        __publicField(this, _b, false);
        __publicField(this, _a2, false);
        this.file = opt.file || '';
        this.on(DONE, () => {
          if (this[STATE] === 'begin' || this[SAW_VALID_ENTRY] === false) {
            this.warn('TAR_BAD_ARCHIVE', 'Unrecognized archive format');
          }
        });
        if (opt.ondone) {
          this.on(DONE, opt.ondone);
        } else {
          this.on(DONE, () => {
            this.emit('prefinish');
            this.emit('finish');
            this.emit('end');
          });
        }
        this.strict = !!opt.strict;
        this.maxMetaEntrySize = opt.maxMetaEntrySize || maxMetaEntrySize;
        this.filter = typeof opt.filter === 'function' ? opt.filter : noop;
        const isTBR =
          opt.file &&
          (opt.file.endsWith('.tar.br') || opt.file.endsWith('.tbr'));
        this.brotli =
          !opt.gzip && opt.brotli !== void 0
            ? opt.brotli
            : isTBR
              ? void 0
              : false;
        this.on('end', () => this[CLOSESTREAM]());
        if (typeof opt.onwarn === 'function') {
          this.on('warn', opt.onwarn);
        }
        if (typeof opt.onReadEntry === 'function') {
          this.on('entry', opt.onReadEntry);
        }
      }
      warn(code, message, data = {}) {
        (0, warn_method_js_1.warnMethod)(this, code, message, data);
      }
      [((_q = QUEUE),
      (_p = BUFFER),
      (_o = READENTRY),
      (_n = WRITEENTRY),
      (_m = STATE),
      (_l = META),
      (_k = EX),
      (_j = GEX),
      (_i = ENDED),
      (_h = UNZIP),
      (_g = ABORTED),
      (_f = SAW_VALID_ENTRY),
      (_e = SAW_NULL_BLOCK),
      (_d = SAW_EOF),
      (_c = WRITING),
      (_b = CONSUMING),
      (_a2 = EMITTEDEND),
      CONSUMEHEADER)](chunk, position) {
        if (this[SAW_VALID_ENTRY] === void 0) {
          this[SAW_VALID_ENTRY] = false;
        }
        let header;
        try {
          header = new header_js_1.Header(chunk, position, this[EX], this[GEX]);
        } catch (er) {
          return this.warn('TAR_ENTRY_INVALID', er);
        }
        if (header.nullBlock) {
          if (this[SAW_NULL_BLOCK]) {
            this[SAW_EOF] = true;
            if (this[STATE] === 'begin') {
              this[STATE] = 'header';
            }
            this[EMIT]('eof');
          } else {
            this[SAW_NULL_BLOCK] = true;
            this[EMIT]('nullBlock');
          }
        } else {
          this[SAW_NULL_BLOCK] = false;
          if (!header.cksumValid) {
            this.warn('TAR_ENTRY_INVALID', 'checksum failure', { header });
          } else if (!header.path) {
            this.warn('TAR_ENTRY_INVALID', 'path is required', { header });
          } else {
            const type = header.type;
            if (/^(Symbolic)?Link$/.test(type) && !header.linkpath) {
              this.warn('TAR_ENTRY_INVALID', 'linkpath required', {
                header,
              });
            } else if (
              !/^(Symbolic)?Link$/.test(type) &&
              !/^(Global)?ExtendedHeader$/.test(type) &&
              header.linkpath
            ) {
              this.warn('TAR_ENTRY_INVALID', 'linkpath forbidden', {
                header,
              });
            } else {
              const entry = (this[WRITEENTRY] = new read_entry_js_1.ReadEntry(
                header,
                this[EX],
                this[GEX]
              ));
              if (!this[SAW_VALID_ENTRY]) {
                if (entry.remain) {
                  const onend = () => {
                    if (!entry.invalid) {
                      this[SAW_VALID_ENTRY] = true;
                    }
                  };
                  entry.on('end', onend);
                } else {
                  this[SAW_VALID_ENTRY] = true;
                }
              }
              if (entry.meta) {
                if (entry.size > this.maxMetaEntrySize) {
                  entry.ignore = true;
                  this[EMIT]('ignoredEntry', entry);
                  this[STATE] = 'ignore';
                  entry.resume();
                } else if (entry.size > 0) {
                  this[META] = '';
                  entry.on('data', (c) => (this[META] += c));
                  this[STATE] = 'meta';
                }
              } else {
                this[EX] = void 0;
                entry.ignore = entry.ignore || !this.filter(entry.path, entry);
                if (entry.ignore) {
                  this[EMIT]('ignoredEntry', entry);
                  this[STATE] = entry.remain ? 'ignore' : 'header';
                  entry.resume();
                } else {
                  if (entry.remain) {
                    this[STATE] = 'body';
                  } else {
                    this[STATE] = 'header';
                    entry.end();
                  }
                  if (!this[READENTRY]) {
                    this[QUEUE].push(entry);
                    this[NEXTENTRY]();
                  } else {
                    this[QUEUE].push(entry);
                  }
                }
              }
            }
          }
        }
      }
      [CLOSESTREAM]() {
        queueMicrotask(() => this.emit('close'));
      }
      [PROCESSENTRY](entry) {
        let go = true;
        if (!entry) {
          this[READENTRY] = void 0;
          go = false;
        } else if (Array.isArray(entry)) {
          const [ev, ...args] = entry;
          this.emit(ev, ...args);
        } else {
          this[READENTRY] = entry;
          this.emit('entry', entry);
          if (!entry.emittedEnd) {
            entry.on('end', () => this[NEXTENTRY]());
            go = false;
          }
        }
        return go;
      }
      [NEXTENTRY]() {
        do {} while (this[PROCESSENTRY](this[QUEUE].shift()));
        if (!this[QUEUE].length) {
          const re = this[READENTRY];
          const drainNow = !re || re.flowing || re.size === re.remain;
          if (drainNow) {
            if (!this[WRITING]) {
              this.emit('drain');
            }
          } else {
            re.once('drain', () => this.emit('drain'));
          }
        }
      }
      [CONSUMEBODY](chunk, position) {
        var _a3;
        const entry = this[WRITEENTRY];
        if (!entry) {
          throw new Error('attempt to consume body without entry??');
        }
        const br = (_a3 = entry.blockRemain) != null ? _a3 : 0;
        const c =
          br >= chunk.length && position === 0
            ? chunk
            : chunk.subarray(position, position + br);
        entry.write(c);
        if (!entry.blockRemain) {
          this[STATE] = 'header';
          this[WRITEENTRY] = void 0;
          entry.end();
        }
        return c.length;
      }
      [CONSUMEMETA](chunk, position) {
        const entry = this[WRITEENTRY];
        const ret = this[CONSUMEBODY](chunk, position);
        if (!this[WRITEENTRY] && entry) {
          this[EMITMETA](entry);
        }
        return ret;
      }
      [EMIT](ev, data, extra) {
        if (!this[QUEUE].length && !this[READENTRY]) {
          this.emit(ev, data, extra);
        } else {
          this[QUEUE].push([ev, data, extra]);
        }
      }
      [EMITMETA](entry) {
        var _a3;
        this[EMIT]('meta', this[META]);
        switch (entry.type) {
          case 'ExtendedHeader':
          case 'OldExtendedHeader':
            this[EX] = pax_js_1.Pax.parse(this[META], this[EX], false);
            break;
          case 'GlobalExtendedHeader':
            this[GEX] = pax_js_1.Pax.parse(this[META], this[GEX], true);
            break;
          case 'NextFileHasLongPath':
          case 'OldGnuLongPath': {
            const ex =
              (_a3 = this[EX]) != null
                ? _a3
                : /* @__PURE__ */ Object.create(null);
            this[EX] = ex;
            ex.path = this[META].replace(/\0.*/, '');
            break;
          }
          case 'NextFileHasLongLinkpath': {
            const ex = this[EX] || /* @__PURE__ */ Object.create(null);
            this[EX] = ex;
            ex.linkpath = this[META].replace(/\0.*/, '');
            break;
          }
          /* c8 ignore start */
          default:
            throw new Error('unknown meta: ' + entry.type);
        }
      }
      abort(error) {
        this[ABORTED] = true;
        this.emit('abort', error);
        this.warn('TAR_ABORT', error, { recoverable: false });
      }
      write(chunk, encoding, cb) {
        var _a3;
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = void 0;
        }
        if (typeof chunk === 'string') {
          chunk = Buffer.from(
            chunk,
            /* c8 ignore next */
            typeof encoding === 'string' ? encoding : 'utf8'
          );
        }
        if (this[ABORTED]) {
          cb == null ? void 0 : cb();
          return false;
        }
        const needSniff =
          this[UNZIP] === void 0 ||
          (this.brotli === void 0 && this[UNZIP] === false);
        if (needSniff && chunk) {
          if (this[BUFFER]) {
            chunk = Buffer.concat([this[BUFFER], chunk]);
            this[BUFFER] = void 0;
          }
          if (chunk.length < gzipHeader.length) {
            this[BUFFER] = chunk;
            cb == null ? void 0 : cb();
            return true;
          }
          for (
            let i = 0;
            this[UNZIP] === void 0 && i < gzipHeader.length;
            i++
          ) {
            if (chunk[i] !== gzipHeader[i]) {
              this[UNZIP] = false;
            }
          }
          const maybeBrotli = this.brotli === void 0;
          if (this[UNZIP] === false && maybeBrotli) {
            if (chunk.length < 512) {
              if (this[ENDED]) {
                this.brotli = true;
              } else {
                this[BUFFER] = chunk;
                cb == null ? void 0 : cb();
                return true;
              }
            } else {
              try {
                new header_js_1.Header(chunk.subarray(0, 512));
                this.brotli = false;
              } catch (_) {
                this.brotli = true;
              }
            }
          }
          if (
            this[UNZIP] === void 0 ||
            (this[UNZIP] === false && this.brotli)
          ) {
            const ended = this[ENDED];
            this[ENDED] = false;
            this[UNZIP] =
              this[UNZIP] === void 0
                ? new minizlib_1.Unzip({})
                : new minizlib_1.BrotliDecompress({});
            this[UNZIP].on('data', (chunk2) => this[CONSUMECHUNK](chunk2));
            this[UNZIP].on('error', (er) => this.abort(er));
            this[UNZIP].on('end', () => {
              this[ENDED] = true;
              this[CONSUMECHUNK]();
            });
            this[WRITING] = true;
            const ret2 = !!this[UNZIP][ended ? 'end' : 'write'](chunk);
            this[WRITING] = false;
            cb == null ? void 0 : cb();
            return ret2;
          }
        }
        this[WRITING] = true;
        if (this[UNZIP]) {
          this[UNZIP].write(chunk);
        } else {
          this[CONSUMECHUNK](chunk);
        }
        this[WRITING] = false;
        const ret = this[QUEUE].length
          ? false
          : this[READENTRY]
            ? this[READENTRY].flowing
            : true;
        if (!ret && !this[QUEUE].length) {
          (_a3 = this[READENTRY]) == null
            ? void 0
            : _a3.once('drain', () => this.emit('drain'));
        }
        cb == null ? void 0 : cb();
        return ret;
      }
      [BUFFERCONCAT](c) {
        if (c && !this[ABORTED]) {
          this[BUFFER] = this[BUFFER] ? Buffer.concat([this[BUFFER], c]) : c;
        }
      }
      [MAYBEEND]() {
        if (
          this[ENDED] &&
          !this[EMITTEDEND] &&
          !this[ABORTED] &&
          !this[CONSUMING]
        ) {
          this[EMITTEDEND] = true;
          const entry = this[WRITEENTRY];
          if (entry && entry.blockRemain) {
            const have = this[BUFFER] ? this[BUFFER].length : 0;
            this.warn(
              'TAR_BAD_ARCHIVE',
              `Truncated input (needed ${entry.blockRemain} more bytes, only ${have} available)`,
              { entry }
            );
            if (this[BUFFER]) {
              entry.write(this[BUFFER]);
            }
            entry.end();
          }
          this[EMIT](DONE);
        }
      }
      [CONSUMECHUNK](chunk) {
        var _a3;
        if (this[CONSUMING] && chunk) {
          this[BUFFERCONCAT](chunk);
        } else if (!chunk && !this[BUFFER]) {
          this[MAYBEEND]();
        } else if (chunk) {
          this[CONSUMING] = true;
          if (this[BUFFER]) {
            this[BUFFERCONCAT](chunk);
            const c = this[BUFFER];
            this[BUFFER] = void 0;
            this[CONSUMECHUNKSUB](c);
          } else {
            this[CONSUMECHUNKSUB](chunk);
          }
          while (
            this[BUFFER] &&
            ((_a3 = this[BUFFER]) == null ? void 0 : _a3.length) >= 512 &&
            !this[ABORTED] &&
            !this[SAW_EOF]
          ) {
            const c = this[BUFFER];
            this[BUFFER] = void 0;
            this[CONSUMECHUNKSUB](c);
          }
          this[CONSUMING] = false;
        }
        if (!this[BUFFER] || this[ENDED]) {
          this[MAYBEEND]();
        }
      }
      [CONSUMECHUNKSUB](chunk) {
        let position = 0;
        const length = chunk.length;
        while (position + 512 <= length && !this[ABORTED] && !this[SAW_EOF]) {
          switch (this[STATE]) {
            case 'begin':
            case 'header':
              this[CONSUMEHEADER](chunk, position);
              position += 512;
              break;
            case 'ignore':
            case 'body':
              position += this[CONSUMEBODY](chunk, position);
              break;
            case 'meta':
              position += this[CONSUMEMETA](chunk, position);
              break;
            /* c8 ignore start */
            default:
              throw new Error('invalid state: ' + this[STATE]);
          }
        }
        if (position < length) {
          if (this[BUFFER]) {
            this[BUFFER] = Buffer.concat([
              chunk.subarray(position),
              this[BUFFER],
            ]);
          } else {
            this[BUFFER] = chunk.subarray(position);
          }
        }
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === 'function') {
          cb = chunk;
          encoding = void 0;
          chunk = void 0;
        }
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = void 0;
        }
        if (typeof chunk === 'string') {
          chunk = Buffer.from(chunk, encoding);
        }
        if (cb) this.once('finish', cb);
        if (!this[ABORTED]) {
          if (this[UNZIP]) {
            if (chunk) this[UNZIP].write(chunk);
            this[UNZIP].end();
          } else {
            this[ENDED] = true;
            if (this.brotli === void 0) chunk = chunk || Buffer.alloc(0);
            if (chunk) this.write(chunk);
            this[MAYBEEND]();
          }
        }
        return this;
      }
    };
    exports2.Parser = Parser;
  },
});

// lib/node_modules/tar/dist/commonjs/strip-trailing-slashes.js
var require_lib_node_modules_tar_dist_commonjs_strip_trailing_slashes_js =
  __commonJS({
    'lib/node_modules/tar/dist/commonjs/strip-trailing-slashes.js'(exports2) {
      'use strict';
      Object.defineProperty(exports2, '__esModule', { value: true });
      exports2.stripTrailingSlashes = void 0;
      var stripTrailingSlashes = (str) => {
        let i = str.length - 1;
        let slashesStart = -1;
        while (i > -1 && str.charAt(i) === '/') {
          slashesStart = i;
          i--;
        }
        return slashesStart === -1 ? str : str.slice(0, slashesStart);
      };
      exports2.stripTrailingSlashes = stripTrailingSlashes;
    },
  });

// lib/node_modules/tar/dist/commonjs/list.js
var require_lib_node_modules_tar_dist_commonjs_list_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/list.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (
              !desc ||
              ('get' in desc
                ? !m.__esModule
                : desc.writable || desc.configurable)
            ) {
              desc = {
                enumerable: true,
                get: function () {
                  return m[k];
                },
              };
            }
            Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.list = exports2.filesFilter = void 0;
    var fsm = __importStar(
      require_lib_node_modules__isaacs_fs_minipass_dist_commonjs_index_js()
    );
    var node_fs_1 = __importDefault(require('fs'));
    var path_1 = require('path');
    var make_command_js_1 =
      require_lib_node_modules_tar_dist_commonjs_make_command_js();
    var parse_js_1 = require_lib_node_modules_tar_dist_commonjs_parse_js();
    var strip_trailing_slashes_js_1 =
      require_lib_node_modules_tar_dist_commonjs_strip_trailing_slashes_js();
    var onReadEntryFunction = (opt) => {
      const onReadEntry = opt.onReadEntry;
      opt.onReadEntry = onReadEntry
        ? (e) => {
            onReadEntry(e);
            e.resume();
          }
        : (e) => e.resume();
    };
    var filesFilter = (opt, files) => {
      const map = new Map(
        files.map((f) => [
          (0, strip_trailing_slashes_js_1.stripTrailingSlashes)(f),
          true,
        ])
      );
      const filter = opt.filter;
      const mapHas = (file, r = '') => {
        const root = r || (0, path_1.parse)(file).root || '.';
        let ret;
        if (file === root) ret = false;
        else {
          const m = map.get(file);
          if (m !== void 0) {
            ret = m;
          } else {
            ret = mapHas((0, path_1.dirname)(file), root);
          }
        }
        map.set(file, ret);
        return ret;
      };
      opt.filter = filter
        ? (file, entry) =>
            filter(file, entry) &&
            mapHas((0, strip_trailing_slashes_js_1.stripTrailingSlashes)(file))
        : (file) =>
            mapHas((0, strip_trailing_slashes_js_1.stripTrailingSlashes)(file));
    };
    exports2.filesFilter = filesFilter;
    var listFileSync = (opt) => {
      const p = new parse_js_1.Parser(opt);
      const file = opt.file;
      let fd;
      try {
        const stat = node_fs_1.default.statSync(file);
        const readSize = opt.maxReadSize || 16 * 1024 * 1024;
        if (stat.size < readSize) {
          p.end(node_fs_1.default.readFileSync(file));
        } else {
          let pos = 0;
          const buf = Buffer.allocUnsafe(readSize);
          fd = node_fs_1.default.openSync(file, 'r');
          while (pos < stat.size) {
            const bytesRead = node_fs_1.default.readSync(
              fd,
              buf,
              0,
              readSize,
              pos
            );
            pos += bytesRead;
            p.write(buf.subarray(0, bytesRead));
          }
          p.end();
        }
      } finally {
        if (typeof fd === 'number') {
          try {
            node_fs_1.default.closeSync(fd);
          } catch (er) {}
        }
      }
    };
    var listFile = (opt, _files) => {
      const parse = new parse_js_1.Parser(opt);
      const readSize = opt.maxReadSize || 16 * 1024 * 1024;
      const file = opt.file;
      const p = new Promise((resolve, reject) => {
        parse.on('error', reject);
        parse.on('end', resolve);
        node_fs_1.default.stat(file, (er, stat) => {
          if (er) {
            reject(er);
          } else {
            const stream = new fsm.ReadStream(file, {
              readSize,
              size: stat.size,
            });
            stream.on('error', reject);
            stream.pipe(parse);
          }
        });
      });
      return p;
    };
    exports2.list = (0, make_command_js_1.makeCommand)(
      listFileSync,
      listFile,
      (opt) => new parse_js_1.Parser(opt),
      (opt) => new parse_js_1.Parser(opt),
      (opt, files) => {
        if (files == null ? void 0 : files.length)
          (0, exports2.filesFilter)(opt, files);
        if (!opt.noResume) onReadEntryFunction(opt);
      }
    );
  },
});

// lib/node_modules/tar/dist/commonjs/mode-fix.js
var require_lib_node_modules_tar_dist_commonjs_mode_fix_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/mode-fix.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.modeFix = void 0;
    var modeFix = (mode, isDir, portable) => {
      mode &= 4095;
      if (portable) {
        mode = (mode | 384) & ~18;
      }
      if (isDir) {
        if (mode & 256) {
          mode |= 64;
        }
        if (mode & 32) {
          mode |= 8;
        }
        if (mode & 4) {
          mode |= 1;
        }
      }
      return mode;
    };
    exports2.modeFix = modeFix;
  },
});

// lib/node_modules/tar/dist/commonjs/strip-absolute-path.js
var require_lib_node_modules_tar_dist_commonjs_strip_absolute_path_js =
  __commonJS({
    'lib/node_modules/tar/dist/commonjs/strip-absolute-path.js'(exports2) {
      'use strict';
      Object.defineProperty(exports2, '__esModule', { value: true });
      exports2.stripAbsolutePath = void 0;
      var node_path_1 = require('path');
      var { isAbsolute, parse } = node_path_1.win32;
      var stripAbsolutePath = (path3) => {
        let r = '';
        let parsed = parse(path3);
        while (isAbsolute(path3) || parsed.root) {
          const root =
            path3.charAt(0) === '/' && path3.slice(0, 4) !== '//?/'
              ? '/'
              : parsed.root;
          path3 = path3.slice(root.length);
          r += root;
          parsed = parse(path3);
        }
        return [r, path3];
      };
      exports2.stripAbsolutePath = stripAbsolutePath;
    },
  });

// lib/node_modules/tar/dist/commonjs/winchars.js
var require_lib_node_modules_tar_dist_commonjs_winchars_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/winchars.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.decode = exports2.encode = void 0;
    var raw = ['|', '<', '>', '?', ':'];
    var win = raw.map((char) =>
      String.fromCharCode(61440 + char.charCodeAt(0))
    );
    var toWin = new Map(raw.map((char, i) => [char, win[i]]));
    var toRaw = new Map(win.map((char, i) => [char, raw[i]]));
    var encode = (s) =>
      raw.reduce((s2, c) => s2.split(c).join(toWin.get(c)), s);
    exports2.encode = encode;
    var decode = (s) =>
      win.reduce((s2, c) => s2.split(c).join(toRaw.get(c)), s);
    exports2.decode = decode;
  },
});

// lib/node_modules/tar/dist/commonjs/write-entry.js
var require_lib_node_modules_tar_dist_commonjs_write_entry_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/write-entry.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (
              !desc ||
              ('get' in desc
                ? !m.__esModule
                : desc.writable || desc.configurable)
            ) {
              desc = {
                enumerable: true,
                get: function () {
                  return m[k];
                },
              };
            }
            Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.WriteEntryTar =
      exports2.WriteEntrySync =
      exports2.WriteEntry =
        void 0;
    var fs_1 = __importDefault(require('fs'));
    var minipass_1 = require_lib_node_modules_minipass_dist_commonjs_index_js();
    var path_1 = __importDefault(require('path'));
    var header_js_1 = require_lib_node_modules_tar_dist_commonjs_header_js();
    var mode_fix_js_1 =
      require_lib_node_modules_tar_dist_commonjs_mode_fix_js();
    var normalize_windows_path_js_1 =
      require_lib_node_modules_tar_dist_commonjs_normalize_windows_path_js();
    var options_js_1 = require_lib_node_modules_tar_dist_commonjs_options_js();
    var pax_js_1 = require_lib_node_modules_tar_dist_commonjs_pax_js();
    var strip_absolute_path_js_1 =
      require_lib_node_modules_tar_dist_commonjs_strip_absolute_path_js();
    var strip_trailing_slashes_js_1 =
      require_lib_node_modules_tar_dist_commonjs_strip_trailing_slashes_js();
    var warn_method_js_1 =
      require_lib_node_modules_tar_dist_commonjs_warn_method_js();
    var winchars = __importStar(
      require_lib_node_modules_tar_dist_commonjs_winchars_js()
    );
    var prefixPath = (path3, prefix) => {
      if (!prefix) {
        return (0, normalize_windows_path_js_1.normalizeWindowsPath)(path3);
      }
      path3 = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
        path3
      ).replace(/^\.(\/|$)/, '');
      return (
        (0, strip_trailing_slashes_js_1.stripTrailingSlashes)(prefix) +
        '/' +
        path3
      );
    };
    var maxReadSize = 16 * 1024 * 1024;
    var PROCESS = Symbol('process');
    var FILE = Symbol('file');
    var DIRECTORY = Symbol('directory');
    var SYMLINK = Symbol('symlink');
    var HARDLINK = Symbol('hardlink');
    var HEADER = Symbol('header');
    var READ = Symbol('read');
    var LSTAT = Symbol('lstat');
    var ONLSTAT = Symbol('onlstat');
    var ONREAD = Symbol('onread');
    var ONREADLINK = Symbol('onreadlink');
    var OPENFILE = Symbol('openfile');
    var ONOPENFILE = Symbol('onopenfile');
    var CLOSE = Symbol('close');
    var MODE = Symbol('mode');
    var AWAITDRAIN = Symbol('awaitDrain');
    var ONDRAIN = Symbol('ondrain');
    var PREFIX = Symbol('prefix');
    var _hadError;
    var WriteEntry = class extends minipass_1.Minipass {
      constructor(p, opt_ = {}) {
        const opt = (0, options_js_1.dealias)(opt_);
        super();
        __publicField(this, 'path');
        __publicField(this, 'portable');
        __publicField(this, 'myuid', (process.getuid && process.getuid()) || 0);
        // until node has builtin pwnam functions, this'll have to do
        __publicField(this, 'myuser', process.env.USER || '');
        __publicField(this, 'maxReadSize');
        __publicField(this, 'linkCache');
        __publicField(this, 'statCache');
        __publicField(this, 'preservePaths');
        __publicField(this, 'cwd');
        __publicField(this, 'strict');
        __publicField(this, 'mtime');
        __publicField(this, 'noPax');
        __publicField(this, 'noMtime');
        __publicField(this, 'prefix');
        __publicField(this, 'fd');
        __publicField(this, 'blockLen', 0);
        __publicField(this, 'blockRemain', 0);
        __publicField(this, 'buf');
        __publicField(this, 'pos', 0);
        __publicField(this, 'remain', 0);
        __publicField(this, 'length', 0);
        __publicField(this, 'offset', 0);
        __publicField(this, 'win32');
        __publicField(this, 'absolute');
        __publicField(this, 'header');
        __publicField(this, 'type');
        __publicField(this, 'linkpath');
        __publicField(this, 'stat');
        __publicField(this, 'onWriteEntry');
        __privateAdd(this, _hadError, false);
        this.path = (0, normalize_windows_path_js_1.normalizeWindowsPath)(p);
        this.portable = !!opt.portable;
        this.maxReadSize = opt.maxReadSize || maxReadSize;
        this.linkCache = opt.linkCache || /* @__PURE__ */ new Map();
        this.statCache = opt.statCache || /* @__PURE__ */ new Map();
        this.preservePaths = !!opt.preservePaths;
        this.cwd = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          opt.cwd || process.cwd()
        );
        this.strict = !!opt.strict;
        this.noPax = !!opt.noPax;
        this.noMtime = !!opt.noMtime;
        this.mtime = opt.mtime;
        this.prefix = opt.prefix
          ? (0, normalize_windows_path_js_1.normalizeWindowsPath)(opt.prefix)
          : void 0;
        this.onWriteEntry = opt.onWriteEntry;
        if (typeof opt.onwarn === 'function') {
          this.on('warn', opt.onwarn);
        }
        let pathWarn = false;
        if (!this.preservePaths) {
          const [root, stripped] = (0,
          strip_absolute_path_js_1.stripAbsolutePath)(this.path);
          if (root && typeof stripped === 'string') {
            this.path = stripped;
            pathWarn = root;
          }
        }
        this.win32 = !!opt.win32 || process.platform === 'win32';
        if (this.win32) {
          this.path = winchars.decode(this.path.replace(/\\/g, '/'));
          p = p.replace(/\\/g, '/');
        }
        this.absolute = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          opt.absolute || path_1.default.resolve(this.cwd, p)
        );
        if (this.path === '') {
          this.path = './';
        }
        if (pathWarn) {
          this.warn(
            'TAR_ENTRY_INFO',
            `stripping ${pathWarn} from absolute path`,
            {
              entry: this,
              path: pathWarn + this.path,
            }
          );
        }
        const cs = this.statCache.get(this.absolute);
        if (cs) {
          this[ONLSTAT](cs);
        } else {
          this[LSTAT]();
        }
      }
      warn(code, message, data = {}) {
        return (0, warn_method_js_1.warnMethod)(this, code, message, data);
      }
      emit(ev, ...data) {
        if (ev === 'error') {
          __privateSet(this, _hadError, true);
        }
        return super.emit(ev, ...data);
      }
      [LSTAT]() {
        fs_1.default.lstat(this.absolute, (er, stat) => {
          if (er) {
            return this.emit('error', er);
          }
          this[ONLSTAT](stat);
        });
      }
      [ONLSTAT](stat) {
        this.statCache.set(this.absolute, stat);
        this.stat = stat;
        if (!stat.isFile()) {
          stat.size = 0;
        }
        this.type = getType(stat);
        this.emit('stat', stat);
        this[PROCESS]();
      }
      [PROCESS]() {
        switch (this.type) {
          case 'File':
            return this[FILE]();
          case 'Directory':
            return this[DIRECTORY]();
          case 'SymbolicLink':
            return this[SYMLINK]();
          // unsupported types are ignored.
          default:
            return this.end();
        }
      }
      [MODE](mode) {
        return (0, mode_fix_js_1.modeFix)(
          mode,
          this.type === 'Directory',
          this.portable
        );
      }
      [PREFIX](path3) {
        return prefixPath(path3, this.prefix);
      }
      [HEADER]() {
        var _a2, _b;
        if (!this.stat) {
          throw new Error('cannot write header before stat');
        }
        if (this.type === 'Directory' && this.portable) {
          this.noMtime = true;
        }
        (_a2 = this.onWriteEntry) == null ? void 0 : _a2.call(this, this);
        this.header = new header_js_1.Header({
          path: this[PREFIX](this.path),
          // only apply the prefix to hard links.
          linkpath:
            this.type === 'Link' && this.linkpath !== void 0
              ? this[PREFIX](this.linkpath)
              : this.linkpath,
          // only the permissions and setuid/setgid/sticky bitflags
          // not the higher-order bits that specify file type
          mode: this[MODE](this.stat.mode),
          uid: this.portable ? void 0 : this.stat.uid,
          gid: this.portable ? void 0 : this.stat.gid,
          size: this.stat.size,
          mtime: this.noMtime ? void 0 : this.mtime || this.stat.mtime,
          /* c8 ignore next */
          type: this.type === 'Unsupported' ? void 0 : this.type,
          uname: this.portable
            ? void 0
            : this.stat.uid === this.myuid
              ? this.myuser
              : '',
          atime: this.portable ? void 0 : this.stat.atime,
          ctime: this.portable ? void 0 : this.stat.ctime,
        });
        if (this.header.encode() && !this.noPax) {
          super.write(
            new pax_js_1.Pax({
              atime: this.portable ? void 0 : this.header.atime,
              ctime: this.portable ? void 0 : this.header.ctime,
              gid: this.portable ? void 0 : this.header.gid,
              mtime: this.noMtime ? void 0 : this.mtime || this.header.mtime,
              path: this[PREFIX](this.path),
              linkpath:
                this.type === 'Link' && this.linkpath !== void 0
                  ? this[PREFIX](this.linkpath)
                  : this.linkpath,
              size: this.header.size,
              uid: this.portable ? void 0 : this.header.uid,
              uname: this.portable ? void 0 : this.header.uname,
              dev: this.portable ? void 0 : this.stat.dev,
              ino: this.portable ? void 0 : this.stat.ino,
              nlink: this.portable ? void 0 : this.stat.nlink,
            }).encode()
          );
        }
        const block = (_b = this.header) == null ? void 0 : _b.block;
        if (!block) {
          throw new Error('failed to encode header');
        }
        super.write(block);
      }
      [DIRECTORY]() {
        if (!this.stat) {
          throw new Error('cannot create directory entry without stat');
        }
        if (this.path.slice(-1) !== '/') {
          this.path += '/';
        }
        this.stat.size = 0;
        this[HEADER]();
        this.end();
      }
      [SYMLINK]() {
        fs_1.default.readlink(this.absolute, (er, linkpath) => {
          if (er) {
            return this.emit('error', er);
          }
          this[ONREADLINK](linkpath);
        });
      }
      [ONREADLINK](linkpath) {
        this.linkpath = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          linkpath
        );
        this[HEADER]();
        this.end();
      }
      [HARDLINK](linkpath) {
        if (!this.stat) {
          throw new Error('cannot create link entry without stat');
        }
        this.type = 'Link';
        this.linkpath = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          path_1.default.relative(this.cwd, linkpath)
        );
        this.stat.size = 0;
        this[HEADER]();
        this.end();
      }
      [FILE]() {
        if (!this.stat) {
          throw new Error('cannot create file entry without stat');
        }
        if (this.stat.nlink > 1) {
          const linkKey = `${this.stat.dev}:${this.stat.ino}`;
          const linkpath = this.linkCache.get(linkKey);
          if ((linkpath == null ? void 0 : linkpath.indexOf(this.cwd)) === 0) {
            return this[HARDLINK](linkpath);
          }
          this.linkCache.set(linkKey, this.absolute);
        }
        this[HEADER]();
        if (this.stat.size === 0) {
          return this.end();
        }
        this[OPENFILE]();
      }
      [OPENFILE]() {
        fs_1.default.open(this.absolute, 'r', (er, fd) => {
          if (er) {
            return this.emit('error', er);
          }
          this[ONOPENFILE](fd);
        });
      }
      [ONOPENFILE](fd) {
        this.fd = fd;
        if (__privateGet(this, _hadError)) {
          return this[CLOSE]();
        }
        if (!this.stat) {
          throw new Error('should stat before calling onopenfile');
        }
        this.blockLen = 512 * Math.ceil(this.stat.size / 512);
        this.blockRemain = this.blockLen;
        const bufLen = Math.min(this.blockLen, this.maxReadSize);
        this.buf = Buffer.allocUnsafe(bufLen);
        this.offset = 0;
        this.pos = 0;
        this.remain = this.stat.size;
        this.length = this.buf.length;
        this[READ]();
      }
      [READ]() {
        const { fd, buf, offset, length, pos } = this;
        if (fd === void 0 || buf === void 0) {
          throw new Error('cannot read file without first opening');
        }
        fs_1.default.read(fd, buf, offset, length, pos, (er, bytesRead) => {
          if (er) {
            return this[CLOSE](() => this.emit('error', er));
          }
          this[ONREAD](bytesRead);
        });
      }
      /* c8 ignore start */
      [CLOSE](cb = () => {}) {
        if (this.fd !== void 0) fs_1.default.close(this.fd, cb);
      }
      [ONREAD](bytesRead) {
        if (bytesRead <= 0 && this.remain > 0) {
          const er = Object.assign(new Error('encountered unexpected EOF'), {
            path: this.absolute,
            syscall: 'read',
            code: 'EOF',
          });
          return this[CLOSE](() => this.emit('error', er));
        }
        if (bytesRead > this.remain) {
          const er = Object.assign(
            new Error('did not encounter expected EOF'),
            {
              path: this.absolute,
              syscall: 'read',
              code: 'EOF',
            }
          );
          return this[CLOSE](() => this.emit('error', er));
        }
        if (!this.buf) {
          throw new Error('should have created buffer prior to reading');
        }
        if (bytesRead === this.remain) {
          for (
            let i = bytesRead;
            i < this.length && bytesRead < this.blockRemain;
            i++
          ) {
            this.buf[i + this.offset] = 0;
            bytesRead++;
            this.remain++;
          }
        }
        const chunk =
          this.offset === 0 && bytesRead === this.buf.length
            ? this.buf
            : this.buf.subarray(this.offset, this.offset + bytesRead);
        const flushed = this.write(chunk);
        if (!flushed) {
          this[AWAITDRAIN](() => this[ONDRAIN]());
        } else {
          this[ONDRAIN]();
        }
      }
      [AWAITDRAIN](cb) {
        this.once('drain', cb);
      }
      write(chunk, encoding, cb) {
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = void 0;
        }
        if (typeof chunk === 'string') {
          chunk = Buffer.from(
            chunk,
            typeof encoding === 'string' ? encoding : 'utf8'
          );
        }
        if (this.blockRemain < chunk.length) {
          const er = Object.assign(
            new Error('writing more data than expected'),
            {
              path: this.absolute,
            }
          );
          return this.emit('error', er);
        }
        this.remain -= chunk.length;
        this.blockRemain -= chunk.length;
        this.pos += chunk.length;
        this.offset += chunk.length;
        return super.write(chunk, null, cb);
      }
      [ONDRAIN]() {
        if (!this.remain) {
          if (this.blockRemain) {
            super.write(Buffer.alloc(this.blockRemain));
          }
          return this[CLOSE]((er) =>
            er ? this.emit('error', er) : this.end()
          );
        }
        if (!this.buf) {
          throw new Error('buffer lost somehow in ONDRAIN');
        }
        if (this.offset >= this.length) {
          this.buf = Buffer.allocUnsafe(
            Math.min(this.blockRemain, this.buf.length)
          );
          this.offset = 0;
        }
        this.length = this.buf.length - this.offset;
        this[READ]();
      }
    };
    _hadError = new WeakMap();
    exports2.WriteEntry = WriteEntry;
    var WriteEntrySync = class extends WriteEntry {
      constructor() {
        super(...arguments);
        __publicField(this, 'sync', true);
      }
      [LSTAT]() {
        this[ONLSTAT](fs_1.default.lstatSync(this.absolute));
      }
      [SYMLINK]() {
        this[ONREADLINK](fs_1.default.readlinkSync(this.absolute));
      }
      [OPENFILE]() {
        this[ONOPENFILE](fs_1.default.openSync(this.absolute, 'r'));
      }
      [READ]() {
        let threw = true;
        try {
          const { fd, buf, offset, length, pos } = this;
          if (fd === void 0 || buf === void 0) {
            throw new Error('fd and buf must be set in READ method');
          }
          const bytesRead = fs_1.default.readSync(fd, buf, offset, length, pos);
          this[ONREAD](bytesRead);
          threw = false;
        } finally {
          if (threw) {
            try {
              this[CLOSE](() => {});
            } catch (er) {}
          }
        }
      }
      [AWAITDRAIN](cb) {
        cb();
      }
      /* c8 ignore start */
      [CLOSE](cb = () => {}) {
        if (this.fd !== void 0) fs_1.default.closeSync(this.fd);
        cb();
      }
    };
    exports2.WriteEntrySync = WriteEntrySync;
    var WriteEntryTar = class extends minipass_1.Minipass {
      constructor(readEntry, opt_ = {}) {
        var _a2, _b;
        const opt = (0, options_js_1.dealias)(opt_);
        super();
        __publicField(this, 'blockLen', 0);
        __publicField(this, 'blockRemain', 0);
        __publicField(this, 'buf', 0);
        __publicField(this, 'pos', 0);
        __publicField(this, 'remain', 0);
        __publicField(this, 'length', 0);
        __publicField(this, 'preservePaths');
        __publicField(this, 'portable');
        __publicField(this, 'strict');
        __publicField(this, 'noPax');
        __publicField(this, 'noMtime');
        __publicField(this, 'readEntry');
        __publicField(this, 'type');
        __publicField(this, 'prefix');
        __publicField(this, 'path');
        __publicField(this, 'mode');
        __publicField(this, 'uid');
        __publicField(this, 'gid');
        __publicField(this, 'uname');
        __publicField(this, 'gname');
        __publicField(this, 'header');
        __publicField(this, 'mtime');
        __publicField(this, 'atime');
        __publicField(this, 'ctime');
        __publicField(this, 'linkpath');
        __publicField(this, 'size');
        __publicField(this, 'onWriteEntry');
        this.preservePaths = !!opt.preservePaths;
        this.portable = !!opt.portable;
        this.strict = !!opt.strict;
        this.noPax = !!opt.noPax;
        this.noMtime = !!opt.noMtime;
        this.onWriteEntry = opt.onWriteEntry;
        this.readEntry = readEntry;
        const { type } = readEntry;
        if (type === 'Unsupported') {
          throw new Error('writing entry that should be ignored');
        }
        this.type = type;
        if (this.type === 'Directory' && this.portable) {
          this.noMtime = true;
        }
        this.prefix = opt.prefix;
        this.path = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          readEntry.path
        );
        this.mode =
          readEntry.mode !== void 0 ? this[MODE](readEntry.mode) : void 0;
        this.uid = this.portable ? void 0 : readEntry.uid;
        this.gid = this.portable ? void 0 : readEntry.gid;
        this.uname = this.portable ? void 0 : readEntry.uname;
        this.gname = this.portable ? void 0 : readEntry.gname;
        this.size = readEntry.size;
        this.mtime = this.noMtime ? void 0 : opt.mtime || readEntry.mtime;
        this.atime = this.portable ? void 0 : readEntry.atime;
        this.ctime = this.portable ? void 0 : readEntry.ctime;
        this.linkpath =
          readEntry.linkpath !== void 0
            ? (0, normalize_windows_path_js_1.normalizeWindowsPath)(
                readEntry.linkpath
              )
            : void 0;
        if (typeof opt.onwarn === 'function') {
          this.on('warn', opt.onwarn);
        }
        let pathWarn = false;
        if (!this.preservePaths) {
          const [root, stripped] = (0,
          strip_absolute_path_js_1.stripAbsolutePath)(this.path);
          if (root && typeof stripped === 'string') {
            this.path = stripped;
            pathWarn = root;
          }
        }
        this.remain = readEntry.size;
        this.blockRemain = readEntry.startBlockSize;
        (_a2 = this.onWriteEntry) == null ? void 0 : _a2.call(this, this);
        this.header = new header_js_1.Header({
          path: this[PREFIX](this.path),
          linkpath:
            this.type === 'Link' && this.linkpath !== void 0
              ? this[PREFIX](this.linkpath)
              : this.linkpath,
          // only the permissions and setuid/setgid/sticky bitflags
          // not the higher-order bits that specify file type
          mode: this.mode,
          uid: this.portable ? void 0 : this.uid,
          gid: this.portable ? void 0 : this.gid,
          size: this.size,
          mtime: this.noMtime ? void 0 : this.mtime,
          type: this.type,
          uname: this.portable ? void 0 : this.uname,
          atime: this.portable ? void 0 : this.atime,
          ctime: this.portable ? void 0 : this.ctime,
        });
        if (pathWarn) {
          this.warn(
            'TAR_ENTRY_INFO',
            `stripping ${pathWarn} from absolute path`,
            {
              entry: this,
              path: pathWarn + this.path,
            }
          );
        }
        if (this.header.encode() && !this.noPax) {
          super.write(
            new pax_js_1.Pax({
              atime: this.portable ? void 0 : this.atime,
              ctime: this.portable ? void 0 : this.ctime,
              gid: this.portable ? void 0 : this.gid,
              mtime: this.noMtime ? void 0 : this.mtime,
              path: this[PREFIX](this.path),
              linkpath:
                this.type === 'Link' && this.linkpath !== void 0
                  ? this[PREFIX](this.linkpath)
                  : this.linkpath,
              size: this.size,
              uid: this.portable ? void 0 : this.uid,
              uname: this.portable ? void 0 : this.uname,
              dev: this.portable ? void 0 : this.readEntry.dev,
              ino: this.portable ? void 0 : this.readEntry.ino,
              nlink: this.portable ? void 0 : this.readEntry.nlink,
            }).encode()
          );
        }
        const b = (_b = this.header) == null ? void 0 : _b.block;
        if (!b) throw new Error('failed to encode header');
        super.write(b);
        readEntry.pipe(this);
      }
      warn(code, message, data = {}) {
        return (0, warn_method_js_1.warnMethod)(this, code, message, data);
      }
      [PREFIX](path3) {
        return prefixPath(path3, this.prefix);
      }
      [MODE](mode) {
        return (0, mode_fix_js_1.modeFix)(
          mode,
          this.type === 'Directory',
          this.portable
        );
      }
      write(chunk, encoding, cb) {
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = void 0;
        }
        if (typeof chunk === 'string') {
          chunk = Buffer.from(
            chunk,
            typeof encoding === 'string' ? encoding : 'utf8'
          );
        }
        const writeLen = chunk.length;
        if (writeLen > this.blockRemain) {
          throw new Error('writing more to entry than is appropriate');
        }
        this.blockRemain -= writeLen;
        return super.write(chunk, cb);
      }
      end(chunk, encoding, cb) {
        if (this.blockRemain) {
          super.write(Buffer.alloc(this.blockRemain));
        }
        if (typeof chunk === 'function') {
          cb = chunk;
          encoding = void 0;
          chunk = void 0;
        }
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = void 0;
        }
        if (typeof chunk === 'string') {
          chunk = Buffer.from(chunk, encoding != null ? encoding : 'utf8');
        }
        if (cb) this.once('finish', cb);
        chunk ? super.end(chunk, cb) : super.end(cb);
        return this;
      }
    };
    exports2.WriteEntryTar = WriteEntryTar;
    var getType = (stat) =>
      stat.isFile()
        ? 'File'
        : stat.isDirectory()
          ? 'Directory'
          : stat.isSymbolicLink()
            ? 'SymbolicLink'
            : 'Unsupported';
  },
});

// lib/node_modules/tar/dist/commonjs/pack.js
var require_lib_node_modules_tar_dist_commonjs_pack_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/pack.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (
              !desc ||
              ('get' in desc
                ? !m.__esModule
                : desc.writable || desc.configurable)
            ) {
              desc = {
                enumerable: true,
                get: function () {
                  return m[k];
                },
              };
            }
            Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.PackSync = exports2.Pack = exports2.PackJob = void 0;
    var fs_1 = __importDefault(require('fs'));
    var write_entry_js_1 =
      require_lib_node_modules_tar_dist_commonjs_write_entry_js();
    var PackJob = class {
      constructor(path3, absolute) {
        __publicField(this, 'path');
        __publicField(this, 'absolute');
        __publicField(this, 'entry');
        __publicField(this, 'stat');
        __publicField(this, 'readdir');
        __publicField(this, 'pending', false);
        __publicField(this, 'ignore', false);
        __publicField(this, 'piped', false);
        this.path = path3 || './';
        this.absolute = absolute;
      }
    };
    exports2.PackJob = PackJob;
    var minipass_1 = require_lib_node_modules_minipass_dist_commonjs_index_js();
    var zlib = __importStar(
      require_lib_node_modules_minizlib_dist_commonjs_index_js()
    );
    var yallist_1 = require_lib_node_modules_yallist_dist_commonjs_index_js();
    var read_entry_js_1 =
      require_lib_node_modules_tar_dist_commonjs_read_entry_js();
    var warn_method_js_1 =
      require_lib_node_modules_tar_dist_commonjs_warn_method_js();
    var EOF = Buffer.alloc(1024);
    var ONSTAT = Symbol('onStat');
    var ENDED = Symbol('ended');
    var QUEUE = Symbol('queue');
    var CURRENT = Symbol('current');
    var PROCESS = Symbol('process');
    var PROCESSING = Symbol('processing');
    var PROCESSJOB = Symbol('processJob');
    var JOBS = Symbol('jobs');
    var JOBDONE = Symbol('jobDone');
    var ADDFSENTRY = Symbol('addFSEntry');
    var ADDTARENTRY = Symbol('addTarEntry');
    var STAT = Symbol('stat');
    var READDIR = Symbol('readdir');
    var ONREADDIR = Symbol('onreaddir');
    var PIPE = Symbol('pipe');
    var ENTRY = Symbol('entry');
    var ENTRYOPT = Symbol('entryOpt');
    var WRITEENTRYCLASS = Symbol('writeEntryClass');
    var WRITE = Symbol('write');
    var ONDRAIN = Symbol('ondrain');
    var path_1 = __importDefault(require('path'));
    var normalize_windows_path_js_1 =
      require_lib_node_modules_tar_dist_commonjs_normalize_windows_path_js();
    var _a2, _b, _c, _d, _e;
    var Pack = class extends minipass_1.Minipass {
      constructor(opt = {}) {
        super();
        __publicField(this, 'opt');
        __publicField(this, 'cwd');
        __publicField(this, 'maxReadSize');
        __publicField(this, 'preservePaths');
        __publicField(this, 'strict');
        __publicField(this, 'noPax');
        __publicField(this, 'prefix');
        __publicField(this, 'linkCache');
        __publicField(this, 'statCache');
        __publicField(this, 'file');
        __publicField(this, 'portable');
        __publicField(this, 'zip');
        __publicField(this, 'readdirCache');
        __publicField(this, 'noDirRecurse');
        __publicField(this, 'follow');
        __publicField(this, 'noMtime');
        __publicField(this, 'mtime');
        __publicField(this, 'filter');
        __publicField(this, 'jobs');
        __publicField(this, _e);
        __publicField(this, 'onWriteEntry');
        __publicField(this, _d);
        __publicField(this, _c, 0);
        __publicField(this, _b, false);
        __publicField(this, _a2, false);
        this.opt = opt;
        this.file = opt.file || '';
        this.cwd = opt.cwd || process.cwd();
        this.maxReadSize = opt.maxReadSize;
        this.preservePaths = !!opt.preservePaths;
        this.strict = !!opt.strict;
        this.noPax = !!opt.noPax;
        this.prefix = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          opt.prefix || ''
        );
        this.linkCache = opt.linkCache || /* @__PURE__ */ new Map();
        this.statCache = opt.statCache || /* @__PURE__ */ new Map();
        this.readdirCache = opt.readdirCache || /* @__PURE__ */ new Map();
        this.onWriteEntry = opt.onWriteEntry;
        this[WRITEENTRYCLASS] = write_entry_js_1.WriteEntry;
        if (typeof opt.onwarn === 'function') {
          this.on('warn', opt.onwarn);
        }
        this.portable = !!opt.portable;
        if (opt.gzip || opt.brotli) {
          if (opt.gzip && opt.brotli) {
            throw new TypeError('gzip and brotli are mutually exclusive');
          }
          if (opt.gzip) {
            if (typeof opt.gzip !== 'object') {
              opt.gzip = {};
            }
            if (this.portable) {
              opt.gzip.portable = true;
            }
            this.zip = new zlib.Gzip(opt.gzip);
          }
          if (opt.brotli) {
            if (typeof opt.brotli !== 'object') {
              opt.brotli = {};
            }
            this.zip = new zlib.BrotliCompress(opt.brotli);
          }
          if (!this.zip) throw new Error('impossible');
          const zip = this.zip;
          zip.on('data', (chunk) => super.write(chunk));
          zip.on('end', () => super.end());
          zip.on('drain', () => this[ONDRAIN]());
          this.on('resume', () => zip.resume());
        } else {
          this.on('drain', this[ONDRAIN]);
        }
        this.noDirRecurse = !!opt.noDirRecurse;
        this.follow = !!opt.follow;
        this.noMtime = !!opt.noMtime;
        if (opt.mtime) this.mtime = opt.mtime;
        this.filter =
          typeof opt.filter === 'function' ? opt.filter : () => true;
        this[QUEUE] = new yallist_1.Yallist();
        this[JOBS] = 0;
        this.jobs = Number(opt.jobs) || 4;
        this[PROCESSING] = false;
        this[ENDED] = false;
      }
      [((_e = WRITEENTRYCLASS),
      (_d = QUEUE),
      (_c = JOBS),
      (_b = PROCESSING),
      (_a2 = ENDED),
      WRITE)](chunk) {
        return super.write(chunk);
      }
      add(path3) {
        this.write(path3);
        return this;
      }
      end(path3, encoding, cb) {
        if (typeof path3 === 'function') {
          cb = path3;
          path3 = void 0;
        }
        if (typeof encoding === 'function') {
          cb = encoding;
          encoding = void 0;
        }
        if (path3) {
          this.add(path3);
        }
        this[ENDED] = true;
        this[PROCESS]();
        if (cb) cb();
        return this;
      }
      write(path3) {
        if (this[ENDED]) {
          throw new Error('write after end');
        }
        if (path3 instanceof read_entry_js_1.ReadEntry) {
          this[ADDTARENTRY](path3);
        } else {
          this[ADDFSENTRY](path3);
        }
        return this.flowing;
      }
      [ADDTARENTRY](p) {
        const absolute = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          path_1.default.resolve(this.cwd, p.path)
        );
        if (!this.filter(p.path, p)) {
          p.resume();
        } else {
          const job = new PackJob(p.path, absolute);
          job.entry = new write_entry_js_1.WriteEntryTar(
            p,
            this[ENTRYOPT](job)
          );
          job.entry.on('end', () => this[JOBDONE](job));
          this[JOBS] += 1;
          this[QUEUE].push(job);
        }
        this[PROCESS]();
      }
      [ADDFSENTRY](p) {
        const absolute = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          path_1.default.resolve(this.cwd, p)
        );
        this[QUEUE].push(new PackJob(p, absolute));
        this[PROCESS]();
      }
      [STAT](job) {
        job.pending = true;
        this[JOBS] += 1;
        const stat = this.follow ? 'stat' : 'lstat';
        fs_1.default[stat](job.absolute, (er, stat2) => {
          job.pending = false;
          this[JOBS] -= 1;
          if (er) {
            this.emit('error', er);
          } else {
            this[ONSTAT](job, stat2);
          }
        });
      }
      [ONSTAT](job, stat) {
        this.statCache.set(job.absolute, stat);
        job.stat = stat;
        if (!this.filter(job.path, stat)) {
          job.ignore = true;
        }
        this[PROCESS]();
      }
      [READDIR](job) {
        job.pending = true;
        this[JOBS] += 1;
        fs_1.default.readdir(job.absolute, (er, entries) => {
          job.pending = false;
          this[JOBS] -= 1;
          if (er) {
            return this.emit('error', er);
          }
          this[ONREADDIR](job, entries);
        });
      }
      [ONREADDIR](job, entries) {
        this.readdirCache.set(job.absolute, entries);
        job.readdir = entries;
        this[PROCESS]();
      }
      [PROCESS]() {
        if (this[PROCESSING]) {
          return;
        }
        this[PROCESSING] = true;
        for (
          let w = this[QUEUE].head;
          !!w && this[JOBS] < this.jobs;
          w = w.next
        ) {
          this[PROCESSJOB](w.value);
          if (w.value.ignore) {
            const p = w.next;
            this[QUEUE].removeNode(w);
            w.next = p;
          }
        }
        this[PROCESSING] = false;
        if (this[ENDED] && !this[QUEUE].length && this[JOBS] === 0) {
          if (this.zip) {
            this.zip.end(EOF);
          } else {
            super.write(EOF);
            super.end();
          }
        }
      }
      get [CURRENT]() {
        return this[QUEUE] && this[QUEUE].head && this[QUEUE].head.value;
      }
      [JOBDONE](_job) {
        this[QUEUE].shift();
        this[JOBS] -= 1;
        this[PROCESS]();
      }
      [PROCESSJOB](job) {
        if (job.pending) {
          return;
        }
        if (job.entry) {
          if (job === this[CURRENT] && !job.piped) {
            this[PIPE](job);
          }
          return;
        }
        if (!job.stat) {
          const sc = this.statCache.get(job.absolute);
          if (sc) {
            this[ONSTAT](job, sc);
          } else {
            this[STAT](job);
          }
        }
        if (!job.stat) {
          return;
        }
        if (job.ignore) {
          return;
        }
        if (!this.noDirRecurse && job.stat.isDirectory() && !job.readdir) {
          const rc = this.readdirCache.get(job.absolute);
          if (rc) {
            this[ONREADDIR](job, rc);
          } else {
            this[READDIR](job);
          }
          if (!job.readdir) {
            return;
          }
        }
        job.entry = this[ENTRY](job);
        if (!job.entry) {
          job.ignore = true;
          return;
        }
        if (job === this[CURRENT] && !job.piped) {
          this[PIPE](job);
        }
      }
      [ENTRYOPT](job) {
        return {
          onwarn: (code, msg, data) => this.warn(code, msg, data),
          noPax: this.noPax,
          cwd: this.cwd,
          absolute: job.absolute,
          preservePaths: this.preservePaths,
          maxReadSize: this.maxReadSize,
          strict: this.strict,
          portable: this.portable,
          linkCache: this.linkCache,
          statCache: this.statCache,
          noMtime: this.noMtime,
          mtime: this.mtime,
          prefix: this.prefix,
          onWriteEntry: this.onWriteEntry,
        };
      }
      [ENTRY](job) {
        this[JOBS] += 1;
        try {
          const e = new this[WRITEENTRYCLASS](job.path, this[ENTRYOPT](job));
          return e
            .on('end', () => this[JOBDONE](job))
            .on('error', (er) => this.emit('error', er));
        } catch (er) {
          this.emit('error', er);
        }
      }
      [ONDRAIN]() {
        if (this[CURRENT] && this[CURRENT].entry) {
          this[CURRENT].entry.resume();
        }
      }
      // like .pipe() but using super, because our write() is special
      [PIPE](job) {
        job.piped = true;
        if (job.readdir) {
          job.readdir.forEach((entry) => {
            const p = job.path;
            const base = p === './' ? '' : p.replace(/\/*$/, '/');
            this[ADDFSENTRY](base + entry);
          });
        }
        const source = job.entry;
        const zip = this.zip;
        if (!source) throw new Error('cannot pipe without source');
        if (zip) {
          source.on('data', (chunk) => {
            if (!zip.write(chunk)) {
              source.pause();
            }
          });
        } else {
          source.on('data', (chunk) => {
            if (!super.write(chunk)) {
              source.pause();
            }
          });
        }
      }
      pause() {
        if (this.zip) {
          this.zip.pause();
        }
        return super.pause();
      }
      warn(code, message, data = {}) {
        (0, warn_method_js_1.warnMethod)(this, code, message, data);
      }
    };
    exports2.Pack = Pack;
    var PackSync = class extends Pack {
      constructor(opt) {
        super(opt);
        __publicField(this, 'sync', true);
        this[WRITEENTRYCLASS] = write_entry_js_1.WriteEntrySync;
      }
      // pause/resume are no-ops in sync streams.
      pause() {}
      resume() {}
      [STAT](job) {
        const stat = this.follow ? 'statSync' : 'lstatSync';
        this[ONSTAT](job, fs_1.default[stat](job.absolute));
      }
      [READDIR](job) {
        this[ONREADDIR](job, fs_1.default.readdirSync(job.absolute));
      }
      // gotta get it all in this tick
      [PIPE](job) {
        const source = job.entry;
        const zip = this.zip;
        if (job.readdir) {
          job.readdir.forEach((entry) => {
            const p = job.path;
            const base = p === './' ? '' : p.replace(/\/*$/, '/');
            this[ADDFSENTRY](base + entry);
          });
        }
        if (!source) throw new Error('Cannot pipe without source');
        if (zip) {
          source.on('data', (chunk) => {
            zip.write(chunk);
          });
        } else {
          source.on('data', (chunk) => {
            super[WRITE](chunk);
          });
        }
      }
    };
    exports2.PackSync = PackSync;
  },
});

// lib/node_modules/tar/dist/commonjs/create.js
var require_lib_node_modules_tar_dist_commonjs_create_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/create.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.create = void 0;
    var fs_minipass_1 =
      require_lib_node_modules__isaacs_fs_minipass_dist_commonjs_index_js();
    var node_path_1 = __importDefault(require('path'));
    var list_js_1 = require_lib_node_modules_tar_dist_commonjs_list_js();
    var make_command_js_1 =
      require_lib_node_modules_tar_dist_commonjs_make_command_js();
    var pack_js_1 = require_lib_node_modules_tar_dist_commonjs_pack_js();
    var createFileSync = (opt, files) => {
      const p = new pack_js_1.PackSync(opt);
      const stream = new fs_minipass_1.WriteStreamSync(opt.file, {
        mode: opt.mode || 438,
      });
      p.pipe(stream);
      addFilesSync(p, files);
    };
    var createFile = (opt, files) => {
      const p = new pack_js_1.Pack(opt);
      const stream = new fs_minipass_1.WriteStream(opt.file, {
        mode: opt.mode || 438,
      });
      p.pipe(stream);
      const promise = new Promise((res, rej) => {
        stream.on('error', rej);
        stream.on('close', res);
        p.on('error', rej);
      });
      addFilesAsync(p, files);
      return promise;
    };
    var addFilesSync = (p, files) => {
      files.forEach((file) => {
        if (file.charAt(0) === '@') {
          (0, list_js_1.list)({
            file: node_path_1.default.resolve(p.cwd, file.slice(1)),
            sync: true,
            noResume: true,
            onReadEntry: (entry) => p.add(entry),
          });
        } else {
          p.add(file);
        }
      });
      p.end();
    };
    var addFilesAsync = async (p, files) => {
      for (let i = 0; i < files.length; i++) {
        const file = String(files[i]);
        if (file.charAt(0) === '@') {
          await (0, list_js_1.list)({
            file: node_path_1.default.resolve(String(p.cwd), file.slice(1)),
            noResume: true,
            onReadEntry: (entry) => {
              p.add(entry);
            },
          });
        } else {
          p.add(file);
        }
      }
      p.end();
    };
    var createSync = (opt, files) => {
      const p = new pack_js_1.PackSync(opt);
      addFilesSync(p, files);
      return p;
    };
    var createAsync = (opt, files) => {
      const p = new pack_js_1.Pack(opt);
      addFilesAsync(p, files);
      return p;
    };
    exports2.create = (0, make_command_js_1.makeCommand)(
      createFileSync,
      createFile,
      createSync,
      createAsync,
      (_opt, files) => {
        if (!(files == null ? void 0 : files.length)) {
          throw new TypeError('no paths specified to add to archive');
        }
      }
    );
  },
});

// lib/node_modules/tar/dist/commonjs/get-write-flag.js
var require_lib_node_modules_tar_dist_commonjs_get_write_flag_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/get-write-flag.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.getWriteFlag = void 0;
    var fs_1 = __importDefault(require('fs'));
    var platform = process.env.__FAKE_PLATFORM__ || process.platform;
    var isWindows = platform === 'win32';
    var { O_CREAT, O_TRUNC, O_WRONLY } = fs_1.default.constants;
    var UV_FS_O_FILEMAP =
      Number(process.env.__FAKE_FS_O_FILENAME__) ||
      fs_1.default.constants.UV_FS_O_FILEMAP ||
      0;
    var fMapEnabled = isWindows && !!UV_FS_O_FILEMAP;
    var fMapLimit = 512 * 1024;
    var fMapFlag = UV_FS_O_FILEMAP | O_TRUNC | O_CREAT | O_WRONLY;
    exports2.getWriteFlag = !fMapEnabled
      ? () => 'w'
      : (size) => (size < fMapLimit ? fMapFlag : 'w');
  },
});

// lib/node_modules/chownr/dist/commonjs/index.js
var require_lib_node_modules_chownr_dist_commonjs_index_js = __commonJS({
  'lib/node_modules/chownr/dist/commonjs/index.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.chownrSync = exports2.chownr = void 0;
    var node_fs_1 = __importDefault(require('fs'));
    var node_path_1 = __importDefault(require('path'));
    var lchownSync = (path3, uid, gid) => {
      try {
        return node_fs_1.default.lchownSync(path3, uid, gid);
      } catch (er) {
        if ((er == null ? void 0 : er.code) !== 'ENOENT') throw er;
      }
    };
    var chown = (cpath, uid, gid, cb) => {
      node_fs_1.default.lchown(cpath, uid, gid, (er) => {
        cb(er && (er == null ? void 0 : er.code) !== 'ENOENT' ? er : null);
      });
    };
    var chownrKid = (p, child, uid, gid, cb) => {
      if (child.isDirectory()) {
        (0, exports2.chownr)(
          node_path_1.default.resolve(p, child.name),
          uid,
          gid,
          (er) => {
            if (er) return cb(er);
            const cpath = node_path_1.default.resolve(p, child.name);
            chown(cpath, uid, gid, cb);
          }
        );
      } else {
        const cpath = node_path_1.default.resolve(p, child.name);
        chown(cpath, uid, gid, cb);
      }
    };
    var chownr = (p, uid, gid, cb) => {
      node_fs_1.default.readdir(p, { withFileTypes: true }, (er, children) => {
        if (er) {
          if (er.code === 'ENOENT') return cb();
          else if (er.code !== 'ENOTDIR' && er.code !== 'ENOTSUP')
            return cb(er);
        }
        if (er || !children.length) return chown(p, uid, gid, cb);
        let len = children.length;
        let errState = null;
        const then = (er2) => {
          if (errState) return;
          if (er2) return cb((errState = er2));
          if (--len === 0) return chown(p, uid, gid, cb);
        };
        for (const child of children) {
          chownrKid(p, child, uid, gid, then);
        }
      });
    };
    exports2.chownr = chownr;
    var chownrKidSync = (p, child, uid, gid) => {
      if (child.isDirectory())
        (0, exports2.chownrSync)(
          node_path_1.default.resolve(p, child.name),
          uid,
          gid
        );
      lchownSync(node_path_1.default.resolve(p, child.name), uid, gid);
    };
    var chownrSync = (p, uid, gid) => {
      let children;
      try {
        children = node_fs_1.default.readdirSync(p, { withFileTypes: true });
      } catch (er) {
        const e = er;
        if ((e == null ? void 0 : e.code) === 'ENOENT') return;
        else if (
          (e == null ? void 0 : e.code) === 'ENOTDIR' ||
          (e == null ? void 0 : e.code) === 'ENOTSUP'
        )
          return lchownSync(p, uid, gid);
        else throw e;
      }
      for (const child of children) {
        chownrKidSync(p, child, uid, gid);
      }
      return lchownSync(p, uid, gid);
    };
    exports2.chownrSync = chownrSync;
  },
});

// lib/node_modules/mkdirp/dist/cjs/src/opts-arg.js
var require_lib_node_modules_mkdirp_dist_cjs_src_opts_arg_js = __commonJS({
  'lib/node_modules/mkdirp/dist/cjs/src/opts-arg.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.optsArg = void 0;
    var fs_1 = require('fs');
    var optsArg = (opts) => {
      if (!opts) {
        opts = { mode: 511 };
      } else if (typeof opts === 'object') {
        opts = { mode: 511, ...opts };
      } else if (typeof opts === 'number') {
        opts = { mode: opts };
      } else if (typeof opts === 'string') {
        opts = { mode: parseInt(opts, 8) };
      } else {
        throw new TypeError('invalid options argument');
      }
      const resolved = opts;
      const optsFs = opts.fs || {};
      opts.mkdir = opts.mkdir || optsFs.mkdir || fs_1.mkdir;
      opts.mkdirAsync = opts.mkdirAsync
        ? opts.mkdirAsync
        : async (path3, options) => {
            return new Promise((res, rej) =>
              resolved.mkdir(path3, options, (er, made) =>
                er ? rej(er) : res(made)
              )
            );
          };
      opts.stat = opts.stat || optsFs.stat || fs_1.stat;
      opts.statAsync = opts.statAsync
        ? opts.statAsync
        : async (path3) =>
            new Promise((res, rej) =>
              resolved.stat(path3, (err, stats) =>
                err ? rej(err) : res(stats)
              )
            );
      opts.statSync = opts.statSync || optsFs.statSync || fs_1.statSync;
      opts.mkdirSync = opts.mkdirSync || optsFs.mkdirSync || fs_1.mkdirSync;
      return resolved;
    };
    exports2.optsArg = optsArg;
  },
});

// lib/node_modules/mkdirp/dist/cjs/src/mkdirp-manual.js
var require_lib_node_modules_mkdirp_dist_cjs_src_mkdirp_manual_js = __commonJS({
  'lib/node_modules/mkdirp/dist/cjs/src/mkdirp-manual.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.mkdirpManual = exports2.mkdirpManualSync = void 0;
    var path_1 = require('path');
    var opts_arg_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_opts_arg_js();
    var mkdirpManualSync = (path3, options, made) => {
      const parent = (0, path_1.dirname)(path3);
      const opts = { ...(0, opts_arg_js_1.optsArg)(options), recursive: false };
      if (parent === path3) {
        try {
          return opts.mkdirSync(path3, opts);
        } catch (er) {
          const fer = er;
          if (fer && fer.code !== 'EISDIR') {
            throw er;
          }
          return;
        }
      }
      try {
        opts.mkdirSync(path3, opts);
        return made || path3;
      } catch (er) {
        const fer = er;
        if (fer && fer.code === 'ENOENT') {
          return (0, exports2.mkdirpManualSync)(
            path3,
            opts,
            (0, exports2.mkdirpManualSync)(parent, opts, made)
          );
        }
        if (fer && fer.code !== 'EEXIST' && fer && fer.code !== 'EROFS') {
          throw er;
        }
        try {
          if (!opts.statSync(path3).isDirectory()) throw er;
        } catch (_) {
          throw er;
        }
      }
    };
    exports2.mkdirpManualSync = mkdirpManualSync;
    exports2.mkdirpManual = Object.assign(
      async (path3, options, made) => {
        const opts = (0, opts_arg_js_1.optsArg)(options);
        opts.recursive = false;
        const parent = (0, path_1.dirname)(path3);
        if (parent === path3) {
          return opts.mkdirAsync(path3, opts).catch((er) => {
            const fer = er;
            if (fer && fer.code !== 'EISDIR') {
              throw er;
            }
          });
        }
        return opts.mkdirAsync(path3, opts).then(
          () => made || path3,
          async (er) => {
            const fer = er;
            if (fer && fer.code === 'ENOENT') {
              return (0, exports2.mkdirpManual)(parent, opts).then((made2) =>
                (0, exports2.mkdirpManual)(path3, opts, made2)
              );
            }
            if (fer && fer.code !== 'EEXIST' && fer.code !== 'EROFS') {
              throw er;
            }
            return opts.statAsync(path3).then(
              (st) => {
                if (st.isDirectory()) {
                  return made;
                } else {
                  throw er;
                }
              },
              () => {
                throw er;
              }
            );
          }
        );
      },
      { sync: exports2.mkdirpManualSync }
    );
  },
});

// lib/node_modules/mkdirp/dist/cjs/src/find-made.js
var require_lib_node_modules_mkdirp_dist_cjs_src_find_made_js = __commonJS({
  'lib/node_modules/mkdirp/dist/cjs/src/find-made.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.findMadeSync = exports2.findMade = void 0;
    var path_1 = require('path');
    var findMade = async (opts, parent, path3) => {
      if (path3 === parent) {
        return;
      }
      return opts.statAsync(parent).then(
        (st) => (st.isDirectory() ? path3 : void 0),
        // will fail later
        // will fail later
        (er) => {
          const fer = er;
          return fer && fer.code === 'ENOENT'
            ? (0, exports2.findMade)(opts, (0, path_1.dirname)(parent), parent)
            : void 0;
        }
      );
    };
    exports2.findMade = findMade;
    var findMadeSync = (opts, parent, path3) => {
      if (path3 === parent) {
        return void 0;
      }
      try {
        return opts.statSync(parent).isDirectory() ? path3 : void 0;
      } catch (er) {
        const fer = er;
        return fer && fer.code === 'ENOENT'
          ? (0, exports2.findMadeSync)(
              opts,
              (0, path_1.dirname)(parent),
              parent
            )
          : void 0;
      }
    };
    exports2.findMadeSync = findMadeSync;
  },
});

// lib/node_modules/mkdirp/dist/cjs/src/mkdirp-native.js
var require_lib_node_modules_mkdirp_dist_cjs_src_mkdirp_native_js = __commonJS({
  'lib/node_modules/mkdirp/dist/cjs/src/mkdirp-native.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.mkdirpNative = exports2.mkdirpNativeSync = void 0;
    var path_1 = require('path');
    var find_made_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_find_made_js();
    var mkdirp_manual_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_mkdirp_manual_js();
    var opts_arg_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_opts_arg_js();
    var mkdirpNativeSync = (path3, options) => {
      const opts = (0, opts_arg_js_1.optsArg)(options);
      opts.recursive = true;
      const parent = (0, path_1.dirname)(path3);
      if (parent === path3) {
        return opts.mkdirSync(path3, opts);
      }
      const made = (0, find_made_js_1.findMadeSync)(opts, path3);
      try {
        opts.mkdirSync(path3, opts);
        return made;
      } catch (er) {
        const fer = er;
        if (fer && fer.code === 'ENOENT') {
          return (0, mkdirp_manual_js_1.mkdirpManualSync)(path3, opts);
        } else {
          throw er;
        }
      }
    };
    exports2.mkdirpNativeSync = mkdirpNativeSync;
    exports2.mkdirpNative = Object.assign(
      async (path3, options) => {
        const opts = {
          ...(0, opts_arg_js_1.optsArg)(options),
          recursive: true,
        };
        const parent = (0, path_1.dirname)(path3);
        if (parent === path3) {
          return await opts.mkdirAsync(path3, opts);
        }
        return (0, find_made_js_1.findMade)(opts, path3).then((made) =>
          opts
            .mkdirAsync(path3, opts)
            .then((m) => made || m)
            .catch((er) => {
              const fer = er;
              if (fer && fer.code === 'ENOENT') {
                return (0, mkdirp_manual_js_1.mkdirpManual)(path3, opts);
              } else {
                throw er;
              }
            })
        );
      },
      { sync: exports2.mkdirpNativeSync }
    );
  },
});

// lib/node_modules/mkdirp/dist/cjs/src/path-arg.js
var require_lib_node_modules_mkdirp_dist_cjs_src_path_arg_js = __commonJS({
  'lib/node_modules/mkdirp/dist/cjs/src/path-arg.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.pathArg = void 0;
    var platform = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform;
    var path_1 = require('path');
    var pathArg = (path3) => {
      if (/\0/.test(path3)) {
        throw Object.assign(
          new TypeError('path must be a string without null bytes'),
          {
            path: path3,
            code: 'ERR_INVALID_ARG_VALUE',
          }
        );
      }
      path3 = (0, path_1.resolve)(path3);
      if (platform === 'win32') {
        const badWinChars = /[*|"<>?:]/;
        const { root } = (0, path_1.parse)(path3);
        if (badWinChars.test(path3.substring(root.length))) {
          throw Object.assign(new Error('Illegal characters in path.'), {
            path: path3,
            code: 'EINVAL',
          });
        }
      }
      return path3;
    };
    exports2.pathArg = pathArg;
  },
});

// lib/node_modules/mkdirp/dist/cjs/src/use-native.js
var require_lib_node_modules_mkdirp_dist_cjs_src_use_native_js = __commonJS({
  'lib/node_modules/mkdirp/dist/cjs/src/use-native.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.useNative = exports2.useNativeSync = void 0;
    var fs_1 = require('fs');
    var opts_arg_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_opts_arg_js();
    var version2 =
      process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version;
    var versArr = version2.replace(/^v/, '').split('.');
    var hasNative =
      +versArr[0] > 10 || (+versArr[0] === 10 && +versArr[1] >= 12);
    exports2.useNativeSync = !hasNative
      ? () => false
      : (opts) => (0, opts_arg_js_1.optsArg)(opts).mkdirSync === fs_1.mkdirSync;
    exports2.useNative = Object.assign(
      !hasNative
        ? () => false
        : (opts) => (0, opts_arg_js_1.optsArg)(opts).mkdir === fs_1.mkdir,
      {
        sync: exports2.useNativeSync,
      }
    );
  },
});

// lib/node_modules/mkdirp/dist/cjs/src/index.js
var require_lib_node_modules_mkdirp_dist_cjs_src_index_js = __commonJS({
  'lib/node_modules/mkdirp/dist/cjs/src/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.mkdirp =
      exports2.nativeSync =
      exports2.native =
      exports2.manualSync =
      exports2.manual =
      exports2.sync =
      exports2.mkdirpSync =
      exports2.useNativeSync =
      exports2.useNative =
      exports2.mkdirpNativeSync =
      exports2.mkdirpNative =
      exports2.mkdirpManualSync =
      exports2.mkdirpManual =
        void 0;
    var mkdirp_manual_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_mkdirp_manual_js();
    var mkdirp_native_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_mkdirp_native_js();
    var opts_arg_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_opts_arg_js();
    var path_arg_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_path_arg_js();
    var use_native_js_1 =
      require_lib_node_modules_mkdirp_dist_cjs_src_use_native_js();
    var mkdirp_manual_js_2 =
      require_lib_node_modules_mkdirp_dist_cjs_src_mkdirp_manual_js();
    Object.defineProperty(exports2, 'mkdirpManual', {
      enumerable: true,
      get: function () {
        return mkdirp_manual_js_2.mkdirpManual;
      },
    });
    Object.defineProperty(exports2, 'mkdirpManualSync', {
      enumerable: true,
      get: function () {
        return mkdirp_manual_js_2.mkdirpManualSync;
      },
    });
    var mkdirp_native_js_2 =
      require_lib_node_modules_mkdirp_dist_cjs_src_mkdirp_native_js();
    Object.defineProperty(exports2, 'mkdirpNative', {
      enumerable: true,
      get: function () {
        return mkdirp_native_js_2.mkdirpNative;
      },
    });
    Object.defineProperty(exports2, 'mkdirpNativeSync', {
      enumerable: true,
      get: function () {
        return mkdirp_native_js_2.mkdirpNativeSync;
      },
    });
    var use_native_js_2 =
      require_lib_node_modules_mkdirp_dist_cjs_src_use_native_js();
    Object.defineProperty(exports2, 'useNative', {
      enumerable: true,
      get: function () {
        return use_native_js_2.useNative;
      },
    });
    Object.defineProperty(exports2, 'useNativeSync', {
      enumerable: true,
      get: function () {
        return use_native_js_2.useNativeSync;
      },
    });
    var mkdirpSync = (path3, opts) => {
      path3 = (0, path_arg_js_1.pathArg)(path3);
      const resolved = (0, opts_arg_js_1.optsArg)(opts);
      return (0, use_native_js_1.useNativeSync)(resolved)
        ? (0, mkdirp_native_js_1.mkdirpNativeSync)(path3, resolved)
        : (0, mkdirp_manual_js_1.mkdirpManualSync)(path3, resolved);
    };
    exports2.mkdirpSync = mkdirpSync;
    exports2.sync = exports2.mkdirpSync;
    exports2.manual = mkdirp_manual_js_1.mkdirpManual;
    exports2.manualSync = mkdirp_manual_js_1.mkdirpManualSync;
    exports2.native = mkdirp_native_js_1.mkdirpNative;
    exports2.nativeSync = mkdirp_native_js_1.mkdirpNativeSync;
    exports2.mkdirp = Object.assign(
      async (path3, opts) => {
        path3 = (0, path_arg_js_1.pathArg)(path3);
        const resolved = (0, opts_arg_js_1.optsArg)(opts);
        return (0, use_native_js_1.useNative)(resolved)
          ? (0, mkdirp_native_js_1.mkdirpNative)(path3, resolved)
          : (0, mkdirp_manual_js_1.mkdirpManual)(path3, resolved);
      },
      {
        mkdirpSync: exports2.mkdirpSync,
        mkdirpNative: mkdirp_native_js_1.mkdirpNative,
        mkdirpNativeSync: mkdirp_native_js_1.mkdirpNativeSync,
        mkdirpManual: mkdirp_manual_js_1.mkdirpManual,
        mkdirpManualSync: mkdirp_manual_js_1.mkdirpManualSync,
        sync: exports2.mkdirpSync,
        native: mkdirp_native_js_1.mkdirpNative,
        nativeSync: mkdirp_native_js_1.mkdirpNativeSync,
        manual: mkdirp_manual_js_1.mkdirpManual,
        manualSync: mkdirp_manual_js_1.mkdirpManualSync,
        useNative: use_native_js_1.useNative,
        useNativeSync: use_native_js_1.useNativeSync,
      }
    );
  },
});

// lib/node_modules/tar/dist/commonjs/cwd-error.js
var require_lib_node_modules_tar_dist_commonjs_cwd_error_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/cwd-error.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.CwdError = void 0;
    var CwdError = class extends Error {
      constructor(path3, code) {
        super(`${code}: Cannot cd into '${path3}'`);
        __publicField(this, 'path');
        __publicField(this, 'code');
        __publicField(this, 'syscall', 'chdir');
        this.path = path3;
        this.code = code;
      }
      get name() {
        return 'CwdError';
      }
    };
    exports2.CwdError = CwdError;
  },
});

// lib/node_modules/tar/dist/commonjs/symlink-error.js
var require_lib_node_modules_tar_dist_commonjs_symlink_error_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/symlink-error.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.SymlinkError = void 0;
    var SymlinkError = class extends Error {
      constructor(symlink, path3) {
        super('TAR_SYMLINK_ERROR: Cannot extract through symbolic link');
        __publicField(this, 'path');
        __publicField(this, 'symlink');
        __publicField(this, 'syscall', 'symlink');
        __publicField(this, 'code', 'TAR_SYMLINK_ERROR');
        this.symlink = symlink;
        this.path = path3;
      }
      get name() {
        return 'SymlinkError';
      }
    };
    exports2.SymlinkError = SymlinkError;
  },
});

// lib/node_modules/tar/dist/commonjs/mkdir.js
var require_lib_node_modules_tar_dist_commonjs_mkdir_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/mkdir.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.mkdirSync = exports2.mkdir = void 0;
    var chownr_1 = require_lib_node_modules_chownr_dist_commonjs_index_js();
    var fs_1 = __importDefault(require('fs'));
    var mkdirp_1 = require_lib_node_modules_mkdirp_dist_cjs_src_index_js();
    var node_path_1 = __importDefault(require('path'));
    var cwd_error_js_1 =
      require_lib_node_modules_tar_dist_commonjs_cwd_error_js();
    var normalize_windows_path_js_1 =
      require_lib_node_modules_tar_dist_commonjs_normalize_windows_path_js();
    var symlink_error_js_1 =
      require_lib_node_modules_tar_dist_commonjs_symlink_error_js();
    var cGet = (cache, key) =>
      cache.get((0, normalize_windows_path_js_1.normalizeWindowsPath)(key));
    var cSet = (cache, key, val) =>
      cache.set(
        (0, normalize_windows_path_js_1.normalizeWindowsPath)(key),
        val
      );
    var checkCwd = (dir, cb) => {
      fs_1.default.stat(dir, (er, st) => {
        if (er || !st.isDirectory()) {
          er = new cwd_error_js_1.CwdError(
            dir,
            (er == null ? void 0 : er.code) || 'ENOTDIR'
          );
        }
        cb(er);
      });
    };
    var mkdir = (dir, opt, cb) => {
      var _a2;
      dir = (0, normalize_windows_path_js_1.normalizeWindowsPath)(dir);
      const umask = (_a2 = opt.umask) != null ? _a2 : 18;
      const mode = opt.mode | 448;
      const needChmod = (mode & umask) !== 0;
      const uid = opt.uid;
      const gid = opt.gid;
      const doChown =
        typeof uid === 'number' &&
        typeof gid === 'number' &&
        (uid !== opt.processUid || gid !== opt.processGid);
      const preserve = opt.preserve;
      const unlink = opt.unlink;
      const cache = opt.cache;
      const cwd = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
        opt.cwd
      );
      const done = (er, created) => {
        if (er) {
          cb(er);
        } else {
          cSet(cache, dir, true);
          if (created && doChown) {
            (0, chownr_1.chownr)(created, uid, gid, (er2) => done(er2));
          } else if (needChmod) {
            fs_1.default.chmod(dir, mode, cb);
          } else {
            cb();
          }
        }
      };
      if (cache && cGet(cache, dir) === true) {
        return done();
      }
      if (dir === cwd) {
        return checkCwd(dir, done);
      }
      if (preserve) {
        return (0, mkdirp_1.mkdirp)(dir, { mode }).then(
          (made) => done(null, made != null ? made : void 0),
          // oh, ts
          done
        );
      }
      const sub = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
        node_path_1.default.relative(cwd, dir)
      );
      const parts = sub.split('/');
      mkdir_(cwd, parts, mode, cache, unlink, cwd, void 0, done);
    };
    exports2.mkdir = mkdir;
    var mkdir_ = (base, parts, mode, cache, unlink, cwd, created, cb) => {
      if (!parts.length) {
        return cb(null, created);
      }
      const p = parts.shift();
      const part = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
        node_path_1.default.resolve(base + '/' + p)
      );
      if (cGet(cache, part)) {
        return mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
      }
      fs_1.default.mkdir(
        part,
        mode,
        onmkdir(part, parts, mode, cache, unlink, cwd, created, cb)
      );
    };
    var onmkdir =
      (part, parts, mode, cache, unlink, cwd, created, cb) => (er) => {
        if (er) {
          fs_1.default.lstat(part, (statEr, st) => {
            if (statEr) {
              statEr.path =
                statEr.path &&
                (0, normalize_windows_path_js_1.normalizeWindowsPath)(
                  statEr.path
                );
              cb(statEr);
            } else if (st.isDirectory()) {
              mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
            } else if (unlink) {
              fs_1.default.unlink(part, (er2) => {
                if (er2) {
                  return cb(er2);
                }
                fs_1.default.mkdir(
                  part,
                  mode,
                  onmkdir(part, parts, mode, cache, unlink, cwd, created, cb)
                );
              });
            } else if (st.isSymbolicLink()) {
              return cb(
                new symlink_error_js_1.SymlinkError(
                  part,
                  part + '/' + parts.join('/')
                )
              );
            } else {
              cb(er);
            }
          });
        } else {
          created = created || part;
          mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
        }
      };
    var checkCwdSync = (dir) => {
      let ok = false;
      let code = void 0;
      try {
        ok = fs_1.default.statSync(dir).isDirectory();
      } catch (er) {
        code = er == null ? void 0 : er.code;
      } finally {
        if (!ok) {
          throw new cwd_error_js_1.CwdError(
            dir,
            code != null ? code : 'ENOTDIR'
          );
        }
      }
    };
    var mkdirSync = (dir, opt) => {
      var _a2, _b;
      dir = (0, normalize_windows_path_js_1.normalizeWindowsPath)(dir);
      const umask = (_a2 = opt.umask) != null ? _a2 : 18;
      const mode = opt.mode | 448;
      const needChmod = (mode & umask) !== 0;
      const uid = opt.uid;
      const gid = opt.gid;
      const doChown =
        typeof uid === 'number' &&
        typeof gid === 'number' &&
        (uid !== opt.processUid || gid !== opt.processGid);
      const preserve = opt.preserve;
      const unlink = opt.unlink;
      const cache = opt.cache;
      const cwd = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
        opt.cwd
      );
      const done = (created2) => {
        cSet(cache, dir, true);
        if (created2 && doChown) {
          (0, chownr_1.chownrSync)(created2, uid, gid);
        }
        if (needChmod) {
          fs_1.default.chmodSync(dir, mode);
        }
      };
      if (cache && cGet(cache, dir) === true) {
        return done();
      }
      if (dir === cwd) {
        checkCwdSync(cwd);
        return done();
      }
      if (preserve) {
        return done(
          (_b = (0, mkdirp_1.mkdirpSync)(dir, mode)) != null ? _b : void 0
        );
      }
      const sub = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
        node_path_1.default.relative(cwd, dir)
      );
      const parts = sub.split('/');
      let created = void 0;
      for (
        let p = parts.shift(), part = cwd;
        p && (part += '/' + p);
        p = parts.shift()
      ) {
        part = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          node_path_1.default.resolve(part)
        );
        if (cGet(cache, part)) {
          continue;
        }
        try {
          fs_1.default.mkdirSync(part, mode);
          created = created || part;
          cSet(cache, part, true);
        } catch (er) {
          const st = fs_1.default.lstatSync(part);
          if (st.isDirectory()) {
            cSet(cache, part, true);
            continue;
          } else if (unlink) {
            fs_1.default.unlinkSync(part);
            fs_1.default.mkdirSync(part, mode);
            created = created || part;
            cSet(cache, part, true);
            continue;
          } else if (st.isSymbolicLink()) {
            return new symlink_error_js_1.SymlinkError(
              part,
              part + '/' + parts.join('/')
            );
          }
        }
      }
      return done(created);
    };
    exports2.mkdirSync = mkdirSync;
  },
});

// lib/node_modules/tar/dist/commonjs/normalize-unicode.js
var require_lib_node_modules_tar_dist_commonjs_normalize_unicode_js =
  __commonJS({
    'lib/node_modules/tar/dist/commonjs/normalize-unicode.js'(exports2) {
      'use strict';
      Object.defineProperty(exports2, '__esModule', { value: true });
      exports2.normalizeUnicode = void 0;
      var normalizeCache = /* @__PURE__ */ Object.create(null);
      var { hasOwnProperty } = Object.prototype;
      var normalizeUnicode = (s) => {
        if (!hasOwnProperty.call(normalizeCache, s)) {
          normalizeCache[s] = s.normalize('NFD');
        }
        return normalizeCache[s];
      };
      exports2.normalizeUnicode = normalizeUnicode;
    },
  });

// lib/node_modules/tar/dist/commonjs/path-reservations.js
var require_lib_node_modules_tar_dist_commonjs_path_reservations_js =
  __commonJS({
    'lib/node_modules/tar/dist/commonjs/path-reservations.js'(exports2) {
      'use strict';
      Object.defineProperty(exports2, '__esModule', { value: true });
      exports2.PathReservations = void 0;
      var node_path_1 = require('path');
      var normalize_unicode_js_1 =
        require_lib_node_modules_tar_dist_commonjs_normalize_unicode_js();
      var strip_trailing_slashes_js_1 =
        require_lib_node_modules_tar_dist_commonjs_strip_trailing_slashes_js();
      var platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
      var isWindows = platform === 'win32';
      var getDirs = (path3) => {
        const dirs = path3
          .split('/')
          .slice(0, -1)
          .reduce((set, path4) => {
            const s = set[set.length - 1];
            if (s !== void 0) {
              path4 = (0, node_path_1.join)(s, path4);
            }
            set.push(path4 || '/');
            return set;
          }, []);
        return dirs;
      };
      var _queues,
        _reservations,
        _running,
        _PathReservations_instances,
        getQueues_fn,
        run_fn,
        clear_fn;
      var PathReservations = class {
        constructor() {
          __privateAdd(this, _PathReservations_instances);
          // path => [function or Set]
          // A Set object means a directory reservation
          // A fn is a direct reservation on that path
          __privateAdd(this, _queues, /* @__PURE__ */ new Map());
          // fn => {paths:[path,...], dirs:[path, ...]}
          __privateAdd(this, _reservations, /* @__PURE__ */ new Map());
          // functions currently running
          __privateAdd(this, _running, /* @__PURE__ */ new Set());
        }
        reserve(paths, fn) {
          paths = isWindows
            ? ['win32 parallelization disabled']
            : paths.map((p) => {
                return (0, strip_trailing_slashes_js_1.stripTrailingSlashes)(
                  (0, node_path_1.join)(
                    (0, normalize_unicode_js_1.normalizeUnicode)(p)
                  )
                ).toLowerCase();
              });
          const dirs = new Set(
            paths.map((path3) => getDirs(path3)).reduce((a, b) => a.concat(b))
          );
          __privateGet(this, _reservations).set(fn, { dirs, paths });
          for (const p of paths) {
            const q = __privateGet(this, _queues).get(p);
            if (!q) {
              __privateGet(this, _queues).set(p, [fn]);
            } else {
              q.push(fn);
            }
          }
          for (const dir of dirs) {
            const q = __privateGet(this, _queues).get(dir);
            if (!q) {
              __privateGet(this, _queues).set(dir, [
                /* @__PURE__ */ new Set([fn]),
              ]);
            } else {
              const l = q[q.length - 1];
              if (l instanceof Set) {
                l.add(fn);
              } else {
                q.push(/* @__PURE__ */ new Set([fn]));
              }
            }
          }
          return __privateMethod(
            this,
            _PathReservations_instances,
            run_fn
          ).call(this, fn);
        }
        // check if fn is first in line for all its paths, and is
        // included in the first set for all its dir queues
        check(fn) {
          const { paths, dirs } = __privateMethod(
            this,
            _PathReservations_instances,
            getQueues_fn
          ).call(this, fn);
          return (
            paths.every((q) => q && q[0] === fn) &&
            dirs.every((q) => q && q[0] instanceof Set && q[0].has(fn))
          );
        }
      };
      _queues = new WeakMap();
      _reservations = new WeakMap();
      _running = new WeakMap();
      _PathReservations_instances = new WeakSet();
      // return the queues for each path the function cares about
      // fn => {paths, dirs}
      getQueues_fn = function (fn) {
        const res = __privateGet(this, _reservations).get(fn);
        if (!res) {
          throw new Error('function does not have any path reservations');
        }
        return {
          paths: res.paths.map((path3) =>
            __privateGet(this, _queues).get(path3)
          ),
          dirs: [...res.dirs].map((path3) =>
            __privateGet(this, _queues).get(path3)
          ),
        };
      };
      // run the function if it's first in line and not already running
      run_fn = function (fn) {
        if (__privateGet(this, _running).has(fn) || !this.check(fn)) {
          return false;
        }
        __privateGet(this, _running).add(fn);
        fn(() =>
          __privateMethod(this, _PathReservations_instances, clear_fn).call(
            this,
            fn
          )
        );
        return true;
      };
      clear_fn = function (fn) {
        if (!__privateGet(this, _running).has(fn)) {
          return false;
        }
        const res = __privateGet(this, _reservations).get(fn);
        if (!res) {
          throw new Error('invalid reservation');
        }
        const { paths, dirs } = res;
        const next = /* @__PURE__ */ new Set();
        for (const path3 of paths) {
          const q = __privateGet(this, _queues).get(path3);
          if (!q || (q == null ? void 0 : q[0]) !== fn) {
            continue;
          }
          const q0 = q[1];
          if (!q0) {
            __privateGet(this, _queues).delete(path3);
            continue;
          }
          q.shift();
          if (typeof q0 === 'function') {
            next.add(q0);
          } else {
            for (const f of q0) {
              next.add(f);
            }
          }
        }
        for (const dir of dirs) {
          const q = __privateGet(this, _queues).get(dir);
          const q0 = q == null ? void 0 : q[0];
          if (!q || !(q0 instanceof Set)) continue;
          if (q0.size === 1 && q.length === 1) {
            __privateGet(this, _queues).delete(dir);
            continue;
          } else if (q0.size === 1) {
            q.shift();
            const n = q[0];
            if (typeof n === 'function') {
              next.add(n);
            }
          } else {
            q0.delete(fn);
          }
        }
        __privateGet(this, _running).delete(fn);
        next.forEach((fn2) =>
          __privateMethod(this, _PathReservations_instances, run_fn).call(
            this,
            fn2
          )
        );
        return true;
      };
      exports2.PathReservations = PathReservations;
    },
  });

// lib/node_modules/tar/dist/commonjs/unpack.js
var require_lib_node_modules_tar_dist_commonjs_unpack_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/unpack.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (
              !desc ||
              ('get' in desc
                ? !m.__esModule
                : desc.writable || desc.configurable)
            ) {
              desc = {
                enumerable: true,
                get: function () {
                  return m[k];
                },
              };
            }
            Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.UnpackSync = exports2.Unpack = void 0;
    var fsm = __importStar(
      require_lib_node_modules__isaacs_fs_minipass_dist_commonjs_index_js()
    );
    var node_assert_1 = __importDefault(require('assert'));
    var node_crypto_1 = require('crypto');
    var node_fs_1 = __importDefault(require('fs'));
    var node_path_1 = __importDefault(require('path'));
    var get_write_flag_js_1 =
      require_lib_node_modules_tar_dist_commonjs_get_write_flag_js();
    var mkdir_js_1 = require_lib_node_modules_tar_dist_commonjs_mkdir_js();
    var normalize_unicode_js_1 =
      require_lib_node_modules_tar_dist_commonjs_normalize_unicode_js();
    var normalize_windows_path_js_1 =
      require_lib_node_modules_tar_dist_commonjs_normalize_windows_path_js();
    var parse_js_1 = require_lib_node_modules_tar_dist_commonjs_parse_js();
    var strip_absolute_path_js_1 =
      require_lib_node_modules_tar_dist_commonjs_strip_absolute_path_js();
    var strip_trailing_slashes_js_1 =
      require_lib_node_modules_tar_dist_commonjs_strip_trailing_slashes_js();
    var wc = __importStar(
      require_lib_node_modules_tar_dist_commonjs_winchars_js()
    );
    var path_reservations_js_1 =
      require_lib_node_modules_tar_dist_commonjs_path_reservations_js();
    var ONENTRY = Symbol('onEntry');
    var CHECKFS = Symbol('checkFs');
    var CHECKFS2 = Symbol('checkFs2');
    var PRUNECACHE = Symbol('pruneCache');
    var ISREUSABLE = Symbol('isReusable');
    var MAKEFS = Symbol('makeFs');
    var FILE = Symbol('file');
    var DIRECTORY = Symbol('directory');
    var LINK = Symbol('link');
    var SYMLINK = Symbol('symlink');
    var HARDLINK = Symbol('hardlink');
    var UNSUPPORTED = Symbol('unsupported');
    var CHECKPATH = Symbol('checkPath');
    var MKDIR = Symbol('mkdir');
    var ONERROR = Symbol('onError');
    var PENDING = Symbol('pending');
    var PEND = Symbol('pend');
    var UNPEND = Symbol('unpend');
    var ENDED = Symbol('ended');
    var MAYBECLOSE = Symbol('maybeClose');
    var SKIP = Symbol('skip');
    var DOCHOWN = Symbol('doChown');
    var UID = Symbol('uid');
    var GID = Symbol('gid');
    var CHECKED_CWD = Symbol('checkedCwd');
    var platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
    var isWindows = platform === 'win32';
    var DEFAULT_MAX_DEPTH = 1024;
    var unlinkFile = (path3, cb) => {
      if (!isWindows) {
        return node_fs_1.default.unlink(path3, cb);
      }
      const name =
        path3 + '.DELETE.' + (0, node_crypto_1.randomBytes)(16).toString('hex');
      node_fs_1.default.rename(path3, name, (er) => {
        if (er) {
          return cb(er);
        }
        node_fs_1.default.unlink(name, cb);
      });
    };
    var unlinkFileSync = (path3) => {
      if (!isWindows) {
        return node_fs_1.default.unlinkSync(path3);
      }
      const name =
        path3 + '.DELETE.' + (0, node_crypto_1.randomBytes)(16).toString('hex');
      node_fs_1.default.renameSync(path3, name);
      node_fs_1.default.unlinkSync(name);
    };
    var uint32 = (a, b, c) =>
      a !== void 0 && a === a >>> 0 ? a : b !== void 0 && b === b >>> 0 ? b : c;
    var cacheKeyNormalize = (path3) =>
      (0, strip_trailing_slashes_js_1.stripTrailingSlashes)(
        (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          (0, normalize_unicode_js_1.normalizeUnicode)(path3)
        )
      ).toLowerCase();
    var pruneCache = (cache, abs) => {
      abs = cacheKeyNormalize(abs);
      for (const path3 of cache.keys()) {
        const pnorm = cacheKeyNormalize(path3);
        if (pnorm === abs || pnorm.indexOf(abs + '/') === 0) {
          cache.delete(path3);
        }
      }
    };
    var dropCache = (cache) => {
      for (const key of cache.keys()) {
        cache.delete(key);
      }
    };
    var _a2, _b, _c;
    var Unpack = class extends parse_js_1.Parser {
      constructor(opt = {}) {
        opt.ondone = () => {
          this[ENDED] = true;
          this[MAYBECLOSE]();
        };
        super(opt);
        __publicField(this, _c, false);
        __publicField(this, _b, false);
        __publicField(this, _a2, 0);
        __publicField(
          this,
          'reservations',
          new path_reservations_js_1.PathReservations()
        );
        __publicField(this, 'transform');
        __publicField(this, 'writable', true);
        __publicField(this, 'readable', false);
        __publicField(this, 'dirCache');
        __publicField(this, 'uid');
        __publicField(this, 'gid');
        __publicField(this, 'setOwner');
        __publicField(this, 'preserveOwner');
        __publicField(this, 'processGid');
        __publicField(this, 'processUid');
        __publicField(this, 'maxDepth');
        __publicField(this, 'forceChown');
        __publicField(this, 'win32');
        __publicField(this, 'newer');
        __publicField(this, 'keep');
        __publicField(this, 'noMtime');
        __publicField(this, 'preservePaths');
        __publicField(this, 'unlink');
        __publicField(this, 'cwd');
        __publicField(this, 'strip');
        __publicField(this, 'processUmask');
        __publicField(this, 'umask');
        __publicField(this, 'dmode');
        __publicField(this, 'fmode');
        __publicField(this, 'chmod');
        this.transform = opt.transform;
        this.dirCache = opt.dirCache || /* @__PURE__ */ new Map();
        this.chmod = !!opt.chmod;
        if (typeof opt.uid === 'number' || typeof opt.gid === 'number') {
          if (typeof opt.uid !== 'number' || typeof opt.gid !== 'number') {
            throw new TypeError('cannot set owner without number uid and gid');
          }
          if (opt.preserveOwner) {
            throw new TypeError(
              'cannot preserve owner in archive and also set owner explicitly'
            );
          }
          this.uid = opt.uid;
          this.gid = opt.gid;
          this.setOwner = true;
        } else {
          this.uid = void 0;
          this.gid = void 0;
          this.setOwner = false;
        }
        if (opt.preserveOwner === void 0 && typeof opt.uid !== 'number') {
          this.preserveOwner = !!(process.getuid && process.getuid() === 0);
        } else {
          this.preserveOwner = !!opt.preserveOwner;
        }
        this.processUid =
          (this.preserveOwner || this.setOwner) && process.getuid
            ? process.getuid()
            : void 0;
        this.processGid =
          (this.preserveOwner || this.setOwner) && process.getgid
            ? process.getgid()
            : void 0;
        this.maxDepth =
          typeof opt.maxDepth === 'number' ? opt.maxDepth : DEFAULT_MAX_DEPTH;
        this.forceChown = opt.forceChown === true;
        this.win32 = !!opt.win32 || isWindows;
        this.newer = !!opt.newer;
        this.keep = !!opt.keep;
        this.noMtime = !!opt.noMtime;
        this.preservePaths = !!opt.preservePaths;
        this.unlink = !!opt.unlink;
        this.cwd = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          node_path_1.default.resolve(opt.cwd || process.cwd())
        );
        this.strip = Number(opt.strip) || 0;
        this.processUmask = !this.chmod
          ? 0
          : typeof opt.processUmask === 'number'
            ? opt.processUmask
            : process.umask();
        this.umask =
          typeof opt.umask === 'number' ? opt.umask : this.processUmask;
        this.dmode = opt.dmode || 511 & ~this.umask;
        this.fmode = opt.fmode || 438 & ~this.umask;
        this.on('entry', (entry) => this[ONENTRY](entry));
      }
      // a bad or damaged archive is a warning for Parser, but an error
      // when extracting.  Mark those errors as unrecoverable, because
      // the Unpack contract cannot be met.
      warn(code, msg, data = {}) {
        if (code === 'TAR_BAD_ARCHIVE' || code === 'TAR_ABORT') {
          data.recoverable = false;
        }
        return super.warn(code, msg, data);
      }
      [((_c = ENDED), (_b = CHECKED_CWD), (_a2 = PENDING), MAYBECLOSE)]() {
        if (this[ENDED] && this[PENDING] === 0) {
          this.emit('prefinish');
          this.emit('finish');
          this.emit('end');
        }
      }
      [CHECKPATH](entry) {
        var _a3;
        const p = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          entry.path
        );
        const parts = p.split('/');
        if (this.strip) {
          if (parts.length < this.strip) {
            return false;
          }
          if (entry.type === 'Link') {
            const linkparts = (0,
            normalize_windows_path_js_1.normalizeWindowsPath)(
              String(entry.linkpath)
            ).split('/');
            if (linkparts.length >= this.strip) {
              entry.linkpath = linkparts.slice(this.strip).join('/');
            } else {
              return false;
            }
          }
          parts.splice(0, this.strip);
          entry.path = parts.join('/');
        }
        if (isFinite(this.maxDepth) && parts.length > this.maxDepth) {
          this.warn('TAR_ENTRY_ERROR', 'path excessively deep', {
            entry,
            path: p,
            depth: parts.length,
            maxDepth: this.maxDepth,
          });
          return false;
        }
        if (!this.preservePaths) {
          if (
            parts.includes('..') /* c8 ignore next */ ||
            (isWindows &&
              /^[a-z]:\.\.$/i.test((_a3 = parts[0]) != null ? _a3 : ''))
          ) {
            this.warn('TAR_ENTRY_ERROR', `path contains '..'`, {
              entry,
              path: p,
            });
            return false;
          }
          const [root, stripped] = (0,
          strip_absolute_path_js_1.stripAbsolutePath)(p);
          if (root) {
            entry.path = String(stripped);
            this.warn(
              'TAR_ENTRY_INFO',
              `stripping ${root} from absolute path`,
              {
                entry,
                path: p,
              }
            );
          }
        }
        if (node_path_1.default.isAbsolute(entry.path)) {
          entry.absolute = (0,
          normalize_windows_path_js_1.normalizeWindowsPath)(
            node_path_1.default.resolve(entry.path)
          );
        } else {
          entry.absolute = (0,
          normalize_windows_path_js_1.normalizeWindowsPath)(
            node_path_1.default.resolve(this.cwd, entry.path)
          );
        }
        if (
          !this.preservePaths &&
          typeof entry.absolute === 'string' &&
          entry.absolute.indexOf(this.cwd + '/') !== 0 &&
          entry.absolute !== this.cwd
        ) {
          this.warn('TAR_ENTRY_ERROR', 'path escaped extraction target', {
            entry,
            path: (0, normalize_windows_path_js_1.normalizeWindowsPath)(
              entry.path
            ),
            resolvedPath: entry.absolute,
            cwd: this.cwd,
          });
          return false;
        }
        if (
          entry.absolute === this.cwd &&
          entry.type !== 'Directory' &&
          entry.type !== 'GNUDumpDir'
        ) {
          return false;
        }
        if (this.win32) {
          const { root: aRoot } = node_path_1.default.win32.parse(
            String(entry.absolute)
          );
          entry.absolute =
            aRoot + wc.encode(String(entry.absolute).slice(aRoot.length));
          const { root: pRoot } = node_path_1.default.win32.parse(entry.path);
          entry.path = pRoot + wc.encode(entry.path.slice(pRoot.length));
        }
        return true;
      }
      [ONENTRY](entry) {
        if (!this[CHECKPATH](entry)) {
          return entry.resume();
        }
        node_assert_1.default.equal(typeof entry.absolute, 'string');
        switch (entry.type) {
          case 'Directory':
          case 'GNUDumpDir':
            if (entry.mode) {
              entry.mode = entry.mode | 448;
            }
          // eslint-disable-next-line no-fallthrough
          case 'File':
          case 'OldFile':
          case 'ContiguousFile':
          case 'Link':
          case 'SymbolicLink':
            return this[CHECKFS](entry);
          case 'CharacterDevice':
          case 'BlockDevice':
          case 'FIFO':
          default:
            return this[UNSUPPORTED](entry);
        }
      }
      [ONERROR](er, entry) {
        if (er.name === 'CwdError') {
          this.emit('error', er);
        } else {
          this.warn('TAR_ENTRY_ERROR', er, { entry });
          this[UNPEND]();
          entry.resume();
        }
      }
      [MKDIR](dir, mode, cb) {
        (0, mkdir_js_1.mkdir)(
          (0, normalize_windows_path_js_1.normalizeWindowsPath)(dir),
          {
            uid: this.uid,
            gid: this.gid,
            processUid: this.processUid,
            processGid: this.processGid,
            umask: this.processUmask,
            preserve: this.preservePaths,
            unlink: this.unlink,
            cache: this.dirCache,
            cwd: this.cwd,
            mode,
          },
          cb
        );
      }
      [DOCHOWN](entry) {
        return (
          this.forceChown ||
          (this.preserveOwner &&
            ((typeof entry.uid === 'number' && entry.uid !== this.processUid) ||
              (typeof entry.gid === 'number' &&
                entry.gid !== this.processGid))) ||
          (typeof this.uid === 'number' && this.uid !== this.processUid) ||
          (typeof this.gid === 'number' && this.gid !== this.processGid)
        );
      }
      [UID](entry) {
        return uint32(this.uid, entry.uid, this.processUid);
      }
      [GID](entry) {
        return uint32(this.gid, entry.gid, this.processGid);
      }
      [FILE](entry, fullyDone) {
        const mode =
          typeof entry.mode === 'number' ? entry.mode & 4095 : this.fmode;
        const stream = new fsm.WriteStream(String(entry.absolute), {
          // slight lie, but it can be numeric flags
          flags: (0, get_write_flag_js_1.getWriteFlag)(entry.size),
          mode,
          autoClose: false,
        });
        stream.on('error', (er) => {
          if (stream.fd) {
            node_fs_1.default.close(stream.fd, () => {});
          }
          stream.write = () => true;
          this[ONERROR](er, entry);
          fullyDone();
        });
        let actions = 1;
        const done = (er) => {
          if (er) {
            if (stream.fd) {
              node_fs_1.default.close(stream.fd, () => {});
            }
            this[ONERROR](er, entry);
            fullyDone();
            return;
          }
          if (--actions === 0) {
            if (stream.fd !== void 0) {
              node_fs_1.default.close(stream.fd, (er2) => {
                if (er2) {
                  this[ONERROR](er2, entry);
                } else {
                  this[UNPEND]();
                }
                fullyDone();
              });
            }
          }
        };
        stream.on('finish', () => {
          const abs = String(entry.absolute);
          const fd = stream.fd;
          if (typeof fd === 'number' && entry.mtime && !this.noMtime) {
            actions++;
            const atime = entry.atime || /* @__PURE__ */ new Date();
            const mtime = entry.mtime;
            node_fs_1.default.futimes(fd, atime, mtime, (er) =>
              er
                ? node_fs_1.default.utimes(abs, atime, mtime, (er2) =>
                    done(er2 && er)
                  )
                : done()
            );
          }
          if (typeof fd === 'number' && this[DOCHOWN](entry)) {
            actions++;
            const uid = this[UID](entry);
            const gid = this[GID](entry);
            if (typeof uid === 'number' && typeof gid === 'number') {
              node_fs_1.default.fchown(fd, uid, gid, (er) =>
                er
                  ? node_fs_1.default.chown(abs, uid, gid, (er2) =>
                      done(er2 && er)
                    )
                  : done()
              );
            }
          }
          done();
        });
        const tx = this.transform ? this.transform(entry) || entry : entry;
        if (tx !== entry) {
          tx.on('error', (er) => {
            this[ONERROR](er, entry);
            fullyDone();
          });
          entry.pipe(tx);
        }
        tx.pipe(stream);
      }
      [DIRECTORY](entry, fullyDone) {
        const mode =
          typeof entry.mode === 'number' ? entry.mode & 4095 : this.dmode;
        this[MKDIR](String(entry.absolute), mode, (er) => {
          if (er) {
            this[ONERROR](er, entry);
            fullyDone();
            return;
          }
          let actions = 1;
          const done = () => {
            if (--actions === 0) {
              fullyDone();
              this[UNPEND]();
              entry.resume();
            }
          };
          if (entry.mtime && !this.noMtime) {
            actions++;
            node_fs_1.default.utimes(
              String(entry.absolute),
              entry.atime || /* @__PURE__ */ new Date(),
              entry.mtime,
              done
            );
          }
          if (this[DOCHOWN](entry)) {
            actions++;
            node_fs_1.default.chown(
              String(entry.absolute),
              Number(this[UID](entry)),
              Number(this[GID](entry)),
              done
            );
          }
          done();
        });
      }
      [UNSUPPORTED](entry) {
        entry.unsupported = true;
        this.warn(
          'TAR_ENTRY_UNSUPPORTED',
          `unsupported entry type: ${entry.type}`,
          { entry }
        );
        entry.resume();
      }
      [SYMLINK](entry, done) {
        this[LINK](entry, String(entry.linkpath), 'symlink', done);
      }
      [HARDLINK](entry, done) {
        const linkpath = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
          node_path_1.default.resolve(this.cwd, String(entry.linkpath))
        );
        this[LINK](entry, linkpath, 'link', done);
      }
      [PEND]() {
        this[PENDING]++;
      }
      [UNPEND]() {
        this[PENDING]--;
        this[MAYBECLOSE]();
      }
      [SKIP](entry) {
        this[UNPEND]();
        entry.resume();
      }
      // Check if we can reuse an existing filesystem entry safely and
      // overwrite it, rather than unlinking and recreating
      // Windows doesn't report a useful nlink, so we just never reuse entries
      [ISREUSABLE](entry, st) {
        return (
          entry.type === 'File' &&
          !this.unlink &&
          st.isFile() &&
          st.nlink <= 1 &&
          !isWindows
        );
      }
      // check if a thing is there, and if so, try to clobber it
      [CHECKFS](entry) {
        this[PEND]();
        const paths = [entry.path];
        if (entry.linkpath) {
          paths.push(entry.linkpath);
        }
        this.reservations.reserve(paths, (done) => this[CHECKFS2](entry, done));
      }
      [PRUNECACHE](entry) {
        if (entry.type === 'SymbolicLink') {
          dropCache(this.dirCache);
        } else if (entry.type !== 'Directory') {
          pruneCache(this.dirCache, String(entry.absolute));
        }
      }
      [CHECKFS2](entry, fullyDone) {
        this[PRUNECACHE](entry);
        const done = (er) => {
          this[PRUNECACHE](entry);
          fullyDone(er);
        };
        const checkCwd = () => {
          this[MKDIR](this.cwd, this.dmode, (er) => {
            if (er) {
              this[ONERROR](er, entry);
              done();
              return;
            }
            this[CHECKED_CWD] = true;
            start();
          });
        };
        const start = () => {
          if (entry.absolute !== this.cwd) {
            const parent = (0,
            normalize_windows_path_js_1.normalizeWindowsPath)(
              node_path_1.default.dirname(String(entry.absolute))
            );
            if (parent !== this.cwd) {
              return this[MKDIR](parent, this.dmode, (er) => {
                if (er) {
                  this[ONERROR](er, entry);
                  done();
                  return;
                }
                afterMakeParent();
              });
            }
          }
          afterMakeParent();
        };
        const afterMakeParent = () => {
          node_fs_1.default.lstat(String(entry.absolute), (lstatEr, st) => {
            var _a3;
            if (
              st &&
              (this.keep /* c8 ignore next */ ||
                (this.newer &&
                  st.mtime > ((_a3 = entry.mtime) != null ? _a3 : st.mtime)))
            ) {
              this[SKIP](entry);
              done();
              return;
            }
            if (lstatEr || this[ISREUSABLE](entry, st)) {
              return this[MAKEFS](null, entry, done);
            }
            if (st.isDirectory()) {
              if (entry.type === 'Directory') {
                const needChmod =
                  this.chmod && entry.mode && (st.mode & 4095) !== entry.mode;
                const afterChmod = (er) =>
                  this[MAKEFS](er != null ? er : null, entry, done);
                if (!needChmod) {
                  return afterChmod();
                }
                return node_fs_1.default.chmod(
                  String(entry.absolute),
                  Number(entry.mode),
                  afterChmod
                );
              }
              if (entry.absolute !== this.cwd) {
                return node_fs_1.default.rmdir(String(entry.absolute), (er) =>
                  this[MAKEFS](er != null ? er : null, entry, done)
                );
              }
            }
            if (entry.absolute === this.cwd) {
              return this[MAKEFS](null, entry, done);
            }
            unlinkFile(String(entry.absolute), (er) =>
              this[MAKEFS](er != null ? er : null, entry, done)
            );
          });
        };
        if (this[CHECKED_CWD]) {
          start();
        } else {
          checkCwd();
        }
      }
      [MAKEFS](er, entry, done) {
        if (er) {
          this[ONERROR](er, entry);
          done();
          return;
        }
        switch (entry.type) {
          case 'File':
          case 'OldFile':
          case 'ContiguousFile':
            return this[FILE](entry, done);
          case 'Link':
            return this[HARDLINK](entry, done);
          case 'SymbolicLink':
            return this[SYMLINK](entry, done);
          case 'Directory':
          case 'GNUDumpDir':
            return this[DIRECTORY](entry, done);
        }
      }
      [LINK](entry, linkpath, link, done) {
        node_fs_1.default[link](linkpath, String(entry.absolute), (er) => {
          if (er) {
            this[ONERROR](er, entry);
          } else {
            this[UNPEND]();
            entry.resume();
          }
          done();
        });
      }
    };
    exports2.Unpack = Unpack;
    var callSync = (fn) => {
      try {
        return [null, fn()];
      } catch (er) {
        return [er, null];
      }
    };
    var UnpackSync = class extends Unpack {
      constructor() {
        super(...arguments);
        __publicField(this, 'sync', true);
      }
      [MAKEFS](er, entry) {
        return super[MAKEFS](er, entry, () => {});
      }
      [CHECKFS](entry) {
        var _a3;
        this[PRUNECACHE](entry);
        if (!this[CHECKED_CWD]) {
          const er2 = this[MKDIR](this.cwd, this.dmode);
          if (er2) {
            return this[ONERROR](er2, entry);
          }
          this[CHECKED_CWD] = true;
        }
        if (entry.absolute !== this.cwd) {
          const parent = (0, normalize_windows_path_js_1.normalizeWindowsPath)(
            node_path_1.default.dirname(String(entry.absolute))
          );
          if (parent !== this.cwd) {
            const mkParent = this[MKDIR](parent, this.dmode);
            if (mkParent) {
              return this[ONERROR](mkParent, entry);
            }
          }
        }
        const [lstatEr, st] = callSync(() =>
          node_fs_1.default.lstatSync(String(entry.absolute))
        );
        if (
          st &&
          (this.keep /* c8 ignore next */ ||
            (this.newer &&
              st.mtime > ((_a3 = entry.mtime) != null ? _a3 : st.mtime)))
        ) {
          return this[SKIP](entry);
        }
        if (lstatEr || this[ISREUSABLE](entry, st)) {
          return this[MAKEFS](null, entry);
        }
        if (st.isDirectory()) {
          if (entry.type === 'Directory') {
            const needChmod =
              this.chmod && entry.mode && (st.mode & 4095) !== entry.mode;
            const [er3] = needChmod
              ? callSync(() => {
                  node_fs_1.default.chmodSync(
                    String(entry.absolute),
                    Number(entry.mode)
                  );
                })
              : [];
            return this[MAKEFS](er3, entry);
          }
          const [er2] = callSync(() =>
            node_fs_1.default.rmdirSync(String(entry.absolute))
          );
          this[MAKEFS](er2, entry);
        }
        const [er] =
          entry.absolute === this.cwd
            ? []
            : callSync(() => unlinkFileSync(String(entry.absolute)));
        this[MAKEFS](er, entry);
      }
      [FILE](entry, done) {
        const mode =
          typeof entry.mode === 'number' ? entry.mode & 4095 : this.fmode;
        const oner = (er) => {
          let closeError;
          try {
            node_fs_1.default.closeSync(fd);
          } catch (e) {
            closeError = e;
          }
          if (er || closeError) {
            this[ONERROR](er || closeError, entry);
          }
          done();
        };
        let fd;
        try {
          fd = node_fs_1.default.openSync(
            String(entry.absolute),
            (0, get_write_flag_js_1.getWriteFlag)(entry.size),
            mode
          );
        } catch (er) {
          return oner(er);
        }
        const tx = this.transform ? this.transform(entry) || entry : entry;
        if (tx !== entry) {
          tx.on('error', (er) => this[ONERROR](er, entry));
          entry.pipe(tx);
        }
        tx.on('data', (chunk) => {
          try {
            node_fs_1.default.writeSync(fd, chunk, 0, chunk.length);
          } catch (er) {
            oner(er);
          }
        });
        tx.on('end', () => {
          let er = null;
          if (entry.mtime && !this.noMtime) {
            const atime = entry.atime || /* @__PURE__ */ new Date();
            const mtime = entry.mtime;
            try {
              node_fs_1.default.futimesSync(fd, atime, mtime);
            } catch (futimeser) {
              try {
                node_fs_1.default.utimesSync(
                  String(entry.absolute),
                  atime,
                  mtime
                );
              } catch (utimeser) {
                er = futimeser;
              }
            }
          }
          if (this[DOCHOWN](entry)) {
            const uid = this[UID](entry);
            const gid = this[GID](entry);
            try {
              node_fs_1.default.fchownSync(fd, Number(uid), Number(gid));
            } catch (fchowner) {
              try {
                node_fs_1.default.chownSync(
                  String(entry.absolute),
                  Number(uid),
                  Number(gid)
                );
              } catch (chowner) {
                er = er || fchowner;
              }
            }
          }
          oner(er);
        });
      }
      [DIRECTORY](entry, done) {
        const mode =
          typeof entry.mode === 'number' ? entry.mode & 4095 : this.dmode;
        const er = this[MKDIR](String(entry.absolute), mode);
        if (er) {
          this[ONERROR](er, entry);
          done();
          return;
        }
        if (entry.mtime && !this.noMtime) {
          try {
            node_fs_1.default.utimesSync(
              String(entry.absolute),
              entry.atime || /* @__PURE__ */ new Date(),
              entry.mtime
            );
          } catch (er2) {}
        }
        if (this[DOCHOWN](entry)) {
          try {
            node_fs_1.default.chownSync(
              String(entry.absolute),
              Number(this[UID](entry)),
              Number(this[GID](entry))
            );
          } catch (er2) {}
        }
        done();
        entry.resume();
      }
      [MKDIR](dir, mode) {
        try {
          return (0, mkdir_js_1.mkdirSync)(
            (0, normalize_windows_path_js_1.normalizeWindowsPath)(dir),
            {
              uid: this.uid,
              gid: this.gid,
              processUid: this.processUid,
              processGid: this.processGid,
              umask: this.processUmask,
              preserve: this.preservePaths,
              unlink: this.unlink,
              cache: this.dirCache,
              cwd: this.cwd,
              mode,
            }
          );
        } catch (er) {
          return er;
        }
      }
      [LINK](entry, linkpath, link, done) {
        const ls = `${link}Sync`;
        try {
          node_fs_1.default[ls](linkpath, String(entry.absolute));
          done();
          entry.resume();
        } catch (er) {
          return this[ONERROR](er, entry);
        }
      }
    };
    exports2.UnpackSync = UnpackSync;
  },
});

// lib/node_modules/tar/dist/commonjs/extract.js
var require_lib_node_modules_tar_dist_commonjs_extract_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/extract.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (
              !desc ||
              ('get' in desc
                ? !m.__esModule
                : desc.writable || desc.configurable)
            ) {
              desc = {
                enumerable: true,
                get: function () {
                  return m[k];
                },
              };
            }
            Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.extract = void 0;
    var fsm = __importStar(
      require_lib_node_modules__isaacs_fs_minipass_dist_commonjs_index_js()
    );
    var node_fs_1 = __importDefault(require('fs'));
    var list_js_1 = require_lib_node_modules_tar_dist_commonjs_list_js();
    var make_command_js_1 =
      require_lib_node_modules_tar_dist_commonjs_make_command_js();
    var unpack_js_1 = require_lib_node_modules_tar_dist_commonjs_unpack_js();
    var extractFileSync = (opt) => {
      const u = new unpack_js_1.UnpackSync(opt);
      const file = opt.file;
      const stat = node_fs_1.default.statSync(file);
      const readSize = opt.maxReadSize || 16 * 1024 * 1024;
      const stream = new fsm.ReadStreamSync(file, {
        readSize,
        size: stat.size,
      });
      stream.pipe(u);
    };
    var extractFile = (opt, _) => {
      const u = new unpack_js_1.Unpack(opt);
      const readSize = opt.maxReadSize || 16 * 1024 * 1024;
      const file = opt.file;
      const p = new Promise((resolve, reject) => {
        u.on('error', reject);
        u.on('close', resolve);
        node_fs_1.default.stat(file, (er, stat) => {
          if (er) {
            reject(er);
          } else {
            const stream = new fsm.ReadStream(file, {
              readSize,
              size: stat.size,
            });
            stream.on('error', reject);
            stream.pipe(u);
          }
        });
      });
      return p;
    };
    exports2.extract = (0, make_command_js_1.makeCommand)(
      extractFileSync,
      extractFile,
      (opt) => new unpack_js_1.UnpackSync(opt),
      (opt) => new unpack_js_1.Unpack(opt),
      (opt, files) => {
        if (files == null ? void 0 : files.length)
          (0, list_js_1.filesFilter)(opt, files);
      }
    );
  },
});

// lib/node_modules/tar/dist/commonjs/replace.js
var require_lib_node_modules_tar_dist_commonjs_replace_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/replace.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.replace = void 0;
    var fs_minipass_1 =
      require_lib_node_modules__isaacs_fs_minipass_dist_commonjs_index_js();
    var node_fs_1 = __importDefault(require('fs'));
    var node_path_1 = __importDefault(require('path'));
    var header_js_1 = require_lib_node_modules_tar_dist_commonjs_header_js();
    var list_js_1 = require_lib_node_modules_tar_dist_commonjs_list_js();
    var make_command_js_1 =
      require_lib_node_modules_tar_dist_commonjs_make_command_js();
    var options_js_1 = require_lib_node_modules_tar_dist_commonjs_options_js();
    var pack_js_1 = require_lib_node_modules_tar_dist_commonjs_pack_js();
    var replaceSync = (opt, files) => {
      const p = new pack_js_1.PackSync(opt);
      let threw = true;
      let fd;
      let position;
      try {
        try {
          fd = node_fs_1.default.openSync(opt.file, 'r+');
        } catch (er) {
          if ((er == null ? void 0 : er.code) === 'ENOENT') {
            fd = node_fs_1.default.openSync(opt.file, 'w+');
          } else {
            throw er;
          }
        }
        const st = node_fs_1.default.fstatSync(fd);
        const headBuf = Buffer.alloc(512);
        POSITION: for (position = 0; position < st.size; position += 512) {
          for (let bufPos = 0, bytes = 0; bufPos < 512; bufPos += bytes) {
            bytes = node_fs_1.default.readSync(
              fd,
              headBuf,
              bufPos,
              headBuf.length - bufPos,
              position + bufPos
            );
            if (position === 0 && headBuf[0] === 31 && headBuf[1] === 139) {
              throw new Error('cannot append to compressed archives');
            }
            if (!bytes) {
              break POSITION;
            }
          }
          const h = new header_js_1.Header(headBuf);
          if (!h.cksumValid) {
            break;
          }
          const entryBlockSize = 512 * Math.ceil((h.size || 0) / 512);
          if (position + entryBlockSize + 512 > st.size) {
            break;
          }
          position += entryBlockSize;
          if (opt.mtimeCache && h.mtime) {
            opt.mtimeCache.set(String(h.path), h.mtime);
          }
        }
        threw = false;
        streamSync(opt, p, position, fd, files);
      } finally {
        if (threw) {
          try {
            node_fs_1.default.closeSync(fd);
          } catch (er) {}
        }
      }
    };
    var streamSync = (opt, p, position, fd, files) => {
      const stream = new fs_minipass_1.WriteStreamSync(opt.file, {
        fd,
        start: position,
      });
      p.pipe(stream);
      addFilesSync(p, files);
    };
    var replaceAsync = (opt, files) => {
      files = Array.from(files);
      const p = new pack_js_1.Pack(opt);
      const getPos = (fd, size, cb_) => {
        const cb = (er, pos) => {
          if (er) {
            node_fs_1.default.close(fd, (_) => cb_(er));
          } else {
            cb_(null, pos);
          }
        };
        let position = 0;
        if (size === 0) {
          return cb(null, 0);
        }
        let bufPos = 0;
        const headBuf = Buffer.alloc(512);
        const onread = (er, bytes) => {
          var _a2;
          if (er || typeof bytes === 'undefined') {
            return cb(er);
          }
          bufPos += bytes;
          if (bufPos < 512 && bytes) {
            return node_fs_1.default.read(
              fd,
              headBuf,
              bufPos,
              headBuf.length - bufPos,
              position + bufPos,
              onread
            );
          }
          if (position === 0 && headBuf[0] === 31 && headBuf[1] === 139) {
            return cb(new Error('cannot append to compressed archives'));
          }
          if (bufPos < 512) {
            return cb(null, position);
          }
          const h = new header_js_1.Header(headBuf);
          if (!h.cksumValid) {
            return cb(null, position);
          }
          const entryBlockSize =
            512 * Math.ceil(((_a2 = h.size) != null ? _a2 : 0) / 512);
          if (position + entryBlockSize + 512 > size) {
            return cb(null, position);
          }
          position += entryBlockSize + 512;
          if (position >= size) {
            return cb(null, position);
          }
          if (opt.mtimeCache && h.mtime) {
            opt.mtimeCache.set(String(h.path), h.mtime);
          }
          bufPos = 0;
          node_fs_1.default.read(fd, headBuf, 0, 512, position, onread);
        };
        node_fs_1.default.read(fd, headBuf, 0, 512, position, onread);
      };
      const promise = new Promise((resolve, reject) => {
        p.on('error', reject);
        let flag = 'r+';
        const onopen = (er, fd) => {
          if (er && er.code === 'ENOENT' && flag === 'r+') {
            flag = 'w+';
            return node_fs_1.default.open(opt.file, flag, onopen);
          }
          if (er || !fd) {
            return reject(er);
          }
          node_fs_1.default.fstat(fd, (er2, st) => {
            if (er2) {
              return node_fs_1.default.close(fd, () => reject(er2));
            }
            getPos(fd, st.size, (er3, position) => {
              if (er3) {
                return reject(er3);
              }
              const stream = new fs_minipass_1.WriteStream(opt.file, {
                fd,
                start: position,
              });
              p.pipe(stream);
              stream.on('error', reject);
              stream.on('close', resolve);
              addFilesAsync(p, files);
            });
          });
        };
        node_fs_1.default.open(opt.file, flag, onopen);
      });
      return promise;
    };
    var addFilesSync = (p, files) => {
      files.forEach((file) => {
        if (file.charAt(0) === '@') {
          (0, list_js_1.list)({
            file: node_path_1.default.resolve(p.cwd, file.slice(1)),
            sync: true,
            noResume: true,
            onReadEntry: (entry) => p.add(entry),
          });
        } else {
          p.add(file);
        }
      });
      p.end();
    };
    var addFilesAsync = async (p, files) => {
      for (let i = 0; i < files.length; i++) {
        const file = String(files[i]);
        if (file.charAt(0) === '@') {
          await (0, list_js_1.list)({
            file: node_path_1.default.resolve(String(p.cwd), file.slice(1)),
            noResume: true,
            onReadEntry: (entry) => p.add(entry),
          });
        } else {
          p.add(file);
        }
      }
      p.end();
    };
    exports2.replace = (0, make_command_js_1.makeCommand)(
      replaceSync,
      replaceAsync,
      /* c8 ignore start */
      () => {
        throw new TypeError('file is required');
      },
      () => {
        throw new TypeError('file is required');
      },
      /* c8 ignore stop */
      (opt, entries) => {
        if (!(0, options_js_1.isFile)(opt)) {
          throw new TypeError('file is required');
        }
        if (
          opt.gzip ||
          opt.brotli ||
          opt.file.endsWith('.br') ||
          opt.file.endsWith('.tbr')
        ) {
          throw new TypeError('cannot append to compressed archives');
        }
        if (!(entries == null ? void 0 : entries.length)) {
          throw new TypeError('no paths specified to add/replace');
        }
      }
    );
  },
});

// lib/node_modules/tar/dist/commonjs/update.js
var require_lib_node_modules_tar_dist_commonjs_update_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/update.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.update = void 0;
    var make_command_js_1 =
      require_lib_node_modules_tar_dist_commonjs_make_command_js();
    var replace_js_1 = require_lib_node_modules_tar_dist_commonjs_replace_js();
    exports2.update = (0, make_command_js_1.makeCommand)(
      replace_js_1.replace.syncFile,
      replace_js_1.replace.asyncFile,
      replace_js_1.replace.syncNoFile,
      replace_js_1.replace.asyncNoFile,
      (opt, entries = []) => {
        var _a2, _b;
        (_b = (_a2 = replace_js_1.replace).validate) == null
          ? void 0
          : _b.call(_a2, opt, entries);
        mtimeFilter(opt);
      }
    );
    var mtimeFilter = (opt) => {
      const filter = opt.filter;
      if (!opt.mtimeCache) {
        opt.mtimeCache = /* @__PURE__ */ new Map();
      }
      opt.filter = filter
        ? (path3, stat) => {
            var _a2, _b, _c, _d;
            return (
              filter(path3, stat) &&
              !(
                /* c8 ignore start */
                (
                  ((_c =
                    (_b =
                      (_a2 = opt.mtimeCache) == null
                        ? void 0
                        : _a2.get(path3)) != null
                      ? _b
                      : stat.mtime) != null
                    ? _c
                    : 0) > ((_d = stat.mtime) != null ? _d : 0)
                )
              )
            );
          }
        : (path3, stat) => {
            var _a2, _b, _c, _d;
            return !(
              /* c8 ignore start */
              (
                ((_c =
                  (_b =
                    (_a2 = opt.mtimeCache) == null ? void 0 : _a2.get(path3)) !=
                  null
                    ? _b
                    : stat.mtime) != null
                  ? _c
                  : 0) > ((_d = stat.mtime) != null ? _d : 0)
              )
            );
          };
    };
  },
});

// lib/node_modules/tar/dist/commonjs/index.js
var require_lib_node_modules_tar_dist_commonjs_index_js = __commonJS({
  'lib/node_modules/tar/dist/commonjs/index.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (
              !desc ||
              ('get' in desc
                ? !m.__esModule
                : desc.writable || desc.configurable)
            ) {
              desc = {
                enumerable: true,
                get: function () {
                  return m[k];
                },
              };
            }
            Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __exportStar =
      (exports2 && exports2.__exportStar) ||
      function (m, exports3) {
        for (var p in m)
          if (
            p !== 'default' &&
            !Object.prototype.hasOwnProperty.call(exports3, p)
          )
            __createBinding(exports3, m, p);
      };
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.u =
      exports2.types =
      exports2.r =
      exports2.t =
      exports2.x =
      exports2.c =
        void 0;
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_create_js(),
      exports2
    );
    var create_js_1 = require_lib_node_modules_tar_dist_commonjs_create_js();
    Object.defineProperty(exports2, 'c', {
      enumerable: true,
      get: function () {
        return create_js_1.create;
      },
    });
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_extract_js(),
      exports2
    );
    var extract_js_1 = require_lib_node_modules_tar_dist_commonjs_extract_js();
    Object.defineProperty(exports2, 'x', {
      enumerable: true,
      get: function () {
        return extract_js_1.extract;
      },
    });
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_header_js(),
      exports2
    );
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_list_js(),
      exports2
    );
    var list_js_1 = require_lib_node_modules_tar_dist_commonjs_list_js();
    Object.defineProperty(exports2, 't', {
      enumerable: true,
      get: function () {
        return list_js_1.list;
      },
    });
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_pack_js(),
      exports2
    );
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_parse_js(),
      exports2
    );
    __exportStar(require_lib_node_modules_tar_dist_commonjs_pax_js(), exports2);
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_read_entry_js(),
      exports2
    );
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_replace_js(),
      exports2
    );
    var replace_js_1 = require_lib_node_modules_tar_dist_commonjs_replace_js();
    Object.defineProperty(exports2, 'r', {
      enumerable: true,
      get: function () {
        return replace_js_1.replace;
      },
    });
    exports2.types = __importStar(
      require_lib_node_modules_tar_dist_commonjs_types_js()
    );
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_unpack_js(),
      exports2
    );
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_update_js(),
      exports2
    );
    var update_js_1 = require_lib_node_modules_tar_dist_commonjs_update_js();
    Object.defineProperty(exports2, 'u', {
      enumerable: true,
      get: function () {
        return update_js_1.update;
      },
    });
    __exportStar(
      require_lib_node_modules_tar_dist_commonjs_write_entry_js(),
      exports2
    );
  },
});

// lib/npm/node.ts
var node_exports = {};
__export(node_exports, {
  analyzeMetafile: () => analyzeMetafile,
  analyzeMetafileSync: () => analyzeMetafileSync,
  build: () => build,
  buildSync: () => buildSync,
  context: () => context,
  default: () => node_default,
  formatMessages: () => formatMessages,
  formatMessagesSync: () => formatMessagesSync,
  initialize: () => initialize,
  stop: () => stop,
  transform: () => transform,
  transformSync: () => transformSync,
  version: () => version,
});
module.exports = __toCommonJS(node_exports);

// lib/shared/stdio_protocol.ts
function encodePacket(packet) {
  let visit = (value) => {
    if (value === null) {
      bb.write8(0);
    } else if (typeof value === 'boolean') {
      bb.write8(1);
      bb.write8(+value);
    } else if (typeof value === 'number') {
      bb.write8(2);
      bb.write32(value | 0);
    } else if (typeof value === 'string') {
      bb.write8(3);
      bb.write(encodeUTF8(value));
    } else if (value instanceof Uint8Array) {
      bb.write8(4);
      bb.write(value);
    } else if (value instanceof Array) {
      bb.write8(5);
      bb.write32(value.length);
      for (let item of value) {
        visit(item);
      }
    } else {
      let keys = Object.keys(value);
      bb.write8(6);
      bb.write32(keys.length);
      for (let key of keys) {
        bb.write(encodeUTF8(key));
        visit(value[key]);
      }
    }
  };
  let bb = new ByteBuffer();
  bb.write32(0);
  bb.write32((packet.id << 1) | +!packet.isRequest);
  visit(packet.value);
  writeUInt32LE(bb.buf, bb.len - 4, 0);
  return bb.buf.subarray(0, bb.len);
}
function decodePacket(bytes) {
  let visit = () => {
    switch (bb.read8()) {
      case 0:
        return null;
      case 1:
        return !!bb.read8();
      case 2:
        return bb.read32();
      case 3:
        return decodeUTF8(bb.read());
      case 4:
        return bb.read();
      case 5: {
        let count = bb.read32();
        let value2 = [];
        for (let i = 0; i < count; i++) {
          value2.push(visit());
        }
        return value2;
      }
      case 6: {
        let count = bb.read32();
        let value2 = {};
        for (let i = 0; i < count; i++) {
          value2[decodeUTF8(bb.read())] = visit();
        }
        return value2;
      }
      default:
        throw new Error('Invalid packet');
    }
  };
  let bb = new ByteBuffer(bytes);
  let id = bb.read32();
  let isRequest = (id & 1) === 0;
  id >>>= 1;
  let value = visit();
  if (bb.ptr !== bytes.length) {
    throw new Error('Invalid packet');
  }
  return { id, isRequest, value };
}
var ByteBuffer = class {
  constructor(buf = new Uint8Array(1024)) {
    this.buf = buf;
    this.len = 0;
    this.ptr = 0;
  }
  _write(delta) {
    if (this.len + delta > this.buf.length) {
      let clone = new Uint8Array((this.len + delta) * 2);
      clone.set(this.buf);
      this.buf = clone;
    }
    this.len += delta;
    return this.len - delta;
  }
  write8(value) {
    let offset = this._write(1);
    this.buf[offset] = value;
  }
  write32(value) {
    let offset = this._write(4);
    writeUInt32LE(this.buf, value, offset);
  }
  write(bytes) {
    let offset = this._write(4 + bytes.length);
    writeUInt32LE(this.buf, bytes.length, offset);
    this.buf.set(bytes, offset + 4);
  }
  _read(delta) {
    if (this.ptr + delta > this.buf.length) {
      throw new Error('Invalid packet');
    }
    this.ptr += delta;
    return this.ptr - delta;
  }
  read8() {
    return this.buf[this._read(1)];
  }
  read32() {
    return readUInt32LE(this.buf, this._read(4));
  }
  read() {
    let length = this.read32();
    let bytes = new Uint8Array(length);
    let ptr = this._read(bytes.length);
    bytes.set(this.buf.subarray(ptr, ptr + length));
    return bytes;
  }
};
var encodeUTF8;
var decodeUTF8;
var encodeInvariant;
if (typeof TextEncoder !== 'undefined' && typeof TextDecoder !== 'undefined') {
  let encoder = new TextEncoder();
  let decoder = new TextDecoder();
  encodeUTF8 = (text) => encoder.encode(text);
  decodeUTF8 = (bytes) => decoder.decode(bytes);
  encodeInvariant = 'new TextEncoder().encode("")';
} else if (typeof Buffer !== 'undefined') {
  encodeUTF8 = (text) => Buffer.from(text);
  decodeUTF8 = (bytes) => {
    let { buffer, byteOffset, byteLength } = bytes;
    return Buffer.from(buffer, byteOffset, byteLength).toString();
  };
  encodeInvariant = 'Buffer.from("")';
} else {
  throw new Error('No UTF-8 codec found');
}
if (!(encodeUTF8('') instanceof Uint8Array))
  throw new Error(`Invariant violation: "${encodeInvariant} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);
function readUInt32LE(buffer, offset) {
  return (
    buffer[offset++] |
    (buffer[offset++] << 8) |
    (buffer[offset++] << 16) |
    (buffer[offset++] << 24)
  );
}
function writeUInt32LE(buffer, value, offset) {
  buffer[offset++] = value;
  buffer[offset++] = value >> 8;
  buffer[offset++] = value >> 16;
  buffer[offset++] = value >> 24;
}

// lib/shared/common.ts
var quote = JSON.stringify;
var buildLogLevelDefault = 'warning';
var transformLogLevelDefault = 'silent';
function validateTarget(target) {
  validateStringValue(target, 'target');
  if (target.indexOf(',') >= 0) throw new Error(`Invalid target: ${target}`);
  return target;
}
var canBeAnything = () => null;
var mustBeBoolean = (value) =>
  typeof value === 'boolean' ? null : 'a boolean';
var mustBeString = (value) => (typeof value === 'string' ? null : 'a string');
var mustBeRegExp = (value) =>
  value instanceof RegExp ? null : 'a RegExp object';
var mustBeInteger = (value) =>
  typeof value === 'number' && value === (value | 0) ? null : 'an integer';
var mustBeFunction = (value) =>
  typeof value === 'function' ? null : 'a function';
var mustBeArray = (value) => (Array.isArray(value) ? null : 'an array');
var mustBeObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? null
    : 'an object';
var mustBeEntryPoints = (value) =>
  typeof value === 'object' && value !== null ? null : 'an array or an object';
var mustBeWebAssemblyModule = (value) =>
  value instanceof WebAssembly.Module ? null : 'a WebAssembly.Module';
var mustBeObjectOrNull = (value) =>
  typeof value === 'object' && !Array.isArray(value)
    ? null
    : 'an object or null';
var mustBeStringOrBoolean = (value) =>
  typeof value === 'string' || typeof value === 'boolean'
    ? null
    : 'a string or a boolean';
var mustBeStringOrObject = (value) =>
  typeof value === 'string' ||
  (typeof value === 'object' && value !== null && !Array.isArray(value))
    ? null
    : 'a string or an object';
var mustBeStringOrArray = (value) =>
  typeof value === 'string' || Array.isArray(value)
    ? null
    : 'a string or an array';
var mustBeStringOrUint8Array = (value) =>
  typeof value === 'string' || value instanceof Uint8Array
    ? null
    : 'a string or a Uint8Array';
var mustBeStringOrURL = (value) =>
  typeof value === 'string' || value instanceof URL
    ? null
    : 'a string or a URL';
function getFlag(object, keys, key, mustBeFn) {
  let value = object[key];
  keys[key + ''] = true;
  if (value === void 0) return void 0;
  let mustBe = mustBeFn(value);
  if (mustBe !== null) throw new Error(`${quote(key)} must be ${mustBe}`);
  return value;
}
function checkForInvalidFlags(object, keys, where) {
  for (let key in object) {
    if (!(key in keys)) {
      throw new Error(`Invalid option ${where}: ${quote(key)}`);
    }
  }
}
function validateInitializeOptions(options) {
  let keys = /* @__PURE__ */ Object.create(null);
  let wasmURL = getFlag(options, keys, 'wasmURL', mustBeStringOrURL);
  let wasmModule = getFlag(
    options,
    keys,
    'wasmModule',
    mustBeWebAssemblyModule
  );
  let worker = getFlag(options, keys, 'worker', mustBeBoolean);
  checkForInvalidFlags(options, keys, 'in initialize() call');
  return {
    wasmURL,
    wasmModule,
    worker,
  };
}
function validateMangleCache(mangleCache) {
  let validated;
  if (mangleCache !== void 0) {
    validated = /* @__PURE__ */ Object.create(null);
    for (let key in mangleCache) {
      let value = mangleCache[key];
      if (typeof value === 'string' || value === false) {
        validated[key] = value;
      } else {
        throw new Error(
          `Expected ${quote(key)} in mangle cache to map to either a string or false`
        );
      }
    }
  }
  return validated;
}
function pushLogFlags(flags, options, keys, isTTY2, logLevelDefault) {
  let color = getFlag(options, keys, 'color', mustBeBoolean);
  let logLevel = getFlag(options, keys, 'logLevel', mustBeString);
  let logLimit = getFlag(options, keys, 'logLimit', mustBeInteger);
  if (color !== void 0) flags.push(`--color=${color}`);
  else if (isTTY2) flags.push(`--color=true`);
  flags.push(`--log-level=${logLevel || logLevelDefault}`);
  flags.push(`--log-limit=${logLimit || 0}`);
}
function validateStringValue(value, what, key) {
  if (typeof value !== 'string') {
    throw new Error(
      `Expected value for ${what}${key !== void 0 ? ' ' + quote(key) : ''} to be a string, got ${typeof value} instead`
    );
  }
  return value;
}
function pushCommonFlags(flags, options, keys) {
  let legalComments = getFlag(options, keys, 'legalComments', mustBeString);
  let sourceRoot = getFlag(options, keys, 'sourceRoot', mustBeString);
  let sourcesContent = getFlag(options, keys, 'sourcesContent', mustBeBoolean);
  let target = getFlag(options, keys, 'target', mustBeStringOrArray);
  let format = getFlag(options, keys, 'format', mustBeString);
  let globalName = getFlag(options, keys, 'globalName', mustBeString);
  let mangleProps = getFlag(options, keys, 'mangleProps', mustBeRegExp);
  let reserveProps = getFlag(options, keys, 'reserveProps', mustBeRegExp);
  let mangleQuoted = getFlag(options, keys, 'mangleQuoted', mustBeBoolean);
  let minify = getFlag(options, keys, 'minify', mustBeBoolean);
  let minifySyntax = getFlag(options, keys, 'minifySyntax', mustBeBoolean);
  let minifyWhitespace = getFlag(
    options,
    keys,
    'minifyWhitespace',
    mustBeBoolean
  );
  let minifyIdentifiers = getFlag(
    options,
    keys,
    'minifyIdentifiers',
    mustBeBoolean
  );
  let lineLimit = getFlag(options, keys, 'lineLimit', mustBeInteger);
  let drop = getFlag(options, keys, 'drop', mustBeArray);
  let dropLabels = getFlag(options, keys, 'dropLabels', mustBeArray);
  let charset = getFlag(options, keys, 'charset', mustBeString);
  let treeShaking = getFlag(options, keys, 'treeShaking', mustBeBoolean);
  let ignoreAnnotations = getFlag(
    options,
    keys,
    'ignoreAnnotations',
    mustBeBoolean
  );
  let jsx = getFlag(options, keys, 'jsx', mustBeString);
  let jsxFactory = getFlag(options, keys, 'jsxFactory', mustBeString);
  let jsxFragment = getFlag(options, keys, 'jsxFragment', mustBeString);
  let jsxImportSource = getFlag(options, keys, 'jsxImportSource', mustBeString);
  let jsxDev = getFlag(options, keys, 'jsxDev', mustBeBoolean);
  let jsxSideEffects = getFlag(options, keys, 'jsxSideEffects', mustBeBoolean);
  let define = getFlag(options, keys, 'define', mustBeObject);
  let logOverride = getFlag(options, keys, 'logOverride', mustBeObject);
  let supported = getFlag(options, keys, 'supported', mustBeObject);
  let pure = getFlag(options, keys, 'pure', mustBeArray);
  let keepNames = getFlag(options, keys, 'keepNames', mustBeBoolean);
  let platform = getFlag(options, keys, 'platform', mustBeString);
  let tsconfigRaw = getFlag(options, keys, 'tsconfigRaw', mustBeStringOrObject);
  if (legalComments) flags.push(`--legal-comments=${legalComments}`);
  if (sourceRoot !== void 0) flags.push(`--source-root=${sourceRoot}`);
  if (sourcesContent !== void 0)
    flags.push(`--sources-content=${sourcesContent}`);
  if (target) {
    if (Array.isArray(target))
      flags.push(
        `--target=${Array.from(target).map(validateTarget).join(',')}`
      );
    else flags.push(`--target=${validateTarget(target)}`);
  }
  if (format) flags.push(`--format=${format}`);
  if (globalName) flags.push(`--global-name=${globalName}`);
  if (platform) flags.push(`--platform=${platform}`);
  if (tsconfigRaw)
    flags.push(
      `--tsconfig-raw=${typeof tsconfigRaw === 'string' ? tsconfigRaw : JSON.stringify(tsconfigRaw)}`
    );
  if (minify) flags.push('--minify');
  if (minifySyntax) flags.push('--minify-syntax');
  if (minifyWhitespace) flags.push('--minify-whitespace');
  if (minifyIdentifiers) flags.push('--minify-identifiers');
  if (lineLimit) flags.push(`--line-limit=${lineLimit}`);
  if (charset) flags.push(`--charset=${charset}`);
  if (treeShaking !== void 0) flags.push(`--tree-shaking=${treeShaking}`);
  if (ignoreAnnotations) flags.push(`--ignore-annotations`);
  if (drop)
    for (let what of drop)
      flags.push(`--drop:${validateStringValue(what, 'drop')}`);
  if (dropLabels)
    flags.push(
      `--drop-labels=${Array.from(dropLabels)
        .map((what) => validateStringValue(what, 'dropLabels'))
        .join(',')}`
    );
  if (mangleProps) flags.push(`--mangle-props=${mangleProps.source}`);
  if (reserveProps) flags.push(`--reserve-props=${reserveProps.source}`);
  if (mangleQuoted !== void 0) flags.push(`--mangle-quoted=${mangleQuoted}`);
  if (jsx) flags.push(`--jsx=${jsx}`);
  if (jsxFactory) flags.push(`--jsx-factory=${jsxFactory}`);
  if (jsxFragment) flags.push(`--jsx-fragment=${jsxFragment}`);
  if (jsxImportSource) flags.push(`--jsx-import-source=${jsxImportSource}`);
  if (jsxDev) flags.push(`--jsx-dev`);
  if (jsxSideEffects) flags.push(`--jsx-side-effects`);
  if (define) {
    for (let key in define) {
      if (key.indexOf('=') >= 0) throw new Error(`Invalid define: ${key}`);
      flags.push(
        `--define:${key}=${validateStringValue(define[key], 'define', key)}`
      );
    }
  }
  if (logOverride) {
    for (let key in logOverride) {
      if (key.indexOf('=') >= 0)
        throw new Error(`Invalid log override: ${key}`);
      flags.push(
        `--log-override:${key}=${validateStringValue(logOverride[key], 'log override', key)}`
      );
    }
  }
  if (supported) {
    for (let key in supported) {
      if (key.indexOf('=') >= 0) throw new Error(`Invalid supported: ${key}`);
      const value = supported[key];
      if (typeof value !== 'boolean')
        throw new Error(
          `Expected value for supported ${quote(key)} to be a boolean, got ${typeof value} instead`
        );
      flags.push(`--supported:${key}=${value}`);
    }
  }
  if (pure)
    for (let fn of pure)
      flags.push(`--pure:${validateStringValue(fn, 'pure')}`);
  if (keepNames) flags.push(`--keep-names`);
}
function flagsForBuildOptions(
  callName,
  options,
  isTTY2,
  logLevelDefault,
  writeDefault
) {
  var _a2;
  let flags = [];
  let entries = [];
  let keys = /* @__PURE__ */ Object.create(null);
  let stdinContents = null;
  let stdinResolveDir = null;
  pushLogFlags(flags, options, keys, isTTY2, logLevelDefault);
  pushCommonFlags(flags, options, keys);
  let sourcemap = getFlag(options, keys, 'sourcemap', mustBeStringOrBoolean);
  let bundle = getFlag(options, keys, 'bundle', mustBeBoolean);
  let splitting = getFlag(options, keys, 'splitting', mustBeBoolean);
  let preserveSymlinks = getFlag(
    options,
    keys,
    'preserveSymlinks',
    mustBeBoolean
  );
  let metafile = getFlag(options, keys, 'metafile', mustBeBoolean);
  let outfile = getFlag(options, keys, 'outfile', mustBeString);
  let outdir = getFlag(options, keys, 'outdir', mustBeString);
  let outbase = getFlag(options, keys, 'outbase', mustBeString);
  let tsconfig = getFlag(options, keys, 'tsconfig', mustBeString);
  let resolveExtensions = getFlag(
    options,
    keys,
    'resolveExtensions',
    mustBeArray
  );
  let nodePathsInput = getFlag(options, keys, 'nodePaths', mustBeArray);
  let mainFields = getFlag(options, keys, 'mainFields', mustBeArray);
  let conditions = getFlag(options, keys, 'conditions', mustBeArray);
  let external = getFlag(options, keys, 'external', mustBeArray);
  let packages = getFlag(options, keys, 'packages', mustBeString);
  let alias = getFlag(options, keys, 'alias', mustBeObject);
  let loader = getFlag(options, keys, 'loader', mustBeObject);
  let outExtension = getFlag(options, keys, 'outExtension', mustBeObject);
  let publicPath = getFlag(options, keys, 'publicPath', mustBeString);
  let entryNames = getFlag(options, keys, 'entryNames', mustBeString);
  let chunkNames = getFlag(options, keys, 'chunkNames', mustBeString);
  let assetNames = getFlag(options, keys, 'assetNames', mustBeString);
  let inject = getFlag(options, keys, 'inject', mustBeArray);
  let banner = getFlag(options, keys, 'banner', mustBeObject);
  let footer = getFlag(options, keys, 'footer', mustBeObject);
  let entryPoints = getFlag(options, keys, 'entryPoints', mustBeEntryPoints);
  let absWorkingDir = getFlag(options, keys, 'absWorkingDir', mustBeString);
  let stdin = getFlag(options, keys, 'stdin', mustBeObject);
  let write =
    (_a2 = getFlag(options, keys, 'write', mustBeBoolean)) != null
      ? _a2
      : writeDefault;
  let allowOverwrite = getFlag(options, keys, 'allowOverwrite', mustBeBoolean);
  let mangleCache = getFlag(options, keys, 'mangleCache', mustBeObject);
  keys.plugins = true;
  checkForInvalidFlags(options, keys, `in ${callName}() call`);
  if (sourcemap)
    flags.push(`--sourcemap${sourcemap === true ? '' : `=${sourcemap}`}`);
  if (bundle) flags.push('--bundle');
  if (allowOverwrite) flags.push('--allow-overwrite');
  if (splitting) flags.push('--splitting');
  if (preserveSymlinks) flags.push('--preserve-symlinks');
  if (metafile) flags.push(`--metafile`);
  if (outfile) flags.push(`--outfile=${outfile}`);
  if (outdir) flags.push(`--outdir=${outdir}`);
  if (outbase) flags.push(`--outbase=${outbase}`);
  if (tsconfig) flags.push(`--tsconfig=${tsconfig}`);
  if (packages) flags.push(`--packages=${packages}`);
  if (resolveExtensions) {
    let values = [];
    for (let value of resolveExtensions) {
      validateStringValue(value, 'resolve extension');
      if (value.indexOf(',') >= 0)
        throw new Error(`Invalid resolve extension: ${value}`);
      values.push(value);
    }
    flags.push(`--resolve-extensions=${values.join(',')}`);
  }
  if (publicPath) flags.push(`--public-path=${publicPath}`);
  if (entryNames) flags.push(`--entry-names=${entryNames}`);
  if (chunkNames) flags.push(`--chunk-names=${chunkNames}`);
  if (assetNames) flags.push(`--asset-names=${assetNames}`);
  if (mainFields) {
    let values = [];
    for (let value of mainFields) {
      validateStringValue(value, 'main field');
      if (value.indexOf(',') >= 0)
        throw new Error(`Invalid main field: ${value}`);
      values.push(value);
    }
    flags.push(`--main-fields=${values.join(',')}`);
  }
  if (conditions) {
    let values = [];
    for (let value of conditions) {
      validateStringValue(value, 'condition');
      if (value.indexOf(',') >= 0)
        throw new Error(`Invalid condition: ${value}`);
      values.push(value);
    }
    flags.push(`--conditions=${values.join(',')}`);
  }
  if (external)
    for (let name of external)
      flags.push(`--external:${validateStringValue(name, 'external')}`);
  if (alias) {
    for (let old in alias) {
      if (old.indexOf('=') >= 0)
        throw new Error(`Invalid package name in alias: ${old}`);
      flags.push(
        `--alias:${old}=${validateStringValue(alias[old], 'alias', old)}`
      );
    }
  }
  if (banner) {
    for (let type in banner) {
      if (type.indexOf('=') >= 0)
        throw new Error(`Invalid banner file type: ${type}`);
      flags.push(
        `--banner:${type}=${validateStringValue(banner[type], 'banner', type)}`
      );
    }
  }
  if (footer) {
    for (let type in footer) {
      if (type.indexOf('=') >= 0)
        throw new Error(`Invalid footer file type: ${type}`);
      flags.push(
        `--footer:${type}=${validateStringValue(footer[type], 'footer', type)}`
      );
    }
  }
  if (inject)
    for (let path3 of inject)
      flags.push(`--inject:${validateStringValue(path3, 'inject')}`);
  if (loader) {
    for (let ext in loader) {
      if (ext.indexOf('=') >= 0)
        throw new Error(`Invalid loader extension: ${ext}`);
      flags.push(
        `--loader:${ext}=${validateStringValue(loader[ext], 'loader', ext)}`
      );
    }
  }
  if (outExtension) {
    for (let ext in outExtension) {
      if (ext.indexOf('=') >= 0)
        throw new Error(`Invalid out extension: ${ext}`);
      flags.push(
        `--out-extension:${ext}=${validateStringValue(outExtension[ext], 'out extension', ext)}`
      );
    }
  }
  if (entryPoints) {
    if (Array.isArray(entryPoints)) {
      for (let i = 0, n = entryPoints.length; i < n; i++) {
        let entryPoint = entryPoints[i];
        if (typeof entryPoint === 'object' && entryPoint !== null) {
          let entryPointKeys = /* @__PURE__ */ Object.create(null);
          let input = getFlag(entryPoint, entryPointKeys, 'in', mustBeString);
          let output = getFlag(entryPoint, entryPointKeys, 'out', mustBeString);
          checkForInvalidFlags(
            entryPoint,
            entryPointKeys,
            'in entry point at index ' + i
          );
          if (input === void 0)
            throw new Error(
              'Missing property "in" for entry point at index ' + i
            );
          if (output === void 0)
            throw new Error(
              'Missing property "out" for entry point at index ' + i
            );
          entries.push([output, input]);
        } else {
          entries.push([
            '',
            validateStringValue(entryPoint, 'entry point at index ' + i),
          ]);
        }
      }
    } else {
      for (let key in entryPoints) {
        entries.push([
          key,
          validateStringValue(entryPoints[key], 'entry point', key),
        ]);
      }
    }
  }
  if (stdin) {
    let stdinKeys = /* @__PURE__ */ Object.create(null);
    let contents = getFlag(
      stdin,
      stdinKeys,
      'contents',
      mustBeStringOrUint8Array
    );
    let resolveDir = getFlag(stdin, stdinKeys, 'resolveDir', mustBeString);
    let sourcefile = getFlag(stdin, stdinKeys, 'sourcefile', mustBeString);
    let loader2 = getFlag(stdin, stdinKeys, 'loader', mustBeString);
    checkForInvalidFlags(stdin, stdinKeys, 'in "stdin" object');
    if (sourcefile) flags.push(`--sourcefile=${sourcefile}`);
    if (loader2) flags.push(`--loader=${loader2}`);
    if (resolveDir) stdinResolveDir = resolveDir;
    if (typeof contents === 'string') stdinContents = encodeUTF8(contents);
    else if (contents instanceof Uint8Array) stdinContents = contents;
  }
  let nodePaths = [];
  if (nodePathsInput) {
    for (let value of nodePathsInput) {
      value += '';
      nodePaths.push(value);
    }
  }
  return {
    entries,
    flags,
    write,
    stdinContents,
    stdinResolveDir,
    absWorkingDir,
    nodePaths,
    mangleCache: validateMangleCache(mangleCache),
  };
}
function flagsForTransformOptions(callName, options, isTTY2, logLevelDefault) {
  let flags = [];
  let keys = /* @__PURE__ */ Object.create(null);
  pushLogFlags(flags, options, keys, isTTY2, logLevelDefault);
  pushCommonFlags(flags, options, keys);
  let sourcemap = getFlag(options, keys, 'sourcemap', mustBeStringOrBoolean);
  let sourcefile = getFlag(options, keys, 'sourcefile', mustBeString);
  let loader = getFlag(options, keys, 'loader', mustBeString);
  let banner = getFlag(options, keys, 'banner', mustBeString);
  let footer = getFlag(options, keys, 'footer', mustBeString);
  let mangleCache = getFlag(options, keys, 'mangleCache', mustBeObject);
  checkForInvalidFlags(options, keys, `in ${callName}() call`);
  if (sourcemap)
    flags.push(`--sourcemap=${sourcemap === true ? 'external' : sourcemap}`);
  if (sourcefile) flags.push(`--sourcefile=${sourcefile}`);
  if (loader) flags.push(`--loader=${loader}`);
  if (banner) flags.push(`--banner=${banner}`);
  if (footer) flags.push(`--footer=${footer}`);
  return {
    flags,
    mangleCache: validateMangleCache(mangleCache),
  };
}
function createChannel(streamIn) {
  const requestCallbacksByKey = {};
  const closeData = { didClose: false, reason: '' };
  let responseCallbacks = {};
  let nextRequestID = 0;
  let nextBuildKey = 0;
  let stdout = new Uint8Array(16 * 1024);
  let stdoutUsed = 0;
  let readFromStdout = (chunk) => {
    let limit = stdoutUsed + chunk.length;
    if (limit > stdout.length) {
      let swap = new Uint8Array(limit * 2);
      swap.set(stdout);
      stdout = swap;
    }
    stdout.set(chunk, stdoutUsed);
    stdoutUsed += chunk.length;
    let offset = 0;
    while (offset + 4 <= stdoutUsed) {
      let length = readUInt32LE(stdout, offset);
      if (offset + 4 + length > stdoutUsed) {
        break;
      }
      offset += 4;
      handleIncomingPacket(stdout.subarray(offset, offset + length));
      offset += length;
    }
    if (offset > 0) {
      stdout.copyWithin(0, offset, stdoutUsed);
      stdoutUsed -= offset;
    }
  };
  let afterClose = (error) => {
    closeData.didClose = true;
    if (error) closeData.reason = ': ' + (error.message || error);
    const text = 'The service was stopped' + closeData.reason;
    for (let id in responseCallbacks) {
      responseCallbacks[id](text, null);
    }
    responseCallbacks = {};
  };
  let sendRequest = (refs, value, callback) => {
    if (closeData.didClose)
      return callback(
        'The service is no longer running' + closeData.reason,
        null
      );
    let id = nextRequestID++;
    responseCallbacks[id] = (error, response) => {
      try {
        callback(error, response);
      } finally {
        if (refs) refs.unref();
      }
    };
    if (refs) refs.ref();
    streamIn.writeToStdin(encodePacket({ id, isRequest: true, value }));
  };
  let sendResponse = (id, value) => {
    if (closeData.didClose)
      throw new Error('The service is no longer running' + closeData.reason);
    streamIn.writeToStdin(encodePacket({ id, isRequest: false, value }));
  };
  let handleRequest = async (id, request) => {
    try {
      if (request.command === 'ping') {
        sendResponse(id, {});
        return;
      }
      if (typeof request.key === 'number') {
        const requestCallbacks = requestCallbacksByKey[request.key];
        if (!requestCallbacks) {
          return;
        }
        const callback = requestCallbacks[request.command];
        if (callback) {
          await callback(id, request);
          return;
        }
      }
      throw new Error(`Invalid command: ` + request.command);
    } catch (e) {
      const errors = [extractErrorMessageV8(e, streamIn, null, void 0, '')];
      try {
        sendResponse(id, { errors });
      } catch {}
    }
  };
  let isFirstPacket = true;
  let handleIncomingPacket = (bytes) => {
    if (isFirstPacket) {
      isFirstPacket = false;
      let binaryVersion = String.fromCharCode(...bytes);
      if (binaryVersion !== '0.24.2') {
        throw new Error(
          `Cannot start service: Host version "${'0.24.2'}" does not match binary version ${quote(binaryVersion)}`
        );
      }
      return;
    }
    let packet = decodePacket(bytes);
    if (packet.isRequest) {
      handleRequest(packet.id, packet.value);
    } else {
      let callback = responseCallbacks[packet.id];
      delete responseCallbacks[packet.id];
      if (packet.value.error) callback(packet.value.error, {});
      else callback(null, packet.value);
    }
  };
  let buildOrContext = ({
    callName,
    refs,
    options,
    isTTY: isTTY2,
    defaultWD: defaultWD2,
    callback,
  }) => {
    let refCount = 0;
    const buildKey = nextBuildKey++;
    const requestCallbacks = {};
    const buildRefs = {
      ref() {
        if (++refCount === 1) {
          if (refs) refs.ref();
        }
      },
      unref() {
        if (--refCount === 0) {
          delete requestCallbacksByKey[buildKey];
          if (refs) refs.unref();
        }
      },
    };
    requestCallbacksByKey[buildKey] = requestCallbacks;
    buildRefs.ref();
    buildOrContextImpl(
      callName,
      buildKey,
      sendRequest,
      sendResponse,
      buildRefs,
      streamIn,
      requestCallbacks,
      options,
      isTTY2,
      defaultWD2,
      (err, res) => {
        try {
          callback(err, res);
        } finally {
          buildRefs.unref();
        }
      }
    );
  };
  let transform2 = ({
    callName,
    refs,
    input,
    options,
    isTTY: isTTY2,
    fs: fs3,
    callback,
  }) => {
    const details = createObjectStash();
    let start = (inputPath) => {
      try {
        if (typeof input !== 'string' && !(input instanceof Uint8Array))
          throw new Error(
            'The input to "transform" must be a string or a Uint8Array'
          );
        let { flags, mangleCache } = flagsForTransformOptions(
          callName,
          options,
          isTTY2,
          transformLogLevelDefault
        );
        let request = {
          command: 'transform',
          flags,
          inputFS: inputPath !== null,
          input:
            inputPath !== null
              ? encodeUTF8(inputPath)
              : typeof input === 'string'
                ? encodeUTF8(input)
                : input,
        };
        if (mangleCache) request.mangleCache = mangleCache;
        sendRequest(refs, request, (error, response) => {
          if (error) return callback(new Error(error), null);
          let errors = replaceDetailsInMessages(response.errors, details);
          let warnings = replaceDetailsInMessages(response.warnings, details);
          let outstanding = 1;
          let next = () => {
            if (--outstanding === 0) {
              let result = {
                warnings,
                code: response.code,
                map: response.map,
                mangleCache: void 0,
                legalComments: void 0,
              };
              if ('legalComments' in response)
                result.legalComments =
                  response == null ? void 0 : response.legalComments;
              if (response.mangleCache)
                result.mangleCache =
                  response == null ? void 0 : response.mangleCache;
              callback(null, result);
            }
          };
          if (errors.length > 0)
            return callback(
              failureErrorWithLog('Transform failed', errors, warnings),
              null
            );
          if (response.codeFS) {
            outstanding++;
            fs3.readFile(response.code, (err, contents) => {
              if (err !== null) {
                callback(err, null);
              } else {
                response.code = contents;
                next();
              }
            });
          }
          if (response.mapFS) {
            outstanding++;
            fs3.readFile(response.map, (err, contents) => {
              if (err !== null) {
                callback(err, null);
              } else {
                response.map = contents;
                next();
              }
            });
          }
          next();
        });
      } catch (e) {
        let flags = [];
        try {
          pushLogFlags(flags, options, {}, isTTY2, transformLogLevelDefault);
        } catch {}
        const error = extractErrorMessageV8(e, streamIn, details, void 0, '');
        sendRequest(refs, { command: 'error', flags, error }, () => {
          error.detail = details.load(error.detail);
          callback(failureErrorWithLog('Transform failed', [error], []), null);
        });
      }
    };
    if (
      (typeof input === 'string' || input instanceof Uint8Array) &&
      input.length > 1024 * 1024
    ) {
      let next = start;
      start = () => fs3.writeFile(input, next);
    }
    start(null);
  };
  let formatMessages2 = ({ callName, refs, messages, options, callback }) => {
    if (!options)
      throw new Error(`Missing second argument in ${callName}() call`);
    let keys = {};
    let kind = getFlag(options, keys, 'kind', mustBeString);
    let color = getFlag(options, keys, 'color', mustBeBoolean);
    let terminalWidth = getFlag(options, keys, 'terminalWidth', mustBeInteger);
    checkForInvalidFlags(options, keys, `in ${callName}() call`);
    if (kind === void 0)
      throw new Error(`Missing "kind" in ${callName}() call`);
    if (kind !== 'error' && kind !== 'warning')
      throw new Error(
        `Expected "kind" to be "error" or "warning" in ${callName}() call`
      );
    let request = {
      command: 'format-msgs',
      messages: sanitizeMessages(messages, 'messages', null, '', terminalWidth),
      isWarning: kind === 'warning',
    };
    if (color !== void 0) request.color = color;
    if (terminalWidth !== void 0) request.terminalWidth = terminalWidth;
    sendRequest(refs, request, (error, response) => {
      if (error) return callback(new Error(error), null);
      callback(null, response.messages);
    });
  };
  let analyzeMetafile2 = ({ callName, refs, metafile, options, callback }) => {
    if (options === void 0) options = {};
    let keys = {};
    let color = getFlag(options, keys, 'color', mustBeBoolean);
    let verbose = getFlag(options, keys, 'verbose', mustBeBoolean);
    checkForInvalidFlags(options, keys, `in ${callName}() call`);
    let request = {
      command: 'analyze-metafile',
      metafile,
    };
    if (color !== void 0) request.color = color;
    if (verbose !== void 0) request.verbose = verbose;
    sendRequest(refs, request, (error, response) => {
      if (error) return callback(new Error(error), null);
      callback(null, response.result);
    });
  };
  return {
    readFromStdout,
    afterClose,
    service: {
      buildOrContext,
      transform: transform2,
      formatMessages: formatMessages2,
      analyzeMetafile: analyzeMetafile2,
    },
  };
}
function buildOrContextImpl(
  callName,
  buildKey,
  sendRequest,
  sendResponse,
  refs,
  streamIn,
  requestCallbacks,
  options,
  isTTY2,
  defaultWD2,
  callback
) {
  const details = createObjectStash();
  const isContext = callName === 'context';
  const handleError = (e, pluginName) => {
    const flags = [];
    try {
      pushLogFlags(flags, options, {}, isTTY2, buildLogLevelDefault);
    } catch {}
    const message = extractErrorMessageV8(
      e,
      streamIn,
      details,
      void 0,
      pluginName
    );
    sendRequest(refs, { command: 'error', flags, error: message }, () => {
      message.detail = details.load(message.detail);
      callback(
        failureErrorWithLog(
          isContext ? 'Context failed' : 'Build failed',
          [message],
          []
        ),
        null
      );
    });
  };
  let plugins;
  if (typeof options === 'object') {
    const value = options.plugins;
    if (value !== void 0) {
      if (!Array.isArray(value))
        return handleError(new Error(`"plugins" must be an array`), '');
      plugins = value;
    }
  }
  if (plugins && plugins.length > 0) {
    if (streamIn.isSync)
      return handleError(
        new Error('Cannot use plugins in synchronous API calls'),
        ''
      );
    handlePlugins(
      buildKey,
      sendRequest,
      sendResponse,
      refs,
      streamIn,
      requestCallbacks,
      options,
      plugins,
      details
    ).then(
      (result) => {
        if (!result.ok) return handleError(result.error, result.pluginName);
        try {
          buildOrContextContinue(
            result.requestPlugins,
            result.runOnEndCallbacks,
            result.scheduleOnDisposeCallbacks
          );
        } catch (e) {
          handleError(e, '');
        }
      },
      (e) => handleError(e, '')
    );
    return;
  }
  try {
    buildOrContextContinue(
      null,
      (result, done) => done([], []),
      () => {}
    );
  } catch (e) {
    handleError(e, '');
  }
  function buildOrContextContinue(
    requestPlugins,
    runOnEndCallbacks,
    scheduleOnDisposeCallbacks
  ) {
    const writeDefault = streamIn.hasFS;
    const {
      entries,
      flags,
      write,
      stdinContents,
      stdinResolveDir,
      absWorkingDir,
      nodePaths,
      mangleCache,
    } = flagsForBuildOptions(
      callName,
      options,
      isTTY2,
      buildLogLevelDefault,
      writeDefault
    );
    if (write && !streamIn.hasFS)
      throw new Error(`The "write" option is unavailable in this environment`);
    const request = {
      command: 'build',
      key: buildKey,
      entries,
      flags,
      write,
      stdinContents,
      stdinResolveDir,
      absWorkingDir: absWorkingDir || defaultWD2,
      nodePaths,
      context: isContext,
    };
    if (requestPlugins) request.plugins = requestPlugins;
    if (mangleCache) request.mangleCache = mangleCache;
    const buildResponseToResult = (response, callback2) => {
      const result = {
        errors: replaceDetailsInMessages(response.errors, details),
        warnings: replaceDetailsInMessages(response.warnings, details),
        outputFiles: void 0,
        metafile: void 0,
        mangleCache: void 0,
      };
      const originalErrors = result.errors.slice();
      const originalWarnings = result.warnings.slice();
      if (response.outputFiles)
        result.outputFiles = response.outputFiles.map(convertOutputFiles);
      if (response.metafile) result.metafile = JSON.parse(response.metafile);
      if (response.mangleCache) result.mangleCache = response.mangleCache;
      if (response.writeToStdout !== void 0)
        console.log(decodeUTF8(response.writeToStdout).replace(/\n$/, ''));
      runOnEndCallbacks(result, (onEndErrors, onEndWarnings) => {
        if (originalErrors.length > 0 || onEndErrors.length > 0) {
          const error = failureErrorWithLog(
            'Build failed',
            originalErrors.concat(onEndErrors),
            originalWarnings.concat(onEndWarnings)
          );
          return callback2(error, null, onEndErrors, onEndWarnings);
        }
        callback2(null, result, onEndErrors, onEndWarnings);
      });
    };
    let latestResultPromise;
    let provideLatestResult;
    if (isContext)
      requestCallbacks['on-end'] = (id, request2) =>
        new Promise((resolve) => {
          buildResponseToResult(
            request2,
            (err, result, onEndErrors, onEndWarnings) => {
              const response = {
                errors: onEndErrors,
                warnings: onEndWarnings,
              };
              if (provideLatestResult) provideLatestResult(err, result);
              latestResultPromise = void 0;
              provideLatestResult = void 0;
              sendResponse(id, response);
              resolve();
            }
          );
        });
    sendRequest(refs, request, (error, response) => {
      if (error) return callback(new Error(error), null);
      if (!isContext) {
        return buildResponseToResult(response, (err, res) => {
          scheduleOnDisposeCallbacks();
          return callback(err, res);
        });
      }
      if (response.errors.length > 0) {
        return callback(
          failureErrorWithLog(
            'Context failed',
            response.errors,
            response.warnings
          ),
          null
        );
      }
      let didDispose = false;
      const result = {
        rebuild: () => {
          if (!latestResultPromise)
            latestResultPromise = new Promise((resolve, reject) => {
              let settlePromise;
              provideLatestResult = (err, result2) => {
                if (!settlePromise)
                  settlePromise = () => (err ? reject(err) : resolve(result2));
              };
              const triggerAnotherBuild = () => {
                const request2 = {
                  command: 'rebuild',
                  key: buildKey,
                };
                sendRequest(refs, request2, (error2, response2) => {
                  if (error2) {
                    reject(new Error(error2));
                  } else if (settlePromise) {
                    settlePromise();
                  } else {
                    triggerAnotherBuild();
                  }
                });
              };
              triggerAnotherBuild();
            });
          return latestResultPromise;
        },
        watch: (options2 = {}) =>
          new Promise((resolve, reject) => {
            if (!streamIn.hasFS)
              throw new Error(`Cannot use the "watch" API in this environment`);
            const keys = {};
            checkForInvalidFlags(options2, keys, `in watch() call`);
            const request2 = {
              command: 'watch',
              key: buildKey,
            };
            sendRequest(refs, request2, (error2) => {
              if (error2) reject(new Error(error2));
              else resolve(void 0);
            });
          }),
        serve: (options2 = {}) =>
          new Promise((resolve, reject) => {
            if (!streamIn.hasFS)
              throw new Error(`Cannot use the "serve" API in this environment`);
            const keys = {};
            const port = getFlag(options2, keys, 'port', mustBeInteger);
            const host = getFlag(options2, keys, 'host', mustBeString);
            const servedir = getFlag(options2, keys, 'servedir', mustBeString);
            const keyfile = getFlag(options2, keys, 'keyfile', mustBeString);
            const certfile = getFlag(options2, keys, 'certfile', mustBeString);
            const fallback = getFlag(options2, keys, 'fallback', mustBeString);
            const onRequest = getFlag(
              options2,
              keys,
              'onRequest',
              mustBeFunction
            );
            checkForInvalidFlags(options2, keys, `in serve() call`);
            const request2 = {
              command: 'serve',
              key: buildKey,
              onRequest: !!onRequest,
            };
            if (port !== void 0) request2.port = port;
            if (host !== void 0) request2.host = host;
            if (servedir !== void 0) request2.servedir = servedir;
            if (keyfile !== void 0) request2.keyfile = keyfile;
            if (certfile !== void 0) request2.certfile = certfile;
            if (fallback !== void 0) request2.fallback = fallback;
            sendRequest(refs, request2, (error2, response2) => {
              if (error2) return reject(new Error(error2));
              if (onRequest) {
                requestCallbacks['serve-request'] = (id, request3) => {
                  onRequest(request3.args);
                  sendResponse(id, {});
                };
              }
              resolve(response2);
            });
          }),
        cancel: () =>
          new Promise((resolve) => {
            if (didDispose) return resolve();
            const request2 = {
              command: 'cancel',
              key: buildKey,
            };
            sendRequest(refs, request2, () => {
              resolve();
            });
          }),
        dispose: () =>
          new Promise((resolve) => {
            if (didDispose) return resolve();
            didDispose = true;
            const request2 = {
              command: 'dispose',
              key: buildKey,
            };
            sendRequest(refs, request2, () => {
              resolve();
              scheduleOnDisposeCallbacks();
              refs.unref();
            });
          }),
      };
      refs.ref();
      callback(null, result);
    });
  }
}
var handlePlugins = async (
  buildKey,
  sendRequest,
  sendResponse,
  refs,
  streamIn,
  requestCallbacks,
  initialOptions,
  plugins,
  details
) => {
  let onStartCallbacks = [];
  let onEndCallbacks = [];
  let onResolveCallbacks = {};
  let onLoadCallbacks = {};
  let onDisposeCallbacks = [];
  let nextCallbackID = 0;
  let i = 0;
  let requestPlugins = [];
  let isSetupDone = false;
  plugins = [...plugins];
  for (let item of plugins) {
    let keys = {};
    if (typeof item !== 'object')
      throw new Error(`Plugin at index ${i} must be an object`);
    const name = getFlag(item, keys, 'name', mustBeString);
    if (typeof name !== 'string' || name === '')
      throw new Error(`Plugin at index ${i} is missing a name`);
    try {
      let setup = getFlag(item, keys, 'setup', mustBeFunction);
      if (typeof setup !== 'function')
        throw new Error(`Plugin is missing a setup function`);
      checkForInvalidFlags(item, keys, `on plugin ${quote(name)}`);
      let plugin = {
        name,
        onStart: false,
        onEnd: false,
        onResolve: [],
        onLoad: [],
      };
      i++;
      let resolve = (path3, options = {}) => {
        if (!isSetupDone)
          throw new Error(
            'Cannot call "resolve" before plugin setup has completed'
          );
        if (typeof path3 !== 'string')
          throw new Error(`The path to resolve must be a string`);
        let keys2 = /* @__PURE__ */ Object.create(null);
        let pluginName = getFlag(options, keys2, 'pluginName', mustBeString);
        let importer = getFlag(options, keys2, 'importer', mustBeString);
        let namespace = getFlag(options, keys2, 'namespace', mustBeString);
        let resolveDir = getFlag(options, keys2, 'resolveDir', mustBeString);
        let kind = getFlag(options, keys2, 'kind', mustBeString);
        let pluginData = getFlag(options, keys2, 'pluginData', canBeAnything);
        let importAttributes = getFlag(options, keys2, 'with', mustBeObject);
        checkForInvalidFlags(options, keys2, 'in resolve() call');
        return new Promise((resolve2, reject) => {
          const request = {
            command: 'resolve',
            path: path3,
            key: buildKey,
            pluginName: name,
          };
          if (pluginName != null) request.pluginName = pluginName;
          if (importer != null) request.importer = importer;
          if (namespace != null) request.namespace = namespace;
          if (resolveDir != null) request.resolveDir = resolveDir;
          if (kind != null) request.kind = kind;
          else throw new Error(`Must specify "kind" when calling "resolve"`);
          if (pluginData != null)
            request.pluginData = details.store(pluginData);
          if (importAttributes != null)
            request.with = sanitizeStringMap(importAttributes, 'with');
          sendRequest(refs, request, (error, response) => {
            if (error !== null) reject(new Error(error));
            else
              resolve2({
                errors: replaceDetailsInMessages(response.errors, details),
                warnings: replaceDetailsInMessages(response.warnings, details),
                path: response.path,
                external: response.external,
                sideEffects: response.sideEffects,
                namespace: response.namespace,
                suffix: response.suffix,
                pluginData: details.load(response.pluginData),
              });
          });
        });
      };
      let promise = setup({
        initialOptions,
        resolve,
        onStart(callback) {
          let registeredText = `This error came from the "onStart" callback registered here:`;
          let registeredNote = extractCallerV8(
            new Error(registeredText),
            streamIn,
            'onStart'
          );
          onStartCallbacks.push({ name, callback, note: registeredNote });
          plugin.onStart = true;
        },
        onEnd(callback) {
          let registeredText = `This error came from the "onEnd" callback registered here:`;
          let registeredNote = extractCallerV8(
            new Error(registeredText),
            streamIn,
            'onEnd'
          );
          onEndCallbacks.push({ name, callback, note: registeredNote });
          plugin.onEnd = true;
        },
        onResolve(options, callback) {
          let registeredText = `This error came from the "onResolve" callback registered here:`;
          let registeredNote = extractCallerV8(
            new Error(registeredText),
            streamIn,
            'onResolve'
          );
          let keys2 = {};
          let filter = getFlag(options, keys2, 'filter', mustBeRegExp);
          let namespace = getFlag(options, keys2, 'namespace', mustBeString);
          checkForInvalidFlags(
            options,
            keys2,
            `in onResolve() call for plugin ${quote(name)}`
          );
          if (filter == null)
            throw new Error(`onResolve() call is missing a filter`);
          let id = nextCallbackID++;
          onResolveCallbacks[id] = { name, callback, note: registeredNote };
          plugin.onResolve.push({
            id,
            filter: filter.source,
            namespace: namespace || '',
          });
        },
        onLoad(options, callback) {
          let registeredText = `This error came from the "onLoad" callback registered here:`;
          let registeredNote = extractCallerV8(
            new Error(registeredText),
            streamIn,
            'onLoad'
          );
          let keys2 = {};
          let filter = getFlag(options, keys2, 'filter', mustBeRegExp);
          let namespace = getFlag(options, keys2, 'namespace', mustBeString);
          checkForInvalidFlags(
            options,
            keys2,
            `in onLoad() call for plugin ${quote(name)}`
          );
          if (filter == null)
            throw new Error(`onLoad() call is missing a filter`);
          let id = nextCallbackID++;
          onLoadCallbacks[id] = { name, callback, note: registeredNote };
          plugin.onLoad.push({
            id,
            filter: filter.source,
            namespace: namespace || '',
          });
        },
        onDispose(callback) {
          onDisposeCallbacks.push(callback);
        },
        esbuild: streamIn.esbuild,
      });
      if (promise) await promise;
      requestPlugins.push(plugin);
    } catch (e) {
      return { ok: false, error: e, pluginName: name };
    }
  }
  requestCallbacks['on-start'] = async (id, request) => {
    details.clear();
    let response = { errors: [], warnings: [] };
    await Promise.all(
      onStartCallbacks.map(async ({ name, callback, note }) => {
        try {
          let result = await callback();
          if (result != null) {
            if (typeof result !== 'object')
              throw new Error(
                `Expected onStart() callback in plugin ${quote(name)} to return an object`
              );
            let keys = {};
            let errors = getFlag(result, keys, 'errors', mustBeArray);
            let warnings = getFlag(result, keys, 'warnings', mustBeArray);
            checkForInvalidFlags(
              result,
              keys,
              `from onStart() callback in plugin ${quote(name)}`
            );
            if (errors != null)
              response.errors.push(
                ...sanitizeMessages(errors, 'errors', details, name, void 0)
              );
            if (warnings != null)
              response.warnings.push(
                ...sanitizeMessages(warnings, 'warnings', details, name, void 0)
              );
          }
        } catch (e) {
          response.errors.push(
            extractErrorMessageV8(e, streamIn, details, note && note(), name)
          );
        }
      })
    );
    sendResponse(id, response);
  };
  requestCallbacks['on-resolve'] = async (id, request) => {
    let response = {},
      name = '',
      callback,
      note;
    for (let id2 of request.ids) {
      try {
        ({ name, callback, note } = onResolveCallbacks[id2]);
        let result = await callback({
          path: request.path,
          importer: request.importer,
          namespace: request.namespace,
          resolveDir: request.resolveDir,
          kind: request.kind,
          pluginData: details.load(request.pluginData),
          with: request.with,
        });
        if (result != null) {
          if (typeof result !== 'object')
            throw new Error(
              `Expected onResolve() callback in plugin ${quote(name)} to return an object`
            );
          let keys = {};
          let pluginName = getFlag(result, keys, 'pluginName', mustBeString);
          let path3 = getFlag(result, keys, 'path', mustBeString);
          let namespace = getFlag(result, keys, 'namespace', mustBeString);
          let suffix = getFlag(result, keys, 'suffix', mustBeString);
          let external = getFlag(result, keys, 'external', mustBeBoolean);
          let sideEffects = getFlag(result, keys, 'sideEffects', mustBeBoolean);
          let pluginData = getFlag(result, keys, 'pluginData', canBeAnything);
          let errors = getFlag(result, keys, 'errors', mustBeArray);
          let warnings = getFlag(result, keys, 'warnings', mustBeArray);
          let watchFiles = getFlag(result, keys, 'watchFiles', mustBeArray);
          let watchDirs = getFlag(result, keys, 'watchDirs', mustBeArray);
          checkForInvalidFlags(
            result,
            keys,
            `from onResolve() callback in plugin ${quote(name)}`
          );
          response.id = id2;
          if (pluginName != null) response.pluginName = pluginName;
          if (path3 != null) response.path = path3;
          if (namespace != null) response.namespace = namespace;
          if (suffix != null) response.suffix = suffix;
          if (external != null) response.external = external;
          if (sideEffects != null) response.sideEffects = sideEffects;
          if (pluginData != null)
            response.pluginData = details.store(pluginData);
          if (errors != null)
            response.errors = sanitizeMessages(
              errors,
              'errors',
              details,
              name,
              void 0
            );
          if (warnings != null)
            response.warnings = sanitizeMessages(
              warnings,
              'warnings',
              details,
              name,
              void 0
            );
          if (watchFiles != null)
            response.watchFiles = sanitizeStringArray(watchFiles, 'watchFiles');
          if (watchDirs != null)
            response.watchDirs = sanitizeStringArray(watchDirs, 'watchDirs');
          break;
        }
      } catch (e) {
        response = {
          id: id2,
          errors: [
            extractErrorMessageV8(e, streamIn, details, note && note(), name),
          ],
        };
        break;
      }
    }
    sendResponse(id, response);
  };
  requestCallbacks['on-load'] = async (id, request) => {
    let response = {},
      name = '',
      callback,
      note;
    for (let id2 of request.ids) {
      try {
        ({ name, callback, note } = onLoadCallbacks[id2]);
        let result = await callback({
          path: request.path,
          namespace: request.namespace,
          suffix: request.suffix,
          pluginData: details.load(request.pluginData),
          with: request.with,
        });
        if (result != null) {
          if (typeof result !== 'object')
            throw new Error(
              `Expected onLoad() callback in plugin ${quote(name)} to return an object`
            );
          let keys = {};
          let pluginName = getFlag(result, keys, 'pluginName', mustBeString);
          let contents = getFlag(
            result,
            keys,
            'contents',
            mustBeStringOrUint8Array
          );
          let resolveDir = getFlag(result, keys, 'resolveDir', mustBeString);
          let pluginData = getFlag(result, keys, 'pluginData', canBeAnything);
          let loader = getFlag(result, keys, 'loader', mustBeString);
          let errors = getFlag(result, keys, 'errors', mustBeArray);
          let warnings = getFlag(result, keys, 'warnings', mustBeArray);
          let watchFiles = getFlag(result, keys, 'watchFiles', mustBeArray);
          let watchDirs = getFlag(result, keys, 'watchDirs', mustBeArray);
          checkForInvalidFlags(
            result,
            keys,
            `from onLoad() callback in plugin ${quote(name)}`
          );
          response.id = id2;
          if (pluginName != null) response.pluginName = pluginName;
          if (contents instanceof Uint8Array) response.contents = contents;
          else if (contents != null) response.contents = encodeUTF8(contents);
          if (resolveDir != null) response.resolveDir = resolveDir;
          if (pluginData != null)
            response.pluginData = details.store(pluginData);
          if (loader != null) response.loader = loader;
          if (errors != null)
            response.errors = sanitizeMessages(
              errors,
              'errors',
              details,
              name,
              void 0
            );
          if (warnings != null)
            response.warnings = sanitizeMessages(
              warnings,
              'warnings',
              details,
              name,
              void 0
            );
          if (watchFiles != null)
            response.watchFiles = sanitizeStringArray(watchFiles, 'watchFiles');
          if (watchDirs != null)
            response.watchDirs = sanitizeStringArray(watchDirs, 'watchDirs');
          break;
        }
      } catch (e) {
        response = {
          id: id2,
          errors: [
            extractErrorMessageV8(e, streamIn, details, note && note(), name),
          ],
        };
        break;
      }
    }
    sendResponse(id, response);
  };
  let runOnEndCallbacks = (result, done) => done([], []);
  if (onEndCallbacks.length > 0) {
    runOnEndCallbacks = (result, done) => {
      (async () => {
        const onEndErrors = [];
        const onEndWarnings = [];
        for (const { name, callback, note } of onEndCallbacks) {
          let newErrors;
          let newWarnings;
          try {
            const value = await callback(result);
            if (value != null) {
              if (typeof value !== 'object')
                throw new Error(
                  `Expected onEnd() callback in plugin ${quote(name)} to return an object`
                );
              let keys = {};
              let errors = getFlag(value, keys, 'errors', mustBeArray);
              let warnings = getFlag(value, keys, 'warnings', mustBeArray);
              checkForInvalidFlags(
                value,
                keys,
                `from onEnd() callback in plugin ${quote(name)}`
              );
              if (errors != null)
                newErrors = sanitizeMessages(
                  errors,
                  'errors',
                  details,
                  name,
                  void 0
                );
              if (warnings != null)
                newWarnings = sanitizeMessages(
                  warnings,
                  'warnings',
                  details,
                  name,
                  void 0
                );
            }
          } catch (e) {
            newErrors = [
              extractErrorMessageV8(e, streamIn, details, note && note(), name),
            ];
          }
          if (newErrors) {
            onEndErrors.push(...newErrors);
            try {
              result.errors.push(...newErrors);
            } catch {}
          }
          if (newWarnings) {
            onEndWarnings.push(...newWarnings);
            try {
              result.warnings.push(...newWarnings);
            } catch {}
          }
        }
        done(onEndErrors, onEndWarnings);
      })();
    };
  }
  let scheduleOnDisposeCallbacks = () => {
    for (const cb of onDisposeCallbacks) {
      setTimeout(() => cb(), 0);
    }
  };
  isSetupDone = true;
  return {
    ok: true,
    requestPlugins,
    runOnEndCallbacks,
    scheduleOnDisposeCallbacks,
  };
};
function createObjectStash() {
  const map = /* @__PURE__ */ new Map();
  let nextID = 0;
  return {
    clear() {
      map.clear();
    },
    load(id) {
      return map.get(id);
    },
    store(value) {
      if (value === void 0) return -1;
      const id = nextID++;
      map.set(id, value);
      return id;
    },
  };
}
function extractCallerV8(e, streamIn, ident) {
  let note;
  let tried = false;
  return () => {
    if (tried) return note;
    tried = true;
    try {
      let lines = (e.stack + '').split('\n');
      lines.splice(1, 1);
      let location = parseStackLinesV8(streamIn, lines, ident);
      if (location) {
        note = { text: e.message, location };
        return note;
      }
    } catch {}
  };
}
function extractErrorMessageV8(e, streamIn, stash, note, pluginName) {
  let text = 'Internal error';
  let location = null;
  try {
    text = ((e && e.message) || e) + '';
  } catch {}
  try {
    location = parseStackLinesV8(streamIn, (e.stack + '').split('\n'), '');
  } catch {}
  return {
    id: '',
    pluginName,
    text,
    location,
    notes: note ? [note] : [],
    detail: stash ? stash.store(e) : -1,
  };
}
function parseStackLinesV8(streamIn, lines, ident) {
  let at = '    at ';
  if (
    streamIn.readFileSync &&
    !lines[0].startsWith(at) &&
    lines[1].startsWith(at)
  ) {
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];
      if (!line.startsWith(at)) continue;
      line = line.slice(at.length);
      while (true) {
        let match = /^(?:new |async )?\S+ \((.*)\)$/.exec(line);
        if (match) {
          line = match[1];
          continue;
        }
        match = /^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(line);
        if (match) {
          line = match[1];
          continue;
        }
        match = /^(\S+):(\d+):(\d+)$/.exec(line);
        if (match) {
          let contents;
          try {
            contents = streamIn.readFileSync(match[1], 'utf8');
          } catch {
            break;
          }
          let lineText =
            contents.split(/\r\n|\r|\n|\u2028|\u2029/)[+match[2] - 1] || '';
          let column = +match[3] - 1;
          let length =
            lineText.slice(column, column + ident.length) === ident
              ? ident.length
              : 0;
          return {
            file: match[1],
            namespace: 'file',
            line: +match[2],
            column: encodeUTF8(lineText.slice(0, column)).length,
            length: encodeUTF8(lineText.slice(column, column + length)).length,
            lineText: lineText + '\n' + lines.slice(1).join('\n'),
            suggestion: '',
          };
        }
        break;
      }
    }
  }
  return null;
}
function failureErrorWithLog(text, errors, warnings) {
  let limit = 5;
  text +=
    errors.length < 1
      ? ''
      : ` with ${errors.length} error${errors.length < 2 ? '' : 's'}:` +
        errors
          .slice(0, limit + 1)
          .map((e, i) => {
            if (i === limit) return '\n...';
            if (!e.location)
              return `
error: ${e.text}`;
            let { file, line, column } = e.location;
            let pluginText = e.pluginName ? `[plugin: ${e.pluginName}] ` : '';
            return `
${file}:${line}:${column}: ERROR: ${pluginText}${e.text}`;
          })
          .join('');
  let error = new Error(text);
  for (const [key, value] of [
    ['errors', errors],
    ['warnings', warnings],
  ]) {
    Object.defineProperty(error, key, {
      configurable: true,
      enumerable: true,
      get: () => value,
      set: (value2) =>
        Object.defineProperty(error, key, {
          configurable: true,
          enumerable: true,
          value: value2,
        }),
    });
  }
  return error;
}
function replaceDetailsInMessages(messages, stash) {
  for (const message of messages) {
    message.detail = stash.load(message.detail);
  }
  return messages;
}
function sanitizeLocation(location, where, terminalWidth) {
  if (location == null) return null;
  let keys = {};
  let file = getFlag(location, keys, 'file', mustBeString);
  let namespace = getFlag(location, keys, 'namespace', mustBeString);
  let line = getFlag(location, keys, 'line', mustBeInteger);
  let column = getFlag(location, keys, 'column', mustBeInteger);
  let length = getFlag(location, keys, 'length', mustBeInteger);
  let lineText = getFlag(location, keys, 'lineText', mustBeString);
  let suggestion = getFlag(location, keys, 'suggestion', mustBeString);
  checkForInvalidFlags(location, keys, where);
  if (lineText) {
    const relevantASCII = lineText.slice(
      0,
      (column && column > 0 ? column : 0) +
        (length && length > 0 ? length : 0) +
        (terminalWidth && terminalWidth > 0 ? terminalWidth : 80)
    );
    if (!/[\x7F-\uFFFF]/.test(relevantASCII) && !/\n/.test(lineText)) {
      lineText = relevantASCII;
    }
  }
  return {
    file: file || '',
    namespace: namespace || '',
    line: line || 0,
    column: column || 0,
    length: length || 0,
    lineText: lineText || '',
    suggestion: suggestion || '',
  };
}
function sanitizeMessages(
  messages,
  property,
  stash,
  fallbackPluginName,
  terminalWidth
) {
  let messagesClone = [];
  let index = 0;
  for (const message of messages) {
    let keys = {};
    let id = getFlag(message, keys, 'id', mustBeString);
    let pluginName = getFlag(message, keys, 'pluginName', mustBeString);
    let text = getFlag(message, keys, 'text', mustBeString);
    let location = getFlag(message, keys, 'location', mustBeObjectOrNull);
    let notes = getFlag(message, keys, 'notes', mustBeArray);
    let detail = getFlag(message, keys, 'detail', canBeAnything);
    let where = `in element ${index} of "${property}"`;
    checkForInvalidFlags(message, keys, where);
    let notesClone = [];
    if (notes) {
      for (const note of notes) {
        let noteKeys = {};
        let noteText = getFlag(note, noteKeys, 'text', mustBeString);
        let noteLocation = getFlag(
          note,
          noteKeys,
          'location',
          mustBeObjectOrNull
        );
        checkForInvalidFlags(note, noteKeys, where);
        notesClone.push({
          text: noteText || '',
          location: sanitizeLocation(noteLocation, where, terminalWidth),
        });
      }
    }
    messagesClone.push({
      id: id || '',
      pluginName: pluginName || fallbackPluginName,
      text: text || '',
      location: sanitizeLocation(location, where, terminalWidth),
      notes: notesClone,
      detail: stash ? stash.store(detail) : -1,
    });
    index++;
  }
  return messagesClone;
}
function sanitizeStringArray(values, property) {
  const result = [];
  for (const value of values) {
    if (typeof value !== 'string')
      throw new Error(`${quote(property)} must be an array of strings`);
    result.push(value);
  }
  return result;
}
function sanitizeStringMap(map, property) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const key in map) {
    const value = map[key];
    if (typeof value !== 'string')
      throw new Error(
        `key ${quote(key)} in object ${quote(property)} must be a string`
      );
    result[key] = value;
  }
  return result;
}
function convertOutputFiles({ path: path3, contents, hash }) {
  let text = null;
  return {
    path: path3,
    contents,
    hash,
    get text() {
      const binary = this.contents;
      if (text === null || binary !== contents) {
        contents = binary;
        text = decodeUTF8(binary);
      }
      return text;
    },
  };
}

// lib/npm/node-platform.ts
var fs = require('fs');
var os = require('os');
var path = require('path');
var tar = require_lib_node_modules_tar_dist_commonjs_index_js();
var ESBUILD_BINARY_PATH =
  process.env.ESBUILD_BINARY_PATH || ESBUILD_BINARY_PATH;
var isValidBinaryPath = (x) => !!x && x !== '/usr/bin/esbuild';
var knownWindowsPackages = {
  'win32 arm64 LE': '@esbuild_custom/win32-arm64',
  'win32 x64 LE': '@esbuild_custom/win32-x64',
};
var knownUnixlikePackages = {
  'darwin arm64 LE': '@esbuild_custom/darwin-arm64',
  'darwin x64 LE': '@esbuild_custom/darwin-x64',
  'linux arm64 LE': '@esbuild_custom/linux-arm64',
  'linux x64 LE': '@esbuild_custom/linux-x64',
};
function pkgAndSubpathForCurrentPlatform() {
  let pkg;
  let subpath;
  let isWASM = false;
  let platformKey = `${process.platform} ${os.arch()} ${os.endianness()}`;
  if (platformKey in knownWindowsPackages) {
    pkg = knownWindowsPackages[platformKey];
    subpath = 'esbuild.exe';
  } else if (platformKey in knownUnixlikePackages) {
    pkg = knownUnixlikePackages[platformKey];
    subpath = 'bin/esbuild';
  } else {
    throw new Error(`Unsupported platform: ${platformKey}`);
  }
  return { pkg, subpath, isWASM };
}
function extractTgz(filePath, outputDir) {
  try {
    tar.x({
      file: filePath,
      cwd: outputDir,
      sync: true,
    });
    console.log(filePath, 'extracted');
  } catch (error) {
    console.error('failed to extract', error);
  }
}
function generateBinPath() {
  if (isValidBinaryPath(ESBUILD_BINARY_PATH)) {
    if (!fs.existsSync(ESBUILD_BINARY_PATH)) {
      console.warn(
        `[esbuild] Ignoring bad configuration: ESBUILD_BINARY_PATH=${ESBUILD_BINARY_PATH}`
      );
    } else {
      return { binPath: ESBUILD_BINARY_PATH, isWASM: false };
    }
  }
  const { pkg, subpath, isWASM } = pkgAndSubpathForCurrentPlatform();
  let binPath;
  try {
    binPath = require.resolve(path.join(__dirname, `../exec/bin/esbuild`));
  } catch (e) {
    const extractionPath = path.join(__dirname, `../exec`);
    if (!fs.existsSync(extractionPath)) {
      fs.mkdirSync(extractionPath, { recursive: true });
    }

    extractTgz(
      path.join(
        __dirname,
        `../prebuilt/${pkg.replace('@esbuild_custom/', '')}/esbuild.tgz`
      ),
      extractionPath
    );
    binPath = require.resolve(path.join(__dirname, `../exec/bin/esbuild`));
  }
  return { binPath, isWASM };
}

// lib/npm/node.ts
var child_process = require('child_process');
var crypto = require('crypto');
var path2 = require('path');
var fs2 = require('fs');
var os2 = require('os');
var tty = require('tty');
var worker_threads;
if (process.env.ESBUILD_WORKER_THREADS !== '0') {
  try {
    worker_threads = require('worker_threads');
  } catch {}
  let [major, minor] = process.versions.node.split('.');
  if (
    // <v12.17.0 does not work
    +major < 12 ||
    (+major === 12 && +minor < 17) ||
    (+major === 13 && +minor < 13)
  ) {
    worker_threads = void 0;
  }
}
var _a;
var isInternalWorkerThread =
  ((_a = worker_threads == null ? void 0 : worker_threads.workerData) == null
    ? void 0
    : _a.esbuildVersion) === '0.24.2';
var esbuildCommandAndArgs = () => {
  if (
    (!ESBUILD_BINARY_PATH || false) &&
    (path2.basename(__filename) !== 'main.js' ||
      path2.basename(__dirname) !== 'dist')
  ) {
    throw new Error(
      `The esbuild JavaScript API cannot be bundled. Please mark the "esbuild" package as external so it's not included in the bundle.

More information: The file containing the code for esbuild's JavaScript API (${__filename}) does not appear to be inside the esbuild package on the file system, which usually means that the esbuild package was bundled into another file. This is problematic because the API needs to run a binary executable inside the esbuild package which is located using a relative path from the API code to the executable. If the esbuild package is bundled, the relative path will be incorrect and the executable won't be found.`
    );
  }
  if (false) {
    return ['node', [path2.join(__dirname, '..', 'bin', 'esbuild')]];
  } else {
    const { binPath, isWASM } = generateBinPath();
    if (isWASM) {
      return ['node', [binPath]];
    } else {
      return [binPath, []];
    }
  }
};
var isTTY = () => tty.isatty(2);
var fsSync = {
  readFile(tempFile, callback) {
    try {
      let contents = fs2.readFileSync(tempFile, 'utf8');
      try {
        fs2.unlinkSync(tempFile);
      } catch {}
      callback(null, contents);
    } catch (err) {
      callback(err, null);
    }
  },
  writeFile(contents, callback) {
    try {
      let tempFile = randomFileName();
      fs2.writeFileSync(tempFile, contents);
      callback(tempFile);
    } catch {
      callback(null);
    }
  },
};
var fsAsync = {
  readFile(tempFile, callback) {
    try {
      fs2.readFile(tempFile, 'utf8', (err, contents) => {
        try {
          fs2.unlink(tempFile, () => callback(err, contents));
        } catch {
          callback(err, contents);
        }
      });
    } catch (err) {
      callback(err, null);
    }
  },
  writeFile(contents, callback) {
    try {
      let tempFile = randomFileName();
      fs2.writeFile(tempFile, contents, (err) =>
        err !== null ? callback(null) : callback(tempFile)
      );
    } catch {
      callback(null);
    }
  },
};
var version = '0.24.2';
var build = (options) => ensureServiceIsRunning().build(options);
var context = (buildOptions) => ensureServiceIsRunning().context(buildOptions);
var transform = (input, options) =>
  ensureServiceIsRunning().transform(input, options);
var formatMessages = (messages, options) =>
  ensureServiceIsRunning().formatMessages(messages, options);
var analyzeMetafile = (messages, options) =>
  ensureServiceIsRunning().analyzeMetafile(messages, options);
var buildSync = (options) => {
  if (worker_threads && !isInternalWorkerThread) {
    if (!workerThreadService)
      workerThreadService = startWorkerThreadService(worker_threads);
    return workerThreadService.buildSync(options);
  }
  let result;
  runServiceSync((service) =>
    service.buildOrContext({
      callName: 'buildSync',
      refs: null,
      options,
      isTTY: isTTY(),
      defaultWD,
      callback: (err, res) => {
        if (err) throw err;
        result = res;
      },
    })
  );
  return result;
};
var transformSync = (input, options) => {
  if (worker_threads && !isInternalWorkerThread) {
    if (!workerThreadService)
      workerThreadService = startWorkerThreadService(worker_threads);
    return workerThreadService.transformSync(input, options);
  }
  let result;
  runServiceSync((service) =>
    service.transform({
      callName: 'transformSync',
      refs: null,
      input,
      options: options || {},
      isTTY: isTTY(),
      fs: fsSync,
      callback: (err, res) => {
        if (err) throw err;
        result = res;
      },
    })
  );
  return result;
};
var formatMessagesSync = (messages, options) => {
  if (worker_threads && !isInternalWorkerThread) {
    if (!workerThreadService)
      workerThreadService = startWorkerThreadService(worker_threads);
    return workerThreadService.formatMessagesSync(messages, options);
  }
  let result;
  runServiceSync((service) =>
    service.formatMessages({
      callName: 'formatMessagesSync',
      refs: null,
      messages,
      options,
      callback: (err, res) => {
        if (err) throw err;
        result = res;
      },
    })
  );
  return result;
};
var analyzeMetafileSync = (metafile, options) => {
  if (worker_threads && !isInternalWorkerThread) {
    if (!workerThreadService)
      workerThreadService = startWorkerThreadService(worker_threads);
    return workerThreadService.analyzeMetafileSync(metafile, options);
  }
  let result;
  runServiceSync((service) =>
    service.analyzeMetafile({
      callName: 'analyzeMetafileSync',
      refs: null,
      metafile:
        typeof metafile === 'string' ? metafile : JSON.stringify(metafile),
      options,
      callback: (err, res) => {
        if (err) throw err;
        result = res;
      },
    })
  );
  return result;
};
var stop = () => {
  if (stopService) stopService();
  if (workerThreadService) workerThreadService.stop();
  return Promise.resolve();
};
var initializeWasCalled = false;
var initialize = (options) => {
  options = validateInitializeOptions(options || {});
  if (options.wasmURL)
    throw new Error(`The "wasmURL" option only works in the browser`);
  if (options.wasmModule)
    throw new Error(`The "wasmModule" option only works in the browser`);
  if (options.worker)
    throw new Error(`The "worker" option only works in the browser`);
  if (initializeWasCalled)
    throw new Error('Cannot call "initialize" more than once');
  ensureServiceIsRunning();
  initializeWasCalled = true;
  return Promise.resolve();
};
var defaultWD = process.cwd();
var longLivedService;
var stopService;
var ensureServiceIsRunning = () => {
  if (longLivedService) return longLivedService;
  let [command, args] = esbuildCommandAndArgs();
  let child = child_process.spawn(
    command,
    args.concat(`--service=${'0.24.2'}`, '--ping'),
    {
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'inherit'],
      cwd: defaultWD,
    }
  );
  let { readFromStdout, afterClose, service } = createChannel({
    writeToStdin(bytes) {
      child.stdin.write(bytes, (err) => {
        if (err) afterClose(err);
      });
    },
    readFileSync: fs2.readFileSync,
    isSync: false,
    hasFS: true,
    esbuild: node_exports,
  });
  child.stdin.on('error', afterClose);
  child.on('error', afterClose);
  const stdin = child.stdin;
  const stdout = child.stdout;
  stdout.on('data', readFromStdout);
  stdout.on('end', afterClose);
  stopService = () => {
    stdin.destroy();
    stdout.destroy();
    child.kill();
    initializeWasCalled = false;
    longLivedService = void 0;
    stopService = void 0;
  };
  let refCount = 0;
  child.unref();
  if (stdin.unref) {
    stdin.unref();
  }
  if (stdout.unref) {
    stdout.unref();
  }
  const refs = {
    ref() {
      if (++refCount === 1) child.ref();
    },
    unref() {
      if (--refCount === 0) child.unref();
    },
  };
  longLivedService = {
    build: (options) =>
      new Promise((resolve, reject) => {
        service.buildOrContext({
          callName: 'build',
          refs,
          options,
          isTTY: isTTY(),
          defaultWD,
          callback: (err, res) => (err ? reject(err) : resolve(res)),
        });
      }),
    context: (options) =>
      new Promise((resolve, reject) =>
        service.buildOrContext({
          callName: 'context',
          refs,
          options,
          isTTY: isTTY(),
          defaultWD,
          callback: (err, res) => (err ? reject(err) : resolve(res)),
        })
      ),
    transform: (input, options) =>
      new Promise((resolve, reject) =>
        service.transform({
          callName: 'transform',
          refs,
          input,
          options: options || {},
          isTTY: isTTY(),
          fs: fsAsync,
          callback: (err, res) => (err ? reject(err) : resolve(res)),
        })
      ),
    formatMessages: (messages, options) =>
      new Promise((resolve, reject) =>
        service.formatMessages({
          callName: 'formatMessages',
          refs,
          messages,
          options,
          callback: (err, res) => (err ? reject(err) : resolve(res)),
        })
      ),
    analyzeMetafile: (metafile, options) =>
      new Promise((resolve, reject) =>
        service.analyzeMetafile({
          callName: 'analyzeMetafile',
          refs,
          metafile:
            typeof metafile === 'string' ? metafile : JSON.stringify(metafile),
          options,
          callback: (err, res) => (err ? reject(err) : resolve(res)),
        })
      ),
  };
  return longLivedService;
};
var runServiceSync = (callback) => {
  let [command, args] = esbuildCommandAndArgs();
  let stdin = new Uint8Array();
  let { readFromStdout, afterClose, service } = createChannel({
    writeToStdin(bytes) {
      if (stdin.length !== 0) throw new Error('Must run at most one command');
      stdin = bytes;
    },
    isSync: true,
    hasFS: true,
    esbuild: node_exports,
  });
  callback(service);
  let stdout = child_process.execFileSync(
    command,
    args.concat(`--service=${'0.24.2'}`),
    {
      cwd: defaultWD,
      windowsHide: true,
      input: stdin,
      // We don't know how large the output could be. If it's too large, the
      // command will fail with ENOBUFS. Reserve 16mb for now since that feels
      // like it should be enough. Also allow overriding this with an environment
      // variable.
      maxBuffer: +process.env.ESBUILD_MAX_BUFFER || 16 * 1024 * 1024,
    }
  );
  readFromStdout(stdout);
  afterClose(null);
};
var randomFileName = () => {
  return path2.join(
    os2.tmpdir(),
    `esbuild-${crypto.randomBytes(32).toString('hex')}`
  );
};
var workerThreadService = null;
var startWorkerThreadService = (worker_threads2) => {
  let { port1: mainPort, port2: workerPort } =
    new worker_threads2.MessageChannel();
  let worker = new worker_threads2.Worker(__filename, {
    workerData: { workerPort, defaultWD, esbuildVersion: '0.24.2' },
    transferList: [workerPort],
    // From node's documentation: https://nodejs.org/api/worker_threads.html
    //
    //   Take care when launching worker threads from preload scripts (scripts loaded
    //   and run using the `-r` command line flag). Unless the `execArgv` option is
    //   explicitly set, new Worker threads automatically inherit the command line flags
    //   from the running process and will preload the same preload scripts as the main
    //   thread. If the preload script unconditionally launches a worker thread, every
    //   thread spawned will spawn another until the application crashes.
    //
    execArgv: [],
  });
  let nextID = 0;
  let fakeBuildError = (text) => {
    let error = new Error(`Build failed with 1 error:
error: ${text}`);
    let errors = [
      {
        id: '',
        pluginName: '',
        text,
        location: null,
        notes: [],
        detail: void 0,
      },
    ];
    error.errors = errors;
    error.warnings = [];
    return error;
  };
  let validateBuildSyncOptions = (options) => {
    if (!options) return;
    let plugins = options.plugins;
    if (plugins && plugins.length > 0)
      throw fakeBuildError(`Cannot use plugins in synchronous API calls`);
  };
  let applyProperties = (object, properties) => {
    for (let key in properties) {
      object[key] = properties[key];
    }
  };
  let runCallSync = (command, args) => {
    let id = nextID++;
    let sharedBuffer = new SharedArrayBuffer(8);
    let sharedBufferView = new Int32Array(sharedBuffer);
    let msg = { sharedBuffer, id, command, args };
    worker.postMessage(msg);
    let status = Atomics.wait(sharedBufferView, 0, 0);
    if (status !== 'ok' && status !== 'not-equal')
      throw new Error('Internal error: Atomics.wait() failed: ' + status);
    let {
      message: { id: id2, resolve, reject, properties },
    } = worker_threads2.receiveMessageOnPort(mainPort);
    if (id !== id2)
      throw new Error(`Internal error: Expected id ${id} but got id ${id2}`);
    if (reject) {
      applyProperties(reject, properties);
      throw reject;
    }
    return resolve;
  };
  worker.unref();
  return {
    buildSync(options) {
      validateBuildSyncOptions(options);
      return runCallSync('build', [options]);
    },
    transformSync(input, options) {
      return runCallSync('transform', [input, options]);
    },
    formatMessagesSync(messages, options) {
      return runCallSync('formatMessages', [messages, options]);
    },
    analyzeMetafileSync(metafile, options) {
      return runCallSync('analyzeMetafile', [metafile, options]);
    },
    stop() {
      worker.terminate();
      workerThreadService = null;
    },
  };
};
var startSyncServiceWorker = () => {
  let workerPort = worker_threads.workerData.workerPort;
  let parentPort = worker_threads.parentPort;
  let extractProperties = (object) => {
    let properties = {};
    if (object && typeof object === 'object') {
      for (let key in object) {
        properties[key] = object[key];
      }
    }
    return properties;
  };
  try {
    let service = ensureServiceIsRunning();
    defaultWD = worker_threads.workerData.defaultWD;
    parentPort.on('message', (msg) => {
      (async () => {
        let { sharedBuffer, id, command, args } = msg;
        let sharedBufferView = new Int32Array(sharedBuffer);
        try {
          switch (command) {
            case 'build':
              workerPort.postMessage({
                id,
                resolve: await service.build(args[0]),
              });
              break;
            case 'transform':
              workerPort.postMessage({
                id,
                resolve: await service.transform(args[0], args[1]),
              });
              break;
            case 'formatMessages':
              workerPort.postMessage({
                id,
                resolve: await service.formatMessages(args[0], args[1]),
              });
              break;
            case 'analyzeMetafile':
              workerPort.postMessage({
                id,
                resolve: await service.analyzeMetafile(args[0], args[1]),
              });
              break;
            default:
              throw new Error(`Invalid command: ${command}`);
          }
        } catch (reject) {
          workerPort.postMessage({
            id,
            reject,
            properties: extractProperties(reject),
          });
        }
        Atomics.add(sharedBufferView, 0, 1);
        Atomics.notify(sharedBufferView, 0, Infinity);
      })();
    });
  } catch (reject) {
    parentPort.on('message', (msg) => {
      let { sharedBuffer, id } = msg;
      let sharedBufferView = new Int32Array(sharedBuffer);
      workerPort.postMessage({
        id,
        reject,
        properties: extractProperties(reject),
      });
      Atomics.add(sharedBufferView, 0, 1);
      Atomics.notify(sharedBufferView, 0, Infinity);
    });
  }
};
if (isInternalWorkerThread) {
  startSyncServiceWorker();
}
var node_default = node_exports;
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    analyzeMetafile,
    analyzeMetafileSync,
    build,
    buildSync,
    context,
    formatMessages,
    formatMessagesSync,
    initialize,
    stop,
    transform,
    transformSync,
    version,
  });
