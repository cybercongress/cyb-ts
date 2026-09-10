plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "ai.cyb.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "ai.cyb.app"
        minSdk = 24
        targetSdk = 34
        // The release number comes from shell/Cargo.toml via the Makefile
        // (-PcybVersionCode/-PcybVersionName), so the APK, the version chip
        // and the GitHub tag are one number. Defaults keep a bare
        // `./gradlew` build working outside make.
        versionCode = (findProperty("cybVersionCode") as String?)?.toInt() ?: 1
        versionName = (findProperty("cybVersionName") as String?) ?: "0.0.0-dev"

        ndk {
            abiFilters += listOf("arm64-v8a")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt")
            )
        }
        debug {
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        buildConfig = true
    }

    sourceSets {
        getByName("main") {
            jniLibs.srcDirs("src/main/jniLibs")
            assets.srcDirs("src/main/assets")
        }
    }
}

dependencies {
    // GameActivity — the Java half of android-activity 0.6 (bevy_winit's
    // default Android backend). Version pairs with the crate's vendored csrc.
    // GameActivity 4.x extends AppCompatActivity, hence appcompat.
    implementation("androidx.games:games-activity:4.4.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
}
