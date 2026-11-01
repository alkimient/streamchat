
(function() {
    console.log("Stream Chat Initializing...");
    const params = new URLSearchParams(window.location.search);
    const twitchUser = (params.get('twitch') || 'alkimifox').toLowerCase();
    const kickUser = params.get('kick') || 'alkimi';
    const kickIdParam = params.get('kickid');
    const twitchToken = params.get('token') || '';

    console.log(`Config: Twitch=#${twitchUser}, Kick=${kickUser}, KickID=${kickIdParam || 'auto'}, TokenProvided=${!!twitchToken}`);

    const messagesContainer = document.getElementById('chat-messages');

    function addMessage(platform, user, message) {
        console.log(`DISPLAYING: [${platform}] ${user}: ${message}`);
        const div = document.createElement('div');
        div.className = 'message';
        const tag = document.createElement('span');
        tag.className = `platform-tag tag-${platform}`;
        tag.innerText = platform;
        const name = document.createElement('span');
        name.className = 'username';
        name.innerText = user + ':';
        const text = document.createTextNode(' ' + message);
        div.appendChild(tag);
        div.appendChild(name);
        div.appendChild(text);
        messagesContainer.appendChild(div);
        while (messagesContainer.childNodes.length > 50) {
            messagesContainer.removeChild(messagesContainer.firstChild);
        }
        window.scrollTo(0, document.body.scrollHeight);
    }

    async function initKick() {
        try {
            let kickId = kickIdParam;
            if (!kickId) {
                const response = await fetch(`proxy.aspx?username=${kickUser}`);
                const text = await response.text();
                const data = JSON.parse(text);
                kickId = data.id;
            }
            const pusher = new Pusher('eb1d687271c8f4981815', { cluster: 'mt1' });
            const channel = pusher.subscribe(`chatroom.${kickId}`);
            channel.bind('App\Events\ChatMessageEvent', function(data) {
                addMessage('kick', data.sender.username, data.content);
            });
        } catch (e) {
            console.error('Kick Error:', e);
        }
    }

    function initTwitch() {
        if (!twitchToken) {
            console.warn("Twitch: No token provided. Skipping connection.");
            return;
        }

        const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

        socket.onopen = () => {
            socket.send(`PASS ${twitchToken}`);
            socket.send(`NICK justalurker_${Math.floor(Math.random() * 1000)}`);
            socket.send(`JOIN #${twitchUser}`);
        };

        socket.onmessage = (event) => {
            const data = event.data;
            
            if (data.startsWith('PING')) {
                socket.send('PONG :tmi.twitch.tv');
                return;
            }

            // FIX: Twitch messages start with ':', not 'PRIVMSG'
            if (data.includes(' PRIVMSG ')) {
                const match = data.match(/:([^!]+)!.*PRIVMSG #[^ ]+ :(.*)/);
                if (match) {
                    addMessage('twitch', match[1], match[2]);
                }
            }
        };

        socket.onerror = (e) => console.error('Twitch Socket Error:', e);
        socket.onclose = (e) => console.log(`Twitch Socket CLOSED. Code: ${e.code}`);
    }

    initKick();
    initTwitch();
})();
