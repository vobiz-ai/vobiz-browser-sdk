/* ========================================
   Vobiz SDK Console — Application Logic
   ======================================== */

let vobiz = null;
let isMuted = false;
let pendingCallUUID = null; // stores UUID of ringing incoming call

// ===== SIP Inspector =====
function sipLog(direction, message) {
    const box = document.getElementById('sipMessages');
    if (!box) return;
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Colour code by direction and message type
    const isInbound = direction === 'IN';
    const firstLine = message.split(/\r?\n/)[0].trim();
    let color = isInbound ? '#93c5fd' : '#86efac'; // blue=in, green=out
    if (firstLine.includes('INVITE'))   color = isInbound ? '#f9a8d4' : '#fcd34d';
    if (firstLine.includes('200 OK'))   color = '#6ee7b7';
    if (firstLine.includes('BYE'))      color = '#fca5a5';
    if (firstLine.includes('486') || firstLine.includes('404') || firstLine.includes('488')) color = '#fca5a5';
    if (firstLine.includes('180') || firstLine.includes('183')) color = '#c4b5fd';

    const arrow = isInbound ? '▼ IN ' : '▲ OUT';
    const header = `\n${color === '#93c5fd' || color === '#f9a8d4' || color === '#fca5a5' || color === '#c4b5fd' || color === '#6ee7b7' ? '' : ''}`;

    const entry = document.createElement('span');
    entry.innerHTML = `<span style="color:#64748b">${time} </span><span style="color:${color};font-weight:bold">${arrow} ${firstLine}</span>\n`;

    // If SDP is in the message, highlight the m= line and key fields
    if (message.includes('m=audio')) {
        const lines = message.split(/\r?\n/);
        lines.forEach(line => {
            const span = document.createElement('span');
            if (line.startsWith('m=audio')) {
                span.style.color = '#fbbf24';
                span.style.fontWeight = 'bold';
                span.textContent = '  ' + line + '\n';
                // Check for DTLS vs plain RTP
                updateDtlsBadge(line);
            } else if (line.startsWith('a=fingerprint')) {
                span.style.color = '#6ee7b7';
                span.style.fontWeight = 'bold';
                span.textContent = '  ' + line + '\n';
            } else if (line.startsWith('a=rtpmap') || line.startsWith('a=fmtp')) {
                span.style.color = '#a5b4fc';
                span.textContent = '  ' + line + '\n';
            } else if (line.startsWith('a=ice-') || line.startsWith('a=setup')) {
                span.style.color = '#67e8f9';
                span.textContent = '  ' + line + '\n';
            } else if (line !== '') {
                span.style.color = '#94a3b8';
                span.textContent = '  ' + line + '\n';
            }
            entry.appendChild(span);
        });
    } else {
        // Just show the full message dimmed
        const body = document.createElement('span');
        body.style.color = '#475569';
        body.style.fontSize = '10px';
        const trimmed = message.split(/\r?\n/).slice(1).join('\n').trim();
        if (trimmed) body.textContent = trimmed.substring(0, 300) + (trimmed.length > 300 ? '...' : '') + '\n';
        entry.appendChild(body);
    }

    const divider = document.createElement('span');
    divider.style.color = '#1e293b';
    divider.textContent = '─'.repeat(60) + '\n';
    entry.appendChild(divider);

    box.appendChild(entry);
    box.scrollTop = box.scrollHeight;
}

function updateDtlsBadge(mLine) {
    const badge = document.getElementById('sipDtlsBadge');
    if (!badge) return;
    badge.style.display = 'inline-block';
    if (mLine.includes('UDP/TLS/RTP/SAVPF')) {
        badge.textContent = '✅ WebRTC DTLS — Chrome compatible';
        badge.style.background = '#d1fae5';
        badge.style.color = '#065f46';
    } else if (mLine.includes('RTP/AVP') || mLine.includes('RTP/SAVP')) {
        badge.textContent = '❌ Plain RTP/AVP — No DTLS fingerprint (Chrome will reject)';
        badge.style.background = '#fee2e2';
        badge.style.color = '#991b1b';
    }
}

function updateSipStatus(text, color) {
    const badge = document.getElementById('sipStatusBadge');
    if (!badge) return;
    badge.textContent = text;
    badge.style.background = color;
    badge.style.color = '#fff';
}

