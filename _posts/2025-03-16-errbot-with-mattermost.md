---
title: Setting up Errbot with Mattermost
author: hermanl0
date: 2025-03-15
layout: post
---

I recently experimented with [**Errbot**](https://github.com/errbotio/errbot), a Python-based chatbot framework that supports multiple chat backends including Slack, Discord, and Mattermost. I wanted to see how easily it could integrate with my existing Mattermost setup and handle automated tasks.

---

### The Flow

The bot runs on an Ubuntu server inside a Python virtual environment.  
It connects to Mattermost using a personal access token and authenticates through environment variables loaded from a `.env` file.

Once running, the bot:

- Connects to the Mattermost API  
- Joins specified chatrooms  
- Loads plugins dynamically from a local folder  
- Restricts all commands to a single admin user (`@hermanl0`)  
- Logs all actions to `errbot.log` for debugging and auditability

This makes it a small but powerful automation framework that lives inside Mattermost.

---

### The Script

Here’s the main structure of the bot configuration:

```python
BACKEND = 'Mattermost'
BOT_ADMINS = ['@hermanl0']

BOT_IDENTITY = {
    'username': os.environ['MATTERMOST_USERNAME'],
    'token': os.environ['MATTERMOST_TOKEN'],
    'team': os.environ['MATTERMOST_TEAM'],
    'url': os.environ['MATTERMOST_URL'],
    'server': os.environ['MATTERMOST_URL'],
    'scheme': os.environ['MATTERMOST_SCHEME'],
    'port': int(os.environ['MATTERMOST_PORT']),
    'basepath': os.environ['MATTERMOST_BASEPATH'],
    'verify': os.environ['MATTERMOST_VERIFY'].lower() == 'true',
    'timeout': int(os.environ['MATTERMOST_TIMEOUT']),
}

BOT_PREFIX = '!'
BOT_EXTRA_PLUGIN_DIR = './plugins'
BOT_LOG_LEVEL = logging.DEBUG
```

This setup ensures all sensitive credentials are stored securely outside the codebase, while allowing the bot to communicate directly with the Mattermost API.

### The Result
Once running, Errbot automatically connects to the Mattermost workspace and listens for commands prefixed with !.
It supports access control, plugin management, and logging right out of the box — making it ideal for internal automations or quick chat integrations.

Example interaction:

```
!help
!status
!plugin list
```

All commands and responses happen inside Mattermost, so no extra dashboards or terminals are needed.

### Custom Plugin
To extend functionality, I added a small custom plugin that sends daily status messages to the admin.
It reports uptime, health, and plugin status each morning at 07:00.

```python
import threading
from datetime import datetime, timedelta
from errbot import BotPlugin, botcmd


class DailyMessage(BotPlugin):
    """
    Send a daily status message to the admin with uptime and health info.
    """

    def activate(self):
        super().activate()
        self.activation_time = datetime.now()
        self.running = True
        self.log.info("DailyMessage plugin activated")
        self._schedule_next_message()

    def deactivate(self):
        """Stop any scheduled tasks"""
        self.running = False
        self.log.info("DailyMessage plugin deactivated")
        super().deactivate()

    # ───────────────────────────────
    # Scheduling
    # ───────────────────────────────
    def _schedule_next_message(self):
        """Schedule next message for 07:00"""
        now = datetime.now()
        next_run = now.replace(hour=7, minute=0, second=0, microsecond=0)
        if next_run <= now:
            next_run += timedelta(days=1)

        delay = (next_run - now).total_seconds()
        self.log.info(f"Next daily message scheduled for {next_run}")

        timer = threading.Timer(delay, self._send_daily_message)
        timer.daemon = True
        timer.start()

    # ───────────────────────────────
    # Message Logic
    # ───────────────────────────────
    def _send_daily_message(self):
        if not self.running:
            return

        uptime = self._get_uptime()
        health = self._get_health_status()
        message = (
            f"Good morning! I'm alive and well. 🌞\n\n"
            f"🕒 Uptime: {uptime}\n"
            f"💡 Health: {health}\n"
            f"📅 Time: {datetime.now():%Y-%m-%d %H:%M:%S}"
        )

        try:
            self.send_direct_message("@hermanl0", message)
            self.log.info("Daily message sent successfully")
        except Exception as e:
            self.log.error(f"Failed to send daily message: {e}")

        # Reschedule next message
        self._schedule_next_message()

    # ───────────────────────────────
    # Utility Methods
    # ───────────────────────────────
    def send_direct_message(self, user, message):
        """Send DM to specified user"""
        identifier = self.build_identifier(user)
        self.send(identifier, message)

    def _get_uptime(self):
        """Return human-readable uptime"""
        delta = datetime.now() - self.activation_time
        days, rem = delta.days, delta.seconds
        hours, rem = divmod(rem, 3600)
        minutes, _ = divmod(rem, 60)
        return f"{days}d {hours}h {minutes}m"

    def _get_health_status(self):
        """Summarize plugin health"""
        try:
            pm = self._bot.plugin_manager
            active = len(pm.get_all_active_plugin_names())
            disabled = len(pm.get_blacklisted_plugin())
            return "Healthy ✅" if disabled == 0 else f"Partially healthy ({disabled} disabled)"
        except Exception as e:
            self.log.error(f"Health check failed: {e}")
            return "Unknown ❓"

    # ───────────────────────────────
    # Manual Commands
    # ───────────────────────────────
    @botcmd
    def daily_stats(self, msg, args):
        """Show uptime and health manually"""
        return (
            f"Manual stats:\n\n"
            f"🕒 Uptime: {self._get_uptime()}\n"
            f"💡 Health: {self._get_health_status()}\n"
            f"📅 Time: {datetime.now():%Y-%m-%d %H:%M:%S}"
        )

```

It’s a simple addition, but it makes the bot feel more autonomous — quietly checking in every day to confirm it’s still alive.
You can extend the setup by adding more plugins to automate workflows, execute network or system commands, and integrate external tools — effectively turning Mattermost into a ChatOps control hub for your infrastructure.
