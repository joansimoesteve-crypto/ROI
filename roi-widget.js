(function() {
    // Evitar doble inyección
    if (document.getElementById('roi-global-container')) return;

    // 1. Inyectar Estilos
    const style = document.createElement('style');
    style.innerHTML = `
        #roi-global-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #roi-global-trigger {
            background: #FFFFFF;
            border: 2px solid #1E4D40;
            padding: 3px;
            border-radius: 9999px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
        }
        #roi-global-trigger:hover { transform: scale(1.05); }
        #roi-global-avatar {
            width: 48px;
            height: 48px;
            border-radius: 9999px;
            object-fit: cover;
        }
        #roi-global-chat {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 360px;
            max-width: calc(100vw - 48px);
            background: #FFFFFF;
            border: 1px solid #EBE8E1;
            border-radius: 24px;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }
        .roi-chat-header { background: #1E4D40; color: #FFFFFF; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
        .roi-chat-body { padding: 16px; background: #FDFBF7; max-height: 300px; overflow-y: auto; font-size: 13px; color: #1C2024; display: flex; flex-direction: column; gap: 10px; }
        .roi-msg { background: #FFFFFF; border: 1px solid #EBE8E1; padding: 10px 14px; border-radius: 14px; border-top-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .roi-chips { padding: 8px 16px; background: #FFFFFF; border-top: 1px solid #EBE8E1; display: flex; gap: 6px; overflow-x: auto; }
        .roi-chip { background: #FDFBF7; border: 1px solid #EBE8E1; padding: 5px 10px; border-radius: 9999px; font-size: 11px; color: #4B5563; cursor: pointer; white-space: nowrap; }
        .roi-chip:hover { border-color: #1E4D40; color: #1E4D40; }
        .roi-footer { padding: 10px 16px; background: #FFFFFF; border-top: 1px solid #EBE8E1; display: flex; gap: 8px; }
        .roi-input { flex: 1; font-size: 12px; padding: 8px 12px; border: 1px solid #EBE8E1; border-radius: 10px; background: #FDFBF7; outline: none; }
        .roi-send { background: #1E4D40; color: #FFFFFF; border: none; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    `;
    document.head.appendChild(style);

    // 2. Montar Estructura en el DOM
    const container = document.createElement('div');
    container.id = 'roi-global-container';
    container.innerHTML = `
        <div id="roi-global-chat">
            <div class="roi-chat-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border: 2px solid rgba(255,255,255,0.8);">
                    <div>
                        <div style="font-weight: 700; font-size: 13px;">Asistente ROI</div>
                        <div style="font-size: 10px; color: #A7F3D0;">Comparte experiencias</div>
                    </div>
                </div>
                <button id="roi-close-btn" style="background:none; border:none; color:#FFF; font-size:18px; cursor:pointer;">&times;</button>
            </div>
            <div class="roi-chat-body">
                <div class="roi-msg">
                    <p style="margin: 0 0 6px 0; font-weight: 600;">¡Hola! 👋 Soy tu Asistente ROI.</p>
                    <p style="margin: 0 0 8px 0; color: #4B5563;">¿Cómo te sientes con esta experiencia?</p>
                    <div style="display: flex; justify-content: space-between; font-size: 18px; padding: 2px 0;">
                        <span style="cursor:pointer;" onclick="window.roiSelectEmoji('😡')">😡</span>
                        <span style="cursor:pointer;" onclick="window.roiSelectEmoji('🙁')">🙁</span>
                        <span style="cursor:pointer;" onclick="window.roiSelectEmoji('😐')">😐</span>
                        <span style="cursor:pointer;" onclick="window.roiSelectEmoji('😊')">😊</span>
                        <span style="cursor:pointer;" onclick="window.roiSelectEmoji('😍')">😍</span>
                    </div>
                </div>
            </div>
            <div class="roi-chips">
                <div class="roi-chip" onclick="window.roiAction('Valorar página')">✨ Valorar página</div>
                <div class="roi-chip" onclick="window.roiAction('Señalar elemento')">🎯 Señalar elemento</div>
                <div class="roi-chip" onclick="window.roiAction('Geolocalizar mapa')">📍 Geolocalizar</div>
            </div>
            <div class="roi-footer">
                <input type="text" id="roi-text-input" class="roi-input" placeholder="Escribe tu opinión...">
                <button id="roi-send-btn" class="roi-send"><i class="fa-solid fa-paper-plane" style="font-size:10px;"></i></button>
            </div>
        </div>
        
        <button id="roi-global-trigger" title="Asistente ROI">
            <img id="roi-global-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="ROI">
            <span style="position:absolute; top:2px; right:2px; width:11px; height:11px; background:#10B981; border:2px solid #FFF; border-radius:50%;"></span>
        </button>
    `;
    document.body.appendChild(container);

    // 3. Lógica
    const trigger = document.getElementById('roi-global-trigger');
    const chatBox = document.getElementById('roi-global-chat');
    const closeBtn = document.getElementById('roi-close-btn');
    const sendBtn = document.getElementById('roi-send-btn');
    const inputField = document.getElementById('roi-text-input');
    const chatBody = document.querySelector('.roi-chat-body');

    trigger.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
    });
    closeBtn.addEventListener('click', () => { chatBox.style.display = 'none'; });

    window.roiSelectEmoji = function(emoji) {
        appendMsg(`Valoración enviada: ${emoji}`, true);
        setTimeout(() => appendMsg(`¡Muchas gracias! Tu feedback con ${emoji} ha sido registrado.'), 500);
    };

    window.roiAction = function(action) {
        appendMsg(`Acción: ${action}`, true);
        setTimeout(() => appendMsg(`Modo ${action} activado correctamente en el sistema.`), 500);
    };

    function appendMsg(text, isUser = false) {
        const div = document.createElement('div');
        div.className = 'roi-msg';
        if(isUser) {
            div.style.background = '#1E4D40';
            div.style.color = '#FFFFFF';
            div.style.marginLeft = 'auto';
            div.style.borderRadius = '14px 14px 4px 14px';
        }
        div.innerHTML = `<p style="margin:0;">${text}</p>`;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    sendBtn.addEventListener('click', () => {
        const val = inputField.value.trim();
        if(val) {
            appendMsg(val, true);
            inputField.value = '';
            setTimeout(() => appendMsg('¡Aportación registrada con éxito!'), 600);
        }
    });
    inputField.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendBtn.click(); });
})();
