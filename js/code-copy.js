/*
 * Adds a "Copy" button to every code block inside .content.
 * Works for both plain ``` blocks (bare <pre><code>) and language-tagged
 * blocks (wrapped in .highlight).
 */
(function () {
  function getText(pre) {
    var code = pre.querySelector('code');
    return (code || pre).innerText.replace(/\n$/, '');
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function attach(pre) {
    if (pre.dataset.copyReady === 'true') return;
    pre.dataset.copyReady = 'true';

    var wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.addEventListener('click', function () {
      copyText(getText(pre)).then(function () {
        btn.textContent = 'Copied!';
        btn.classList.add('is-copied');
        clearTimeout(btn._resetTimer);
        btn._resetTimer = setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('is-copied');
        }, 1500);
      }).catch(function () {
        btn.textContent = 'Failed';
        clearTimeout(btn._resetTimer);
        btn._resetTimer = setTimeout(function () {
          btn.textContent = 'Copy';
        }, 1500);
      });
    });

    wrapper.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.content pre').forEach(attach);
  });
})();
