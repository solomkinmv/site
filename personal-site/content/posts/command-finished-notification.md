+++
title = 'Notify After Command Finishes'
date = 2023-12-17T23:36:32
draft = false
tags = ["macos", "shell"]
+++

## Problem

Recently I've been executing a lot of long-running commands in the terminal. The biggest problem I've had is that I'll 
start a command and then forget about it. I'll come back to my computer hours later and discover that the command has 
finished.I've been trying to find a way to notify myself when the command has finished. However, I haven't found simple 
and elegant solutions that are noticeable enough to get my attention.

My requirements for a solution are:
1. It should be easy to use. I don't want to have to install a separate program or configure a bunch of settings.
2. It should be noticeable. I want to be able to see the alert even when I'm focused on another window.
3. Notification shouldn't hide automatically.

So, I've come up with this simple solution that I'm quite happy with. The solution is not perfect, but it's good enough 
for my basic needs. 

```bash
#!/bin/bash

# Store the command text
command_text="$@"

# Execute the command
"$@"

# Check the status of the last command executed
if [ $? -eq 0 ]
then
  # If the command was successful, send a notification with the command text
  osascript -e "display dialog \"Command '${command_text}' executed successfully\" with title \"Notification\""
else
  # If the command failed, send a notification with the command text
  osascript -e "display dialog \"Command '${command_text}' execution failed\" with title \"Notification\""
fi
```

I've saved this script as `alert` in my `scripts` directory. Then I can use it like this:

```bash
$ alert python3 parse-data.py
```

The script will execute the command and then send a notification when the command finishes. The notification will look like this:

![Alert example](/images/command-finished-notification/alert-screenshot.png)

## An alternative approach

If you don't want to have that intrusive dialog box, you can display standard notifications instead.

But be aware that notifications will hide automatically after a few seconds. So, if you're not paying attention or 
you're in Do Not Disturb Mode, you may miss the notification.

![Alert example](/images/command-finished-notification/notification-screenshot.png)


```bash
#!/bin/bash

# Store the command text
command_text="$@"

# Execute the command
"$@"

# Check the status of the last command executed
if [ $? -eq 0 ]
then
  # If the command was successful, send a notification with the command text
  osascript -e "display notification \"Command '${command_text}' executed successfully\" with title \"Notification\""
else
  # If the command failed, send a notification with the command text
  osascript -e "display notification \"Command '${command_text}' execution failed\" with title \"Notification\""
fi
```


#### Other solutions I've tried


1. [terminal-notifier](https://github.com/julienXX/terminal-notifier) - This is a great solution, but it's verbose, 
don't support notification timeouts and can be missed.
2. [alerter](https://github.com/vjeantet/alerter) - This is another great solution. It's similar to `terminal-notifier`,
but a little bit more powerful with notification configurations. Still, it's verbose, can't be installed with Homebrew 
and doesn't support alert mode.
3. Append with `; say "Execution finished"`. Simple and concise, but you may miss it if you're without headphones 
and in the office
