#!/usr/bin/env bash
# release.sh [--dry-run]: build the signed Rootiest Mail release APK and publish it as the Gitea release v<version>, which
# Obtainium installs and updates from (obtainium/rootiest-mail.json).
# <version> is upstream's VERSION plus "-r<rootiestRevision>" (android/app/rootiest.gradle), e.g. v0.1.96-r1.
# Run on the machine that holds the release key (README, "Releases"), from a clean main that matches origin/main, after
# bumping rootiestRevision (or merging a new upstream release) through a PR. --dry-run builds and checks everything but
# publishes nothing.

case "${1:-}" in -h | --help) awk 'NR > 1 && /^#/ { sub(/^# ?/, ""); print; next } NR > 1 { exit }' "$0"; exit 0 ;; esac
set -euo pipefail
cd "$(dirname "$0")/.." >/dev/null
REPO=rootiest/rootiest-mail-android
UPSTREAM=https://github.com/bulwarkmail/native
# SHA-256 of the release certificate: an APK signed with anything else (the debug key) is never published.
CERT=a22bcf622f189589e460fac333c13b71c97770f5b090d9d07703dbd4450b00e8
die() { echo "release: $*" >&2; exit 1; }

dry=0
case "$*" in
  --dry-run) dry=1 ;;
  "") ;;
  *) die "unknown argument '$*' (--dry-run or --help)" ;;
esac

upstream=$(tr -d '[:space:]' < VERSION)
revision=$(sed -n 's/^def rootiestRevision = \([0-9]*\)$/\1/p' android/app/rootiest.gradle)
[[ $upstream =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "no MAJOR.MINOR.PATCH in VERSION"
[[ $revision =~ ^[0-9]+$ ]] || die "no rootiestRevision in android/app/rootiest.gradle"
ver=$upstream-r$revision
tag=v$ver

[ "$(git branch --show-current)" = main ] || die "not on main"
git fetch -q origin
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || die "main does not match origin/main"
[ -z "$(git status --porcelain)" ] || die "the working tree is not clean"
# gt, the Gitea CLI, publishes the release; GITEA_TOKEN alone does not say which Gitea it is for
command -v gt >/dev/null || die "gt (the Gitea CLI, package gitea-cli) is not installed"
export GITEA_INSTANCE_URL=${GITEA_INSTANCE_URL:-https://git.rootiest.dev}
[ -z "$(git ls-remote --tags origin "refs/tags/$tag")" ] || die "$tag exists already: bump rootiestRevision"

# The build needs JDK 17 (Gradle here cannot run on newer ones) and one SDK location: ANDROID_SDK_ROOT pointing
# elsewhere than ANDROID_HOME stops it.
export ANDROID_HOME=${ANDROID_HOME:-$HOME/Android/Sdk}
unset ANDROID_SDK_ROOT
if ! "${JAVA_HOME:-/nonexistent}/bin/java" -version 2>&1 | grep -q '"17\.'; then
  jdk=$(ls -d "$HOME"/.gradle/jdks/*17* 2>/dev/null | grep -v '\.lock$' | grep -v '\.tar\.gz$' | head -1 || true)
  [ -n "$jdk" ] || die "no JDK 17: set JAVA_HOME to one"
  export JAVA_HOME=$jdk
fi

python3 scripts/brand.py --check || die "the branding resources are out of date: run scripts/brand.py and commit them"
npm ci --no-audit --no-fund --silent
(cd android && ./gradlew --no-daemon -q assembleRootiestRelease)
apk=android/app/build/outputs/apk/rootiest/release/app-rootiest-release.apk

apksigner=$(ls -d "$ANDROID_HOME"/build-tools/*/apksigner 2>/dev/null | sort -V | tail -1 || true)
[ -x "$apksigner" ] || die "apksigner not found under $ANDROID_HOME/build-tools"
got=$("$apksigner" verify --print-certs "$apk" 2>/dev/null | sed -n 's/^Signer #1 certificate SHA-256 digest: //p')
[ "$got" = "$CERT" ] || die "$apk is not signed with the release key (got ${got:-nothing}); is rootiest.mail.signing set in ~/.gradle/gradle.properties?"

out=$(mktemp -d)
# Obtainium finds the APK with the filter ^rootiest-mail-[0-9]
cp "$apk" "$out/rootiest-mail-$ver.apk"
# notes: the upstream release it is based on, then the pull requests merged here since the last release (all of them
# for the first). Upstream's own merges are GitHub's "Merge pull request #N from ...", which the pattern skips.
last=$(git describe --tags --abbrev=0 --match 'v*-r*' 2>/dev/null || true)
{
  echo "Based on [Bulwark Mobile $upstream]($UPSTREAM/releases/tag/$upstream)."
  echo
  git log --merges --format=%s ${last:+"$last..HEAD"} |
    sed -n "s/^Merge pull request '\(.*\)' (#\([0-9]*\)).*/- \1 (#\2)/p"
} > "$out/notes.md"

echo "release: $tag, $(grep -c '^- ' "$out/notes.md" || true) pull requests, $(du -h "$out/rootiest-mail-$ver.apk" | cut -f1) APK signed with the release key"
if [ $dry = 1 ]; then
  cat "$out/notes.md"
  echo "release: dry run, nothing published ($out)"
  exit 0
fi
gt release create "$tag" --repo "$REPO" --target "$(git rev-parse HEAD)" --title "$tag" --no-input \
  --notes-file "$out/notes.md" --asset "$out/rootiest-mail-$ver.apk"
echo "release: published https://git.rootiest.dev/$REPO/releases/tag/$tag"
