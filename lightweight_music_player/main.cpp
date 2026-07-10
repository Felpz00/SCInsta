#include <windows.h>
#include <commdlg.h>
#include <shlobj.h>
#include <string>
#include <vector>
#include <fstream>
#include <mmsystem.h>

#define ID_BTN_OPEN_FILE  101
#define ID_BTN_OPEN_FOLDER 102
#define ID_BTN_OPEN_M3U   103
#define ID_BTN_PLAY       104
#define ID_BTN_PAUSE      105
#define ID_BTN_STOP       106
#define ID_BTN_NEXT       107
#define ID_BTN_PREV       108

HWND hwndBtnOpenFile;
HWND hwndBtnOpenFolder;
HWND hwndBtnOpenM3u;
HWND hwndBtnPlay;
HWND hwndBtnPause;
HWND hwndBtnStop;
HWND hwndBtnNext;
HWND hwndBtnPrev;
HWND hwndLabel;

std::vector<std::string> playlist;
size_t currentIndex = 0;
bool isPlaying = false;

void UpdateLabel(bool success) {
    if (playlist.empty()) {
        SetWindowTextA(hwndLabel, "No playlist loaded");
    } else {
        std::string status = success ? "Playing" : "Error playing";
        std::string labelText = status + " (" + std::to_string(currentIndex + 1) + "/" + std::to_string(playlist.size()) + "): " + playlist[currentIndex];
        // simple truncation for display
        if (labelText.length() > 60) {
            labelText = labelText.substr(0, 57) + "...";
        }
        SetWindowTextA(hwndLabel, labelText.c_str());
    }
}

void StopMedia() {
    mciSendStringA("close myaudio", NULL, 0, NULL);
    isPlaying = false;
}

void PlayMedia() {
    if (playlist.empty() || currentIndex >= playlist.size()) return;

    StopMedia();

    // Use quotes instead of GetShortPathName to handle spaces securely
    std::string openCmd = "open \"" + playlist[currentIndex] + "\" type mpegvideo alias myaudio";
    MCIERROR openErr = mciSendStringA(openCmd.c_str(), NULL, 0, NULL);

    if (openErr != 0) {
        // Fallback without type constraint
        openCmd = "open \"" + playlist[currentIndex] + "\" alias myaudio";
        openErr = mciSendStringA(openCmd.c_str(), NULL, 0, NULL);
    }

    if (openErr == 0) {
        MCIERROR playErr = mciSendStringA("play myaudio", NULL, 0, NULL);
        if (playErr == 0) {
            isPlaying = true;
            UpdateLabel(true);
        } else {
            UpdateLabel(false);
        }
    } else {
        UpdateLabel(false);
    }
}

void PauseMedia() {
    if (isPlaying) {
        mciSendStringA("pause myaudio", NULL, 0, NULL);
        isPlaying = false;
    } else {
        mciSendStringA("resume myaudio", NULL, 0, NULL);
        isPlaying = true;
    }
}

void NextMedia() {
    if (playlist.empty()) return;
    currentIndex = (currentIndex + 1) % playlist.size();
    PlayMedia();
}

void PrevMedia() {
    if (playlist.empty()) return;
    if (currentIndex == 0) {
        currentIndex = playlist.size() - 1;
    } else {
        currentIndex--;
    }
    PlayMedia();
}

void OpenFile(HWND hwnd) {
    OPENFILENAMEA ofn;
    char szFile[MAX_PATH];
    ZeroMemory(&ofn, sizeof(ofn));
    ofn.lStructSize = sizeof(ofn);
    ofn.hwndOwner = hwnd;
    ofn.lpstrFile = szFile;
    ofn.lpstrFile[0] = '\0';
    ofn.nMaxFile = sizeof(szFile);
    ofn.lpstrFilter = "Audio Files\0*.mp3;*.wav;*.wma\0All\0*.*\0";
    ofn.nFilterIndex = 1;
    ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST;

    if (GetOpenFileNameA(&ofn) == TRUE) {
        playlist.clear();
        playlist.push_back(ofn.lpstrFile);
        currentIndex = 0;
        PlayMedia();
    }
}

