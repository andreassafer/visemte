fn main() {
    // Expose the build number from package.json as a compile-time env var.
    // Matches  "build": "260417"  but not  "beforeBuildCommand": ...
    let pkg = std::fs::read_to_string("../package.json").unwrap_or_default();
    let build_number = pkg
        .lines()
        .find(|l| {
            let t = l.trim();
            t.starts_with("\"build\"") && !t.contains("Command")
        })
        .and_then(|l| l.split('"').nth(3))
        .unwrap_or("0");
    println!("cargo:rustc-env=APP_BUILD={build_number}");
    println!("cargo:rerun-if-changed=../package.json");

    // Derive a human-readable target label from the Rust target triple.
    let target = std::env::var("TARGET").unwrap_or_default();
    let app_target = if target.contains("universal-apple-darwin") {
        "macOS · universal"
    } else if target.contains("aarch64-apple-darwin") {
        "macOS · aarch64"
    } else if target.contains("x86_64-apple-darwin") {
        "macOS · x86_64"
    } else if target.contains("aarch64-pc-windows") {
        "Windows · arm64"
    } else if target.contains("x86_64-pc-windows") {
        "Windows · x64"
    } else if target.contains("aarch64-unknown-linux") {
        "Linux · arm64"
    } else if target.contains("x86_64-unknown-linux") {
        "Linux · amd64"
    } else {
        &target
    };
    println!("cargo:rustc-env=APP_TARGET={app_target}");

    tauri_build::build()
}
