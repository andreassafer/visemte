use tauri::menu::{AboutMetadata, Menu, PredefinedMenuItem, Submenu};

const APP_BUILD:   &str = env!("APP_BUILD");
const APP_TARGET:  &str = env!("APP_TARGET");

#[tauri::command]
fn app_target() -> &'static str {
    APP_TARGET
}

fn build_menu(app: &tauri::AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    // ── Visemte (App-Menü, macOS) ─────────────────────────────────────────────
    let app_menu = Submenu::with_items(
        app,
        "Visemte",
        true,
        &[
            &PredefinedMenuItem::about(
                app,
                Some("Über Visemte"),
                Some(AboutMetadata {
                    version: Some(app.package_info().version.to_string()),
                    short_version: Some(APP_BUILD.to_string()),
                    ..Default::default()
                }),
            )?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::services(app, Some("Dienste"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::hide(app, Some("Visemte ausblenden"))?,
            &PredefinedMenuItem::hide_others(app, Some("Andere ausblenden"))?,
            &PredefinedMenuItem::show_all(app, Some("Alle einblenden"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::quit(app, Some("Visemte beenden"))?,
        ],
    )?;

    // ── Bearbeiten ────────────────────────────────────────────────────────────
    let edit_menu = Submenu::with_items(
        app,
        "Bearbeiten",
        true,
        &[
            &PredefinedMenuItem::undo(app, Some("Rückgängig"))?,
            &PredefinedMenuItem::redo(app, Some("Wiederholen"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, Some("Ausschneiden"))?,
            &PredefinedMenuItem::copy(app, Some("Kopieren"))?,
            &PredefinedMenuItem::paste(app, Some("Einsetzen"))?,
            &PredefinedMenuItem::select_all(app, Some("Alles auswählen"))?,
        ],
    )?;

    // ── Darstellung ───────────────────────────────────────────────────────────
    let view_menu = Submenu::with_items(
        app,
        "Darstellung",
        true,
        &[
            &PredefinedMenuItem::fullscreen(app, Some("Vollbild ein/aus"))?,
        ],
    )?;

    // ── Fenster ───────────────────────────────────────────────────────────────
    let window_menu = Submenu::with_items(
        app,
        "Fenster",
        true,
        &[
            &PredefinedMenuItem::minimize(app, Some("Im Dock ablegen"))?,
            &PredefinedMenuItem::maximize(app, Some("Zoomen"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::close_window(app, Some("Fenster schließen"))?,
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
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