function clearSipLog() {
    const box = document.getElementById('sipMessages');
    if (box) box.innerHTML = '';
    const badge = document.getElementById('sipDtlsBadge');
    if (badge) badge.style.display = 'none';
    updateSipStatus('Idle', '#6b7280');
}

// ===== Logging =====
function log(msg, type = 'info') {
    const container = document.getElementById('logContainer');
    const entry = document.createElement('div');
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="log-time">${time}</span>${msg}`;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
}

function clearLog() {
    document.getElementById('logContainer').innerHTML = '';
    log('Log cleared');
}

// ===== Status =====
function setStatus(text, statusClass) {
    const statusEl = document.getElementById('connectionStatus');
    statusEl.querySelector('.status-dot').className = `status-dot ${statusClass}`;
    statusEl.querySelector('.status-text').textContent = text;
}

// ===== Login =====
function doLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        log('Please enter both username and password', 'error');
        return;
    }

    // Show loader
    const btn = document.getElementById('loginBtn');
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-loader').style.display = 'inline-block';
    btn.disabled = true;

    setStatus('Connecting...', 'connecting');
    log(`Connecting as ${username}...`, 'event');

    try {
        // Initialize the Vobiz SDK
        vobiz = new Vobiz({
            debug: 'ALL',
            permOnClick: true,
            enableTracking: true,
            closeProtection: false,
            maxAverageBitrate: 48000,
        });

        // Register event handlers
        vobiz.client.on('onWebrtcNotSupported', () => {
            log('WebRTC is not supported in this browser', 'error');
            resetLoginUI();
        });

        vobiz.client.on('onLogin', () => {
            log('✅ Successfully registered with Vobiz!', 'success');
            setStatus('Registered', 'online');
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('logoutBtn').style.display = 'block';
            resetLoginUI();

            // Pre-acquire microphone immediately after login so it's ready for inbound calls
            // Without this, an inbound call triggers getUserMedia mid-flight and Chrome blocks it
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then((stream) => {
                    window.localStream = stream;
                    log('🎤 Microphone ready for inbound calls', 'success');
                })
                .catch((err) => {
                    log(`⚠️ Could not pre-acquire microphone: ${err.message}`, 'warning');
                });
        });

        vobiz.client.on('onLoginFailed', (reason) => {
            log(`❌ Login failed: ${reason || 'Unknown error'}`, 'error');
            setStatus('Login Failed', 'offline');
            resetLoginUI();
        });

        vobiz.client.on('onLogout', () => {
            log('Logged out from Vobiz', 'warning');
            setStatus('Disconnected', 'offline');
            document.getElementById('loginBtn').style.display = 'block';
            document.getElementById('logoutBtn').style.display = 'none';
            hideCallUI();
        });

        vobiz.client.on('onCallRemoteRinging', (callInfo) => {
            log(`📞 Ringing... (${callInfo?.callUUID || ''})`, 'event');
            setStatus('Ringing', 'in-call');
        });

        vobiz.client.on('onCallAnswered', (callInfo) => {
            log(`✅ Call answered! (${callInfo?.callUUID || ''})`, 'success');
            setStatus('In Call', 'in-call');
            showInCallUI();

            // Workaround: Manually attach remote stream
            setTimeout(() => {
                const remoteAudio = document.getElementById('remoteAudio');

                // Try getting stream from the SDK's remote view
                let stream = null;
                if (vobiz && vobiz.client && vobiz.client.remoteView) {
                    stream = vobiz.client.remoteView.srcObject;
                }

                // Fallback: check peer connection receivers
                if (!stream && vobiz && vobiz.client) {
                    const pc = vobiz.client.getPeerConnection().pc;
                    if (pc) {
                        const receivers = pc.getReceivers();
                        const audioReceiver = receivers.find(r => r.track && r.track.kind === 'audio');
                        if (audioReceiver && audioReceiver.track) {
                            stream = new MediaStream([audioReceiver.track]);
                            log('🔊 Found audio track from PC receivers', 'info');
                        }
                    }
                }

                if (stream && remoteAudio) {
                    remoteAudio.srcObject = stream;
                    remoteAudio.play().catch(e => log('Error playing audio: ' + e.message, 'error'));
                    log('🔊 SDK has remote stream, attaching to backup audio element...', 'info');
                } else {
                    log('⚠️ Could not find remote stream to attach', 'warning');
                }
            }, 1500);

            // Workaround: Explicitly attach stream if SDK didn't
            setTimeout(() => {
                const remoteAudio = document.getElementById('remoteAudio');
                if (vobiz.client.remoteView && vobiz.client.remoteView.srcObject) {
                    log('🔊 SDK has remote stream, attaching to backup audio element...', 'info');
                    remoteAudio.srcObject = vobiz.client.remoteView.srcObject;
                    remoteAudio.play().catch(e => log(`Autoplay error: ${e.message}`, 'error'));
                } else {
                    log('⚠️ No remote stream found on SDK remoteView', 'warning');
                }
            }, 1000); // Wait for media to settle
        });

        vobiz.client.on('onCallTerminated', (callInfo) => {
            log(`📴 Call ended: ${callInfo?.reason || 'Terminated'}`, 'warning');
            setStatus('Registered', 'online');
            hideCallUI();
        });

        vobiz.client.on('onCallFailed', (callInfo) => {
            log(`❌ Call failed: ${callInfo?.reason || 'Unknown'}`, 'error');
            setStatus('Registered', 'online');
            hideCallUI();
        });

        vobiz.client.on('onIncomingCall', (callerId, extraHeaders, callInfo, callerName) => {
            const displayName = callerName || callerId;
            pendingCallUUID = callInfo?.callUUID || null;
            log(`📲 Incoming call from: <strong>${displayName}</strong> (${callerId})`, 'event');
            setStatus('Incoming Call', 'in-call');
            showIncomingUI(displayName);
        });

        vobiz.client.on('onIncomingCallCanceled', (callInfo) => {
            log(`📴 Incoming call cancelled by caller (${callInfo?.callUUID || ''})`, 'warning');
            setStatus('Registered', 'online');
            pendingCallUUID = null;
            hideIncomingUI();
        });

        vobiz.client.on('onMediaPermission', (granted) => {
            if (granted) {
                log('🎤 Microphone permission granted', 'success');
            } else {
                log('🎤 Microphone permission denied', 'error');
            }
        });

        vobiz.client.on('onConnectionChange', (event) => {
            log(`🔌 Connection: ${event.state} — ${event.reason || ''}`, 'event');
        });

        // Perform login
        vobiz.client.login(username, password);

        // Spy on the raw WebSocket — feeds both the event log and the SIP inspector
        const wsCheckInterval = setInterval(() => {
            if (vobiz.client.vobizSocket && vobiz.client.vobizSocket._ws) {
                const ws = vobiz.client.vobizSocket._ws;
                const origOnMsg = ws.onmessage;
                const origSend = ws.send.bind(ws);

                // Intercept INBOUND SIP messages
                ws.onmessage = function(evt) {
                    const msg = (evt.data || '').toString();
                    const firstLine = msg.split('\r\n')[0] || msg.split('\n')[0];
                    // Show in event log (short)
                    if (!firstLine.includes('OPTIONS') && !firstLine.includes('404')) {
                        log(`🔍 SIP IN: ${firstLine}`, 'info');
                    }
                    // Show full message in SIP inspector
                    if (!msg.includes('OPTIONS')) {
                        sipLog('IN', msg);
                        // Update status badge
                        if (firstLine.includes('INVITE')) updateSipStatus('📲 INVITE Received', '#7c3aed');
                        if (firstLine.includes('200 OK')) updateSipStatus('✅ 200 OK', '#065f46');
                        if (firstLine.includes('BYE'))    updateSipStatus('📴 Call Ended', '#6b7280');
                        if (firstLine.includes('486'))    updateSipStatus('❌ 486 Busy', '#991b1b');
                    }
                    if (origOnMsg) origOnMsg.call(this, evt);
                };

                // Intercept OUTBOUND SIP messages
                ws.send = function(data) {
                    const msg = (data || '').toString();
                    const firstLine = msg.split('\r\n')[0] || msg.split('\n')[0];
                    if (!msg.includes('OPTIONS')) {
                        sipLog('OUT', msg);
                        if (firstLine.includes('INVITE'))   updateSipStatus('📞 INVITE Sent', '#1d4ed8');
                        if (firstLine.includes('200 OK'))   updateSipStatus('✅ Answered', '#065f46');
                        if (firstLine.includes('REGISTER')) updateSipStatus('🔐 Registering', '#92400e');
                        if (firstLine.includes('BYE'))      updateSipStatus('📴 Hanging Up', '#6b7280');
                    }
                    return origSend(data);
                };

                clearInterval(wsCheckInterval);
                log('🔍 SIP monitor active', 'info');
                updateSipStatus('🟢 Connected', '#065f46');
            }
        }, 500);

        // Debug: Expose vobiz to window for console inspection
        window.vobiz = vobiz;

    } catch (err) {
        log(`Error initializing SDK: ${err.message}`, 'error');
        resetLoginUI();
        setStatus('Error', 'offline');
    }
}

function resetLoginUI() {
    const btn = document.getElementById('loginBtn');
    btn.querySelector('.btn-text').style.display = 'inline';
    btn.querySelector('.btn-loader').style.display = 'none';
    btn.disabled = false;
}

function doLogout() {
    if (vobiz) {
        vobiz.client.logout();
        log('Logging out...', 'info');
    }
}

// ===== Calling =====
function doCall() {
    const dest = document.getElementById('destination').value.trim();
    if (!dest) {
        log('Please enter a destination number or SIP URI', 'error');
        return;
    }
    if (!vobiz) {
        log('You must login first', 'error');
        return;
    }

    log(`📞 Calling ${dest}...`, 'event');
    setStatus('Calling...', 'in-call');

    const extraHeaders = {};
    vobiz.client.call(dest, extraHeaders);

    document.getElementById('callBtn').style.display = 'none';
    document.getElementById('hangupBtn').style.display = 'flex';
}

function doAnswer() {
    if (vobiz) {
        vobiz.client.answer(pendingCallUUID || '');
        log(`Answering call... (${pendingCallUUID || 'last incoming'})`, 'success');
        pendingCallUUID = null;
        hideIncomingUI();
        showInCallUI();
    }
}

function doReject() {
    if (vobiz) {
        vobiz.client.reject(pendingCallUUID || '');
        log('Call rejected', 'warning');
        pendingCallUUID = null;
        hideIncomingUI();
    }
}

function doHangup() {
    if (vobiz) {
        vobiz.client.hangup();
        log('Hanging up...', 'info');
    }
}

// ===== DTMF =====
function pressKey(key) {
    const dest = document.getElementById('destination');
    dest.value += key;

    // Send DTMF if in call
    if (vobiz && vobiz.client.callSession) {
        vobiz.client.sendDtmf(key);
        log(`🔢 DTMF: ${key}`, 'info');
    }
}

// ===== Mute =====
function toggleMute() {
    if (!vobiz) return;

    const btn = document.getElementById('muteBtn');
    if (isMuted) {
        vobiz.client.unmute();
        btn.classList.remove('active');
        btn.querySelector('span').textContent = 'Mute';
        log('🔊 Unmuted', 'info');
    } else {
        vobiz.client.mute();
        btn.classList.add('active');
        btn.querySelector('span').textContent = 'Unmute';
        log('🔇 Muted', 'warning');
    }
    isMuted = !isMuted;
}

// ===== UI Helpers =====
function showInCallUI() {
    document.getElementById('callBtn').style.display = 'none';
    document.getElementById('answerBtn').style.display = 'none';
    document.getElementById('hangupBtn').style.display = 'flex';
    document.getElementById('mediaControls').style.display = 'flex';
}

function hideCallUI() {
    document.getElementById('callBtn').style.display = 'flex';
    document.getElementById('answerBtn').style.display = 'none';
    document.getElementById('hangupBtn').style.display = 'none';
    document.getElementById('rejectBtn').style.display = 'none';
    document.getElementById('mediaControls').style.display = 'none';
    isMuted = false;
    const muteBtn = document.getElementById('muteBtn');
    muteBtn.classList.remove('active');
    muteBtn.querySelector('span').textContent = 'Mute';
}

function showIncomingUI(callerName) {
    document.getElementById('answerBtn').style.display = 'flex';
    document.getElementById('rejectBtn').style.display = 'flex';
    document.getElementById('callBtn').style.display = 'none';
}

function hideIncomingUI() {
    document.getElementById('answerBtn').style.display = 'none';
    document.getElementById('rejectBtn').style.display = 'none';
    document.getElementById('callBtn').style.display = 'flex';
}

// ===== Init =====
log('Vobiz Browser SDK Console loaded', 'info');
log('Enter your endpoint credentials and click "Connect & Register"', 'info');
