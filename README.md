# Rootiest Mail for Android

<img alt="Rootiest Mail" src="https://pages.rootiest.fyi/icons/color/rootiest-mail.svg" width="128" height="128" />

**Rootiest Mail** is the Android app for [Rootiest Mail](https://email.rootiest.fyi), the Rootiest mail service on
[Stalwart](https://stalw.art). It's a modified version of [Bulwark Mobile](https://github.com/bulwarkmail/native), so it
also works with any other JMAP server Bulwark Mobile supports.

## A modified version of Bulwark Mobile

This app is based on [Bulwark Mobile](https://github.com/bulwarkmail/native) by the Bulwark project authors. It was forked
from Bulwark Mobile 0.1.96 on 2026-11-26 and has been modified since. Bulwark's authors haven't endorsed or reviewed it,
so please report problems with this app to Rootiest, not to Bulwark.

What it changes from Bulwark Mobile:

- **Name and identity:**
  - It's called Rootiest Mail, with its own app ID (`dev.rootiest.mail`), launcher icon, notification icon and logo.
  - It installs alongside Bulwark Mobile.
  - It names itself Rootiest Mail in every language the app speaks.
- **Sign-in:** **Sign in with RootiestID** comes first on the sign-in screen. It signs in in the browser with the
  app's own RootiestID client, straight to Rootiest's mail server, with no computer needed. In RootiestID it shows as its
  own app ("Rootiest Mail App"), so it can be signed out on its own. Scanning a code from the webmail still works.
- **Colors:** its default theme is the Rootiest palette, the same as the Rootiest webmail's: Catppuccin Mocha with a green
  accent in dark mode, and Latte with a flamingo accent in light mode.
- **Account avatars:** the account lists show the photo of the contact with the account's own address, as the webmail does.
  Each account can also have its own color: tap its avatar in Settings › Account › Logged-in accounts and pick one of the
  theme's accents, or Automatic for the color from the address. The color stays on the device.
- **Notifications:** they come through Rootiest's own push relay (`relay.rootiest.dev`), by Google push (Firebase
  project `rootiest-mail`) by default, or by [UnifiedPush](https://unifiedpush.org) through a distributor such as
  [ntfy](https://ntfy.sh). Settings › Notifications switches between them.
- **Updates:** it has no built-in updater. Releases are published here for [Obtainium](https://obtainium.imranr.dev) and
  on Google Play's closed testing track.
- **Source and support:** Settings › About links to this repository and to Bulwark Mobile, and **Report a problem**
  opens a request on [support.rootiest.dev](https://support.rootiest.dev) with the app version filled in.

The git history has every change, with dates. All of them are in the `rootiest` build flavor (below), so Bulwark
Mobile's own builds are unchanged.

## Installing

Get it from Google Play's closed test, or from the releases here with Obtainium. Both are signed with the same key, so
either one updates the other. It installs alongside Bulwark Mobile.

### Google Play (closed testing)

Rootiest Mail is in closed testing on Google Play. Anyone can join. Do all three steps with **the same Google account
your phone's Play Store uses**:

1. **Join** the [Rootiest Mail Google Group](https://groups.google.com/g/rootiest-mail).
2. **Opt in** to testing at
   [play.google.com/apps/testing/dev.rootiest.mail](https://play.google.com/apps/testing/dev.rootiest.mail). It works
   from any browser.
3. **Install** it from [Google Play](https://play.google.com/store/apps/details?id=dev.rootiest.mail). Updates then
   arrive like any other app's.

Please keep the app installed for at least **14 days**: Google needs that before the app can be published to everyone.

- **Already got a "welcome to the group" email?** You're a member: go straight to step 2.
- **"Item not found" in the Play Store:** the Play Store is signed in to a different Google account than the one in the
  group. Switch accounts in the Play Store (tap your profile picture), then open the install link again.
- **The opt-in page says you can't join:** you're not in the group yet, or you just joined. Wait a few minutes and
  reload. Google can take up to an hour to pass new testers through.

The group is for announcements only. To report a problem, go to [support.rootiest.dev](https://support.rootiest.dev).

### Obtainium

Each release is on the [Releases page](https://git.rootiest.dev/rootiest/rootiest-mail-android/releases) as a signed
APK. To let Obtainium install it and keep it updated, add it in one of three ways:

- **One tap:** on the phone, open [Add Rootiest Mail to Obtainium][obtainium].
- **From a file:** download
  [`rootiest-mail.json`](https://git.rootiest.dev/rootiest/rootiest-mail-android/raw/branch/main/obtainium/rootiest-mail.json) and import it
  in Obtainium under **Settings → Import/export → Obtainium import**.
- **By hand:** add the app from `https://git.rootiest.dev/rootiest/rootiest-mail-android` with the Forgejo source and
  the APK filter `^rootiest-mail-[0-9]`.

[obtainium]: https://apps.obtainium.imranr.dev/redirect?r=obtainium://app/%7B%22id%22%3A%22dev.rootiest.mail%22%2C%22url%22%3A%22https%3A%2F%2Fgit.rootiest.dev%2Frootiest%2Frootiest-mail-android%22%2C%22author%22%3A%22rootiest%22%2C%22name%22%3A%22Rootiest%20Mail%22%2C%22preferredApkIndex%22%3A0%2C%22additionalSettings%22%3A%22%7B%5C%22includePrereleases%5C%22%3Afalse%2C%5C%22includeDrafts%5C%22%3Afalse%2C%5C%22fallbackToOlderReleases%5C%22%3Atrue%2C%5C%22filterReleaseTitlesByRegEx%5C%22%3A%5C%22%5C%22%2C%5C%22invertReleaseTitlesFilter%5C%22%3Afalse%2C%5C%22filterReleaseNotesByRegEx%5C%22%3A%5C%22%5C%22%2C%5C%22invertReleaseNotesFilter%5C%22%3Afalse%2C%5C%22verifyLatestTag%5C%22%3Afalse%2C%5C%22sortMethodChoice%5C%22%3A%5C%22date%5C%22%2C%5C%22useLatestAssetDateAsReleaseDate%5C%22%3Afalse%2C%5C%22releaseTitleAsVersion%5C%22%3Afalse%2C%5C%22versionExtractionRegEx%5C%22%3A%5C%22%5C%22%2C%5C%22matchGroupToUse%5C%22%3A%5C%22%5C%22%2C%5C%22versionDetection%5C%22%3Afalse%2C%5C%22releaseDateAsVersion%5C%22%3Afalse%2C%5C%22useVersionCodeAsOSVersion%5C%22%3Afalse%2C%5C%22apkFilterRegEx%5C%22%3A%5C%22%5Erootiest-mail-%5B0-9%5D%5C%22%2C%5C%22invertAPKFilter%5C%22%3Afalse%2C%5C%22autoApkFilterByArch%5C%22%3Atrue%2C%5C%22minimumUpdateAgeDays%5C%22%3A%5C%22%5C%22%2C%5C%22exemptFromBackgroundUpdates%5C%22%3Afalse%2C%5C%22skipUpdateNotifications%5C%22%3Afalse%2C%5C%22refreshBeforeDownload%5C%22%3Afalse%2C%5C%22detectionDateAsReleaseDate%5C%22%3Afalse%2C%5C%22trackOnly%5C%22%3Afalse%2C%5C%22appName%5C%22%3A%5C%22%5C%22%2C%5C%22appAuthor%5C%22%3A%5C%22%5C%22%2C%5C%22installerMode%5C%22%3A%5C%22%5C%22%2C%5C%22shizukuPretendToBeGooglePlay%5C%22%3Afalse%2C%5C%22allowInsecure%5C%22%3Afalse%2C%5C%22allowedSigningCertHashes%5C%22%3A%5C%22%5C%22%2C%5C%22about%5C%22%3A%5C%22%5C%22%2C%5C%22updateHealthStaleRelease%5C%22%3A%5C%22%5C%22%2C%5C%22updateHealthStaleVersion%5C%22%3A%5C%22%5C%22%2C%5C%22updateHealthFailedChecks%5C%22%3A%5C%22%5C%22%2C%5C%22updateHealthArchived%5C%22%3A%5C%22%5C%22%2C%5C%22updateHealthFilteredReleases%5C%22%3A%5C%22%5C%22%7D%22%2C%22overrideSource%22%3A%22Codeberg%22%7D

Release versions are Bulwark Mobile's version plus a Rootiest revision. For example, `0.1.96-r1` is the first Rootiest
release based on Bulwark Mobile 0.1.96.

### Signing in

Tap **Sign in with RootiestID** and sign in to RootiestID in the browser that opens. You need to be in RootiestID's `mail`
group, as for the webmail.

You can also sign in from a computer: open the Rootiest webmail, go to **Settings → Security → Link Mobile App**, and
scan the code with **Scan a sign-in code**.

## Building

You need Node 22, JDK 17 and the Android SDK, with `sdk.dir` set in `android/local.properties` (Gradle reads it before
`ANDROID_HOME`, and it's not committed) or `ANDROID_HOME` set.

```sh
npm ci
npm run typecheck && npm test
cd android
./gradlew assembleRootiestDebug   # app/build/outputs/apk/rootiest/debug/app-rootiest-debug.apk
./gradlew installRootiestDebug    # onto a connected device
```

Builds are arm64 only, as upstream's. For an x86_64 emulator add `-PreactNativeArchitectures=x86_64`.

The app has three build flavors. `github` and `play` are upstream's; `rootiest` is set up in `android/app/rootiest.gradle`.
`android/app/build.gradle` applies that file and is otherwise upstream's.

| Flavor | Builds |
|---|---|
| `rootiest` | Rootiest Mail, `dev.rootiest.mail` |
| `github`, `play` | Bulwark Mobile as upstream ships it, to compare against |

Where the Rootiest code lives:

- **Android resources:** `android/app/src/rootiest/` overrides upstream's resources by name.
- **App code:** `src/lib/rootiest.ts` says whether this is the Rootiest build and holds its values. Upstream's code reads
  it in the few places that differ.
- **Generated files:** `scripts/brand.py` generates them, from upstream's files and from
  [rootiest-icons](https://git.rootiest.dev/rootiest/rootiest-icons), expected next to this checkout:
  - the app name, launcher and notification icons, splash logo and in-app logo
  - `locales/rootiest/strings.json`: the strings that name Bulwark, in every language, naming Rootiest Mail instead
  - `src/theme/rootiest-theme.ts`: the Rootiest theme, from the webmail theme's stylesheet

`python3 scripts/brand.py --check` reports any generated file that's out of date; CI runs it.

CI runs on GitHub, on the branches the push mirror copies there: the type check, the tests and a debug APK.

## Updating to a new Bulwark Mobile release

1. Merge the upstream release on a branch:

   ```sh
   git fetch upstream --tags
   git merge <tag>
   ```

2. Run `python3 scripts/brand.py` and review `git diff`. Strings that upstream added or reworded and that name Bulwark
   are picked up here.
3. Reset `rootiestRevision` in `android/app/rootiest.gradle` to 1.
4. Build the `rootiest` flavor and run the tests, then open a pull request.

## Releases

Releases are signed with the Rootiest Mail release key, which is never in this repository.

- **Where the key is set:** the Gradle property `rootiest.mail.signing` in `~/.gradle/gradle.properties` names a
  properties file with `storeFile`, `storePassword`, `keyAlias` and `keyPassword`.
- **Without the property:** a `rootiest` release build stops. Upstream's `BULWARK_RELEASE_*` key isn't used.

To release:

1. Raise `rootiestRevision` in `android/app/rootiest.gradle` (or merge a new upstream release) through a pull request.
2. On `main`, run `scripts/release.sh --dry-run`, then `scripts/release.sh`. It needs `gt`, the Gitea CLI (package
   `gitea-cli`), signed in to `https://git.rootiest.dev`.

It publishes `rootiest-mail-<version>.apk` as the Gitea release `v<version>`, with the pull requests merged since the
last release as its notes. It refuses an APK that isn't signed with the release certificate pinned in the script.

### Google Play

`scripts/release.sh` also builds `rootiest-mail-<version>.aab` into `build/play/`, after the same certificate check.
The bundle carries the arm64-v8a, armeabi-v7a and x86_64 libraries, and Play gives each device its own; the Obtainium
APK stays arm64 only.

- **Signing:** Play signs with the release key itself (Play App Signing set to the existing key). A key Google
  generated would be a different certificate, so a Play install and an Obtainium install couldn't update each other.
- **Upload:** after the Gitea release, `release.sh` releases the bundle on the `internal` and `alpha` tracks (internal
  and closed testing) with `scripts/play-upload.py`, in one Play edit. Its release notes list only the pull requests
  people notice in the app (`feat`, `fix` and `perf`, not those scoped to `build`, `ci`, `deps` or `release`), without
  the type or number, with product names spelled properly (`play_names` in `release.sh`), cut to Play's 500
  characters. `--dry-run` signs in and lists the tracks instead. If the upload fails, the Gitea release is already out,
  and `release.sh` prints the command to retry it.
- **Promoting:** a version already on internal testing goes to closed testing on its own with
  `scripts/play-upload.py --package dev.rootiest.mail --promote internal=alpha` (nothing is uploaded).
- **The Play key:** it signs in as the service account `rootiest-apps-publish@rootiest-apps.iam.gserviceaccount.com`,
  which Play Console's Users and permissions lets release the Rootiest apps. Its JSON key is
  `~/.local/share/android/play-publisher.json` (mode 600, or `$PLAY_KEY`), shared with the other Rootiest apps.
  Without it, `release.sh` leaves the bundle in `build/play/` to upload in Play Console by hand.
- `play-upload.py` needs only Python's standard library and `openssl`. If Play won't send the edit for review because
  the app has other unfinished changes, it commits without sending and says so: check Publishing overview.

## License

Rootiest Mail for Android is free software under the [GNU Affero General Public License, version 3 only](LICENSE),
with the same additional permission for app stores as Bulwark Mobile. Copyright © 2026 the Bulwark Project Authors, and © 2026 Rootiest for the changes listed above.
