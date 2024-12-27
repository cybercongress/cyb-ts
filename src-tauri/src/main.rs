// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod ipfs;
mod server;
mod utils;

use std::sync::Arc;

use db::DbState;
use ipfs::{
    check_if_ipfs_exists, download_and_extract_ipfs, init_ipfs, is_ipfs_initialized,
    is_ipfs_running, start_ipfs, stop_ipfs,
};
use server::start_server;
use tauri::{generate_handler, Manager};
use utils::update_splash_message;

#[tokio::main]
async fn main() {
    let app_state = Arc::new(DbState::new());

    tokio::spawn(async move {
        println!("[CYB.AI] Starting server...");
        start_server(app_state).await;
        println!("[CYB.AI] Server is started!");
    });

    tauri::Builder::default()
        .invoke_handler(generate_handler![
            download_and_extract_ipfs,
            start_ipfs,
            stop_ipfs,
            check_if_ipfs_exists,
            is_ipfs_running,
            is_ipfs_initialized,
            init_ipfs
        ])
        .setup(|app| {
            println!("[CYB.AI] Starting setup...");

            println!("[CYB.AI] Getting splash screen window...");
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            println!("[CYB.AI] Splash screen window reference is obtained!");

            println!("[CYB.AI] Going to show splash screen window...");
            splashscreen_window.show().unwrap();
            println!("[CYB.AI] Splash screen window must be shown!");

            println!("[CYB.AI] Getting main window...");
            let main_window = app.get_window("main").unwrap();
            println!("[CYB.AI] Main window reference is obtained!");

            tauri::async_runtime::spawn(async move {
                println!("[CYB.AI] IPFS initialization...");
                update_splash_message(splashscreen_window.clone(), "IPFS initialization...");

                if let Err(e) = start_ipfs().await {
                    eprintln!("Failed to start IPFS: {:?}", e);
                    update_splash_message(splashscreen_window.clone(), "Failed to start IPFS");
                } else {
                    update_splash_message(splashscreen_window.clone(), "IPFS started successfully");
                }
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

                println!("[CYB.AI] Going to show main window...");
                main_window.show().unwrap();
                println!("[CYB.AI] Main window must be shown!");

                println!("[CYB.AI] Going to close splash screen window...");
                splashscreen_window.close().unwrap();
                println!("[CYB.AI] Splash screen window must be closed!");
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
