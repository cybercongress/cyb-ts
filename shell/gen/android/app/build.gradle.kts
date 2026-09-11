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

    // Pixel 8+/10 use 16 KB pages. mmap of .so from the APK
    // (extractNativeLibs=false) then fails install with a blank
    // "App not installed". Extract at install; debug and release
    // share the same key so they upgrade each other.
    packaging {
        jniLibs {
            useLegacyPackaging = true
        }
    }

    val ks = file("${System.getProperty("user.home")}/.cyb-release.keystore")
    val ksPassFile = file("${System.getProperty("user.home")}/.cyb-release.keystore.pass")
    if (ks.exists() && ksPassFile.exists()) {
        val pass = ksPassFile.readText().trim()
        signingConfigs {
            create("cyb") {
                storeFile = ks
                storePassword = pass
                keyAlias = "cyb"
                keyPassword = pass
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt")
            )
            signingConfigs.findByName("cyb")?.let { signingConfig = it }
        }
        debug {
            isDebuggable = true
            signingConfigs.findByName("cyb")?.let { signingConfig = it }
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
