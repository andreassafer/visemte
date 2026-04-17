use tauri::menu::{AboutMetadata, Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::Emitter;
use sys_locale::get_locale;

const APP_BUILD:  &str = env!("APP_BUILD");
const APP_TARGET: &str = env!("APP_TARGET");

#[tauri::command]
fn app_target() -> &'static str {
    APP_TARGET
}

fn is_german() -> bool {
    get_locale()
        .unwrap_or_default()
        .to_lowercase()
        .starts_with("de")
}

fn build_menu(app: &tauri::AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    let de = is_german();

    // ── App menu ──────────────────────────────────────────────────────────────
    let check_updates = MenuItem::with_id(
        app,
        "check-updates",
        if de { "Nach Updates suchen\u{2026}" } else { "Check for Updates\u{2026}" },
        true,
        None::<&str>,
    )?;

    let app_menu = Submenu::with_items(
        app,
        "Visemte",
        true,
        &[
            &PredefinedMenuItem::about(
                app,
                Some(if de { "Über Visemte" } else { "About Visemte" }),
                Some(AboutMetadata {
                    version:       Some(app.package_info().version.to_string()),
                    short_version: Some(APP_BUILD.to_string()),
                    ..Default::default()
                }),
            )?,
            &check_updates,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::services(app, Some(if de { "Dienste" } else { "Services" }))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::hide(app, Some(if de { "Visemte ausblenden" } else { "Hide Visemte" }))?,
            &PredefinedMenuItem::hide_others(app, Some(if de { "Andere ausblenden" } else { "Hide Others" }))?,
            &PredefinedMenuItem::show_all(app, Some(if de { "Alle einblenden" } else { "Show All" }))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::quit(app, Some(if de { "Visemte beenden" } else { "Quit Visemte" }))?,
        ],
    )?;

    // ── Edit menu ─────────────────────────────────────────────────────────────
    let edit_menu = Submenu::with_items(
        app,
        if de { "Bearbeiten" } else { "Edit" },
        true,
        &[
            &PredefinedMenuItem::undo(app, Some(if de { "Rückgängig" } else { "Undo" }))?,
            &PredefinedMenuItem::redo(app, Some(if de { "Wiederholen" } else { "Redo" }))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, Some(if de { "Ausschneiden" } else { "Cut" }))?,
            &PredefinedMenuItem::copy(app, Some(if de { "Kopieren" } else { "Copy" }))?,
            &PredefinedMenuItem::paste(app, Some(if de { "Einsetzen" } else { "Paste" }))?,
            &PredefinedMenuItem::select_all(app, Some(if de { "Alles auswählen" } else { "Select All" }))?,
        ],
    )?;

    // ── View menu ─────────────────────────────────────────────────────────────
    let view_menu = Submenu::with_items(
        app,
        if de { "Darstellung" } else { "View" },
        true,
        &[
            &PredefinedMenuItem::fullscreen(app, Some(if de { "Vollbild ein/aus" } else { "Toggle Full Screen" }))?,
        ],
    )?;

    // ── Window menu ───────────────────────────────────────────────────────────
    let window_menu = Submenu::with_items(
        app,
        if de { "Fenster" } else { "Window" },
        true,
        &[
            &PredefinedMenuItem::minimize(app, Some(if de { "Im Dock ablegen" } else { "Minimize" }))?,
            &PredefinedMenuItem::maximize(app, Some(if de { "Zoomen" } else { "Zoom" }))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::close_window(app, Some(if de { "Fenster schließen" } else { "Close Window" }))?,
        ],
    )?;

    Menu::with_items(app, &[&app_menu, &edit_menu, &view_menu, &window_menu])
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![app_target])
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            let menu = build_menu(app.handle())?;
            app.set_menu(menu)?;

            // Listen for menu events
            let handle = app.handle().clone();
            app.on_menu_event(move |_app, event| {
                if event.id() == "check-updates" {
                    let _ = handle.emit("menu:check-updates", ());
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
