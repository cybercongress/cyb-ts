// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod ipfs;

use ipfs::{
    check_ipfs, download_and_extract_ipfs, init_ipfs, is_ipfs_initialized, is_ipfs_running,
    start_ipfs, stop_ipfs,
};
use tauri::generate_handler;

fn main() {
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
