// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod ipfs;
mod server;

use std::sync::Arc;

use db::DbState;
use ipfs::{
    check_ipfs, download_and_extract_ipfs, init_ipfs, is_ipfs_initialized, is_ipfs_running,
    start_ipfs, stop_ipfs,
};
use server::start_server;
use tauri::generate_handler;

#[tokio::main]
async fn main() {
    let app_state = Arc::new(DbState::new());

    tokio::spawn(async move {
        start_server(app_state).await;
    });

    tauri::Builder::default()
        .invoke_handler(generate_handler![
            download_and_extract_ipfs,
            start_ipfs,
            stop_ipfs,
            check_ipfs,
            is_ipfs_running,
            is_ipfs_initialized,
            init_ipfs
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
