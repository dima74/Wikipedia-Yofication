#ifndef PARSE_REPLACES_EXCLUSION_H
#define PARSE_REPLACES_EXCLUSION_H

#include <bits/stdc++.h>
#include "string_helper.h"
#include "u16string.h"
using namespace std;

struct ReplacesExclusion {
    static constexpr const char *exclusionsFile = "results/exclusions.txt";
    set<u16string> exclusions;

    ReplacesExclusion() {
        ifstream in(exclusionsFile);
        if (!in) {
            return;
        }
        string dword;
        while (getline(in, dword)) {
            exclusions.insert(to16(dword));
        }
    }

    void exclude(u16string yoword) {
        u16string dword = deefication(yoword);
        assert(exclusions.find(dword) == exclusions.end());
        exclusions.insert(dword);
        ofstream out(exclusionsFile, fstream::app);
        out << dword << endl;
        out.close();
    }
};

#endif //PARSE_REPLACES_EXCLUSION_H
