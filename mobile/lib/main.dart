import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_colors.dart';
import 'core/theme/app_typography.dart';
import 'presentation/screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Force AMOLED-friendly dark system UI
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppColors.forestDeep,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Lock to portrait — this is a one-tap app, not a landscape experience
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);

  runApp(
    const ProviderScope(
      child: AuraFloraApp(),
    ),
  );
}

/// Root application widget.
class AuraFloraApp extends StatelessWidget {
  const AuraFloraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AuraFlora',
      debugShowCheckedModeBanner: false,

      // AMOLED-first dark theme
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: const ColorScheme.dark(
          surface: AppColors.forestDeep,
          primary: AppColors.herbal,
          secondary: AppColors.herbalLight,
          onSurface: AppColors.sand,
          onPrimary: AppColors.sand,
          error: AppColors.errorMuted,
        ),
        scaffoldBackgroundColor: AppColors.forestDeep,
        textTheme: AppTypography.textTheme,
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        pageTransitionsTheme: const PageTransitionsTheme(
          builders: {
            TargetPlatform.android: FadeUpwardsPageTransitionsBuilder(),
            TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
          },
        ),
      ),

      home: const HomeScreen(),
    );
  }
}
