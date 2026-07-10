# Lightweight Music Player

A very lightweight and minimalistic music player for Windows built using raw Win32 API and `mciSendString`.

## Motivation

This music player was built specifically for low resource usage (minimal CPU, RAM, and temperature impact). It is intended to run seamlessly in the background on systems like a gaming notebook (e.g., Acer Nitro 5 with i5-10300H and GTX 1650) without causing lag spikes while playing heavy games such as League of Legends. Normal media players and web browsers can be resource-heavy; this tool provides an extremely lightweight alternative.

## Technical Details

- **Language:** C++
- **Framework:** Win32 API
- **Audio engine:** Windows Multimedia API (`mciSendString` and `winmm.lib`)

By leveraging the raw Win32 API rather than heavy graphical frameworks (like Qt, Electron, or WPF), the application size and memory footprint are kept to an absolute minimum. The `mciSendString` interface handles audio playback efficiently by tapping into native Windows subsystems, adding barely any load to the processor.

## Features

- Basic GUI matching standard Windows look and feel
- Open audio files (`.mp3`, `.wav`)
- Play, Pause, and Stop functions
- Incredibly low memory and CPU overhead

## Building from source

You can compile this on Linux using the MinGW-w64 cross-compiler:

```bash
x86_64-w64-mingw32-g++ main.cpp -o LightweightPlayer.exe -mwindows -lwinmm -lcomdlg32
```