int CALLBACK BrowseCallbackProc(HWND hwnd, UINT uMsg, LPARAM lParam, LPARAM lpData) {
    if (uMsg == BFFM_INITIALIZED) {
        SendMessage(hwnd, BFFM_SETSELECTION, TRUE, lpData);
    }
    return 0;
}

void OpenFolder(HWND hwnd) {
    BROWSEINFOA bi = {0};
    bi.hwndOwner = hwnd;
    bi.lpszTitle = "Select Album/Folder containing music:";
    bi.ulFlags = BIF_RETURNONLYFSDIRS | BIF_NEWDIALOGSTYLE;

    LPITEMIDLIST pidl = SHBrowseForFolderA(&bi);
    if (pidl != 0) {
        char path[MAX_PATH];
        if (SHGetPathFromIDListA(pidl, path)) {
            std::string searchPath = std::string(path) + "\\*";
            WIN32_FIND_DATAA findData;
            HANDLE hFind = FindFirstFileA(searchPath.c_str(), &findData);

            if (hFind != INVALID_HANDLE_VALUE) {
                playlist.clear();
                do {
                    if (!(findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)) {
                        std::string filename = findData.cFileName;
                        // Basic extension check
                        if (filename.find(".mp3") != std::string::npos ||
                            filename.find(".wav") != std::string::npos ||
                            filename.find(".wma") != std::string::npos) {
                            playlist.push_back(std::string(path) + "\\" + filename);
                        }
                    }
                } while (FindNextFileA(hFind, &findData) != 0);
                FindClose(hFind);

                if (!playlist.empty()) {
                    currentIndex = 0;
                    PlayMedia();
                } else {
                    MessageBoxA(hwnd, "No supported audio files found in the selected folder.", "Info", MB_OK);
                }
            }
        }
        CoTaskMemFree(pidl);
    }
}

void OpenM3U(HWND hwnd) {
    OPENFILENAMEA ofn;
    char szFile[MAX_PATH];
    ZeroMemory(&ofn, sizeof(ofn));
    ofn.lStructSize = sizeof(ofn);
    ofn.hwndOwner = hwnd;
    ofn.lpstrFile = szFile;
    ofn.lpstrFile[0] = '\0';
    ofn.nMaxFile = sizeof(szFile);
    ofn.lpstrFilter = "Playlist Files\0*.m3u;*.m3u8\0All\0*.*\0";
    ofn.nFilterIndex = 1;
    ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST;

    if (GetOpenFileNameA(&ofn) == TRUE) {
        std::ifstream file(ofn.lpstrFile);
        std::string line;
        std::vector<std::string> tempPlaylist;

        // Very basic m3u parser
        while (std::getline(file, line)) {
            if (!line.empty() && line[0] != '#') {
                // If it's a relative path, might need more complex parsing. Assuming absolute for simplicity in this lightweight player.
                tempPlaylist.push_back(line);
            }
        }

        if (!tempPlaylist.empty()) {
            playlist = tempPlaylist;
            currentIndex = 0;
            PlayMedia();
        } else {
            MessageBoxA(hwnd, "Empty or invalid playlist file.", "Info", MB_OK);
        }
    }
}


LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
        case WM_CREATE:
            {
                HFONT hFont = (HFONT)GetStockObject(DEFAULT_GUI_FONT);

                hwndLabel = CreateWindowA("STATIC", "No file loaded",
                                          WS_VISIBLE | WS_CHILD | SS_CENTER,
                                          10, 10, 460, 20,
                                          hwnd, NULL, NULL, NULL);
                SendMessage(hwndLabel, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnOpenFile = CreateWindowA("BUTTON", "Load File",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            10, 40, 80, 30,
                                            hwnd, (HMENU)ID_BTN_OPEN_FILE, NULL, NULL);
                SendMessage(hwndBtnOpenFile, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnOpenFolder = CreateWindowA("BUTTON", "Load Album",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            100, 40, 80, 30,
                                            hwnd, (HMENU)ID_BTN_OPEN_FOLDER, NULL, NULL);
                SendMessage(hwndBtnOpenFolder, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnOpenM3u = CreateWindowA("BUTTON", "Load M3U",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            190, 40, 80, 30,
                                            hwnd, (HMENU)ID_BTN_OPEN_M3U, NULL, NULL);
                SendMessage(hwndBtnOpenM3u, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnPrev = CreateWindowA("BUTTON", "<< Prev",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            10, 80, 70, 30,
                                            hwnd, (HMENU)ID_BTN_PREV, NULL, NULL);
                SendMessage(hwndBtnPrev, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnPlay = CreateWindowA("BUTTON", "Play",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            90, 80, 70, 30,
                                            hwnd, (HMENU)ID_BTN_PLAY, NULL, NULL);
                SendMessage(hwndBtnPlay, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnPause = CreateWindowA("BUTTON", "Pause/Res",
                                             WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                             170, 80, 70, 30,
                                             hwnd, (HMENU)ID_BTN_PAUSE, NULL, NULL);
                SendMessage(hwndBtnPause, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnStop = CreateWindowA("BUTTON", "Stop",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            250, 80, 70, 30,
                                            hwnd, (HMENU)ID_BTN_STOP, NULL, NULL);
                SendMessage(hwndBtnStop, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnNext = CreateWindowA("BUTTON", "Next >>",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            330, 80, 70, 30,
                                            hwnd, (HMENU)ID_BTN_NEXT, NULL, NULL);
                SendMessage(hwndBtnNext, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));
            }
            break;

        case WM_COMMAND:
            if (LOWORD(wParam) == ID_BTN_OPEN_FILE) {
                OpenFile(hwnd);
            }
            else if (LOWORD(wParam) == ID_BTN_OPEN_FOLDER) {
                OpenFolder(hwnd);
            }
            else if (LOWORD(wParam) == ID_BTN_OPEN_M3U) {
                OpenM3U(hwnd);
            }
            else if (LOWORD(wParam) == ID_BTN_PLAY) {
                PlayMedia();
            }
            else if (LOWORD(wParam) == ID_BTN_PAUSE) {
                PauseMedia();
            }
            else if (LOWORD(wParam) == ID_BTN_STOP) {
                StopMedia();
                if (!playlist.empty()) {
                    SetWindowTextA(hwndLabel, ("Stopped: " + playlist[currentIndex]).c_str());
                }
            }
            else if (LOWORD(wParam) == ID_BTN_NEXT) {
                NextMedia();
            }
            else if (LOWORD(wParam) == ID_BTN_PREV) {
                PrevMedia();
            }
            break;

        case WM_DESTROY:
            StopMedia();
            PostQuitMessage(0);
            break;
    }
    return DefWindowProcA(hwnd, msg, wParam, lParam);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    // Initialize COM for SHBrowseForFolder
    CoInitialize(NULL);

    WNDCLASSA wc = {0};
    wc.lpfnWndProc = WndProc;
    wc.hInstance = hInstance;
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wc.lpszClassName = "LightweightPlayerClass";

    if (!RegisterClassA(&wc)) {
        return -1;
    }

    HWND hwnd = CreateWindowA("LightweightPlayerClass", "Lightweight Music Player",
                              WS_OVERLAPPEDWINDOW ^ WS_THICKFRAME ^ WS_MAXIMIZEBOX,
                              CW_USEDEFAULT, CW_USEDEFAULT, 500, 160,
                              NULL, NULL, hInstance, NULL);

    if (hwnd == NULL) {
        return -1;
    }

    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);

    MSG msg = {0};
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    CoUninitialize();

    return 0;
}
