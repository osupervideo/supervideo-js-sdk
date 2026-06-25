/**
 * SuperVideo Embed SDK (v1)
 *
 * Lightweight helper to embed a SuperVideo call inside a third-party page and
 * receive lifecycle events. No dependencies.
 *
 * Usage:
 *   <div id="call"></div>
 *   <script src="https://cdn.jsdelivr.net/npm/@supervideo/js-sdk/dist/supervideo.min.js"></script>
 *   <script>
 *     const call = SuperVideo.embed({
 *       container: '#call',
 *       embedUrl: 'https://supervideo.com.br/embed/ABC123?token=...',
 *       width: '100%',
 *       height: '600px',
 *       onReady:     () => console.log('call ready'),
 *       onJoined:    (d) => console.log('joined', d),
 *       onCallEnded: (d) => console.log('ended', d),
 *       onError:     (d) => console.error('error', d),
 *     });
 *     // call.destroy() to remove the iframe.
 *   </script>
 */
(function (global) {
  'use strict';

  var DEFAULT_ORIGIN = 'https://supervideo.com.br';
  var MESSAGE_SOURCE = 'supervideo';

  function resolveContainer(container) {
    if (!container) throw new Error('[SuperVideo] "container" is required');
    var el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) throw new Error('[SuperVideo] container not found: ' + container);
    return el;
  }

  function buildUrl(opts) {
    if (opts.embedUrl) return opts.embedUrl;
    if (!opts.roomId) throw new Error('[SuperVideo] provide "embedUrl" or "roomId"');
    var origin = opts.origin || DEFAULT_ORIGIN;
    var url = origin.replace(/\/$/, '') + '/embed/' + encodeURIComponent(opts.roomId);
    if (opts.token) url += '?token=' + encodeURIComponent(opts.token);
    return url;
  }

  function embed(opts) {
    opts = opts || {};
    var el = resolveContainer(opts.container);
    var src = buildUrl(opts);
    var allowedOrigin = opts.origin || (function () {
      try { return new URL(src).origin; } catch (e) { return DEFAULT_ORIGIN; }
    })();

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.allow = 'camera; microphone; autoplay; display-capture; fullscreen';
    iframe.style.border = '0';
    iframe.style.width = opts.width || '100%';
    iframe.style.height = opts.height || '600px';
    iframe.setAttribute('allowfullscreen', 'true');
    el.appendChild(iframe);

    function onMessage(event) {
      // Only accept messages from the embedded SuperVideo origin
      if (event.origin !== allowedOrigin) return;
      var data = event.data;
      if (!data || data.source !== MESSAGE_SOURCE) return;
      switch (data.event) {
        case 'ready':      if (opts.onReady) opts.onReady(data.payload); break;
        case 'joined':     if (opts.onJoined) opts.onJoined(data.payload); break;
        case 'call-ended': if (opts.onCallEnded) opts.onCallEnded(data.payload); break;
        case 'error':      if (opts.onError) opts.onError(data.payload); break;
        default: break;
      }
      if (opts.onEvent) opts.onEvent(data.event, data.payload);
    }

    window.addEventListener('message', onMessage);

    return {
      iframe: iframe,
      destroy: function () {
        window.removeEventListener('message', onMessage);
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }
    };
  }

  global.SuperVideo = { embed: embed, version: '1.0.0' };
})(typeof window !== 'undefined' ? window : this);
