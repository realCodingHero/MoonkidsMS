#!/bin/sh
set -eu

working_dir=/opt/server
working_dir_bak=/opt/server_backup
marker_file="$working_dir/.initialized"
resource_marker="$working_dir/.resource-version"
backup_resource_marker="$working_dir_bak/.resource-version"

if [ ! -f "$backup_resource_marker" ]; then
    echo "Release resource fingerprint is missing from the image." >&2
    exit 1
fi

release_fingerprint=$(cat "$backup_resource_marker")

sync_release_resources() {
    echo "Synchronizing release JAR and resource directories..."
    for path in BeiDou.jar wz wz-zh-CN scripts scripts-zh-CN; do
        if [ -e "$working_dir_bak/$path" ]; then
            # These are release-owned paths. Logs, application.yml and database
            # volumes remain untouched in the persistent server directory.
            rm -rf "$working_dir/$path"
            cp -a "$working_dir_bak/$path" "$working_dir/"
        fi
    done
    cp "$backup_resource_marker" "$resource_marker"
}

mkdir -p "$working_dir"

if [ ! -f "$working_dir/BeiDou.jar" ]; then
    echo "First run - initializing volume..."
    cp -a "$working_dir_bak/." "$working_dir/"
    touch "$marker_file"
    echo "Initialization complete. Backup kept for future recovery."
elif [ ! -f "$resource_marker" ] || [ "$(cat "$resource_marker")" != "$release_fingerprint" ]; then
    sync_release_resources
fi

cd "$working_dir"

JAVA_EXEC=$(find . -type f -name java -path "*/bin/java" | head -1)

if [ -z "$JAVA_EXEC" ]; then
    JAVA_EXEC="java"
else
    chmod +x "$JAVA_EXEC"
fi

exec "$JAVA_EXEC" ${JAVA_OPTS:-} -jar ./BeiDou.jar --spring.config.location=./application.yml "$@"
