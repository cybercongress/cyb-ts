//! chainsync — the chain's blocks reach the brain.
//!
//! `relay.rs` pushes: this body's own signals move outward to the chain.
//! This is the other half — every configured network's own signal log
//! flows back into the local cell, so blocks nobody here cast (another
//! body's casts, this body's own once round-tripped through the chain)
//! still become particles and axons brain can draw. `Cell::absorb` already
//! dedups on equivocation, so a byte range fetched twice costs nothing but
//! the fetch.
//!
//! Byte-offset high-water marks in `~/cyb/synced` ("name offset" lines)
//! make every pass one `GET /log?from=<mark>` — no replay, no flood, same
//! shape as relay's own marks file.

use std::collections::HashMap;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::time::Duration;

use super::networks::NetHub;
use crate::worlds::SharedCell;

/// Chain history does not need second-scale mirroring — relay's 5s cadence
/// is for a live body's own casts; absorbing back is a slower, best-effort
/// pass.
const PASS_EVERY: Duration = Duration::from_secs(7);

#[derive(Clone, Default)]
pub struct ChainSync {
    /// Signals absorbed into the local cell this session, across all nets.
    pub absorbed: Arc<AtomicU64>,
}

fn marks_file() -> std::path::PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".into());
    std::path::Path::new(&home).join("cyb").join("synced")
}

fn load_marks() -> HashMap<String, usize> {
    std::fs::read_to_string(marks_file())
        .map(|text| {
            text.lines()
                .filter_map(|l| {
                    let (n, o) = l.split_once(' ')?;
                    Some((n.to_string(), o.trim().parse().ok()?))
                })
                .collect()
        })
        .unwrap_or_default()
}

fn save_marks(marks: &HashMap<String, usize>) {
    let mut text = String::new();
    for (n, o) in marks {
        text.push_str(&format!("{n} {o}\n"));
    }
    let _ = std::fs::write(marks_file(), text);
}

impl ChainSync {
    pub fn start(shared: SharedCell, hub: NetHub) -> Self {
        let sync = ChainSync::default();
        let absorbed = sync.absorbed.clone();

        std::thread::Builder::new()
            .name("body-chainsync".into())
            .spawn(move || {
                let mut marks = load_marks();
                // Timeouts matter here exactly like relay's POSTs: a
                // black-holed GET must cost one pass, never the thread.
                let agent = super::networks::agent();
                loop {
                    std::thread::sleep(PASS_EVERY);
                    let nets: Vec<(String, String)> = hub
                        .states
                        .lock()
                        .ok()
                        .map(|v| v.iter().map(|n| (n.name.clone(), n.url.clone())).collect())
                        .unwrap_or_default();
                    if nets.is_empty() {
                        continue;
                    }

                    let mut dirty = false;
                    for (name, url) in nets {
                        let from = marks.get(&name).copied().unwrap_or(0);
                        let fetched = agent
                            .get(&format!("{url}/log?from={from}"))
                            .call()
                            .ok()
                            .and_then(|mut r| r.body_mut().read_to_vec().ok());
                        let Some(bytes) = fetched else { continue };
                        if bytes.is_empty() {
                            continue;
                        }
                        let applied = {
                            let mut cell = shared.cell.lock().expect("shared cell poisoned");
                            cell.absorb(&bytes)
                        };
                        marks.insert(name, from + bytes.len());
                        dirty = true;
                        if applied > 0 {
                            absorbed.fetch_add(applied as u64, Ordering::Relaxed);
                        }
                    }
                    if dirty {
                        // Brain re-derives on its next OnEnter; the bump is
                        // for any reader that starts watching versions later.
                        shared.bump();
                        save_marks(&marks);
                    }
                }
            })
            .expect("spawn body-chainsync");
        sync
    }
}
