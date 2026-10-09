import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:aura_flora/presentation/screens/blackout_screen.dart';
import 'package:aura_flora/core/theme/app_colors.dart';
import 'package:aura_flora/services/api_client.dart';

void main() {
  group('BlackoutScreen Widget Tests', () {
    // Minimal mock GroundResponse for testing
    final mockResponse = GroundResponse(
      prompt: 'Place your bare hand on the nearest tree bark.',
      audioUrl: '/audio/test-silence.mp3',
      features: const AcousticFeatures(
        spectralCentroid: 3500.0,
        spectralEntropy: 5.2,
        biophonyRatio: 0.7,
        rmsDb: -28.0,
        zeroCrossingRate: 0.06,
      ),
      classification: const ClassificationResult(
        biophonyScore: 0.7,
        anthrophonyScore: 0.3,
        environmentTag: 'forest',
      ),
    );

    Widget buildBlackout() {
      return MaterialApp(
        home: BlackoutScreen(response: mockResponse),
      );
    }

    testWidgets('background is pure black', (tester) async {
      await tester.pumpWidget(buildBlackout());
      await tester.pump();

      final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
      expect(scaffold.backgroundColor, equals(AppColors.blackout));
    });

    testWidgets('hint text is present (barely visible via Opacity)', (tester) async {
      await tester.pumpWidget(buildBlackout());
      // Advance past the 1500ms hint fade-in delay
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();

      expect(find.text('Screen locked. Look up.'), findsOneWidget);
    });

    testWidgets('double-tap hint text is present', (tester) async {
      await tester.pumpWidget(buildBlackout());
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();

      expect(find.text('Double-tap to exit'), findsOneWidget);
    });

    testWidgets('double-tap on screen triggers pop', (tester) async {
      bool popped = false;

      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (context) => TextButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => BlackoutScreen(response: mockResponse),
                ),
              ).then((_) => popped = true);
            },
            child: const Text('Open'),
          ),
        ),
      ));

      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      // Double-tap the blackout screen
      await tester.tap(find.byType(GestureDetector).first);
      await tester.pump(const Duration(milliseconds: 200));
      await tester.tap(find.byType(GestureDetector).first);
      await tester.pumpAndSettle();

      expect(popped, isTrue);
    });
  });
}
