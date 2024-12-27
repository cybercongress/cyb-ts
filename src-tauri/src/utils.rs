use tauri::{Manager, Window};

pub fn update_splash_message(window: Window, message: &str) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        // Call JavaScript function to update the splash screen message
        let _ = splashscreen.eval(&format!("updateSplashMessage('{}')", message));
    }
}
