use serde::Serialize;
use std::fs::{self, File};
use std::io::copy;
use std::process::Command;

fn get_ipfs_download_url() -> Result<&'static str, String> {
    if cfg!(target_os = "windows") {
        Ok("https://dist.ipfs.io/kubo/v0.29.0/kubo_v0.29.0_windows-amd64.zip")
    } else if cfg!(target_os = "macos") {
        if cfg!(target_arch = "x86_64") {
            Ok("https://dist.ipfs.io/kubo/v0.29.0/kubo_v0.29.0_darwin-amd64.tar.gz")
        } else if cfg!(target_arch = "aarch64") {
            Ok("https://dist.ipfs.io/kubo/v0.29.0/kubo_v0.29.0_darwin-arm64.tar.gz")
        } else {
            Err("Unsupported macOS architecture".into())
        }
    } else if cfg!(target_os = "linux") {
        Ok("https://dist.ipfs.io/kubo/v0.29.0/kubo_v0.29.0_linux-amd64.tar.gz")
    } else {
        Err("Unsupported operating system".into())
    }
}

#[tauri::command]
pub async fn download_and_extract_ipfs() -> Result<(), String> {
    let home_dir = dirs::home_dir().ok_or("Cannot find home directory")?;
    let cyb_dir = home_dir.join(".cyb");

    // Create the ~/.cyb directory if it doesn't exist
    if !cyb_dir.exists() {
        fs::create_dir_all(&cyb_dir).map_err(|e| e.to_string())?;
    }

    let url = get_ipfs_download_url()?;
    let response = reqwest::get(url).await.map_err(|e| e.to_string())?;
    let tar_path = cyb_dir.join("kubo-ipfs-binary.tar.gz");

    let mut file = File::create(&tar_path).map_err(|e| e.to_string())?;
    copy(
        &mut response.bytes().await.map_err(|e| e.to_string())?.as_ref(),
        &mut file,
    )
    .map_err(|e| e.to_string())?;

    // Extract the tar.gz
    let output = Command::new("tar")
        .arg("-xzf")
        .arg(tar_path.to_str().ok_or("Invalid tar path")?)
        .arg("-C")
        .arg(cyb_dir.to_str().ok_or("Invalid extraction directory")?)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into())
    }
}

#[derive(Debug, Serialize)]
pub enum IpfsError {
    AlreadyRunning,
    HomeDirNotFound,
    // CommandFailed(String),
    ConfigError(String),
    Other(String),
}

#[tauri::command]
pub fn start_ipfs() -> Result<(), IpfsError> {
    let home_dir = dirs::home_dir().ok_or(IpfsError::HomeDirNotFound)?;
    let cyb_dir = home_dir.join(".cyb");
    let ipfs_binary = cyb_dir.join("kubo/ipfs"); // Adjust based on the extracted path

    // Check if IPFS is already running
    let is_running = Command::new("pgrep")
        .arg("ipfs")
        .output()
        .map_err(|e| IpfsError::Other(e.to_string()))?;

    if is_running.status.success() {
        return Err(IpfsError::AlreadyRunning);
    }

    // Start the IPFS daemon
    Command::new(&ipfs_binary)
        .arg("daemon")
        .spawn()
        .map_err(|e| IpfsError::Other(e.to_string()))?;

    // Configure IPFS to allow all origins
    let config_output1 = Command::new(&ipfs_binary)
        .arg("config")
        .arg("--json")
        .arg("API.HTTPHeaders.Access-Control-Allow-Origin")
        .arg(r#"["*"]"#)
        .output()
        .map_err(|e| IpfsError::Other(e.to_string()))?;

    if !config_output1.status.success() {
        return Err(IpfsError::ConfigError(
            String::from_utf8_lossy(&config_output1.stderr).into(),
        ));
    }

    // Configure IPFS to allow specific HTTP methods
    let config_output2 = Command::new(&ipfs_binary)
        .arg("config")
        .arg("--json")
        .arg("API.HTTPHeaders.Access-Control-Allow-Methods")
        .arg(r#"["PUT", "POST", "GET"]"#)
        .output()
        .map_err(|e| IpfsError::Other(e.to_string()))?;

    if config_output2.status.success() {
        Ok(())
    } else {
        Err(IpfsError::ConfigError(
            String::from_utf8_lossy(&config_output2.stderr).into(),
        ))
    }
}

#[tauri::command]
pub fn stop_ipfs() -> Result<(), String> {
    let home_dir = dirs::home_dir().ok_or("Cannot find home directory")?;
    let cyb_dir = home_dir.join(".cyb");
    let ipfs_binary = cyb_dir.join("kubo/ipfs"); // Adjust based on the extracted path

    Command::new(ipfs_binary)
        .arg("shutdown")
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn check_ipfs() -> Result<bool, String> {
    let home_dir = dirs::home_dir().ok_or("Cannot find home directory")?;
    let cyb_dir = home_dir.join(".cyb");
    let ipfs_binary = cyb_dir.join("kubo/ipfs"); // Adjust based on the extracted path
    let ipfs_exists = ipfs_binary.exists();

    Ok(ipfs_exists)
}

#[tauri::command]
pub fn is_ipfs_running() -> Result<bool, String> {
    let output = Command::new("pgrep")
        .arg("ipfs")
        .output()
        .map_err(|e| e.to_string())?;

    Ok(output.status.success())
}

#[tauri::command]
pub fn init_ipfs() -> Result<(), String> {
    let home_dir = dirs::home_dir().ok_or("Cannot find home directory")?;
    let cyb_dir = home_dir.join(".cyb");
    let ipfs_binary = cyb_dir.join("kubo/ipfs"); // Adjust based on the extracted path

    let output = Command::new(&ipfs_binary)
        .arg("init")
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into())
    }
}

#[tauri::command]
pub fn is_ipfs_initialized() -> Result<bool, String> {
    let home_dir = dirs::home_dir().ok_or("Cannot find home directory")?;
    let cyb_dir = home_dir.join(".cyb");
    let ipfs_binary = cyb_dir.join("kubo/ipfs"); // Adjust based on the extracted path

    let output = Command::new(&ipfs_binary)
        .arg("config")
        .arg("show")
        .output()
        .map_err(|e| e.to_string())?;

    Ok(output.status.success())
}
