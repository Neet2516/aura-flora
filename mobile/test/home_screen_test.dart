import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:aura_flora/presentation/screens/home_screen.dart';
import 'package:aura_flora/core/theme/app_colors.dart';

void main() {
  group('HomeScreen Widget Tests', () {
    Widget buildApp() {
      return const ProviderScope(
        child: MaterialApp(
          home: HomeScreen(),
        ),
      );
    }

    testWidgets('renders AURAFLORA title', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pump();

      expect(find.text('AURAFLORA'), findsOneWidget);
    });

    testWidgets('renders tagline text', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pump();

      expect(find.text('PRESS · LISTEN · GO'), findsOneWidget);
    });

    testWidgets('renders mic icon in idle state', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pump();

      expect(find.byIcon(Icons.mic_rounded), findsOneWidget);
    });

    testWidgets('background is forest deep color', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pump();

      final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
      expect(scaffold.backgroundColor, equals(AppColors.forestDeep));
    });

    testWidgets('record button is present and tappable', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.pump();

      final micIcon = find.byIcon(Icons.mic_rounded);
      expect(micIcon, findsOneWidget);

      // Should not throw
      await tester.tap(micIcon, warnIfMissed: false);
      await tester.pump();
    });
  });
}
