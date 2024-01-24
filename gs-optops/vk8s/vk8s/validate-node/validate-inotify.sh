#!/bin/bash

mem=$(free -h | awk 'NR==2 {print $2}') # 125Gi
echo "System Memory: ${mem}"
value=${mem::(-2)} # 125

max_user_watches=fs.inotify.max_user_watches
max_user_instances=fs.inotify.max_user_instances

sysctl=/etc/sysctl.conf

replace_or_append() {
    local keyword="$1"
    local value="$2"
    added="$keyword=$value"
    echo "To Be: $added"

    # Check if the keyword exists in the file
    if grep -q "$keyword" "$sysctl"; then
        # If keyword found, replace the whole line
        sudo sed -i "/$keyword/c\\$added" "$sysctl"
    else
        # If keyword not found, add replacement to the end of the file
        sudo echo "$added" >> "$sysctl"
    fi
}

if [[ $value -lt 120 ]]; then # 64GiB
  replace_or_append $max_user_watches 524288
  replace_or_append $max_user_instances 2048
elif [[ $value -ge 120 ]] && [[ $value -lt 250 ]]; then # 128GiB
  replace_or_append $max_user_watches 1048576
  replace_or_append $max_user_instances 2048
elif [[ $value -ge 250 ]] && [[ $value -lt 512 ]]; then # 256GiB
  replace_or_append $max_user_watches 2097152
  replace_or_append $max_user_instances 2048
fi

sudo sysctl -p
