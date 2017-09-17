#ifndef WIKIPEDIA_EFICATION_BASE_H
#define WIKIPEDIA_EFICATION_BASE_H

#include <bits/stdc++.h>
using namespace std;

int system(string command) {
    return system(command.c_str());
}

void mkdirs(string path) {
    system("mkdir -p " + path);
}

#endif //WIKIPEDIA_EFICATION_BASE_H
