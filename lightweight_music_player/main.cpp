#include <windows.h>
#include <commdlg.h>
#include <string>
#include <mmsystem.h>

#define ID_BTN_OPEN  101
#define ID_BTN_PLAY  102
#define ID_BTN_PAUSE 103
#define ID_BTN_STOP  104

HWND hwndBtnOpen;
HWND hwndBtnPlay;
HWND hwndBtnPause;
HWND hwndBtnStop;
HWND hwndLabel;

std::string currentFilePath = "";

void OpenFile(HWND hwnd) {
    OPENFILENAMEA ofn;
    char szFile[260];
    char szFileTitle[260];
    ZeroMemory(&ofn, sizeof(ofn));
    ofn.lStructSize = sizeof(ofn);
    ofn.hwndOwner = hwnd;
    ofn.lpstrFile = szFile;
    ofn.lpstrFile[0] = '\0';
    ofn.nMaxFile = sizeof(szFile);
    ofn.lpstrFilter = "Audio Files\0*.mp3;*.wav\0All\0*.*\0";
    ofn.nFilterIndex = 1;
    ofn.lpstrFileTitle = szFileTitle;
    ofn.lpstrFileTitle[0] = '\0';
    ofn.nMaxFileTitle = sizeof(szFileTitle);
    ofn.lpstrInitialDir = NULL;
    ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST;

    if (GetOpenFileNameA(&ofn) == TRUE) {
        currentFilePath = ofn.lpstrFile;
        // Close any currently playing media
        mciSendStringA("close myaudio", NULL, 0, NULL);

        // Open the new media file
        std::string openCmd = "open \"" + currentFilePath + "\" type mpegvideo alias myaudio";
        mciSendStringA(openCmd.c_str(), NULL, 0, NULL);

        // Update label
        std::string labelText = "Loaded: " + std::string(ofn.lpstrFileTitle ? ofn.lpstrFileTitle : ofn.lpstrFile);
        SetWindowTextA(hwndLabel, labelText.c_str());
    }
}

void PlayMedia() {
    if (!currentFilePath.empty()) {
        mciSendStringA("play myaudio", NULL, 0, NULL);
    }
}

void PauseMedia() {
    if (!currentFilePath.empty()) {
        mciSendStringA("pause myaudio", NULL, 0, NULL);
    }
}

void StopMedia() {
    if (!currentFilePath.empty()) {
        mciSendStringA("stop myaudio", NULL, 0, NULL);
        mciSendStringA("seek myaudio to start", NULL, 0, NULL);
    }
}

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
        case WM_CREATE:
            {
                HFONT hFont = (HFONT)GetStockObject(DEFAULT_GUI_FONT);

                hwndLabel = CreateWindowA("STATIC", "No file loaded",
                                          WS_VISIBLE | WS_CHILD | SS_CENTER,
                                          20, 20, 340, 20,
                                          hwnd, NULL, NULL, NULL);
                SendMessage(hwndLabel, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnOpen = CreateWindowA("BUTTON", "Open File",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            20, 60, 80, 30,
                                            hwnd, (HMENU)ID_BTN_OPEN, NULL, NULL);
                SendMessage(hwndBtnOpen, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnPlay = CreateWindowA("BUTTON", "Play",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            105, 60, 80, 30,
                                            hwnd, (HMENU)ID_BTN_PLAY, NULL, NULL);
                SendMessage(hwndBtnPlay, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnPause = CreateWindowA("BUTTON", "Pause",
                                             WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                             190, 60, 80, 30,
                                             hwnd, (HMENU)ID_BTN_PAUSE, NULL, NULL);
                SendMessage(hwndBtnPause, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));

                hwndBtnStop = CreateWindowA("BUTTON", "Stop",
                                            WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                                            275, 60, 80, 30,
                                            hwnd, (HMENU)ID_BTN_STOP, NULL, NULL);
                SendMessage(hwndBtnStop, WM_SETFONT, (WPARAM)hFont, MAKELPARAM(TRUE, 0));
            }
            break;

        case WM_COMMAND:
            if (LOWORD(wParam) == ID_BTN_OPEN) {
                OpenFile(hwnd);
            }
            else if (LOWORD(wParam) == ID_BTN_PLAY) {
                PlayMedia();
            }
            else if (LOWORD(wParam) == ID_BTN_PAUSE) {
                PauseMedia();
            }
            else if (LOWORD(wParam) == ID_BTN_STOP) {
                StopMedia();
            }
            break;

        case WM_DESTROY:
            mciSendStringA("close myaudio", NULL, 0, NULL);
            PostQuitMessage(0);
            break;
    }
    return DefWindowProcA(hwnd, msg, wParam, lParam);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
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
                              CW_USEDEFAULT, CW_USEDEFAULT, 400, 150,
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

    return 0;
}
