const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function setup() {
    function target() {
        const listeners = {};
        return { listeners, addEventListener(type, listener) {
            (listeners[type] ||= []).push(listener);
        } };
    }
    const window = target();
    window.location = { href: 'https://example.test/watch', host: 'example.test' };
    const document = target();
    document.location = window.location;
    document.title = 'Example video';
    const ports = [];
    let disconnectError, errorReads = 0, invalidated = false, connectAttempts = 0;
    const chrome = {
        runtime: {
            getURL: name => name,
            connect() {
                connectAttempts++;
                if (invalidated) throw new Error('Extension context invalidated.');
                const port = { messages: [], disconnected: false,
                    onMessage: { addListener(listener) { port.receive = listener; } },
                    onDisconnect: { addListener(listener) { port.onClosed = listener; } },
                    postMessage(message) { port.messages.push(message); },
                    disconnect() {
                        if (invalidated) throw new Error('Extension context invalidated.');
                        port.disconnected = true;
                    } };
                ports.push(port);
                return port;
            },
            get lastError() { errorReads++; return disconnectError; }
        },
        storage: { local: { get(_keys, callback) { callback({}); } },
            onChanged: { addListener() {} } }
    };
    const context = vm.createContext({ window, document, chrome, URL, setTimeout, clearTimeout });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'ct.js'), 'utf8'), context);
    return { window, ports,
        invalidate() { invalidated = true; },
        connectAttempts: () => connectAttempts,
        fire(type, event) { for (const listener of window.listeners[type] || []) listener(event); },
        close(port, error) { disconnectError = error; port.onClosed(port); disconnectError = undefined; },
        errorReads: () => errorReads };
}

test('BFCache navigation closes the old port and reconnects once on restore', () => {
    const page = setup();
    assert.equal(page.ports.length, 1);
    const oldPort = page.ports[0];
    page.fire('pagehide', { persisted: true });
    assert.equal(oldPort.disconnected, true);
    page.close(oldPort, { message: 'The page keeping the extension port is moved into back/forward cache' });
    assert.equal(page.errorReads(), 1);
    assert.equal(page.ports.length, 1);

    page.fire('pageshow', { persisted: true });
    assert.equal(page.ports.length, 2);
    page.ports[1].receive([3, 42]);
    assert.deepEqual(Array.from(page.ports[1].messages[0]),
        [2, 42, 'https://example.test/watch', 'Example video']);
});

test('an unexpected disconnect on an active page still reconnects', () => {
    const page = setup();
    page.close(page.ports[0]);
    assert.equal(page.ports.length, 2);
    page.fire('pageshow', { persisted: false });
    assert.equal(page.ports.length, 2);
});

test('a BFCache disconnect waits for page restoration even if pagehide was missed', () => {
    const page = setup();
    page.close(page.ports[0],
        { message: 'The page keeping the extension port is moved into back/forward cache' });
    assert.equal(page.ports.length, 1);
    page.fire('pageshow', { persisted: true });
    assert.equal(page.ports.length, 2);
});

test('pagehide safely releases an invalidated port and does not reconnect on restore', () => {
    const page = setup();
    page.invalidate();
    assert.doesNotThrow(() => page.fire('pagehide', { persisted: true }));
    assert.doesNotThrow(() => page.fire('pagehide', { persisted: true }));
    assert.doesNotThrow(() => page.fire('pageshow', { persisted: true }));
    assert.equal(page.connectAttempts(), 1);
});

test('restoring a cached page after extension reload safely stops reconnecting', () => {
    const page = setup();
    page.fire('pagehide', { persisted: true });
    page.invalidate();
    assert.doesNotThrow(() => page.fire('pageshow', { persisted: true }));
    assert.doesNotThrow(() => page.fire('pageshow', { persisted: false }));
    assert.equal(page.connectAttempts(), 2);
    assert.equal(page.ports.length, 1);
});

test('disconnect after extension reload safely handles a failed reconnect', () => {
    const page = setup();
    page.invalidate();
    assert.doesNotThrow(() => page.close(page.ports[0]));
    assert.doesNotThrow(() => page.fire('pageshow', { persisted: false }));
    assert.equal(page.connectAttempts(), 2);
});
