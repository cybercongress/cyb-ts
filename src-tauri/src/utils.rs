use tauri::{Manager, Window};

pub async fn update_splash_message(window: Window, message: String) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        // Call JavaScript function to update the splash screen message
        let _ = splashscreen.eval(&format!("updateSplashMessage('{}')", message));
    }
}
