# StreamChat Collation Service

A lightweight, high-performance web service that collates real-time chat streams from Twitch and Kick.com into a single, clean HTML/CSS overlay, designed for use as a browser source in OBS or other streaming software.

## 🚀 Features
- **Multi-Platform Collation**: Combines Twitch and Kick chat into one unified feed.
- **Dynamic Configuration**: Control channels and authentication via simple GET request parameters.
- **Low Overhead**: Built with vanilla JavaScript and a minimal ASP.NET 4.0 backend to ensure maximum compatibility and minimal latency.
- **Transparent Overlay**: CSS designed for seamless integration as a transparent overlay.

## 🛠 Technical Architecture
- **Twitch Integration**: Connects directly to the Twitch IRC interface via WebSockets (`wss://irc-ws.chat.twitch.tv:443`).
- **Kick Integration**: Utilizes the Pusher protocol to subscribe to Kick's real-time chat events.
- **Backend Proxy**: A lightweight `proxy.aspx` resolver is included to translate Kick usernames into numeric Channel IDs, bypassing CORS and client-side restrictions.

## 📦 Deployment
1. **Server Requirement**: A web server configured with **ASP.NET 4.0**.
2. **Installation**: 
   - Create a virtual directory (e.g., `/streamchat`) on your server.
   - Upload all files from this repository into that directory.
3. **Verification**: Ensure `proxy.aspx` is accessible via your browser to verify server-side compilation.

## ⚙️ Configuration
The service is configured entirely via URL parameters.

### Parameters
| Parameter | Required | Description | Example |
|-----------|----------|-------------|-----------|
| `twitch`   | No       | Twitch username (defaults to `alkimifox`) | `twitch=alkimifox` |
| `kick`     | No       | Kick username (defaults to `alkimi`) | `kick=alkimi` |
| `token`    | Yes*     | Twitch OAuth token (required for Twitch connection) | `token=oauth:yourtoken` |
| `kickid`   | No       | Manual Kick Channel ID (bypasses `proxy.aspx`) | `kickid=123456` |

*\*Twitch requires an OAuth token to join channels via IRC. You can generate one at [twitchapps.com/tmi](https://twitchapps.com/tmi/).*

### Example URL
`https://yourserver.com/streamchat/index.aspx?twitch=alkimifox&kick=alkimi&token=oauth:abcdef123456`

## 📄 License
MIT License
