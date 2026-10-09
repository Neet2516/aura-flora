# Workflow: Flutter Mobile — Analyze & Widget Test Verification

## Prerequisites
- Flutter SDK ≥ 3.19.x (stable channel)
- Android SDK or iOS Simulator available
- `flutter pub get` run after any `pubspec.yaml` change

## Steps

### 1. Dependency Fetch
```bash
cd mobile
flutter pub get
```
Expected: All packages resolved, no version conflicts.

### 2. Static Analysis
```bash
flutter analyze
```
Expected: `No issues found!`
Zero errors, zero warnings, zero hints.

### 3. Widget Tests
```bash
flutter test
```
Expected: All widget tests pass. Key test files:
- `test/home_screen_test.dart` — renders record button, shows pulse animation
- `test/blackout_screen_test.dart` — renders black canvas, registers double-tap

### 4. Build APK (debug — CI verification only)
```bash
flutter build apk --debug
```
Expected: APK produced at `build/app/outputs/flutter-apk/app-debug.apk`

### 5. Lint Auto-fix (optional)
```bash
dart fix --apply
```

## Checklist
- [ ] `flutter pub get` clean
- [ ] `flutter analyze` zero issues
- [ ] `flutter test` all green
- [ ] `flutter build apk --debug` succeeds
